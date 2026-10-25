import { getMarketingPopups } from '@/lib/insforge/queries';
import { AdminPopupsManager } from '@/components/admin/admin-popups-manager';

export const instant = false;

export default async function AdminPopupsPage() {
  const popups = await getMarketingPopups();

  return (
    <div className="space-y-6">
      <AdminPopupsManager initialPopups={popups} />
    </div>
  );
}
