
import React from 'react';
import { FileText, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  score: number;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, query }) => {
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    let highlightedText = text;
    
    queryTerms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(
        regex, 
        '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
      );
    });
    
    return highlightedText;
  };

  const getSnippet = (content: string, query: string, maxLength: number = 200) => {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    const contentLower = content.toLowerCase();
    
    // Find the first occurrence of any query term
    let bestIndex = 0;
    let earliestIndex = content.length;
    
    queryTerms.forEach(term => {
      const index = contentLower.indexOf(term);
      if (index !== -1 && index < earliestIndex) {
        earliestIndex = index;
      }
    });
    
    if (earliestIndex < content.length) {
      // Center the snippet around the found term
      const start = Math.max(0, earliestIndex - maxLength / 2);
      const end = Math.min(content.length, start + maxLength);
      bestIndex = start;
    }
    
    let snippet = content.substring(bestIndex, bestIndex + maxLength);
    if (bestIndex > 0) snippet = '...' + snippet;
    if (bestIndex + maxLength < content.length) snippet = snippet + '...';
    
    return snippet;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-gray-800">
          Search Results
        </h3>
        <Badge variant="secondary" className="text-sm">
          {results.length} result{results.length !== 1 ? 's' : ''} found
        </Badge>
      </div>
      
      <div className="space-y-4">
        {results.map((result, index) => (
          <Card 
            key={result.id} 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:scale-[1.01]"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <FileText className="h-5 w-5 text-gray-500" />
                  <h4 
                    className="text-lg font-semibold text-gray-800 leading-tight"
                    dangerouslySetInnerHTML={{ __html: highlightText(result.title, query) }}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-600">
                    {(result.score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightText(getSnippet(result.content, query), query) 
                  }}
                />
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Relevance Score: {result.score.toFixed(4)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Document ID: {result.id}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {results.length === 0 && (
        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">No results found</h4>
            <p className="text-gray-500">
              Try adjusting your search terms or upload more documents
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchResults;
