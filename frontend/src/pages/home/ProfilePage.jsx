import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';
import ConfirmationModal from '../../components/ConfirmationModal';
import '../../styles/ProfilePage.css';

/**
 * ProfilePage - User profile management page
 * Displays user information with inline editing for name and phone
 * Allows logout with confirmation modal
 */
const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // State management
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null); // null, 'name', or 'phone'
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Temporary values for editing
  const [editValues, setEditValues] = useState({
    name: '',
    phone: ''
  });

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getProfile();
      setUserData(response.user);
      setEditValues({
        name: response.user.name || '',
        phone: response.user.phone || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Start editing a field
   */
  const handleEditClick = (field) => {
    setEditingField(field);
  };

  /**
   * Handle input change while editing
   */
  const handleInputChange = (field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Cancel editing without saving
   */
  const handleCancel = () => {
    setEditingField(null);
    setEditValues({
      name: userData.name || '',
      phone: userData.phone || ''
    });
  };

  /**
   * Save changes to profile
   */
  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validate name is not empty
      if (!editValues.name.trim()) {
        setError('Name cannot be empty');
        setSaving(false);
        return;
      }

      const response = await userService.updateProfile({
        name: editValues.name.trim(),
        phone: editValues.phone || null
      });

      setUserData(response.user);
      setEditingField(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle logout
   */
  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/login');
  };

  // Loading state
  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !userData) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <p>Error: {error}</p>
          <button className="btn-primary" onClick={fetchUserProfile}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!userData) {
    return (
      <div className="profile-page">
        <div className="profile-empty">
          <p>No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* User name header */}
        <div className="profile-header">
          <h1 className="profile-name">{userData.name.toUpperCase()}</h1>
        </div>

        {/* Error notification */}
        {error && (
          <div className="profile-error-banner">
            <p>{error}</p>
          </div>
        )}

        {/* Profile fields */}
        <div className="profile-fields">
          {/* Email field (read-only, no edit button) */}
          <div className="profile-field">
            <label className="field-label">Email</label>
            <div className="field-display">
              <span className="field-value">{userData.email}</span>
            </div>
          </div>

          {/* Name field (editable) */}
          <div className="profile-field">
            <label className="field-label">Name</label>
            <div className="field-display">
              {editingField === 'name' ? (
                <input
                  type="text"
                  className="field-input"
                  value={editValues.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name"
                  autoFocus
                />
              ) : (
                <>
                  <span className="field-value">{userData.name}</span>
                  <button
                    className="btn-edit"
                    onClick={() => handleEditClick('name')}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Phone field (editable) */}
          <div className="profile-field">
            <label className="field-label">Phone</label>
            <div className="field-display">
              {editingField === 'phone' ? (
                <input
                  type="tel"
                  className="field-input"
                  value={editValues.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  autoFocus
                />
              ) : (
                <>
                  <span className="field-value">
                    {userData.phone || 'Not provided'}
                  </span>
                  <button
                    className="btn-edit"
                    onClick={() => handleEditClick('phone')}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Logout button */}
          <div className="profile-logout-section">
            <button
              className="btn-logout"
              onClick={() => setShowLogoutModal(true)}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Save/Cancel buttons (visible when editing) */}
        {editingField && (
          <div className="profile-actions">
            <button
              className="btn-secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleSaveChanges}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Logout confirmation modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
};

export default ProfilePage;