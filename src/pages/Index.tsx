
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, BookOpen, FileText, Download, Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-black" />
              <span className="text-xl font-bold text-black">ClassGPT</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/generate">
                <Button variant="ghost" className="text-black hover:text-gray-600 hover:bg-gray-100">
                  Generate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Brain className="h-20 w-20 text-black" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 tracking-tight">
              ClassGPT
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform any topic into comprehensive study materials with AI. 
              Generate notes, slides, MCQs, and overviews in seconds.
            </p>
            <div className="flex justify-center">
              <Link to="/generate">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Generating
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Everything you need to study smarter
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate comprehensive study materials from any topic with our AI-powered platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-black mb-2" />
              <CardTitle className="text-black">Study Notes</CardTitle>
              <CardDescription className="text-gray-600">
                Comprehensive notes with key concepts and explanations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <FileText className="h-8 w-8 text-black mb-2" />
              <CardTitle className="text-black">Presentation Slides</CardTitle>
              <CardDescription className="text-gray-600">
                Ready-to-use slides for presentations and lectures
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <Brain className="h-8 w-8 text-black mb-2" />
              <CardTitle className="text-black">MCQ Questions</CardTitle>
              <CardDescription className="text-gray-600">
                Multiple choice questions to test your knowledge
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <Download className="h-8 w-8 text-black mb-2" />
              <CardTitle className="text-black">Export Options</CardTitle>
              <CardDescription className="text-gray-600">
                Download in PDF, Markdown, HTML, or plain text
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 ClassGPT. Powered by AI for better learning.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
