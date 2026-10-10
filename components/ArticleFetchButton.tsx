import React, { useState } from 'react';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface FetchStatus {
  loading: boolean;
  success: boolean;
  message: string;
  stats?: {
    fetched: number;
    processed: number;
    added: number;
    totalArticles: number;
  };
  error?: string;
}

export default function ArticleFetchButton() {
  const [status, setStatus] = useState<FetchStatus>({
    loading: false,
    success: false,
    message: ''
  });
  
  const [showDetails, setShowDetails] = useState(false);

  const fetchArticles = async () => {
    setStatus({
      loading: true,
      success: false,
      message: 'Fetching articles from PIB...'
    });

    try {
      const response = await fetch('/api/articles/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          loading: false,
          success: true,
          message: data.message,
          stats: data.stats
        });
        
        // Auto-refresh the page after 3 seconds to show new articles
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setStatus({
          loading: false,
          success: false,
          message: data.message || 'Failed to fetch articles',
          error: data.error
        });
      }
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        message: 'Network error while fetching articles',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/articles/fetch/status');
      const data = await response.json();
      
      if (data.success) {
        setStatus(prev => ({
          ...prev,
          message: `Service status: ${data.status}`,
          success: true
        }));
      }
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  const getStats = async () => {
    try {
      const response = await fetch('/api/articles/fetch/stats');
      const data = await response.json();
      
      if (data.success) {
        setStatus(prev => ({
          ...prev,
          message: `Total articles: ${data.stats.totalArticles}`,
          stats: {
            fetched: 0,
            processed: 0,
            added: 0,
            totalArticles: data.stats.totalArticles
          },
          success: true
        }));
        setShowDetails(true);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">PIB Article Fetcher</h3>
          <p className="text-sm text-gray-600">
            Fetch and analyze articles from Press Information Bureau using AI
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={checkStatus}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Check Status
          </button>
          
          <button
            onClick={getStats}
            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            View Stats
          </button>
          
          <button
            onClick={fetchArticles}
            disabled={status.loading}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              status.loading 
                ? 'bg-blue-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {status.loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Fetch Articles
              </>
            )}
          </button>
        </div>
      </div>

      {status.message && (
        <div className={`p-3 rounded-lg mb-3 ${
          status.success 
            ? 'bg-green-50 border border-green-200' 
            : status.loading
            ? 'bg-blue-50 border border-blue-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {status.loading ? (
              <RefreshCw className="w-5 h-5 text-blue-500 animate-spin mt-0.5" />
            ) : status.success ? (
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">
                {status.message}
              </p>
              
              {status.stats && (
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white p-2 rounded border">
                    <p className="text-xs text-gray-500">Total Articles</p>
                    <p className="text-lg font-semibold">{status.stats.totalArticles}</p>
                  </div>
                  {status.stats.fetched > 0 && (
                    <>
                      <div className="bg-white p-2 rounded border">
                        <p className="text-xs text-gray-500">Fetched</p>
                        <p className="text-lg font-semibold text-blue-600">{status.stats.fetched}</p>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <p className="text-xs text-gray-500">Processed</p>
                        <p className="text-lg font-semibold text-green-600">{status.stats.processed}</p>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <p className="text-xs text-gray-500">Added</p>
                        <p className="text-lg font-semibold text-purple-600">{status.stats.added}</p>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {status.error && (
                <p className="text-xs text-red-600 mt-2">
                  Error: {status.error}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {showDetails && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900">Article Fetching Service</h4>
            <button
              onClick={() => setShowDetails(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Hide
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700 mb-1">How it works:</p>
              <ul className="text-gray-600 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Fetches articles from PIB.gov.in</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Analyzes with Gemini AI for UPSC relevance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Adds GS paper classification & importance score</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Saves to database for study material</span>
                </li>
              </ul>
            </div>
            
            <div>
              <p className="font-medium text-gray-700 mb-1">Advanced Features:</p>
              <ul className="text-gray-600 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">⏰</span>
                  <span>Scheduled daily fetching (2 AM UTC)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">🔧</span>
                  <span>CLI tools for manual control</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">📊</span>
                  <span>Detailed analytics and reporting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">🤖</span>
                  <span>AI-powered relevance filtering</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Note: The service requires GEMINI_API_KEY environment variable to be set.
              Use CLI commands for full functionality.
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          <a
            href="/api/articles/fetch/status"
            target="_blank"
            className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
          >
            API Status
          </a>
          <a
            href="/api/articles/fetch/stats"
            target="_blank"
            className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100"
          >
            API Stats
          </a>
          <a
            href="https://www.pib.gov.in/index.aspx?reg=48&lang=2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1 bg-green-50 text-green-700 rounded-full hover:bg-green-100"
          >
            PIB Source
          </a>
        </div>
      </div>
    </div>
  );
}