import React from 'react';
import ReactDOM from 'react-dom/client';
import * as maplibregl from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import App from './App.jsx';
import './index.css';

// Ensure MapLibre GL uses the correct worker asset URL across Vite dev and production builds
if (maplibregl?.setWorkerUrl) {
  maplibregl.setWorkerUrl(maplibreWorkerUrl);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

