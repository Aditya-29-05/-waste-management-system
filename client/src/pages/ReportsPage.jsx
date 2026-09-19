import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import StatusBadge from '../components/StatusBadge';

const ReportsPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form state for creating a report
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    wasteType: 'Garbage accumulation',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterType) params.wasteType = filterType;

      const res = await reportService.getReports(params);
      if (res.success) {
        setReports(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch waste reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filterStatus, filterType]);

  const handleCreateReport = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await reportService.createReport(newReport);
      if (res.success) {
        setShowModal(false);
        setNewReport({
          title: '',
          description: '',
          wasteType: 'Garbage accumulation',
          location: ''
        });
        fetchReports();
      }
    } catch (err) {
      alert(err.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      await reportService.updateReport(reportId, { status: newStatus });
      fetchReports();
    } catch (err) {
      alert(err.message || 'Failed to update report status');
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this waste report?')) return;
    try {
      await reportService.deleteReport(reportId);
      fetchReports();
    } catch (err) {
      alert(err.message || 'Failed to delete report');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem' }}>Waste Reports</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Report environmental hazards, overflowing bins, and monitor resolution.
          </p>
        </div>

        <button
          id="open-report-modal-btn"
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          + Submit New Report
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status:</label>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Waste Type:</label>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Garbage accumulation">Garbage accumulation</option>
            <option value="Overflowing bins">Overflowing bins</option>
            <option value="Illegal dumping">Illegal dumping</option>
            <option value="Uncollected waste">Uncollected waste</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {(filterStatus || filterType) && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setFilterStatus(''); setFilterType(''); }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Reports Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading waste reports...
        </div>
      ) : reports.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✨</div>
          <h3>No waste reports found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            No reports match the current filter or you have not submitted any reports yet.
          </p>
        </div>
      ) : (
        <div className="grid-2">
          {reports.map((report) => (
            <div key={report._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>{report.title}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>
                    {report.wasteType}
                  </span>
                </div>
                <StatusBadge status={report.status} />
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flex: 1 }}>
                {report.description}
              </p>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <div>📍 <strong>Location:</strong> {report.location}</div>
                <div>👤 <strong>Reported by:</strong> {report.user?.name} ({new Date(report.createdAt).toLocaleDateString()})</div>
                {report.assignedWorker && (
                  <div>👷 <strong>Worker:</strong> {report.assignedWorker.name}</div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
                {/* Worker / Admin status update */}
                {(user.role === 'admin' || user.role === 'worker') && (
                  <select
                    className="form-select"
                    style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                    value={report.status}
                    onChange={(e) => handleStatusUpdate(report._id, e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                )}

                {/* Delete / Cancel option */}
                {((user.role === 'user' && report.status === 'PENDING') || user.role === 'admin') && (
                  <button
                    onClick={() => handleDeleteReport(report._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating New Report */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem' }}>Report Waste Problem</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReport}>
              <div className="form-group">
                <label className="form-label" htmlFor="report-title">Report Title</label>
                <input
                  id="report-title"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Overflowing dumpster behind market"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="report-type">Waste Type</label>
                <select
                  id="report-type"
                  className="form-select"
                  value={newReport.wasteType}
                  onChange={(e) => setNewReport({ ...newReport, wasteType: e.target.value })}
                  required
                >
                  <option value="Garbage accumulation">Garbage accumulation</option>
                  <option value="Overflowing bins">Overflowing bins</option>
                  <option value="Illegal dumping">Illegal dumping</option>
                  <option value="Uncollected waste">Uncollected waste</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="report-location">Location</label>
                <input
                  id="report-location"
                  type="text"
                  className="form-input"
                  placeholder="Street address, cross-streets, or landmark"
                  value={newReport.location}
                  onChange={(e) => setNewReport({ ...newReport, location: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="report-description">Description</label>
                <textarea
                  id="report-description"
                  className="form-textarea"
                  placeholder="Describe the severity, hazardous items, or accessibility issues..."
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  id="submit-report-btn"
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
