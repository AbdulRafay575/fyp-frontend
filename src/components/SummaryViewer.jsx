import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  BookOpen,
  Save
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { apiService } from '@/services/api';

const SummaryViewer = ({ summary, type = "document", onSave, saveLoading = false }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  if (!summary) {
    return (
      <div className="border rounded-lg p-6 bg-card text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground/70">No Summary Available</h3>
        <p className="text-muted-foreground mt-2">
          {type === "document" 
            ? "Upload a document to generate a summary" 
            : "Enter a YouTube URL to generate a summary"}
        </p>
      </div>
    );
  }

  // ✅ Safe data extraction
  const title = summary.title || "Summary";
  const summaryText = summary.summary || summary.content || "";
  const keyPoints = Array.isArray(summary.keyPoints) ? summary.keyPoints : 
                   Array.isArray(summary.key_points) ? summary.key_points : [];

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setIsCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "Summary has been copied to your clipboard",
    });
    
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const fileContent = 
      `# ${title}\n\n` +
      `## Summary\n${summaryText}\n\n` +
      (keyPoints.length > 0 
        ? `## Key Points\n${keyPoints.map(p => `- ${p}`).join('\n')}` 
        : "");
    
    const element = document.createElement("a");
    const file = new Blob([fileContent], { type: 'text/plain' });
    
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, '_')}_summary.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download started",
      description: "Your summary is being downloaded",
    });
  };

  const handleSaveSummary = async () => {
    if (!summaryText) {
      toast({
        title: "No content to save",
        description: "There is no summary content to save",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const summaryData = {
        title: title,
        content: summaryText,
        source_text: summary.transcript || summary.source_text || summary.text_preview || "",
        source_type: type
      };

      const response = await apiService.createSummary(summaryData);
      
      if (response.success) {
        toast({
          title: "Summary saved",
          description: "Your summary has been saved to your history",
        });
        
        // Notify parent component if save callback provided
        if (onSave) {
          onSave();
        }
      } else {
        throw new Error(response.message || "Failed to save summary");
      }
    } catch (error) {
      console.error('Failed to save summary:', error);
      toast({
        title: "Save failed",
        description: error.message || "Could not save summary",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      {/* Summary Header */}
      <div className="border-b p-4 flex justify-between items-center">
        <div>
          <h3 className="font-medium text-foreground">{title}</h3>
          {type === "video" && summary.processing_time && (
            <p className="text-sm text-muted-foreground">
              Processed in {summary.processing_time}s ({summary.chunks_processed || 1} chunk(s))
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Summary Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Summary</h4>
            <p className="text-foreground whitespace-pre-line">{summaryText}</p>
          </div>
          
          {keyPoints.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Key Points</h4>
              <ul className="list-disc pl-5 space-y-1">
                {keyPoints.map((point, index) => (
                  <li key={index} className="text-foreground">{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Summary Actions */}
      <div className="border-t p-4 bg-muted/50 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {isCopied ? (
            <>
              <Check className="h-4 w-4 mr-1" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" /> Copy
            </>
          )}
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1" /> Download
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSaveSummary}
          disabled={isSaving || saveLoading}
        >
          {isSaving || saveLoading ? (
            <>
              <div className="h-4 w-4 mr-1 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-1" /> Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SummaryViewer;