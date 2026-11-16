import React from 'react';
import ReactDOM from 'react-dom/client';
import * as maplibregl from 'maplibre-gl';
import App from './App.jsx';
import './index.css';

// Ensure MapLibre GL uses the static public worker asset across Vite dev and production builds
if (typeof maplibregl.setWorkerUrl === 'function') {
  maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

