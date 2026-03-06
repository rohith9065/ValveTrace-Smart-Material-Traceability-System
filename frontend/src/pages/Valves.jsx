import React, { useState, useEffect } from 'react';
import { Plus, HardDrive, CheckCircle2, ArrowRight } from 'lucide-react';
import axios from 'axios';

const Valves = () => {
    const [valves, setValves] = useState([]);
    const [components, setComponents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssembleOpen, setIsAssembleOpen] = useState(false);
    const [selectedValve, setSelectedValve] = useState(null);
    const [selectedComponents, setSelectedComponents] = useState([]);

    const [formData, setFormData] = useState({
        valveId: '',
        serialNumber: '',
    });

    const fetchData = async () => {
        try {
            const [vRes, cRes] = await Promise.all([
                axios.get('/api/valves'),
                axios.get('/api/components')
            ]);
            setValves(vRes.data);
            setComponents(cRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/valves', formData);
            setIsModalOpen(false);
            setFormData({ valveId: '', serialNumber: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || 'Creation failed');
        }
    };

    const handleAssemble = async () => {
        if (selectedComponents.length === 0) return alert('Select components');
        try {
            await axios.post('/api/valves/assemble', {
                valveId: selectedValve.id,
                componentIds: selectedComponents
            });
            setIsAssembleOpen(false);
            setSelectedComponents([]);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || 'Assembly failed');
        }
    };

    const toggleComponent = (id) => {
        setSelectedComponents(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Finished Goods</h2>
                    <p className="text-neutral-500 mt-1 text-sm font-medium">Final unit registration and bill-of-materials linking</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-accent-yellow border border-yellow-500 hover:bg-yellow-400 text-black px-6 py-2.5 rounded-xl flex items-center gap-2 font-black text-xs transition-colors uppercase tracking-widest"
                >
                    <Plus size={16} /> Register Unit
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {valves.length === 0 ? (
                    <div className="bg-white border border-neutral-200 border-dashed rounded-3xl p-16 text-center text-neutral-400">
                        <HardDrive size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="text-sm font-black uppercase tracking-widest">No production units documented</p>
                    </div>
                ) : (
                    <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-neutral-50 text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-neutral-100">
                                    <th className="px-8 py-5">Unit ID</th>
                                    <th className="px-8 py-5">Serial Hash</th>
                                    <th className="px-8 py-5">Life Cycle</th>
                                    <th className="px-8 py-5">Linked Parts</th>
                                    <th className="px-8 py-5 text-right">Audit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {valves.map((v) => (
                                    <tr key={v.id} className="hover:bg-neutral-50 transition-colors text-sm">
                                        <td className="px-8 py-6 font-black text-black uppercase tracking-tight">{v.valveId}</td>
                                        <td className="px-8 py-6 text-neutral-400 font-bold uppercase text-xs tracking-widest">{v.serialNumber}</td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded border ${v.assemblyStatus === 'READY FOR DISPATCH' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-neutral-50 text-neutral-700 border-neutral-100'
                                                }`}>
                                                {v.assemblyStatus}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex -space-x-2 overflow-hidden">
                                                {v.components?.length > 0 ? v.components.map((c, i) => (
                                                    <div key={i} className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-neutral-900 flex items-center justify-center text-[8px] font-black text-white hover:z-10 transition-transform hover:scale-110">
                                                        {c.component?.type[0]}
                                                    </div>
                                                )) : <span className="text-[10px] text-neutral-300 font-bold uppercase tracking-widest">Awaiting Assembly</span>}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {v.assemblyStatus === 'Pending' ? (
                                                <button
                                                    onClick={() => { setSelectedValve(v); setIsAssembleOpen(true); }}
                                                    className="bg-black text-white text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-widest transition-colors scale-95 hover:scale-100"
                                                >
                                                    Build Unit
                                                </button>
                                            ) : (
                                                <button className="text-neutral-300 hover:text-black transition-colors">
                                                    <ArrowRight size={20} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-neutral-200 w-full max-w-md rounded-3xl p-10">
                        <h3 className="text-2xl font-black text-black mb-8 tracking-tighter uppercase">Unit Registration</h3>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-neutral-400 mb-2 uppercase tracking-[0.2em]">Valve Identifier</label>
                                <input
                                    type="text"
                                    value={formData.valveId}
                                    onChange={(e) => setFormData({ ...formData, valveId: e.target.value })}
                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-4 text-black font-bold focus:border-accent-yellow outline-none"
                                    placeholder="VLV-PRE-001"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-neutral-400 mb-2 uppercase tracking-[0.2em]">Customer Serial</label>
                                <input
                                    type="text"
                                    value={formData.serialNumber}
                                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-4 text-black font-bold focus:border-accent-yellow outline-none"
                                    placeholder="SN-ALPHA-01"
                                    required
                                />
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-4 rounded-xl border border-neutral-200 text-neutral-500 font-black text-xs uppercase tracking-widest">Cancel</button>
                                <button type="submit" className="flex-1 bg-black text-white font-black px-4 py-4 rounded-xl text-xs uppercase tracking-widest">Submit Unit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isAssembleOpen && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-neutral-200 w-full max-w-lg rounded-[2.5rem] p-12">
                        <div className="mb-10 text-center">
                            <h3 className="text-3xl font-black text-black tracking-tight uppercase">Lock Bill of Materials</h3>
                            <p className="text-neutral-500 text-sm mt-1 font-medium">Linking authorized components to unit {selectedValve?.valveId}</p>
                        </div>
                        <div className="max-h-72 overflow-y-auto space-y-3 mb-10 pr-2">
                            {components.map(c => (
                                <div
                                    key={c.id}
                                    onClick={() => toggleComponent(c.id)}
                                    className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${selectedComponents.includes(c.id) ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-neutral-50 border-neutral-100 hover:border-neutral-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black uppercase text-[10px] ${selectedComponents.includes(c.id) ? 'bg-neutral-800 border-neutral-700 text-yellow-500' : 'bg-white border-neutral-200 text-black'
                                            }`}>
                                            {c.type.substring(0, 3)}
                                        </div>
                                        <div>
                                            <p className="font-black text-sm uppercase tracking-tight">{c.componentId}</p>
                                            <p className={`text-[9px] font-bold uppercase tracking-widest ${selectedComponents.includes(c.id) ? 'text-neutral-400' : 'text-neutral-400'}`}>
                                                {c.type} • Heat: {c.material?.heatNumber}
                                            </p>
                                        </div>
                                    </div>
                                    {selectedComponents.includes(c.id) && <CheckCircle2 size={24} className="text-yellow-500" />}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsAssembleOpen(false)}
                                className="flex-1 px-4 py-4 rounded-xl border border-neutral-200 text-neutral-400 font-black text-xs uppercase tracking-widest"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleAssemble}
                                className="flex-1 bg-accent-yellow border border-yellow-500 text-black font-black px-4 py-4 rounded-xl text-xs uppercase tracking-widest"
                            >
                                Assemble Unit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Valves;
