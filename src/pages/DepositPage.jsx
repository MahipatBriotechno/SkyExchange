import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { walletController } from '../controllers';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

function DepositPage() {
  const navigate = useNavigate();
  const { loginToken, isLoggedIn } = useAuthStore();
  const [step, setStep] = useState(1); // 1: Amount, 2: Payment Details
  const [amount, setAmount] = useState('');
  const [utr, setUtr] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('IMPS');
  const [history, setHistory] = useState([]);
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isLoggedIn, loginToken]);

  const fetchData = async () => {
    if (!loginToken) return;
    try {
      setLoading(true);
      const [historyRes, methodsRes] = await Promise.all([
        walletController.getDepositHistory(loginToken),
        walletController.getDepositMethods(loginToken)
      ]);
      
      if (Array.isArray(historyRes)) {
        setHistory(historyRes);
      }
      if (methodsRes && methodsRes.methods) {
        setMethods(methodsRes.methods);
      }
    } catch (err) {
      console.error('Failed to fetch deposit data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!utr) {
      alert('Please enter UTR number');
      return;
    }
    try {
      setSubmitLoading(true);
      const res = await walletController.requestDeposit({
        LoginToken: loginToken,
        Amount: amount,
        Utr: utr,
        Method: selectedMethod
      });
      if (res.error === '0') {
        alert('Deposit request submitted successfully');
        setStep(1);
        setAmount('');
        setUtr('');
        fetchData();
      } else {
        alert(res.msg || 'Failed to submit deposit request');
      }
    } catch (err) {
      console.error('Deposit request error:', err);
      alert('Something went wrong');
    } finally {
      setSubmitLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'WHATSAPP', name: 'WHATSAPP DEPOSIT', icon: 'https://cdn-icons-png.flaticon.com/512/124/124034.png' },
    { id: 'IMPS', name: 'IMPS', icon: 'https://cdn-icons-png.flaticon.com/512/10009/10009224.png' },
    { id: 'UPI', name: 'UPI', icon: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/upi-icon.png' },
    { id: 'USDT', name: 'USDT', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png' }
  ];

  return (
    <Layout>
      <div className="deposit-page" style={{ background: '#eee', minHeight: '100vh', padding: '15px' }}>
        <div style={{ width: '100%', margin: '0' }}>
          
          {/* Back Button */}
          <button 
            onClick={() => step === 2 ? setStep(1) : navigate(-1)}
            style={{ 
              background: '#1a2b3c', 
              color: '#fff', 
              border: 'none', 
              padding: '8px 20px', 
              borderRadius: '4px', 
              cursor: 'pointer',
              marginBottom: '15px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            BACK
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 600px', gap: '20px' }} className="deposit-grid">
            
            {/* Left Content */}
            <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              
              {step === 1 ? (
                <div style={{ padding: '30px' }}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#333' }}>Amount</h3>
                  <form onSubmit={handleAmountSubmit} style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Enter amount" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      style={{ 
                        flex: 1, 
                        padding: '12px 15px', 
                        border: '1px solid #ccc', 
                        borderRadius: '4px',
                        fontSize: '15px'
                      }}
                    />
                    <button 
                      type="submit"
                      style={{ 
                        background: '#1a91d1', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '0 30px', 
                        borderRadius: '4px', 
                        fontWeight: 'bold', 
                        cursor: 'pointer' 
                      }}
                    >
                      SUBMIT
                    </button>
                  </form>
                </div>
              ) : (
                <div style={{ padding: '20px' }}>
                  {/* Payment Methods Slider */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {paymentMethods.map(m => (
                      <div 
                        key={m.id}
                        onClick={() => setSelectedMethod(m.id)}
                        style={{ 
                          minWidth: '100px',
                          padding: '10px',
                          border: selectedMethod === m.id ? '2px solid #1a91d1' : '1px solid #ddd',
                          borderRadius: '8px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: '#fff'
                        }}
                      >
                        <img src={m.icon} alt={m.name} style={{ width: '30px', height: '30px', marginBottom: '5px' }} />
                        <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{m.name}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    {/* Bank Details */}
                    <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <h4 style={{ margin: '0 0 15px 0', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>{selectedMethod} Details</h4>
                      <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#666' }}>Bank Name:</span>
                          <span style={{ fontWeight: 'bold' }}>STATE BANK OF INDIA</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#666' }}>A/C No:</span>
                          <span style={{ fontWeight: 'bold' }}>123456789012</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#666' }}>IFSC Code:</span>
                          <span style={{ fontWeight: 'bold' }}>SBIN0001234</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#666' }}>Account Name:</span>
                          <span style={{ fontWeight: 'bold' }}>SKY EXCHANGE PVT LTD</span>
                        </div>
                        <div style={{ marginTop: '10px', padding: '10px', background: '#e1f5fe', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold', color: '#01579b' }}>
                          MIN: 500 | MAX: 500,000
                        </div>
                      </div>
                      <button style={{ width: '100%', marginTop: '20px', background: '#1a2b3c', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold' }}>
                        HOW TO TRANSFER UPI TO BANK
                      </button>
                    </div>

                    {/* Submit Form */}
                    <div>
                      <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>Unique Transaction Reference *</label>
                          <input 
                            type="text" 
                            placeholder="6 to 12 Digit UTR Number" 
                            value={utr}
                            onChange={(e) => setUtr(e.target.value)}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>Upload Payment Proof</label>
                          <input type="file" style={{ width: '100%', padding: '5px' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>Amount *</label>
                          <input 
                            type="text" 
                            value={amount} 
                            disabled 
                            style={{ width: '100%', padding: '10px', border: '1px solid #eee', borderRadius: '4px', background: '#f5f5f5' }} 
                          />
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          <input type="checkbox" required /> I have read and agree with the terms of payment and withdrawal policy.
                        </div>
                        <button 
                          type="submit"
                          disabled={submitLoading}
                          style={{ 
                            background: '#4caf50', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '15px', 
                            borderRadius: '4px', 
                            fontWeight: 'bold', 
                            cursor: 'pointer',
                            fontSize: '16px'
                          }}
                        >
                          {submitLoading ? 'SUBMITTING...' : 'SUBMIT'}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side: Transaction Table */}
            <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', height: 'fit-content' }}>
              <div style={{ background: '#1a91d1', color: '#fff', padding: '10px', fontWeight: 'bold', fontSize: '13px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', textAlign: 'center' }}>
                <span>TXN NO</span>
                <span>AMOUNT</span>
                <span>STATUS</span>
                <span>DATE</span>
                <span>REASON</span>
              </div>
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {history.length > 0 ? (
                  history.map((item, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '10px', borderBottom: '1px solid #eee', fontSize: '11px', textAlign: 'center', alignItems: 'center' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.TransactionNo || '---'}</span>
                      <span style={{ fontWeight: 'bold' }}>{item.Amount}</span>
                      <span style={{ 
                        color: item.Status === 'APPROVED' ? 'green' : item.Status === 'REJECTED' ? 'red' : 'orange',
                        fontWeight: 'bold',
                        fontSize: '9px',
                        border: '1px solid',
                        borderRadius: '3px',
                        padding: '2px 4px'
                      }}>{item.Status}</span>
                      <span>{item.Date}</span>
                      <span style={{ color: '#999' }}>{item.Reason || '-'}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No recent transactions</div>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Instructions */}
          <div style={{ marginTop: '20px', background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '13px', color: '#b71c1c', lineHeight: '2' }}>
              <li>1. Deposit money only in the below available accounts to get the fastest credits and avoid possible delays.</li>
              <li>2. Deposits made 45 minutes after the account removal from the site are valid & will be added to their wallets.</li>
              <li>3. Site is not responsible for money deposited to Old, Inactive or Closed accounts.</li>
              <li>4. After deposit, add your UTR and amount to receive balance.</li>
              <li>5. NEFT receiving time varies from 40 minutes to 2 hours.</li>
              <li>6. In case of account modification: payment valid for 1 hour after changing account details in deposit page.</li>
            </ul>
          </div>

        </div>
      </div>

      <style jsx="true">{`
        @media (max-width: 980px) {
          .deposit-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </Layout>
  );
}

export default DepositPage;
