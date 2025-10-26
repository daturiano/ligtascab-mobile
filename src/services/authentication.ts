import { AccountSetupSchema } from '../schemas';
import { supabase } from '../utils/supabase';
import { createAccount } from './db';

export const fetchCommuterDetails = async (id: string) => {
  const { data, error } = await supabase.from('commuters').select('*').eq('id', id).single();

  return { data, error };
};

export async function requestOtp(phone: string) {
  const res = await fetch('https://xlcoxbizbuasgbjzfrlx.supabase.co/functions/v1/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  return res.json();
}

export const registerWithCredentials = async (User: unknown) => {
  const result = AccountSetupSchema.safeParse(User);
  if (!result.success) {
    let errorMessage = '';
    result.error.issues.forEach((issue) => {
      errorMessage = errorMessage + issue.path + ': ' + issue.message + '. ';
    });
    throw new Error(errorMessage);
  }

  if (result.data.password !== result.data.confirm_password) {
    throw new Error('Password does not match.');
  }

  const { data, error: signUpError } = await supabase.auth.signUp({
    phone: result.data.phone,
    password: result.data.password,
    options: {
      data: {
        role: 'commuter',
        name: result.data.fullName,
      },
    },
  });

  if (signUpError) {
    throw new Error(signUpError.message);
  }

  if (!data.user) return null;

  const name = result.data.fullName?.trim() || '';
  const parts = name.split(/\s+/);

  let first_name = '';
  let last_name = '';

  if (parts.length === 1) {
    first_name = parts[0];
    last_name = '';
  } else if (parts.length > 1) {
    first_name = parts.slice(0, -1).join(' ');
    last_name = parts[parts.length - 1];
  }

  const accountData = {
    first_name,
    last_name,
    phone_number: result.data.phone,
    email: result.data.email,
    address: result.data.address,
  };

  const { data: commuter, error: createAccountError } = await createAccount(
    accountData,
    data.user.id
  );

  if (createAccountError) {
    throw new Error(createAccountError.message);
  }

  return commuter;
};
