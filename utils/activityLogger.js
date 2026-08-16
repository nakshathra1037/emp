import { ActivityLog } from '../models/index.js';

/**
 * Utility to log activities synchronously/asynchronously.
 * Prevents main thread blockage by running inside a try/catch block.
 */
export const logActivity = async (userId, action, details) => {
  try {
    await ActivityLog.create({
      userId: userId || null,
      action,
      details: typeof details === 'object' ? JSON.stringify(details) : details,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Failed to write activity log:', error.message);
  }
};
