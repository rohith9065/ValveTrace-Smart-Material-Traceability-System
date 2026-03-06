import prisma from '../prisma/client.js';

export const backwardTrace = async (req, res) => {
    try {
        const { id } = req.params;
        const valve = await prisma.valve.findUnique({
            where: { valveId: id },
            include: {
                components: {
                    include: {
                        component: {
                            include: {
                                material: true
                            }
                        }
                    }
                },
                testReports: true,
                logs: true
            }
        });

        if (!valve) return res.status(404).json({ error: 'Valve not found' });
        res.json(valve);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const forwardTrace = async (req, res) => {
    try {
        const { id } = req.params;
        const material = await prisma.material.findUnique({
            where: { materialId: id },
            include: {
                components: {
                    include: {
                        valveComponents: {
                            include: {
                                valve: true
                            }
                        }
                    }
                }
            }
        });

        if (!material) return res.status(404).json({ error: 'Material not found' });
        res.json(material);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
