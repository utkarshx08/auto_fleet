import React from 'react';
import { Zap, Fuel as FuelIcon, AlertTriangle, ArrowUpRight, TrendingDown } from 'lucide-react';

export default function Fuel({ vehicles = [] }) {
  const lowFuelVehicles = vehicles.filter((v) => v.fuel < 25);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between py-4 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-1">
            Energy & Consumption
          </p>
          <h1 className="text-[28px] tracking-[-1px] font-bold text-[#f0f0f4] m-0">
            Fuel & energy<span className="text-[#ad91ff]">.</span>
          </h1>
          <p className="text-[12px] text-[#898c98] mt-1">
            Fleet fuel consumption rate, electric charge state, refueling logs, and tank telemetry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-3">
        <div className="bg-[#17191f] border border-[#292c35] p-3.5 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#858894] uppercase">Fleet Avg Efficiency</span>
          <p className="text-xl font-bold text-[#f0f0f4] mt-1 mb-0 font-mono">8.4 L/100km</p>
          <span className="font-mono text-[10px] text-[#80d9a9] block mt-1">↓ 3.1% vs last month</span>
        </div>
        <div className="bg-[#17191f] border border-[#292c35] p-3.5 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#858894] uppercase">Current Total Fuel</span>
          <p className="text-xl font-bold text-[#f0f0f4] mt-1 mb-0 font-mono">68.2% avg</p>
          <span className="font-mono text-[10px] text-[#858894] block mt-1">Across all 28 units</span>
        </div>
        <div className="bg-[#17191f] border border-[#292c35] p-3.5 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#e5a46e] uppercase">Low Tank Warnings</span>
          <p className="text-xl font-bold text-[#e5a46e] mt-1 mb-0 font-mono">{lowFuelVehicles.length} vehicles</p>
          <span className="font-mono text-[10px] text-[#e5a46e] block mt-1">Under 25% capacity</span>
        </div>
        <div className="bg-[#17191f] border border-[#292c35] p-3.5 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#858894] uppercase">Refuel Expenditure</span>
          <p className="text-xl font-bold text-[#f0f0f4] mt-1 mb-0 font-mono">$4,120.50</p>
          <span className="font-mono text-[10px] text-[#858894] block mt-1">Current billing period</span>
        </div>
      </div>

      {/* Fuel Level Registry Table */}
      <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5">
        <h2 className="text-sm font-bold text-[#f0f0f4] mb-3">Live Fuel Level Monitor</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#30323b]">
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Vehicle</th>
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Driver</th>
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Tank Level</th>
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Gauge</th>
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Range Left</th>
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((veh) => {
                const range = Math.round(veh.fuel * 7.5);
                return (
                  <tr key={veh.id} className="border-b border-[#282a33] hover:bg-[#1f212a] transition-colors last:border-0">
                    <td className="py-3 px-2 font-mono text-xs font-bold text-[#e0e0e7]">{veh.plate}</td>
                    <td className="py-3 px-2 text-[10px] text-[#aeb0ba]">{veh.driver}</td>
                    <td className="py-3 px-2 font-mono text-[10px] text-[#d1d1da]">{veh.fuel}%</td>
                    <td className="py-3 px-2">
                      <div className="w-36 h-2 rounded-full bg-[#343640] overflow-hidden">
                        <div
                          style={{ width: `${veh.fuel}%` }}
                          className={`h-full rounded-full ${
                            veh.fuel > 50 ? 'bg-[#82d4a8]' : veh.fuel > 20 ? 'bg-[#e5a46e]' : 'bg-[#e56868]'
                          }`}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-2 font-mono text-[10px] text-[#b49aff]">~{range} km</td>
                    <td className="py-3 px-2">
                      <span
                        className={`font-mono text-[9px] px-2 py-0.5 rounded-full ${
                          veh.fuel > 25
                            ? 'bg-[#1c302a] text-[#83d7a9]'
                            : 'bg-[#382c25] text-[#e5a46e] border border-[#5a4333]'
                        }`}
                      >
                        {veh.fuel > 25 ? 'Normal' : 'Refill Required'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

