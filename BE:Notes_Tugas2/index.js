// Import Package dan File
const express = require("express");
const sequelize = require("./config/database");
const notesRoutes = require("./routes/notesRoutes");

// Inisialisasi Express dan Cors
const app = express();
const cors = require("cors");

// Izinkan origin frontend lokal yang umum dipakai saat development
app.use(cors({
  origin: ['http://localhost', 'http://localhost:5173', 'http://127.0.0.1:5500'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Jika butuh kirim cookie/session
}));

// Middleware untuk parsing JSON
app.use(express.json());

// Route dasar untuk testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Setting Routes
require("./schema/Notes"); // Untuk generate Tabel Notes
app.use("/api/v1/notes", notesRoutes); // Untuk setting routes user

// Sync Database dan Jalankan Server
const port = process.env.PORT || 3000;
sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(port, () => console.log(`Server running on port ${port}`));
});