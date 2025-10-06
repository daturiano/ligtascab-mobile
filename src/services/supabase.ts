import { CreateAccount } from '../schemas';
import { supabase } from '../utils/supabase';

export const createAccount = async (accountData: CreateAccount, id: string) => {
  const { data, error } = await supabase
    .from('commuters')
    .update([accountData])
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};
