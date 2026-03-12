import React, { useState, useEffect } from 'react';
import { Truck, Package, Search, Download, Calendar, User, MapPin, Hash, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const Dispatch = () => {
    const [valves, setValves] = useState([]);
    const [selectedValves, setSelectedValves] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        poNumber: '',
        shipmentDate: new Date().toISOString().split('T')[0],
        destination: '',
        batchNumber: `BAT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    const fetchData = async () => {
        try {
            const res = await axios.get('/api/valves');
            // Only valves that have been tested and passed can be dispatched
            setValves(res.data.filter(v => v.assemblyStatus === 'Tested' || v.assemblyStatus === 'Dispatched'));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleSelect = (id) => {
        setSelectedValves(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedValves.length === 0) return alert('Select valves for dispatch');
        try {
            await axios.post('/api/valves/dispatch', {
                valveIds: selectedValves,
                ...formData
            });
            setIsModalOpen(false);
            setSelectedValves([]);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || 'Dispatch failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dispatch & Logistics</h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Manage shipments and customer fulfillment records</p>
                </div>
                <button
                    disabled={selectedValves.length === 0}
                    onClick={() => setIsModalOpen(true)}
                    className={`btn-primary ${selectedValves.length === 0 ? 'opacity-50 cursor-not-allowed grayscale' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'}`}
                >
                    <Truck size={18} />
                    <span>Dispatch {selectedValves.length > 0 ? `(${selectedValves.length})` : ''} Units</span>
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="table-header w-12 text-center">
                                <Package size={14} className="mx-auto text-slate-400" />
                            </th>
                            <th className="table-header">Valve ID</th>
                            <th className="table-header">Status</th>
                            <th className="table-header">Customer/PO</th>
                            <th className="table-header">Shipment Point</th>
                            <th className="table-header text-right">Certificate</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {valves.map((v) => (
                            <tr key={v.id} className={`transition-colors ${selectedValves.includes(v.id) ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                                <td className="px-4 py-4 text-center">
                                    {v.assemblyStatus === 'Dispatched' ? (
                                        <CheckCircle2 size={18} className="text-emerald-500 mx-auto" />
                                    ) : (
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectedValves.includes(v.id)}
                                            onChange={() => toggleSelect(v.id)}
                                        />
                                    )}
                                </td>
                                <td className="table-cell">
                                    <div className="font-bold text-slate-900 mono">{v.valveId}</div>
                                    <div className="text-[10px] text-slate-400 font-medium">SN: {v.serialNumber}</div>
                                </td>
                                <td className="table-cell">
                                    <span className={`status-pill ${v.assemblyStatus === 'Dispatched' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                        {v.assemblyStatus}
                                    </span>
                                </td>
                                <td className="table-cell">
                                    {v.customerName ? (
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700">{v.customerName}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PO: {v.poNumber}</p>
                                        </div>
                                    ) : (
                                        <span className="text-slate-300 italic text-xs">Ready for allocation</span>
                                    )}
                                </td>
                                <td className="table-cell">
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                        <MapPin size={12} className="text-slate-400" />
                                        {v.destination || 'Inventory Center'}
                                    </div>
                                    {v.shipmentDate && (
                                        <div className="text-[10px] text-slate-400 mt-0.5 ml-4">
                                            {new Date(v.shipmentDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </td>
                                <td className="table-cell text-right">
                                    <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
                                        <Download size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-[1.5rem] shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-slate-900 p-8 text-white relative">
                            <div className="absolute top-8 right-8 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <Truck size={24} />
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight">Shipment Details</h3>
                            <p className="text-slate-400 text-sm mt-1">Allocation for <span className="text-blue-400 font-bold">{selectedValves.length}</span> verified units</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                                        <User size={12} className="text-blue-500" /> Customer Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        placeholder="e.g. Chevron / ExxonMobil"
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                                            <Hash size={12} className="text-blue-500" /> PO Number
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="input-field font-bold mono"
                                            placeholder="PO-8812-X"
                                            value={formData.poNumber}
                                            onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                                            <Calendar size={12} className="text-blue-500" /> Ship Date
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            className="input-field"
                                            value={formData.shipmentDate}
                                            onChange={(e) => setFormData({ ...formData, shipmentDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                                        <MapPin size={12} className="text-blue-500" /> Destination
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        placeholder="Project Site or Port Address"
                                        value={formData.destination}
                                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary justify-center py-3">Cancel</button>
                                <button type="submit" className="flex-[2] btn-primary bg-blue-600 hover:bg-blue-700 border-none justify-center py-3 font-bold">Authorize Dispatch</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dispatch;
