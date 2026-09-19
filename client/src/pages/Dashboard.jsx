import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import { collectionService } from '../services/collectionService';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [repRes, colRes] = await Promise.all([
          reportService.getReports(),
          collectionService.getCollections()
        ]);
        if (repRes.success) setReports(repRes.data);
        if (colRes.success) setCollections(colRes.data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Compute summary metrics
  const pendingReports = reports.filter((r) => r.status === 'PENDING').length;
  const inProgressReports = reports.filter((r) => ['ASSIGNED', 'IN_PROGRESS'].includes(r.status)).length;
  const resolvedReports = reports.filter((r) => r.status === 'RESOLVED').length;

  const requestedCollections = collections.filter((c) => c.status === 'REQUESTED').length;
  const activeCollections = collections.filter((c) => ['ASSIGNED', 'COLLECTING'].includes(c.status)).length;
  const completedCollections = collections.filter((c) => c.status === 'COMPLETED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Header */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.12))',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.85rem' }}>Welcome, {user?.name}</h1>
            <span className="user-role-tag">{user?.role}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {user?.role === 'admin'
              ? 'Administrator Console — Overseeing all reports, requests, and field assignments.'
              : user?.role === 'worker'
              ? 'Worker Console — Review assigned sanitation tasks and collection runs.'
              : 'Citizen Portal — Manage your reported community issues and scheduled doorstep collections.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/reports" className="btn btn-primary btn-sm">
            + Report Waste
          </Link>
          <Link to="/collections" className="btn btn-secondary btn-sm">
            + Schedule Pickup
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Metrics Row */}
      <div className="grid-4">
        <div className="card">
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Waste Reports
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            {loading ? '...' : reports.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--status-pending)', marginTop: '0.25rem' }}>
            {pendingReports} Pending Resolution
          </div>
        </div>

        <div className="card">
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
            Resolved Reports
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-resolved)', marginTop: '0.25rem' }}>
            {loading ? '...' : resolvedReports}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Cleaned & Closed
          </div>
        </div>

        <div className="card">
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Collections
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            {loading ? '...' : collections.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--status-pending)', marginTop: '0.25rem' }}>
            {requestedCollections} Requested
          </div>
        </div>

        <div className="card">
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
            Completed Collections
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-resolved)', marginTop: '0.25rem' }}>
            {loading ? '...' : completedCollections}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Doorstep Disposals
          </div>
        </div>
      </div>

      {/* Recent Previews Split Grid */}
      <div className="grid-2">
        {/* Recent Reports */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Recent Waste Reports</h3>
            <Link to="/reports" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              View All →
            </Link>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading reports...</p>
          ) : reports.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No waste reports found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {reports.slice(0, 4).map((report) => (
                <div
                  key={report._id}
                  style={{
                    padding: '0.85rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{report.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      📍 {report.location} • {report.wasteType}
                    </div>
                  </div>
                  <StatusBadge status={report.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Collections */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Recent Collection Requests</h3>
            <Link to="/collections" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              View All →
            </Link>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading collections...</p>
          ) : collections.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No collection requests found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {collections.slice(0, 4).map((item) => (
                <div
                  key={item._id}
                  style={{
                    padding: '0.85rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.wasteType}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      📅 {new Date(item.preferredDate).toLocaleDateString()} ({item.preferredTime})
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
