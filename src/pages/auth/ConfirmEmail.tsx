import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { handleEmailConfirmation } from '../../lib/auth';

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: searchParams.get('token_hash') || '',
          type: 'email',
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          // Get the role from the URL or default to 'employer'
          const role = searchParams.get('role') as 'employer' | 'admin' || 'employer';
          
          // Assign the role
          await handleEmailConfirmation(data.user.id, role);
          
          // Redirect to login
          navigate('/');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to confirm email');
      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Confirming your email...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ConfirmEmail; 