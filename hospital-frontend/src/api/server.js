import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Tokeni qaytaran endpoint - Authorization header-dən token alır
app.get('/token', (req, res) =>
{
    const authHeader = req.headers.authorization;
    // const token = authHeader?.split(' ')[1]; // "Bearer <token>" formatından token çıxarır

    // if (!token)
    // {
    //     return res.status(401).json({ error: 'No token provided' });
    // }

    res.json({ authHeader });
});

const PORT = 5000;
app.listen(PORT, () =>
{
    console.log(`Server running on port ${PORT}`);
});