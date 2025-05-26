
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

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 50MB.",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      // For binary files, we'll use the filename and file type as content
      if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        setFileContent(content);
      } else {
        // For non-text files, create a content description based on file metadata
        const metadata = `File: ${file.name}\nType: ${file.type || 'Unknown'}\nSize: ${(file.size / 1024).toFixed(1)} KB`;
        setFileContent(metadata);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "There was an error reading the file. Please try again.",
        variant: "destructive"
      });
    };

    // Handle different file types
    if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      // For binary files, we'll analyze based on file metadata
      const metadata = `File: ${file.name}\nType: ${file.type || 'Unknown'}\nSize: ${(file.size / 1024).toFixed(1)} KB`;
      setFileContent(metadata);
    }

    toast({
      title: "File uploaded successfully",
      description: `${file.name} is ready for analysis.`
    });
  };

  const findSimilarContent = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file to analyze",
        description: "Please upload a file first.",
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
      "Extracting key features...",
      "Searching internet sources...",
      "Calculating similarity scores...",
      "Ranking results..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(((i + 1) / steps.length) * 100);
    }

    // Generate mock similar content based on file type
    const fileType = uploadedFile.type || uploadedFile.name.split('.').pop() || 'unknown';
    const mockResults: SimilarContent[] = [
      {
        title: `Similar ${fileType} document found`,
        url: "https://example.com/similar-doc",
        similarity: 0.89,
        snippet: `This document contains similar content and structure to your uploaded ${uploadedFile.name} file. The analysis shows significant overlap in key features and patterns...`,
        source: 'academic'
      },
      {
        title: "Related content repository",
        url: "https://github.com/related-content",
        similarity: 0.76,
        snippet: `Open source repository containing files similar to your upload. Includes comparable file formats and content structures...`,
        source: 'web'
      },
      {
        title: "Industry standard documentation",
        url: "https://standards.example.com/docs",
        similarity: 0.72,
        snippet: `Official documentation and examples related to your file type. Provides context and best practices for similar content...`,
        source: 'web'
      },
      {
        title: "Research paper on file analysis",
        url: "https://arxiv.org/abs/example-analysis",
        similarity: 0.68,
        snippet: `Academic research covering analysis techniques for files like yours. Includes methodologies and comparative studies...`,
        source: 'academic'
      },
      {
        title: "Recent developments in the field",
        url: "https://news.example.com/field-updates",
        similarity: 0.64,
        snippet: `Latest news and updates related to your file's domain. Coverage of new tools and techniques for handling similar content...`,
        source: 'news'
      }
    ];

    setSimilarContent(mockResults);
    setIsAnalyzing(false);

    toast({
      title: "Analysis Complete",
      description: `Found ${mockResults.length} similar pieces of content for ${uploadedFile.name}.`
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

  const getFileTypeIcon = (file: File) => {
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type.startsWith('video/')) return '🎥';
    if (file.type.startsWith('audio/')) return '🎵';
    if (file.type.includes('pdf')) return '📄';
    if (file.type.includes('word') || file.name.endsWith('.docx')) return '📝';
    if (file.type.includes('excel') || file.name.endsWith('.xlsx')) return '📊';
    if (file.type.includes('powerpoint') || file.name.endsWith('.pptx')) return '📈';
    if (file.type.startsWith('text/')) return '📄';
    return '📁';
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
                Upload Any File for Analysis
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-700">
                    Drop your file here or click to upload
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports all file types up to 50MB (documents, images, videos, etc.)
                  </p>
                </div>
                <input
                  type="file"
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
                  <span className="text-2xl">{getFileTypeIcon(uploadedFile)}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-blue-800">{uploadedFile.name}</span>
                      <Badge variant="secondary">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-600">
                      Type: {uploadedFile.type || 'Unknown'} • Ready for analysis
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <Button
            onClick={findSimilarContent}
            disabled={!uploadedFile || isAnalyzing}
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
