import React, { useState } from 'react';
import { Scan, History, User, Building2, Terminal } from 'lucide-react';
import axios from 'axios';

const ProcessTracking = () => {
    const [scanId, setScanId] = useState('');
    const [stage, setStage] = useState('Machining');
    const [machine, setMachine] = useState('');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const STAGES = [
        'Material Receipt', 'Machining', 'Heat Treatment',
        'Component Creation', 'Assembly', 'Testing',
        'Painting', 'Packing', 'Dispatch'
    ];

    const handleLog = async (e) => {
        e.preventDefault();
        if (!scanId) return alert('Scan an entity first');
        setLoading(true);
        try {
            const isValve = scanId.startsWith('VLV');
            const res = await axios.post('/api/process/scan', {
                entityId: scanId,
                entityType: isValve ? 'Valve' : 'Component',
                processStage: stage,
                machine: machine,
                operator: 'Rohith Admin',
                status: 'Completed'
            });
            setLogs([res.data, ...logs]);
            setScanId('');
            // Optional: Show success toast
        } catch (err) {
            alert(err.response?.data?.error || 'Logging failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Shop Floor Terminal</h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Capture production events and workstation telemetry in real-time.</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 animate-pulse">
                    <Terminal size={24} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Zone */}
                <div className="lg:col-span-5">
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Data Acquisition</h3>

                        <form onSubmit={handleLog} className="space-y-8">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    <Scan size={12} className="text-blue-500" /> Scanner Input (Asset ID)
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={scanId}
                                        autoFocus
                                        onChange={(e) => setScanId(e.target.value.toUpperCase())}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-2xl tracking-tight transition-all"
                                        placeholder="SCAN ID..."
                                        required
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Current Process</label>
                                    <select
                                        value={stage}
                                        onChange={(e) => setStage(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-slate-700 outline-none focus:border-blue-500 text-xs font-bold uppercase tracking-widest cursor-pointer shadow-sm appearance-none"
                                    >
                                        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Station / Machine</label>
                                    <div className="relative">
                                        <Building2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={machine}
                                            onChange={(e) => setMachine(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-5 py-4 text-slate-700 outline-none focus:border-blue-500 text-xs font-bold uppercase tracking-widest"
                                            placeholder="STATION-01"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-slate-900 hover:bg-black disabled:opacity-50 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all mt-4 uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200"
                            >
                                {loading ? 'Commiting Transaction...' : 'Commit Worklog Entry'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Event Feed */}
                <div className="lg:col-span-7">
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 h-full min-h-[500px] shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <History size={14} /> Real-time Audit Feed
                            </h3>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">SESSION ACTIVE</span>
                        </div>

                        {logs.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                                <div className="p-8 bg-slate-50 rounded-[3rem] mb-6">
                                    <Scan size={48} />
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Awaiting acquisition from terminal scanner</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {logs.map((log, i) => (
                                    <div key={i} className="flex items-center gap-6 p-6 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-blue-300 transition-colors animate-in slide-in-from-left-4 duration-300">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors shadow-sm">
                                            {log.entityType === 'Valve' ? <Scan size={20} /> : <Terminal size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-slate-900 text-lg mono leading-tight">{log.entityId}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${log.entityType === 'Valve' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                            {log.entityType}
                                                        </span>
                                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Operator: {log.operator || 'SYSTEM'}</span>
                                                    </div>
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                                                    <History size={12} />
                                                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 mt-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{log.processStage}</span>
                                                </div>
                                                <div className="h-4 w-px bg-slate-200"></div>
                                                <div className="flex items-center gap-2">
                                                    <Building2 size={12} className="text-slate-400" />
                                                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{log.machine || 'GENERAL-UNIT'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcessTracking;
