import api from './api';

const backupService = {
  // Create database backup
  createBackup: async (backupType = 'manual') => {
    try {
      const response = await api.post('/backup', { type: backupType });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create backup' };
    }
  },

  // Get all backups
  getAllBackups: async () => {
    try {
      const response = await api.get('/backup');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get backups' };
    }
  },

  // Download backup
  downloadBackup: async (backupId) => {
    try {
      const response = await api.get(`/backup/${backupId}`, {
        responseType: 'blob',
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `backup_${backupId}.sql`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to download backup' };
    }
  },

  // Delete backup
  deleteBackup: async (backupId) => {
    try {
      const response = await api.delete(`/backup/${backupId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete backup' };
    }
  },

  // Restore database from backup
  restoreBackup: async (backupId) => {
    try {
      const response = await api.post('/backup/restore', { backup_id: backupId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to restore backup' };
    }
  },
};

export default backupService;