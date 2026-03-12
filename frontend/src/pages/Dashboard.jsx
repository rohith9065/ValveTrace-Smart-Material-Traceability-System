import React, { useState, useEffect } from 'react';
import {
    Box,
    Cpu,
    HardDrive,
    Activity,
    Calendar,
    Download,
    TrendingUp,
    ArrowUpRight,
    Truck,
    ShieldCheck,
    CheckCircle2,
    Factory
} from 'lucide-react';
import axios from 'axios';

const StatCard = ({ label, value, subtext, icon, trend, colorClass = "blue" }) => (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 bg-${colorClass}-50 rounded-lg text-${colorClass}-600 border border-${colorClass}-100 transition-colors group-hover:bg-${colorClass}-600 group-hover:text-white`}>
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
                {subtext && <span className="text-[10px] font-medium text-slate-400">{subtext}</span>}
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        materials: 0,
        components: 0,
        valves: 0,
        dispatched: 0,
        tested: 0
    });

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
                    dispatched: v.data.filter(x => x.assemblyStatus === 'Dispatched').length,
                    tested: v.data.filter(x => x.assemblyStatus === 'Tested' || x.assemblyStatus === 'Dispatched').length
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
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Operational Telemetry Live</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Factory Control Center</h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Real-time oversight of materials, manufacturing and distribution</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm">
                        <ShieldCheck size={14} /> COMPLIANCE MODE
                    </button>
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-black transition-colors shadow-lg shadow-slate-200">
                        <Download size={14} /> EXPORT AUDIT LOG
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                    label="Materials"
                    value={stats.materials}
                    icon={<Box size={20} />}
                    colorClass="blue"
                    subtext="Heat Batches"
                />
                <StatCard
                    label="Machining"
                    value={stats.components}
                    icon={<Cpu size={20} />}
                    colorClass="purple"
                    subtext="Part Serials"
                />
                <StatCard
                    label="Assembled"
                    value={stats.valves}
                    icon={<Factory size={20} />}
                    colorClass="amber"
                    subtext="Valve Units"
                />
                <StatCard
                    label="Verified"
                    value={stats.tested}
                    icon={<CheckCircle2 size={20} />}
                    colorClass="emerald"
                    trend="+14%"
                    subtext="QC Approved"
                />
                <StatCard
                    label="Dispatched"
                    value={stats.dispatched}
                    icon={<Truck size={20} />}
                    colorClass="slate"
                    subtext="Shipped Out"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Production Velocity Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Manufacturing Pipeline</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Units Output vs Target</p>
                        </div>
                        <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
                            <button className="px-3 py-1 text-[10px] font-bold bg-white shadow-sm rounded-md text-slate-900">Weekly</button>
                            <button className="px-3 py-1 text-[10px] font-bold text-slate-400">Monthly</button>
                        </div>
                    </div>

                    <div className="flex items-end justify-between h-56 gap-3">
                        {[40, 65, 45, 90, 75, 55, 80, 110, 85, 100, 70, 95].map((h, i) => (
                            <div key={i} className="flex-1 bg-slate-50 relative group rounded-t-lg h-full">
                                <div
                                    className={`absolute bottom-0 left-0 w-full ${i > 8 ? 'bg-blue-600' : 'bg-slate-300'} group-hover:bg-blue-500 transition-all duration-300 rounded-t-lg cursor-pointer`}
                                    style={{ height: `${(h / 120) * 100}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                                        {h} units • WK {i + 1}
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                    W{i + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Audit Trail Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Traceability Loop</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">System-Wide Verification Log</p>
                        </div>
                        <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-all uppercase tracking-widest flex items-center gap-1">
                            Full Registry <ArrowUpRight size={14} />
                        </button>
                    </div>

                    <div className="space-y-2 flex-1 overflow-auto pr-2">
                        {[
                            { title: 'Valve VLV-PR-02 Dispatched', stage: 'Distribution', time: '2m', color: 'slate' },
                            { title: 'Pressure Test #981 Passed', stage: 'Quality', time: '14m', color: 'emerald' },
                            { title: 'Material Batch #HT-552 Registry', stage: 'Material', time: '41m', color: 'blue' },
                            { title: 'New Unit B-102 Assembled', stage: 'Assembly', time: '1h', color: 'amber' },
                            { title: 'Stem Part #SN-881 Machined', stage: 'Machining', time: '3h', color: 'purple' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 group cursor-pointer p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                <div className={`w-10 h-10 rounded-xl bg-${item.color}-50 border border-${item.color}-100 flex items-center justify-center text-${item.color}-600 group-hover:scale-110 transition-transform`}>
                                    <Activity size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900 leading-tight">{item.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`w-1.5 h-1.5 rounded-full bg-${item.color}-400`}></div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{item.stage}</p>
                                    </div>
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
