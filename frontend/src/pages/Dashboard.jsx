import React, { useState, useEffect } from 'react';
import { Box, Cpu, HardDrive, Activity, Calendar, Download } from 'lucide-react';
import axios from 'axios';

const StatCard = ({ label, value, subtext, accent }) => (
    <div className="bg-white border border-neutral-200 p-6 rounded-2xl">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-neutral-500 font-bold text-xs uppercase tracking-widest">{label}</h3>
        </div>
        <div className="space-y-1">
            <h2 className="text-4xl font-black text-black tracking-tight">{value}</h2>
            {subtext && <p className={`text-xs font-bold ${accent || 'text-neutral-400'}`}>{subtext}</p>}
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
        <div className="space-y-10">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter">Production Overview</h2>
                    <p className="text-neutral-500 mt-1 text-sm font-medium">Real-time status of the manufacturing floor</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-transform active:scale-95 border border-neutral-800">
                        <Calendar size={14} /> THIS MONTH
                    </button>
                    <button className="flex items-center gap-2 bg-accent-yellow text-black px-5 py-2.5 rounded-xl text-xs font-bold transition-transform active:scale-95 border border-yellow-500">
                        <Download size={14} /> EXPORT DATA
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Raw Materials"
                    value={stats.materials}
                    subtext="+ 12.3% OVER LAST MONTH"
                    accent="text-green-600"
                />
                <StatCard
                    label="WIP Components"
                    value={stats.components}
                    subtext="+ 3.3% OVER LAST MONTH"
                    accent="text-green-600"
                />
                <StatCard
                    label="Finished Valves"
                    value={stats.valves}
                    subtext="+ 7.1% OVER LAST MONTH"
                    accent="text-green-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-neutral-200 rounded-2xl p-8 h-80 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-black">Output History</h3>
                        <select className="bg-neutral-50 border border-neutral-200 text-[10px] font-bold text-neutral-500 px-3 py-1.5 rounded-lg outline-none uppercase tracking-widest">
                            <option>Daily status</option>
                        </select>
                    </div>
                    <div className="flex items-end justify-between h-40 gap-2">
                        {[40, 60, 45, 90, 75, 55, 80, 100, 65].map((h, i) => (
                            <div key={i} className="flex-1 bg-neutral-100 relative group rounded-t-lg">
                                <div
                                    className="absolute bottom-0 left-0 w-full bg-accent-yellow transition-all duration-300 rounded-t-sm"
                                    style={{ height: `${h}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-400 font-black uppercase mt-4 tracking-[0.2em]">
                        <span>JUN 03</span>
                        <span>JUN 12</span>
                        <span>JUN 21</span>
                        <span>JUN 30</span>
                    </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-2xl p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-8 text-black">
                        <h3 className="text-xl font-black uppercase tracking-tight">Recent Activity</h3>
                        <button className="text-[10px] font-black bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors uppercase tracking-widest">View all</button>
                    </div>

                    <div className="space-y-6 flex-1 overflow-auto pr-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-accent-yellow group-hover:bg-neutral-100 transition-colors">
                                    <Activity size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-black uppercase tracking-tight">Valve VLV-10{i} Verified</p>
                                    <p className="text-xs text-neutral-400 font-bold mt-0.5 uppercase tracking-wide">STAGE: TESTING BY SUPERVISOR</p>
                                </div>
                                <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">2m ago</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
