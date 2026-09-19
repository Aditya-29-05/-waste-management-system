import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collectionService } from '../services/collectionService';
import StatusBadge from '../components/StatusBadge';

const CollectionsPage = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [newCollection, setNewCollection] = useState({
    address: user?.address || '',
    wasteType: 'Bulk furniture',
    preferredDate: '',
    preferredTime: '09:00 AM - 12:00 PM',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (filterStatus) params.status = filterStatus;

      const res = await collectionService.getCollections(params);
      if (res.success) {
        setCollections(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch collection requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [filterStatus]);

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await collectionService.createCollection(newCollection);
      if (res.success) {
        setShowModal(false);
        setNewCollection({
          address: user?.address || '',
          wasteType: 'Bulk furniture',
          preferredDate: '',
          preferredTime: '09:00 AM - 12:00 PM',
          description: ''
        });
        fetchCollections();
      }
    } catch (err) {
      alert(err.message || 'Failed to schedule collection');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await collectionService.updateCollection(id, { status: newStatus });
      fetchCollections();
    } catch (err) {
      alert(err.message || 'Failed to update request status');
    }
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this collection request?')) return;
    try {
      await collectionService.deleteCollection(id);
      fetchCollections();
    } catch (err) {
      alert(err.message || 'Failed to cancel request');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem' }}>Collection Requests</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Schedule and manage on-demand doorstep waste pickup tasks.
          </p>
        </div>

        <button
          id="open-collection-modal-btn"
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          + Schedule New Collection
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
            <option value="REQUESTED">Requested</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="COLLECTING">Collecting</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {filterStatus && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setFilterStatus('')}
          >
            Clear Filter
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Collections Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading collection requests...
        </div>
      ) : collections.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚛</div>
          <h3>No collection requests found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            You haven't scheduled any collections or none match your selected filter.
          </p>
        </div>
      ) : (
        <div className="grid-2">
          {collections.map((item) => (
            <div key={item._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>{item.wasteType}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                    📅 {new Date(item.preferredDate).toLocaleDateString()} • {item.preferredTime}
                  </span>
                </div>
                <StatusBadge status={item.status} />
              </div>

              {item.description && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {item.description}
                </p>
              )}

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <div>🏠 <strong>Pickup Address:</strong> {item.address}</div>
                <div>👤 <strong>Requested by:</strong> {item.user?.name}</div>
                {item.assignedWorker && (
                  <div>👷 <strong>Assigned Worker:</strong> {item.assignedWorker.name}</div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
                {(user.role === 'admin' || user.role === 'worker') && (
                  <select
                    className="form-select"
                    style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                    value={item.status}
                    onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                  >
                    <option value="REQUESTED">Requested</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="COLLECTING">Collecting</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                )}

                {((user.role === 'user' && item.status === 'REQUESTED') || user.role === 'admin') && (
                  <button
                    onClick={() => handleDeleteCollection(item._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Scheduling New Collection */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem' }}>Schedule Waste Collection</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCollection}>
              <div className="form-group">
                <label className="form-label" htmlFor="col-address">Pickup Address</label>
                <input
                  id="col-address"
                  type="text"
                  className="form-input"
                  placeholder="Street address, building, apartment number"
                  value={newCollection.address}
                  onChange={(e) => setNewCollection({ ...newCollection, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="col-type">Waste Type</label>
                <select
                  id="col-type"
                  className="form-select"
                  value={newCollection.wasteType}
                  onChange={(e) => setNewCollection({ ...newCollection, wasteType: e.target.value })}
                  required
                >
                  <option value="Bulk furniture">Bulk furniture (Couches, Beds, Tables)</option>
                  <option value="Electronic waste">Electronic waste (TVs, Computers, Appliances)</option>
                  <option value="Construction debris">Construction debris (Wood, Drywall, Tiles)</option>
                  <option value="Recyclable paper/plastic">Recyclable paper & plastics</option>
                  <option value="Yard & organic waste">Yard & organic garden waste</option>
                  <option value="General household waste">General household surplus</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="col-date">Preferred Date</label>
                  <input
                    id="col-date"
                    type="date"
                    className="form-input"
                    value={newCollection.preferredDate}
                    onChange={(e) => setNewCollection({ ...newCollection, preferredDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="col-time">Preferred Time Slot</label>
                  <select
                    id="col-time"
                    className="form-select"
                    value={newCollection.preferredTime}
                    onChange={(e) => setNewCollection({ ...newCollection, preferredTime: e.target.value })}
                    required
                  >
                    <option value="08:00 AM - 11:00 AM">08:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 02:00 PM">11:00 AM - 02:00 PM</option>
                    <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM</option>
                    <option value="05:00 PM - 08:00 PM">05:00 PM - 08:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="col-description">Item Description & Notes</label>
                <textarea
                  id="col-description"
                  className="form-textarea"
                  placeholder="Specify items, estimated weight, gate access code, or handling instructions..."
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
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
                  id="submit-collection-btn"
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Scheduling...' : 'Schedule Pickup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
