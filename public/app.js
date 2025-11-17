const imageInput = document.getElementById("imageInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const preview = document.getElementById("preview");
const resultado = document.getElementById("resultado");
const opciones = document.getElementById("opciones");
const acciones = document.getElementById("acciones");
const respuesta = document.getElementById("respuesta");

let alimentoSeleccionado = "";
let estadoSeleccionado = "";

// ============ 📸 Análisis de imagen ============
analyzeBtn.addEventListener("click", async () => {
  if (!imageInput.files[0]) return alert("Selecciona una imagen primero");

  const file = imageInput.files[0];
  preview.src = URL.createObjectURL(file);
  preview.hidden = false;

  resultado.innerHTML = "Analizando...";
  opciones.hidden = true;
  acciones.hidden = true;
  respuesta.textContent = "";

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch("/analyze", { method: "POST", body: formData });
    const data = await res.json();

    if (!data.detected || !data.detected.length) {
      resultado.textContent = "No se detectó ningún alimento.";
      return;
    }

    resultado.innerHTML = "<h3>Selecciona el alimento detectado:</h3>";

    data.detected.forEach(nombre => {
      const btn = document.createElement("button");
      btn.textContent = nombre;

      btn.addEventListener("click", () => {
        alimentoSeleccionado = nombre;
        resultado.innerHTML = `Has seleccionado: <strong>${nombre}</strong>`;
        opciones.hidden = false;
      });

      resultado.appendChild(btn);
    });

  } catch {
    resultado.textContent = "Error analizando la imagen.";
  }
});

// ============ 🌱 Selección de estado ============
document.querySelectorAll("#opciones button[data-estado]").forEach(btn => {
  btn.addEventListener("click", () => {
    estadoSeleccionado = btn.dataset.estado;
    acciones.hidden = false;
  });
});

// ============ 🍴 Recetas ============
document.getElementById("verRecetas").addEventListener("click", async () => {
  if (!alimentoSeleccionado || !estadoSeleccionado)
    return alert("Selecciona primero un alimento y su estado.");

  respuesta.textContent = "Generando recetas...";

  const res = await fetch("/recetas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ alimento: alimentoSeleccionado, estado: estadoSeleccionado }),
  });

  const data = await res.json();
  respuesta.textContent = data.recetas;
});

// ============ 💡 Consejos ============
document.getElementById("verTips").addEventListener("click", async () => {
  if (!alimentoSeleccionado)
    return alert("Selecciona primero un alimento.");

  respuesta.textContent = "Generando consejos...";

  const res = await fetch("/tips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ alimento: alimentoSeleccionado }),
  });

  const data = await res.json();
  respuesta.textContent = data.tips;
});
