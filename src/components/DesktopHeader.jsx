import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authController, userController, marketController } from '../controllers';
import { useAuthStore } from '../store/authStore';

function DesktopHeader({ onVirtualCricketClick }) {
  const [validationCode, setValidationCode] = useState('');
  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const [validationInput, setValidationInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [balanceData, setBalanceData] = useState({ balance: '0', exposure: '0' });
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, username, loginToken, logout } = useAuthStore();
  const loginAction = useAuthStore((state) => state.login);

  const generateCode = () => {
    return String(Math.floor(1000 + Math.random() * 9000));
  };

  const refreshBalance = async () => {
    if (!isLoggedIn || !loginToken) return;
    try {
      const response = await userController.getBalance(loginToken);
      if (response.error === '0') {
        setBalanceData({
          balance: response.balance || '0',
          exposure: response.exposure || '0'
        });
      }
    } catch (error) {
      console.error('Balance refresh error:', error);
    }
  };

  const handleSearch = async (val) => {
    setSearchInput(val);
    if (val.length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    if (!isLoggedIn || !loginToken) return;

    try {
      setSearchLoading(true);
      const res = await marketController.search(loginToken, val);
      if (Array.isArray(res)) {
        setSearchResults(res);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    setValidationCode(generateCode());
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      refreshBalance();
      const timer = setInterval(refreshBalance, 30000);
      return () => clearInterval(timer);
    }
  }, [isLoggedIn, loginToken]);

  const validateLogin = async (e) => {
    e.preventDefault();
    if (!loginName.trim()) { alert('Username is empty'); return; }
    if (!password.trim()) { alert('Password is empty'); return; }
    if (validationInput.trim() !== validationCode) {
      alert('Invalid Validation Code!');
      setValidationCode(generateCode());
      setValidationInput('');
      return;
    }

    try {
      setLoading(true);
      const response = await authController.login({
        username: loginName,
        password: password,
        ip: '127.0.0.1'
      });

      if (response.error === '0') {
        loginAction(response.username || loginName, response.LoginToken);
        alert('Login Successful');
        setLoginName('');
        setPassword('');
        setValidationInput('');
        setValidationCode(generateCode());
      } else {
        alert(response.msg || 'Login failed.');
        setValidationCode(generateCode());
        setValidationInput('');
      }
    } catch (error) {
      console.error('Desktop Login Error:', error);
      alert('Network or unexpected error during login.');
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path) => {
    const current = location.pathname;
    if (path === '/' && (current === '/' || current === '/index')) return true;
    if (path !== '/' && current.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <div className="top">
        <div className="header full-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h1 style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
              <Link to="/">SKYEXCHANGE</Link>
            </h1>
            <div id="searchWrap" className="search-wrap" style={{ display: 'flex', alignItems: 'center', margin: 0, height: '100%', position: 'relative' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  id="searchInput"
                  className="search-input form-control form-control-sm"
                  type="text"
                  placeholder="Search Events"
                  value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchInput.length >= 3 && setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                />
                <button 
                  id="searchClear" 
                  className="search-clear" 
                  style={{ display: searchInput ? 'block' : 'none' }}
                  onClick={() => handleSearch('')}
                ></button>
              </div>
              {(showSearchResults || searchLoading) && (
                <div id="searchResult" className="suggestion-wrap" style={{ display: 'block', maxHeight: '400px', overflowY: 'auto', position: 'absolute', top: '100%', left: 0, width: '100%', zIndex: 1100 }}>
                  <ul id="searchList">
                    {searchLoading && <li style={{ padding: '10px', color: '#fff' }}>Searching...</li>}
                    {!searchLoading && searchResults.length === 0 && searchInput.length >= 3 && (
                      <li id="noMatching">
                        <p className="no-matching">No events found matching "{searchInput}"</p>
                      </li>
                    )}
                    {!searchLoading && searchResults.map((res, index) => (
                      <li key={res.Gid || index} style={{ borderBottom: '1px solid #333' }}>
                        <Link 
                          to={`/sports?type=${res.Type.toLowerCase()}&gid=${res.Gid}`}
                          style={{ display: 'block', padding: '8px 12px', textDecoration: 'none' }}
                          onClick={() => {
                            setSearchInput('');
                            setSearchResults([]);
                            setShowSearchResults(false);
                          }}
                        >
                          <p style={{ color: '#ff7a00', fontWeight: 'bold', margin: '0', fontSize: '13px' }}>{res.GameName}</p>
                          <p style={{ color: '#aaa', margin: '0', fontSize: '11px' }}>{res.Datetime} | {res.Type}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {!isLoggedIn ? (
            <ul className="login-wrap">
              <li className="user error">
                <input type="text" placeholder="Username" value={loginName} onChange={(e) => setLoginName(e.target.value)} />
              </li>
              <li>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </li>
              <li style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Validation" 
                  value={validationInput} 
                  onChange={(e) => setValidationInput(e.target.value)} 
                  style={{ paddingRight: '60px' }}
                />
                <span style={{ 
                  position: 'absolute', 
                  color: '#000', 
                  fontWeight: 'bold', 
                  fontSize: '14px', 
                  top: '50%', 
                  right: '10px', 
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  background: '#eee',
                  padding: '2px 4px',
                  borderRadius: '2px',
                  letterSpacing: '1px'
                }}>
                  {validationCode}
                </span>
              </li>
              <li className="li-login">
                <a className="btn-login" onClick={validateLogin} style={{ cursor: 'pointer' }}>{loading ? '...' : 'Login'}<img className="icon-login" src="/images/transparent.gif" alt="" /></a>
              </li>
              <li className="li-signup">
                <Link to="/signup" className="btn-signup">Sign up<img className="icon-login" src="/images/transparent.gif" alt="" /></Link>
              </li>
            </ul>
          ) : (
            <div className="account-section" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="balance-container" style={{ position: 'relative' }}>
                <div
                  className="balance-bar"
                  style={{ display: 'flex', alignItems: 'center', background: 'linear-gradient(to bottom, #444, #222)', border: '1px solid #555', borderRadius: '4px', padding: '2px', height: '32px', cursor: 'pointer' }}
                  onClick={() => setIsBalanceModalOpen(!isBalanceModalOpen)}
                >
                  <div className="balance-info" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 10px', borderRight: '1px solid #555' }}>
                    <span style={{ fontSize: '12px', color: '#ffb400' }}>Main Balance <strong style={{ color: '#ffb400' }}>PTH {balanceData.balance}</strong></span>
                    <span style={{ fontSize: '12px', color: '#ffb400' }}>Exposure <strong style={{ color: '#ffb400' }}>{balanceData.exposure}</strong></span>
                    <div style={{ border: '1px solid #ffb400', color: '#ffb400', fontSize: '11px', padding: '0 4px', borderRadius: '3px' }}>+3</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); refreshBalance(); }} style={{ background: 'none', border: 'none', color: '#ffb400', width: '30px', cursor: 'pointer' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"></path></svg>
                  </button>
                </div>
                {isBalanceModalOpen && (
                  <div className="balance-modal-content" style={{ position: 'absolute', top: '36px', right: '0', background: '#ecf0f1', width: '320px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', zIndex: 1001 }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ padding: '15px' }}>
                      <div style={{ background: '#fff', borderRadius: '4px', padding: '12px', marginBottom: '10px', border: '1px solid #ddd' }}>
                        <p style={{ margin: '0', fontSize: '13px', color: '#666' }}>Main Balance</p>
                        <p style={{ margin: '5px 0', fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }}><span style={{ color: '#7f8c8d', fontSize: '14px', marginRight: '5px' }}>PTH</span> {balanceData.balance}</p>
                        <div style={{ borderTop: '1px solid #eee', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '13px', color: '#666' }}>Exposure</span>
                          <span style={{ fontSize: '13px', color: '#333' }}>{balanceData.exposure}</span>
                        </div>
                      </div>
                      {[ { label: 'Royal Gaming Balance', val: '0', unit: 'PTH' }, { label: 'Casino Balance', val: '0', unit: 'PTH' }, { label: 'BPoker Balance', val: '0 Points', unit: '' } ].map((item) => (
                        <div key={item.label} style={{ background: '#fff', borderRadius: '4px', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div><p style={{ margin: '0', fontSize: '12px', color: '#666' }}>{item.label}</p><p style={{ margin: '3px 0 0 0', fontSize: '15px', fontWeight: 'bold', color: '#2c3e50' }}>{item.unit && <span style={{ color: '#7f8c8d', fontSize: '12px', marginRight: '3px' }}>{item.unit}</span>}{item.val}</p></div>
                          <button style={{ background: '#ecf0f1', border: '1px solid #bdc3c7', padding: '5px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', color: '#333', cursor: 'pointer' }}>Recall</button>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button style={{ background: '#ecf0f1', border: '1px solid #bdc3c7', padding: '8px 15px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>Recall All</button>
                      </div>
                    </div>
                    <button onClick={() => setIsBalanceModalOpen(false)} style={{ width: '100%', background: '#fff', border: 'none', borderTop: '1px solid #ddd', padding: '12px', fontSize: '15px', fontWeight: 'bold', color: '#333', cursor: 'pointer' }}>Close</button>
                  </div>
                )}
              </div>
              <div className="account-dropdown-container" style={{ position: 'relative' }}>
                <button onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)} onBlur={() => setTimeout(() => setIsAccountMenuOpen(false), 200)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'linear-gradient(to bottom, #444, #222)', border: '1px solid #555', borderRadius: '4px', padding: '0 10px', height: '32px', color: '#ffb400', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
                  My Account <span style={{ fontSize: '10px' }}>▼</span>
                </button>
                {isAccountMenuOpen && (
                  <div className="account-menu" style={{ position: 'absolute', top: '36px', right: '0', width: '240px', background: '#fff', border: '1px solid #ccc', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 1000, overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', background: '#f9f9f9' }}>
                      <span style={{ fontWeight: 'bold', color: '#333' }}>{username}</span><span style={{ fontSize: '11px', color: '#666' }}>GMT+5:30</span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                      {[ { label: 'My Profile', to: '/profile' }, { label: 'Balance Overview', to: '/balance-overview' }, { label: 'Account Statement', to: '/statement' }, { label: 'My Bets', to: '/bets' }, { label: 'Bets History', to: '/bets-history' }, { label: 'Profit & Loss', to: '/profit-loss' }, { label: 'Activity Log', to: '/activity-log' } ].map((item) => (
                        <li key={item.label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <Link to={item.to} style={{ display: 'block', padding: '10px 15px', textDecoration: 'none', color: '#333', fontSize: '13px' }} onClick={() => setIsAccountMenuOpen(false)}>{item.label}</Link>
                        </li>
                      ))}
                    </ul>
                    <div style={{ padding: '10px' }}>
                      <button onClick={() => logout()} style={{ width: '100%', background: '#7c8e9d', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        LOGOUT
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="menu-wrap">
          <div className="full-wrap">
            <ul id="tabMenu" className="menu nav nav-pills">
              <li><Link to="/" className={isActive('/') ? 'active-menu' : ''}>Home</Link></li>
              <li><Link to="/in-play">In-Play</Link></li>
              <li><Link to="/multi-markets">Multi Markets</Link></li>
              <li><Link to="/cricket" className={isActive('/cricket') ? 'active-menu' : ''}><span className="tag-live"><strong></strong>2</span>Cricket</Link></li>
              <li><Link to="/soccer"><span className="tag-live"><strong></strong>0</span>Soccer</Link></li>
              <li><Link to="/tennis"><span className="tag-live"><strong></strong>8</span>Tennis</Link></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onVirtualCricketClick && onVirtualCricketClick(); }}>Virtual Cricket</a></li>
              <li><Link to="/e-soccer"><span className="tag-live"><strong></strong>7</span>E-Soccer</Link></li>
            </ul>
            <ul className="setting-wrap">
              <li className="time_zone"><span>Time Zone :</span> GMT+5:30</li>
              <li><a className="setting" style={{ cursor: 'pointer' }}>Setting <img src="/images/transparent.gif" alt="" /></a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default DesktopHeader;

