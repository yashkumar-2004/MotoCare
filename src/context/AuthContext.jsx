import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial users
  const refreshUsers = useCallback(async () => {
    try {
      setLoading(true);
      const users = await apiClient.get('users');
      setAllUsers(users);

      // Check if user was previously selected
      const savedUserId = localStorage.getItem('motocare_active_user_id');
      const matched = users.find((u) => u.id === savedUserId) || users[0];
      setCurrentUser(matched || null);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  // Switch active user (great for testing different roles & long names)
  const switchUser = (userId) => {
    const selected = allUsers.find((u) => u.id === userId);
    if (selected) {
      setCurrentUser(selected);
      localStorage.setItem('motocare_active_user_id', selected.id);
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    if (!currentUser) return;
    const updated = await apiClient.patch('users', currentUser.id, profileData);
    setCurrentUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    return updated;
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        isAdmin,
        loading,
        switchUser,
        updateProfile,
        refreshUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
