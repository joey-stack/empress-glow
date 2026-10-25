import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { getUserById, getUserAddresses, getOrdersByCustomerEmail } from '@/lib/insforge/queries';
import { AccountDashboard } from '@/components/account/account-dashboard';

export const instant = false;

export default async function AccountPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect('/login');
  }

  const user = await getUserById(session.id);
  if (!user) {
    redirect('/login');
  }

  const addresses = await getUserAddresses(user.id);
  const orders = await getOrdersByCustomerEmail(user.email);

  return (
    <div className="min-h-screen bg-[#faf9f7] py-8">
      <AccountDashboard
        initialUser={{
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          created_at: user.created_at,
          ndpa_consent_at: user.ndpa_consent_at,
        }}
        initialAddresses={addresses}
        initialOrders={orders}
      />
    </div>
  );
}
