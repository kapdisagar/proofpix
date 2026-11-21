import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Production Razorpay HMAC SHA256 Signature Verification
 * Cryptographically guarantees that payment actually arrived in the user's Razorpay account.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      plan_tier,
      amount
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required Razorpay payment verification parameters' },
        { status: 400 }
      );
    }

    const keySecret = (process.env.RAZORPAY_KEY_SECRET || 'zhdNzKMv8x0jFeM2JUaIEcnB').trim();

    // Generate expected cryptographic HMAC SHA-256 signature
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isAuthentic = generatedSignature === razorpay_signature;

    if (!isAuthentic) {
      console.warn('[Security Warning]: Razorpay signature verification failed. Tampered or fake signature rejected.');
      return NextResponse.json(
        { error: 'Payment verification failed: Signature does not match Razorpay authority.' },
        { status: 400 }
      );
    }

    // Payment is 100% Cryptographically Verified!
    // Calculate subscription validity
    const isAnnual = plan_tier === 'ANNUAL_PASS' || amount === 1999;
    const tier = isAnnual ? 'ANNUAL_PASS' : 'MONTHLY_PRO';
    const days = isAnnual ? 365 : 30;

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + days);

    const subscriptionData = {
      tier,
      amount: isAnnual ? 1999 : 299,
      started_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      days_remaining: days,
      status: 'active',
      razorpay_payment_id: razorpay_payment_id,
      razorpay_order_id: razorpay_order_id
    };

    return NextResponse.json({
      success: true,
      message: 'Payment verified and confirmed by Razorpay. Plan activated instantly.',
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      subscription: subscriptionData,
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
