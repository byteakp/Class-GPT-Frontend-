
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Presentation, ArrowLeft, ArrowRight } from 'lucide-react';
import { Slide } from '@/utils/markdownParser';
import ExportButton from './ExportButton';

interface SlideDeckProps {
  slides: Slide[];
}

const SlideDeck = ({ slides }: SlideDeckProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSlide = slides[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (event.key === 'ArrowRight' && currentIndex < slides.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, slides.length]);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!currentSlide) return null;

  // Convert slides to text for export
  const exportContent = slides.map((slide, index) => {
    const content = `# Slide ${index + 1}: ${slide.title}\n\n${slide.content.map(item => `- ${item}`).join('\n')}\n\n`;
    return content;
  }).join('');

  return (
    <div className="space-y-6">
      {/* Export Button */}
      <div className="flex justify-end">
        <ExportButton 
          content={exportContent}
          fileName="presentation_slides"
          contentType="slides"
        />
      </div>

      {/* Slide Frame */}
      <Card className="shadow-lg border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold flex items-center">
              <Presentation className="mr-3 h-6 w-6" />
              <div className="space-y-1">
                <div className="text-lg">📊 {currentSlide.title}</div>
                <div className="text-blue-100 text-sm font-normal">
                  Slide {currentIndex + 1} of {slides.length}
                </div>
              </div>
            </CardTitle>
            <div className="text-sm bg-blue-500/30 px-4 py-2 rounded-full border border-blue-300">
              {currentIndex + 1} / {slides.length}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 bg-white rounded-b-lg min-h-[400px]">
          <div className="space-y-6 animate-fade-in" key={currentIndex}>
            {currentSlide.content.map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/50 border-l-4 border-blue-500 hover:shadow-md transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
                </div>
                <div className="flex-1">
                  <div className="text-gray-800 leading-relaxed text-lg">
                    {item.split(':').map((part, i) => (
                      <span key={i}>
                        {i === 0 && item.includes(':') ? (
                          <span className="font-bold text-blue-700">⚛️ {part}:</span>
                        ) : (
                          <span className={i === 0 ? 'text-gray-700' : 'text-gray-600 ml-1'}>{part}</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Navigation */}
      <Card className="shadow-md bg-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center space-x-2 px-6 py-3 h-auto hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            {/* Slide Thumbnails/Dots */}
            <div className="flex space-x-3 items-center">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="group relative cursor-pointer"
                  onClick={() => setCurrentIndex(index)}
                >
                  <button
                    className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${
                      index === currentIndex 
                        ? 'bg-blue-500 shadow-lg scale-125' 
                        : 'bg-gray-300 hover:bg-blue-300'
                    }`}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-gray-800 text-white text-xs px-3 py-1 rounded whitespace-nowrap">
                      {slide.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentIndex === slides.length - 1}
              className="flex items-center space-x-2 px-6 py-3 h-auto hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Keyboard hints */}
          <div className="flex justify-center mt-4 text-xs text-gray-500 space-x-6">
            <span className="flex items-center space-x-1">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">←</kbd>
              <span>Previous</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">→</kbd>
              <span>Next</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SlideDeck;
