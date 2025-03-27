import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Copy, 
  Languages, 
  Check, 
  ChevronDown, 
  ChevronUp,
  BookOpen
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SummaryViewer = ({ summary, type = "document" }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
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

  const handleCopy = () => {
    navigator.clipboard.writeText(summary.summary);
    setIsCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "Summary has been copied to your clipboard",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `# ${summary.title}\n\n` +
      `## Summary\n${summary.summary}\n\n` +
      `## Key Points\n${summary.keyPoints.map(point => `- ${point}`).join('\n')}`
    ], { type: 'text/plain' });
    
    element.href = URL.createObjectURL(file);
    element.download = `${summary.title.replace(/\s+/g, '_')}_summary.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download started",
      description: "Your summary is being downloaded",
    });
  };

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
    
    toast({
      title: "Translating summary",
      description: `Summary will be translated to ${value}`,
    });
    
    // In a real app, this would call the backend translation API
  };

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      {/* Summary Header */}
      <div className="border-b p-4 flex justify-between items-center">
        <div>
          <h3 className="font-medium text-foreground">{summary.title}</h3>
          {type === "video" && (
            <p className="text-sm text-muted-foreground">Duration: {summary.duration}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Summary Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Summary</h4>
            <p className="text-foreground whitespace-pre-line">{summary.summary}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Key Points</h4>
            <ul className="list-disc pl-5 space-y-1">
              {summary.keyPoints.map((point, index) => (
                <li key={index} className="text-foreground">{point}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Summary Actions */}
      <div className="border-t p-4 bg-muted/50 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {isCopied ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </>
          )}
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
        
        <div className="flex items-center ml-auto">
          <Languages className="h-4 w-4 mr-2 text-muted-foreground" />
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="german">German</SelectItem>
              <SelectItem value="chinese">Chinese</SelectItem>
              <SelectItem value="japanese">Japanese</SelectItem>
              <SelectItem value="arabic">Arabic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SummaryViewer;
