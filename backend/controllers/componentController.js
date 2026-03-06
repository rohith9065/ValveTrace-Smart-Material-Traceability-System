import prisma from '../prisma/client.js';
import { generateQRCode } from '../services/qrService.js';

export const createComponent = async (req, res) => {
    try {
        const { componentId, type, materialId, machine } = req.body;

        // Generate QR code for componentId
        const qrCodePath = await generateQRCode(componentId);

        const component = await prisma.component.create({
            data: {
                componentId,
                type,
                materialId, // This is the UUID of the material
                machine,
                qrCode: qrCodePath
            }
        });

        res.status(201).json(component);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllComponents = async (req, res) => {
    try {
        const components = await prisma.component.findMany({
            include: { material: true }
        });
        res.json(components);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
