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
        <div className="header full-wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h1 style={{ margin: '0 15px 0 0' }}>
              <Link to="/">
                <img src="/images/logo.png" alt="SKYEXCHANGE" style={{ height: '40px' }} />
              </Link>
            </h1>
            <div id="searchWrap" className="search-wrap">
              <input
                id="searchInput"
                className="search-input form-control form-control-sm"
                type="text"
                placeholder="Search Events"
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchInput.length >= 3 && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                style={{ background: '#fff', border: 'none', borderRadius: '4px', height: '24px', fontSize: '12px' }}
              />
              <button
                id="searchClear"
                className="search-clear"
                style={{ display: searchInput ? 'block' : 'none' }}
                onClick={() => handleSearch('')}
              ></button>

              {(showSearchResults || searchLoading) && (
                <div id="searchResult" className="suggestion-wrap" style={{ position: 'absolute', top: '28px', left: 0, width: '100%', zIndex: 1100, background: '#111', borderRadius: '0 0 4px 4px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                  <ul id="searchList">
                    {searchLoading && <li style={{ padding: '10px', color: '#fff', fontSize: '12px' }}>Searching...</li>}
                    {!searchLoading && searchResults.length === 0 && searchInput.length >= 3 && (
                      <li id="noMatching">
                        <p className="no-matching" style={{ padding: '10px', color: '#aaa', margin: 0, fontSize: '12px' }}>No events found matching "{searchInput}"</p>
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
                          <p style={{ color: '#ffbd14', fontWeight: 'bold', margin: '0', fontSize: '13px' }}>{res.GameName}</p>
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
              <li className="user">
                <input type="text" placeholder="Username" value={loginName} onChange={(e) => setLoginName(e.target.value)} />
              </li>
              <li>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </li>
              <li style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Validation"
                  className="validation-input"
                  value={validationInput}
                  onChange={(e) => setValidationInput(e.target.value)}
                  style={{ width: '100px' }}
                />
                <span className="validation-code" style={{
                  position: 'absolute',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  top: '50%',
                  right: '5px',
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
                <a className="btn-login" onClick={validateLogin} style={{ cursor: 'pointer' }}>
                  {loading ? '...' : 'Login'}
                  <img className="icon-login" src="/images/transparent.gif" alt="" />
                </a>
              </li>
              <li className="li-signup">
                <Link to="/signup" className="btn-signup">Sign up<img className="icon-login" src="/images/transparent.gif" alt="" /></Link>
              </li>
            </ul>
          ) : (
            <ul className="account-wrap" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: 0, margin: 0, listStyle: 'none' }}>
              <li className="main-wallet" style={{ padding: '0 10px', height: '30px', display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', border: '1px solid #000', borderRadius: '4px', boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.5)' }} onClick={() => setIsBalanceModalOpen(!isBalanceModalOpen)}>
                <span style={{ fontSize: '12px', color: '#ffb600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Main Balance <strong style={{ color: '#ffb600' }}>PTH {balanceData.balance}</strong>
                  Exposure <strong style={{ color: '#ffb600' }}>{balanceData.exposure}</strong>
                  <span style={{ background: '#ffb600', color: '#000', padding: '0 4px', borderRadius: '2px', fontSize: '10px', fontWeight: 'bold' }}>+3</span>
                </span>
                {isBalanceModalOpen && (
                  <div className="balance-modal-content" style={{ position: 'absolute', top: '45px', right: '150px', background: '#e0e6e6', width: '320px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', zIndex: 1001, color: '#333' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ padding: '15px' }}>
                      <div style={{ background: '#fff', borderRadius: '4px', padding: '12px', marginBottom: '10px', border: '1px solid #ccc' }}>
                        <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Main Balance</p>
                        <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold', color: '#3b5160' }}><span style={{ color: '#7f8c8d', fontSize: '13px', marginRight: '5px' }}>PTH</span> {balanceData.balance}</p>
                        <div style={{ borderTop: '1px solid #eee', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', color: '#666' }}>Exposure</span>
                          <span style={{ fontSize: '12px', color: '#d0021b', fontWeight: 'bold' }}>{balanceData.exposure}</span>
                        </div>
                      </div>
                      {[
                        { label: 'Royal Gaming Balance', val: '0.00', unit: 'PTH' },
                        { label: 'Casino Balance', val: '0.00', unit: 'PTH' },
                        { label: 'BPoker Balance', val: '0.00 Points', unit: '' }
                      ].map((item) => (
                        <div key={item.label} style={{ background: '#fff', borderRadius: '4px', padding: '10px', marginBottom: '8px', border: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ margin: '0', fontSize: '11px', color: '#666' }}>{item.label}</p>
                            <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: 'bold', color: '#3b5160' }}>
                              {item.unit && <span style={{ color: '#7f8c8d', fontSize: '11px', marginRight: '3px' }}>{item.unit}</span>}
                              {item.val}
                            </p>
                          </div>
                          <button style={{ background: '#7c8e9d', border: 'none', padding: '4px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: '600', color: '#fff', cursor: 'pointer' }}>Recall</button>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
                        <button style={{ background: '#3b5160', border: 'none', padding: '6px 12px', borderRadius: '3px', fontSize: '12px', fontWeight: 'bold', color: '#fff', cursor: 'pointer' }}>Recall All</button>
                      </div>
                    </div>
                    <button onClick={() => setIsBalanceModalOpen(false)} style={{ width: '100%', background: '#fff', border: 'none', borderTop: '1px solid #ccc', padding: '10px', fontSize: '14px', fontWeight: 'bold', color: '#333', cursor: 'pointer' }}>Close</button>
                  </div>
                )}
              </li>
              <li className="a-refresh" style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', border: '1px solid #000', borderRadius: '4px', boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.5)' }} onClick={refreshBalance}>
                <img src="/images/transparent.gif" alt="Refresh" style={{ width: '14px', height: '14px' }} />
              </li>
              <li className="account" style={{ position: 'relative' }}>
                <a 
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', height: '30px', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', border: '1px solid #000', borderRadius: '4px', color: '#ffb600', fontWeight: 'bold', fontSize: '12px', boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.5)' }}
                >
                  My Account
                </a>
                {isAccountMenuOpen && (
                  <div className="account-menu" style={{ position: 'absolute', top: '35px', right: '0', width: '220px', background: '#fff', border: '1px solid #ccc', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 1000, color: '#333' }} onMouseLeave={() => setIsAccountMenuOpen(false)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', background: '#f5f5f5', fontSize: '12px' }}>
                      <span style={{ fontWeight: 'bold' }}>{username}</span>
                      <span style={{ color: '#666' }}>GMT+5:30</span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                      {[
                        { label: 'My Profile', to: '/profile' },
                        { label: 'Balance Overview', to: '/balance-overview' },
                        { label: 'Account Statement', to: '/statement' },
                        { label: 'My Bets', to: '/bets' },
                        { label: 'Bets History', to: '/bets-history' },
                        { label: 'Profit & Loss', to: '/profit-loss' },
                        { label: 'Activity Log', to: '/activity-log' }
                      ].map((item) => (
                        <li key={item.label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <Link to={item.to} style={{ display: 'block', padding: '8px 15px', textDecoration: 'none', color: '#333', fontSize: '12px' }} onClick={() => setIsAccountMenuOpen(false)}>{item.label}</Link>
                        </li>
                      ))}
                    </ul>
                    <div style={{ padding: '10px' }}>
                      <button onClick={() => logout()} style={{ width: '100%', background: '#7c8e9d', color: '#fff', border: 'none', padding: '8px', borderRadius: '3px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                        LOGOUT
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            </ul>
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

export default DesktopHeader;r;

