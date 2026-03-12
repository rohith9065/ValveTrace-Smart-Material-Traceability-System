import React, { useState, useEffect } from 'react';
import { Plus, Box, Download, ArrowUpRight, FileText, Search, Database } from 'lucide-react';
import axios from 'axios';

const Materials = () => {
    const [materials, setMaterials] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        materialId: '',
        heatNumber: '',
        supplier: '',
        grade: '',
    });

    const fetchMaterials = async () => {
        try {
            const res = await axios.get('/api/materials');
            setMaterials(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/materials', formData);
            setIsModalOpen(false);
            setFormData({ materialId: '', heatNumber: '', supplier: '', grade: '' });
            fetchMaterials();
        } catch (err) {
            alert(err.response?.data?.error || 'Registration failed');
        }
    };

    const filteredMaterials = materials.filter(m =>
        m.materialId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.heatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.grade.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Raw Materials</h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Inbound batch tracking and mill certifications</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Filter batches..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all w-60 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary bg-blue-600 hover:bg-blue-700 border-none shadow-lg shadow-blue-200"
                    >
                        <Plus size={18} />
                        <span>Add New Batch</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {materials.length === 0 ? (
                    <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <Database size={32} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium">No material documentation found</p>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr>
                                        <th className="table-header">Batch ID</th>
                                        <th className="table-header">Heat Number</th>
                                        <th className="table-header">Material Grade</th>
                                        <th className="table-header">Authorized Supplier</th>
                                        <th className="table-header text-right">Certificate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredMaterials.map((m) => (
                                        <tr key={m.id} className="hover:bg-slate-50 group transition-colors">
                                            <td className="table-cell">
                                                <div className="font-bold text-slate-900 mono">{m.materialId}</div>
                                            </td>
                                            <td className="table-cell">
                                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider mono">
                                                    #{m.heatNumber}
                                                </span>
                                            </td>
                                            <td className="table-cell">
                                                <div className="text-sm font-medium text-slate-600">{m.grade}</div>
                                            </td>
                                            <td className="table-cell text-slate-500 font-medium italic text-xs">
                                                {m.supplier}
                                            </td>
                                            <td className="table-cell text-right">
                                                <a
                                                    href={`http://localhost:5000${m.qrCode}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-all p-1.5 hover:bg-blue-50 rounded-lg"
                                                >
                                                    View MTR <ArrowUpRight size={14} />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredMaterials.length === 0 && (
                            <div className="p-12 text-center text-slate-400 text-sm font-medium">
                                No results matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Material Entry</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Register inbound material certs.</p>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Batch ID</label>
                                <input
                                    type="text"
                                    value={formData.materialId}
                                    onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g. MAT-2024-001"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Heat Number</label>
                                    <input
                                        type="text"
                                        value={formData.heatNumber}
                                        onChange={(e) => setFormData({ ...formData, heatNumber: e.target.value })}
                                        className="input-field"
                                        placeholder="Heat #"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Grade</label>
                                    <input
                                        type="text"
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                        className="input-field"
                                        placeholder="AISI-316"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Supplier Name</label>
                                <input
                                    type="text"
                                    value={formData.supplier}
                                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g. Tata Steel / Jindal"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 btn-secondary justify-center text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-primary bg-blue-600 hover:bg-blue-700 border-none justify-center text-sm font-bold"
                                >
                                    Login Batch
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Materials;
