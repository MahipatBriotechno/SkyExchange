import React, { useState } from 'react';
import AccountLayout from './AccountLayout';

function ActivityLogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Generate 80 dummy data items
  const allData = Array.from({ length: 80 }, (_, i) => ({
    date: `2026-04-0${Math.max(1, 7 - Math.floor(i / 10))} ${10 + (i % 12)}:${20 + (i % 30)}:${30 + (i % 25)}`,
    ip: i % 2 === 0 ? '106.215.157.196' : '157.10.6.74',
    isp: i % 2 === 0 ? 'Bharti Airtel Ltd.' : 'Blue Bird Networks',
    location: i % 2 === 0 ? 'Anand, Gujarat, IN' : 'Lahore, Punjab, PK',
    agent: i % 3 === 0 ? 'Browser' : 'Browser (mobile)'
  }));

  const totalPages = Math.ceil(allData.length / itemsPerPage);
  const paginatedData = allData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <AccountLayout title="Activity Log">
      <table className="data-table balance-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Login Date & Time</th>
            <th style={{ textAlign: 'center' }}>Login Status</th>
            <th style={{ textAlign: 'center' }}>IP Address</th>
            <th style={{ textAlign: 'center' }}>ISP</th>
            <th style={{ textAlign: 'left' }}>City/State/Country</th>
            <th style={{ textAlign: 'left' }}>User Agent Type</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, i) => (
            <tr key={i}>
              <td style={{ textAlign: 'left' }}>{row.date}</td>
              <td className="text-success" style={{ textAlign: 'center' }}>Login Success</td>
              <td style={{ textAlign: 'center' }}>{row.ip}</td>
              <td style={{ textAlign: 'center' }}>{row.isp}</td>
              <td style={{ textAlign: 'left' }}>{row.location}</td>
              <td style={{ textAlign: 'left' }}>{row.agent}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dynamic Pagination Bar */}
      <div className="pagination-wrap">
        <button 
          className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`} 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => (
          <button 
            key={i + 1}
            className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button 
          className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </AccountLayout>
  );
}

export default ActivityLogPage;
