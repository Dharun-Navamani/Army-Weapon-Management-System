import { useState, useEffect } from 'react';
import { maintenanceAPI, weaponAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HiOutlineCog, HiPlus, HiPencil, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const statusBadge = (s) => {
  const map = { PENDING: 'badge-pending', IN_PROGRESS: 'badge-info', COMPLETED: 'badge-active', CANCELLED: 'badge-danger' };
  return map[s] || 'badge-pending';
};
const priorityBadge = (p) => {
  const map = { LOW: 'badge-info', MEDIUM: 'badge-pending', HIGH: 'badge-inactive', CRITICAL: 'badge-danger' };
  return map[p] || 'badge-pending';
};

export default function MaintenancePage() {
  const [requests, setRequests] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const { isAdmin, isOfficer } = useAuth();

  const emptyForm = { weaponId: '', issueDescription: '', priority: 'MEDIUM', status: 'PENDING', resolutionNotes: '' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [mRes, wRes] = await Promise.all([maintenanceAPI.getAll(), weaponAPI.getAll()]);
      setRequests(mRes.data);
      setWeapons(wRes.data);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (r) => {
    setEditing(r.id);
    setForm({ weaponId: r.weapon?.id, issueDescription: r.issueDescription, priority: r.priority, status: r.status, resolutionNotes: r.resolutionNotes || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await maintenanceAPI.update(editing, form); toast.success('Request updated'); }
      else { await maintenanceAPI.create(form); toast.success('Request submitted'); }
      setShowModal(false); loadAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
  };

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="page-header"><HiOutlineCog className="w-7 h-7 text-amber-400" /> Maintenance & Repair</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><HiPlus className="w-5 h-5" /> New Request</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="table-container overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>#</th><th>Weapon</th><th>Issue</th><th>Requested By</th><th>Priority</th><th>Status</th><th>Date</th>{(isAdmin() || isOfficer()) && <th>Actions</th>}</tr></thead>
            <tbody>
              {requests.map((r, i) => (
                <tr key={r.id}>
                  <td className="font-mono text-military-500">{i + 1}</td>
                  <td className="font-semibold text-white">{r.weapon?.name}</td>
                  <td className="max-w-xs truncate">{r.issueDescription}</td>
                  <td>{r.requestedBy?.fullName}</td>
                  <td><span className={priorityBadge(r.priority)}>{r.priority}</span></td>
                  <td><span className={statusBadge(r.status)}>{r.status}</span></td>
                  <td className="font-mono text-sm text-military-400">{r.requestedDate?.split('T')[0]}</td>
                  {(isAdmin() || isOfficer()) && (
                    <td><button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"><HiPencil className="w-4 h-4" /></button></td>
                  )}
                </tr>
              ))}
              {requests.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-military-500">No maintenance requests</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{editing ? 'Update Request' : 'New Maintenance Request'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-military-700 text-military-400"><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editing && (
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Weapon *</label>
                  <select value={form.weaponId} onChange={set('weaponId')} className="select-field" required>
                    <option value="">Select Weapon</option>
                    {weapons.map(w => <option key={w.id} value={w.id}>{w.name} ({w.serialNumber})</option>)}
                  </select>
                </div>
              )}
              <div><label className="text-xs font-medium text-military-300 mb-1 block">Issue Description *</label>
                <textarea value={form.issueDescription} onChange={set('issueDescription')} className="input-field" rows="3" required placeholder="Describe the issue..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Priority</label>
                  <select value={form.priority} onChange={set('priority')} className="select-field">
                    <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option>
                  </select>
                </div>
                {editing && (
                  <div><label className="text-xs font-medium text-military-300 mb-1 block">Status</label>
                    <select value={form.status} onChange={set('status')} className="select-field">
                      <option value="PENDING">Pending</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                )}
              </div>
              {editing && (
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Resolution Notes</label>
                  <textarea value={form.resolutionNotes} onChange={set('resolutionNotes')} className="input-field" rows="2" placeholder="Describe resolution..." />
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Submit'} Request</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
