import {
  formatStandardEquation,
  formatGeneralEquation,
  formatAsymptoteEquations,
  formatPoint,
  formatNumber
} from '../utils/formatters.js';

export class UIControls {
  constructor({ containerId, onChange, onResetView }) {
    this.container = document.getElementById(containerId);
    this.onChange = onChange;
    this.onResetView = onResetView;

    this.state = {
      h: 0,
      k: 0,
      a: 3,
      b: 2,
      orientation: 'horizontal'
    };

    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="controls-panel">
        <header class="panel-header">
          <div class="logo-badge">
            <span class="icon">∿</span>
            <h1>Hipérbola Engine</h1>
          </div>
          <p class="subtitle">Simulador y analizador geométrico analítico</p>
        </header>

        <section class="control-section">
          <h2>Orientación del Eje Focal</h2>
          <div class="toggle-group" id="orientation-toggle">
            <button type="button" class="btn-toggle active" data-orientation="horizontal">
              Horizontal
              <span class="small-desc">(x - h)²/a² - (y - k)²/b² = 1</span>
            </button>
            <button type="button" class="btn-toggle" data-orientation="vertical">
              Vertical
              <span class="small-desc">(y - k)²/a² - (x - h)²/b² = 1</span>
            </button>
          </div>
        </section>

        <section class="control-section">
          <h2>Parámetros Canónicos</h2>
          <div class="inputs-grid">
            <div class="input-field">
              <label for="input-h">Centro h (x)</label>
              <input type="number" id="input-h" step="0.5" value="${this.state.h}">
            </div>
            <div class="input-field">
              <label for="input-k">Centro k (y)</label>
              <input type="number" id="input-k" step="0.5" value="${this.state.k}">
            </div>
            <div class="input-field">
              <label for="input-a">Semieje transverso (a)</label>
              <input type="number" id="input-a" min="0.1" step="0.5" value="${this.state.a}">
            </div>
            <div class="input-field">
              <label for="input-b">Semieje conjugado (b)</label>
              <input type="number" id="input-b" min="0.1" step="0.5" value="${this.state.b}">
            </div>
          </div>
          <div id="error-message" class="error-banner hidden"></div>
        </section>

        <section class="control-section">
          <h2>Preajustes Rápidos</h2>
          <div class="presets-row">
            <button class="btn-preset" data-preset="unit">Unitaria (a=1, b=1)</button>
            <button class="btn-preset" data-preset="classic">Canónica 3-4-5</button>
            <button class="btn-preset" data-preset="shifted">Desplazada (3, -2)</button>
          </div>
        </section>

        <div class="action-buttons">
          <button id="btn-reset-view" class="btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Centrar Plano
          </button>
        </div>

        <section class="results-section">
          <h2>Ecuaciones</h2>
          <div class="equation-box">
            <span class="eq-tag">Canónica</span>
            <div class="eq-content" id="eq-canonical">-</div>
          </div>
          <div class="equation-box">
            <span class="eq-tag">General</span>
            <div class="eq-content" id="eq-general">-</div>
          </div>

          <h2>Elementos Analíticos</h2>
          <div class="props-grid">
            <div class="prop-card">
              <span class="prop-label">Centro C</span>
              <span class="prop-val" id="val-center">-</span>
            </div>
            <div class="prop-card">
              <span class="prop-label">Dist. Focal (c)</span>
              <span class="prop-val" id="val-c">-</span>
            </div>
            <div class="prop-card">
              <span class="prop-label">Vértices (V₁, V₂)</span>
              <span class="prop-val" id="val-vertices">-</span>
            </div>
            <div class="prop-card">
              <span class="prop-label">Focos (F₁, F₂)</span>
              <span class="prop-val" id="val-foci">-</span>
            </div>
            <div class="prop-card">
              <span class="prop-label">Excentricidad (e)</span>
              <span class="prop-val" id="val-eccentricity">-</span>
            </div>
            <div class="prop-card">
              <span class="prop-label">Lado Recto (LR)</span>
              <span class="prop-val" id="val-lr">-</span>
            </div>
          </div>

          <div class="equation-box mt-3">
            <span class="eq-tag">Asíntotas</span>
            <div class="eq-content" id="eq-asymptotes">-</div>
          </div>
        </section>
      </div>
    `;
  }

  bindEvents() {
    const inputH = this.container.querySelector('#input-h');
    const inputK = this.container.querySelector('#input-k');
    const inputA = this.container.querySelector('#input-a');
    const inputB = this.container.querySelector('#input-b');
    const errorEl = this.container.querySelector('#error-message');

    const readInputs = () => {
      const h = parseFloat(inputH.value);
      const k = parseFloat(inputK.value);
      const a = parseFloat(inputA.value);
      const b = parseFloat(inputB.value);

      if (isNaN(a) || a <= 0 || isNaN(b) || b <= 0) {
        errorEl.textContent = 'Los valores de a y b deben ser números mayores a 0.';
        errorEl.classList.remove('hidden');
        return;
      }

      errorEl.classList.add('hidden');
      this.state.h = isNaN(h) ? 0 : h;
      this.state.k = isNaN(k) ? 0 : k;
      this.state.a = a;
      this.state.b = b;

      this.onChange({ ...this.state });
    };

    [inputH, inputK, inputA, inputB].forEach(input => {
      input.addEventListener('input', readInputs);
    });

    // Toggle de Orientación
    const orientationButtons = this.container.querySelectorAll('.btn-toggle');
    orientationButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        orientationButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.orientation = btn.dataset.orientation;
        this.onChange({ ...this.state });
      });
    });

    // Botones de presets
    this.container.querySelectorAll('.btn-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.dataset.preset;
        if (preset === 'unit') {
          this.setValues({ h: 0, k: 0, a: 1, b: 1, orientation: 'horizontal' });
        } else if (preset === 'classic') {
          this.setValues({ h: 0, k: 0, a: 4, b: 3, orientation: 'horizontal' });
        } else if (preset === 'shifted') {
          this.setValues({ h: 3, k: -2, a: 3, b: 2, orientation: 'vertical' });
        }
      });
    });

    // Reset view
    this.container.querySelector('#btn-reset-view').addEventListener('click', () => {
      if (this.onResetView) {
        this.onResetView(this.state.h, this.state.k);
      }
    });
  }

  setValues({ h, k, a, b, orientation }) {
    this.state = { h, k, a, b, orientation };
    this.container.querySelector('#input-h').value = h;
    this.container.querySelector('#input-k').value = k;
    this.container.querySelector('#input-a').value = a;
    this.container.querySelector('#input-b').value = b;

    const orientationButtons = this.container.querySelectorAll('.btn-toggle');
    orientationButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.orientation === orientation);
    });

    this.onChange({ ...this.state });
  }

  updateResults(data) {
    const eqCanonical = this.container.querySelector('#eq-canonical');
    const eqGeneral = this.container.querySelector('#eq-general');
    const valCenter = this.container.querySelector('#val-center');
    const valC = this.container.querySelector('#val-c');
    const valVertices = this.container.querySelector('#val-vertices');
    const valFoci = this.container.querySelector('#val-foci');
    const valEccentricity = this.container.querySelector('#val-eccentricity');
    const valLr = this.container.querySelector('#val-lr');
    const eqAsymptotes = this.container.querySelector('#eq-asymptotes');

    eqCanonical.textContent = formatStandardEquation(data);
    eqGeneral.textContent = formatGeneralEquation(data.generalForm);

    valCenter.textContent = formatPoint(data.center);
    valC.textContent = `${formatNumber(data.c)} (c² = ${formatNumber(data.cSquared)})`;
    valVertices.textContent = `${formatPoint(data.vertices.v1)}, ${formatPoint(data.vertices.v2)}`;
    valFoci.textContent = `${formatPoint(data.foci.f1)}, ${formatPoint(data.foci.f2)}`;
    valEccentricity.textContent = `${formatNumber(data.eccentricity)} (> 1)`;
    valLr.textContent = formatNumber(data.latusRectum);

    const asymp = formatAsymptoteEquations(data);
    eqAsymptotes.innerHTML = `
      <div>${asymp.positive}</div>
      <div>${asymp.negative}</div>
      <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 4px;">${asymp.pointSlope}</div>
    `;
  }
}
