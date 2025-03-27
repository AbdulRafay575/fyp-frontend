
import React from 'react';
import Navbar from '@/components/Navbar';
import SummaryViewer from '@/components/SummaryViewer';
import { FileText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Summaries = () => {
  // Mock data for summaries
  const documentSummaries = [
    {
      title: "Introduction to Organic Chemistry",
      summary: "This document covers the fundamentals of organic chemistry, including basic principles of carbon compounds, functional groups, and chemical bonding in organic molecules.",
      keyPoints: [
        "Carbon forms four bonds in organic compounds",
        "Functional groups determine chemical properties",
        "IUPAC naming conventions follow specific rules",
        "Stereochemistry addresses 3D arrangement of atoms",
        "Reaction mechanisms show electron movement"
      ],
      date: "2023-10-15"
    },
    {
      title: "Quantum Physics Lecture 3",
      summary: "An exploration of quantum mechanical principles including wave-particle duality, the uncertainty principle, and quantum states.",
      keyPoints: [
        "Wave-particle duality is fundamental to quantum mechanics",
        "Heisenberg's uncertainty principle sets limits on measurement",
        "Quantum states are described by wavefunctions",
        "Schrödinger's equation governs quantum evolution",
        "Quantum entanglement allows for non-local correlations"
      ],
      date: "2023-09-28"
    },
    {
      title: "Advanced Calculus: Integration Methods",
      summary: "A comprehensive review of various integration techniques including substitution, parts, partial fractions, and trigonometric substitutions.",
      keyPoints: [
        "Substitution method works for composite functions",
        "Integration by parts useful for products of functions",
        "Partial fractions decompose rational functions",
        "Trigonometric substitutions convert certain radicals",
        "Numerical methods approximate definite integrals"
      ],
      date: "2023-11-05"
    }
  ];
  
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      <div className="app-container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 gradient-text">My Summaries</h1>
            <p className="text-muted-foreground">Access and review all your generated summaries</p>
          </div>
          
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-9 w-full" 
              placeholder="Search summaries..." 
            />
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documentSummaries.map((summary, index) => (
            <div key={index} className="glass-card rounded-xl overflow-hidden transition-all hover:shadow-lg">
              <div className="p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground line-clamp-1">{summary.title}</h3>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{summary.date}</div>
              </div>
              <div className="p-5">
                <p className="text-foreground/80 text-sm mb-4 line-clamp-3">{summary.summary}</p>
                <h4 className="text-sm font-medium mb-2 text-foreground">Key Points:</h4>
                <ul className="text-sm space-y-1">
                  {summary.keyPoints.slice(0, 3).map((point, idx) => (
                    <li key={idx} className="text-muted-foreground line-clamp-1">• {point}</li>
                  ))}
                  {summary.keyPoints.length > 3 && (
                    <li className="text-primary text-xs font-medium cursor-pointer hover:underline">
                      + {summary.keyPoints.length - 3} more points
                    </li>
                  )}
                </ul>
                <div className="mt-4 flex justify-end">
                  <button className="text-xs text-primary hover:text-primary/80 font-medium">
                    View Full Summary →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Summaries;
