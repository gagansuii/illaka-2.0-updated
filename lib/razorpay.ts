import Razorpay from 'razorpay';
import { getEnv } from './config';

let razorpayClient: Razorpay | null = null;

export function isRazorpayConfigured() {
  try {
    // this will throw if either is missing
    getEnv('RAZORPAY_KEY_ID');
    getEnv('RAZORPAY_KEY_SECRET');
    return true;
  } catch {
    return false;
  }
}

export function getRazorpayClient() {
  const keyId = getEnv('RAZORPAY_KEY_ID');
  const keySecret = getEnv('RAZORPAY_KEY_SECRET');

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  }
  return razorpayClient;
}
