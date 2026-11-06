import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Backend Mock Middleware for POST /api/tracking/location
 * Validates vehicle existence, coordinate ranges, heading, speed, and auth
 */
function gpsIngestionEndpoint() {
  const registeredVehicles = ['RST-291', 'RST-284', 'RST-276', 'RST-265', 'RST-263', 'RST-251'];

  return {
    name: 'gps-ingestion-endpoint',
    configureServer(server) {
      server.middlewares.use('/api/tracking/location', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const errors = [];

              // 1. Vehicle Existence Validation
              if (!payload.vehicle_id || typeof payload.vehicle_id !== 'string') {
                errors.push('vehicle_id is required and must be a string');
              } else if (!registeredVehicles.includes(payload.vehicle_id.trim().toUpperCase())) {
                errors.push(`Unregistered vehicle: ${payload.vehicle_id} is not part of the active fleet directory`);
              }

              // 2. Latitude Validation (-90 to +90)
              const lat = Number(payload.latitude);
              if (isNaN(lat) || lat < -90 || lat > 90) {
                errors.push('latitude must be a valid float between -90.000000 and 90.000000');
              }

              // 3. Longitude Validation (-180 to +180)
              const lng = Number(payload.longitude);
              if (isNaN(lng) || lng < -180 || lng > 180) {
                errors.push('longitude must be a valid float between -180.000000 and 180.000000');
              }

              // 4. Speed Validation (0 to 250 km/h)
              const speed = Number(payload.speed);
              if (isNaN(speed) || speed < 0 || speed > 250) {
                errors.push('speed must be a non-negative float between 0 and 250 km/h');
              }

              // 5. Heading Validation (0 to 360 degrees)
              const heading = Number(payload.heading);
              if (isNaN(heading) || heading < 0 || heading > 360) {
                errors.push('heading must be a float between 0 and 360 degrees');
              }

              // 6. Timestamp Validation
              if (payload.recorded_at) {
                const time = new Date(payload.recorded_at).getTime();
                if (isNaN(time)) {
                  errors.push('recorded_at must be a valid ISO 8601 timestamp');
                }
              }

              // 7. Security / Authentication Token Check (Optional Bearer Token)
              const authHeader = req.headers['authorization'];
              const isAuthorized = !authHeader || authHeader.startsWith('Bearer ') || authHeader.length > 5;
              if (!isAuthorized) {
                errors.push('Unauthorized GPS gateway request: Missing or invalid API credentials');
              }

              if (errors.length > 0) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: false,
                  status: 400,
                  message: 'Validation failed for telemetry payload',
                  errors
                }));
                return;
              }

              const sanitized = {
                vehicle_id: payload.vehicle_id.trim().toUpperCase(),
                latitude: lat,
                longitude: lng,
                speed: Math.round(speed * 10) / 10,
                heading: Math.round(heading),
                recorded_at: payload.recorded_at || new Date().toISOString(),
                source: payload.source || 'api_push',
                ingested_at: new Date().toISOString()
              };

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                status: 200,
                message: `GPS telemetry successfully ingested for ${sanitized.vehicle_id}`,
                data: sanitized
              }));
            } catch (err) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                status: 400,
                error: 'Malformed JSON payload'
              }));
            }
          });
        } else {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            error: 'Method Not Allowed. Use POST /api/tracking/location.'
          }));
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), gpsIngestionEndpoint()],
  server: {
    port: 3000,
    open: false
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor';
            }
            if (id.includes('maplibre-gl')) {
              return 'maps';
            }
            if (id.includes('recharts')) {
              return 'charts';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
          }
        }
      }
    }
  }
});
