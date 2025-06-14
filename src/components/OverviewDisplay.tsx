
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Target, Lightbulb, Zap, Info } from 'lucide-react';
import { NotesSection } from '@/utils/markdownParser';
import ExportButton from './ExportButton';

interface OverviewDisplayProps {
  sections: NotesSection[];
}

const OverviewDisplay = ({ sections }: OverviewDisplayProps) => {
  const getIconForSection = (title: string) => {
    const lowercaseTitle = title.toLowerCase();
    
    if (lowercaseTitle.includes('introduction') || lowercaseTitle.includes('overview')) {
      return <BookOpen className="h-5 w-5 text-blue-500" />;
    }
    if (lowercaseTitle.includes('application') || lowercaseTitle.includes('use')) {
      return <Target className="h-5 w-5 text-green-500" />;
    }
    if (lowercaseTitle.includes('concept') || lowercaseTitle.includes('key')) {
      return <Lightbulb className="h-5 w-5 text-yellow-500" />;
    }
    if (lowercaseTitle.includes('advantage') || lowercaseTitle.includes('benefit')) {
      return <Zap className="h-5 w-5 text-purple-500" />;
    }
    
    return <Info className="h-5 w-5 text-blue-500" />;
  };

  if (sections.length === 0) return null;

  // Convert sections to text for export
  const exportContent = sections.map(section => {
    let content = `# ${section.title}\n\n${section.content || ''}\n\n`;
    if (section.subsections && section.subsections.length > 0) {
      section.subsections.forEach(subsection => {
        content += `## ${subsection.title}\n\n${subsection.content}\n\n`;
      });
    }
    return content;
  }).join('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
        <ExportButton 
          content={exportContent}
          fileName="overview"
          contentType="overview"
        />
      </div>
      
      {sections.map((section, index) => (
        <Card
          key={section.id}
          className="shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300 animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              {getIconForSection(section.title)}
              <span className="ml-3">{section.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded border-l-4 border-blue-500">
              {section.content}
            </div>
            
            {section.subsections && section.subsections.length > 0 && (
              <div className="mt-6 space-y-4">
                {section.subsections.map((subsection) => (
                  <div key={subsection.id} className="border-l-4 border-orange-400 pl-4 bg-orange-50 p-4 rounded">
                    <h4 className="font-medium text-orange-600 mb-3">
                      {subsection.title}
                    </h4>
                    <div className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                      {subsection.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OverviewDisplay;
