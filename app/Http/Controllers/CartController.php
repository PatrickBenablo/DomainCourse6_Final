<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Cart/Index', [
            'items' => $this->cartPayload($request)['items'],
            'summary' => $this->cartPayload($request)['summary'],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1'],
        ]);

        $product = Product::query()->findOrFail($validated['product_id']);
        $quantity = min((int) ($validated['quantity'] ?? 1), max($product->stock, 1));

        $cart = $request->session()->get('cart.items', []);
        $current = (int) ($cart[$product->id]['quantity'] ?? 0);
        $cart[$product->id] = [
            'quantity' => min($current + $quantity, $product->stock),
        ];

        $request->session()->put('cart.items', $cart);

        return back()->with('success', "{$product->name} added to cart.");
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0'],
        ]);

        $cart = $request->session()->get('cart.items', []);
        $quantity = min((int) $validated['quantity'], $product->stock);

        if ($quantity <= 0) {
            unset($cart[$product->id]);
        } else {
            $cart[$product->id] = ['quantity' => $quantity];
        }

        $request->session()->put('cart.items', $cart);

        return back();
    }

    public function destroy(Request $request, Product $product): RedirectResponse
    {
        $cart = $request->session()->get('cart.items', []);
        unset($cart[$product->id]);
        $request->session()->put('cart.items', $cart);

        return back()->with('success', "{$product->name} removed from cart.");
    }

    public function payload(Request $request): array
    {
        return $this->cartPayload($request);
    }

    private function cartPayload(Request $request): array
    {
        $cart = collect($request->session()->get('cart.items', []));
        $products = Product::query()
            ->with('category')
            ->whereIn('id', $cart->keys()->all())
            ->get()
            ->keyBy('id');

        $items = $cart->map(function (array $item, string $productId) use ($products): ?array {
            $product = $products->get((int) $productId);

            if (! $product) {
                return null;
            }

            $quantity = min((int) $item['quantity'], $product->stock);
            $lineTotal = $product->price * $quantity;

            return [
                'id' => $product->id,
                'name' => $product->name,
                'subtitle' => $product->subtitle,
                'imageUrl' => $product->image_url,
                'price' => $product->price,
                'stock' => $product->stock,
                'quantity' => $quantity,
                'lineTotal' => $lineTotal,
                'category' => $product->category->name,
            ];
        })->filter()->values();

        $subtotal = $items->sum('lineTotal');

        return [
            'items' => $items,
            'summary' => [
                'subtotal' => $subtotal,
                'shipping' => 0,
                'total' => $subtotal,
            ],
        ];
    }
}
