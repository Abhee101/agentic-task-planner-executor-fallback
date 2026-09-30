
import React from 'react';
import { AgentResponse, AgentState } from '../types';

interface AgentDashboardProps {
  state: AgentState;
  data: AgentResponse | null;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ state, data }) => {
  if (state === AgentState.IDLE) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mb-4 text-blue-400/40 text-3xl">
          <i className="fa-solid fa-compass-drafting"></i>
        </div>
        <p className="text-base font-medium text-slate-400">Ready to plan your next project</p>
        <p className="text-xs text-slate-500 mt-1 max-w-sm text-center">
          Choose an example above or describe any project, event, campaign, or initiative to initiate the LangGraph agent workflow.
        </p>
      </div>
    );
  }

  const getStatusIcon = (stepState: AgentState) => {
    if (state === stepState) return <i className="fa-solid fa-spinner fa-spin text-blue-400"></i>;
    const states = [AgentState.PLANNING, AgentState.VALIDATING, AgentState.EXECUTING, AgentState.REFLECTING, AgentState.COMPLETED];
    if (states.indexOf(state) > states.indexOf(stepState)) return <i className="fa-solid fa-circle-check text-emerald-400"></i>;
    return <i className="fa-regular fa-circle text-slate-600"></i>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Workflow Progress Bar */}
      <div className="grid grid-cols-4 gap-4 pb-4 border-b border-slate-800">
        <div className={`flex flex-col items-center ${state === AgentState.PLANNING ? 'opacity-100' : 'opacity-50'}`}>
          <div className="mb-2">{getStatusIcon(AgentState.PLANNING)}</div>
          <span className="text-xs font-semibold uppercase tracking-wider">Planning</span>
        </div>
        <div className={`flex flex-col items-center ${state === AgentState.VALIDATING ? 'opacity-100' : 'opacity-50'}`}>
          <div className="mb-2">{getStatusIcon(AgentState.VALIDATING)}</div>
          <span className="text-xs font-semibold uppercase tracking-wider">Validation</span>
        </div>
        <div className={`flex flex-col items-center ${state === AgentState.EXECUTING ? 'opacity-100' : 'opacity-50'}`}>
          <div className="mb-2">{getStatusIcon(AgentState.EXECUTING)}</div>
          <span className="text-xs font-semibold uppercase tracking-wider">Execution</span>
        </div>
        <div className={`flex flex-col items-center ${state === AgentState.REFLECTING ? 'opacity-100' : 'opacity-50'}`}>
          <div className="mb-2">{getStatusIcon(AgentState.REFLECTING)}</div>
          <span className="text-xs font-semibold uppercase tracking-wider">Reflection</span>
        </div>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Fallback Timeout Notice Banner */}
          {data.is_fallback && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs text-amber-200/90 animate-in fade-in duration-300">
              <i className="fa-solid fa-clock-rotate-left text-amber-400 mt-0.5 text-sm flex-shrink-0"></i>
              <div>
                <span className="font-semibold text-amber-300 block mb-0.5">High Demand Timeout Fallback Engaged</span>
                <span>{data.fallback_message || 'A deterministic agentic baseline plan was synthesized to prevent execution delays during peak AI cloud service demand.'}</span>
              </div>
            </div>
          )}

          {/* Validation Card */}
          <div className={`p-4 rounded-xl border ${data.validation.feasible ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
             <div className="flex items-center gap-3 mb-2">
                <i className={`fa-solid ${data.validation.feasible ? 'fa-shield-check text-emerald-400' : 'fa-triangle-exclamation text-red-400'}`}></i>
                <h3 className="font-bold">Validation Result: {data.validation.feasible ? 'Feasible' : 'Blocked'}</h3>
             </div>
             <p className="text-sm text-slate-300 italic">"{data.validation.notes}"</p>
          </div>

          {/* Planning & Execution Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <i className="fa-solid fa-list-check text-blue-400"></i>
              Actionable Plan
            </h3>
            <div className="space-y-3">
              {data.plan.map((item) => (
                <div key={item.step} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Step {item.step}</span>
                    <span className="text-xs text-slate-500"><i className="fa-regular fa-clock mr-1"></i>{item.time_required}</span>
                  </div>
                  <h4 className="text-slate-100 font-medium mb-3">{item.task}</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.resources.map((res, i) => (
                      <span key={i} className="text-[10px] bg-slate-900 border border-slate-700 px-2 py-1 rounded text-slate-300 flex items-center">
                        <i className="fa-solid fa-cube mr-1.5 text-blue-400/70"></i>{res}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reflection Section */}
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <i className="fa-solid fa-brain text-purple-400"></i>
              Agent Reflection
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              {data.reflection}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-500">EXECUTION NOTES</span>
              <p className="text-xs text-slate-400 mt-1">{data.execution_notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
