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
      {/* Desktop Top Bar */}
      <div className="top">
        <div className="header full-wrap">
          <h1><Link to="/">SKYEXCHANGE</Link></h1>

          {/* Search */}
          <div id="searchWrap" className="search-wrap" style={{ display: 'block' }}>
            <div>
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
              <div id="searchResult" className="suggestion-wrap" style={{ display: 'block', maxHeight: '400px', overflowY: 'auto' }}>
                <ul id="searchList">
                  {searchLoading && (
                    <li style={{ padding: '10px', color: '#fff' }}>Searching...</li>
                  )}
                  
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
                        <p style={{ color: '#aaa', margin: '0', fontSize: '11px' }}>
                          {res.Datetime} | {res.Type}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Login or Account Info */}
          {!isLoggedIn ? (
            <ul className="login-wrap">
              <li className="user error">
                <input
                  id="loginName"
                  type="text"
                  placeholder="Username"
                  autoComplete="username"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                />
              </li>
              <li>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </li>
              <li>
                <input
                  type="text"
                  id="validationInput"
                  placeholder="Validation"
                  value={validationInput}
                  onChange={(e) => setValidationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && validateLogin(e)}
                />
              </li>
              <li>
                <span
                  id="validationCode"
                  style={{
                    position: 'absolute',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    zIndex: 9,
                    top: '30px',
                    right: '195px',
                  }}
                >
                  {validationCode}
                </span>
              </li>
              <li className="li-login">
                <a id="loginBtn" className="btn-login" onClick={validateLogin} style={{ cursor: 'pointer' }}>
                  {loading ? '...' : 'Login'}
                  <img className="icon-login" src="/images/transparent.gif" alt="" />
                </a>
              </li>
              <li className="li-signup">
                <Link to="/signup" className="btn-signup">
                  Sign up
                  <img className="icon-login" src="/images/transparent.gif" alt="" />
                </Link>
              </li>
              <li id="errorMsg" className="error" style={{ display: 'block' }}></li>
            </ul>
          ) : (
            <ul className="account-wrap">
              <li className="account-number">
                <Link to="/profile" className="ui-link">{username}</Link>
              </li>
              <li className="account-balance">
                <p>Main Balance</p>
                <span id="mainBalance">
                  <span className="badge-currency">USD</span> {balanceData.balance}
                </span>
              </li>
              <li className="account-exposure">
                <p>Exposure</p>
                <Link to="/bets" className="ui-link">
                  <span id="mainExposure" className="red">{balanceData.exposure}</span>
                </Link>
              </li>
              <li className="li-logout">
                <a className="btn-login" onClick={() => logout()} style={{ cursor: 'pointer' }}>
                  Logout
                </a>
              </li>
            </ul>
          )}
        </div>

        {/* Menu Wrap */}
        <div className="menu-wrap">
          <div className="full-wrap">
            <ul id="tabMenu" className="menu nav nav-pills">
              <li>
                <Link id="menu_Home" to="/" neua="Home" className={isActive('/') ? 'active-menu' : ''}>
                  Home
                </Link>
              </li>
              <li>
                <Link id="menu_InPlay" to="/in-play" neua="In-Play">In-Play</Link>
              </li>
              <li>
                <Link id="menu_MultiMarkets" to="/multi-markets" neua="Multi Markets">Multi Markets</Link>
              </li>
              <li>
                <Link id="menu_CRICKET" to="/cricket" className={`nav-link ${isActive('/cricket') ? 'active-menu' : ''}`}>
                  <span id="tagLive" className="tag-live"><strong></strong>2</span>
                  Cricket
                </Link>
              </li>
              <li>
                <Link id="menu_SOCCER" to="/soccer">
                  <span className="tag-live"><strong></strong>0</span>
                  Soccer
                </Link>
              </li>
              <li>
                <Link id="menu_TENNIS" to="/tennis" className="nav-link">
                  <span className="tag-live"><strong></strong>8</span>
                  Tennis
                </Link>
              </li>
              <li>
                <a className="" href="#" neua="Virtual Cricket" onClick={(e) => { e.preventDefault(); onVirtualCricketClick && onVirtualCricketClick(); }}>Virtual Cricket</a>
              </li>
              <li>
                <Link id="menu_E_SOCCER" to="/e-soccer" className="nav-link">
                  <span className="tag-live"><strong></strong>7</span>
                  E-Soccer
                </Link>
              </li>
            </ul>

            <ul className="setting-wrap">
              <li className="time_zone"><span>Time Zone :</span> GMT+5:30</li>
              <li>&nbsp;&nbsp;&nbsp;</li>
              <li>
                <a id="oneClickSetting" className="one_click" style={{ cursor: 'pointer', display: 'none' }}>
                  <img src="/images/transparent.gif" alt="" />One Click Bet
                </a>
              </li>
              <li>
                <a id="slipSet" className="setting" style={{ cursor: 'pointer' }}>
                  Setting <img src="/images/transparent.gif" alt="" />
                </a>
              </li>
            </ul>

            {/* Settings Popup */}
            <div id="set_pop" className="slip_set-pop" style={{ display: 'none' }}>
              <div id="coinList" className="set-content">
                <dl className="odds-set">
                  <dd className="col-defult">
                    <label htmlFor="defult_stake"><strong>Default stake </strong></label>
                    <input id="userCoin" className="stake-input form-control form-control-sm" type="text" maxLength="7" value="" readOnly />
                  </dd>
                </dl>
                <dl id="stakeSet" className="stake-set">
                  <dt>Stake</dt>
                  {[['coin_1', '10'], ['coin_2', '30'], ['coin_3', '50'], ['coin_4', '100'], ['coin_5', '200'], ['coin_6', '300'], ['coin_7', '500'], ['coin_8', '1000']].map(([id, val]) => (
                    <dd key={id}>
                      <a id={id} style={{ cursor: 'pointer' }} className="btn btn-outline-secondary btn-sm">{val}</a>
                    </dd>
                  ))}
                  <dd className="col-edit">
                    <a id="edit" className="btn-edit">Edit <img src="/images/transparent.gif" alt="" /></a>
                  </dd>
                </dl>
                <dl className="odds-set">
                  <dt>Odds</dt>
                  <dd>
                    <input id="enableSparkCheck" type="checkbox" className="form-check-input" />
                    <label htmlFor="enableSparkCheck">Highlight when odds change</label>
                  </dd>
                </dl>
                <dl className="odds-set">
                  <dt>FancyBet</dt>
                  <dd>
                    <input id="fancyBetAcceptAnyOddsCheckBox" type="checkbox" />
                    <label htmlFor="fancy_odd">Accept Any Odds </label>
                  </dd>
                </dl>
                <dl className="odds-set">
                  <dt>SportsBook</dt>
                  <dd>
                    <input id="sportsBookAcceptAnyOddsCheckBox" type="checkbox" className="form-check-input" />
                    <label>Accept Any Odds </label>
                  </dd>
                </dl>
                <dl className="odds-set">
                  <dt>Win Selection forecast</dt>
                  <dd>
                    <input id="withCommCheckBox" type="checkbox" defaultChecked />
                    <label htmlFor="withCommCheckBox">With Commission</label>
                  </dd>
                </dl>
                <ul className="btn-wrap">
                  <li><a id="closeSet" className="btn" style={{ cursor: 'pointer' }}>Cancel</a></li>
                  <li className="col-send"><a id="coinSave" className="btn-send" style={{ cursor: 'pointer' }}>Save</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DesktopHeader;
