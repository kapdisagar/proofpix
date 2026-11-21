import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Production Razorpay HMAC SHA256 Signature Verification
 * Ensures payments cannot be spoofed or faked on the frontend.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      project_id 
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required Razorpay verification parameters' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'demo_secret_key_proofpix';

    // Generate expected cryptographic signature
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isAuthentic = 
      generatedSignature === razorpay_signature || 
      process.env.NODE_ENV === 'development'; // allow testing in dev

    if (!isAuthentic) {
      console.warn('[Security Warning]: Razorpay signature mismatch attempt rejected.');
      return NextResponse.json(
        { error: 'Invalid payment signature. Payment verification failed.' },
        { status: 400 }
      );
    }

    // Success - Payment verified cryptographically
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully. Gallery unlocked.',
      payment_id: razorpay_payment_id,
      verified_at: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[API /api/payments/verify Error]:', error);
    return NextResponse.json(
      { error: 'Internal payment verification error' },
      { status: 500 }
    );
  }
}
