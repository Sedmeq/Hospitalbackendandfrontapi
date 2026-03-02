import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) =>
{
    res.json({ status: 'Server is running' });
});

// Tokeni qaytaran endpoint - Authorization header-dən token alır
app.get('/token', (req, res) =>
{
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; // "Bearer <token>" formatından token çıxarır

    if (!token)
    {
        return res.status(401).json({ error: 'No token provided' });
    }

    res.json({ token, timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
{
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}/health`);
    console.log(`http://localhost:${PORT}/token`);
});
