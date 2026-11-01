import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Download, FileText, Printer, CheckCircle2 } from 'lucide-react';

export default function AnalyticsReportExportModal({
  isOpen,
  onClose,
  kpiMetrics,
  fuelData,
  mileageData,
  utilizationData,
  expenseData,
  onExportCSV
}) {
  const [reportType, setReportType] = useState('full');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCSV = () => {
    if (onExportCSV) onExportCSV();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Advanced Fleet Intelligence Report"
      subtitle="Operational Telemetry & Financial Audits"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs font-sans">
        <p className="text-[11px] text-[#858894]">
          Export verified mathematical performance indicators, fuel metrics, utilization logs, and expense audits.
        </p>

        <div className="space-y-2">
          <label className="font-mono text-[9px] text-[#858894] uppercase block">
            Select Report Scope
          </label>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <button
              type="button"
              onClick={() => setReportType('full')}
              className={`p-2.5 rounded-lg border text-left transition-colors ${
                reportType === 'full'
                  ? 'bg-[#24212f] border-[#b49aff] text-[#e9e2ff] font-bold'
                  : 'bg-[#17191f] border-[#292c35] text-[#aeb0ba] hover:bg-[#20222a]'
              }`}
            >
              <b className="block">Consolidated Audit</b>
              <span className="text-[9px] text-[#747783] font-normal">All 4 modules + 6 core KPIs</span>
            </button>

            <button
              type="button"
              onClick={() => setReportType('fuel')}
              className={`p-2.5 rounded-lg border text-left transition-colors ${
                reportType === 'fuel'
                  ? 'bg-[#24212f] border-[#b49aff] text-[#e9e2ff] font-bold'
                  : 'bg-[#17191f] border-[#292c35] text-[#aeb0ba] hover:bg-[#20222a]'
              }`}
            >
              <b className="block">Fuel & Energy Focus</b>
              <span className="text-[9px] text-[#747783] font-normal">Tank levels & efficiency matrices</span>
            </button>
          </div>
        </div>

        {/* Export Options */}
        <div className="pt-2 border-t border-[#252730] space-y-2.5">
          <button
            type="button"
            onClick={handleCSV}
            className="w-full flex items-center justify-between p-3 bg-[#121319] border border-[#2b2e38] hover:border-[#433b5c] rounded-lg transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-[#8be0b3]" />
              <div className="text-left">
                <b className="text-[11px] text-[#f0f0f4] group-hover:text-[#b49aff] transition-colors block">
                  Export Tabular CSV / Excel
                </b>
                <span className="text-[9px] text-[#858894]">Structured raw data for financial analysis</span>
              </div>
            </div>
            <span className="font-mono text-[9px] text-[#8be0b3] bg-[#1c302a] px-2 py-0.5 rounded">
              .CSV
            </span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full flex items-center justify-between p-3 bg-[#121319] border border-[#2b2e38] hover:border-[#433b5c] rounded-lg transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Printer className="w-4 h-4 text-[#b49aff]" />
              <div className="text-left">
                <b className="text-[11px] text-[#f0f0f4] group-hover:text-[#b49aff] transition-colors block">
                  Print / Download PDF Report
                </b>
                <span className="text-[9px] text-[#858894]">Executive layout with charts & KPIs</span>
              </div>
            </div>
            <span className="font-mono text-[9px] text-[#b49aff] bg-[#24212f] px-2 py-0.5 rounded">
              .PDF
            </span>
          </button>
        </div>

        {downloadSuccess && (
          <div className="flex items-center gap-2 text-[#80d9a9] font-mono text-[10px] bg-[#1c302a] p-2 rounded">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CSV downloaded successfully to your device.</span>
          </div>
        )}

        <div className="pt-2 border-t border-[#252730] flex justify-end">
          <Button variant="default" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

