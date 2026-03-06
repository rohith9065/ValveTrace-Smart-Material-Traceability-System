import React, { useState, useEffect } from 'react';
import { Plus, Cpu, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Components = () => {
    const [components, setComponents] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        componentId: '',
        type: 'Body',
        materialId: '',
        machine: '',
    });

    const fetchData = async () => {
        try {
            const [cRes, mRes] = await Promise.all([
                axios.get('/api/components'),
                axios.get('/api/materials')
            ]);
            setComponents(cRes.data);
            setMaterials(mRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.materialId) return alert('Please select a material');
        try {
            await axios.post('/api/components', formData);
            setIsModalOpen(false);
            setFormData({ componentId: '', type: 'Body', materialId: '', machine: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || 'Creation failed');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Factory Components</h2>
                    <p className="text-neutral-500 mt-1 text-sm font-medium">Individual parts manufactured from batch stock</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-neutral-900 border border-neutral-800 hover:bg-black text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-black text-xs transition-colors uppercase tracking-widest"
                >
                    <Plus size={16} /> New Component
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {components.length === 0 ? (
                    <div className="bg-white border border-neutral-200 border-dashed rounded-3xl p-16 text-center text-neutral-400">
                        <Cpu size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="text-sm font-black uppercase tracking-widest">No component records found</p>
                    </div>
                ) : (
                    <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-neutral-50 text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-neutral-100">
                                    <th className="px-8 py-5">Component ID</th>
                                    <th className="px-8 py-5">Type / Part</th>
                                    <th className="px-8 py-5">Batch Linkage</th>
                                    <th className="px-8 py-5">Workstation</th>
                                    <th className="px-8 py-5 text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {components.map((c) => (
                                    <tr key={c.id} className="hover:bg-neutral-50 transition-colors text-sm">
                                        <td className="px-8 py-6">
                                            <span className="font-black text-black uppercase tracking-tight">{c.componentId}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="bg-neutral-900 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">{c.type}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-black font-black uppercase text-xs">{c.material?.materialId}</p>
                                            <p className="text-[10px] text-neutral-400 font-bold mt-0.5 tracking-widest uppercase">HT-{c.material?.heatNumber}</p>
                                        </td>
                                        <td className="px-8 py-6 text-neutral-500 font-bold uppercase text-xs">{c.machine || 'MANUAL'}</td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="text-neutral-300 hover:text-black transition-colors">
                                                <ChevronRight size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-neutral-200 w-full max-w-md rounded-3xl p-10">
                        <h3 className="text-2xl font-black text-black mb-8 tracking-tighter uppercase">Manufacture Record</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-neutral-400 mb-2 uppercase tracking-[0.2em]">Component Serial</label>
                                <input
                                    type="text"
                                    value={formData.componentId}
                                    onChange={(e) => setFormData({ ...formData, componentId: e.target.value })}
                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-4 text-black font-bold focus:border-accent-yellow outline-none"
                                    placeholder="CMP-XX-001"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-neutral-400 mb-2 uppercase tracking-[0.2em]">Part Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-4 text-black font-bold outline-none focus:border-accent-yellow"
                                    >
                                        <option value="Body">Body</option>
                                        <option value="Seat">Seat</option>
                                        <option value="Stem">Stem</option>
                                        <option value="Disc">Disc</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-neutral-400 mb-2 uppercase tracking-[0.2em]">Machining Stn</label>
                                    <input
                                        type="text"
                                        value={formData.machine}
                                        onChange={(e) => setFormData({ ...formData, machine: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-4 text-black font-bold outline-none focus:border-accent-yellow"
                                        placeholder="CNC-12"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-neutral-400 mb-2 uppercase tracking-[0.2em]">Source Heat Number</label>
                                <select
                                    value={formData.materialId}
                                    onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-4 text-black font-bold outline-none focus:border-accent-yellow h-14"
                                    required
                                >
                                    <option value="">Select Material...</option>
                                    {materials.map(m => (
                                        <option key={m.id} value={m.id}>{m.materialId} (Heat: {m.heatNumber})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-4 border border-neutral-200 rounded-xl text-neutral-500 font-black text-xs uppercase tracking-widest">Cancel</button>
                                <button type="submit" className="flex-1 bg-black text-white font-black px-4 py-4 rounded-xl text-xs uppercase tracking-widest">Authorize Part</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Components;
