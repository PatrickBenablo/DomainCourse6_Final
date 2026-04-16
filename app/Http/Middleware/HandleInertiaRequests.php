<?php

namespace App\Http\Middleware;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $cartItems = collect($request->session()->get('cart.items', []));
        $cartCount = $cartItems->sum(fn (array $item): int => (int) ($item['quantity'] ?? 0));
        $cartIds = $cartItems->keys()->map(fn (string $id): int => (int) $id)->all();
        $cartSubtotal = Product::query()
            ->whereIn('id', $cartIds)
            ->get()
            ->sum(fn (Product $product): int => $product->price * (int) ($cartItems->get((string) $product->id)['quantity'] ?? 0));

        return [
            ...parent::share($request),
            'appName' => config('app.name', 'SchoolStore'),
            'auth' => [
                'user' => $request->user(),
            ],
            'cart' => [
                'count' => $cartCount,
                'subtotal' => $cartSubtotal,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
