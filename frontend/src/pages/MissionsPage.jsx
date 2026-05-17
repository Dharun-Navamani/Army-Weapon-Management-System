import { useState, useEffect } from 'react';
import { missionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GiMilitaryFort } from 'react-icons/gi';
import { HiPlus, HiPencil, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const statusBadge = (s) => {
  const map = { PLANNED: 'badge-info', ACTIVE: 'badge-active', COMPLETED: 'badge-pending', ABORTED: 'badge-danger' };
  return map[s] || 'badge-pending';
};

export default function MissionsPage() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const { isAdmin, isOfficer } = useAuth();

  const emptyForm = { missionName: '', missionCode: '', description: '', location: '', startDate: '', endDate: '', status: 'PLANNED' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadMissions(); }, []);

  const loadMissions = async () => {
    try { const res = await missionAPI.getAll(); setMissions(res.data); }
    catch { toast.error('Failed to load missions'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (m) => {
    setEditing(m.id);
    setForm({ missionName: m.missionName, missionCode: m.missionCode || '', description: m.description || '', location: m.location || '', startDate: m.startDate, endDate: m.endDate || '', status: m.status });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await missionAPI.update(editing, form); toast.success('Mission updated'); }
      else { await missionAPI.create(form); toast.success('Mission created'); }
      setShowModal(false); loadMissions();
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
  };

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });
  const canEdit = isAdmin() || isOfficer();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="page-header"><GiMilitaryFort className="w-7 h-7 text-purple-400" /> Mission Logs</h1>
        {canEdit && <button onClick={openCreate} className="btn-primary flex items-center gap-2"><HiPlus className="w-5 h-5" /> New Mission</button>}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {missions.map((m) => (
            <div key={m.id} className="glass-card-hover p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-white">{m.missionName}</h3>
                  {m.missionCode && <p className="text-xs font-mono text-military-400">{m.missionCode}</p>}
                </div>
                <span className={statusBadge(m.status)}>{m.status}</span>
              </div>
              {m.description && <p className="text-sm text-military-300 mb-3 line-clamp-2">{m.description}</p>}
              <div className="space-y-1.5 text-xs text-military-400">
                {m.location && <p>📍 {m.location}</p>}
                <p>📅 {m.startDate} {m.endDate ? `→ ${m.endDate}` : '(ongoing)'}</p>
                {m.commandingOfficer && <p>👤 {m.commandingOfficer.fullName}</p>}
                {m.missionWeapons?.length > 0 && <p>🔫 {m.missionWeapons.length} weapon(s) deployed</p>}
              </div>
              {canEdit && (
                <button onClick={() => openEdit(m)} className="mt-3 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                  <HiPencil className="w-3.5 h-3.5" /> Edit
                </button>
              )}
            </div>
          ))}
          {missions.length === 0 && <p className="col-span-full text-center py-8 text-military-500">No missions logged</p>}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{editing ? 'Update Mission' : 'New Mission'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-military-700 text-military-400"><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="text-xs font-medium text-military-300 mb-1 block">Mission Name *</label><input value={form.missionName} onChange={set('missionName')} className="input-field" required /></div>
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Mission Code</label><input value={form.missionCode} onChange={set('missionCode')} className="input-field" placeholder="e.g. OTS-2024-01" /></div>
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Location</label><input value={form.location} onChange={set('location')} className="input-field" /></div>
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Start Date *</label><input type="date" value={form.startDate} onChange={set('startDate')} className="input-field" required /></div>
                <div><label className="text-xs font-medium text-military-300 mb-1 block">End Date</label><input type="date" value={form.endDate} onChange={set('endDate')} className="input-field" /></div>
              </div>
              <div><label className="text-xs font-medium text-military-300 mb-1 block">Description</label><textarea value={form.description} onChange={set('description')} className="input-field" rows="3" /></div>
              <div><label className="text-xs font-medium text-military-300 mb-1 block">Status</label>
                <select value={form.status} onChange={set('status')} className="select-field">
                  <option value="PLANNED">Planned</option><option value="ACTIVE">Active</option><option value="COMPLETED">Completed</option><option value="ABORTED">Aborted</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Create'} Mission</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
