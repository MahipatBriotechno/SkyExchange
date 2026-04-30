import { fetchAPI } from '../../utils/api';

export const walletController = {
  /**
   * List of available deposit methods / platform bank accounts
   */
  getDepositMethods: (loginToken) => fetchAPI('/depositlist', { LoginToken: loginToken }),

  /**
   * Submit a deposit request with UTR and (optional) screenshot
   */
  requestDeposit: (data) => fetchAPI('/deposit', data),

  /**
   * Get user's deposit history
   */
  getDepositHistory: (loginToken) => fetchAPI('/depositreq', { LoginToken: loginToken }),

  /**
   * Save bank account details for withdrawal
   */
  saveBankAccount: (data) => fetchAPI('/bankac', data),

  /**
   * Get user's saved bank accounts
   */
  getBankAccounts: (loginToken) => fetchAPI('/useraclist', { LoginToken: loginToken }),

  /**
   * Delete a saved bank account
   */
  deleteBankAccount: (loginToken, accountId) => fetchAPI('/delbankac', { LoginToken: loginToken, Id: accountId }),

  /**
   * Submit a withdrawal request
   */
  requestWithdrawal: (loginToken, accountId, amount, ip = '1.1.1.1') => 
    fetchAPI('/withdraw', { LoginToken: loginToken, Id: accountId, Amount: amount, IP: ip }),

  /**
   * Get user's withdrawal history
   */
  getWithdrawalHistory: (loginToken, accountId = '') => fetchAPI('/withdrawlist', { LoginToken: loginToken, Id: accountId }),

  /**
   * Submit a USDT deposit request
   */
  depositUSDT: (data) => fetchAPI('/depositusdt', data),

  /**
   * Update USDT wallet details
   */
  updateUSDTWallet: (data) => fetchAPI('/usdtwalletupdate', data),

  /**
   * Fetch USDT wallet details
   */
  getUSDTWallet: (loginToken) => fetchAPI('/usdtwallet', { LoginToken: loginToken }),

  /**
   * Submit a USDT withdrawal request
   */
  withdrawUSDT: (data) => fetchAPI('/withdrawusdt', data),
};
