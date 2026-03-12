import prisma from '../prisma/client.js';
import { generateQRCode } from '../services/qrService.js';

export const createMaterial = async (req, res) => {
    try {
        const {
            materialId,
            heatNumber,
            supplier,
            grade,
            certificateFile,
            chemicalComp,
            mechanicalProp,
            dateReceived
        } = req.body;
        const qrCodePath = await generateQRCode(materialId);
        const material = await prisma.material.create({
            data: {
                materialId,
                heatNumber,
                supplier,
                grade,
                certificateFile,
                chemicalComp,
                mechanicalProp,
                dateReceived: dateReceived ? new Date(dateReceived) : new Date(),
                qrCode: qrCodePath
            }
        });
        res.status(201).json(material);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllMaterials = async (req, res) => {
    try {
        const materials = await prisma.material.findMany();
        res.json(materials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMaterialById = async (req, res) => {
    try {
        const material = await prisma.material.findUnique({
            where: { id: req.params.id },
            include: { components: true }
        });
        if (!material) return res.status(404).json({ error: 'Material not found' });
        res.json(material);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
