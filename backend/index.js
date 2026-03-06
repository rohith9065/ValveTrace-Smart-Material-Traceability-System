import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import materialRoutes from './routes/materialRoutes.js';
import componentRoutes from './routes/componentRoutes.js';
import valveRoutes from './routes/valveRoutes.js';
import processRoutes from './routes/processRoutes.js';
import traceRoutes from './routes/traceRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/materials', materialRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/valves', valveRoutes);
app.use('/api/process', processRoutes);
app.use('/api/trace', traceRoutes);

app.get('/', (req, res) => {
    res.send('ValveTrace API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
