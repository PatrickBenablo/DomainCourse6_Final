import { useEffect, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import FormField from '../../Components/FormField';
import { formatPeso } from '../../lib/format';
import AppShell from '../../Layouts/AppShell';

const initialForm = {
    category_id: '',
    name: '',
    sku: '',
    subtitle: '',
    description: '',
    price: 0,
    stock: 0,
    image_url: '',
    is_featured: false,
    rating: 4.9,
};

export default function AdminDashboard({ stats, categories, products, orders }) {
    const [editingProduct, setEditingProduct] = useState(null);
    const form = useForm(initialForm);

    useEffect(() => {
        if (editingProduct) {
            form.setData({
                category_id: editingProduct.categoryId,
                name: editingProduct.name,
                sku: editingProduct.sku,
                subtitle: editingProduct.subtitle ?? '',
                description: editingProduct.description ?? '',
                price: editingProduct.price,
                stock: editingProduct.stock,
                image_url: editingProduct.imageUrl,
                is_featured: editingProduct.isFeatured,
                rating: editingProduct.rating,
            });
        } else {
            form.setData(initialForm);
        }
    }, [editingProduct]);

    const submit = (event) => {
        event.preventDefault();

        if (editingProduct) {
            form.put(`/admin/products/${editingProduct.id}`, {
                onSuccess: () => setEditingProduct(null),
            });
            return;
        }

        form.post('/admin/products', {
            onSuccess: () => form.setData(initialForm),
        });
    };

    return (
        <AppShell title="Admin">
            <div className="space-y-8">
                <div>
                    <h1 className="text-5xl font-black">Admin Dashboard</h1>
                    <p className="mt-3 text-sm text-stone-500">Manage inventory, review recent orders, and keep the school store catalog fresh.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {[
                        ['Total Sales', formatPeso(stats.totalSales)],
                        ['Total Orders', stats.totalOrders],
                        ['Customers', stats.customers],
                        ['Low Stock', stats.lowStock],
                    ].map(([label, value], index) => (
                        <div key={label} className={`card-panel p-5 ${index === 0 ? 'border-l-4 border-l-blue-500' : index === 1 ? 'border-l-4 border-l-emerald-500' : index === 2 ? 'border-l-4 border-l-yellow-500' : 'border-l-4 border-l-rose-500'}`}>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">{label}</p>
                            <p className="mt-3 text-4xl font-black">{value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
                    <form className="card-panel space-y-4 p-6" onSubmit={submit}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                            {editingProduct ? (
                                <button className="text-sm font-semibold text-stone-500" onClick={() => setEditingProduct(null)} type="button">
                                    Cancel
                                </button>
                            ) : null}
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="block">
                                <span className="field-label">Category</span>
                                <select className="field-input" onChange={(e) => form.setData('category_id', e.target.value)} value={form.data.category_id}>
                                    <option value="">Select category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <FormField error={form.errors.sku} label="SKU" onChange={(e) => form.setData('sku', e.target.value)} value={form.data.sku} />
                            <FormField className="md:col-span-2" error={form.errors.name} label="Product Name" onChange={(e) => form.setData('name', e.target.value)} value={form.data.name} />
                            <FormField className="md:col-span-2" error={form.errors.subtitle} label="Subtitle" onChange={(e) => form.setData('subtitle', e.target.value)} value={form.data.subtitle} />
                            <FormField className="md:col-span-2 min-h-24 resize-none" error={form.errors.description} label="Description" as="textarea" onChange={(e) => form.setData('description', e.target.value)} value={form.data.description} />
                            <FormField error={form.errors.price} label="Price" onChange={(e) => form.setData('price', e.target.value)} type="number" value={form.data.price} />
                            <FormField error={form.errors.stock} label="Stock" onChange={(e) => form.setData('stock', e.target.value)} type="number" value={form.data.stock} />
                            <FormField className="md:col-span-2" error={form.errors.image_url} label="Image URL" onChange={(e) => form.setData('image_url', e.target.value)} value={form.data.image_url} />
                            <FormField error={form.errors.rating} label="Rating" onChange={(e) => form.setData('rating', e.target.value)} step="0.1" type="number" value={form.data.rating} />
                            <label className="flex items-center gap-3 pt-7">
                                <input checked={form.data.is_featured} onChange={(e) => form.setData('is_featured', e.target.checked)} type="checkbox" />
                                <span className="text-sm font-semibold text-stone-700">Feature this product</span>
                            </label>
                        </div>
                        <button className="btn-dark w-full" disabled={form.processing} type="submit">
                            {editingProduct ? 'Update Product' : 'Create Product'}
                        </button>
                    </form>

                    <div className="space-y-8">
                        <div className="card-panel overflow-hidden">
                            <div className="border-b border-stone-200 p-6">
                                <h2 className="text-3xl font-black">Product Management</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-stone-950 text-xs uppercase tracking-[0.22em] text-white">
                                        <tr>
                                            <th className="px-5 py-4">Product</th>
                                            <th className="px-5 py-4">Category</th>
                                            <th className="px-5 py-4">Price</th>
                                            <th className="px-5 py-4">Stock</th>
                                            <th className="px-5 py-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id} className="border-t border-stone-100">
                                                <td className="px-5 py-4 font-semibold">{product.name}</td>
                                                <td className="px-5 py-4">{product.category}</td>
                                                <td className="px-5 py-4">{formatPeso(product.price)}</td>
                                                <td className="px-5 py-4">{product.stock}</td>
                                                <td className="px-5 py-4">
                                                    <div className="flex gap-2">
                                                        <button className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600" onClick={() => setEditingProduct(product)} type="button">
                                                            Edit
                                                        </button>
                                                        <button className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600" onClick={() => router.delete(`/admin/products/${product.id}`)} type="button">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="card-panel overflow-hidden">
                            <div className="border-b border-stone-200 p-6">
                                <h2 className="text-3xl font-black">Recent Orders</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-stone-950 text-xs uppercase tracking-[0.22em] text-white">
                                        <tr>
                                            <th className="px-5 py-4">Order ID</th>
                                            <th className="px-5 py-4">Customer</th>
                                            <th className="px-5 py-4">Items</th>
                                            <th className="px-5 py-4">Total</th>
                                            <th className="px-5 py-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id} className="border-t border-stone-100">
                                                <td className="px-5 py-4">{order.orderNumber}</td>
                                                <td className="px-5 py-4 font-semibold">{order.customer}</td>
                                                <td className="px-5 py-4 text-stone-500">{order.items}</td>
                                                <td className="px-5 py-4">{formatPeso(order.total)}</td>
                                                <td className="px-5 py-4">
                                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        order.status === 'completed'
                                                            ? 'bg-emerald-50 text-emerald-600'
                                                            : order.status === 'shipped'
                                                              ? 'bg-blue-50 text-blue-600'
                                                              : 'bg-yellow-50 text-yellow-700'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
