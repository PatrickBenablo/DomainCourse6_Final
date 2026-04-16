import { formatPeso } from '../lib/format';

export default function CartSummary({ summary, buttonLabel = 'Proceed to Checkout', onClick, dark = false }) {
    return (
        <div className="card-panel p-6">
            <h3 className="text-2xl font-bold text-stone-900">Order Summary</h3>
            <div className="mt-6 space-y-3 text-sm text-stone-600">
                <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>{formatPeso(summary.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>{summary.shipping === 0 ? 'Free' : formatPeso(summary.shipping)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-stone-200 pt-3 text-base font-semibold text-stone-950">
                    <span>Total</span>
                    <span>{formatPeso(summary.total)}</span>
                </div>
            </div>
            {onClick ? (
                <button className={dark ? 'btn-dark mt-6 w-full' : 'btn-primary mt-6 w-full'} onClick={onClick} type="button">
                    {buttonLabel}
                </button>
            ) : null}
        </div>
    );
}
