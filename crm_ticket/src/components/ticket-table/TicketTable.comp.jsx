import React from "react";
import { useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./ticket-table.style.css";

export const TicketTable = () => {
  const { searchTicketList, isLoading, error } = useSelector(
    (state) => state.tickets
  );

  // Loading state
  if (isLoading) {
    return <div className="loading-state">Loading tickets...</div>;
  }

  // Error state
  if (error) {
    return <div className="error-state">Error: {error}</div>;
  }

  // Get status badge class
  const getStatusClass = (status) => {
    if (status.toLowerCase().includes('pending')) return 'status-badge status-pending';
    if (status.toLowerCase().includes('closed')) return 'status-badge status-closed';
    return 'status-badge status-open';
  };

  return (
    <Table className="ticket-table">
      <thead>
        <tr>
          <th>Ticket ID</th>
          <th>Subject</th>
          <th>Status</th>
          <th>Opened Date</th>
        </tr>
      </thead>
      <tbody>
        {searchTicketList.length ? (
          searchTicketList.map((row) => (
            <tr key={row._id}>
              <td>
                <span className="ticket-id">
                  {row._id.substring(0, 8)}...
                </span>
              </td>
              <td>
                <Link 
                  to={`/ticket/${row._id}`}
                  className="ticket-subject-link"
                >
                  {row.subject}
                </Link>
              </td>
              <td>
                <span className={getStatusClass(row.status)}>
                  {row.status}
                </span>
              </td>
              <td>
                <span className="ticket-date">
                  {row.openAt && new Date(row.openAt).toLocaleString()}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="empty-state">
              No tickets found
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};