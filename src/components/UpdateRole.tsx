import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UpdateRole: React.FC = () => {
  const { user, updateUserRole } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateRole = async (newRole: 'employer' | 'admin') => {
    try {
      setIsUpdating(true);
      setError(null);
      await updateUserRole(newRole);
      alert(`Role updated successfully to ${newRole}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return <div>Please log in to update your role</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Update Your Role</h2>
      <p className="mb-4">Current role: {user.role}</p>
      
      <div className="space-y-2">
        <button
          onClick={() => handleUpdateRole('admin')}
          disabled={isUpdating}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isUpdating ? 'Updating...' : 'Set as Admin'}
        </button>
        
        <button
          onClick={() => handleUpdateRole('employer')}
          disabled={isUpdating}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 ml-2"
        >
          {isUpdating ? 'Updating...' : 'Set as Employer'}
        </button>
      </div>

      {error && (
        <div className="mt-4 text-red-500">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default UpdateRole; 