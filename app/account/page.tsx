import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { getUserByEmail, getUserById, getUserAddresses, getOrdersByCustomerEmail, UserProfile } from '@/lib/insforge/queries';
import { AccountDashboard } from '@/components/account/account-dashboard';

export default async function AccountPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect('/login?redirect=/account');
  }

  let user: UserProfile | null = await getUserById(session.id);
  if (!user && session.email) {
    user = await getUserByEmail(session.email);
  }

  // Fallback profile if authenticated via InsForge BaaS or OAuth
  const activeUser: UserProfile = user || {
    id: session.id,
    email: session.email,
    name: session.name || session.email.split('@')[0],
    phone: '+234 800 000 0000',
    password_hash: '',
    created_at: new Date().toISOString(),
    ndpa_consent_at: new Date().toISOString(),
  };

  const addresses = await getUserAddresses(activeUser.id);
  const orders = await getOrdersByCustomerEmail(activeUser.email);

  return (
    <div className="min-h-screen bg-[#faf9f7] py-8">
      <AccountDashboard
        initialUser={{
          id: activeUser.id,
          email: activeUser.email,
          name: activeUser.name,
          phone: activeUser.phone,
          created_at: activeUser.created_at,
          ndpa_consent_at: activeUser.ndpa_consent_at,
        }}
        initialAddresses={addresses}
        initialOrders={orders}
      />
    </div>
  );
}
