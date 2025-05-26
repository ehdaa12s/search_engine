
import React, { useState } from 'react';
import { Upload, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface DocumentUploadProps {
  onUpload: (title: string, content: string) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUpload }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onUpload(title.trim(), content.trim());
      setTitle('');
      setContent('');
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
      setContent(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type === 'text/plain') {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Upload className="h-5 w-5 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Upload Documents</h3>
      </div>

      {/* File Drop Zone */}
      <Card 
        className={`border-2 border-dashed transition-all duration-200 ${
          dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700">
              Drop text files here or click to upload
            </p>
            <p className="text-sm text-gray-500">
              Supports .txt files up to 10MB
            </p>
          </div>
          <input
            type="file"
            accept=".txt"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="outline" className="mt-4" asChild>
              <span className="cursor-pointer">Choose File</span>
            </Button>
          </label>
        </CardContent>
      </Card>

      {/* Manual Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Title
          </label>
          <Input
            type="text"
            placeholder="Enter document title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Content
          </label>
          <Textarea
            placeholder="Paste or type your document content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full resize-vertical"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={!title.trim() || !content.trim()}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Document</span>
        </Button>
      </form>
    </div>
  );
};

export default DocumentUpload;
