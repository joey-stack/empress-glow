import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth/session';
import { getUserById, getOrdersByCustomerEmail } from '@/lib/insforge/queries';

export const instant = false;

export default async function OrderHistoryPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect('/login?redirect=/account/orders');
  }

  const user = await getUserById(session.id);
  if (!user) {
    redirect('/login?redirect=/account/orders');
  }

  const orders = await getOrdersByCustomerEmail(user.email);

  return (
    <div className="min-h-screen bg-[#f7f1e8] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-none border border-[#e5dcd0] shadow-none">
          <div>
            <Link href="/account" className="text-xs font-mono uppercase tracking-wider text-[#2d5508] hover:underline">
              ← Back to Account Dashboard
            </Link>
            <h1 className="text-2xl font-serif text-[#131010] mt-1">My Order History</h1>
            <p className="text-xs text-[#7b7366]">Purchases registered to {user.email}</p>
          </div>
          <Link
            href="/products"
            className="bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] text-xs font-mono uppercase tracking-[0.18em] px-4 py-2.5 rounded-none transition-colors border border-[#131010] hover:border-[#2d5508]"
          >
            Formulations
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-none border border-[#e5dcd0] shadow-none space-y-3">
            <span className="text-3xl">📦</span>
            <h2 className="text-lg font-serif text-[#131010]">No Orders Found</h2>
            <p className="text-xs text-[#7b7366]">You haven&apos;t placed any botanical skincare orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusBadge =
                order.status === 'paid'
                  ? 'bg-[#2d5508]/10 text-[#2d5508] border-[#2d5508]/30'
                  : order.status === 'shipped'
                  ? 'bg-[#b88e4e]/10 text-[#b88e4e] border-[#b88e4e]/30'
                  : order.status === 'pending'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-[#faf8f5] text-[#7b7366] border-[#e5dcd0]';

              return (
                <div
                  key={order.id}
                  className="bg-white p-6 rounded-none border border-[#e5dcd0] shadow-none space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-3 border-b border-[#e5dcd0] gap-2">
                    <div>
                      <span className="text-xs font-mono font-medium text-[#131010]">
                        Order #{order.id}
                      </span>
                      <span className="text-xs text-[#7b7366] font-mono ml-3">
                        {new Date(order.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 border rounded-none ${statusBadge}`}>
                        {order.status}
                      </span>
                      <span className="text-base font-mono font-bold text-[#131010]">
                        {`₦${order.total.toLocaleString()}`}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-[#7b7366] space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {item.name} ({item.variantName}) × {item.quantity}
                        </span>
                        <span className="font-mono text-[#131010]">{`₦${(item.price * item.quantity).toLocaleString()}`}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-[#e5dcd0] text-[#7b7366]">
                      <span>Delivery Fee ({order.city})</span>
                      <span className="font-mono">{order.shipping_fee === 0 ? 'FREE' : `₦${order.shipping_fee.toLocaleString()}`}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#e5dcd0] flex flex-wrap justify-between items-center gap-3">
                    <Link
                      href={`/order/${order.id}`}
                      className="text-xs font-mono text-[#2d5508] hover:underline"
                    >
                      View Live Tracking &amp; Receipt →
                    </Link>
                    <a
                      href={`https://wa.me/2348035650299?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20my%20order%20%23${order.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#2d5508] hover:underline font-medium font-mono"
                    >
                      WhatsApp Care Support ↗
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
