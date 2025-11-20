import supabase from "../config/supabaseClient.js";

const UserModel = { 

  async insertUser(uuid, full_name, role) {
    console.log("[insertUser] Inserting user:", { uuid, full_name, role });
    
    const {data, error } = await supabase 
      .from('users')
      .insert([{
        uuid, 
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
    console.log("[findByEmail] Looking up email:", email);
    
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("[findByEmail] Supabase error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return null;
    }
    
    console.log("[findByEmail] User found:", data ? 'Yes' : 'No');
    return data;
  },

  async getUsers(filter = {}) {
    console.log("[getUsers] Fetching users with filter:", filter);

    let query = supabase.from("users").select("*");

    // Dynamically apply filters
    Object.entries(filter).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query;

    if (error) {
      console.error("[getUsers] ❌ Supabase error:", error);
      throw new Error(`Supabase error: ${error.message}. Code: ${error.code}`);
    }

    console.log(`[getUsers] ✅ Fetched ${data.length} users`);
    return data;
  },

  async updateUserStatus(uuid, status) {
    console.log("[updateUserStatus] Updating user:", { uuid, status });
    
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

  async deleteUser(uuid) {
    console.log("[deleteUser] Deleting user:", uuid);
    
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
