import prisma from '../prisma/client.js';

export const logProcess = async (req, res) => {
    try {
        const { entity_id, entity_type, process_stage, machine, operator } = req.body;
        let internalId = entity_id;

        // If it's a valve, we need the UUID for the relation to work
        if (entity_type === 'Valve') {
            const valve = await prisma.valve.findUnique({ where: { valveId: entity_id } });
            if (!valve) return res.status(404).json({ error: 'Valve not found' });
            internalId = valve.id;

            // Update status if needed
            let newStatus = valve.assemblyStatus;
            if (process_stage === 'Testing') newStatus = 'Tested';
            if (process_stage === 'Packing') newStatus = 'READY FOR DISPATCH';

            await prisma.valve.update({
                where: { id: valve.id },
                data: { assemblyStatus: newStatus }
            });
        }

        const log = await prisma.processLog.create({
            data: {
                entityId: internalId,
                entityType: entity_type,
                processStage: process_stage,
                machine,
                operator,
                status: 'Completed'
            }
        });

        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
