<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(private readonly CartController $cartController)
    {
    }

    public function index(Request $request): Response|RedirectResponse
    {
        $cart = $this->cartController->payload($request);

        if (blank($cart['items'])) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        [$firstName, $lastName] = str($request->user()?->name ?? '')->explode(' ', 2)->all() + ['', ''];

        return Inertia::render('Checkout/Index', [
            'items' => $cart['items'],
            'summary' => $cart['summary'],
            'customer' => [
                'first_name' => $firstName,
                'last_name' => $lastName,
                'phone' => '',
                'street_address' => '',
                'city' => 'Quezon City',
                'province' => 'Metro Manila',
                'payment_method' => 'cash_on_delivery',
                'notes' => '',
            ],
            'paymentMethods' => [
                ['value' => 'cash_on_delivery', 'label' => 'Cash on Delivery', 'hint' => 'Pay when your order arrives.'],
                ['value' => 'gcash_maya', 'label' => 'GCash / Maya', 'hint' => 'Use your mobile wallet after order confirmation.'],
                ['value' => 'bank_transfer', 'label' => 'Bank Transfer', 'hint' => 'BPI, BDO, or UnionBank transfer.'],
            ],
        ]);
    }

    public function store(CheckoutRequest $request): RedirectResponse
    {
        $cart = $this->cartController->payload($request);

        if (blank($cart['items'])) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated, $cart): void {
            $order = Order::query()->create([
                'user_id' => $request->user()?->id,
                'order_number' => 'SS-'.now()->format('Ymd').'-'.str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
                'status' => 'pending',
                'payment_method' => $validated['payment_method'],
                'customer_first_name' => $validated['first_name'],
                'customer_last_name' => $validated['last_name'],
                'phone' => $validated['phone'],
                'street_address' => $validated['street_address'],
                'city' => $validated['city'],
                'province' => $validated['province'],
                'notes' => $validated['notes'] ?? null,
                'subtotal' => $cart['summary']['subtotal'],
                'shipping_fee' => $cart['summary']['shipping'],
                'total' => $cart['summary']['total'],
            ]);

            foreach ($cart['items'] as $item) {
                $product = Product::query()->findOrFail($item['id']);

                abort_if($product->stock < $item['quantity'], 422, "{$product->name} does not have enough stock.");

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'total_price' => $product->price * $item['quantity'],
                ]);

                $product->decrement('stock', $item['quantity']);
            }
        });

        $request->session()->forget('cart.items');

        return redirect()->route('home')->with('success', 'Order placed successfully.');
    }
}
