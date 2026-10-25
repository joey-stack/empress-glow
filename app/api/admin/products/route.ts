import { NextResponse } from 'next/server';
import {
  getProducts,
  getProductVariants,
  updateProduct,
  updateProductVariant,
  createProduct,
  deleteProduct,
} from '@/lib/insforge/queries';

export async function GET() {
  const products = await getProducts();
  const productsWithVariants = await Promise.all(
    products.map(async (p) => {
      const variants = await getProductVariants(p.id);
      return {
        ...p,
        variants,
      };
    })
  );

  return NextResponse.json({ products: productsWithVariants });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      vendor,
      description,
      price,
      compare_at_price,
      cost_per_item,
      sku,
      category,
      stock,
      images,
      ingredients,
      status,
      variants,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    if (price === undefined || isNaN(Number(price))) {
      return NextResponse.json({ error: 'Valid regular price is required' }, { status: 400 });
    }

    const newProduct = await createProduct({
      name,
      slug,
      vendor: vendor || 'Empress Glow',
      description: description || '',
      price: Number(price),
      compare_at_price: compare_at_price ? Number(compare_at_price) : undefined,
      cost_per_item: cost_per_item ? Number(cost_per_item) : undefined,
      sku,
      category: category || 'skincare',
      stock: Number(stock) || 0,
      images: Array.isArray(images) && images.length > 0 ? images : ['/images/fruity-soap-hero.jpg'],
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      status: status || 'active',
      variants: Array.isArray(variants) ? variants : undefined,
    });

    const createdVariants = await getProductVariants(newProduct.id);

    return NextResponse.json({
      success: true,
      product: {
        ...newProduct,
        variants: createdVariants,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      vendor,
      status,
      description,
      price,
      compare_at_price,
      cost_per_item,
      sku,
      category,
      stock,
      images,
      ingredients,
      variants,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (vendor !== undefined) updates.vendor = vendor;
    if (status !== undefined) updates.status = status;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = Number(price);
    if (compare_at_price !== undefined) updates.compare_at_price = Number(compare_at_price);
    if (cost_per_item !== undefined) updates.cost_per_item = Number(cost_per_item);
    if (sku !== undefined) updates.sku = sku;
    if (category !== undefined) updates.category = category;
    if (stock !== undefined) updates.stock = Number(stock);
    if (images !== undefined) updates.images = images;
    if (ingredients !== undefined) updates.ingredients = ingredients;

    const updatedProduct = await updateProduct(id, updates);
    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Update variants if provided
    if (Array.isArray(variants)) {
      for (const v of variants) {
        if (v.id) {
          await updateProductVariant(v.id, {
            name: v.name !== undefined ? v.name : undefined,
            price: v.price !== undefined ? Number(v.price) : undefined,
            stock: v.stock !== undefined ? Number(v.stock) : undefined,
            sku: v.sku !== undefined ? v.sku : undefined,
          });
        }
      }
    }

    const updatedVariants = await getProductVariants(id);

    return NextResponse.json({
      success: true,
      product: {
        ...updatedProduct,
        variants: updatedVariants,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const ok = await deleteProduct(id);
    if (!ok) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete product' }, { status: 500 });
  }
}
