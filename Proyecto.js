const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

let plants = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  temperature: (Math.random() * 10 + 20).toFixed(2), // 20-30 °C
  humidity: (Math.random() * 20 + 40).toFixed(2), // 40-60%
  waterCounter: Math.floor(Math.random() * 24) + 1, // Hours until next watering
}));

app.use(express.json());

// Endpoint para obtener el estado del invernadero
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
}, 60000); // Actualización cada 60 segundos

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
