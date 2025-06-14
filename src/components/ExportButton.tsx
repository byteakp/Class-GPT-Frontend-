
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download, Loader2 } from 'lucide-react';

interface ExportButtonProps {
  content: string;
  fileName: string;
  contentType: 'mcqs' | 'slides' | 'notes' | 'overview';
}

const ExportButton = ({ content, fileName, contentType }: ExportButtonProps) => {
  const [exportFormat, setExportFormat] = useState('txt');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      let exportContent = content;
      let mimeType = 'text/plain';
      let fileExtension = exportFormat;

      // Format content based on export type
      switch (exportFormat) {
        case 'pdf':
          // For PDF, we'll use HTML content and let the browser handle it
          exportContent = `
            <html>
              <head>
                <title>${fileName}</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  h1, h2, h3 { color: #333; }
                  .content { white-space: pre-wrap; }
                </style>
              </head>
              <body>
                <h1>${fileName}</h1>
                <div class="content">${content}</div>
              </body>
            </html>
          `;
          mimeType = 'text/html';
          break;
        case 'md':
          mimeType = 'text/markdown';
          break;
        case 'html':
          exportContent = `
            <html>
              <head>
                <title>${fileName}</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  h1, h2, h3 { color: #333; }
                  .content { white-space: pre-wrap; }
                </style>
              </head>
              <body>
                <h1>${fileName}</h1>
                <div class="content">${content}</div>
              </body>
            </html>
          `;
          mimeType = 'text/html';
          break;
        default:
          mimeType = 'text/plain';
      }

      // Create and download the file
      const blob = new Blob([exportContent], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}_${contentType}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Export {contentType}</h4>
            <p className="text-sm text-gray-500">Choose format and download</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Format</label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="txt">Plain Text (.txt)</SelectItem>
                <SelectItem value="md">Markdown (.md)</SelectItem>
                <SelectItem value="html">HTML (.html)</SelectItem>
                <SelectItem value="pdf">PDF (.pdf)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="w-full"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export as {exportFormat.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ExportButton;
