<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function store(ProductRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Product::query()->create([
            ...$validated,
            'slug' => Str::slug($validated['name']).'-'.Str::lower(Str::random(4)),
            'is_featured' => (bool) ($validated['is_featured'] ?? false),
            'rating' => $validated['rating'] ?? 4.9,
        ]);

        return back()->with('success', 'Product created.');
    }

    public function update(ProductRequest $request, Product $product): RedirectResponse
    {
        $validated = $request->validated();

        $product->update([
            ...$validated,
            'slug' => Str::slug($validated['name']).'-'.Str::lower(Str::random(4)),
            'is_featured' => (bool) ($validated['is_featured'] ?? false),
            'rating' => $validated['rating'] ?? $product->rating,
        ]);

        return back()->with('success', 'Product updated.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return back()->with('success', 'Product deleted.');
    }
}
