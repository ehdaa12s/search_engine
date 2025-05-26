
import React, { useState } from 'react';
import { Search, Globe, Download, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface CrawlResult {
  url: string;
  title: string;
  content: string;
  status: 'success' | 'error' | 'pending';
  timestamp: Date;
}

interface WebCrawlerProps {
  onDocumentsFound: (documents: Array<{id: string, title: string, content: string}>) => void;
}

const WebCrawler: React.FC<WebCrawlerProps> = ({ onDocumentsFound }) => {
  const [urls, setUrls] = useState<string[]>(['']);
  const [crawlResults, setCrawlResults] = useState<CrawlResult[]>([]);
  const [isCrawling, setIsCrawling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [maxDepth, setMaxDepth] = useState(1);
  const [maxPages, setMaxPages] = useState(10);
  const { toast } = useToast();

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const removeUrl = (index: number) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
    }
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const simulateCrawl = async (url: string): Promise<CrawlResult> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    
    const isValid = validateUrl(url);
    const domain = isValid ? new URL(url).hostname : 'invalid-url';
    
    if (!isValid || Math.random() < 0.2) {
      return {
        url,
        title: 'Error',
        content: '',
        status: 'error',
        timestamp: new Date()
      };
    }

    return {
      url,
      title: `Page from ${domain}`,
      content: `This is simulated content from ${url}. In a real implementation, this would contain the actual webpage content extracted and cleaned for indexing. The content would include text, headings, and other relevant information for search purposes.`,
      status: 'success',
      timestamp: new Date()
    };
  };

  const startCrawling = async () => {
    const validUrls = urls.filter(url => url.trim() && validateUrl(url.trim()));
    
    if (validUrls.length === 0) {
      toast({
        title: "Invalid URLs",
        description: "Please enter at least one valid URL to crawl.",
        variant: "destructive"
      });
      return;
    }

    setIsCrawling(true);
    setProgress(0);
    setCrawlResults([]);

    const results: CrawlResult[] = [];
    const totalUrls = Math.min(validUrls.length * maxDepth, maxPages);

    for (let i = 0; i < totalUrls; i++) {
      const url = validUrls[i % validUrls.length];
      const result = await simulateCrawl(url);
      results.push(result);
      setCrawlResults([...results]);
      setProgress(((i + 1) / totalUrls) * 100);
    }

    // Convert successful crawls to documents
    const documents = results
      .filter(result => result.status === 'success')
      .map(result => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: result.title,
        content: result.content
      }));

    onDocumentsFound(documents);
    setIsCrawling(false);

    toast({
      title: "Crawling Complete",
      description: `Successfully crawled ${documents.length} pages and added them to your search index.`
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-blue-600" />
            <span>Web Crawler</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* URL Inputs */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              URLs to Crawl
            </label>
            {urls.map((url, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                  className="flex-1"
                />
                {urls.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeUrl(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={addUrlField} size="sm">
              Add Another URL
            </Button>
          </div>

          {/* Crawl Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Depth
              </label>
              <Input
                type="number"
                min="1"
                max="3"
                value={maxDepth}
                onChange={(e) => setMaxDepth(parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Pages
              </label>
              <Input
                type="number"
                min="1"
                max="50"
                value={maxPages}
                onChange={(e) => setMaxPages(parseInt(e.target.value) || 10)}
              />
            </div>
          </div>

          {/* Crawl Button */}
          <Button
            onClick={startCrawling}
            disabled={isCrawling}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            {isCrawling ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Crawling...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Start Crawling
              </>
            )}
          </Button>

          {/* Progress */}
          {isCrawling && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Crawling Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Crawl Results */}
      {crawlResults.length > 0 && (
        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Crawl Results</span>
              <Badge variant="secondary">
                {crawlResults.filter(r => r.status === 'success').length} successful
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {crawlResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    {result.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {result.title}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {result.url}
                      </p>
                    </div>
                  </div>
                  <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                    {result.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WebCrawler;
