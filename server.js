import express from "express";
import cors from "cors";
import multer from "multer";
import fetch from "node-fetch";
import path from "path";
import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const __dirname = path.resolve();

// Servir la carpeta public
app.use(express.static(path.join(__dirname, "public")));

// ⭐⭐⭐ CONFIGURAR TU API KEY ⭐⭐⭐
const CLARIFAI_API_KEY = "AQUÍ_TU_API_KEY";

const stub = ClarifaiStub.grpc();

// ============= ANALIZAR IMAGEN =============
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const metadata = new grpc.Metadata();
    metadata.set("authorization", `Key ${CLARIFAI_API_KEY}`);

    stub.PostModelOutputs(
      {
        model_id: "food-item-v1-recognition",
        inputs: [
          {
            data: {
              image: { base64: req.file.buffer }
            }
          }
        ]
      },
      metadata,
      (err, response) => {
        if (err || response.status.code !== 10000) {
          return res.json({ detected: [] });
        }

        const concepts = response.outputs[0].data.concepts;
        const nombres = concepts.map(c => c.name);

        res.json({ detected: nombres });
      }
    );
  } catch (e) {
    res.json({ detected: [] });
  }
});

// ============= RECETAS =============
app.post("/recetas", (req, res) => {
  const { alimento, estado } = req.body;
  res.json({
    recetas: `Aquí tienes recetas ricas con ${alimento} (${estado}):\n- Receta 1...\n- Receta 2...\n- Receta 3...`
  });
});

// ============= TIPS =============
app.post("/tips", (req, res) => {
  const { alimento } = req.body;
  res.json({
    tips: `Consejos de conservación para ${alimento}:\n- Guardar en...\n- No exponer a...`
  });
});

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor funcionando en puerto " + PORT));
