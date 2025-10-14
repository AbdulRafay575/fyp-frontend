import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { FileText, Search, Calendar, Youtube, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

const Summaries = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getUserSummaries();
      
      if (response.success) {
        setSummaries(response.summaries || []);
      } else {
        throw new Error(response.message || 'Failed to fetch summaries');
      }
    } catch (error) {
      console.error('Error fetching summaries:', error);
      setError(error.message);
      toast({
        title: "Error loading summaries",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSummaries = summaries.filter(summary => 
    summary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    summary.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (summary.source_type && summary.source_type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const getSourceTypeIcon = (sourceType) => {
    switch (sourceType?.toLowerCase()) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'video':
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getSourceTypeColor = (sourceType) => {
    switch (sourceType?.toLowerCase()) {
      case 'document':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'video':
      case 'youtube':
        return 'bg-red-500/10 text-red-600 border-red-200';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const handleViewSummary = (summary) => {
    setSelectedSummary(summary);
  };

  const handleCloseSummary = () => {
    setSelectedSummary(null);
  };

  const handleDeleteSummary = async (summaryId, event) => {
    event.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this summary?')) {
      return;
    }

    try {
      const response = await apiService.deleteSummary(summaryId);
      
      if (response.success) {
        setSummaries(prev => prev.filter(s => s.id !== summaryId));
        toast({
          title: "Summary deleted",
          description: "Your summary has been deleted successfully.",
        });
        
        if (selectedSummary?.id === summaryId) {
          setSelectedSummary(null);
        }
      } else {
        throw new Error(response.message || 'Failed to delete summary');
      }
    } catch (error) {
      console.error('Error deleting summary:', error);
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Full Summary View Modal
  if (selectedSummary) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navbar />
        <div className="app-container py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={handleCloseSummary}
                className="flex items-center gap-2"
              >
                ← Back to Summaries
              </Button>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={(e) => handleDeleteSummary(selectedSummary.id, e)}
            >
              Delete Summary
            </Button>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {selectedSummary.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selectedSummary.created_at)}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getSourceTypeColor(selectedSummary.source_type)}
                  >
                    <span className="flex items-center gap-1">
                      {getSourceTypeIcon(selectedSummary.source_type)}
                      {selectedSummary.source_type}
                    </span>
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-foreground">Summary</h3>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-foreground/90 whitespace-pre-line">{selectedSummary.content}</p>
                </div>
              </div>
              
              {selectedSummary.source_text && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Source Text</h3>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <p className="text-foreground/80 text-sm whitespace-pre-line">
                      {selectedSummary.source_text.length > 500 
                        ? `${selectedSummary.source_text.substring(0, 500)}...` 
                        : selectedSummary.source_text
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      <div className="app-container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              My Summaries
            </h1>
            <p className="text-muted-foreground">
              Access and review all your generated summaries ({summaries.length} total)
            </p>
          </div>
          
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-9 w-full" 
              placeholder="Search summaries..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your summaries...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mb-4" />
            <h3 className="text-xl font-semibold mb-2">Failed to load summaries</h3>
            <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
            <Button onClick={fetchSummaries} size="lg">
              Try Again
            </Button>
          </div>
        ) : filteredSummaries.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-20 w-20 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? 'No matching summaries found' : 'No summaries yet'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchQuery 
                ? 'Try adjusting your search terms to find what you\'re looking for.'
                : 'Start by uploading documents or videos to generate your first summary!'
              }
            </p>
            {!searchQuery && (
              <Button asChild size="lg">
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSummaries.map((summary) => (
              <div 
                key={summary.id} 
                className="glass-card rounded-xl overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer group"
                onClick={() => handleViewSummary(summary)}
              >
                <div className="p-5 border-b border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getSourceTypeIcon(summary.source_type)}
                      <h3 className="text-lg font-semibold text-foreground line-clamp-1 flex-1">
                        {summary.title}
                      </h3>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getSourceTypeColor(summary.source_type)}
                    >
                      {summary.source_type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(summary.created_at)}
                  </div>
                </div>
                
                <div className="p-5">
                  <p className="text-foreground/80 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {summary.content.length > 120 
                      ? `${summary.content.substring(0, 120)}...` 
                      : summary.content
                    }
                  </p>
                  
                  {summary.source_text && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2 text-foreground/70">Source Preview:</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {summary.source_text.length > 100
                          ? `${summary.source_text.substring(0, 100)}...`
                          : summary.source_text
                        }
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-4 border-t border-border/30">
                    <button className="text-sm text-primary hover:text-primary/80 font-medium group-hover:underline transition-all">
                      View Full Summary →
                    </button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                      onClick={(e) => handleDeleteSummary(summary.id, e)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Summaries;