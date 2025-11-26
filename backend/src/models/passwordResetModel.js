import supabase from "../config/supabaseClient.js";

const PasswordResetModel = {
  
  /**
   * Create a new password reset request
   * @param {string} uuid - User UUID
   * @param {string} email - User email
   * @param {string} newPassword - New password (will be encrypted by Supabase on approval)
   * @returns {object} - Created request data
   */
  async createResetRequest(uuid, email, newPassword) {
    console.log("[createResetRequest] Creating password reset request for:", email);
    
    const { data, error } = await supabase
      .from('password_reset_requests')
      .insert([{
        user_uuid: uuid,
        email: email,
        new_password: newPassword,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error("[createResetRequest] Error:", error);
      throw new Error(`Failed to create reset request: ${error.message}`);
    }
    
    console.log("[createResetRequest] Success:", data);
    return data;
  },

  /**
   * Get all pending password reset requests
   * @returns {array} - Array of pending requests
   */
  async getPendingRequests() {
    console.log("[getPendingRequests] Fetching pending password reset requests");
    
    const { data, error } = await supabase
      .from('password_reset_requests')
      .select(`
        *,
        users (
          full_name,
          role
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("[getPendingRequests] Error:", error);
      throw new Error(`Failed to fetch pending requests: ${error.message}`);
    }
    
    console.log(`[getPendingRequests] Found ${data.length} pending requests`);
    return data;
  },

  /**
   * Update password reset request status
   * @param {number} requestId - Request ID
   * @param {string} status - New status (approved/rejected)
   * @returns {object} - Updated request data
   */
  async updateRequestStatus(requestId, status) {
    console.log("[updateRequestStatus] Updating request:", { requestId, status });
    
    const { data, error } = await supabase
      .from('password_reset_requests')
      .update({ 
        status,
        processed_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single();
    
    if (error) {
      console.error("[updateRequestStatus] Error:", error);
      throw new Error(`Failed to update request status: ${error.message}`);
    }
    
    console.log("[updateRequestStatus] Success:", data);
    return data;
  },

  /**
   * Get password reset request by ID
   * @param {number} requestId - Request ID
   * @returns {object} - Request data
   */
  async getRequestById(requestId) {
    console.log("[getRequestById] Fetching request:", requestId);
    
    const { data, error } = await supabase
      .from('password_reset_requests')
      .select('*')
      .eq('id', requestId)
      .single();
    
    if (error) {
      console.error("[getRequestById] Error:", error);
      throw new Error(`Failed to fetch request: ${error.message}`);
    }
    
    console.log("[getRequestById] Success:", data);
    return data;
  },

  /**
   * Check if user has a pending reset request
   * @param {string} uuid - User UUID
   * @returns {object|null} - Pending request or null
   */
  async findPendingRequestByUser(uuid) {
    console.log("[findPendingRequestByUser] Checking for pending request:", uuid);
    
    const { data, error } = await supabase
      .from('password_reset_requests')
      .select('*')
      .eq('user_uuid', uuid)
      .eq('status', 'pending')
      .maybeSingle();
    
    if (error) {
      console.error("[findPendingRequestByUser] Error:", error);
      return null;
    }
    
    console.log("[findPendingRequestByUser] Result:", data ? 'Found' : 'None');
    return data;
  },

  /**
   * Delete a password reset request
   * @param {number} requestId - Request ID
   */
  async deleteRequest(requestId) {
    console.log("[deleteRequest] Deleting request:", requestId);
    
    const { error } = await supabase
      .from('password_reset_requests')
      .delete()
      .eq('id', requestId);
    
    if (error) {
      console.error("[deleteRequest] Error:", error);
      throw new Error(`Failed to delete request: ${error.message}`);
    }
    
    console.log("[deleteRequest] Success");
  }
};

export default PasswordResetModel;

