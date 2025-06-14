import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Copy, Download, FileText, Presentation, HelpCircle, BookOpen, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchTopicById, exportTopic } from '@/lib/api';
import Navigation from '@/components/Navigation';

interface TopicData {
  id: string;
  topic: string;
  type: string;
  created_at: string;
  overview?: string;
  notes?: string;
  slides?: string;
  mcqs?: string[];
}

const TopicDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [topicData, setTopicData] = useState<TopicData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportContentType, setExportContentType] = useState('overview');
  const { toast } = useToast();

  const defaultTab = searchParams.get('tab') === 'export' ? 'export' : 'overview';

  useEffect(() => {
    if (id) {
      loadTopic(id);
    }
  }, [id]);

  const loadTopic = async (topicId: string) => {
    try {
      const data = await fetchTopicById(topicId);
      setTopicData(data);
      // Set default export content type to the first available content
      if (data.overview) setExportContentType('overview');
      else if (data.notes) setExportContentType('notes');
      else if (data.slides) setExportContentType('slides');
      else if (data.mcqs) setExportContentType('mcqs');
    } catch (error) {
      console.error('Failed to fetch topic:', error);
      toast({
        title: "Error",
        description: "Failed to load topic details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content.",
        variant: "destructive",
      });
    }
  };

  const handleExport = async () => {
    if (!id) return;
    
    setIsExporting(true);
    try {
      const response = await exportTopic(id, exportFormat, exportContentType);
      
      // Create download link
      const blob = new Blob([response], { 
        type: exportFormat === 'pdf' ? 'application/pdf' : 'text/plain' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${topicData?.topic || 'study-material'}_${exportContentType}.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success!",
        description: `${exportContentType} exported as ${exportFormat.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export study material. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getAvailableContentTypes = () => {
    if (!topicData) return [];
    const types = [];
    if (topicData.overview) types.push({ value: 'overview', label: 'Overview' });
    if (topicData.notes) types.push({ value: 'notes', label: 'Study Notes' });
    if (topicData.slides) types.push({ value: 'slides', label: 'Slides' });
    if (topicData.mcqs) types.push({ value: 'mcqs', label: 'MCQs' });
    return types;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        </div>
      </div>
    );
  }

  if (!topicData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-16 w-16 text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">
                Topic Not Found
              </h3>
              <p className="text-slate-500 max-w-md mb-6">
                The requested study material could not be found.
              </p>
              <Link to="/dashboard">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {topicData.topic}
          </h1>
          <p className="text-lg text-slate-400">
            Generated on {new Date(topicData.created_at).toLocaleDateString()}
          </p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-slate-700">
                {topicData.overview && (
                  <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:text-white">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Overview
                  </TabsTrigger>
                )}
                {topicData.notes && (
                  <TabsTrigger value="notes" className="text-slate-300 data-[state=active]:text-white">
                    <FileText className="mr-2 h-4 w-4" />
                    Notes
                  </TabsTrigger>
                )}
                {topicData.slides && (
                  <TabsTrigger value="slides" className="text-slate-300 data-[state=active]:text-white">
                    <Presentation className="mr-2 h-4 w-4" />
                    Slides
                  </TabsTrigger>
                )}
                {topicData.mcqs && (
                  <TabsTrigger value="mcqs" className="text-slate-300 data-[state=active]:text-white">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    MCQs
                  </TabsTrigger>
                )}
                <TabsTrigger value="export" className="text-slate-300 data-[state=active]:text-white">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </TabsTrigger>
              </TabsList>
              
              
              
              
              
              {topicData.overview && (
                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white">Overview</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(topicData.overview!)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={topicData.overview}
                      readOnly
                      className="min-h-[400px] bg-slate-700 border-slate-600 text-slate-200 resize-none"
                    />
                  </div>
                </TabsContent>
              )}
              
              {topicData.notes && (
                <TabsContent value="notes" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white">Study Notes</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(topicData.notes!)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={topicData.notes}
                      readOnly
                      className="min-h-[400px] bg-slate-700 border-slate-600 text-slate-200 resize-none"
                    />
                  </div>
                </TabsContent>
              )}
              
              {topicData.slides && (
                <TabsContent value="slides" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white">Presentation Slides</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(topicData.slides!)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={topicData.slides}
                      readOnly
                      className="min-h-[400px] bg-slate-700 border-slate-600 text-slate-200 resize-none"
                    />
                  </div>
                </TabsContent>
              )}
              
              {topicData.mcqs && (
                <TabsContent value="mcqs" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white">MCQ Questions</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(topicData.mcqs!.join('\n\n'))}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy All
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {topicData.mcqs.map((mcq, index) => (
                        <Card key={index} className="bg-slate-700/50 border-slate-600">
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-start">
                              <p className="text-slate-200 whitespace-pre-wrap flex-1">{mcq}</p>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopy(mcq)}
                                className="ml-2 text-slate-400 hover:text-white"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}
              
              <TabsContent value="export" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Export Study Material</h3>
                    <p className="text-slate-400 mb-6">
                      Download your study materials in your preferred format.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Content Type
                      </label>
                      <Select value={exportContentType} onValueChange={setExportContentType}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {getAvailableContentTypes().map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Format
                      </label>
                      <Select value={exportFormat} onValueChange={setExportFormat}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="md">Markdown</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                          <SelectItem value="txt">Plain Text</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Export {exportContentType} as {exportFormat.toUpperCase()}
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TopicDetails;
