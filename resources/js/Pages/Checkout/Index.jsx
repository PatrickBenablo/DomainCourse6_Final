import { useForm } from '@inertiajs/react';
import CartSummary from '../../Components/CartSummary';
import FormField from '../../Components/FormField';
import { formatPeso } from '../../lib/format';
import AppShell from '../../Layouts/AppShell';

export default function CheckoutIndex({ items, summary, customer, paymentMethods }) {
    const form = useForm(customer);

    return (
        <AppShell title="Checkout">
            <div className="space-y-8">
                <h1 className="text-5xl font-black">Checkout</h1>
                <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                    <form className="space-y-5" onSubmit={(event) => {
                        event.preventDefault();
                        form.post('/checkout');
                    }}>
                        <div className="card-panel p-6">
                            <h2 className="text-2xl font-black">Delivery Information</h2>
                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                                <FormField error={form.errors.first_name} label="First Name" onChange={(e) => form.setData('first_name', e.target.value)} value={form.data.first_name} />
                                <FormField error={form.errors.last_name} label="Last Name" onChange={(e) => form.setData('last_name', e.target.value)} value={form.data.last_name} />
                                <FormField className="md:col-span-2" error={form.errors.phone} label="Phone Number" onChange={(e) => form.setData('phone', e.target.value)} value={form.data.phone} />
                                <FormField className="md:col-span-2" error={form.errors.street_address} label="Street Address" onChange={(e) => form.setData('street_address', e.target.value)} value={form.data.street_address} />
                                <FormField error={form.errors.city} label="City / Municipality" onChange={(e) => form.setData('city', e.target.value)} value={form.data.city} />
                                <FormField error={form.errors.province} label="Province" onChange={(e) => form.setData('province', e.target.value)} value={form.data.province} />
                                <FormField as="textarea" className="md:col-span-2 min-h-24 resize-none" error={form.errors.notes} label="Order Notes" onChange={(e) => form.setData('notes', e.target.value)} value={form.data.notes} />
                            </div>
                        </div>

                        <div className="card-panel p-6">
                            <h2 className="text-2xl font-black">Payment Method</h2>
                            <div className="mt-5 space-y-3">
                                {paymentMethods.map((method) => (
                                    <label
                                        key={method.value}
                                        className={`block rounded-2xl border p-4 ${
                                            form.data.payment_method === method.value ? 'border-blue-500 bg-blue-50' : 'border-stone-200'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <input
                                                checked={form.data.payment_method === method.value}
                                                className="mt-1"
                                                name="payment_method"
                                                onChange={() => form.setData('payment_method', method.value)}
                                                type="radio"
                                            />
                                            <div>
                                                <p className="font-semibold text-stone-950">{method.label}</p>
                                                <p className="text-xs text-stone-500">{method.hint}</p>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <button className="btn-dark mt-6 w-full" disabled={form.processing} type="submit">
                                Place Order
                            </button>
                        </div>
                    </form>

                    <div className="space-y-5">
                        <CartSummary summary={summary} />
                        <div className="card-panel p-6">
                            <h3 className="text-2xl font-black">Items</h3>
                            <div className="mt-5 space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <img className="h-16 w-16 rounded-2xl object-cover" src={item.imageUrl} alt={item.name} />
                                        <div className="flex-1">
                                            <p className="font-semibold text-stone-900">{item.name}</p>
                                            <p className="text-xs text-stone-500">
                                                {item.quantity} x {formatPeso(item.price)}
                                            </p>
                                        </div>
                                        <p className="font-semibold">{formatPeso(item.lineTotal)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
