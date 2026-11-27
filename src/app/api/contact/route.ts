import { NextRequest, NextResponse } from 'next/server';

interface ContactTicket {
  id: string;
  name: string;
  email: string;
  phone?: string;
  studio_name?: string;
  category: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  created_at: string;
}

// In-memory support tickets store
const supportTickets: ContactTicket[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, studio_name, category, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please provide your name, email, and message.' },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const ticketId = `TKT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTicket: ContactTicket = {
      id: ticketId,
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || undefined,
      studio_name: studio_name?.trim() || undefined,
      category: category || 'GENERAL_INQUIRY',
      message: message.trim(),
      status: 'OPEN',
      created_at: new Date().toISOString(),
    };

    supportTickets.unshift(newTicket);

    console.log(`[ProofPix Support Desk] New Ticket Logged: ${ticketId} from ${email} (${category})`);

    return NextResponse.json({
      success: true,
      ticket_id: ticketId,
      message: 'Support inquiry received successfully. Our VIP studio desk will respond within 2-4 business hours.',
    });
  } catch (error: any) {
    console.error('[API /api/contact Error]:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact inquiry. Please email support@proofpix.in directly.' },
      { status: 500 }
    );
  }
}
