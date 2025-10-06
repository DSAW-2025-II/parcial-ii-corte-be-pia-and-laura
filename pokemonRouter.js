const express = require('express');
const router = express.Router();
const verifyToken = require("./authMiddlewares.js");
const API_URL = process.env.API_URL || "https://pokeapi.co/api/v2/pokemon/";

router.post("/pokemonDetails", verifyToken, async (req, res) => {
    try {
        const { pokemonName } = req.body;

        if (!pokemonName) {
            return res.status(400).json({
                name: "",
                species: "",
                weight: "",
                img_url: ""
            });
        }

        const response = await globalThis.fetch(`${API_URL}${pokemonName.toLowerCase()}`);

        if (!response.ok) {
            if (response.status === 404) {
                return res.status(400).json({
                    name: "",
                    species: "",
                    weight: "",
                    img_url: ""
                });
            } else {
                return res.status(500).json({ error: "Error fetching data" });
            }
        }

        const data = await response.json();

        const resultData = {
            name: data.name,
            species: data.types[0].type.name, 
            weight: data.weight.toString(),
            img_url: data.sprites.front_default
        };

        return res.status(200).json(resultData);

    } catch (error) {
        console.error('Error interno:', error.message);
        return res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
});

module.exports = router;
