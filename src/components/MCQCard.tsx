
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Lightbulb, ChevronLeft, ChevronRight, HelpCircle, Target } from 'lucide-react';
import { MCQ } from '@/utils/markdownParser';

interface MCQCardProps {
  mcqs: MCQ[];
}

const MCQCard = ({ mcqs }: MCQCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState(false);

  const currentMCQ = mcqs[currentIndex];

  // Reset when changing questions
  useEffect(() => {
    setSelectedAnswer('');
    setShowAnswer(false);
  }, [currentIndex]);

  const handleAnswerSubmit = () => {
    if (selectedAnswer) {
      setShowAnswer(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < mcqs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getOptionLetter = (index: number) => String.fromCharCode(65 + index);

  const isCorrect = selectedAnswer === currentMCQ.correctAnswer.charAt(0);

  if (!currentMCQ) return null;

  return (
    <div className="space-y-6">
      {/* Question Card */}
      <Card className="shadow-lg border-2 border-purple-100 bg-white">
        <CardHeader className="border-b bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Target className="mr-3 h-6 w-6" />
              <div className="space-y-1">
                <div className="text-lg">Quiz Question</div>
                <div className="text-purple-100 text-sm font-normal">
                  Question {currentIndex + 1} of {mcqs.length}
                </div>
              </div>
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="bg-purple-500/20 border-purple-300 text-white hover:bg-purple-400/30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentIndex === mcqs.length - 1}
                className="bg-purple-500/20 border-purple-300 text-white hover:bg-purple-400/30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 bg-white space-y-8">
          {/* Question */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-l-4 border-purple-500">
            <div className="flex items-start space-x-3">
              <HelpCircle className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <div className="text-gray-800 font-medium text-lg leading-relaxed">
                {currentMCQ.question}
              </div>
            </div>
          </div>

          {/* Options */}
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            disabled={showAnswer}
            className="space-y-4"
          >
            {currentMCQ.options.map((option, index) => {
              const letter = getOptionLetter(index);
              const isSelected = selectedAnswer === letter;
              const isCorrectOption = currentMCQ.correctAnswer.charAt(0) === letter;
              
              let optionClass = "p-5 rounded-xl border-2 cursor-pointer transition-all duration-300";
              
              if (showAnswer) {
                if (isCorrectOption) {
                  optionClass += " bg-green-100 border-green-500";
                } else if (isSelected && !isCorrectOption) {
                  optionClass += " bg-red-100 border-red-500";
                } else {
                  optionClass += " bg-gray-50 border-gray-300";
                }
              } else if (isSelected) {
                optionClass += " bg-purple-100 border-purple-500";
              } else {
                optionClass += " bg-white border-gray-300 hover:bg-purple-50 hover:border-purple-300";
              }

              return (
                <div key={index} className={optionClass}>
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value={letter} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <span className="font-bold text-purple-600 text-lg">{letter})</span>
                        <span className="text-gray-700 text-lg leading-relaxed">
                          {option.replace(/^[A-D]\)\s*/, '')}
                        </span>
                      </div>
                    </Label>
                    {showAnswer && isCorrectOption && (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    )}
                    {showAnswer && isSelected && !isCorrectOption && (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </RadioGroup>

          {/* Submit Button */}
          {!showAnswer && (
            <Button
              onClick={handleAnswerSubmit}
              disabled={!selectedAnswer}
              className="w-full py-4 text-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              Submit Answer
            </Button>
          )}

          {/* Answer Feedback */}
          {showAnswer && (
            <div className="space-y-6">
              <div className={`p-6 rounded-xl border-2 ${isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'}`}>
                <div className="flex items-center gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                  <span className={`font-bold text-lg ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <div className="text-gray-700 text-lg">
                  <span className="font-medium">Correct answer:</span> {currentMCQ.correctAnswer}
                </div>
              </div>
              
              {currentMCQ.explanation && (
                <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Lightbulb className="h-6 w-6 text-yellow-500" />
                    <span className="font-bold text-yellow-700 text-lg">Explanation</span>
                  </div>
                  <div className="text-gray-700 leading-relaxed">
                    {currentMCQ.explanation}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MCQCard;
