import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  Cpu, 
  LayoutGrid, 
  List,
  MapPin,
  Clock
} from 'lucide-react';
import { useEquipment } from '../../context/EquipmentContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/StatusBadge';
import { EquipmentFormModal } from './EquipmentFormModal';
import { EquipmentDetailModal } from './EquipmentDetailModal';

export const EquipmentList = () => {
  const { equipment, addEquipment, updateEquipment, deleteEquipment } = useEquipment();
  const { currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);

  // Filtering
  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.equipmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesDepartment = selectedDepartment === 'All' || item.department === selectedDepartment;

    return matchesSearch && matchesCategory && matchesStatus && matchesDepartment;
  });

  const handleSaveEquipment = (formData) => {
    if (editingItem) {
      updateEquipment(editingItem.id, formData);
    } else {
      addEquipment(formData);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-indigo-400" /> College Equipment Register
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, view service records, and register campus assets. (FR-02, FR-03)
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            onClick={() => {
              setEditingItem(null);
              setIsFormOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Equipment Asset
          </button>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search equipment, tag code, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center gap-1 text-xs text-slate-400 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Computers">Computers</option>
            <option value="Projectors">Projectors</option>
            <option value="Printers">Printers</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Electrical">Electrical</option>
            <option value="AC">AC</option>
            <option value="Network">Network</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Operational">Operational</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Reported">Reported</option>
            <option value="Out of Service">Out of Service</option>
          </select>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics">Electronics</option>
            <option value="Administration">Administration</option>
            <option value="Library">Library</option>
          </select>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 ml-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Equipment View */}
      {viewMode === 'table' ? (
        <div className="glass-panel rounded-2xl border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Equipment Tag & Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Department & Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Last Service</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredEquipment.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      No matching equipment items found.
                    </td>
                  </tr>
                ) : (
                  filteredEquipment.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-100">{item.name}</div>
                        <div className="text-[11px] text-indigo-400 font-mono mt-0.5">{item.equipmentCode}</div>
                      </td>
                      <td className="p-4 font-medium text-slate-300">{item.category}</td>
                      <td className="p-4">
                        <div className="text-slate-200 font-medium">{item.department}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" /> {item.location}
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="p-4 text-slate-400 text-[11px]">
                        {item.lastMaintenanceDate || 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setDetailItem(item)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition-colors"
                            title="View Specs & Service History"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {currentUser.role === 'admin' && (
                            <>
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-colors"
                                title="Edit Equipment"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteEquipment(item.id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 transition-colors"
                                title="Delete Equipment"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEquipment.map(item => (
            <div key={item.id} className="glass-panel glass-panel-hover p-5 rounded-2xl border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                    {item.equipmentCode}
                  </span>
                  <h3 className="font-bold text-slate-100 text-sm mt-2">{item.name}</h3>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800/80">
                <div>Category: <span className="text-slate-200 font-medium">{item.category}</span></div>
                <div>Location: <span className="text-slate-200 font-medium">{item.location}</span></div>
                <div>Department: <span className="text-slate-200 font-medium">{item.department}</span></div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => setDetailItem(item)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/30 transition-all"
                >
                  View Details & History
                </button>
                {currentUser.role === 'admin' && (
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(item)} className="p-1.5 text-amber-400 hover:text-amber-300">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteEquipment(item.id)} className="p-1.5 text-rose-400 hover:text-rose-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <EquipmentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveEquipment}
        initialData={editingItem}
      />

      <EquipmentDetailModal
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        equipmentItem={detailItem}
      />
    </div>
  );
};
