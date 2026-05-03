import { supabase } from "../config/supabase.js";
const ClientModel = {
  /**
   * Create a new client linked to a specific astrologer
   */
  async create(clientData, astrologerId) {
    const { name, dob, tob, pob, lat, lon, tz, primaryConcern } = clientData;
    
    const { data, error } = await supabase
      .from('clients')
      .insert([{ 
        name, 
        dob, 
        tob, 
        pob, 
        lat, 
        lon, 
        tz, 
        primary_concern: primaryConcern,
        astrologer_id: astrologerId 
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch all clients belonging to a specific astrologer
   */
  async findAllByAstrologer(astrologerId) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('astrologer_id', astrologerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Fetch single client with their analysis history
   */
  async findById(clientId, astrologerId) {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        analysis_history (*)
      `)
      .eq('id', clientId)
      .eq('astrologer_id', astrologerId) // Security: Ensure this astrologer owns this client
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a client
   */
  async delete(clientId, astrologerId) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId)
      .eq('astrologer_id', astrologerId);

    if (error) throw error;
    return true;
  },

  async update(clientId, updateData, astrologerId) {
    const { data, error } = await supabase
      .from('clients')
      .update({
        name: updateData.name,
        dob: updateData.dob,
        tob: updateData.tob,
        pob: updateData.pob,
        primary_concern: updateData.primaryConcern,
        // Add other fields you want to allow editing
      })
      .eq('id', clientId)
      .eq('astrologer_id', astrologerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

};


export default ClientModel;