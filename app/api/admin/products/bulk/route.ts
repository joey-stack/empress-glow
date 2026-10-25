import { NextRequest, NextResponse } from 'next/server';
import { getProducts, updateProduct, deleteProduct, getProductVariants, updateProductVariant, createAuditLog } from '@/lib/insforge/queries';
import { requireAdminPermission } from '@/lib/auth/admin-guard';

export async function POST(req: NextRequest) {
  try {
    const authCheck = await requireAdminPermission('bulk_edit_products', req);
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json().catch(() => null);

    if (!body || !Array.isArray(body.ids) || body.ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please select at least one formulation to perform bulk action.' },
        { status: 400 }
      );
    }

    const { ids, action, payload = {} } = body;
    const allProducts = await getProducts();
    const targetProducts = allProducts.filter((p) => ids.includes(p.id));

    if (targetProducts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No matching products found.' },
        { status: 404 }
      );
    }

    let updatedCount = 0;

    switch (action) {
      case 'update_status': {
        if (!payload.status || !['draft', 'active', 'archived'].includes(payload.status)) {
          return NextResponse.json(
            { success: false, error: 'Invalid product status provided.' },
            { status: 400 }
          );
        }
        for (const product of targetProducts) {
          await updateProduct(product.id, { status: payload.status });
          updatedCount++;
        }
        break;
      }

      case 'update_vendor': {
        if (!payload.vendor) {
          return NextResponse.json(
            { success: false, error: 'Please provide a vendor brand name.' },
            { status: 400 }
          );
        }
        for (const product of targetProducts) {
          await updateProduct(product.id, { vendor: payload.vendor.trim() });
          updatedCount++;
        }
        break;
      }

      case 'update_category': {
        if (!payload.category) {
          return NextResponse.json(
            { success: false, error: 'Please provide a category.' },
            { status: 400 }
          );
        }
        for (const product of targetProducts) {
          await updateProduct(product.id, { category: payload.category.trim() });
          updatedCount++;
        }
        break;
      }

      case 'adjust_price': {
        const type = payload.priceAdjustmentType || payload.type || 'percent';
        const rawVal = payload.priceAdjustmentValue !== undefined ? payload.priceAdjustmentValue : payload.value;
        const val = Number(rawVal);
        if (isNaN(val) || val === 0) {
          return NextResponse.json(
            { success: false, error: 'Please specify a valid numeric adjustment value.' },
            { status: 400 }
          );
        }
        const priceAdjustmentType = type;

        for (const product of targetProducts) {
          let newPrice = product.price;
          if (priceAdjustmentType === 'percent') {
            newPrice = Math.round(product.price * (1 + val / 100));
          } else {
            newPrice = Math.round(product.price + val);
          }
          newPrice = Math.max(500, newPrice); // minimum price threshold

          await updateProduct(product.id, { price: newPrice });

          // Also adjust variant prices proportionally if variants exist
          const variants = await getProductVariants(product.id);
          for (const variant of variants) {
            let newVariantPrice = variant.price;
            if (priceAdjustmentType === 'percent') {
              newVariantPrice = Math.round(variant.price * (1 + val / 100));
            } else {
              newVariantPrice = Math.round(variant.price + val);
            }
            newVariantPrice = Math.max(500, newVariantPrice);
            await updateProductVariant(variant.id, { price: newVariantPrice });
          }

          updatedCount++;
        }
        break;
      }

      case 'delete': {
        for (const product of targetProducts) {
          await deleteProduct(product.id);
          updatedCount++;
        }
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unsupported bulk action: ${action}` },
          { status: 400 }
        );
    }

    // Record audit trail
    await createAuditLog({
      actor: authCheck.actor,
      action: `product.bulk_${action}`,
      category: 'catalog',
      target_type: 'product',
      summary: `Bulk action '${action}' applied to ${updatedCount} formulation(s)`,
      details: {
        action,
        payload,
        affected_product_ids: ids,
        updated_count: updatedCount,
      },
    });

    const refreshedProducts = await getProducts();

    return NextResponse.json({
      success: true,
      updatedCount,
      message: `Successfully updated ${updatedCount} formulation(s).`,
      products: refreshedProducts,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Bulk update processing failed.' },
      { status: 500 }
    );
  }
}
