import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Box, Cpu, HardDrive, Scan, Search } from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { icon: <LayoutDashboard size={18} />, label: 'Overview', path: '/' },
        { icon: <Box size={18} />, label: 'Materials', path: '/materials' },
        { icon: <Cpu size={18} />, label: 'Components', path: '/components' },
        { icon: <HardDrive size={18} />, label: 'Valves', path: '/valves' },
        { icon: <Scan size={18} />, label: 'Process', path: '/process' },
        { icon: <Search size={18} />, label: 'Traceability', path: '/trace' },
    ];

    return (
        <div className="w-60 bg-black h-screen flex flex-col fixed left-0 top-0 border-r border-dark-border">
            <div className="p-8">
                <h1 className="text-xl font-bold text-white tracking-widest uppercase">ValveTrace</h1>
            </div>

            <nav className="flex-1 mt-2 px-4 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-2.5 rounded-xl transition-colors duration-150 ${isActive
                                ? 'bg-[#1a1a1a] text-white'
                                : 'text-accent-grey hover:bg-[#111111] hover:text-white'
                            }`
                        }
                    >
                        <span>{item.icon}</span>
                        <span className="text-sm font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-8">
                <div className="flex items-center gap-3 text-accent-grey hover:text-white cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-dark-card border border-dark-border group-hover:border-accent-yellow transition-colors"></div>
                    <div>
                        <p className="text-xs font-bold text-white leading-none">Admin</p>
                        <p className="text-[10px] text-accent-grey mt-1">Supervisor</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
