import { Link } from '@inertiajs/react';
import CategoryCard from '../Components/CategoryCard';
import AppShell from '../Layouts/AppShell';

export default function Home({ heroProducts, categories, stats }) {
    return (
        <AppShell darkHero title="Home">
            <section className="grid gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-14">
                <div className="space-y-8">
                    <span className="inline-flex rounded-full bg-[var(--color-brand)] px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-stone-950">
                        New School Year
                    </span>
                    <div className="space-y-4">
                        <h1 className="max-w-xl text-5xl font-black leading-none text-white md:text-7xl">
                            Get <span className="text-[var(--color-brand)]">Ready</span> to Learn & Grow
                        </h1>
                        <p className="max-w-lg text-lg text-stone-400">
                            Everything your campus needs in one modern school store, from premium notebooks and calculators to backpacks and art supplies.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Link className="btn-primary" href="/products">
                            Shop Now
                        </Link>
                        <Link className="btn-ghost border-stone-700 text-stone-200" href="/products">
                            Browse All
                        </Link>
                    </div>
                    <div className="grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
                        <div>
                            <p className="text-4xl font-black text-white">{stats.products}+</p>
                            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Products</p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-white">{stats.rating}★</p>
                            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Rating</p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-white">{stats.delivery}</p>
                            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Delivery</p>
                        </div>
                    </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                    {heroProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className={`overflow-hidden rounded-[28px] bg-white/10 ${
                                index === 0 ? 'md:col-span-2 md:aspect-[1.65/1]' : 'aspect-[0.95/1]'
                            }`}
                        >
                            <img className="h-full w-full object-cover" src={product.imageUrl} alt={product.name} />
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-[34px] bg-white p-6 text-stone-900 sm:p-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black">Shop by Category</h2>
                    <Link className="text-sm font-semibold text-blue-600" href="/products">
                        View all →
                    </Link>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            </section>
        </AppShell>
    );
}
