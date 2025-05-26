
import React, { useState } from 'react';
import { Search, Globe, ExternalLink, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  displayUrl: string;
}

const InternetSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    const startTime = Date.now();
    
    try {
      console.log('Starting real internet search for:', query);
      
      const { data, error } = await supabase.functions.invoke('internet-search', {
        body: { query: query.trim() }
      });

      if (error) {
        console.error('Search function error:', error);
        throw new Error(error.message || 'Failed to perform search');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data.results || []);
      setSearchTime(data.searchTime || (Date.now() - startTime) / 1000);
      setTotalResults(data.totalResults || 0);
      
      toast({
        title: "Search Complete",
        description: `Found ${data.results?.length || 0} results in ${data.searchTime || ((Date.now() - startTime) / 1000).toFixed(2)} seconds`
      });
      
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: error instanceof Error ? error.message : "Unable to perform search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <span>Real Internet Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search the entire internet..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 pr-32 py-4 text-lg border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-full"
              />
              <Button
                onClick={handleSearch}
                disabled={!query.trim() || isSearching}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600"
              >
                {isSearching ? 'Searching...' : 'Search Web'}
              </Button>
            </div>
          </div>
          
          {results.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>About {totalResults.toLocaleString()} results ({results.length} shown)</span>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>({searchTime.toFixed(2)} seconds)</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {result.displayUrl}
                        </Badge>
                      </div>
                      <h3 
                        className="text-lg font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                        onClick={() => window.open(result.url, '_blank')}
                      >
                        {result.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {result.snippet}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">
                        Rank #{index + 1}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(result.url, '_blank')}
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Visit Site</span>
                    </Button>
                    <div className="text-xs text-gray-500">
                      Real search result
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {results.length === 0 && query && !isSearching && (
        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Globe className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">No results found</h4>
            <p className="text-gray-500">
              Try different keywords or check your spelling
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InternetSearch;
