
import React, { useState } from 'react';
import { Search, Upload, FileText, BarChart3, Globe, Zap, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentUpload from '@/components/DocumentUpload';
import SearchResults from '@/components/SearchResults';
import SearchStats from '@/components/SearchStats';
import WebCrawler from '@/components/WebCrawler';
import InternetSearch from '@/components/InternetSearch';
import FileSimilarity from '@/components/FileSimilarity';
import { searchDocuments, addDocument, getCorpusStats } from '@/utils/searchEngine';

const Index = () => {
  const [query, setQuery] = useState('');
  const [documents, setDocuments] = useState<Array<{id: string, title: string, content: string}>>([]);
  const [searchResults, setSearchResults] = useState<Array<{id: string, title: string, content: string, score: number}>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('local');

  const handleSearch = async () => {
    if (!query.trim() || documents.length === 0) return;
    
    setIsSearching(true);
    console.log('Searching for:', query);
    
    setTimeout(() => {
      const results = searchDocuments(query, documents);
      console.log('Search results:', results);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleDocumentUpload = (title: string, content: string) => {
    const newDoc = {
      id: Date.now().toString(),
      title,
      content
    };
    
    const updatedDocs = [...documents, newDoc];
    setDocuments(updatedDocs);
    addDocument(newDoc);
    console.log('Document added:', newDoc.title);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const corpusStats = getCorpusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Swift
                </h1>
                <p className="text-sm text-gray-600">Advanced Search Engine</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Database className="h-4 w-4" />
                <span>{documents.length} docs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-light text-gray-800 mb-4">
            Search Everything, Everywhere
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Crawl the web, search the internet, upload documents, and find similar content with advanced TF-IDF ranking
          </p>
        </div>

        {/* Search Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="local" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Local Search</span>
            </TabsTrigger>
            <TabsTrigger value="internet" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Internet Search</span>
            </TabsTrigger>
            <TabsTrigger value="crawler" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Web Crawler</span>
            </TabsTrigger>
            <TabsTrigger value="similarity" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>File Similarity</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="local">
            <div className="space-y-6">
              {/* Local Search */}
              <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="max-w-2xl mx-auto relative">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="text"
                        placeholder="Search your uploaded documents..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-12 pr-32 py-4 text-lg border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-full"
                      />
                      <Button
                        onClick={handleSearch}
                        disabled={!query.trim() || documents.length === 0 || isSearching}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600"
                      >
                        {isSearching ? 'Searching...' : 'Search'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Document Upload */}
              <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <DocumentUpload onUpload={handleDocumentUpload} />
                </CardContent>
              </Card>

              {/* Results */}
              {searchResults.length > 0 && (
                <SearchResults results={searchResults} query={query} />
              )}

              {searchResults.length > 0 && documents.length > 0 && (
                <SearchStats 
                  query={query}
                  results={searchResults}
                  totalDocuments={documents.length}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="internet">
            <InternetSearch />
          </TabsContent>

          <TabsContent value="crawler">
            <WebCrawler onDocumentsFound={setDocuments} />
          </TabsContent>

          <TabsContent value="similarity">
            <FileSimilarity />
          </TabsContent>
        </Tabs>

        {/* Stats Section */}
        {documents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{documents.length}</div>
                <div className="text-gray-600">Documents</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{corpusStats.totalTerms}</div>
                <div className="text-gray-600">Unique Terms</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Search className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{searchResults.length}</div>
                <div className="text-gray-600">Results Found</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
