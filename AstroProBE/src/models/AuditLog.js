import { supabase } from '../config/supabase.js';

export const AuditLog = {
  async recordAction({ userId, action, status, metadata = {}, error = null }) {
    const { data, error: dbError } = await supabase
      .from('audit_logs')
      .insert([{
        user_id: userId,
        action_type: action,
        status: status,
        metadata: metadata,
        error_message: error
      }]);
    
    if (dbError) console.error("Critical: Audit Log Failed", dbError);
    return data;
  }
};