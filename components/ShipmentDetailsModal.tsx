
import React, { useState, useCallback } from 'react';
import { Shipment, Exception, AIAnalysis } from '../types';
import { analyzeException } from '../services/geminiService';
import { CloseIcon, SparklesIcon, LightBulbIcon } from './IconComponents';

interface ShipmentDetailsModalProps {
  shipment: Shipment | null;
  onClose: () => void;
  onAddException: (shipmentId: string, exception: Exception) => void;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

export const ShipmentDetailsModal: React.FC<ShipmentDetailsModalProps> = ({ shipment, onClose, onAddException }) => {
  const [exceptionDescription, setExceptionDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!exceptionDescription) {
        setError('Please enter a description of the issue.');
        return;
    }
    setIsLoading(true);
    setError(null);
    setAiAnalysis(null);
    try {
        const result = await analyzeException(exceptionDescription);
        if (result) {
            setAiAnalysis(result);
        } else {
            setError("AI analysis returned an unexpected format.");
        }
    } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
        setIsLoading(false);
    }
  }, [exceptionDescription]);

  const handleAddException = () => {
    if (!shipment || !exceptionDescription) return;
    const newException: Exception = {
        timestamp: new Date().toISOString(),
        description: exceptionDescription,
        aiAnalysis: aiAnalysis || undefined,
    };
    onAddException(shipment.id, newException);
    setExceptionDescription('');
    setAiAnalysis(null);
    // Potentially close modal or switch to a confirmation view
  };

  if (!shipment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-brand-blue">Shipment Details: {shipment.id}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                <CloseIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div><p className="text-sm text-gray-500">Origin</p><p className="font-semibold text-lg">{shipment.origin}</p></div>
                <div><p className="text-sm text-gray-500">Destination</p><p className="font-semibold text-lg">{shipment.destination}</p></div>
                <div><p className="text-sm text-gray-500">Carrier</p><p className="font-semibold text-lg">{shipment.carrier}</p></div>
                <div><p className="text-sm text-gray-500">Status</p><p className="font-semibold text-lg">{shipment.status}</p></div>
                <div><p className="text-sm text-gray-500">Estimated Delivery</p><p className="font-semibold text-lg">{formatDate(shipment.estimatedDelivery)}</p></div>
                <div><p className="text-sm text-gray-500">Last Update</p><p className="font-semibold text-lg">{formatDate(shipment.lastUpdate)}</p></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* History */}
                <div>
                    <h3 className="text-xl font-semibold text-brand-blue mb-4 border-b pb-2">Shipment History</h3>
                    <ul className="space-y-4">
                        {shipment.history.map((h, i) => (
                            <li key={i} className="flex space-x-3">
                                <div className="flex-shrink-0"><div className="w-3 h-3 bg-brand-lightblue rounded-full mt-1.5"></div></div>
                                <div>
                                    <p className="font-semibold text-gray-800">{h.location}: <span className="font-normal">{h.details}</span></p>
                                    <p className="text-sm text-gray-500">{formatDate(h.timestamp)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Exception Handling */}
                <div>
                    <h3 className="text-xl font-semibold text-brand-blue mb-4 border-b pb-2">Exception Handling</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label htmlFor="exception-desc" className="block text-sm font-medium text-gray-700 mb-2">Describe New Issue</label>
                        <textarea id="exception-desc" rows={3} value={exceptionDescription} onChange={e => setExceptionDescription(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-lightblue focus:border-brand-lightblue" placeholder="e.g., Crate was dropped during loading..."></textarea>
                        <button onClick={handleAnalyze} disabled={isLoading} className="mt-2 w-full flex justify-center items-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 transition-all duration-300 font-semibold">
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            {isLoading ? 'Analyzing...' : 'Analyze with AI'}
                        </button>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>

                    {aiAnalysis && (
                        <div className="mt-4 bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400 animate-fade-in">
                            <h4 className="font-bold text-lg text-indigo-800 flex items-center"><LightBulbIcon className="w-6 h-6 mr-2"/> AI Analysis</h4>
                            <p className="mt-2"><span className="font-semibold">Category:</span> <span className="bg-indigo-200 text-indigo-800 px-2 py-1 rounded text-sm">{aiAnalysis.category}</span></p>
                            <p className="mt-2 font-semibold">Suggested Actions:</p>
                            <ul className="list-disc list-inside mt-1 space-y-1 text-gray-700">
                                {aiAnalysis.suggestedActions.map((action, i) => <li key={i}>{action}</li>)}
                            </ul>
                            <button onClick={handleAddException} className="mt-4 w-full bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors font-semibold">
                                Log Exception with AI Analysis
                            </button>
                        </div>
                    )}
                    
                    {shipment.exceptions.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-semibold text-lg text-gray-800 mb-2">Logged Exceptions</h4>
                            {shipment.exceptions.map((ex, i) => (
                                <div key={i} className="bg-red-50 p-3 rounded-lg border border-red-200 mb-2">
                                    <p className="font-semibold text-red-800">{ex.description}</p>
                                    <p className="text-sm text-red-600">{formatDate(ex.timestamp)}</p>
                                    {ex.aiAnalysis && <p className="text-xs text-purple-700 mt-1">(AI Analyzed)</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
