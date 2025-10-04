import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import YouTubeSummarizer from '@/components/YouTubeSummarizer';
import SummaryViewer from '@/components/SummaryViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  FileText, Youtube, Lightbulb, CircleHelp, BookText, Calendar,
  BarChart, Brain, Clock, AlertCircle, 
  Sparkles, MessageCircle, History, Loader2, Download, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

const Dashboard = () => {
  const [documentSummary, setDocumentSummary] = useState(null);
  const [videoSummary, setVideoSummary] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState(null);
  const [activeTab, setActiveTab] = useState("documents");
  const [showStats, setShowStats] = useState(false);
  const [processingState, setProcessingState] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = apiService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };

    checkAuth();
  }, []);

  const handleFileUpload = async (file) => {
    if (!isAuthenticated) {
      toast({
        title: "Please Log In",
        description: "You need to be logged in to upload documents",
        variant: "destructive"
      });
      return;
    }

    console.log("File uploaded:", file);
    
    setProcessingState({
      type: 'document',
      status: 'processing',
      message: 'Uploading and processing document...'
    });
    
    try {
      const result = await apiService.uploadDocument(file);
      
      if (result.success) {
        setProcessingState({
          type: 'document',
          status: 'completed',
          message: 'Document processed successfully'
        });
        
        const summaryData = {
          title: file.name.replace(/\.[^/.]+$/, ""),
          summary: result.summary.english_summary || result.summary.full_summary,
          keyPoints: result.summary.key_points || [],
          fullSummary: result.summary,
          sourceText: result.text_preview,
          text_preview: result.text_preview
        };
        
        setDocumentSummary(summaryData);
        toast({
          title: "Summary Generated",
          description: `Successfully analyzed "${file.name}" and generated a summary.`,
        });
      } else {
        throw new Error(result.message || "Processing failed");
      }
    } catch (error) {
      console.error("File processing error:", error);
      setProcessingState({
        type: 'document',
        status: 'error',
        message: error.message
      });
      
      toast({
        title: "Processing Failed",
        description: error.message || "Failed to process document",
        variant: "destructive"
      });
    }
  };

  const handleGenerateQuestions = async (file) => {
    if (!isAuthenticated) {
      toast({
        title: "Please Log In",
        description: "You need to be logged in to generate questions",
        variant: "destructive"
      });
      return;
    }

    console.log("Generating questions from:", file);
    
    setProcessingState({
      type: 'questions',
      status: 'processing',
      message: 'Generating practice questions...'
    });
    
    try {
      const result = await apiService.generateQuestionsFromDocument(file, 10);
      console.log("🚀 Questions API Response:", result);
      
      if (result.success) {
        setProcessingState({
          type: 'questions',
          status: 'completed',
          message: 'Questions generated successfully'
        });
        
        setGeneratedQuestions(result.questions);
        
        // Reset expanded questions state
        setExpandedQuestions({});
        
        console.log("✅ Questions set in state:", result.questions);
        console.log("📊 Questions array:", result.questions?.questions);
        console.log("📊 Answers array:", result.questions?.answers);
        
        toast({
          title: "Questions Generated",
          description: `Generated ${result.total_questions} practice questions from "${file.name}".`,
        });
      } else {
        throw new Error(result.message || "Question generation failed");
      }
    } catch (error) {
      console.error("Question generation error:", error);
      setProcessingState({
        type: 'questions',
        status: 'error',
        message: error.message
      });
      
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate questions",
        variant: "destructive"
      });
    }
  };

  const handleSaveSummary = async () => {
    if (!documentSummary) return;
    
    if (!isAuthenticated) {
      toast({
        title: "Please Log In",
        description: "You need to be logged in to save summaries",
        variant: "destructive"
      });
      return;
    }

    setSaveLoading(true);
    try {
      const summaryData = {
        title: documentSummary.title,
        content: documentSummary.fullSummary?.full_summary || documentSummary.summary,
        source_text: documentSummary.sourceText || documentSummary.text_preview || "",
        source_type: "document"
      };

      const response = await apiService.createSummary(summaryData);
      
      if (response.success) {
        toast({
          title: "Summary Saved",
          description: "Your summary has been saved to your history",
        });
        
        // Update the summary to show it's saved
        setDocumentSummary({
          ...documentSummary,
          saved: true
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error.message || "Could not save summary",
        variant: "destructive"
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleVideoSummarize = (summary) => {
    console.log("Video summarized:", summary);
    setVideoSummary(summary);
    toast({
      title: "Video Summarized",
      description: "Successfully extracted key points from the video.",
    });
  };

  const toggleQuestion = (index) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      
      <main className="app-container py-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient">Your Study Dashboard</h1>
              <p className="text-muted-foreground">Access all your study tools and materials in one place</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowStats(!showStats)}
                className="flex items-center"
              >
                <BarChart className="h-4 w-4 mr-2" />
                {showStats ? 'Hide Stats' : 'Show Stats'}
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/summaries" className="flex items-center">
                  <History className="h-4 w-4 mr-2" />
                  View History
                </Link>
              </Button>
            </div>
          </div>
          
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="glass-card p-4 rounded-xl border border-border/40 flex items-center space-x-4 hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-xs text-muted-foreground">Documents</div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="glass-card p-4 rounded-xl border border-border/40 flex items-center space-x-4 hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <Youtube className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-xs text-muted-foreground">Videos</div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="glass-card p-4 rounded-xl border border-border/40 flex items-center space-x-4 hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <CircleHelp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-xs text-muted-foreground">Questions</div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="glass-card p-4 rounded-xl border border-border/40 flex items-center space-x-4 hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-xs text-muted-foreground">Days Streak</div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl blur-lg -z-10 opacity-50"></div>
              <TabsList className="grid grid-cols-3 max-w-2xl mx-auto bg-muted rounded-lg p-1">
                <TabsTrigger value="documents" className="dashboard-tab">
                  <FileText className="h-4 w-4 mr-2" />
                  Study Material
                </TabsTrigger>
                <TabsTrigger value="videos" className="dashboard-tab">
                  <Youtube className="h-4 w-4 mr-2" />
                  Video Analysis
                </TabsTrigger>
                <TabsTrigger value="questions" className="dashboard-tab">
                  <CircleHelp className="h-4 w-4 mr-2" />
                  Practice Questions
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="documents" className="space-y-6 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border/40 hover:border-primary/20 transition-all shadow-sm hover:shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-primary" />
                      Upload Study Material
                    </CardTitle>
                    <CardDescription>
                      Upload PDFs, documents or notes for AI analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <FileUpload onFileUpload={handleFileUpload} />
                    
                    {/* Processing Status */}
                    {processingState.type === 'document' && processingState.status === 'processing' && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">
                            {processingState.message}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {processingState.type === 'document' && processingState.status === 'error' && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800">
                            {processingState.message}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="border-border/40 hover:border-primary/20 transition-all shadow-sm hover:shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <BookText className="mr-2 h-5 w-5 text-primary" />
                      Document Summary
                    </CardTitle>
                    <CardDescription>
                      View AI-generated insights from your document
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <SummaryViewer 
                      summary={documentSummary} 
                      type="document" 
                      onSave={handleSaveSummary}
                      saveLoading={saveLoading}
                    />
                  </CardContent>
                </Card>
              </div>
              
              {documentSummary && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="pt-6"
                >
                  <Card className="border-border/40 hover:border-primary/20 transition-all shadow-sm hover:shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-3">
                      <CardTitle className="text-xl flex items-center">
                        <Brain className="mr-2 h-5 w-5 text-primary" />
                        Practice Questions
                      </CardTitle>
                      <CardDescription>
                        Generate practice questions based on your document
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <Button 
                            onClick={() => {
                              // Re-use the uploaded file or prompt for new upload
                              const fileInput = document.createElement('input');
                              fileInput.type = 'file';
                              fileInput.accept = '.pdf,.doc,.docx,.txt,.jpg,.jpeg';
                              fileInput.onchange = (e) => {
                                if (e.target.files[0]) {
                                  handleGenerateQuestions(e.target.files[0]);
                                }
                              };
                              fileInput.click();
                            }}
                            disabled={processingState.type === 'questions' && processingState.status === 'processing'}
                          >
                            {processingState.type === 'questions' && processingState.status === 'processing' ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Generating Questions...
                              </>
                            ) : (
                              <>
                                <CircleHelp className="h-4 w-4 mr-2" />
                                Generate Questions
                              </>
                            )}
                          </Button>
                          
                          {generatedQuestions && generatedQuestions.questions && generatedQuestions.questions.length > 0 && (
                            <Button variant="outline" onClick={() => {
                              // Download questions as text file
                              const content = `QUESTIONS:\n\n${generatedQuestions.questions.map((q, i) => `${i+1}. ${q}`).join('\n')}\n\nANSWERS:\n\n${generatedQuestions.answers.map((a, i) => `${i+1}. ${a}`).join('\n')}`;
                              const blob = new Blob([content], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${documentSummary.title}_questions.txt`;
                              a.click();
                            }}>
                              <Download className="h-4 w-4 mr-2" />
                              Download Questions
                            </Button>
                          )}
                        </div>

                        {/* Questions Processing Status */}
                        {processingState.type === 'questions' && processingState.status === 'processing' && (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">
                                {processingState.message}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {processingState.type === 'questions' && processingState.status === 'error' && (
                          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-800">
                                {processingState.message}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Generated Questions Display - FAQ Style */}
                        {generatedQuestions && generatedQuestions.questions && generatedQuestions.questions.length > 0 ? (
                          <div className="border rounded-lg p-6 bg-card">
                            <h4 className="text-lg font-medium mb-4 flex items-center">
                              <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                              Practice Questions ({generatedQuestions.questions.length})
                            </h4>
                            
                            <div className="space-y-4">
                              {generatedQuestions.questions.map((question, index) => (
                                <div key={index} className="border border-border rounded-lg overflow-hidden bg-white">
                                  <button
                                    className="w-full p-4 text-left flex justify-between items-center hover:bg-muted/50 transition-colors"
                                    onClick={() => toggleQuestion(index)}
                                  >
                                    <span className="font-medium flex items-start">
                                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                                        {index + 1}
                                      </span>
                                      <span className="text-left">{question}</span>
                                    </span>
                                    {expandedQuestions[index] ? (
                                      <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                                    )}
                                  </button>
                                  
                                  {expandedQuestions[index] && generatedQuestions.answers && generatedQuestions.answers[index] && (
                                    <div className="p-4 bg-green-50 border-t border-green-200">
                                      <div className="flex items-start">
                                        <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                                          A
                                        </span>
                                        <div className="flex-1">
                                          <p className="font-medium text-green-700 mb-1">Answer:</p>
                                          <p className="text-green-800">{generatedQuestions.answers[index]}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : generatedQuestions ? (
                          <div className="border rounded-lg p-6 bg-card text-center">
                            <p className="text-muted-foreground">No questions were generated. The questions array might be empty.</p>
                          </div>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>
            
            <TabsContent value="videos" className="space-y-6 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border/40 hover:border-primary/20 transition-all shadow-sm hover:shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <Youtube className="mr-2 h-5 w-5 text-primary" />
                      YouTube Video Processing
                    </CardTitle>
                    <CardDescription>
                      Extract key points from educational videos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <YouTubeSummarizer onSummarize={handleVideoSummarize} />
                  </CardContent>
                </Card>
                
                <Card className="border-border/40 hover:border-primary/20 transition-all shadow-sm hover:shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <BookText className="mr-2 h-5 w-5 text-primary" />
                      Video Summary
                    </CardTitle>
                    <CardDescription>
                      View AI-generated insights from your video
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <SummaryViewer summary={videoSummary} type="video" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="questions" className="space-y-6 animate-fade-in">
              <Card className="border-border/40 hover:border-primary/20 transition-all shadow-sm hover:shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-3">
                  <CardTitle className="text-xl flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                    Question Generator
                  </CardTitle>
                  <CardDescription>
                    Generate practice questions based on your study materials
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <div className="flex items-center p-3 rounded-lg border border-accent/20 bg-accent/5 mb-6">
                      <AlertCircle className="h-5 w-5 text-accent mr-3" />
                      <p className="text-sm">
                        Upload a document to generate practice questions based on its content. Our AI will create targeted questions to test your understanding.
                      </p>
                    </div>
                    
                    <FileUpload 
                      onFileUpload={handleGenerateQuestions} 
                    />
                  </div>

                  {/* Show generated questions in the questions tab as well */}
                  {generatedQuestions && generatedQuestions.questions && generatedQuestions.questions.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border/30">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <CircleHelp className="h-5 w-5 mr-2 text-primary" />
                        Generated Questions ({generatedQuestions.questions.length})
                      </h3>
                      
                      <div className="space-y-4">
                        {generatedQuestions.questions.map((question, index) => (
                          <div key={index} className="border border-border rounded-lg overflow-hidden bg-white">
                            <button
                              className="w-full p-4 text-left flex justify-between items-center hover:bg-muted/50 transition-colors"
                              onClick={() => toggleQuestion(index)}
                            >
                              <span className="font-medium flex items-start">
                                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                                  {index + 1}
                                </span>
                                <span className="text-left">{question}</span>
                              </span>
                              {expandedQuestions[index] ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                              )}
                            </button>
                            
                            {expandedQuestions[index] && generatedQuestions.answers && generatedQuestions.answers[index] && (
                              <div className="p-4 bg-green-50 border-t border-green-200">
                                <div className="flex items-start">
                                  <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                                    A
                                  </span>
                                  <div className="flex-1">
                                    <p className="font-medium text-green-700 mb-1">Answer:</p>
                                    <p className="text-green-800">{generatedQuestions.answers[index]}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 pt-8 border-t border-border/30"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              Today's Study Tips
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-5">
            <Card className="border-border/40 bg-gradient-to-br from-background to-muted/20 hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="bg-primary/10 p-2 rounded-full w-fit mb-4">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Pomodoro Technique</h3>
                <p className="text-sm text-muted-foreground">Study for 25 minutes, then take a 5-minute break. Repeat 4 times, then take a longer break.</p>
              </CardContent>
            </Card>
            
            <Card className="border-border/40 bg-gradient-to-br from-background to-muted/20 hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="bg-primary/10 p-2 rounded-full w-fit mb-4">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Active Recall</h3>
                <p className="text-sm text-muted-foreground">Test yourself on material instead of passively re-reading. Quiz yourself on key concepts.</p>
              </CardContent>
            </Card>
            
            <Card className="border-border/40 bg-gradient-to-br from-background to-muted/20 hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="bg-primary/10 p-2 rounded-full w-fit mb-4">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Teach to Learn</h3>
                <p className="text-sm text-muted-foreground">Explaining concepts to others reinforces your understanding and reveals knowledge gaps.</p>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Dashboard;