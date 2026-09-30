import React, { useState } from 'react';
import { AgentState, AgentResponse } from './types';
import { planAndExecuteTask } from './services/geminiService';
import { AgentDashboard } from './components/AgentDashboard';

interface PlanningTemplate {
  id: string;
  category: 'Projects' | 'Events' | 'Business' | 'Community & Life';
  title: string;
  badge: string;
  icon: string;
  goal: string;
}

const PLANNING_TEMPLATES: PlanningTemplate[] = [
  {
    id: 'kitchen-remodel',
    category: 'Projects',
    title: 'Kitchen Remodel Project',
    badge: 'Home Renovation',
    icon: 'fa-solid fa-hammer',
    goal: 'Plan a 6-week residential kitchen remodeling project from demolition to cabinetry, plumbing, and final permit inspection.',
  },
  {
    id: 'solar-project',
    category: 'Projects',
    title: 'Solar Panel Installation',
    badge: 'Infrastructure',
    icon: 'fa-solid fa-solar-panel',
    goal: 'Plan a commercial rooftop solar energy installation project covering engineering survey, utility permits, procurement, and grid tie-in.',
  },
  {
    id: 'conference-event',
    category: 'Events',
    title: 'Annual Tech Conference',
    badge: 'Event Production',
    icon: 'fa-solid fa-microphone',
    goal: 'Plan a 3-day annual product launch conference for 300 in-person attendees including venue contracting, keynote curation, and catering.',
  },
  {
    id: 'charity-5k',
    category: 'Events',
    title: 'Charity 5K Marathon',
    badge: 'Fundraising Event',
    icon: 'fa-solid fa-person-running',
    goal: 'Plan a community charity 5K fun run and festival to raise $50,000, including city route permits, volunteer coordination, and sponsorships.',
  },
  {
    id: 'bakery-launch',
    category: 'Business',
    title: 'Artisan Bakery Opening',
    badge: 'Retail Launch',
    icon: 'fa-solid fa-mug-hot',
    goal: 'Plan opening an artisan sourdough bakery and specialty coffee bar in a downtown district, from commercial lease to health permits and grand opening.',
  },
  {
    id: 'zero-waste',
    category: 'Business',
    title: 'Corporate Zero-Waste Drive',
    badge: 'Sustainability',
    icon: 'fa-solid fa-leaf',
    goal: 'Plan a corporate zero-waste sustainability project across 3 regional branch offices to cut landfill waste by 50% in 6 months.',
  },
  {
    id: 'japan-trip',
    category: 'Community & Life',
    title: '14-Day Japan Tour',
    badge: 'Travel Expedition',
    icon: 'fa-solid fa-plane-departure',
    goal: 'Plan a 14-day multi-city cultural exploration trip across Tokyo, Kyoto, and Hiroshima with transit passes, lodging, and daily itineraries.',
  },
  {
    id: 'marathon-prep',
    category: 'Community & Life',
    title: 'Marathon Training Plan',
    badge: 'Fitness Milestone',
    icon: 'fa-solid fa-medal',
    goal: 'Plan a comprehensive 20-week marathon endurance training schedule with weekly mileage targets, nutrition milestones, and injury prevention.',
  },
];

const CATEGORIES = ['All', 'Projects', 'Events', 'Business', 'Community & Life'] as const;

const App: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentState, setCurrentState] = useState<AgentState>(AgentState.IDLE);
  const [agentData, setAgentData] = useState<AgentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executePlanWithGoal = async (targetGoal: string) => {
    if (!targetGoal.trim() || isProcessing) return;

    setIsProcessing(true);
    setError(null);
    setAgentData(null);

    try {
      setCurrentState(AgentState.PLANNING);

      // Pulse the UI states to showcase the LangGraph agent workflow
      let active = true;
      const progressStep = (async () => {
        await new Promise((r) => setTimeout(r, 600));
        if (active) setCurrentState(AgentState.VALIDATING);
        await new Promise((r) => setTimeout(r, 600));
        if (active) setCurrentState(AgentState.EXECUTING);
        await new Promise((r) => setTimeout(r, 800));
        if (active) setCurrentState(AgentState.REFLECTING);
      })();

      const result = await planAndExecuteTask(targetGoal);
      active = false;
      await progressStep;

      setAgentData(result);
      setCurrentState(AgentState.COMPLETED);
    } catch (err: any) {
      setError(err.message || 'An error occurred during agent planning execution.');
      setCurrentState(AgentState.ERROR);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executePlanWithGoal(goal);
  };

  const handleSelectTemplate = (templateGoal: string, runImmediately = false) => {
    setGoal(templateGoal);
    if (runImmediately) {
      executePlanWithGoal(templateGoal);
    }
  };

  const filteredTemplates = selectedCategory === 'All'
    ? PLANNING_TEMPLATES
    : PLANNING_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-4">
          <i className="fa-solid fa-diagram-project"></i>
          Autonomous LangGraph Agent Engine
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
          Agentic Project & Strategic Planner
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-base">
          Define any real-world project, event, or initiative. Watch the agentic workflow decompose objectives, validate feasibility, outline execution milestones, and critically reflect.
        </p>
      </header>

      {/* Input Section */}
      <section className="mb-6 sticky top-4 z-20">
        <form onSubmit={handleSubmit} className="relative group shadow-2xl">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={isProcessing}
            placeholder="e.g., Plan a 6-week residential kitchen remodeling project from demolition to inspection..."
            className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl py-4 pl-6 pr-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-md text-white placeholder-slate-500 text-sm md:text-base shadow-xl"
          />
          <button
            type="submit"
            disabled={isProcessing || !goal.trim()}
            className="absolute right-2.5 top-2.5 bottom-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-md text-sm"
          >
            {isProcessing ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <i className="fa-solid fa-play"></i>
            )}
            Run Plan
          </button>
        </form>
      </section>

      {/* Project Planning Templates Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <i className="fa-solid fa-lightbulb text-amber-400"></i>
            Explore Planning Templates
          </span>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg transition-all font-medium whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between group ${
                goal === template.goal
                  ? 'bg-blue-950/40 border-blue-500/60 ring-1 ring-blue-500/50'
                  : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 group-hover:text-blue-400 transition-colors text-base">
                    <i className={template.icon}></i>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-tight text-blue-400/90 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                    {template.badge}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-white">
                  {template.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {template.goal}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex items-center justify-between gap-1">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSelectTemplate(template.goal, false)}
                  className="text-[11px] text-slate-400 hover:text-slate-200 hover:underline cursor-pointer disabled:opacity-50"
                >
                  Load prompt
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSelectTemplate(template.goal, true)}
                  className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer disabled:opacity-50 group-hover:translate-x-0.5 transition-transform"
                >
                  Run <i className="fa-solid fa-arrow-right text-[9px]"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Error View */}
      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-4 animate-in slide-in-from-top-4 duration-300">
          <i className="fa-solid fa-circle-exclamation text-red-500 mt-1"></i>
          <div>
            <h4 className="font-bold text-red-400">Agent Stalled</h4>
            <p className="text-sm text-red-300/80">{error}</p>
          </div>
        </div>
      )}

      {/* Main Execution View */}
      <main className="glass border border-slate-800 rounded-3xl p-8 shadow-inner overflow-hidden">
        <AgentDashboard state={currentState} data={agentData} />
      </main>

      {/* Footer Info */}
      <footer className="mt-12 text-center text-slate-500 text-sm">
        <p>Built with Google Gemini 3.8 Flash & LangGraph Logic Principles</p>
        <div className="mt-4 flex justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Feasibility Validation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Sequential Milestones</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span>Critical Reflection</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
