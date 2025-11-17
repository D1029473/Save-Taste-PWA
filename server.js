import express from "express";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.resolve();

// Servir carpeta public
app.use(express.static(path.join(__dirname, "public")));

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor funcionando en puerto " + PORT));
