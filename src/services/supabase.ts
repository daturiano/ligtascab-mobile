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

export const fetchTricycleDetails = async (tricycle_id: string) => {
  const { data, error } = await supabase
    .from('tricycles')
    .select('*')
    .eq('id', tricycle_id)
    .maybeSingle();

  return { data, error };
};

export const fetchDriverDetails = async (driver_id: string) => {
  const { data, error } = await supabase.from('drivers').select('*').eq('id', driver_id).single();

  return { data, error };
};

export const fetchOperatorDetails = async (operator_id: string) => {
  const { data, error } = await supabase
    .from('operators')
    .select('*')
    .eq('id', operator_id)
    .single();

  return { data, error };
};
