import { useState } from 'react';
import { reportAPI } from '../services/api';
import { HiOutlineDocumentReport, HiDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);

  const downloadPDF = async () => {
    setGenerating(true);
    try {
      const res = await reportAPI.generatePDF();
      // Create blob URL and trigger download
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `weapon_inventory_report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded successfully!');
    } catch {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const reportTypes = [
    { title: 'Weapon Inventory Report', desc: 'Complete listing of all weapons with serial numbers, types, calibers, quantities, and status.', action: downloadPDF, available: true },
    { title: 'Assignment History Report', desc: 'All weapon assignments with soldier details, dates, and return conditions.', action: null, available: false },
    { title: 'Maintenance Summary Report', desc: 'Maintenance requests summary with status, priority, and resolution details.', action: null, available: false },
    { title: 'Ammunition Consumption Report', desc: 'Ammunition usage patterns and restocking history by caliber and type.', action: null, available: false },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-header"><HiOutlineDocumentReport className="w-7 h-7 text-indigo-400" /> Reports & Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report, i) => (
          <div key={i} className="glass-card-hover p-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${report.available ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-military-700'}`}>
                <HiOutlineDocumentReport className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white mb-1">{report.title}</h3>
                <p className="text-sm text-military-400 mb-4">{report.desc}</p>
                {report.available ? (
                  <button onClick={report.action} disabled={generating}
                    className="btn-primary text-sm flex items-center gap-2">
                    {generating ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <HiDownload className="w-4 h-4" />
                    )}
                    {generating ? 'Generating...' : 'Download PDF'}
                  </button>
                ) : (
                  <span className="text-xs text-military-500 italic">Coming soon</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info card */}
      <div className="glass-card p-5 border-l-4 border-blue-500">
        <h3 className="text-sm font-semibold text-white mb-1">💡 About Reports</h3>
        <p className="text-sm text-military-400">
          Reports are generated as PDF documents using iText 7. The Weapon Inventory Report includes
          all weapons in the system with their current status, quantity, and classification details.
          Reports include timestamps and can be printed for official documentation.
        </p>
      </div>
    </div>
  );
}
