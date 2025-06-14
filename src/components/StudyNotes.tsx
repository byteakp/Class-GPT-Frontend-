
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { NotesSection } from '@/utils/markdownParser';
import ExportButton from './ExportButton';

interface StudyNotesProps {
  sections: NotesSection[];
}

const StudyNotes = ({ sections }: StudyNotesProps) => {
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
    <Card className="shadow-lg">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-blue-600 flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Study Notes
          </CardTitle>
          <ExportButton 
            content={exportContent}
            fileName="study_notes"
            contentType="notes"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="multiple" className="w-full">
          {sections.map((section) => (
            <AccordionItem key={section.id} value={section.id} className="border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-blue-600 px-6 py-4">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 space-y-4 bg-gray-50">
                {section.content && (
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed bg-white p-4 rounded border-l-4 border-blue-500">
                    {section.content}
                  </div>
                )}
                
                {section.subsections && section.subsections.length > 0 && (
                  <Accordion type="multiple" className="ml-4">
                    {section.subsections.map((subsection) => (
                      <AccordionItem key={subsection.id} value={subsection.id} className="border-gray-200">
                        <AccordionTrigger className="text-left font-medium text-gray-700 hover:text-blue-600 text-sm">
                          {subsection.title}
                        </AccordionTrigger>
                        <AccordionContent className="bg-gray-50 p-4 rounded">
                          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                            {subsection.content}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default StudyNotes;
