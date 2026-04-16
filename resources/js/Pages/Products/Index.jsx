import { useState } from 'react';
import CategoryCard from '../../Components/CategoryCard';
import ProductCard from '../../Components/ProductCard';
import AppShell from '../../Layouts/AppShell';

export default function ProductsIndex({ products, categories }) {
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredProducts = products.filter((product) => {
        const matchesQuery = [product.name, product.subtitle, product.category.name].join(' ').toLowerCase().includes(query.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category.slug === selectedCategory;

        return matchesQuery && matchesCategory;
    });

    return (
        <AppShell title="Products">
            <section className="space-y-10">
                <div>
                    <h1 className="text-4xl font-black text-stone-950">All Products</h1>
                    <p className="mt-3 max-w-2xl text-sm text-stone-500">A curated catalog of school supplies, campus essentials, and study-ready accessories.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>

                <div className="flex flex-col gap-4 rounded-3xl bg-[#eef0ff] p-4 md:flex-row md:items-center md:justify-between">
                    <input
                        className="field-input bg-white md:max-w-xl"
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search supplies..."
                        value={query}
                    />
                    <select className="field-input bg-white md:max-w-xs" onChange={(event) => setSelectedCategory(event.target.value)} value={selectedCategory}>
                        <option value="all">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.slug}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        </AppShell>
    );
}
