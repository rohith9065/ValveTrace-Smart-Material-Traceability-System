import React, { useState } from 'react';
import { Search, ArrowRight, Activity, Hexagon } from 'lucide-react';
import axios from 'axios';

const Traceability = () => {
    const [query, setQuery] = useState('');
    const [type, setType] = useState('valve');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTrace = async (e) => {
        e.preventDefault();
        if (!query) return;
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`/api/trace/${type}/${query}`);
            setData(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Record archive not found');
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Audit Engine</h2>
                <p className="text-neutral-500 mt-1 text-sm font-medium">Forward and backward data relationship mapping</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-3xl p-10 shadow-sm">
                <form onSubmit={handleTrace} className="flex gap-5">
                    <div className="w-64">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-5 text-black outline-none focus:border-accent-yellow h-full font-black text-xs uppercase tracking-[0.2em] appearance-none cursor-pointer"
                        >
                            <option value="valve">Backward (Valve ID)</option>
                            <option value="material">Forward (Material ID)</option>
                        </select>
                    </div>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-5 text-black outline-none focus:border-accent-yellow font-black text-2xl tracking-tighter uppercase"
                            placeholder={type === 'valve' ? 'ENTER IDENTIFIER...' : 'ENTER HEAT NUMBER...'}
                            required
                        />
                        <Search size={24} className="absolute right-5 top-5 text-neutral-200" />
                    </div>
                    <button
                        disabled={loading}
                        className="bg-black hover:bg-neutral-900 border border-neutral-800 text-white font-black px-12 py-5 rounded-2xl transition-all uppercase text-xs tracking-[0.3em]"
                    >
                        {loading ? 'ARCHIVING...' : 'Search Record'}
                    </button>
                </form>
            </div>

            {error && (
                <div className="bg-white border border-red-200 p-8 rounded-2xl text-red-600 text-center text-xs font-black uppercase tracking-[0.2em] border-l-8 border-l-red-600">
                    {error}
                </div>
            )}

            {data && type === 'valve' && (
                <div className="space-y-10">
                    <div className="bg-white border border-neutral-200 rounded-3xl p-12 shadow-sm">
                        <div className="flex justify-between items-start mb-20 border-b border-neutral-50 pb-10">
                            <div>
                                <p className="text-[10px] uppercase font-black text-neutral-400 tracking-[0.5em] mb-4 text-center md:text-left">Production Identity</p>
                                <h3 className="text-6xl font-black text-black tracking-tighter">{data.valveId}</h3>
                                <div className="flex items-center gap-6 mt-6">
                                    <p className="text-neutral-500 text-xs font-black uppercase tracking-widest border-r border-neutral-200 pr-6">SERIAL: <span className="text-black">{data.serialNumber}</span></p>
                                    <p className="text-neutral-500 text-xs font-black uppercase tracking-widest">RECORDED: <span className="text-black">{new Date(data.createdAt).toLocaleDateString()}</span></p>
                                </div>
                            </div>
                            <div className="bg-black text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] inline-block">
                                Status: <span className={data.assemblyStatus === 'READY FOR DISPATCH' ? 'text-green-400' : 'text-yellow-400'}>{data.assemblyStatus}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {data.components.map((vc, i) => (
                                <div key={i} className="bg-neutral-50 border border-neutral-100 p-8 rounded-3xl group hover:border-black transition-all">
                                    <div className="p-3 bg-white border border-neutral-200 rounded-xl w-fit mb-8 shadow-sm group-hover:bg-black group-hover:text-white transition-colors">
                                        <Hexagon size={20} />
                                    </div>
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">{vc.component.type}</p>
                                    <h4 className="text-2xl font-black text-black mb-8 uppercase tracking-tighter">{vc.component.componentId}</h4>

                                    <div className="space-y-4 border-t border-neutral-200 pt-6">
                                        <div className="flex justify-between text-[10px] font-black">
                                            <span className="text-neutral-400 uppercase tracking-widest">Heat Number</span>
                                            <span className="text-black font-black">{vc.component.material.heatNumber}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black">
                                            <span className="text-neutral-400 uppercase tracking-widest">Material</span>
                                            <span className="text-black font-black">{vc.component.material.grade}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-3xl p-12">
                        <h4 className="text-xs font-black text-black uppercase tracking-[0.4em] mb-16 flex items-center justify-center gap-4 bg-neutral-50 py-4 border border-neutral-100 rounded-2xl">
                            <Activity size={20} className="text-black" /> Manufacturing Fingerprint
                        </h4>
                        <div className="space-y-16 max-w-4xl mx-auto">
                            {data.logs.length === 0 ? (
                                <p className="text-neutral-300 text-xs uppercase font-black tracking-widest italic py-16 text-center border-4 border-dashed border-neutral-50 rounded-[3rem]">Historical logs unavailable</p>
                            ) : (
                                data.logs.map((log, i) => (
                                    <div key={i} className="relative flex gap-16 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-4 h-4 rounded-full bg-black ring-8 ring-neutral-50 group-hover:bg-yellow-500 transition-colors"></div>
                                            {i !== data.logs.length - 1 && <div className="w-1 flex-1 bg-neutral-50 my-4 rounded-full"></div>}
                                        </div>
                                        <div className="pb-4">
                                            <p className="text-[11px] text-neutral-400 font-black uppercase tracking-[0.2em]">{new Date(log.timestamp).toLocaleString()}</p>
                                            <p className="text-3xl font-black text-black mt-2 uppercase tracking-tighter group-hover:text-yellow-600 transition-colors">{log.processStage}</p>
                                            <p className="text-xs text-neutral-500 mt-4 font-bold border-l-4 border-black pl-4">
                                                WORKSTATION: <span className="text-black font-black">{log.machine || 'AUTO-STATION'}</span> • AUTHORIZED BY: <span className="text-black font-black uppercase">SYSTEM_ADMIN</span>
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {data && type === 'material' && (
                <div className="space-y-10">
                    <div className="bg-white border border-neutral-200 rounded-3xl p-12">
                        <div className="mb-20 border-b border-neutral-50 pb-10">
                            <p className="text-[10px] uppercase font-black text-neutral-400 tracking-[0.5em] mb-4">Raw Stock Certificate</p>
                            <h3 className="text-6xl font-black text-black tracking-tighter">{data.materialId}</h3>
                            <div className="flex items-center gap-10 mt-6 capitalize font-black text-[11px] text-neutral-500 uppercase tracking-widest">
                                <span>HEAT: <span className="text-black font-black">{data.heatNumber}</span></span>
                                <span>GRADE: <span className="text-black font-black">{data.grade}</span></span>
                                <span>SOURCE: <span className="text-black font-black">{data.supplier}</span></span>
                            </div>
                        </div>

                        <h4 className="text-[10px] font-black text-black uppercase tracking-[0.4em] mb-10 text-center underline decoration-neutral-200 underline-offset-8">Downstream Distribution</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {data.components.map((c, i) => (
                                <div key={i} className="bg-neutral-50 border border-neutral-100 p-8 rounded-3xl">
                                    <div className="flex justify-between items-start mb-8 border-b border-neutral-100 pb-4">
                                        <p className="font-black text-black text-xl tracking-tighter uppercase">{c.componentId}</p>
                                        <span className="text-[9px] font-black px-3 py-1.5 bg-black text-white rounded-lg uppercase tracking-widest">{c.type}</span>
                                    </div>
                                    <div className="space-y-5">
                                        <p className="text-[9px] text-neutral-400 uppercase font-black tracking-widest pl-2">Assigned To Units:</p>
                                        {c.valveComponents.length > 0 ? (
                                            <div className="space-y-3">
                                                {c.valveComponents.map((vc, j) => (
                                                    <div key={j} className="text-[11px] font-black text-black bg-white px-5 py-4 rounded-2xl border border-neutral-100 flex items-center justify-between group cursor-pointer hover:border-black transition-all shadow-sm">
                                                        {vc.valve.valveId}
                                                        <ArrowRight size={16} className="text-black opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-6 border-2 border-dashed border-neutral-200 rounded-3xl text-center">
                                                <p className="text-[10px] text-neutral-300 italic font-black uppercase tracking-widest text-center">In-Stock WIP</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Traceability;
