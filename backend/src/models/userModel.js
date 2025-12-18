import supabase from "../config/supabaseClient.js";

const UserModel = { 

  async insertUser(uuid, email, full_name, role) {
    const { data, error } = await supabase.from('users').insert([{
        uuid,
        email,
        full_name, 
        role, 
        status: false, 
      }])
      .select()
      .single();
    
    if (error) {
      console.error("[insertUser] Error:", error);
    } else {
      console.log("[insertUser] Success:", data);
    }
    
    return { data, error };
  }, 

  async findByEmail(email) {
    
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single();

    if (error) {
      return null;
    }
    
    return data;
  },

  async findById(uuid) {
    
    const { data, error } = await supabase.from("users").select("*").eq("uuid", uuid).single();

    if (error) {
      
      // If error is "not found" (PGRST116), return null instead of throwing
      if (error.code === 'PGRST116') {
        return null;
      }
      
      throw new Error(`Database error: ${error.message}`);
    }
    
    return data;
  },

  async getUsers(filter = {}) {

    let query = supabase.from("users").select("*");

    // Dynamically apply filters
    Object.entries(filter).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Supabase error: ${error.message}. Code: ${error.code}`);
    }

    return data;
  },

  async getAllUsers() {
    return await this.getUsers({});
  },

  async updateUserStatus(uuid, status) {
    
    const { data, error } = await supabase
      .from("users")
      .update({ status })
      .eq("uuid", uuid)
      .select()
      .single();

    if (error) {
      console.error("[updateUserStatus] Error:", error);
    } else {
      console.log("[updateUserStatus] Success:", data);
    }

    return { data, error };
  },

  async updateUserRole(uuid, role) {

    const { data, error } = await supabase
      .from("users")
      .update({ role })
      .eq("uuid", uuid)
      .select()
      .single();

    if (error) {
      console.error("[updateUserRole] Error:", error);
    } else {
      console.log("[updateUserRole] Success:", data);
    }

    return { data, error };
  },

  async deleteUser(uuid) {
    
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("uuid", uuid);

    if (error) {
      console.error("[deleteUser] Error:", error);
    } else {
      console.log("[deleteUser] Success");
    }

    return { data, error };
  }
  
};

export default UserModel;
