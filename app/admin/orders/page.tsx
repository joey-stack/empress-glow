import { getAllOrders, getProducts, getAllUsers } from '@/lib/insforge/queries';
import { AdminOrdersManager } from '@/components/admin/admin-orders-manager';

export const instant = false;

export default async function AdminOrdersPage() {
  const [orders, products, users] = await Promise.all([
    getAllOrders(),
    getProducts(),
    getAllUsers(),
  ]);

  return (
    <div className="space-y-6">
      <AdminOrdersManager
        initialOrders={orders}
        availableProducts={products}
        registeredCustomers={users}
      />
    </div>
  );
}
