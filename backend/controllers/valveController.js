import prisma from '../prisma/client.js';
import { generateQRCode } from '../services/qrService.js';

export const createValve = async (req, res) => {
    try {
        const { valveId, serialNumber } = req.body;
        const qrCodePath = await generateQRCode(valveId);
        const valve = await prisma.valve.create({
            data: {
                valveId,
                serialNumber,
                qrCode: qrCodePath,
                assemblyStatus: 'Pending'
            }
        });
        res.status(201).json(valve);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const assembleValve = async (req, res) => {
    try {
        const { valveId, componentIds } = req.body;
        await prisma.valveComponent.createMany({
            data: componentIds.map(id => ({
                valveId,
                componentId: id
            }))
        });
        const valve = await prisma.valve.update({
            where: { id: valveId },
            data: { assemblyStatus: 'Assembled' } // BOM is effectively locked here by workflow
        });
        res.json(valve);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addTestReport = async (req, res) => {
    try {
        const { id } = req.params;
        const testData = req.body;

        await prisma.testReport.create({
            data: {
                valveId: id,
                ...testData
            }
        });

        const valve = await prisma.valve.update({
            where: { id },
            data: { assemblyStatus: testData.result === 'Pass' ? 'Tested' : 'Failed' }
        });

        res.json(valve);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const dispatchValves = async (req, res) => {
    try {
        const { valveIds, customerName, poNumber, shipmentDate, destination, batchNumber } = req.body;

        await prisma.valve.updateMany({
            where: { id: { in: valveIds } },
            data: {
                customerName,
                poNumber,
                shipmentDate: new Date(shipmentDate),
                destination,
                batchNumber,
                assemblyStatus: 'Dispatched'
            }
        });

        res.json({ message: `${valveIds.length} units dispatched successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllValves = async (req, res) => {
    try {
        const valves = await prisma.valve.findMany({
            include: {
                components: { include: { component: { include: { material: true } } } },
                testReports: { orderBy: { createdAt: 'desc' } }
            }
        });
        res.json(valves);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
