import React from 'react';
import AccountLayout from './AccountLayout';

function BalanceOverviewPage() {
  return (
    <AccountLayout title="Summary">
      <div className="balance-summary">
        <div className="balance-item">
          <h4>Your Balances</h4>
          <div className="balance-amount">
            0.00 <span>PTH</span>
          </div>
        </div>
        <div className="welcome-msg">
          <h4>Welcome,</h4>
          <p>
            View your account details here. You can manage funds, review and change your settings and see the performance of your betting activity.
          </p>
        </div>
      </div>

      <table className="data-table balance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Transaction №</th>
            <th>Debits</th>
            <th>Credits</th>
            <th>Balance</th>
            <th>Remarks</th>
            <th>From/To</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              No data found.
            </td>
          </tr>
        </tbody>
      </table>
    </AccountLayout>
  );
}

export default BalanceOverviewPage;
