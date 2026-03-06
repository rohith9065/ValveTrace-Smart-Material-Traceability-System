import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

export const generateQRCode = async (data) => {
    try {
        const qrDir = path.resolve('uploads/qrcodes');
        if (!fs.existsSync(qrDir)) {
            fs.mkdirSync(qrDir, { recursive: true });
        }

        const fileName = `${data.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
        const filePath = path.join(qrDir, fileName);

        await QRCode.toFile(filePath, data);

        return `/uploads/qrcodes/${fileName}`;
    } catch (error) {
        console.error('QR Generation Error:', error);
        throw error;
    }
};
