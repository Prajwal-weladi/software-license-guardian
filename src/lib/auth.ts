import { supabase } from '../integrations/supabase/client';

export const handleEmailConfirmation = async (userId: string, role: 'employer' | 'admin') => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .insert([{ user_id: userId, role }]);

    if (error) {
      console.error('Error assigning role:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to assign role:', error);
    throw error;
  }
}; 