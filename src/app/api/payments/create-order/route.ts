import { NextRequest, NextResponse } from 'next/server';

/**
 * Razorpay Order Creation API
 * Generates an authentic cryptographically signed order on Razorpay for live payments.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, plan_tier, client_name, client_email } = body;

    const keyId = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay keys not configured on server' },
        { status: 500 }
      );
    }

    const orderAmount = Math.round(Number(amount) * 100); // Amount in paise (e.g. ₹299 -> 29900 paise)

    // Call Razorpay Orders API
    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        amount: orderAmount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          plan_tier: plan_tier || 'MONTHLY_PRO',
          client_name: client_name || 'Studio Owner',
          client_email: client_email || 'studio@proofpix.in',
        },
      }),
    });

    if (!razorpayRes.ok) {
      const errData = await razorpayRes.json();
      console.error('[Razorpay Order Creation Error]:', errData);
      return NextResponse.json(
        { error: errData.error?.description || 'Failed to create Razorpay order' },
        { status: razorpayRes.status }
      );
    }

    const orderData = await razorpayRes.json();
    return NextResponse.json({
      success: true,
      order_id: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      key_id: keyId,
    });
  } catch (error: any) {
    console.error('[API /api/payments/create-order Error]:', error);
    return NextResponse.json(
      { error: 'Internal server error creating Razorpay order' },
      { status: 500 }
    );
  }
}
