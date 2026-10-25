import { NextResponse } from 'next/server';
import { getAllOrders, updateOrderFulfillment, getOrderById } from '@/lib/insforge/queries';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status');

  let orders = await getAllOrders();
  if (statusFilter && statusFilter !== 'all') {
    orders = orders.filter((o) => o.status === statusFilter);
  }

  return NextResponse.json({ orders });
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status, tracking_notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Order ID and status required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
    }

    const updated = await updateOrderFulfillment(id, status, tracking_notes);
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update order' }, { status: 500 });
  }
}
