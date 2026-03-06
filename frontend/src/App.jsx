import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Materials from './pages/Materials';
import Components from './pages/Components';
import Valves from './pages/Valves';
import ProcessTracking from './pages/ProcessTracking';
import Traceability from './pages/Traceability';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="materials" element={<Materials />} />
                    <Route path="components" element={<Components />} />
                    <Route path="valves" element={<Valves />} />
                    <Route path="process" element={<ProcessTracking />} />
                    <Route path="trace" element={<Traceability />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
