import { NextResponse } from 'next/server';
import { getProducts, getAllOrders, getAllUsers, getSubscribers } from '@/lib/insforge/queries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').trim().toLowerCase();

    const [products, orders, users, subscribers] = await Promise.all([
      getProducts(),
      getAllOrders(),
      getAllUsers(),
      getSubscribers(),
    ]);

    // Quick Navigation Pages
    const allPages = [
      { label: 'Executive Dashboard', href: '/admin', group: 'Navigation', icon: '📊' },
      { label: 'Product Formulations', href: '/admin/products', group: 'Catalog', icon: '🌿' },
      { label: 'Inventory & Stock Matrix', href: '/admin/inventory', group: 'Catalog', icon: '📦' },
      { label: 'Orders & Fulfillment', href: '/admin/orders', group: 'Operations', icon: '🛍️' },
      { label: 'Customers Directory', href: '/admin/customers', group: 'Operations', icon: '👥' },
      { label: 'Waitlist Circle', href: '/admin/subscribers', group: 'Marketing', icon: '✉️' },
      { label: 'Reviews Moderation', href: '/admin/reviews', group: 'Content', icon: '⭐' },
      { label: 'Story & Rituals CMS', href: '/admin/content', group: 'Content', icon: '📝' },
      { label: 'Botanical Journal', href: '/admin/blog', group: 'Content', icon: '📖' },
      { label: 'Marketing Popups', href: '/admin/popups', group: 'Marketing', icon: '📢' },
      { label: 'Staff Accounts & RBAC', href: '/admin/staff', group: 'Settings', icon: '👥' },
      { label: 'Activity & Audit Log', href: '/admin/audit-logs', group: 'Settings', icon: '📜' },
      { label: 'Settings & Regulatory Policies', href: '/admin/settings', group: 'Settings', icon: '⚙️' },
    ];

    // Quick Actions
    const allActions = [
      { label: 'Receive Workshop Production Batch', href: '/admin/inventory', icon: '📦', description: 'Log incoming batch intake from Calabar workshop' },
      { label: 'Create New Formulation', href: '/admin/products?tab=new', icon: '➕', description: 'Add new artisan batch or vendor product' },
      { label: 'Invite Administrator or Auditor', href: '/admin/staff', icon: '👤', description: 'Provision staff account with role permissions' },
      { label: 'Inspect Activity Audit Trail', href: '/admin/audit-logs', icon: '🔍', description: 'View NDPA/NAFDAC chronological mutation logs' },
      { label: 'Open WhatsApp Consultation', href: 'https://wa.me/2348035650299', icon: '💬', description: 'Direct chat with Mary Asuquo on WhatsApp' },
      { label: 'Export Waitlist CSV', href: '/admin/subscribers', icon: '📥', description: `Export ${subscribers.length} verified subscriber leads` },
      { label: 'View Public Storefront', href: '/', icon: '🏪', description: 'Inspect active prelaunch or live customer store' },
    ];

    if (!query) {
      return NextResponse.json({
        pages: allPages,
        actions: allActions,
        products: products.slice(0, 4).map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          stock: p.stock,
          vendor: p.vendor || 'Empress Glow',
          category: p.category,
          image: p.images?.[0] || null,
        })),
        orders: orders.slice(0, 4).map((o) => ({
          id: o.id,
          customer_name: o.customer_name,
          customer_email: o.customer_email,
          customer_phone: o.customer_phone,
          total: o.total,
          status: o.status,
          created_at: o.created_at,
        })),
        customers: users.slice(0, 4).map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
        })),
      });
    }

    // Filter Navigation Pages
    const filteredPages = allPages.filter((p) =>
      p.label.toLowerCase().includes(query) || p.group.toLowerCase().includes(query)
    );

    // Filter Actions
    const filteredActions = allActions.filter((a) =>
      a.label.toLowerCase().includes(query) || a.description.toLowerCase().includes(query)
    );

    // Filter Products
    const filteredProducts = products
      .filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query) ||
        (p.vendor && p.vendor.toLowerCase().includes(query)) ||
        (p.sku && p.sku.toLowerCase().includes(query)) ||
        p.category.toLowerCase().includes(query)
      )
      .slice(0, 6)
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        stock: p.stock,
        vendor: p.vendor || 'Empress Glow',
        category: p.category,
        image: p.images?.[0] || null,
      }));

    // Filter Orders
    const filteredOrders = orders
      .filter((o) =>
        o.id.toLowerCase().includes(query) ||
        o.customer_name.toLowerCase().includes(query) ||
        o.customer_email.toLowerCase().includes(query) ||
        o.customer_phone.includes(query) ||
        (o.paystack_reference && o.paystack_reference.toLowerCase().includes(query))
      )
      .slice(0, 6)
      .map((o) => ({
        id: o.id,
        customer_name: o.customer_name,
        customer_email: o.customer_email,
        customer_phone: o.customer_phone,
        total: o.total,
        status: o.status,
        created_at: o.created_at,
      }));

    // Filter Customers
    const filteredCustomers = users
      .filter((u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.phone.includes(query)
      )
      .slice(0, 6)
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
      }));

    return NextResponse.json({
      pages: filteredPages,
      actions: filteredActions,
      products: filteredProducts,
      orders: filteredOrders,
      customers: filteredCustomers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to perform quick search' },
      { status: 500 }
    );
  }
}
