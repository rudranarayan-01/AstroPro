import { supabase } from '../config/supabase.js';

export const UserModel = {
    async getProfile(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) throw error;
        return data;
    },

    async deductCredits(userId, amount) {
        const { data, error } = await supabase.rpc('deduct_credits', { 
            user_id: userId, 
            amount 
        });
        if (error) throw error;
        return data;
    }
};