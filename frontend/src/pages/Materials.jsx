import React, { useState, useEffect } from 'react';
import { Plus, Box, Download, ArrowUpRight } from 'lucide-react';
import axios from 'axios';

const Materials = () => {
    const [materials, setMaterials] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter">Material Inventory</h2>
                    <p className="text-neutral-500 mt-1 text-sm font-medium">Batch tracking and material certifications</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-accent-yellow border border-yellow-500 hover:bg-yellow-400 text-black px-6 py-2.5 rounded-xl flex items-center gap-2 font-black text-xs transition-colors uppercase tracking-widest"
                >
                    <Plus size={16} /> Register Batch
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {materials.length === 0 ? (
                    <div className="bg-white border border-neutral-200 border-dashed rounded-2xl p-16 text-center text-neutral-400">
                        <Box size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="text-sm font-black uppercase tracking-widest">No material data stored</p>
                    </div>
                ) : (
                    <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-neutral-50 text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-neutral-100">
                                    <th className="px-8 py-5">Material ID</th>
                                    <th className="px-8 py-5">Heat #</th>
                                    <th className="px-8 py-5">Grade</th>
                                    <th className="px-8 py-5">Verified Supplier</th>
                                    <th className="px-8 py-5 text-right">Certificate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {materials.map((m) => (
                                    <tr key={m.id} className="hover:bg-neutral-50 transition-colors text-sm">
                                        <td className="px-8 py-6 font-black text-black uppercase tracking-tight">{m.materialId}</td>
                                        <td className="px-8 py-6 text-neutral-500 font-bold uppercase text-xs">HT-{m.heatNumber}</td>
                                        <td className="px-8 py-6 text-neutral-500 font-bold uppercase text-xs tracking-widest">{m.grade}</td>
                                        <td className="px-8 py-6 text-neutral-500 font-bold uppercase text-xs">{m.supplier}</td>
                                        <td className="px-8 py-6 text-right">
                                            <a
                                                href={`http://localhost:5000${m.qrCode}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-black hover:text-accent-yellow inline-flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-colors"
                                            >
                                                Source QR <ArrowUpRight size={14} />
                                            </a>
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
                        <h3 className="text-2xl font-black text-black mb-8 tracking-tighter uppercase">New Material</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-neutral-400 mb-2 uppercase tracking-[0.2em]">Batch Identifier</label>
                                <input
                                    type="text"
                                    value={formData.materialId}
                                    onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-4 text-black font-bold focus:border-accent-yellow outline-none transition-colors"
                                    placeholder="MAT-X-01"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-neutral-400 mb-2 uppercase tracking-[0.2em]">Heat No</label>
                                    <input
                                        type="text"
                                        value={formData.heatNumber}
                                        onChange={(e) => setFormData({ ...formData, heatNumber: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-4 text-black font-bold focus:border-accent-yellow outline-none"
                                        placeholder="99210"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-neutral-400 mb-2 uppercase tracking-[0.2em]">Grade</label>
                                    <input
                                        type="text"
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-4 text-black font-bold focus:border-accent-yellow outline-none"
                                        placeholder="AISI-316"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-neutral-400 mb-2 uppercase tracking-[0.2em]">Verified Vendor</label>
                                <input
                                    type="text"
                                    value={formData.supplier}
                                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-4 text-black font-bold focus:border-accent-yellow outline-none"
                                    placeholder="Tata Steel"
                                    required
                                />
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-4 rounded-xl border border-neutral-200 text-neutral-500 font-black text-xs uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-accent-yellow border border-yellow-500 text-black font-black px-4 py-4 rounded-xl text-xs uppercase tracking-widest"
                                >
                                    Confirm Batch
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
