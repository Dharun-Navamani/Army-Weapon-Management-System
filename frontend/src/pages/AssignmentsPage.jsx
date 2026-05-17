import { useState, useEffect } from 'react';
import { assignmentAPI, weaponAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HiOutlineSwitchHorizontal, HiPlus, HiPencil, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const statusBadge = (s) => {
  const map = { ACTIVE: 'badge-active', RETURNED: 'badge-info', OVERDUE: 'badge-danger', LOST: 'badge-danger' };
  return map[s] || 'badge-pending';
};

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const { isAdmin, isOfficer } = useAuth();

  const emptyForm = { weaponId: '', assignedToId: '', assignmentDate: new Date().toISOString().split('T')[0], expectedReturnDate: '', conditionOnIssue: 'GOOD', status: 'ACTIVE', notes: '' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [aRes, wRes] = await Promise.all([assignmentAPI.getAll(), weaponAPI.getAll()]);
      setAssignments(aRes.data);
      setWeapons(wRes.data);
      try { const uRes = await authAPI.getUsers(); setUsers(uRes.data); } catch { /* non-admin */ }
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (a) => {
    setEditing(a.id);
    setForm({ weaponId: a.weapon?.id, assignedToId: a.assignedTo?.id, assignmentDate: a.assignmentDate, expectedReturnDate: a.expectedReturnDate || '', actualReturnDate: a.actualReturnDate || '', conditionOnIssue: a.conditionOnIssue, conditionOnReturn: a.conditionOnReturn || '', status: a.status, notes: a.notes || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await assignmentAPI.update(editing, form); toast.success('Assignment updated'); }
      else { await assignmentAPI.create(form); toast.success('Assignment created'); }
      setShowModal(false); loadAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
  };

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });
  const canEdit = isAdmin() || isOfficer();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="page-header"><HiOutlineSwitchHorizontal className="w-7 h-7 text-blue-400" /> Weapon Assignments</h1>
        {canEdit && <button onClick={openCreate} className="btn-primary flex items-center gap-2"><HiPlus className="w-5 h-5" /> New Assignment</button>}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="table-container overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>#</th><th>Weapon</th><th>Assigned To</th><th>Assigned By</th><th>Date</th><th>Return Date</th><th>Status</th>{canEdit && <th>Actions</th>}</tr></thead>
            <tbody>
              {assignments.map((a, i) => (
                <tr key={a.id}>
                  <td className="font-mono text-military-500">{i + 1}</td>
                  <td className="font-semibold text-white">{a.weapon?.name} <span className="text-xs text-military-500 font-mono">({a.weapon?.serialNumber})</span></td>
                  <td>{a.assignedTo?.fullName}</td>
                  <td className="text-military-400">{a.assignedBy?.fullName}</td>
                  <td className="font-mono text-sm">{a.assignmentDate}</td>
                  <td className="font-mono text-sm">{a.expectedReturnDate || '-'}</td>
                  <td><span className={statusBadge(a.status)}>{a.status}</span></td>
                  {canEdit && (
                    <td><button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"><HiPencil className="w-4 h-4" /></button></td>
                  )}
                </tr>
              ))}
              {assignments.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-military-500">No assignments found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{editing ? 'Update Assignment' : 'New Assignment'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-military-700 text-military-400"><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editing && (
                <>
                  <div><label className="text-xs font-medium text-military-300 mb-1 block">Weapon *</label>
                    <select value={form.weaponId} onChange={set('weaponId')} className="select-field" required>
                      <option value="">Select Weapon</option>
                      {weapons.map(w => <option key={w.id} value={w.id}>{w.name} ({w.serialNumber})</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs font-medium text-military-300 mb-1 block">Assign To *</label>
                    <select value={form.assignedToId} onChange={set('assignedToId')} className="select-field" required>
                      <option value="">Select User</option>
                      {users.map(u => <option key={u.id} value={u.id}>{u.fullName} ({u.rankTitle})</option>)}
                    </select>
                  </div>
                </>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Assignment Date</label><input type="date" value={form.assignmentDate} onChange={set('assignmentDate')} className="input-field" /></div>
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Expected Return</label><input type="date" value={form.expectedReturnDate} onChange={set('expectedReturnDate')} className="input-field" /></div>
              </div>
              {editing && (
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-medium text-military-300 mb-1 block">Actual Return Date</label><input type="date" value={form.actualReturnDate || ''} onChange={set('actualReturnDate')} className="input-field" /></div>
                  <div><label className="text-xs font-medium text-military-300 mb-1 block">Condition on Return</label><input value={form.conditionOnReturn || ''} onChange={set('conditionOnReturn')} className="input-field" placeholder="e.g. GOOD, FAIR, DAMAGED" /></div>
                </div>
              )}
              <div><label className="text-xs font-medium text-military-300 mb-1 block">Status</label>
                <select value={form.status} onChange={set('status')} className="select-field">
                  <option value="ACTIVE">Active</option><option value="RETURNED">Returned</option><option value="OVERDUE">Overdue</option><option value="LOST">Lost</option>
                </select>
              </div>
              <div><label className="text-xs font-medium text-military-300 mb-1 block">Notes</label><textarea value={form.notes} onChange={set('notes')} className="input-field" rows="2" /></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Create'} Assignment</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
