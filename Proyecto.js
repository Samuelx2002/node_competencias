const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

let plants = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    temperature: (Math.random() * 15 + 20).toFixed(2), // 20-35 °C
    humidity: (Math.random() * 30 + 50).toFixed(2),    // 50-80%
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

// Ruta para simular cambios en las condiciones
app.post("/api/greenhouse", (req, res) => {
    const { simulate } = req.body;

    if (simulate) {
        // Simular cambios: reducir temperatura y aumentar humedad
        plants = plants.map((plant) => ({
            ...plant,
            temperature: (parseFloat(plant.temperature) - 5).toFixed(2), // Reducir temperatura en 5 grados
            humidity: Math.min(80, parseFloat(plant.humidity) + 10).toFixed(2), // Aumentar humedad en 10%, máximo 80%
        }));

        console.log("Simulación aplicada. Restaurando valores en 30 segundos...");

        // Restaurar valores después de 30 segundos
        setTimeout(() => {
            plants = plants.map((plant) => ({
                id: plant.id,
                temperature: (Math.random() * 15 + 20).toFixed(2), // 20-35 °C
                humidity: (Math.random() * 30 + 50).toFixed(2),    // 50-80%
                waterCounter: Math.floor(Math.random() * 24) + 1,  // 1-24 horas
            }));
            console.log("Valores restaurados a valores aleatorios.");
        }, 30000); // 30 segundos

        return res.status(200).json({ message: "Simulación aplicada. Valores restaurados en 30 segundos." });
    }

    res.status(400).json({ message: "Petición inválida. Asegúrate de enviar { simulate: true } en el cuerpo." });
});

// Simular cambios regulares en las condiciones (cada 10 segundos)
setInterval(() => {
    plants = plants.map((plant) => ({
        ...plant,
        temperature: (Math.random() * 15 + 20).toFixed(2), // 20-35 °C
        humidity: (Math.random() * 30 + 50).toFixed(2),    // 50-80%
        waterCounter: Math.max(0, plant.waterCounter - 1),
    }));
}, 10000); // Cada 10 segundos

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
