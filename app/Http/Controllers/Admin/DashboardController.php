<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $products = Product::query()->with('category')->orderBy('name')->get();
        $orders = Order::query()->latest()->with('items.product')->take(6)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalSales' => Order::query()->sum('total'),
                'totalOrders' => Order::query()->count(),
                'customers' => Order::query()->distinct('phone')->count('phone'),
                'lowStock' => Product::query()->where('stock', '<=', 10)->count(),
            ],
            'categories' => Category::query()->orderBy('sort_order')->get(['id', 'name']),
            'products' => $products->map(fn (Product $product): array => [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category->name,
                'categoryId' => $product->category_id,
                'price' => $product->price,
                'stock' => $product->stock,
                'sku' => $product->sku,
                'subtitle' => $product->subtitle,
                'imageUrl' => $product->image_url,
                'description' => $product->description,
                'isFeatured' => $product->is_featured,
                'rating' => (float) $product->rating,
            ]),
            'orders' => $orders->map(fn (Order $order): array => [
                'id' => $order->id,
                'orderNumber' => $order->order_number,
                'customer' => trim($order->customer_first_name.' '.$order->customer_last_name),
                'items' => $order->items->map(fn ($item): string => "{$item->product->name} x{$item->quantity}")->join(', '),
                'total' => $order->total,
                'status' => $order->status,
            ]),
        ]);
    }
}
