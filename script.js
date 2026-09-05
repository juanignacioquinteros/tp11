// Selección de elementos del DOM
const canvas = document.getElementById("interactiveCanvas");
const ctx = canvas.getContext("2d");

// Objeto para rastrear la posición del mouse
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  isHovering: false
};

// Arreglo para almacenar partículas y figuras
const particles = [];
const particleCount = 60;
const colors = ["#38bdf8", "#818cf8", "#c084fc", "#f472b6", "#34d399"];

// Clase para crear elementos interactivos
class Particle {
  constructor(x, y) {
    this.x = x || Math.random() * canvas.width;
    this.y = y || Math.random() * canvas.height;
    this.size = Math.random() * 8 + 4;
    this.baseSize = this.size;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.type = Math.random() > 0.5 ? "circle" : "star";
  }

  // Actualización de posición y reacción al mouse
  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Rebote en bordes
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    // Interacción con el cursor (distancia euclidiana)
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 100 && mouse.isHovering) {
      this.size = this.baseSize * 2.2;
    } else {
      this.size = this.baseSize;
    }
  }

  // Dibujado según el tipo de figura
  draw() {
    ctx.fillStyle = this.color;

    if (this.type === "circle") {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      drawStar(this.x, this.y, 5, this.size * 1.5, this.size * 0.7, this.color);
    }
  }
}

// Función auxiliar para trazar estrellas en Canvas
function drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  let step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

// Inicialización del conjunto de partículas
function init() {
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

// Eventos de interacción con mouse
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
  mouse.isHovering = true;
});

canvas.addEventListener("mouseleave", () => {
  mouse.isHovering = false;
});

// Crear estallido de partículas al hacer clic
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  for (let i = 0; i < 8; i++) {
    particles.push(new Particle(clickX, clickY));
    if (particles.length > 100) particles.shift(); // Mantener rendimiento
  }
});

// Bucle principal de animación (Game Loop)
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Trazar líneas de conexión entre elementos cercanos
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 80) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, " + (1 - dist / 80) * 0.25 + ")";
        ctx.lineWidth = 1;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  // Actualizar y redibujar partículas
  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

// Arrancar animación
init();
animate();