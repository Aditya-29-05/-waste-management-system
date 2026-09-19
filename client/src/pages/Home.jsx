import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', padding: '1rem 0' }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        padding: '3.5rem 1rem',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, transparent 100%)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 0.9rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(16, 185, 129, 0.12)',
          color: 'var(--primary)',
          fontSize: '0.85rem',
          fontWeight: 700,
          letterSpacing: '0.5px'
        }}>
          <span>♻️</span> SMART URBAN SANITATION
        </div>

        <h1 style={{ fontSize: '2.75rem', maxWidth: '800px', fontWeight: 800 }}>
          Modern Waste Management for <span style={{ color: 'var(--primary)' }}>Cleaner Communities</span>
        </h1>

        <p style={{ maxWidth: '650px', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Report uncollected garbage, schedule on-demand doorstep waste collections, and track municipal sanitation operations in real time.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard →
              </Link>
              <Link to="/reports" className="btn btn-secondary">
                Report Waste Problem
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">
                Get Started Free →
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Highlights Grid */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.85rem' }}>Complete Waste Lifecycle Management</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Built for citizens, field workers, and municipal supervisors.</p>
        </div>

        <div className="grid-3">
          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📢</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Waste Issue Reporting</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Easily report garbage accumulation, overflowing bins, and illegal dumping with exact locations and status monitoring.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚛</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Doorstep Collections</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Schedule custom pickups for bulky furniture, e-waste, or recyclable goods on your preferred date and time slot.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Worker Dispatch & Tracking</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Admins allocate tasks to sanitary workers who can update progress from Assigned to Collecting and Completed.
            </p>
          </div>
        </div>
      </div>

      {/* DevOps Ready Callout */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(16, 185, 129, 0.08))',
        border: '1px solid rgba(6, 182, 212, 0.2)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        textAlign: 'center',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '1.5rem' }}>🚀</span>
        <h3 style={{ fontSize: '1.3rem' }}>DevOps-Ready Architecture</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '0.95rem' }}>
          Clean RESTful architecture with stateless JWT authentication, MongoDB schemas, and logical separation between client and server layers.
        </p>
      </div>
    </div>
  );
};

export default Home;
