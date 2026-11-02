import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Send, Terminal, CheckCircle2, AlertTriangle, Radio, ShieldCheck } from 'lucide-react';
import { sendLocationTelemetry } from '../../services/gpsIngestionService';

export default function GpsIngestionTesterModal({
  isOpen,
  onClose,
  vehicles = [],
  onTelemetryIngested
}) {
  const [formData, setFormData] = useState({
    vehicle_id: vehicles[0]?.plate || 'RST-291',
    latitude: 40.7580,
    longitude: -73.9855,
    speed: 54.0,
    heading: 145,
    recorded_at: new Date().toISOString(),
    apiKey: 'autrail-sec-token-2026'
  });

  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const handleSendPing = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setApiResponse(null);

    const payload = {
      vehicle_id: formData.vehicle_id,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      speed: Number(formData.speed),
      heading: Number(formData.heading),
      recorded_at: formData.recorded_at,
      source: 'api_push'
    };

    const res = await sendLocationTelemetry(payload, formData.apiKey);
    setApiResponse(res);
    setLoading(false);

    if (res.ok && res.data?.data) {
      if (onTelemetryIngested) onTelemetryIngested(res.data.data);
    }
  };

  const handleSimulateInvalid = () => {
    setFormData((prev) => ({
      ...prev,
      latitude: 195.42, // invalid latitude > 90
      speed: -20 // invalid negative speed
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hardware GPS Telemetry Gateway"
      subtitle="POST /api/tracking/location — Telemetry Ingestion API"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4 text-xs font-sans">
        {/* Notice */}
        <div className="p-3 bg-[#1c2333] border border-[#2d3a54] rounded-lg text-xs flex items-start gap-2.5 text-[#8dc8ed]">
          <Terminal className="w-5 h-5 text-[#8dc8ed] shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight">
            <b>Secure Gateway Endpoint</b>
            <p className="mt-0.5 text-[#8dc8ed]/80 mb-0 font-mono text-[10px]">
              Accepts validated JSON telemetry from on-board OBD-II hardware, mobile trackers, and satellite gateways.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendPing} className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
                Vehicle ID
              </label>
              <select
                value={formData.vehicle_id}
                onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs cursor-pointer"
              >
                {vehicles.map((v) => (
                  <option key={v.id || v.plate} value={v.plate}>
                    {v.plate} ({v.model})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
                API Authorization Token
              </label>
              <input
                type="text"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
                Latitude (-90 to +90)
              </label>
              <input
                type="number"
                step="0.0001"
                required
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
              />
            </div>

            <div>
              <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
                Longitude (-180 to +180)
              </label>
              <input
                type="number"
                step="0.0001"
                required
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
                Speed (km/h)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                required
                value={formData.speed}
                onChange={(e) => setFormData({ ...formData, speed: Number(e.target.value) })}
                className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
              />
            </div>

            <div>
              <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
                Heading (0 to 360°)
              </label>
              <input
                type="number"
                min="0"
                max="360"
                required
                value={formData.heading}
                onChange={(e) => setFormData({ ...formData, heading: Number(e.target.value) })}
                className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleSimulateInvalid}
              className="text-[10px] text-[#858894] hover:text-red-400 font-mono transition-colors"
            >
              Load Out-Of-Bounds Sample (Test 400)
            </button>

            <div className="flex items-center gap-2">
              <Button variant="quiet" size="sm" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                loading={loading}
                icon={Send}
              >
                Send Telemetry Ping
              </Button>
            </div>
          </div>
        </form>

        {/* Live Terminal Output Window */}
        {apiResponse && (
          <div className="p-3 bg-[#0c0d12] border border-[#242633] rounded-lg font-mono text-[10px] space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#1c1e28] pb-1.5">
              <span className="text-[#858894]">HTTP GATEWAY RESPONSE</span>
              <span
                className={`px-1.5 py-0.2 rounded font-bold ${
                  apiResponse.ok
                    ? 'bg-[#1c302a] text-[#83d7a9] border border-[#2c493d]'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                STATUS {apiResponse.status} {apiResponse.ok ? 'OK' : 'BAD REQUEST'}
              </span>
            </div>

            <pre className="text-[#aeb0ba] overflow-x-auto p-1 leading-relaxed">
              {JSON.stringify(apiResponse.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Modal>
  );
}

