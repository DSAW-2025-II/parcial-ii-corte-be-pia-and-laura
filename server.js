require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
app.use(express.json());

// Middleware para verificar JWT en rutas protegidas
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ error: 'User not authenticated' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'User not authenticated' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'User not authenticated' });
    req.user = user;
    next();
  });
}

// Endpoint de login
app.post('/api/v1/auth', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.VALID_EMAIL && password === process.env.VALID_PASSWORD) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token });
  } else {
    return res.status(400).json({ error: 'invalid credentials' });
  }
});

// Endpoint protegido para obtener detalles del Pokémon
app.post('/api/v1/pokemonDetails', authenticateToken, async (req, res) => {
  const { pokemonName } = req.body;
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    const data = response.data;

    const info = {
      name: data.name,
      species: data.species.name,
      weight: data.weight.toString(),
      img_url: data.sprites.front_default || ''
    };
    res.status(200).json(info);
  } catch (error) {
    // Pokémon no encontrado o error en API
    res.status(400).json({
      name: "",
      species: "",
      weight: "",
      img_url: ""
    });
  }
});

// Opcional: Servir un frontend simple
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});