import React, { useState, useEffect } from 'react';
import { Plus, ClipboardCheck, ArrowUpRight, Search, Gauge, Droplets, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import axios from 'axios';

const QualityControl = () => {
    const [valves, setValves] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedValve, setSelectedValve] = useState(null);
    const [formData, setFormData] = useState({
        hydroTest: 'Pass',
        pressureTest: '',
        leakTest: 'Zero Leakage',
        ndtInspection: 'Pass',
        visualInspection: 'Pass',
        inspector: 'Rohith Supervisor',
        result: 'Pass',
    });

    const fetchData = async () => {
        try {
            const res = await axios.get('/api/valves');
            setValves(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/valves/${selectedValve.id}/test`, formData);
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || 'Testing entry failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Quality Assurance</h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Verify production units against API 6D and ASME standards</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="table-header">Unit ID</th>
                            <th className="table-header">State</th>
                            <th className="table-header">Last Test</th>
                            <th className="table-header">Inspector</th>
                            <th className="table-header text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {valves.map((v) => (
                            <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                                <td className="table-cell">
                                    <div className="font-bold text-slate-900 mono">{v.valveId}</div>
                                    <div className="text-[10px] text-slate-400 font-medium">Assembled: {new Date(v.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td className="table-cell">
                                    <span className={`status-pill ${v.assemblyStatus === 'Tested'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                            : v.assemblyStatus === 'Assembled'
                                                ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                : 'bg-amber-50 text-amber-700 border-amber-100'
                                        }`}>
                                        {v.assemblyStatus}
                                    </span>
                                </td>
                                <td className="table-cell text-sm text-slate-600">
                                    {v.testReports?.[0] ? (
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-emerald-600">{v.testReports[0].result}</span>
                                            <span className="text-slate-400 text-xs">({new Date(v.testReports[0].createdAt).toLocaleDateString()})</span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 italic">No tests recorded</span>
                                    )}
                                </td>
                                <td className="table-cell text-slate-500 font-medium text-xs">
                                    {v.testReports?.[0]?.inspector || '-'}
                                </td>
                                <td className="table-cell text-right">
                                    {(v.assemblyStatus === 'Assembled' || v.assemblyStatus === 'Pending') ? (
                                        <button
                                            onClick={() => { setSelectedValve(v); setIsModalOpen(true); }}
                                            className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all uppercase tracking-wider"
                                        >
                                            Log Inspection
                                        </button>
                                    ) : (
                                        <button className="text-slate-400 hover:text-slate-600">
                                            <Search size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <ClipboardCheck size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Quality Test Record</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Unit Identifier: <span className="font-bold text-slate-800 mono">{selectedValve?.valveId}</span></p>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                            <Droplets size={12} className="text-blue-500" /> Hydro Test
                                        </label>
                                        <select
                                            value={formData.hydroTest}
                                            onChange={(e) => setFormData({ ...formData, hydroTest: e.target.value })}
                                            className="input-field py-2"
                                        >
                                            <option value="Pass">Pass</option>
                                            <option value="Fail">Fail</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                            <Gauge size={12} className="text-purple-500" /> Pressure (PSI)
                                        </label>
                                        <input
                                            type="text"
                                            className="input-field py-2"
                                            placeholder="e.g. 1500 PSI"
                                            value={formData.pressureTest}
                                            onChange={(e) => setFormData({ ...formData, pressureTest: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                            <CheckCircle2 size={12} className="text-emerald-500" /> Visual Insp.
                                        </label>
                                        <select
                                            value={formData.visualInspection}
                                            onChange={(e) => setFormData({ ...formData, visualInspection: e.target.value })}
                                            className="input-field py-2"
                                        >
                                            <option value="Pass">Pass</option>
                                            <option value="Fail">Fail</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                            <ShieldAlert size={12} className="text-amber-500" /> NDT (DPI/MPI)
                                        </label>
                                        <input
                                            type="text"
                                            className="input-field py-2"
                                            placeholder="Standard Reference"
                                            value={formData.ndtInspection}
                                            onChange={(e) => setFormData({ ...formData, ndtInspection: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Overall Result</label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, result: 'Pass' })}
                                                className={`flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 border transition-all ${formData.result === 'Pass' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'
                                                    }`}
                                            >
                                                <CheckCircle2 size={14} /> PASS
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, result: 'Fail' })}
                                                className={`flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 border transition-all ${formData.result === 'Fail' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-100 text-slate-400'
                                                    }`}
                                            >
                                                <XCircle size={14} /> FAIL
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Inspector Auth</label>
                                        <input
                                            type="text"
                                            className="input-field py-2"
                                            value={formData.inspector}
                                            onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary justify-center">Discard</button>
                                <button type="submit" className="flex-[2] btn-primary bg-blue-600 hover:bg-blue-700 border-none justify-center">Commit to Audit Trail</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QualityControl;
