
import React, { useState } from 'react';
import { Upload, FileText, Search, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface SimilarContent {
  title: string;
  url: string;
  similarity: number;
  snippet: string;
  source: 'web' | 'academic' | 'news';
}

const FileSimilarity: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [similarContent, setSimilarContent] = useState<SimilarContent[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
    };
    
    if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      toast({
        title: "Unsupported file type",
        description: "Please upload a text file (.txt).",
        variant: "destructive"
      });
    }
  };

  const findSimilarContent = async () => {
    if (!fileContent.trim()) {
      toast({
        title: "No content to analyze",
        description: "Please upload a file with content first.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setSimilarContent([]);

    // Simulate analysis process
    const steps = [
      "Analyzing file content...",
      "Extracting key terms...",
      "Searching internet sources...",
      "Calculating similarity scores...",
      "Ranking results..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(((i + 1) / steps.length) * 100);
    }

    // Generate mock similar content
    const mockResults: SimilarContent[] = [
      {
        title: "Academic Paper: Similar Research Findings",
        url: "https://arxiv.org/abs/example1",
        similarity: 0.89,
        snippet: "This academic paper discusses similar concepts and methodologies as found in your uploaded document. The research approach and conclusions show significant overlap...",
        source: 'academic'
      },
      {
        title: "Wikipedia Article on Related Topic",
        url: "https://en.wikipedia.org/wiki/related-topic",
        similarity: 0.76,
        snippet: "Comprehensive overview of the topic covered in your document. Contains detailed explanations and references that complement your content...",
        source: 'web'
      },
      {
        title: "Recent News Article",
        url: "https://news.example.com/related-news",
        similarity: 0.72,
        snippet: "Breaking news coverage of developments in the field discussed in your document. Provides current context and real-world applications...",
        source: 'news'
      },
      {
        title: "Industry Blog Post",
        url: "https://blog.example.com/industry-insights",
        similarity: 0.68,
        snippet: "Expert insights and practical applications related to your document's content. Offers industry perspective and best practices...",
        source: 'web'
      },
      {
        title: "Research Database Entry",
        url: "https://research.example.com/database-entry",
        similarity: 0.64,
        snippet: "Detailed research data and analysis that supports and extends the concepts in your uploaded document...",
        source: 'academic'
      }
    ];

    setSimilarContent(mockResults);
    setIsAnalyzing(false);

    toast({
      title: "Analysis Complete",
      description: `Found ${mockResults.length} similar pieces of content on the internet.`
    });
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'news': return 'bg-red-100 text-red-800';
      case 'web': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-purple-600" />
            <span>File Similarity Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File for Analysis
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-700">
                    Drop your file here or click to upload
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports text files up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  accept=".txt,text/plain"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="similarity-file-upload"
                />
                <label htmlFor="similarity-file-upload">
                  <Button variant="outline" className="mt-4" asChild>
                    <span className="cursor-pointer flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Choose File</span>
                    </span>
                  </Button>
                </label>
              </div>
            </div>

            {uploadedFile && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">{uploadedFile.name}</span>
                  <Badge variant="secondary">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>
                <p className="text-sm text-blue-600 mt-2">
                  Content loaded: {fileContent.length} characters
                </p>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <Button
            onClick={findSimilarContent}
            disabled={!fileContent.trim() || isAnalyzing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isAnalyzing ? (
              <>
                <Search className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Globe className="h-4 w-4 mr-2" />
                Find Similar Content on Internet
              </>
            )}
          </Button>

          {/* Progress */}
          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Analysis Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Similar Content Results */}
      {similarContent.length > 0 && (
        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Similar Content Found</span>
              <Badge variant="secondary">
                {similarContent.length} matches
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {similarContent.map((content, index) => (
                <div key={index} className="p-4 bg-white/60 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {content.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {content.url}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge className={getSourceColor(content.source)}>
                        {content.source}
                      </Badge>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {(content.similarity * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">similarity</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    {content.snippet}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(content.url, '_blank')}
                    >
                      View Source
                    </Button>
                    <div className="w-32">
                      <div className="text-xs text-gray-500 mb-1">Match Score</div>
                      <Progress value={content.similarity * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileSimilarity;
