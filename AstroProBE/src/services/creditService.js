import { supabase } from '../config/supabase.js';

export const CreditService = {
  // Check if user has enough credits
  async hasEnoughCredits(userId, requiredAmount = 1) {
    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (error || !data) return false;
    return data.credits >= requiredAmount;
  },

  // Deduct credits after a successful analysis
  async deductCredits(userId, amount = 1) {
    const { data, error } = await supabase.rpc('deduct_user_credits', {
      user_id: userId,
      amount: amount
    });
    
    if (error) throw new Error("Credit deduction failed");
    return data;
  }
};