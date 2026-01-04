import { Commuter, Ride } from '../types';
import { getCurrentLocation } from '../utils/locationService';

const POLICE_HOTLINE = '639391248392';

type EmergencyContact = {
  name: string;
  phone: string;
};

export type EmergencyAlertResult = {
  success: boolean;
  notifiedContacts: EmergencyContact[];
  error?: string;
};

export async function sendEmergencyAlert(
  user: Commuter,
  rideDetails: Ride | null
): Promise<EmergencyAlertResult> {
  try {
    const location = await getCurrentLocation();

    if (!location) {
      return {
        success: false,
        notifiedContacts: [],
        error: 'Unable to get current location',
      };
    }

    const rideInfo = rideDetails
      ? ` Vehicle: ${rideDetails.tricycle_details.plate_number}, Driver: ${rideDetails.driver_details.first_name} ${rideDetails.driver_details.last_name}.`
      : '';

    // Using goo.gl short format - less likely to be blocked by carriers
    const mapLink = `goo.gl/maps?q=${location.latitude},${location.longitude}`;
    const emergencyMessage = `EMERGENCY! ${user.first_name} ${user.last_name} (${user.phone_number}) needs help.${rideInfo} Location: ${mapLink}`;

    console.log('Sending emergency message:', emergencyMessage);

    const contacts: EmergencyContact[] = [
      { name: 'Police Hotline', phone: POLICE_HOTLINE },
    ];

    if (user.contact_person && user.contact_person_number) {
      contacts.push({
        name: user.contact_person,
        phone: user.contact_person_number,
      });
    }

    // Send SMS to all contacts
    const sendPromises = contacts.map((contact) =>
      sendSMS(contact.phone, emergencyMessage)
    );

    await Promise.all(sendPromises);

    return {
      success: true,
      notifiedContacts: contacts,
    };
  } catch (error) {
    console.error('Emergency alert failed:', error);
    return {
      success: false,
      notifiedContacts: [],
      error: 'Failed to send emergency alert',
    };
  }
}

export async function sendSafetyConfirmation(
  user: Commuter
): Promise<{ success: boolean; error?: string }> {
  try {
    const safeMessage = `SAFETY UPDATE\n\n${user.first_name} ${user.last_name} has confirmed they are safe. The emergency has been resolved.\n\nThank you for your concern.`;

    const contacts: string[] = [POLICE_HOTLINE];

    if (user.contact_person_number) {
      contacts.push(user.contact_person_number);
    }

    const sendPromises = contacts.map((phone) => sendSMS(phone, safeMessage));
    await Promise.all(sendPromises);

    return { success: true };
  } catch (error) {
    console.error('Safety confirmation failed:', error);
    return { success: false, error: 'Failed to send safety confirmation' };
  }
}

async function sendSMS(phone: string, message: string): Promise<void> {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

  console.log('Sending SMS to:', phone);
  console.log('Message length:', message.length);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const res = await fetch(
      `${supabaseUrl}/functions/v1/send-emergency-sms`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ phone, message }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    const data = await res.json();
    console.log('SMS API response:', JSON.stringify(data));

    if (!res.ok) {
      console.error('SMS error response:', data);
      throw new Error(`SMS sending failed: ${data.error || res.status}`);
    }

    return data;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('SMS request timed out');
      throw new Error('SMS request timed out');
    }
    throw error;
  }
}
