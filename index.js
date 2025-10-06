require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRouter = require('./authRouter');
const pokemonRouter = require('./pokemonRouter');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())

app.use("/api/v1", pokemonRouter);
app.use("/api/v1", authRouter);

app.get('/', (req, res) => {
    res.json({
        endpoints: {
            login: 'POST /api/v1/auth',
            pokemon: 'POST /api/v1/pokemonDetails',
        },
    })
});

app.use((req, res) => {
    res.status(404).json({ 
        error: 'Ruta no encontrada',
        path: req.originalUrl
    });
});
app.listen(PORT, () => {
    console.log(`Server in PORT ${PORT}`);
});