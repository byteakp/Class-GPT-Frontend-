import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Loader2, FileText, Presentation, HelpCircle, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateStudyMaterial, fetchTopics } from '@/lib/api';
import { parseMCQs, parseSlides, parseNotes } from '@/utils/markdownParser';
import Navigation from '@/components/Navigation';
import MCQCard from '@/components/MCQCard';
import SlideDeck from '@/components/SlideDeck';
import StudyNotes from '@/components/StudyNotes';
import OverviewDisplay from '@/components/OverviewDisplay';
import AutoResizeTextarea from '@/components/AutoResizeTextarea';
import GenerationSkeleton from '@/components/GenerationSkeleton';

interface GeneratedContent {
  overview?: string;
  notes?: string;
  slides?: string;
  mcqs?: string;
}

interface Topic {
  id: string;
  topic: string;
  type: string;
  created_at: string;
}

const Generate = () => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate study materials.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setGeneratedContent(null);
    setLastError(null);
    
    try {
      console.log('Starting generation process...');
      const response = await generateStudyMaterial(topic, type);
      console.log('API Response:', response);
      
      const content = response.data?.generated || response.generated || response;
      console.log('Extracted content:', content);
      
      // Clean up the content and ensure proper structure
      const cleanedContent = {
        overview: content.overview || '',
        notes: content.notes || '',
        slides: content.slides || '',
        mcqs: content.mcqs || ''
      };
      
      setGeneratedContent(cleanedContent);
      
      try {
        const updatedTopics = await fetchTopics();
        setTopics(updatedTopics);
      } catch (topicError) {
        console.warn('Failed to fetch updated topics:', topicError);
        // Don't fail the whole operation for this
      }
      
      toast({
        title: "Success! 🎉",
        description: "Study materials generated successfully.",
      });
    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setLastError(errorMessage);
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Parse the generated content with improved error handling
  const parsedMCQs = generatedContent?.mcqs ? parseMCQs(generatedContent.mcqs) : [];
  const parsedSlides = generatedContent?.slides ? parseSlides(generatedContent.slides) : [];
  const parsedNotes = generatedContent?.notes ? parseNotes(generatedContent.notes) : [];
  const parsedOverview = generatedContent?.overview ? parseNotes(generatedContent.overview) : [];

  // Determine which tabs to show
  const availableTabs = [];
  if (parsedOverview.length > 0) availableTabs.push('overview');
  if (parsedNotes.length > 0) availableTabs.push('notes');
  if (parsedSlides.length > 0) availableTabs.push('slides');
  if (parsedMCQs.length > 0) availableTabs.push('mcqs');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Generate Study Materials
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter any topic and let ClassGPT create comprehensive study materials tailored to your learning needs
          </p>
          {lastError && (
            <div className="mt-4 max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">
                  <strong>Service temporarily unavailable:</strong> {lastError}
                </p>
                <p className="text-red-600 text-xs mt-2">
                  The AI service is experiencing high demand. Please try again in a few moments.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-2 border-pink-100 bg-white/80 backdrop-blur-sm sticky top-8">
              <CardHeader className="border-b bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-white flex items-center text-xl">
                  <div className="relative mr-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center animate-bounce">
                      <span className="text-pink-500 text-lg">✨</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                  🌸 ClassGPT
                </CardTitle>
                <CardDescription className="text-pink-100">
                  Your kawaii AI study companion ♡
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-3">
                  <Label htmlFor="topic" className="text-gray-700 font-medium">📝 Topic or Subject</Label>
                  <AutoResizeTextarea
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Quantum Computing fundamentals, World War II causes and effects, Machine Learning algorithms..."
                    className="focus:border-pink-500 focus:ring-pink-500/20"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500">💡 Tip: Be specific for better results</p>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-gray-700 font-medium">📚 Content Type</Label>
                  <Select value={type} onValueChange={setType} disabled={isLoading}>
                    <SelectTrigger className="focus:border-pink-500 focus:ring-pink-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">🎯 All Materials (Recommended)</SelectItem>
                      <SelectItem value="overview">📖 Overview Only</SelectItem>
                      <SelectItem value="notes">📝 Study Notes</SelectItem>
                      <SelectItem value="slides">🖼️ Presentation Slides</SelectItem>
                      <SelectItem value="mcqs">❓ MCQ Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isLoading || !topic.trim()}
                  className="w-full py-4 text-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="relative mr-3">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center animate-spin">
                          <span className="text-white text-sm">♡</span>
                        </div>
                      </div>
                      ✨ Creating Magic...
                    </>
                  ) : (
                    <>
                      <div className="mr-3 text-xl animate-pulse">🌟</div>
                      🚀 Generate Materials
                    </>
                  )}
                </Button>
                
                {isLoading && (
                  <div className="text-center space-y-2 animate-fade-in">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0ms' }}>
                        <span className="text-pink-500">♡</span>
                      </div>
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '150ms' }}>
                        <span className="text-purple-500">✨</span>
                      </div>
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '300ms' }}>
                        <span className="text-pink-500">🌸</span>
                      </div>
                    </div>
                    <p className="text-sm text-pink-600">ClassGPT is thinking... (◕‿◕)♡</p>
                    <div className="w-full bg-pink-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-pink-400 to-purple-500 h-2 rounded-full animate-pulse w-3/4"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">This may take 30-60 seconds...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <GenerationSkeleton />
            ) : generatedContent && availableTabs.length > 0 ? (
              <Card className="shadow-xl border-2 border-gray-100 bg-white/90 backdrop-blur-sm animate-fade-in">
                <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-pink-50">
                  <CardTitle className="text-pink-700 flex items-center text-xl">
                    <span className="mr-2 text-2xl animate-pulse">🌸</span>
                    Generated Study Materials
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    <span className="font-medium">📚 Topic:</span> {topic}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs defaultValue={availableTabs[0]} className="w-full">
                    <TabsList className="grid w-full bg-gray-100 rounded-xl p-1" style={{ gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)` }}>
                      {availableTabs.includes('overview') && (
                        <TabsTrigger value="overview" className="rounded-lg font-medium">
                          <BookOpen className="mr-2 h-4 w-4" />
                          📖 Overview
                        </TabsTrigger>
                      )}
                      {availableTabs.includes('notes') && (
                        <TabsTrigger value="notes" className="rounded-lg font-medium">
                          <FileText className="mr-2 h-4 w-4" />
                          📝 Notes
                        </TabsTrigger>
                      )}
                      {availableTabs.includes('slides') && (
                        <TabsTrigger value="slides" className="rounded-lg font-medium">
                          <Presentation className="mr-2 h-4 w-4" />
                          🖼️ Slides
                        </TabsTrigger>
                      )}
                      {availableTabs.includes('mcqs') && (
                        <TabsTrigger value="mcqs" className="rounded-lg font-medium">
                          <HelpCircle className="mr-2 h-4 w-4" />
                          🎯 MCQs
                        </TabsTrigger>
                      )}
                    </TabsList>
                    
                    {availableTabs.includes('overview') && (
                      <TabsContent value="overview" className="mt-6">
                        <OverviewDisplay sections={parsedOverview} />
                      </TabsContent>
                    )}
                    
                    {availableTabs.includes('notes') && (
                      <TabsContent value="notes" className="mt-6">
                        <StudyNotes sections={parsedNotes} />
                      </TabsContent>
                    )}
                    
                    {availableTabs.includes('slides') && (
                      <TabsContent value="slides" className="mt-6">
                        <SlideDeck slides={parsedSlides} />
                      </TabsContent>
                    )}
                    
                    {availableTabs.includes('mcqs') && (
                      <TabsContent value="mcqs" className="mt-6">
                        <MCQCard mcqs={parsedMCQs} />
                      </TabsContent>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-xl border-2 border-gray-100 bg-white/90 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center animate-bounce">
                      <span className="text-white text-3xl">🌸</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-white text-lg">✨</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      🚀 Ready to Generate
                    </h3>
                    <p className="text-gray-600 max-w-md leading-relaxed">
                      Enter a topic and select the type of study materials you'd like to generate. 
                      ClassGPT will create comprehensive, tailored content to enhance your learning experience ♡
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span>📖</span><span>Detailed overviews</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🖼️</span><span>Interactive slides</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>📝</span><span>Study notes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🎯</span><span>Practice quizzes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;
