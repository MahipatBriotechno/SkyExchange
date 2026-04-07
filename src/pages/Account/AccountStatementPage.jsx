import React from 'react';
import AccountLayout from './AccountLayout';

function AccountStatementPage() {
  return (
    <AccountLayout title="Account Statement">
      <table className="data-table balance-table">
        <thead>
          <tr>
            <th>Date/Time</th>
            <th>Deposit</th>
            <th>Withdraw</th>
            <th>Balance</th>
            <th>Remark</th>
            <th>From/To</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="6" style={{ padding: '15px' }}>
              No Data
            </td>
          </tr>
        </tbody>
      </table>
    </AccountLayout>
  );
}

export default AccountStatementPage;
