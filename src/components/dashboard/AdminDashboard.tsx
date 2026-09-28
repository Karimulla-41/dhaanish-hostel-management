import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  HardHat, 
  CheckCircle2, 
  Building,
  UserPlus,
  UserMinus,
  Edit3,
  ArrowUpCircle,
  LogOut,
  X
} from 'lucide-react';
import type { HostelBlock, BlockStatus } from '../../types';

interface WardenRecord {
  block: HostelBlock;
  warden: string;
  designation: string;
  phone: string;
  email: string;
}

interface EditableBlock {
  name: HostelBlock;
  status: BlockStatus;
  capacity: number;
  occupied: number;
  floors: number;
  description: string;
}

export const AdminDashboard: React.FC = () => {
  const { students, logout } = useAuth();

  // Warden Management State
  const [wardenList, setWardenList] = useState<WardenRecord[]>([
    { block: 'Block A', warden: 'Dr. Senthil Kumar', designation: 'Chief Warden (Senior Boys)', phone: '+91 94433 11223', email: 'senthil.warden@dhaanish.in' },
    { block: 'Block B', warden: 'Prof. Ramesh V', designation: 'Warden (Junior Boys Wing)', phone: '+91 94433 44556', email: 'ramesh.warden@dhaanish.in' },
    { block: 'Block C', warden: 'Dr. Priyadarshini M', designation: 'Senior Warden (Girls Block 1)', phone: '+91 98400 77889', email: 'priya.warden@dhaanish.in' },
    { block: 'Block D', warden: 'Prof. Malathi K', designation: 'Warden (Girls Block 2)', phone: '+91 98400 22334', email: 'malathi.warden@dhaanish.in' },
    { block: 'Block E', warden: 'Dr. Abdul Rahman', designation: 'International Wing Director', phone: '+91 91234 88990', email: 'abdul.warden@dhaanish.in' },
    { block: 'Block F', warden: 'Campus Estate Manager', designation: 'Under Construction Overseer', phone: '+91 90000 00000', email: 'estate@dhaanish.in' },
  ]);

  // Block Capacity & Status State
  const [blockList, setBlockList] = useState<EditableBlock[]>([
    { name: 'Block A', status: 'Active', capacity: 120, occupied: 112, floors: 4, description: 'Senior Boys Residence - Engineering Departments' },
    { name: 'Block B', status: 'Active', capacity: 140, occupied: 128, floors: 4, description: 'Junior Boys Residence - First & Second Year' },
    { name: 'Block C', status: 'Active', capacity: 100, occupied: 94, floors: 3, description: 'Girls Residence Block 1 - All Departments' },
    { name: 'Block D', status: 'Active', capacity: 120, occupied: 105, floors: 4, description: 'Girls Residence Block 2 - Post Graduates & Final Year' },
    { name: 'Block E', status: 'Active', capacity: 80, occupied: 68, floors: 3, description: 'International & Research Scholar Wing' },
    { name: 'Block F', status: 'Under Construction', capacity: 160, occupied: 0, floors: 5, description: 'New Executive Hostel Complex (Target Completion: Q2 2027)' },
  ]);

  // Modals state
  const [showWardenModal, setShowWardenModal] = useState(false);
  const [editingWardenBlock, setEditingWardenBlock] = useState<HostelBlock>('Block A');
  const [wardenNameInput, setWardenNameInput] = useState('');
  const [wardenDesignationInput, setWardenDesignationInput] = useState('');
  const [wardenPhoneInput, setWardenPhoneInput] = useState('');
  const [wardenEmailInput, setWardenEmailInput] = useState('');

  const [showCapacityModal, setShowCapacityModal] = useState(false);
  const [editingBlockName, setEditingBlockName] = useState<HostelBlock>('Block A');
  const [capacityInput, setCapacityInput] = useState<number>(120);

  // Compute live metrics
  const totalCapacity = blockList.reduce((acc, b) => acc + b.capacity, 0);
  const totalOccupied = students.length;
  const availableBeds = Math.max(0, totalCapacity - totalOccupied);
  const activeBlocks = blockList.filter(b => b.status === 'Active');
  const constructionBlocks = blockList.filter(b => b.status === 'Under Construction');

  // Warden Handlers
  const handleOpenAssignModal = (w: WardenRecord) => {
    setEditingWardenBlock(w.block);
    setWardenNameInput(w.warden === 'Unassigned / Vacant' ? '' : w.warden);
    setWardenDesignationInput(w.designation);
    setWardenPhoneInput(w.phone);
    setWardenEmailInput(w.email);
    setShowWardenModal(true);
  };

  const handleSaveWarden = (e: React.FormEvent) => {
    e.preventDefault();
    setWardenList(prev => prev.map(w => {
      if (w.block === editingWardenBlock) {
        return {
          ...w,
          warden: wardenNameInput || 'Unassigned / Vacant',
          designation: wardenDesignationInput || 'Hostel Warden',
          phone: wardenPhoneInput || '+91 90000 00000',
          email: wardenEmailInput || 'warden@dhaanish.in',
        };
      }
      return w;
    }));
    setShowWardenModal(false);
    alert(`Warden assignment updated for ${editingWardenBlock}!`);
  };

  const handleRemoveWarden = (block: HostelBlock) => {
    if (confirm(`Are you sure you want to remove the assigned Warden from ${block}?`)) {
      setWardenList(prev => prev.map(w => w.block === block ? {
        ...w,
        warden: 'Unassigned / Vacant',
        designation: 'Vacant Post',
        phone: 'N/A',
        email: 'unassigned@dhaanish.in'
      } : w));
    }
  };

  // Block Handlers
  const handleUpgradeBlockStatus = (blockName: HostelBlock) => {
    setBlockList(prev => prev.map(b => {
      if (b.name === blockName) {
        const newStatus: BlockStatus = b.status === 'Under Construction' ? 'Active' : 'Under Construction';
        alert(`Status for ${blockName} updated to "${newStatus}"!`);
        return {
          ...b,
          status: newStatus,
          description: newStatus === 'Active' ? 'Active Residential Block - Operations Live' : 'Under Construction (Expansion Wing)'
        };
      }
      return b;
    }));
  };

  const handleOpenCapacityModal = (b: EditableBlock) => {
    setEditingBlockName(b.name);
    setCapacityInput(b.capacity);
    setShowCapacityModal(true);
  };

  const handleSaveCapacity = (e: React.FormEvent) => {
    e.preventDefault();
    if (capacityInput <= 0) return;
    setBlockList(prev => prev.map(b => b.name === editingBlockName ? { ...b, capacity: Number(capacityInput) } : b));
    setShowCapacityModal(false);
    alert(`Bed capacity for ${editingBlockName} updated to ${capacityInput} beds!`);
  };

  return (
    <div className="min-h-screen bg-transparent text-navy-950 p-4 sm:p-8 flex flex-col justify-between selection:bg-navy-700 selection:text-white font-sans">
      
      {/* Top Header Utility Bar */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center text-xs pb-4 border-b border-navy-900/20 bg-white/95 px-4 py-2.5 rounded-xl border shadow-lg">
        <div className="flex items-center space-x-2 font-bold text-navy-900">
          <ShieldCheck className="w-4.5 h-4.5 text-navy-700" />
          <span>CENTRAL CAMPUS EXECUTIVE ADMINISTRATION PORTAL</span>
        </div>

        <button
          onClick={logout}
          className="text-red-700 font-bold flex items-center space-x-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded border border-red-200 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full my-auto space-y-6 py-6 text-xs">
        
        {/* LANDING BANNER */}
        <div className="bg-white p-5 rounded-xl border border-neutral-300 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-xl p-2 shadow-md border-2 border-navy-700 flex items-center justify-center shrink-0">
              <img src="/dhaanish-logo.png" alt="Dhaanish Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-navy-900">
                <h1 className="text-xl font-bold tracking-tight uppercase">
                  DHAANISH CHENNAI AUTONOMOUS
                </h1>
                <span className="bg-navy-100 text-navy-900 text-xs px-2.5 py-0.5 rounded-full font-bold border border-navy-300">
                  NAAC A+ Accredited
                </span>
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                Executive Directorate — Warden Staff Allocation, Bed Capacity Counts, & Block Infrastructure Upgrades
              </p>
            </div>
          </div>

          <div className="bg-navy-50 border border-navy-200 p-3 rounded-lg text-right shrink-0">
            <span className="text-[10px] text-neutral-500 font-semibold uppercase block">Executive Control Mode</span>
            <span className="text-xs font-bold text-navy-900">System Admin Privilege Active</span>
          </div>
        </div>

        {/* METRIC KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-4 rounded-xl border border-neutral-300 shadow-md flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-neutral-500 uppercase">Total Institutional Capacity</p>
              <p className="text-2xl font-bold text-navy-900 mt-1">{totalCapacity} Beds</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">Across Blocks A to F</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-navy-700 text-amber-300 shadow flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-300 shadow-md flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-emerald-800 uppercase">Enrolled Residents</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">{totalOccupied} Students</p>
              <p className="text-[10px] text-emerald-700 mt-0.5">Verified active hostellers</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-300 shadow-md flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-blue-800 uppercase">Available Unallocated Beds</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{availableBeds} Vacant</p>
              <p className="text-[10px] text-blue-700 mt-0.5">Ready for admission</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-800 border border-blue-300 flex items-center justify-center shrink-0">
              <Building className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-300 shadow-md flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-amber-900 uppercase">Residential Wings Status</p>
              <p className="text-2xl font-bold text-navy-900 mt-1">{activeBlocks.length} Active / {constructionBlocks.length} Expansion</p>
              <p className="text-[10px] text-amber-800 mt-0.5">Block F under construction</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center shrink-0">
              <HardHat className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* SECTION 1: WARDEN MANAGEMENT (ASSIGNING & REMOVING WARDENS) */}
        <div className="bg-white rounded-xl border border-neutral-300 shadow-xl overflow-hidden">
          <div className="p-4 bg-navy-50 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-navy-900 text-sm flex items-center space-x-2">
                <ShieldCheck className="w-4.5 h-4.5 text-navy-700" />
                <span>1. HOSTEL WARDEN ASSIGNMENT & STAFF MANAGEMENT REGISTRY</span>
              </h2>
              <p className="text-neutral-500 text-[11px]">Assign new Wardens, reassign staff allocations, or remove Wardens from residential blocks.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-navy-700 text-white font-semibold text-[11px] uppercase tracking-wider">
                  <th className="p-3">Assigned Block</th>
                  <th className="p-3">Warden Official Name</th>
                  <th className="p-3">Designation / Role</th>
                  <th className="p-3">Official Phone</th>
                  <th className="p-3">Institutional Email</th>
                  <th className="p-3">Wing Status</th>
                  <th className="p-3 text-right">Warden Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {wardenList.map(w => (
                  <tr key={w.block} className="hover:bg-neutral-50 text-neutral-800 transition">
                    <td className="p-3 font-bold text-navy-900">{w.block}</td>
                    <td className="p-3 font-semibold text-navy-900">
                      {w.warden === 'Unassigned / Vacant' ? (
                        <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          ⚠️ Unassigned / Vacant
                        </span>
                      ) : (
                        <span>{w.warden}</span>
                      )}
                    </td>
                    <td className="p-3 text-neutral-600">{w.designation}</td>
                    <td className="p-3 font-mono">{w.phone}</td>
                    <td className="p-3 text-neutral-600">{w.email}</td>
                    <td className="p-3">
                      {w.block === 'Block F' ? (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                          Under Construction
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
                          Active Operation
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenAssignModal(w)}
                        className="bg-navy-700 hover:bg-navy-800 text-white font-bold px-2.5 py-1 rounded text-[11px] shadow inline-flex items-center space-x-1"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                        <span>Assign / Edit</span>
                      </button>
                      
                      {w.warden !== 'Unassigned / Vacant' && (
                        <button
                          onClick={() => handleRemoveWarden(w.block)}
                          className="bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 font-bold px-2.5 py-1 rounded text-[11px] inline-flex items-center space-x-1"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: BLOCK CAPACITY COUNTS & UPGRADES MANAGEMENT */}
        <div className="bg-white rounded-xl border border-neutral-300 shadow-xl overflow-hidden">
          <div className="p-4 bg-navy-50 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-navy-900 text-sm flex items-center space-x-2">
                <Building2 className="w-4.5 h-4.5 text-navy-700" />
                <span>2. RESIDENTIAL BLOCKS CAPACITY COUNTS & INFRASTRUCTURE UPGRADES</span>
              </h2>
              <p className="text-neutral-500 text-[11px]">Enter bed capacity counts, update room allocations, and upgrade block construction status.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-navy-700 text-white font-semibold text-[11px] uppercase tracking-wider">
                  <th className="p-3">Block Name</th>
                  <th className="p-3">Operational Status</th>
                  <th className="p-3">Bed Capacity</th>
                  <th className="p-3">Occupied Beds</th>
                  <th className="p-3">Available Beds</th>
                  <th className="p-3">Floors</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Block Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {blockList.map(b => {
                  const avail = Math.max(0, b.capacity - b.occupied);
                  return (
                    <tr key={b.name} className="hover:bg-neutral-50 text-neutral-800 transition">
                      <td className="p-3 font-bold text-navy-900 text-sm">{b.name}</td>
                      <td className="p-3">
                        {b.status === 'Active' ? (
                          <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded text-[10px] border border-emerald-300 flex items-center space-x-1 w-fit">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Active Operation</span>
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded text-[10px] border border-amber-300 flex items-center space-x-1 w-fit">
                            <HardHat className="w-3.5 h-3.5 text-amber-700" />
                            <span>Under Construction</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono font-bold text-navy-900 text-sm">
                        {b.capacity} Beds
                      </td>
                      <td className="p-3 font-mono text-emerald-700 font-bold">
                        {b.occupied}
                      </td>
                      <td className="p-3 font-mono text-blue-700 font-bold">
                        {avail}
                      </td>
                      <td className="p-3 font-mono">{b.floors} Floors</td>
                      <td className="p-3 text-neutral-600 max-w-xs">{b.description}</td>
                      <td className="p-3 text-right space-x-1.5 shrink-0">
                        <button
                          onClick={() => handleOpenCapacityModal(b)}
                          className="bg-navy-50 hover:bg-navy-100 text-navy-900 font-bold px-2.5 py-1 rounded text-[11px] border border-navy-300 inline-flex items-center space-x-1"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-navy-700" />
                          <span>Enter Bed Count</span>
                        </button>

                        <button
                          onClick={() => handleUpgradeBlockStatus(b.name)}
                          className={`font-bold px-2.5 py-1 rounded text-[11px] border shadow inline-flex items-center space-x-1 ${
                            b.status === 'Under Construction'
                              ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-800'
                              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                          }`}
                        >
                          <ArrowUpCircle className="w-3.5 h-3.5" />
                          <span>{b.status === 'Under Construction' ? 'Upgrade to Active' : 'Set Under Construction'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL 1: ASSIGN / EDIT WARDEN */}
      {showWardenModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 text-xs font-sans">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-neutral-300 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <h3 className="font-bold text-navy-900 text-sm">
                Assign Warden to {editingWardenBlock}
              </h3>
              <button onClick={() => setShowWardenModal(false)} className="text-neutral-400 hover:text-neutral-800 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWarden} className="space-y-3">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Warden Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Senthil Kumar"
                  value={wardenNameInput}
                  onChange={(e) => setWardenNameInput(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Official Designation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chief Warden (Senior Boys Wing)"
                  value={wardenDesignationInput}
                  onChange={(e) => setWardenDesignationInput(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94433 11223"
                  value={wardenPhoneInput}
                  onChange={(e) => setWardenPhoneInput(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  placeholder="warden@dhaanish.in"
                  value={wardenEmailInput}
                  onChange={(e) => setWardenEmailInput(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowWardenModal(false)}
                  className="px-3 py-2 bg-neutral-200 rounded font-semibold text-neutral-700 hover:bg-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-navy-700 text-white rounded font-bold hover:bg-navy-800 shadow"
                >
                  Save Warden Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT BED CAPACITY COUNT */}
      {showCapacityModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 text-xs font-sans">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border border-neutral-300 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <h3 className="font-bold text-navy-900 text-sm">
                Enter Bed Count for {editingBlockName}
              </h3>
              <button onClick={() => setShowCapacityModal(false)} className="text-neutral-400 hover:text-neutral-800 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCapacity} className="space-y-3">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Total Bed Capacity</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={500}
                  value={capacityInput}
                  onChange={(e) => setCapacityInput(Number(e.target.value))}
                  className="w-full p-2.5 border border-neutral-300 rounded text-sm font-mono font-bold text-navy-900 focus:ring-1 focus:ring-navy-600"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  Specify the total bed capacity count available in {editingBlockName}.
                </p>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCapacityModal(false)}
                  className="px-3 py-2 bg-neutral-200 rounded font-semibold text-neutral-700 hover:bg-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-navy-700 text-white rounded font-bold hover:bg-navy-800 shadow"
                >
                  Update Bed Count
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="w-full max-w-7xl mx-auto pt-6 text-center">
        <div className="bg-white/95 px-5 py-2 rounded-xl shadow-lg border border-neutral-300 text-black font-bold text-xs inline-block">
          © 2026 Dhaanish Chennai Autonomous College of Engineering • Executive Administration • Associated by KMX Technologies
        </div>
      </div>

    </div>
  );
};
