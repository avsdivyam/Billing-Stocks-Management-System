import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLock, FiMail, FiPhone, FiSave, FiAlertCircle } from 'react-icons/fi';

const Profile = () => {
  const { user, updateProfile, changePassword, error } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  console.log(error);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  
  // Form submission states
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSubmitting(true);
    setProfileSuccess(false);
    setProfileError(null);

    try {
      await updateProfile(user.id, profileForm);
      setProfileSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setProfileSuccess(false);
      }, 3000);
    } catch (err) {
      setProfileError(err.error || 'Failed to update profile');
    } finally {
      setProfileSubmitting(false);
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSubmitting(true);
    setPasswordSuccess(false);
    setPasswordError(null);

    // Validate password match
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('New passwords do not match');
      setPasswordSubmitting(false);
      return;
    }

    try {
      await changePassword(passwordForm.current_password, passwordForm.new_password);
      setPasswordSuccess(true);
      
      // Reset form and success message after 3 seconds
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    } catch (err) {
      setPasswordError(err.error || 'Failed to change password');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tabs */}
      <div className="border-b">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'profile'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'password'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Change Password
          </button>
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h2>
          
          {profileSuccess && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
              Profile updated successfully!
            </div>
          )}
          
          {profileError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
              <FiAlertCircle className="mr-2" />
              {profileError}
            </div>
          )}
          
          <form onSubmit={handleProfileSubmit}>
            <div className="space-y-4">
              {/* Username (read-only) */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={user?.username || ''}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                    disabled
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Username cannot be changed</p>
              </div>
              
              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={profileForm.full_name}
                    onChange={handleProfileChange}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>
              
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              {/* Role (read-only) */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
                  className="block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">Role can only be changed by an administrator</p>
              </div>
              
              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileSubmitting}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {profileSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>
          
          {passwordSuccess && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
              Password changed successfully!
            </div>
          )}
          
          {passwordError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
              <FiAlertCircle className="mr-2" />
              {passwordError}
            </div>
          )}
          
          <form onSubmit={handlePasswordSubmit}>
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="current_password"
                    name="current_password"
                    value={passwordForm.current_password}
                    onChange={handlePasswordChange}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>
              
              {/* New Password */}
              <div>
                <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="new_password"
                    name="new_password"
                    value={passwordForm.new_password}
                    onChange={handlePasswordChange}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    required
                    minLength="8"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
              </div>
              
              {/* Confirm New Password */}
              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    value={passwordForm.confirm_password}
                    onChange={handlePasswordChange}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;