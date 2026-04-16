import { Link, router } from '@inertiajs/react';
import CartSummary from '../../Components/CartSummary';
import EmptyState from '../../Components/EmptyState';
import { formatPeso } from '../../lib/format';
import AppShell from '../../Layouts/AppShell';

export default function CartIndex({ items, summary }) {
    if (!items.length) {
        return (
            <AppShell title="Cart">
                <h1 className="mb-8 text-5xl font-black">Shopping Cart</h1>
                <EmptyState
                    action={
                        <Link className="btn-primary" href="/products">
                            Browse Products
                        </Link>
                    }
                    description="Start adding school essentials so you can review everything here before checkout."
                    icon="🛒"
                    title="Your cart is empty."
                />
            </AppShell>
        );
    }

    return (
        <AppShell title="Cart">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
                <div className="space-y-4">
                    <h1 className="text-5xl font-black">Shopping Cart</h1>
                    {items.map((item) => (
                        <div key={item.id} className="card-panel flex flex-col gap-5 p-5 md:flex-row md:items-center">
                            <img className="h-28 w-28 rounded-3xl object-cover" src={item.imageUrl} alt={item.name} />
                            <div className="flex-1">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">{item.category}</p>
                                <h2 className="mt-1 text-2xl font-black">{item.name}</h2>
                                <p className="mt-1 text-sm text-stone-500">{item.subtitle}</p>
                                <p className="mt-3 text-lg font-semibold text-stone-950">{formatPeso(item.price)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    className="h-10 w-10 rounded-full border border-stone-300"
                                    onClick={() => router.patch(`/cart/items/${item.id}`, { quantity: item.quantity - 1 })}
                                    type="button"
                                >
                                    −
                                </button>
                                <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                                <button
                                    className="h-10 w-10 rounded-full border border-stone-300"
                                    onClick={() => router.patch(`/cart/items/${item.id}`, { quantity: item.quantity + 1 })}
                                    type="button"
                                >
                                    +
                                </button>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-black">{formatPeso(item.lineTotal)}</p>
                                <button className="mt-3 text-sm font-semibold text-red-500" onClick={() => router.delete(`/cart/items/${item.id}`)} type="button">
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <CartSummary buttonLabel="Proceed to Checkout" dark onClick={() => router.get('/checkout')} summary={summary} />
                </div>
            </div>
        </AppShell>
    );
}
