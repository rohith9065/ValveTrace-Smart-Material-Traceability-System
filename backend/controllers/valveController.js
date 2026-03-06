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
            data: { assemblyStatus: 'Assembled' }
        });
        res.json(valve);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllValves = async (req, res) => {
    try {
        const valves = await prisma.valve.findMany({
            include: { components: { include: { component: true } } }
        });
        res.json(valves);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
