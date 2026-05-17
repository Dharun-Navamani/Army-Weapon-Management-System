import { useState, useEffect } from 'react';
import { weaponAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GiAk47 } from 'react-icons/gi';
import { HiPlus, HiPencil, HiTrash, HiSearch, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const statusBadge = (s) => {
  if (s === 'ACTIVE') return 'badge-active';
  if (s === 'INACTIVE') return 'badge-inactive';
  return 'badge-danger';
};

export default function WeaponsPage() {
  const [weapons, setWeapons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const { isAdmin } = useAuth();

  const emptyForm = { name: '', serialNumber: '', weaponType: '', caliber: '', manufacturer: '', quantity: 1, status: 'ACTIVE', description: '' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadWeapons(); }, []);

  const loadWeapons = async () => {
    try {
      const res = await weaponAPI.getAll();
      setWeapons(res.data);
    } catch { toast.error('Failed to load weapons'); }
    finally { setLoading(false); }
  };

  const handleSearch = async () => {
    if (!search.trim()) { loadWeapons(); return; }
    try {
      const res = await weaponAPI.search(search);
      setWeapons(res.data);
    } catch { toast.error('Search failed'); }
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (w) => {
    setEditing(w.id);
    setForm({ name: w.name, serialNumber: w.serialNumber, weaponType: w.weaponType, caliber: w.caliber || '', manufacturer: w.manufacturer || '', quantity: w.quantity, status: w.status, description: w.description || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await weaponAPI.update(editing, form);
        toast.success('Weapon updated');
      } else {
        await weaponAPI.create(form);
        toast.success('Weapon added');
      }
      setShowModal(false);
      loadWeapons();
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this weapon?')) return;
    try {
      await weaponAPI.delete(id);
      toast.success('Weapon deleted');
      loadWeapons();
    } catch { toast.error('Delete failed'); }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="page-header"><GiAk47 className="w-7 h-7 text-green-400" /> Weapon Inventory</h1>
        {isAdmin() && (
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <HiPlus className="w-5 h-5" /> Add Weapon
          </button>
        )}
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-military-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="input-field pl-10" placeholder="Search by name or serial..." />
        </div>
        <button onClick={handleSearch} className="btn-secondary">Search</button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="table-container overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Serial No.</th><th>Type</th><th>Caliber</th><th>Qty</th><th>Status</th>{isAdmin() && <th>Actions</th>}</tr>
            </thead>
            <tbody>
              {weapons.map((w, i) => (
                <tr key={w.id}>
                  <td className="font-mono text-military-500">{i + 1}</td>
                  <td className="font-semibold text-white">{w.name}</td>
                  <td className="font-mono text-sm">{w.serialNumber}</td>
                  <td>{w.weaponType}</td>
                  <td>{w.caliber || '-'}</td>
                  <td className="font-semibold">{w.quantity}</td>
                  <td><span className={statusBadge(w.status)}>{w.status}</span></td>
                  {isAdmin() && (
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(w)} className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"><HiPencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(w.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"><HiTrash className="w-4 h-4" /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {weapons.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-military-500">No weapons found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{editing ? 'Edit Weapon' : 'Add New Weapon'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-military-700 text-military-400"><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Name *</label><input value={form.name} onChange={set('name')} className="input-field" required /></div>
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Serial No. *</label><input value={form.serialNumber} onChange={set('serialNumber')} className="input-field" required /></div>
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Type *</label><input value={form.weaponType} onChange={set('weaponType')} className="input-field" required /></div>
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Caliber</label><input value={form.caliber} onChange={set('caliber')} className="input-field" /></div>
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Manufacturer</label><input value={form.manufacturer} onChange={set('manufacturer')} className="input-field" /></div>
                <div><label className="text-xs font-medium text-military-300 mb-1 block">Quantity *</label><input type="number" value={form.quantity} onChange={set('quantity')} className="input-field" required min="0" /></div>
              </div>
              <div><label className="text-xs font-medium text-military-300 mb-1 block">Status</label>
                <select value={form.status} onChange={set('status')} className="select-field">
                  <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="DECOMMISSIONED">Decommissioned</option>
                </select>
              </div>
              <div><label className="text-xs font-medium text-military-300 mb-1 block">Description</label><textarea value={form.description} onChange={set('description')} className="input-field" rows="2" /></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Add'} Weapon</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
