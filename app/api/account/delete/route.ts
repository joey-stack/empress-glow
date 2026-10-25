import { NextResponse } from 'next/server';
import { getSessionUser, clearSession } from '@/lib/auth/session';
import { deleteUserAndData, getUserById } from '@/lib/insforge/queries';

export async function POST() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUserById(session.id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Log NDPA erasure request
  console.log(
    `[NDPA 2023 ERASURE] User ${user.id} (${user.email}) requested account and personal data deletion at ${new Date().toISOString()}. Notifying DPO: dpo@empressglowemporium.com`
  );

  // Perform erasure in storage
  await deleteUserAndData(session.id);

  // Terminate session
  await clearSession();

  return NextResponse.json({
    success: true,
    message: 'Your account and personal data have been deleted per NDPA 2023 regulations.',
  });
}
