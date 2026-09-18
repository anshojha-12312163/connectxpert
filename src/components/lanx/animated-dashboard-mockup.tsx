import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  LineChart,
  FolderOpen,
  Users,
  Settings,
  Bell,
  Search,
  ChevronDown
} from "lucide-react";

export function AnimatedDashboardMockup() {
  const [data, setData] = useState({
    users: 24932,
    projects: 1204,
    revenue: 84320,
    conversion: 3.6,
    bars: Array.from({ length: 24 }, () => Math.random() * 100),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        users: prev.users + Math.floor(Math.random() * 50) - 10,
        projects: prev.projects + Math.floor(Math.random() * 5),
        revenue: prev.revenue + Math.floor(Math.random() * 500) - 100,
        conversion: Number((prev.conversion + (Math.random() * 0.2 - 0.1)).toFixed(2)),
        bars: Array.from({ length: 24 }, () => Math.random() * 100),
      }));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full min-h-[600px] flex rounded-xl overflow-hidden bg-[#0A0D14] text-white font-sans border border-white/5">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/5 bg-[#0D111A] p-4 flex flex-col hidden md:flex">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">N</div>
          <span className="font-semibold text-lg">Nexora</span>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600/10 text-blue-500">
            <LayoutDashboard className="size-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 transition-colors">
            <LineChart className="size-4" />
            <span className="text-sm font-medium">Analytics</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 transition-colors">
            <FolderOpen className="size-4" />
            <span className="text-sm font-medium">Projects</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 transition-colors">
            <Users className="size-4" />
            <span className="text-sm font-medium">Team</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 transition-colors">
            <Settings className="size-4" />
            <span className="text-sm font-medium">Settings</span>
          </div>
        </nav>

        <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-blue-900/40 to-blue-900/10 border border-blue-500/20">
          <div className="size-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
            <span className="text-blue-400 text-xs">💎</span>
          </div>
          <h4 className="text-sm font-semibold mb-1">Upgrade to Pro</h4>
          <p className="text-xs text-slate-400 mb-3">Unlock advanced analytics and features.</p>
          <button className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors text-xs font-semibold">
            Upgrade
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0d1a]">
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg w-64">
            <Search className="size-4" />
            <span className="text-sm">Search anything...</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell className="size-5" />
              <span className="absolute top-0 right-0 size-2 rounded-full bg-blue-500"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/5">
              <div className="size-8 rounded-full bg-slate-700 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white leading-none">Alex Carter</p>
                <p className="text-xs text-slate-400 mt-1">Product Designer</p>
              </div>
              <ChevronDown className="size-4 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Dashboard Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Good evening, Alex</h1>
              <p className="text-slate-400 text-sm">Here's what's happening with your product today.</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Users className="size-4 text-blue-400" /> Total Users
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <motion.span 
                  key={data.users}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold"
                >
                  {data.users.toLocaleString()}
                </motion.span>
                <span className="text-xs text-green-400">+12%</span>
              </div>
              <p className="text-xs text-slate-500">+2,638 this month</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <FolderOpen className="size-4 text-indigo-400" /> Active Projects
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <motion.span 
                  key={data.projects}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold"
                >
                  {data.projects.toLocaleString()}
                </motion.span>
                <span className="text-xs text-green-400">+8%</span>
              </div>
              <p className="text-xs text-slate-500">+89 this month</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span className="text-emerald-400 font-bold">$</span> Revenue
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <motion.span 
                  key={data.revenue}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold"
                >
                  ${data.revenue.toLocaleString()}
                </motion.span>
                <span className="text-xs text-green-400">+24%</span>
              </div>
              <p className="text-xs text-slate-500">+$16,320 this month</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <LineChart className="size-4 text-orange-400" /> Conversion Rate
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <motion.span 
                  key={data.conversion}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold"
                >
                  {data.conversion}%
                </motion.span>
                <span className="text-xs text-green-400">+1.2%</span>
              </div>
              <p className="text-xs text-slate-500">+0.4% this month</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2 p-5 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-sm text-slate-200">User Activity</h3>
                <div className="px-3 py-1 rounded border border-white/10 text-xs text-slate-300 flex items-center gap-2">
                  Last 30 days <ChevronDown className="size-3" />
                </div>
              </div>
              
              <div className="h-48 w-full flex items-end gap-1.5">
                {data.bars.map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end h-full relative group">
                    <motion.div 
                      animate={{ height: `${height}%` }}
                      transition={{ type: "spring", stiffness: 50, damping: 15 }}
                      className="w-full bg-blue-500 hover:bg-blue-400 rounded-t-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
              <h3 className="absolute top-5 left-5 font-medium text-sm text-slate-200">Traffic Sources</h3>
              
              <div className="relative mt-8 size-40 rounded-full border-[12px] border-white/5 flex items-center justify-center">
                {/* Simulated Donut Chart Segments using SVGs */}
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                  <motion.circle 
                    cx="50" cy="50" r="44" 
                    fill="transparent" stroke="#3B82F6" strokeWidth="12" 
                    strokeDasharray="276" strokeDashoffset="110"
                    animate={{ strokeDashoffset: 100 + Math.random() * 40 }}
                    transition={{ duration: 1.5 }}
                  />
                  <motion.circle 
                    cx="50" cy="50" r="44" 
                    fill="transparent" stroke="#1D4ED8" strokeWidth="12" 
                    strokeDasharray="276" strokeDashoffset="240"
                    animate={{ strokeDashoffset: 230 + Math.random() * 20 }}
                    transition={{ duration: 1.5 }}
                  />
                </svg>
                <div className="text-center">
                  <div className="text-xl font-bold">24.9K</div>
                  <div className="text-xs text-slate-400">Total Users</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
