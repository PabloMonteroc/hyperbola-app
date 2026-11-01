import './style.css';
import { computeHyperbola } from './math/hyperbolaEngine.js';
import { GraphCanvas } from './components/GraphCanvas.js';
import { UIControls } from './components/UIControls.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvasEl = document.getElementById('graph-canvas');
  const graphCanvas = new GraphCanvas(canvasEl);

  const updateVisualization = (params) => {
    try {
      const data = computeHyperbola(params);
      graphCanvas.setData(data);
      uiControls.updateResults(data);
    } catch (err) {
      console.error('Error calculando la hipérbola:', err.message);
    }
  };

  const uiControls = new UIControls({
    containerId: 'sidebar',
    onChange: (params) => {
      updateVisualization(params);
    },
    onResetView: (h, k) => {
      graphCanvas.resetView(h, k);
    }
  });

  // Render inicial con los valores por defecto
  updateVisualization(uiControls.state);
  graphCanvas.resetView(uiControls.state.h, uiControls.state.k);
});
