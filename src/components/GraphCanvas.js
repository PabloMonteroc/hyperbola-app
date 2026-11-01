export class GraphCanvas {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');

    // Estado de la cámara (mundo -> pantalla)
    this.scale = 40; // píxeles por unidad matemática
    this.origin = { x: 0, y: 0 }; // píxeles en el canvas donde está (0, 0) matemático
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };

    this.currentData = null;

    this.initEvents();
    this.resize();
  }

  initEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.render();
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.dragStart.x;
      const dy = e.clientY - this.dragStart.y;
      this.origin.x += dx;
      this.origin.y += dy;
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.render();
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.canvas.style.cursor = 'crosshair';
      }
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      const newScale = Math.min(Math.max(this.scale * zoomFactor, 8), 300);

      // Zoom centrado en la posición del puntero del mouse
      this.origin.x = mouseX - (mouseX - this.origin.x) * (newScale / this.scale);
      this.origin.y = mouseY - (mouseY - this.origin.y) * (newScale / this.scale);
      this.scale = newScale;

      this.render();
    }, { passive: false });

    this.canvas.style.cursor = 'crosshair';
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    if (this.origin.x === 0 && this.origin.y === 0) {
      this.origin.x = rect.width / 2;
      this.origin.y = rect.height / 2;
    }
  }

  resetView(h = 0, k = 0) {
    const rect = this.canvas.getBoundingClientRect();
    this.scale = 40;
    this.origin.x = rect.width / 2 - h * this.scale;
    this.origin.y = rect.height / 2 + k * this.scale;
    this.render();
  }

  // Transformaciones coordenadas mundo <-> canvas
  toScreenX(x) {
    return this.origin.x + x * this.scale;
  }

  toScreenY(y) {
    // En canvas Y va hacia abajo, en matemáticas va hacia arriba
    return this.origin.y - y * this.scale;
  }

  toWorldX(screenX) {
    return (screenX - this.origin.x) / this.scale;
  }

  toWorldY(screenY) {
    return (this.origin.y - screenY) / this.scale;
  }

  setData(hyperbolaData) {
    this.currentData = hyperbolaData;
    this.render();
  }

  drawGrid() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const ctx = this.ctx;

    // Calcular paso de cuadrícula según el zoom
    let step = 1;
    if (this.scale < 15) step = 10;
    else if (this.scale < 25) step = 5;
    else if (this.scale < 50) step = 2;
    else if (this.scale > 150) step = 0.5;

    const minX = Math.floor(this.toWorldX(0) / step) * step;
    const maxX = Math.ceil(this.toWorldX(width) / step) * step;
    const minY = Math.floor(this.toWorldY(height) / step) * step;
    const maxY = Math.ceil(this.toWorldY(0) / step) * step;

    // Líneas secundarias
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let x = minX; x <= maxX; x += step) {
      const sx = this.toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();

      if (Math.abs(x) > 0.0001) {
        ctx.fillText(Number(x.toFixed(2)), sx, Math.min(Math.max(this.origin.y + 4, 10), height - 20));
      }
    }

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = minY; y <= maxY; y += step) {
      const sy = this.toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();

      if (Math.abs(y) > 0.0001) {
        ctx.fillText(Number(y.toFixed(2)), Math.min(Math.max(this.origin.x - 6, 30), width - 10), sy);
      }
    }

    // Ejes principales X e Y
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(0, this.origin.y);
    ctx.lineTo(width, this.origin.y);
    ctx.moveTo(this.origin.x, 0);
    ctx.lineTo(this.origin.x, height);
    ctx.stroke();
  }

  drawAsymptotes(data) {
    const width = this.canvas.clientWidth;
    const ctx = this.ctx;
    const xMin = this.toWorldX(0);
    const xMax = this.toWorldX(width);

    ctx.save();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)'; // Ámbar / amarillo
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);

    // Línea positiva
    ctx.beginPath();
    ctx.moveTo(this.toScreenX(xMin), this.toScreenY(data.asymptotes.evaluate(xMin, 1)));
    ctx.lineTo(this.toScreenX(xMax), this.toScreenY(data.asymptotes.evaluate(xMax, 1)));
    ctx.stroke();

    // Línea negativa
    ctx.beginPath();
    ctx.moveTo(this.toScreenX(xMin), this.toScreenY(data.asymptotes.evaluate(xMin, -1)));
    ctx.lineTo(this.toScreenX(xMax), this.toScreenY(data.asymptotes.evaluate(xMax, -1)));
    ctx.stroke();

    ctx.restore();
  }

  drawRectangle(data) {
    const ctx = this.ctx;
    const rect = data.rectangle;

    const sx = this.toScreenX(rect.x);
    const sy = this.toScreenY(rect.y + rect.height);
    const sw = rect.width * this.scale;
    const sh = rect.height * this.scale;

    ctx.save();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.05)';
    ctx.fillRect(sx, sy, sw, sh);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(sx, sy, sw, sh);
    ctx.restore();
  }

  drawHyperbolaCurves(data) {
    const { h, k, a, b, orientation } = data;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const ctx = this.ctx;

    ctx.save();
    ctx.strokeStyle = '#38bdf8'; // Cyan brillante
    ctx.lineWidth = 2.5;

    const numPoints = 250;

    if (orientation === 'horizontal') {
      const xMaxWorld = Math.max(Math.abs(this.toWorldX(width) - h), Math.abs(this.toWorldX(0) - h)) + 5;

      const drawBranch = (signX) => {
        // Rama superior
        ctx.beginPath();
        for (let i = 0; i <= numPoints; i++) {
          const t = (i / numPoints);
          const currentA = a + t * (xMaxWorld - a);
          const x = h + signX * currentA;
          const inside = (currentA * currentA) / (a * a) - 1;
          const y = k + b * Math.sqrt(Math.max(0, inside));
          const sx = this.toScreenX(x);
          const sy = this.toScreenY(y);
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();

        // Rama inferior
        ctx.beginPath();
        for (let i = 0; i <= numPoints; i++) {
          const t = (i / numPoints);
          const currentA = a + t * (xMaxWorld - a);
          const x = h + signX * currentA;
          const inside = (currentA * currentA) / (a * a) - 1;
          const y = k - b * Math.sqrt(Math.max(0, inside));
          const sx = this.toScreenX(x);
          const sy = this.toScreenY(y);
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      };

      drawBranch(1);  // Rama derecha
      drawBranch(-1); // Rama izquierda
    } else {
      const yMaxWorld = Math.max(Math.abs(this.toWorldY(height) - k), Math.abs(this.toWorldY(0) - k)) + 5;

      const drawBranch = (signY) => {
        // Rama derecha
        ctx.beginPath();
        for (let i = 0; i <= numPoints; i++) {
          const t = (i / numPoints);
          const currentA = a + t * (yMaxWorld - a);
          const y = k + signY * currentA;
          const inside = (currentA * currentA) / (a * a) - 1;
          const x = h + b * Math.sqrt(Math.max(0, inside));
          const sx = this.toScreenX(x);
          const sy = this.toScreenY(y);
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();

        // Rama izquierda
        ctx.beginPath();
        for (let i = 0; i <= numPoints; i++) {
          const t = (i / numPoints);
          const currentA = a + t * (yMaxWorld - a);
          const y = k + signY * currentA;
          const inside = (currentA * currentA) / (a * a) - 1;
          const x = h - b * Math.sqrt(Math.max(0, inside));
          const sx = this.toScreenX(x);
          const sy = this.toScreenY(y);
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      };

      drawBranch(1);  // Rama superior
      drawBranch(-1); // Rama inferior
    }

    ctx.restore();
  }

  drawMarker(x, y, color, label, labelOffset = { dx: 8, dy: -8 }) {
    const sx = this.toScreenX(x);
    const sy = this.toScreenY(y);
    const ctx = this.ctx;

    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(sx, sy, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (label) {
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillStyle = '#f1f5f9';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, sx + labelOffset.dx, sy + labelOffset.dy);
    }
    ctx.restore();
  }

  render() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const ctx = this.ctx;

    // Limpieza de canvas
    ctx.clearRect(0, 0, width, height);

    this.drawGrid();

    if (!this.currentData) return;

    this.drawRectangle(this.currentData);
    this.drawAsymptotes(this.currentData);
    this.drawHyperbolaCurves(this.currentData);

    // Marcadores: Centro, Vértices, Focos
    const { center, vertices, foci } = this.currentData;
    this.drawMarker(center.x, center.y, '#ffffff', `C (${center.x}, ${center.y})`);
    this.drawMarker(vertices.v1.x, vertices.v1.y, '#38bdf8', 'V₁');
    this.drawMarker(vertices.v2.x, vertices.v2.y, '#38bdf8', 'V₂');
    this.drawMarker(foci.f1.x, foci.f1.y, '#f43f5e', 'F₁');
    this.drawMarker(foci.f2.x, foci.f2.y, '#f43f5e', 'F₂');
  }
}
