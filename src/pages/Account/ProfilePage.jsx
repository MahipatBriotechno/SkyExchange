import React from 'react';
import AccountLayout from './AccountLayout';

function ProfilePage() {
  return (
    <AccountLayout title="Account Details">
      <div className="details-section">
        <div style={{ flex: '1 1 50%' }}>
          <div className="details-box">
            <h3>About You</h3>
            <table className="details-table">
              <tbody>
                <tr>
                  <td>First Name</td>
                  <td>null</td>
                </tr>
                <tr>
                  <td>Last Name</td>
                  <td>--</td>
                </tr>
                <tr>
                  <td>Birthday</td>
                  <td>--</td>
                </tr>
                <tr>
                  <td>Password</td>
                  <td style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    ********************************
                    <a href="#" className="edit-link">Edit ✎</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="details-box">
            <h3>Address</h3>
            <table className="details-table">
              <tbody>
                <tr>
                  <td>Address</td>
                  <td>--</td>
                </tr>
                <tr>
                  <td>Town/City</td>
                  <td>--</td>
                </tr>
                <tr>
                  <td>Country</td>
                  <td>--</td>
                </tr>
                <tr>
                  <td>Country/State</td>
                  <td>--</td>
                </tr>
                <tr>
                  <td>Postcode</td>
                  <td>--</td>
                </tr>
                <tr>
                  <td>Timezone</td>
                  <td>IST</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ flex: '1 1 40%' }}>
          <div className="details-box">
            <h3>Setting</h3>
            <table className="details-table">
              <tbody>
                <tr>
                  <td>Currency</td>
                  <td>PTH</td>
                </tr>
                <tr>
                  <td>Odds Format</td>
                  <td>--</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="details-box">
            <h3>Commission</h3>
            <table className="details-table">
              <tbody>
                <tr>
                  <td>Comm charged</td>
                  <td>2.000 %</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}

export default ProfilePage;
