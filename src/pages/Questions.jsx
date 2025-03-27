
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import QuestionGenerator from '@/components/QuestionGenerator';
import FileUpload from '@/components/FileUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Upload, FileText, BookOpen } from 'lucide-react';

const Questions = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [documentSummary, setDocumentSummary] = useState(null);
  const [pastPaperSummary, setPastPaperSummary] = useState(null);

  const handleFileUpload = (file) => {
    // Simulate processing the file and getting a summary
    setTimeout(() => {
      const mockSummary = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        summary: "This is a simulated summary of the uploaded document. The system would analyze the content to generate relevant study materials.",
        keyPoints: [
          "Key concept from the study material",
          "Important definition from the document",
          "Significant theory or formula",
          "Notable experimental procedure",
          "Critical analysis point"
        ]
      };
      
      setDocumentSummary(mockSummary);
    }, 500);
  };

  const handlePastPaperUpload = (file) => {
    // Simulate processing the past paper file
    setTimeout(() => {
      const mockSummary = {
        title: `Past Paper: ${file.name.replace(/\.[^/.]+$/, "")}`,
        summary: "This past paper contains questions about different topics that will be used to generate similar questions based on your uploaded document.",
        keyPoints: [
          "Question patterns from past exams",
          "Topic distribution and emphasis",
          "Question complexity levels",
          "Common exam themes",
          "Typical problem formats"
        ]
      };
      
      setPastPaperSummary(mockSummary);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      <div className="app-container py-8">
        <h1 className="text-3xl font-bold mb-2 gradient-text">Exam Preparation</h1>
        <p className="text-muted-foreground mb-8">Generate study questions based on your documents or past papers</p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-2 max-w-md bg-muted rounded-lg p-1">
            <TabsTrigger value="general" className="dashboard-tab">
              <BookOpen className="h-4 w-4 mr-2" />
              Study Material
            </TabsTrigger>
            <TabsTrigger value="chemistry" className="dashboard-tab">
              <FileText className="h-4 w-4 mr-2" />
              Past Paper Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-primary" />
                    Upload Study Material
                  </CardTitle>
                  <CardDescription>
                    Upload your notes, textbooks, or lecture materials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFileUpload={handleFileUpload} />
                </CardContent>
              </Card>
              
              {documentSummary && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                      Document Uploaded
                    </CardTitle>
                    <CardDescription>
                      {documentSummary.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm p-3 bg-muted rounded-md">
                      <p className="font-semibold mb-2">Key Topics:</p>
                      <ul className="space-y-1">
                        {documentSummary.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {documentSummary && (
              <div className="mt-4">
                <QuestionGenerator summary={documentSummary} />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="chemistry" className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-primary" />
                    Upload Past Paper
                  </CardTitle>
                  <CardDescription>
                    Get questions based on past paper patterns applied to your content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFileUpload={handlePastPaperUpload} />
                </CardContent>
              </Card>
              
              {pastPaperSummary && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                      Past Paper Uploaded
                    </CardTitle>
                    <CardDescription>
                      {pastPaperSummary.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm p-3 bg-muted rounded-md">
                      <p className="font-semibold mb-2">Analysis:</p>
                      <ul className="space-y-1">
                        {pastPaperSummary.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {pastPaperSummary && (
              <div className="mt-4">
                <QuestionGenerator summary={pastPaperSummary} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Questions;

