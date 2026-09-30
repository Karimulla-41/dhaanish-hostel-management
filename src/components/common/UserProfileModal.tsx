import React, { useState, useEffect } from 'react';
import { X, Camera, Save, CheckCircle2, User, Phone, Mail, Building2, ShieldCheck, Upload } from 'lucide-react';
import type { UserProfile } from '../../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<UserProfile>(currentProfile);
  const [photoPreview, setPhotoPreview] = useState<string>(currentProfile.photoUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData(currentProfile);
    setPhotoPreview(currentProfile.photoUrl);
    setSavedSuccess(false);
  }, [currentProfile, isOpen]);

  if (!isOpen) return null;

  // Handle Image File Upload -> convert to Base64
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoPreview(base64String);
        setFormData(prev => ({ ...prev, photoUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 text-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-navy-700 space-y-5 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-navy-700 text-amber-300 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 text-sm">Edit Resident & Staff Profile</h3>
              <p className="text-[11px] text-neutral-500">Persisted Dhaanish Identity Badge ({formData.role})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="py-8 text-center space-y-3 bg-emerald-50 rounded-xl border border-emerald-300 p-6 animate-scale-up">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-base font-bold text-emerald-900">Profile Updated & Saved!</h4>
              <p className="text-xs text-emerald-700 mt-1 font-semibold">
                Your new photo and details have been permanently stored in system storage.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Photo Upload Section */}
            <div className="flex flex-col items-center space-y-3 bg-navy-50/70 p-4 rounded-xl border border-navy-100">
              <div className="relative group">
                <img
                  src={photoPreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-navy-700 shadow-md"
                />
                <label
                  htmlFor="profile-photo-input"
                  className="absolute bottom-0 right-0 bg-amber-400 hover:bg-amber-300 text-navy-950 p-2 rounded-full cursor-pointer shadow-lg border-2 border-white transition transform hover:scale-110"
                  title="Upload New Profile Photo"
                >
                  <Camera className="w-4 h-4" />
                </label>
                <input
                  id="profile-photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              
              <div className="text-center">
                <label 
                  htmlFor="profile-photo-input"
                  className="text-xs font-bold text-navy-700 hover:underline cursor-pointer flex items-center justify-center space-x-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Custom Photo</span>
                </label>
                <p className="text-[10px] text-neutral-500 mt-0.5">JPEG/PNG max 5MB • Instant Local Storage</p>
              </div>
            </div>

            {/* Editable Information Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-navy-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Mobile Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-navy-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Official Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-navy-700"
                    />
                  </div>
                </div>
              </div>

              {formData.role === 'Student' ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Hostel Block</label>
                    <input
                      type="text"
                      value={formData.block || 'Block A'}
                      onChange={(e) => setFormData(prev => ({ ...prev, block: e.target.value as any }))}
                      className="w-full p-2 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-navy-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Room Number</label>
                    <input
                      type="text"
                      value={formData.room || 'A-101'}
                      onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                      className="w-full p-2 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-navy-700 font-semibold text-navy-900"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Official Designation</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={formData.designation || (formData.role === 'Warden' ? 'Chief Warden' : 'Class Coordinator (CC)')}
                      onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-navy-700"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 text-[10px] text-neutral-600 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Changes made here are permanently stored in browser memory and update your digital identity across all modules.</span>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-navy-700 hover:bg-navy-800 text-white font-bold rounded-lg shadow-md flex items-center space-x-1.5 transition"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>Save Profile Changes</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
