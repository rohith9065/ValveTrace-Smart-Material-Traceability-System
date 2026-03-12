import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Box,
    Cpu,
    HardDrive,
    Scan,
    Search,
    ShieldCheck,
    Settings,
    LogOut,
    Factory,
    ClipboardCheck,
    Truck,
    History
} from 'lucide-react';

const Sidebar = () => {
    const sections = [
        {
            title: 'Material Management',
            items: [
                { icon: <Box size={18} />, label: 'Inventory', path: '/materials' },
            ]
        },
        {
            title: 'Manufacturing',
            items: [
                { icon: <Cpu size={18} />, label: 'Components', path: '/components' },
                { icon: <History size={18} />, label: 'Process Logs', path: '/process' },
            ]
        },
        {
            title: 'Assembly',
            items: [
                { icon: <Factory size={18} />, label: 'Build Valve', path: '/valves' },
            ]
        },
        {
            title: 'Quality Control',
            items: [
                { icon: <ClipboardCheck size={18} />, label: 'Test Logs', path: '/quality' },
            ]
        },
        {
            title: 'Traceability',
            items: [
                { icon: <Scan size={18} />, label: 'QR Scan', path: '/trace' },
                { icon: <Search size={18} />, label: 'Asset Search', path: '/search' },
            ]
        },
        {
            title: 'Distribution',
            items: [
                { icon: <Truck size={18} />, label: 'Dispatch', path: '/dispatch' },
            ]
        }
    ];

    return (
        <div className="w-60 bg-white h-screen flex flex-col fixed left-0 top-0 border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 overflow-y-auto">
            <div className="p-7 mb-2 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <ShieldCheck size={20} strokeWidth={2.5} />
                </div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">ValveTrace</h1>
            </div>

            <nav className="flex-1 px-3 space-y-6 pb-8">
                <div className="px-2">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-slate-900 text-white font-semibold'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <LayoutDashboard size={19} />
                        <span className="text-[14px]">Dashboard</span>
                    </NavLink>
                </div>

                {sections.map((section, idx) => (
                    <div key={idx} className="space-y-1">
                        <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{section.title}</div>
                        {section.items.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-blue-50 text-blue-600 font-semibold'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`
                                }
                            >
                                <span className="transition-colors group-hover:text-slate-900">
                                    {item.icon}
                                </span>
                                <span className="text-[14px]">{item.label}</span>
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="mt-auto px-3 pb-6 border-t border-slate-100 pt-6 bg-white sticky bottom-0">
                <div className="px-4 mb-4">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
                            AD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">Rohith Admin</p>
                            <p className="text-[10px] text-slate-400 font-medium truncate">Operations Lead</p>
                        </div>
                    </div>
                </div>

                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group">
                    <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    <span className="text-sm font-medium">Log out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
