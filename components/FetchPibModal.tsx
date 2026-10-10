import React, { useState } from 'react';
import { X, Sparkles, Building2, Layers, Check, ArrowRight } from 'lucide-react';

interface FetchPibModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleFetched: (article: any) => void;
}

const POPULAR_MINISTRIES = [
  'Cabinet Committee on Economic Affairs (CCEA)',
  'Ministry of Environment, Forest and Climate Change',
  'Ministry of Mines',
  'Ministry of Finance / Dept of Economic Affairs',
  'Ministry of Panchayati Raj / Tribal Affairs',
  'Ministry of Science and Technology / ISRO',
  'Ministry of Agriculture and Farmers Welfare',
  'Ministry of New and Renewable Energy',
  'Ministry of Culture',
  'Ministry of External Affairs'
];

export const FetchPibModal: React.FC<FetchPibModalProps> = ({
  isOpen,
  onClose,
  onArticleFetched
}) => {
  const [selectedMinistry, setSelectedMinistry] = useState(POPULAR_MINISTRIES[0]);
  const [customTopic, setCustomTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/pib/fetch-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ministry: selectedMinistry,
          topic: customTopic || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.article) {
        onArticleFetched(data.article);
        onClose();
      } else {
        setError(data.error || 'Failed to fetch release');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-heading font-bold text-base">Fetch Live PIB Release</h3>
              <p className="text-xs text-blue-200">UPSC Prelims analytical extraction powered by Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFetch} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              <span>Select Union Ministry</span>
            </label>
            <select
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-900"
            >
              {POPULAR_MINISTRIES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-700" />
              <span>Specific Topic or Scheme (Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Deep Sea Mission, PESA Act, Green Hydrogen, Tiger Census..."
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-900"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Leave blank to fetch the most high-probability recent Prelims notification for this ministry.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-xs transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>Synthesizing Prelims Takeaways...</span>
                </>
              ) : (
                <>
                  <span>Fetch &amp; Filter Release</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
