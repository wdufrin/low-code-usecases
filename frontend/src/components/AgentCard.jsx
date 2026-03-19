import React, { useState } from 'react';
import { Brain, Zap, AlertCircle } from 'lucide-react';

export default function AgentCard({ agent }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'text-green-400 border-green-900/30 bg-green-900/10';
      case 'medium': return 'text-yellow-400 border-yellow-900/30 bg-yellow-900/10';
      case 'hard': return 'text-red-400 border-red-900/30 bg-red-900/10';
      default: return 'text-blue-400 border-blue-900/30 bg-blue-900/10';
    }
  };

  return (
    <div 
      className={`flip-card ${isFlipped ? 'flipped' : ''}`} 
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flip-card-inner">
        
        {/* Front of Card */}
        <div className="flip-card-front glass p-6 flex flex-col justify-between glow-hover">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-900/30 rounded-xl">
                <Brain className="text-purple-400" size={24} />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(agent.difficulty)}`}>
                {agent.difficulty || 'Medium'}
              </span>
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-white tracking-tight">{agent.name}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{agent.summary}</p>
          </div>
          
          <div className="mt-auto">
            <div className="text-xs text-gray-500 mb-1">CONNECTORS</div>
            <p className="text-xs text-gray-300 font-medium">
              {agent.connectors?.join(' • ') || 'General'}
            </p>
          </div>  
          
          <div className="mt-4 text-center text-xs text-purple-400 font-semibold">
            Click to view details
          </div>
        </div>

        {/* Back of Card */}
        <div className="flip-card-back glass p-8 flex flex-col overflow-y-auto glow-hover custom-scrollbar">
          
          <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
            <Zap className="text-yellow-400" size={20} />
            <h4 className="font-bold text-sm tracking-wider text-gray-200">AGENT BLUEPRINT</h4>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">RECOMMENDED MODEL</div>
              <div className="text-white text-sm font-medium bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700/30">
                {agent.model || 'Gemini 2.5 Pro'}
              </div>
            </div>

            {agent.schedule && (
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1">RECURRING SCHEDULE TRIGGER</div>
                <div className="bg-purple-950/30 p-3 rounded-lg border border-purple-800/40">
                  <div className="text-xs font-bold text-purple-300 mb-1">
                    ⏰ {agent.schedule.trigger}
                  </div>
                  <p className="text-xs text-gray-400 italic bg-black/20 p-2 rounded border border-purple-900/30">
                    "{agent.schedule.prompt}"
                  </p>
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">SYSTEM INSTRUCTIONS</div>
              <div className="bg-gray-950/50 p-3 rounded-lg border border-gray-800/80">
                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {agent.instructions}
                </p>
              </div>
            </div>

            {agent.data_stores && agent.data_stores.length > 0 && (
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <span>GROUNDING (DATA STORES)</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {agent.data_stores.map((store, idx) => (
                    <span key={idx} className="chip chip-grounding">
                      {store}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {agent.tools && agent.tools.length > 0 && (
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1">ACTIONS (CUSTOM TOOLS)</div>
                <div className="flex flex-wrap gap-1">
                  {agent.tools.map((tool, idx) => (
                    <span key={idx} className="chip chip-action">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-auto pt-3 text-center text-xs text-gray-500 border-t border-gray-800/50">
            Click to flip back
          </div>
        </div>
      </div>
    </div>
  );
}
