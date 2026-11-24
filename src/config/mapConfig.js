/**
 * AUTRAIL CARTO Basemap Engine & Tile Configuration
 * Certified integration with CARTO Voyager Navigation & Dark Matter Tactical basemaps.
 * API Key: cb1_59iy_1_7b11bf1fa89a2915b8c2eb95
 */

export const CARTO_API_KEY =
  import.meta.env.VITE_CARTO_API_KEY || 'cb1_59iy_1_7b11bf1fa89a2915b8c2eb95';

export const CARTO_VOYAGER_BASE_URL =
  import.meta.env.VITE_CARTO_VOYAGER_URL ||
  `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`;

export const CARTO_DARK_BASE_URL =
  import.meta.env.VITE_CARTO_DARK_URL ||
  `https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`;

export const CARTO_VOYAGER_VECTOR_STYLE =
  import.meta.env.VITE_CARTO_VECTOR_STYLE ||
  `https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json?key=${CARTO_API_KEY}`;

export const CARTO_DARK_VECTOR_STYLE =
  `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json?key=${CARTO_API_KEY}`;

/**
 * High-performance Raster Map Style Specification for CARTO Voyager
 * Uses base URL with sharded subdomains (a, b, c, d) and direct fallback
 */
export const CARTO_VOYAGER_STYLE = {
  version: 8,
  sources: {
    'carto-voyager': {
      type: 'raster',
      tiles: [
        `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`,
        `https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`,
        `https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`,
        `https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`,
        `https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors, © CARTO'
    }
  },
  layers: [
    {
      id: 'carto-voyager-layer',
      type: 'raster',
      source: 'carto-voyager',
      minzoom: 0,
      maxzoom: 20
    }
  ]
};

/**
 * High-performance Raster Map Style Specification for CARTO Dark Matter
 */
export const CARTO_DARK_STYLE = {
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        `https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`,
        `https://a.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`,
        `https://b.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`,
        `https://c.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`,
        `https://d.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors, © CARTO'
    }
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 20
    }
  ]
};

/**
 * Resolves map style based on active theme or mode preference
 * @param {'voyager' | 'dark' | string} mode
 */
export function getMapStyle(mode = 'voyager') {
  if (mode === 'dark' || mode === 'dark-liquid-glass') {
    return CARTO_DARK_STYLE;
  }
  return CARTO_VOYAGER_STYLE;
}
