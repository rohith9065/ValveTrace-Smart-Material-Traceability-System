import React, { useState } from 'react';
import {
    Search,
    Scan,
    FileText,
    Link,
    ShieldCheck,
    ClipboardList,
    Truck,
    MapPin,
    User,
    ArrowRight,
    Gauge,
    Droplets,
    FlaskConical,
    Network,
    Cpu,
    HardDrive,
    History
} from 'lucide-react';
import axios from 'axios';

const Traceability = () => {
    const [searchId, setSearchId] = useState('');
    const [searchType, setSearchType] = useState('valve'); // 'valve' or 'heat'
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId) return;
        setLoading(true);
        setError(null);
        try {
            const endpoint = searchType === 'valve' ? `/api/trace/valve/${searchId}` : `/api/trace/material/${searchId}`;
            const res = await axios.get(endpoint);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.error || `Reference not found in registry`);
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                    <ShieldCheck size={14} /> Security Verified Traceability
                </div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Industrial Geneology Search</h2>
                <p className="text-slate-500 font-medium">Verify material lineage, manufacturing history, and field certifications via cryptographically signed records.</p>

                <div className="flex justify-center gap-3 mt-8">
                    <button
                        onClick={() => setSearchType('valve')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${searchType === 'valve' ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                    >
                        Search by Valve ID
                    </button>
                    <button
                        onClick={() => setSearchType('heat')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${searchType === 'heat' ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                    >
                        Search by Heat Number
                    </button>
                </div>

                <form onSubmit={handleSearch} className="relative mt-6 group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <Search size={22} />
                    </div>
                    <input
                        type="text"
                        placeholder={searchType === 'valve' ? "Enter Valve ID (e.g. VLV-2026-001)" : "Enter Heat Number (e.g. HT-552)"}
                        className="w-full pl-16 pr-32 py-5 bg-white border border-slate-200 rounded-[2rem] text-lg font-medium outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 shadow-xl shadow-slate-200/50 transition-all"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-8 py-3 rounded-[1.5rem] font-bold text-sm hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>
            </div>

            {error && (
                <div className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-center font-medium">
                    {error}
                </div>
            )}

            {result && searchType === 'valve' && (
                <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/40">
                        {/* Passport Header */}
                        <div className="bg-slate-900 p-10 text-white relative">
                            <div className="absolute top-10 right-10">
                                <div className="w-24 h-24 bg-white p-2 rounded-2xl">
                                    <img src={`http://localhost:5000${result.qrCode}`} alt="QR Code" className="w-full h-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-blue-400 font-bold uppercase tracking-[0.3em] text-[10px]">Origin Document • Digital Passport</p>
                                <h3 className="text-4xl font-bold mono">{result.valveId}</h3>
                                <div className="flex items-center gap-6 mt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-sm font-semibold text-slate-300">{result.assemblyStatus}</span>
                                    </div>
                                    <div className="h-4 w-px bg-white/20"></div>
                                    <p className="text-sm text-slate-400">SN: <span className="text-white font-medium mono">{result.serialNumber}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Passport Content */}
                        <div className="p-10">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                {/* Left Column: Components */}
                                <div className="lg:col-span-2 space-y-10">
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ClipboardList size={20} /></div>
                                            <h4 className="text-lg font-bold text-slate-900">Locked Bill of Materials (BOM)</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {result.components?.map((c, i) => (
                                                <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.component?.type}</p>
                                                        <p className="font-bold text-slate-900 mono mt-1">{c.component?.componentId}</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Link size={10} className="text-blue-500" />
                                                            <p className="text-[10px] font-bold text-blue-600 uppercase">Heat: {c.component?.material?.heatNumber}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Gauge size={20} /></div>
                                            <h4 className="text-lg font-bold text-slate-900">Validation & Quality Certification</h4>
                                        </div>
                                        <div className="space-y-4">
                                            {result.testReports?.map((t, i) => (
                                                <div key={i} className="border border-slate-100 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <p className="text-xl font-bold text-slate-900 capitalize">Final Inspection: {t.result}</p>
                                                                <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-100 uppercase tracking-widest">Signed</div>
                                                            </div>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-2">
                                                                <User size={12} /> Inspected by {t.inspector || 'Senior QA Supervisor'}
                                                            </p>
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 font-bold mono bg-slate-50 px-2 py-1 rounded">REF: {t.id.substring(0, 8)}</div>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-50">
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hydro Test</p>
                                                            <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><Droplets size={14} className="text-blue-500" /> {t.hydroTest || 'Pass'}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pressure</p>
                                                            <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><Gauge size={14} className="text-purple-500" /> {t.pressureTest || '1500 PSI'}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leak Test</p>
                                                            <p className="text-sm font-bold text-emerald-600">{t.leakTest || 'Zero'}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inspector</p>
                                                            <p className="text-xs font-bold text-slate-700">{t.inspector?.split(' ')[1] || 'Rohith'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {result.testReports?.length === 0 && (
                                                <div className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                                                    <p className="text-slate-400 font-medium">Quality assurance reports pending for this unit.</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                </div>

                                {/* Right Column: Logistics & DNA */}
                                <div className="space-y-8">
                                    <div className="p-8 rounded-[2rem] bg-slate-900 text-white space-y-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
                                        <div className="flex items-center gap-3 relative z-10">
                                            <Truck size={22} className="text-blue-400" />
                                            <h4 className="font-bold text-lg">Distribution Trace</h4>
                                        </div>
                                        {result.assemblyStatus === 'Dispatched' ? (
                                            <div className="space-y-6 relative z-10">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Consignee</label>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white/5 rounded-lg text-slate-400"><User size={18} /></div>
                                                        <p className="text-sm font-bold text-blue-50">{result.customerName}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PO Reference</label>
                                                    <p className="text-lg font-bold mono text-blue-400">{result.poNumber}</p>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Site Destination</label>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white/5 rounded-lg text-slate-400"><MapPin size={18} /></div>
                                                        <p className="text-xs font-semibold text-slate-300 leading-relaxed">{result.destination}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
                                                <History size={24} className="mx-auto text-slate-500 mb-3" />
                                                <p className="text-xs text-slate-400 leading-relaxed">Unit staged for distribution at manufacturing hub inventory.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50 space-y-8">
                                        <div className="flex items-center gap-3">
                                            <FlaskConical size={22} className="text-purple-600" />
                                            <h4 className="font-bold text-lg text-slate-900">Material DNA</h4>
                                        </div>
                                        <div className="space-y-6">
                                            {result.components?.[0]?.component?.material && (
                                                <>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Heat Number</label>
                                                        <div className="p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 mono text-sm shadow-sm">
                                                            #{result.components[0].component.material.heatNumber}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chemical Profile</label>
                                                        <div className="p-4 bg-white border border-slate-200 rounded-xl text-[10px] leading-relaxed text-slate-500 font-medium">
                                                            {result.components[0].component.material.chemicalComp || 'Standard AISI Compliant Material Profile'}
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={result.components[0].component.material.certificateFile}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="w-full py-4 rounded-xl bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-black transition-all uppercase tracking-widest shadow-lg shadow-slate-200"
                                                    >
                                                        Download MTR PDF <ArrowRight size={14} />
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Audit Log Footer */}
                        <div className="px-10 py-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">© 2026 VALVETRACE • CRYPTOGRAPHICALLY SIGNED ARCHIVE</p>
                            <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-[0.1em]">
                                <span>Security ID: {result.id.toUpperCase().substring(0, 16)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {result && searchType === 'heat' && (
                <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/40">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100">
                                    <FlaskConical size={32} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Raw Material Registry</p>
                                    <h3 className="text-3xl font-bold text-slate-900">Heat Lineage: #{result.heatNumber}</h3>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Batch ID</p>
                                <p className="text-xl font-bold text-slate-900 mono">{result.materialId}</p>
                            </div>
                        </div>

                        {/* Traceability Graph Concept */}
                        <div className="space-y-8">
                            <div className="relative p-8 bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden">
                                <div className="absolute top-0 right-0 opacity-[0.03] text-slate-900"><Network size={200} /></div>
                                <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-10 flex items-center gap-2">
                                    <Network size={16} className="text-blue-500" /> Digital Chain of Custody
                                </h4>

                                <div className="flex flex-col items-center gap-12 relative z-10">
                                    {/* Root Material */}
                                    <div className="w-64 p-4 bg-white border-2 border-purple-500 rounded-2xl shadow-lg relative">
                                        <div className="flex items-center gap-3">
                                            <Box className="text-purple-500" size={20} />
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">Material Batch</p>
                                                <p className="text-xs font-bold text-slate-800">{result.materialId}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Components Produced */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
                                        {result.components?.map((c, i) => (
                                            <div key={i} className="relative group">
                                                {/* Visual Connection Line */}
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-slate-200 group-hover:bg-blue-300 transition-colors"></div>

                                                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-500 transition-all cursor-pointer">
                                                    <div className="flex items-center gap-3">
                                                        <Cpu className="text-blue-500" size={16} />
                                                        <div>
                                                            <p className="text-[8px] font-bold text-slate-400 uppercase">{c.type}</p>
                                                            <p className="text-[10px] font-bold text-slate-800 mono">{c.componentId}</p>
                                                        </div>
                                                    </div>

                                                    {/* Nested Valve Link */}
                                                    {c.valveComponents?.[0]?.valve && (
                                                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                                                            <HardDrive size={12} className="text-slate-400" />
                                                            <p className="text-[9px] font-bold text-slate-500 uppercase">Assembled in <span className="text-blue-600">{c.valveComponents[0].valve.valveId}</span></p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                                <div className="space-y-4">
                                    <h5 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Material Specifications</h5>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-2xl">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">Grade</p>
                                            <p className="text-sm font-bold text-slate-700 mt-1">{result.grade}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">Supplier</p>
                                            <p className="text-sm font-bold text-slate-700 mt-1">{result.supplier}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Chemical Composition</p>
                                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{result.chemicalComp || 'Consult Mill Certification document for comprehensive chemical profile.'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h5 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Compliance Documents</h5>
                                    <div className="p-6 border border-slate-100 rounded-3xl bg-white shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-red-50 text-red-500 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Mill Test Report (MTR)</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Verified ASTM / ASME Certification</p>
                                            </div>
                                        </div>
                                        <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                        <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-1">Standard Compliance</p>
                                        <p className="text-xs text-blue-600 font-medium leading-relaxed">This batch is approved for use in high-pressure oil & gas applications following API 6D / ISO 14313 standards.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Traceability;
