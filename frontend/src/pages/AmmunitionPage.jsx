import { useState, useEffect } from 'react';
import { ammoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GiBullets } from 'react-icons/gi';
import { HiPlus, HiPencil, HiTrash, HiX, HiExclamation } from 'react-icons/hi';
import toast from 'react-hot-toast';

const statusBadge = (s) => {
  const map = { IN_STOCK: 'badge-active', LOW_STOCK: 'badge-inactive', OUT_OF_STOCK: 'badge-danger' };
  return map[s] || 'badge-pending';
};

export default function AmmunitionPage() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const { isAdmin, isOfficer } = useAuth();

  const emptyForm = { name: '', ammoType: '', caliber: '', quantity: 0, reorderThreshold: 100, unitOfMeasure: 'rounds', location: '' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadStock(); }, []);

  const loadStock = async () => {
    try { const res = await ammoAPI.getAll(); setStock(res.data); }
    catch { toast.error('Failed to load ammunition'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (a) => {
    setEditing(a.id);
    setForm({ name: a.name, ammoType: a.ammoType, caliber: a.caliber, quantity: a.quantity, reorderThreshold: a.reorderThreshold, unitOfMeasure: a.unitOfMeasure, location: a.location || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await ammoAPI.update(editing, form); toast.success('Stock updated'); }
      else { await ammoAPI.create(form); toast.success('Stock added'); }
      setShowModal(false); loadStock();
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this stock entry?')) return;
    try { await ammoAPI.delete(id); toast.success('Stock deleted'); loadStock(); }
    catch { toast.error('Delete failed'); }
  };

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });
  const canEdit = isAdmin() || isOfficer();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="page-header"><GiBullets className="w-7 h-7 text-amber-400" /> Ammunition Stock</h1>
        {canEdit && <button onClick={openCreate} className="btn-primary flex items-center gap-2"><HiPlus className="w-5 h-5" /> Add Stock</button>}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="table-container overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>#</th><th>Name</th><th>Type</th><th>Caliber</th><th>Qty</th><th>Threshold</th><th>Location</th><th>Status</th>{canEdit && <th>Actions</th>}</tr></thead>
            <tbody>
              {stock.map((a, i) => (
                <tr key={a.id}>
                  <td className="font-mono text-military-500">{i + 1}</td>
                  <td className="font-semibold text-white flex items-center gap-2">
                    {a.name}
                    {a.quantity <= a.reorderThreshold && <HiExclamation className="w-4 h-4 text-red-400" title="Low Stock!" />}
                  </td>
                  <td>{a.ammoType}</td>
                  <td className="font-mono">{a.caliber}</td>
                  <td className={`font-bold ${a.quantity <= a.reorderThreshold ? 'text-red-400' : 'text-green-400'}`}>{a.quantity?.toLocaleString()}</td>
                  <td className="text-military-400">{a.reorderThreshold?.toLocaleString()}</td>
                  <td>{a.location || '-'}</td>
                  <td><span className={statusBadge(a.status)}>{a.status?.replace('_', ' ')}</span></td>
                  {canEdit && (
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"><HiPencil className="w-4 h-4" /></button>
                        {isAdmin() && <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"><HiTrash className="w-4 h-4" /></button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {stock.length === 0 && <tr><td colSpan={9} className="text-center py-8 text-military-500">No ammunition records</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{editing ? 'Update Stock' : 'Add Ammunition'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-military-700 text-military-400"><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Name *</label><input value={form.name} onChange={set('name')} className="input-field" required /></div>
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Ammo Type *</label><input value={form.ammoType} onChange={set('ammoType')} className="input-field" required placeholder="e.g. FMJ, Hollow Point" /></div>
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Caliber *</label><input value={form.caliber} onChange={set('caliber')} className="input-field" required /></div>
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Quantity *</label><input type="number" value={form.quantity} onChange={set('quantity')} className="input-field" required min="0" /></div>
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Reorder Threshold</label><input type="number" value={form.reorderThreshold} onChange={set('reorderThreshold')} className="input-field" min="1" /></div>
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Location</label><input value={form.location} onChange={set('location')} className="input-field" placeholder="e.g. Depot Alpha" /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Add'} Stock</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
