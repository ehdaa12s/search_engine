
import React from 'react';
import { BarChart3, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchStatsProps {
  query: string;
  results: Array<{score: number}>;
  totalDocuments: number;
}

const SearchStats: React.FC<SearchStatsProps> = ({ query, results, totalDocuments }) => {
  const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2);
  const avgScore = results.length > 0 ? results.reduce((sum, r) => sum + r.score, 0) / results.length : 0;
  const topScore = results.length > 0 ? Math.max(...results.map(r => r.score)) : 0;
  const coverage = (results.length / totalDocuments) * 100;

  return (
    <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm mt-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <span>Search Analytics</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Query Analysis */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3 flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Query Analysis</span>
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Search Terms:</span>
              <div className="flex flex-wrap gap-1">
                {queryTerms.map((term, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Term Count:</span>
              <span className="text-sm font-medium">{queryTerms.length}</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3 flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Performance Metrics</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{results.length}</div>
              <div className="text-xs text-gray-600">Results</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{coverage.toFixed(1)}%</div>
              <div className="text-xs text-gray-600">Coverage</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{(topScore * 100).toFixed(1)}%</div>
              <div className="text-xs text-gray-600">Top Score</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-lg font-bold text-orange-600">{(avgScore * 100).toFixed(1)}%</div>
              <div className="text-xs text-gray-600">Avg Score</div>
            </div>
          </div>
        </div>

        {/* Score Distribution */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Score Distribution</h4>
          <div className="space-y-2">
            {results.slice(0, 5).map((result, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-xs font-medium text-gray-500 w-8">#{index + 1}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${result.score * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 w-12">
                  {(result.score * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchStats;
