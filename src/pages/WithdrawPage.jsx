import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { walletController, authController } from '../controllers';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

function WithdrawPage() {
  const navigate = useNavigate();
  const { loginToken, isLoggedIn } = useAuthStore();
  const [history, setHistory] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal State
  const [accType, setAccType] = useState('Bank Account');
  const [accName, setAccName] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isLoggedIn, loginToken]);

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const fetchData = async () => {
    if (!loginToken) return;
    try {
      setLoading(true);
      const [historyRes, accountsRes] = await Promise.all([
        walletController.getWithdrawalHistory(loginToken),
        walletController.getBankAccounts(loginToken)
      ]);
      
      if (Array.isArray(historyRes)) setHistory(historyRes);
      if (Array.isArray(accountsRes)) setAccounts(accountsRes);
    } catch (err) {
      console.error('Failed to fetch withdrawal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!mobile) return alert('Enter mobile number');
    try {
      const res = await authController.sendOtp(mobile);
      if (res.error === '0') {
        setOtpSent(true);
        setTimer(60);
        alert('OTP Sent');
      } else {
        alert(res.msg || 'Failed to send OTP');
      }
    } catch (err) {
      alert('Error sending OTP');
    }
  };

  const handleSaveAccount = async () => {
    if (!accName || !accNumber || !ifsc || !mobile || !otp) return alert('Fill all fields');
    try {
      setSaveLoading(true);
      const res = await walletController.saveBankAccount({
        LoginToken: loginToken,
        AccountType: accType,
        Name: accName,
        AccountNo: accNumber,
        Ifsc: ifsc,
        Mobile: mobile,
        Otp: otp
      });
      if (res.error === '0') {
        alert('Account added successfully');
        setIsModalOpen(false);
        resetModal();
        fetchData();
      } else {
        alert(res.msg || 'Failed to save account');
      }
    } catch (err) {
      alert('Error saving account');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleWithdraw = async (accId) => {
    if (!withdrawAmount || isNaN(withdrawAmount)) return alert('Enter valid amount');
    try {
      const res = await walletController.requestWithdrawal(loginToken, accId, withdrawAmount);
      if (res.error === '0') {
        alert('Withdrawal request submitted');
        setWithdrawAmount('');
        fetchData();
      } else {
        alert(res.msg || 'Failed to withdraw');
      }
    } catch (err) {
      alert('Error submitting withdrawal');
    }
  };

  const handleDeleteAccount = async (accId) => {
    if (!window.confirm('Delete this account?')) return;
    try {
      const res = await walletController.deleteBankAccount(loginToken, accId);
      if (res.error === '0') {
        fetchData();
      }
    } catch (err) {
      alert('Error deleting account');
    }
  };

  const resetModal = () => {
    setAccName(''); setAccNumber(''); setIfsc(''); setMobile(''); setOtp(''); setOtpSent(false); setTimer(60);
  };

  return (
    <Layout>
      <div className="withdraw-page" style={{ background: '#eee', minHeight: '100vh', padding: '15px' }}>
        <div style={{ width: '100%', margin: '0' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
            <button onClick={() => navigate(-1)} style={{ background: '#1a2b3c', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', fontWeight: 'bold' }}>BACK</button>
            <button onClick={() => setIsModalOpen(true)} style={{ background: '#1e8000', color: '#fff', border: 'none', padding: '8px 25px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>ADD ACCOUNT</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 600px', gap: '20px' }}>
            
            {/* Left Content */}
            <div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12px', color: '#b71c1c', lineHeight: '1.8' }}>
                  <li>1. This form is for withdrawing the amount from the main wallet only.</li>
                  <li>2. The bonus wallet amount cannot be withdrawn by this form.</li>
                  <li>3. Do not put Withdraw request without betting with deposit amount. Such activity may be identified as Suspicious.</li>
                  <li>4. If multiple user are using same withdraw account then all the linked users will be blocked.</li>
                  <li>5. Maximum Withdraw time is 45 minutes then only complain on WhatsApp number.</li>
                </ul>
              </div>

              {/* Account Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '15px' }}>
                {accounts.map(acc => (
                  <div key={acc.Id} style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'relative' }}>
                    <div style={{ padding: '15px', textAlign: 'center' }}>
                       <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: 'bold' }}>{acc.Name}</h4>
                       <button onClick={() => handleDeleteAccount(acc.Id)} style={{ position: 'absolute', top: '10px', right: '10px', background: '#b80000', border: 'none', color: '#fff', padding: '5px', borderRadius: '4px' }}>
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                       </button>
                       
                       <div style={{ background: '#f5f7f9', padding: '10px', borderRadius: '4px', textAlign: 'left', fontSize: '12px', color: '#666', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Account No :</span> <span style={{ fontWeight: 'bold' }}>{acc.AccountNo}</span></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>IFSC/IBAN Code :</span> <span style={{ fontWeight: 'bold' }}>{acc.Ifsc}</span></div>
                       </div>
                       
                       <input 
                         type="text" 
                         placeholder="Enter amount" 
                         value={withdrawAmount}
                         onChange={(e) => setWithdrawAmount(e.target.value)}
                         style={{ width: '100%', marginTop: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                       />
                       
                       <button 
                         onClick={() => handleWithdraw(acc.Id)}
                         style={{ width: '100%', marginTop: '15px', background: '#b80000', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' }}
                       >
                         WITHDRAW
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: History Table */}
            <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <div style={{ background: '#1a91d1', color: '#fff', padding: '10px', fontWeight: 'bold', fontSize: '12px', display: 'grid', gridTemplateColumns: '80px 80px 100px 1fr 100px', textAlign: 'center' }}>
                <span>AMOUNT</span>
                <span>STATUS</span>
                <span>ACCOUNT</span>
                <span>DATE</span>
                <span>REASON</span>
              </div>
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {history.map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '80px 80px 100px 1fr 100px', padding: '10px', borderBottom: '1px solid #eee', fontSize: '11px', textAlign: 'center', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>{item.Amount}</span>
                    <span style={{ 
                      color: item.Status === 'APPROVED' ? 'green' : item.Status === 'REJECTED' ? 'red' : '#d4af37',
                      background: item.Status === 'PENDING' ? '#fff9c4' : 'transparent',
                      padding: '2px 4px', borderRadius: '3px', fontSize: '10px', border: '1px solid currentColor'
                    }}>{item.Status}</span>
                    <span style={{ fontSize: '9px' }}>{item.AccountNo || '---'}</span>
                    <span>{item.Date}</span>
                    <span style={{ color: '#999' }}>{item.Reason || '-'}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Add Account Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#fff', width: '500px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <div style={{ background: '#1a2b3c', color: '#fff', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>Add account</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>ACCOUNT TYPE</label>
                <select value={accType} onChange={(e) => setAccType(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option>Bank Account</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>NAME</label>
                <input type="text" placeholder="Enter Name" value={accName} onChange={(e) => setAccName(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>A/C NUMBER</label>
                <input type="text" placeholder="Enter A/C Number" value={accNumber} onChange={(e) => setAccNumber(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>IFSC/IBAN CODE</label>
                <input type="text" placeholder="Enter IFSC/IBAN CODE" value={ifsc} onChange={(e) => setIfsc(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>MOBILE NO</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="Enter Mobile No" value={mobile} onChange={(e) => setMobile(e.target.value)} style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                  <button onClick={handleSendOtp} style={{ background: '#007bff', color: '#fff', border: 'none', padding: '0 15px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>Get OTP</button>
                </div>
              </div>

              {otpSent && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>OTP</label>
                  <input type="text" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                  <div style={{ marginTop: '5px', fontSize: '12px', color: 'red' }}>Resend OTP in : 00:{timer < 10 ? `0${timer}` : timer}</div>
                </div>
              )}
            </div>

            <div style={{ padding: '15px 20px', background: '#f5f7f9', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '8px 25px', borderRadius: '4px', fontWeight: 'bold' }}>Close</button>
              <button onClick={handleSaveAccount} disabled={saveLoading} style={{ background: '#fff', color: '#333', border: '1px solid #ddd', padding: '8px 25px', borderRadius: '4px', fontWeight: 'bold' }}>{saveLoading ? '...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default WithdrawPage;
