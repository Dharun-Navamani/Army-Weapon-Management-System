import { useState, useEffect } from 'react';
import { auditAPI } from '../services/api';
import { HiOutlineClipboardList, HiFilter } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { loadLogs(); }, []);

  const loadLogs = async () => {
    try { const res = await auditAPI.getAll(); setLogs(res.data); }
    catch { toast.error('Failed to load audit logs'); }
    finally { setLoading(false); }
  };

  const filterByEntity = async (type) => {
    setFilter(type);
    if (type === 'ALL') { loadLogs(); return; }
    try { const res = await auditAPI.getByEntity(type); setLogs(res.data); }
    catch { toast.error('Filter failed'); }
  };

  const actionColor = (a) => {
    if (a === 'CREATE') return 'text-green-400 bg-green-500/10';
    if (a === 'UPDATE') return 'text-blue-400 bg-blue-500/10';
    return 'text-red-400 bg-red-500/10';
  };

  const entities = ['ALL', 'Weapon', 'Assignment', 'MaintenanceRequest', 'AmmunitionStock', 'Mission'];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-header"><HiOutlineClipboardList className="w-7 h-7 text-cyan-400" /> Audit Trail</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {entities.map(e => (
          <button key={e} onClick={() => filterByEntity(e)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === e ? 'bg-military-600 text-white' : 'bg-military-800/50 text-military-400 hover:text-white hover:bg-military-700/50'}`}>
            {e === 'ALL' ? 'All' : e.replace('Request', ' Req.').replace('Stock', '')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="glass-card p-4 flex items-start gap-4 hover:border-military-600/40 transition-colors">
              <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${actionColor(log.action)}`}>
                {log.action}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">
                  <span className="font-semibold">{log.performedBy}</span>
                  {' performed '}<span className="font-mono text-military-300">{log.action}</span>
                  {' on '}<span className="text-military-200 font-medium">{log.entityType}</span>
                  {log.entityId && <span className="text-military-500"> #{log.entityId}</span>}
                </p>
                {(log.oldValue || log.newValue) && (
                  <div className="mt-1.5 text-xs text-military-400 space-y-0.5">
                    {log.oldValue && <p><span className="text-red-400/70">Old:</span> {log.oldValue}</p>}
                    {log.newValue && <p><span className="text-green-400/70">New:</span> {log.newValue}</p>}
                  </div>
                )}
              </div>
              <span className="text-xs text-military-500 whitespace-nowrap font-mono">{log.timestamp?.replace('T', ' ').substring(0, 19)}</span>
            </div>
          ))}
          {logs.length === 0 && <p className="text-center py-8 text-military-500">No audit logs found</p>}
        </div>
      )}
    </div>
  );
}
