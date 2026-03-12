import React, { useState, useEffect } from 'react';
import { Plus, Cpu, ChevronRight, Settings2, Link2, Factory } from 'lucide-react';
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
        if (!formData.materialId) return alert('Please select a material batch');
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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Manufactured Components</h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Traceable parts created from raw material stock</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary bg-slate-900 hover:bg-black"
                >
                    <Plus size={18} />
                    <span>Register Component</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {components.length === 0 ? (
                    <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <Factory size={32} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium">No component logs found in current production shift</p>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr>
                                        <th className="table-header">Component Serial</th>
                                        <th className="table-header">Part Category</th>
                                        <th className="table-header">Material Linkage</th>
                                        <th className="table-header">Machining Station</th>
                                        <th className="table-header text-right">Audit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {components.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50 group transition-colors">
                                            <td className="table-cell">
                                                <div className="font-bold text-slate-800 mono flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    {c.componentId}
                                                </div>
                                            </td>
                                            <td className="table-cell">
                                                <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                                                    {c.type}
                                                </span>
                                            </td>
                                            <td className="table-cell">
                                                <div className="flex items-center gap-2 group/link">
                                                    <Link2 size={12} className="text-slate-400 group-hover/link:text-blue-500 transition-colors" />
                                                    <div>
                                                        <p className="font-bold text-slate-700 text-xs mono capitalize">{c.material?.materialId}</p>
                                                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">HT-{c.material?.heatNumber}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="table-cell">
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                                    <Settings2 size={13} strokeWidth={2.5} />
                                                    {c.machine || 'Bench Assembly'}
                                                </div>
                                            </td>
                                            <td className="table-cell text-right">
                                                <button className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-100 hover:text-slate-600 transition-all">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal for Component Entry */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Cpu size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Component Record</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Link a manufactured part to a raw batch.</p>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Serial Number</label>
                                <input
                                    type="text"
                                    value={formData.componentId}
                                    onChange={(e) => setFormData({ ...formData, componentId: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g. SN-CMP-001"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Part Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="input-field cursor-pointer"
                                    >
                                        <option value="Body">Body</option>
                                        <option value="Seat">Seat</option>
                                        <option value="Stem">Stem</option>
                                        <option value="Disc">Disc</option>
                                        <option value="Bonnet">Bonnet</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Workstation</label>
                                    <input
                                        type="text"
                                        value={formData.machine}
                                        onChange={(e) => setFormData({ ...formData, machine: e.target.value })}
                                        className="input-field"
                                        placeholder="CNC / Manual"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Parent Batch</label>
                                <select
                                    value={formData.materialId}
                                    onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
                                    className="input-field cursor-pointer"
                                    required
                                >
                                    <option value="">Select Resource...</option>
                                    {materials.map(m => (
                                        <option key={m.id} value={m.id}>{m.materialId} (Heat: {m.heatNumber})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary justify-center text-sm">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary bg-blue-600 hover:bg-blue-700 border-none justify-center text-sm font-bold">Log Component</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Components;
