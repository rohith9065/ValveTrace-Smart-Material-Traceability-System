import React, { useState } from 'react';
import { Scan, History } from 'lucide-react';
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
                entity_id: scanId,
                entity_type: isValve ? 'Valve' : 'Component',
                process_stage: stage,
                machine: machine,
                operator: 'OP-042',
                status: 'Completed'
            });
            setLogs([res.data, ...logs]);
            setScanId('');
            alert('Event documented in timeline');
        } catch (err) {
            alert(err.response?.data?.error || 'Logging failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Shop Terminal</h2>
                <p className="text-neutral-500 mt-1 text-sm font-medium">Real-time event logging for production units</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border border-neutral-200 rounded-3xl p-10">
                        <h3 className="text-[10px] font-black text-black uppercase tracking-[0.3em] mb-10">Input Interface</h3>
                        <form onSubmit={handleLog} className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-neutral-400 mb-3 uppercase tracking-[0.2em]">Identify Unit (Scan QR)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={scanId}
                                        autoFocus
                                        onChange={(e) => setScanId(e.target.value.toUpperCase())}
                                        className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-5 py-5 text-black outline-none focus:border-accent-yellow font-black text-2xl tracking-tight"
                                        placeholder="SCANNING..."
                                        required
                                    />
                                    <Scan size={20} className="absolute right-5 top-5 text-neutral-200" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-neutral-400 mb-3 uppercase tracking-[0.2em]">Factory Process</label>
                                <select
                                    value={stage}
                                    onChange={(e) => setStage(e.target.value)}
                                    className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-5 py-5 text-black outline-none focus:border-accent-yellow text-sm font-black uppercase tracking-widest appearance-none cursor-pointer h-16"
                                >
                                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-neutral-400 mb-3 uppercase tracking-[0.2em]">Station ID</label>
                                <input
                                    type="text"
                                    value={machine}
                                    onChange={(e) => setMachine(e.target.value)}
                                    className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-5 py-5 text-black outline-none focus:border-accent-yellow text-sm font-black uppercase tracking-widest"
                                    placeholder="e.g. MC-01"
                                />
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-black hover:bg-neutral-900 disabled:opacity-50 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all mt-4 uppercase text-xs tracking-[0.3em]"
                            >
                                {loading ? 'SYNCING...' : 'Authorize update'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="bg-white border border-neutral-200 rounded-3xl p-10 h-full min-h-[500px]">
                        <h3 className="text-[10px] font-black text-black uppercase tracking-[0.3em] mb-10">Real-time Activity</h3>

                        {logs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-80 text-neutral-100">
                                <History size={64} className="mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">Awaiting production scans</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {logs.map((log, i) => (
                                    <div key={i} className="flex items-center gap-6 p-6 bg-neutral-50 border border-neutral-100 rounded-2xl border-l-[6px] border-l-black group">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-black text-black text-2xl tracking-tighter uppercase">{log.entityId}</p>
                                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-0.5">{log.entityType}</p>
                                                </div>
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black px-3 py-1.5 rounded-lg border border-neutral-800">
                                                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-5">
                                                <span className="text-xs font-black text-black uppercase tracking-[0.1em]">{log.processStage}</span>
                                                <div className="h-[2px] w-6 bg-neutral-200"></div>
                                                <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">{log.machine || 'AUTO-WORKSTATION'}</span>
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
