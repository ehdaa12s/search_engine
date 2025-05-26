
// TF-IDF Search Engine Implementation

interface Document {
  id: string;
  title: string;
  content: string;
}

interface ProcessedDocument extends Document {
  tokens: string[];
  termFreq: { [term: string]: number };
}

interface SearchResult extends Document {
  score: number;
}

// Global variables for the search engine
let corpus: ProcessedDocument[] = [];
let vocabulary: Set<string> = new Set();
let idfCache: { [term: string]: number } = {};
let invertedIndex: { [term: string]: string[] } = {};

// English stopwords
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with',
  'the', 'this', 'but', 'they', 'have', 'had', 'what', 'said', 'each', 'which',
  'she', 'do', 'how', 'their', 'if', 'up', 'out', 'many', 'then', 'them', 'these',
  'so', 'some', 'her', 'would', 'make', 'like', 'into', 'him', 'time', 'two',
  'more', 'very', 'when', 'come', 'may', 'use', 'than', 'first', 'been', 'his',
  'who', 'oil', 'sit', 'now', 'find', 'down', 'day', 'did', 'get', 'has', 'made',
  'my', 'over', 'such', 'me', 'even', 'most', 'can', 'should', 'after'
]);

// Simple stemmer (Porter-like algorithm simplified)
const stem = (word: string): string => {
  word = word.toLowerCase();
  
  // Remove common suffixes
  const suffixes = [
    'ing', 'ly', 'ed', 'ies', 'ied', 'ies', 'ied', 'ies', 'ing', 'ed',
    'er', 'est', 's', 'es', 'ment', 'ness', 'tion', 'sion', 'able', 'ible'
  ];
  
  for (const suffix of suffixes) {
    if (word.endsWith(suffix) && word.length > suffix.length + 2) {
      return word.slice(0, -suffix.length);
    }
  }
  
  return word;
};

// Tokenize and preprocess text
const preprocessText = (text: string): string[] => {
  console.log('Preprocessing text:', text.substring(0, 100) + '...');
  
  // Convert to lowercase and remove punctuation
  const cleaned = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  
  // Tokenize
  const tokens = cleaned.split(/\s+/).filter(token => token.length > 0);
  
  // Remove stopwords and apply stemming
  const processed = tokens
    .filter(token => !STOPWORDS.has(token) && token.length > 2)
    .map(token => stem(token));
  
  console.log('Processed tokens:', processed.slice(0, 10));
  return processed;
};

// Calculate term frequency
const calculateTF = (tokens: string[]): { [term: string]: number } => {
  const tf: { [term: string]: number } = {};
  const totalTokens = tokens.length;
  
  tokens.forEach(token => {
    tf[token] = (tf[token] || 0) + 1;
  });
  
  // Normalize by total tokens (relative frequency)
  Object.keys(tf).forEach(term => {
    tf[term] = tf[term] / totalTokens;
  });
  
  return tf;
};

// Calculate inverse document frequency
const calculateIDF = (term: string): number => {
  if (idfCache[term] !== undefined) {
    return idfCache[term];
  }
  
  const docsWithTerm = corpus.filter(doc => doc.termFreq[term] > 0).length;
  const idf = docsWithTerm > 0 ? Math.log(corpus.length / docsWithTerm) : 0;
  
  idfCache[term] = idf;
  return idf;
};

// Calculate TF-IDF vector for a document
const calculateTFIDF = (termFreq: { [term: string]: number }): { [term: string]: number } => {
  const tfidf: { [term: string]: number } = {};
  
  Object.keys(termFreq).forEach(term => {
    const tf = termFreq[term];
    const idf = calculateIDF(term);
    tfidf[term] = tf * idf;
  });
  
  return tfidf;
};

// Calculate cosine similarity between two vectors
const cosineSimilarity = (vec1: { [term: string]: number }, vec2: { [term: string]: number }): number => {
  const terms1 = new Set(Object.keys(vec1));
  const terms2 = new Set(Object.keys(vec2));
  const commonTerms = [...terms1].filter(term => terms2.has(term));
  
  if (commonTerms.length === 0) return 0;
  
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  commonTerms.forEach(term => {
    dotProduct += vec1[term] * vec2[term];
  });
  
  Object.values(vec1).forEach(val => norm1 += val * val);
  Object.values(vec2).forEach(val => norm2 += val * val);
  
  norm1 = Math.sqrt(norm1);
  norm2 = Math.sqrt(norm2);
  
  if (norm1 === 0 || norm2 === 0) return 0;
  
  return dotProduct / (norm1 * norm2);
};

// Build inverted index
const buildInvertedIndex = () => {
  invertedIndex = {};
  
  corpus.forEach(doc => {
    Object.keys(doc.termFreq).forEach(term => {
      if (!invertedIndex[term]) {
        invertedIndex[term] = [];
      }
      if (!invertedIndex[term].includes(doc.id)) {
        invertedIndex[term].push(doc.id);
      }
    });
  });
  
  console.log('Inverted index built with', Object.keys(invertedIndex).length, 'terms');
};

// Add a document to the corpus
export const addDocument = (doc: Document) => {
  console.log('Adding document to corpus:', doc.title);
  
  const tokens = preprocessText(doc.content + ' ' + doc.title);
  const termFreq = calculateTF(tokens);
  
  const processedDoc: ProcessedDocument = {
    ...doc,
    tokens,
    termFreq
  };
  
  corpus.push(processedDoc);
  
  // Update vocabulary
  tokens.forEach(token => vocabulary.add(token));
  
  // Clear IDF cache since corpus changed
  idfCache = {};
  
  // Rebuild inverted index
  buildInvertedIndex();
  
  console.log('Corpus now contains', corpus.length, 'documents');
  console.log('Vocabulary size:', vocabulary.size);
};

// Search documents using TF-IDF and cosine similarity
export const searchDocuments = (query: string, documents: Document[]): SearchResult[] => {
  console.log('Searching for query:', query);
  console.log('Available documents:', documents.length);
  console.log('Corpus size:', corpus.length);
  
  if (corpus.length === 0) return [];
  
  // Preprocess query
  const queryTokens = preprocessText(query);
  const queryTF = calculateTF(queryTokens);
  const queryTFIDF = calculateTFIDF(queryTF);
  
  console.log('Query tokens:', queryTokens);
  console.log('Query TF-IDF:', queryTFIDF);
  
  // Use inverted index to find candidate documents
  const candidateDocIds = new Set<string>();
  queryTokens.forEach(token => {
    if (invertedIndex[token]) {
      invertedIndex[token].forEach(docId => candidateDocIds.add(docId));
    }
  });
  
  console.log('Candidate documents:', candidateDocIds.size);
  
  // Calculate similarity scores for candidate documents
  const results: SearchResult[] = [];
  
  candidateDocIds.forEach(docId => {
    const doc = corpus.find(d => d.id === docId);
    if (doc) {
      const docTFIDF = calculateTFIDF(doc.termFreq);
      const similarity = cosineSimilarity(queryTFIDF, docTFIDF);
      
      if (similarity > 0) {
        results.push({
          id: doc.id,
          title: doc.title,
          content: doc.content,
          score: similarity
        });
      }
    }
  });
  
  // Sort by similarity score (descending) and return top 5
  const sortedResults = results
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  
  console.log('Search completed. Found', sortedResults.length, 'relevant documents');
  sortedResults.forEach((result, index) => {
    console.log(`${index + 1}. ${result.title} (score: ${result.score.toFixed(4)})`);
  });
  
  return sortedResults;
};

// Get corpus statistics
export const getCorpusStats = () => {
  return {
    totalDocuments: corpus.length,
    totalTerms: vocabulary.size,
    avgDocumentLength: corpus.length > 0 
      ? corpus.reduce((sum, doc) => sum + doc.tokens.length, 0) / corpus.length 
      : 0
  };
};

// Clear the corpus (for testing/reset)
export const clearCorpus = () => {
  corpus = [];
  vocabulary.clear();
  idfCache = {};
  invertedIndex = {};
  console.log('Corpus cleared');
};
