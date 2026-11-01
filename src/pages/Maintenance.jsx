import React, { useState } from 'react';
import Button from '../components/common/Button';
import ScheduleServiceModal from '../components/maintenance/ScheduleServiceModal';
import {
  Wrench,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  Fuel,
  Sparkles
} from 'lucide-react';
import { initialAlerts, initialVehicles } from '../data/mockData';

export default function Maintenance({
  alerts = initialAlerts,
  onScheduleService,
  onResolveAlert
}) {
  const [filter, setFilter] = useState('ALL');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const [maintenanceHistory, setMaintenanceHistory] = useState([
    {
      id: 'srv-101',
      vehicle: 'RST-291',
      service: 'Synthetic Oil & Filter Replacement',
      date: '18 Oct 2025',
      provider: 'Manhattan Fleet Hub',
      cost: '$185.00',
      status: 'Completed',
      technician: 'Marcus Vance'
    },
    {
      id: 'srv-102',
      vehicle: 'RST-284',
      service: 'Brake Pad & Rotor Inspection',
      date: '10 Oct 2025',
      provider: 'Apex Automotive Systems',
      cost: '$420.00',
      status: 'Completed',
      technician: 'Elena Rostova'
    },
    {
      id: 'srv-103',
      vehicle: 'RST-276',
      service: 'Transmission Fluid Flush & Coolant',
      date: '28 Sep 2025',
      provider: 'Queens Commercial Fleet Care',
      cost: '$310.00',
      status: 'Completed',
      technician: 'David Miller'
    },
    {
      id: 'srv-104',
      vehicle: 'RST-265',
      service: 'Full 10,000 km Scheduled Inspection',
      date: '15 Sep 2025',
      provider: 'Northstar Central Depot',
      cost: '$240.00',
      status: 'Completed',
      technician: 'Marcus Vance'
    }
  ]);

  const handleCreateServiceRecord = (record) => {
    setMaintenanceHistory((prev) => [record, ...prev]);
    if (onScheduleService) onScheduleService(record);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-end justify-between py-4 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-1">
            Preventative Fleet Care
          </p>
          <h1 className="text-[28px] tracking-[-1px] font-bold text-[#f0f0f4] m-0">
            Maintenance<span className="text-[#ad91ff]">.</span>
          </h1>
          <p className="text-[12px] text-[#898c98] mt-1">
            Service schedules, preventative inspections, diagnostics, and historical work orders.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsScheduleOpen(true)}
          icon={Plus}
        >
          Schedule service
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-3">
        <div className="bg-[#17191f] border border-[#292c35] p-3.5 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#e5a46e] uppercase">Active Alerts</span>
          <p className="text-xl font-bold text-[#e5a46e] mt-1 mb-0">{alerts.length}</p>
        </div>
        <div className="bg-[#17191f] border border-[#292c35] p-3.5 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#858894] uppercase">Due in 7 Days</span>
          <p className="text-xl font-bold text-[#f0f0f4] mt-1 mb-0">3 vehicles</p>
        </div>
        <div className="bg-[#17191f] border border-[#292c35] p-3.5 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#83d7a9] uppercase">Compliance Rate</span>
          <p className="text-xl font-bold text-[#83d7a9] mt-1 mb-0">99.2%</p>
        </div>
        <div className="bg-[#17191f] border border-[#292c35] p-3.5 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#b49aff] uppercase">Avg Turnaround</span>
          <p className="text-xl font-bold text-[#b49aff] mt-1 mb-0">4.2 hrs</p>
        </div>
      </div>

      {/* Critical Attention Needed Section */}
      <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#e5a46e]" />
            <h2 className="text-sm font-bold text-[#f0f0f4] m-0">Urgent Attention Queue</h2>
          </div>
          <span className="font-mono text-[10px] text-[#858894]">Real-time telemetry triage</span>
        </div>

        {alerts.length === 0 ? (
          <div className="p-8 text-center bg-[#121319] border border-[#252730] rounded-lg text-[#858894]">
            <CheckCircle2 className="w-6 h-6 text-[#8be0b3] mx-auto mb-2" />
            <p className="text-xs">No active maintenance alerts. Fleet is healthy.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-3 mt-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-[#121319] border border-[#2b2e38] hover:border-[#423d54] p-3.5 rounded-[9px] flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-[#382c25] text-[#e3ac77] border border-[#523d30]">
                      {alert.type.toUpperCase()}
                    </span>
                    <span className="font-mono text-[8px] text-[#70737f]">{alert.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#f0f0f4]">{alert.title}</h4>
                  <p className="text-[10px] text-[#999ca7] mt-1 mb-0">{alert.desc}</p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-2.5 border-t border-[#1e2029]">
                  <span className="font-mono text-[9px] text-[#b49aff]">{alert.vehicle}</span>
                  <Button
                    variant="text"
                    size="sm"
                    onClick={() => onResolveAlert && onResolveAlert(alert)}
                  >
                    Resolve Alert ↗
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service History Log Table */}
      <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-0.5">
              Service Registry
            </p>
            <h2 className="text-sm font-bold text-[#f0f0f4] m-0">Maintenance History</h2>
          </div>
          <span className="font-mono text-[10px] text-[#858894]">Showing past 30 days</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#30323b]">
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Service ID</th>
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Vehicle</th>
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Service Type</th>
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Date</th>
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Technician</th>
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Cost</th>
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceHistory.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[#282a33] hover:bg-[#1f212a] transition-colors last:border-0"
                >
                  <td className="py-3 px-2 font-mono text-[10px] text-[#b49aff]">{item.id}</td>
                  <td className="py-3 px-2 font-mono text-[10px] text-[#e0e0e7] font-bold">{item.vehicle}</td>
                  <td className="py-3 px-2 text-[10px] text-[#d1d1da]">{item.service}</td>
                  <td className="py-3 px-2 font-mono text-[9px] text-[#858894]">{item.date}</td>
                  <td className="py-3 px-2 text-[10px] text-[#aeb0ba]">{item.technician}</td>
                  <td className="py-3 px-2 font-mono text-[10px] text-[#e0e0e7] font-semibold">{item.cost}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`font-mono text-[9px] flex items-center gap-1.5 ${
                        item.status === 'Completed' ? 'text-[#83d7a9]' : 'text-[#b49aff]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'Completed' ? 'bg-[#83d7a9]' : 'bg-[#b49aff]'
                        }`}
                      />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ScheduleServiceModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onScheduleService={handleCreateServiceRecord}
        vehicles={initialVehicles}
      />
    </div>
  );
}
