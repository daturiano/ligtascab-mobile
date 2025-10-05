import { supabase } from '../utils/supabase';

export const fetchCommuterDetails = async (id: string) => {
  const { data, error } = await supabase.from('commuters').select('*').eq('id', id).single();

  return { data, error };
};
