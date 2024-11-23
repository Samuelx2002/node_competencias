const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

let plants = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    temperature: (Math.random() * 10 + 20).toFixed(2), // 20-30 °C
    humidity: (Math.random() * 20 + 40).toFixed(2),    // 40-60%
    waterCounter: Math.floor(Math.random() * 24) + 1,  // Hours until next watering
}));

app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
    res.send("¡Bienvenido al Invernadero! Usa /api/greenhouse para ver los datos.");
});

// Ruta para obtener el estado del invernadero
app.get("/api/greenhouse", (req, res) => {
    res.json(plants);
});

// Simular cambios en las condiciones
setInterval(() => {
    plants = plants.map((plant) => ({
        ...plant,
        temperature: (Math.random() * 10 + 20).toFixed(2),
        humidity: (Math.random() * 20 + 40).toFixed(2),
        waterCounter: Math.max(0, plant.waterCounter - 1),
    }));
}, 10000); // Cada 10 segundos

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});

app.post("/api/greenhouse", (req, res) => {
    const { simulate } = req.body;

    if (simulate) {
        // Cambiar los valores de las plantas
        plants = plants.map((plant) => ({
            ...plant,
            temperature: (parseFloat(plant.temperature) - 5).toFixed(2), // Reducir temperatura en 5 grados
            humidity: (parseFloat(plant.humidity) + 10).toFixed(2),     // Aumentar humedad en 10%
        }));

        // Restaurar valores aleatorios después de 30 segundos
        setTimeout(() => {
            plants = plants.map((plant) => ({
                id: plant.id,
                temperature: (Math.random() * 10 + 20).toFixed(2), // 20-30 °C
                humidity: (Math.random() * 20 + 40).toFixed(2),    // 40-60%
                waterCounter: Math.floor(Math.random() * 24) + 1,  // 1-24 horas
            }));
            console.log("Valores restaurados a valores aleatorios.");
        }, 30000); // 30 segundos

        return res.status(200).json({ message: "Simulación aplicada. Valores restaurados en 30 segundos." });
    }

    res.status(400).json({ message: "Petición inválida." });
});
