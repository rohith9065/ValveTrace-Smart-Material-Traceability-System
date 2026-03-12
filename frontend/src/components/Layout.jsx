import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Sidebar />
            <main className="flex-1 ml-60 transition-all duration-300">
                <div className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-12">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
