import React, { useState, useEffect } from 'react';
import { Plus, HardDrive, CheckCircle2, ArrowRight, Package, ClipboardCheck, Layers } from 'lucide-react';
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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Final Assemblies</h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Manage valve units and bill-of-materials linking</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary"
                >
                    <Plus size={18} />
                    <span>Register New Unit</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {valves.length === 0 ? (
                    <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <Layers size={32} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium tracking-tight">No valve units found in production</p>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr>
                                        <th className="table-header">Unit Identifier</th>
                                        <th className="table-header">Serial Number</th>
                                        <th className="table-header">Lifecycle State</th>
                                        <th className="table-header">Linked Components</th>
                                        <th className="table-header text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {valves.map((v) => (
                                        <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="table-cell">
                                                <div className="font-semibold text-slate-900 mono uppercase">{v.valveId}</div>
                                            </td>
                                            <td className="table-cell font-medium text-slate-500 text-xs mono">{v.serialNumber}</td>
                                            <td className="table-cell">
                                                <span className={`status-pill ${v.assemblyStatus === 'READY FOR DISPATCH'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                        : 'bg-amber-50 text-amber-700 border-amber-100'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${v.assemblyStatus === 'READY FOR DISPATCH' ? 'bg-emerald-500' : 'bg-amber-500'
                                                        }`} />
                                                    {v.assemblyStatus}
                                                </span>
                                            </td>
                                            <td className="table-cell">
                                                <div className="flex -space-x-1.5">
                                                    {v.components?.length > 0 ? (
                                                        v.components.map((c, i) => (
                                                            <div
                                                                key={i}
                                                                title={`${c.component?.type}: ${c.component?.componentId}`}
                                                                className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-help"
                                                            >
                                                                {c.component?.type[0]}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Awaiting Build</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="table-cell text-right">
                                                {v.assemblyStatus === 'Pending' ? (
                                                    <button
                                                        onClick={() => { setSelectedValve(v); setIsAssembleOpen(true); }}
                                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 ml-auto"
                                                    >
                                                        Link BOM <ArrowRight size={14} />
                                                    </button>
                                                ) : (
                                                    <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
                                                        <ClipboardCheck size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal for Unit Registration */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Register Valve Unit</h3>
                            <p className="text-sm text-slate-500 mt-1">Assign an identifier to a new finished good unit.</p>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Valve Identifier</label>
                                <input
                                    type="text"
                                    value={formData.valveId}
                                    onChange={(e) => setFormData({ ...formData, valveId: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g. VLV-2024-X10"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Serial Number</label>
                                <input
                                    type="text"
                                    value={formData.serialNumber}
                                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g. SN-8829-01"
                                    required
                                />
                                <p className="text-[10px] text-slate-400 mt-1 px-1 italic">* This will be linked to the generated QR code.</p>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary justify-center">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary justify-center bg-blue-600 hover:bg-blue-700 border-none">Create Unit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for BOM Linking */}
            {isAssembleOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-[1.5rem] shadow-2xl w-full max-w-[500px] border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8 pb-4 text-center">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                                <Package size={24} className="text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Link Bill of Materials</h3>
                            <p className="text-slate-500 text-sm mt-1">Unit: <span className="font-bold text-slate-900 mono">{selectedValve?.valveId}</span></p>
                        </div>

                        <div className="px-6 py-2">
                            <div className="max-h-72 overflow-y-auto space-y-3 px-2 py-4">
                                {components.map(c => (
                                    <div
                                        key={c.id}
                                        onClick={() => toggleComponent(c.id)}
                                        className={`p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${selectedComponents.includes(c.id)
                                                ? 'bg-blue-50 border-blue-200'
                                                : 'bg-white border-slate-100 hover:border-slate-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center font-bold text-[10px] ${selectedComponents.includes(c.id)
                                                    ? 'bg-white border-blue-200 text-blue-600'
                                                    : 'bg-slate-50 border-slate-100 text-slate-500'
                                                }`}>
                                                {c.type.substring(0, 3).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">{c.componentId}</p>
                                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">
                                                    {c.type} • Heat: {c.material?.heatNumber}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedComponents.includes(c.id) && (
                                            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                                <CheckCircle2 size={14} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 pt-4 flex gap-3">
                            <button
                                onClick={() => setIsAssembleOpen(false)}
                                className="flex-1 btn-secondary justify-center text-sm"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleAssemble}
                                className="flex-1 btn-primary justify-center bg-blue-600 hover:bg-blue-700 border-none text-sm"
                            >
                                Confirm Assembly
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Valves;
