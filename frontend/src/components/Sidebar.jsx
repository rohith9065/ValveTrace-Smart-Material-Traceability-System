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
    LogOut
} from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { icon: <LayoutDashboard size={19} />, label: 'Overview', path: '/' },
        { icon: <Box size={19} />, label: 'Materials', path: '/materials' },
        { icon: <Cpu size={19} />, label: 'Components', path: '/components' },
        { icon: <HardDrive size={19} />, label: 'Valves', path: '/valves' },
        { icon: <Scan size={19} />, label: 'Process', path: '/process' },
        { icon: <Search size={19} />, label: 'Traceability', path: '/trace' },
    ];

    return (
        <div className="w-60 bg-white h-screen flex flex-col fixed left-0 top-0 border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50">
            <div className="p-7 mb-2 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <ShieldCheck size={20} strokeWidth={2.5} />
                </div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">ValveTrace</h1>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Menu</div>
                {menuItems.map((item) => (
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
                        <span className={`transition-colors ${item.path === window.location.pathname ? 'text-blue-600' : 'group-hover:text-slate-900'}`}>
                            {item.icon}
                        </span>
                        <span className="text-[14px]">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto px-3 pb-6 border-t border-slate-100 pt-6">
                <div className="px-4 mb-4">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
                            AD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">Rohith Admin</p>
                            <p className="text-[10px] text-slate-400 font-medium truncate">Operations Lead</p>
                        </div>
                        <Settings size={14} className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
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
