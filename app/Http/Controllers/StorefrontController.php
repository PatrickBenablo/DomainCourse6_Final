<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class StorefrontController extends Controller
{
    public function home(): Response
    {
        $featuredProducts = Product::query()
            ->with('category')
            ->where('is_featured', true)
            ->latest()
            ->take(4)
            ->get();

        $categories = Category::query()
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Home', [
            'heroProducts' => $featuredProducts->map(fn (Product $product): array => $this->productCard($product)),
            'categories' => $categories->map(fn (Category $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'icon' => $category->icon,
                'accentColor' => $category->accent_color,
                'description' => $category->description,
                'productCount' => $category->products_count,
            ]),
            'stats' => [
                'products' => Product::query()->count(),
                'rating' => number_format((float) Product::query()->avg('rating'), 1),
                'delivery' => 'Free',
            ],
        ]);
    }

    public function products(): Response
    {
        $products = Product::query()
            ->with('category')
            ->orderByDesc('is_featured')
            ->orderBy('name')
            ->get();

        $categories = Category::query()
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Products/Index', [
            'products' => $products->map(fn (Product $product): array => $this->productCard($product)),
            'categories' => $categories->map(fn (Category $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'icon' => $category->icon,
                'accentColor' => $category->accent_color,
                'description' => $category->description,
                'productCount' => $category->products_count,
            ]),
        ]);
    }

    private function productCard(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'sku' => $product->sku,
            'subtitle' => $product->subtitle,
            'description' => $product->description,
            'price' => $product->price,
            'stock' => $product->stock,
            'rating' => (float) $product->rating,
            'imageUrl' => $product->image_url,
            'isFeatured' => $product->is_featured,
            'category' => [
                'id' => $product->category->id,
                'name' => $product->category->name,
                'slug' => $product->category->slug,
            ],
        ];
    }
}
