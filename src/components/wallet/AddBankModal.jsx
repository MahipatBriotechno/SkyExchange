import React, { useState } from 'react';
import { walletController } from '../../controllers';
import { useSnackbarStore } from '../../store/snackbarStore';
import { useAuthStore } from '../../store/authStore';

export default function AddBankModal({ isOpen, onClose, onSuccess }) {
  const { show: showSnackbar } = useSnackbarStore();
  const { loginToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ACname: '',
    Bank: '',
    ACholdername: '',
    ACno: '',
    Isfc: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.ACname || !formData.Bank || !formData.ACholdername || !formData.ACno || !formData.Isfc) {
      showSnackbar('Please fill all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      if (!loginToken) return;

      const response = await walletController.saveBankAccount({
        LoginToken: loginToken,
        ...formData
      });

      if (response.error === '0') {
        showSnackbar('Bank account saved successfully', 'success');
        onSuccess();
        onClose();
      } else {
        showSnackbar(response.msg || 'Failed to save bank account', 'error');
      }
    } catch (error) {
      showSnackbar('An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white border border-[#ccc] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-[#eee] bg-[#f9f9f9]">
          <h2 className="text-[13px] font-black text-[#111] uppercase tracking-[0.1em] flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-[#ffb400] flex items-center justify-center text-black shadow-sm">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M11 10v11M15 10v11M20 10v11"/></svg>
             </div>
             Add Bank Account
          </h2>
          <button onClick={onClose} className="text-[#888] hover:text-[#111] transition-colors p-2 hover:bg-black/5 rounded-full">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#888] uppercase tracking-widest ml-1">Account Label (e.g. Savings)</label>
            <input 
              type="text" 
              className="w-full h-12 bg-[#f4f4f4] border border-[#ddd] rounded-xl px-4 text-[#111] text-sm font-bold focus:outline-none focus:border-[#ffb400] transition-all"
              placeholder="Primary Account"
              value={formData.ACname}
              onChange={e => setFormData({...formData, ACname: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#888] uppercase tracking-widest ml-1">Bank Name</label>
            <input 
              type="text" 
              className="w-full h-12 bg-[#f4f4f4] border border-[#ddd] rounded-xl px-4 text-[#111] text-sm font-bold focus:outline-none focus:border-[#ffb400] transition-all"
              placeholder="e.g. State Bank of India"
              value={formData.Bank}
              onChange={e => setFormData({...formData, Bank: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#888] uppercase tracking-widest ml-1">Account Holder Name</label>
            <input 
              type="text" 
              className="w-full h-12 bg-[#f4f4f4] border border-[#ddd] rounded-xl px-4 text-[#111] text-sm font-bold focus:outline-none focus:border-[#ffb400] transition-all"
              placeholder="Exact name in bank"
              value={formData.ACholdername}
              onChange={e => setFormData({...formData, ACholdername: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#888] uppercase tracking-widest ml-1">Account Number</label>
            <input 
              type="text" 
              className="w-full h-12 bg-[#f4f4f4] border border-[#ddd] rounded-xl px-4 text-[#111] text-sm font-bold focus:outline-none focus:border-[#ffb400] transition-all"
              placeholder="Enter A/C Number"
              value={formData.ACno}
              onChange={e => setFormData({...formData, ACno: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#888] uppercase tracking-widest ml-1">IFSC Code</label>
            <input 
              type="text" 
              className="w-full h-12 bg-[#f4f4f4] border border-[#ddd] rounded-xl px-4 text-[#111] text-sm font-bold focus:outline-none focus:border-[#ffb400] transition-all"
              placeholder="e.g. SBIN0001234"
              value={formData.Isfc}
              onChange={e => setFormData({...formData, Isfc: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest transition-all ${loading ? 'bg-[#eee] text-[#aaa]' : 'bg-[#ffb400] hover:bg-[#ffc800] text-black shadow-lg shadow-[#ffb400]/20 active:scale-[0.98]'}`}
            >
              {loading ? 'Saving...' : 'Save Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
