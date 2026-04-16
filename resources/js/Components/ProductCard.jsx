import { router } from '@inertiajs/react';
import { formatPeso } from '../lib/format';

export default function ProductCard({ product }) {
    const outOfStock = product.stock < 1;

    return (
        <article className="card-panel overflow-hidden rounded-[26px]">
            <div className="aspect-[5/4] overflow-hidden bg-stone-100">
                <img className="h-full w-full object-cover" src={product.imageUrl} alt={product.name} />
            </div>
            <div className="space-y-3 p-4">
                <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-400">
                        {product.category.name}
                    </p>
                    <h3 className="text-lg font-bold text-stone-900">{product.name}</h3>
                    <p className="text-sm text-stone-500">{product.subtitle}</p>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-2xl font-black text-stone-950">{formatPeso(product.price)}</p>
                        <p className="text-xs text-stone-400">{product.stock} in stock</p>
                    </div>
                    <button
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${outOfStock ? 'bg-stone-300' : 'bg-stone-950'}`}
                        disabled={outOfStock}
                        onClick={() => router.post('/cart/items', { product_id: product.id, quantity: 1 })}
                        type="button"
                    >
                        +
                    </button>
                </div>
            </div>
        </article>
    );
}
