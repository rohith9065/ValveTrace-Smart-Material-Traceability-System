import React, { useState, useEffect } from 'react';
import { Box, Cpu, HardDrive, Activity, Calendar, Download, TrendingUp, ArrowUpRight } from 'lucide-react';
import axios from 'axios';

const StatCard = ({ label, value, subtext, icon, trend }) => (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-500 border border-slate-100">
                {icon}
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                    <TrendingUp size={12} />
                    {trend}
                </div>
            )}
        </div>
        <div>
            <h3 className="text-slate-500 font-semibold text-xs uppercase tracking-wider">{label}</h3>
            <div className="flex items-baseline gap-2 mt-1">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h2>
                <span className="text-[10px] font-medium text-slate-400">Total Units</span>
            </div>
            {subtext && <p className="text-[10px] font-medium text-slate-400 mt-2 italic">{subtext}</p>}
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({ materials: 0, components: 0, valves: 0, logs: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [m, c, v] = await Promise.all([
                    axios.get('/api/materials'),
                    axios.get('/api/components'),
                    axios.get('/api/valves')
                ]);
                setStats({
                    materials: m.data.length,
                    components: c.data.length,
                    valves: v.data.length,
                    logs: 124
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">System Live</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Industrial Overview</h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Real-time telemetry and production floor status</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm">
                        <Calendar size={14} /> FILTER PERIOD
                    </button>
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                        <Download size={14} /> EXPORT ANALYTICS
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Raw Materials"
                    value={stats.materials}
                    icon={<Box size={20} />}
                    trend="+12.3%"
                    subtext="Last updated 14 mins ago"
                />
                <StatCard
                    label="WIP Components"
                    value={stats.components}
                    icon={<Cpu size={20} />}
                    trend="+3.1%"
                    subtext="Processing in Stage 2/4"
                />
                <StatCard
                    label="Finished Valves"
                    value={stats.valves}
                    icon={<HardDrive size={20} />}
                    trend="+8.5%"
                    subtext="Ready for final inspection"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Production Output</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Monthly Units Velocity</p>
                        </div>
                        <select className="bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-500 px-3 py-1.5 rounded-lg outline-none cursor-pointer">
                            <option>Last 30 Days</option>
                            <option>Last 90 Days</option>
                        </select>
                    </div>

                    <div className="flex items-end justify-between h-44 gap-3">
                        {[40, 65, 45, 90, 75, 55, 80, 110, 85, 100, 70, 95].map((h, i) => (
                            <div key={i} className="flex-1 bg-slate-50 relative group rounded-t-lg h-full">
                                <div
                                    className="absolute bottom-0 left-0 w-full bg-blue-500/80 group-hover:bg-blue-600 transition-all duration-300 rounded-t-md cursor-pointer shadow-sm"
                                    style={{ height: `${(h / 120) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {h} Units
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mt-6 tracking-widest border-t border-slate-50 pt-4 px-2">
                        <span>WK 01</span>
                        <span>WK 02</span>
                        <span>WK 03</span>
                        <span>WK 04</span>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Operational Log</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">System Audit Trail</p>
                        </div>
                        <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-all uppercase tracking-widest flex items-center gap-1">
                            Live Monitor <ArrowUpRight size={14} />
                        </button>
                    </div>

                    <div className="space-y-5 flex-1 overflow-auto pr-2">
                        {[
                            { title: 'Valve VLV-PR-02 Verified', stage: 'Testing', time: '2m' },
                            { title: 'Material Batch #881 Received', stage: 'Inbound', time: '14m' },
                            { title: 'Stem Component Machined', stage: 'Stage 2', time: '41m' },
                            { title: 'Unit QA Certification Done', stage: 'Inspection', time: '1h' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 group cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                                    <Activity size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900 leading-tight">{item.title}</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wide">STAGE: {item.stage}</p>
                                </div>
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-slate-500">{item.time} ago</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
