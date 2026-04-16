<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@schoolstore.test'],
            ['name' => 'SchoolStore Admin', 'password' => 'password123', 'is_admin' => true]
        );

        User::query()->updateOrCreate(
            ['email' => 'juan@email.com'],
            ['name' => 'Juan Dela Cruz', 'password' => 'password123', 'is_admin' => false]
        );

        $categories = collect([
            ['name' => 'Notebooks', 'slug' => 'notebooks', 'description' => 'Campus-ready notebooks and writing pads.', 'icon' => '📓', 'accent_color' => '#FFF1B8', 'sort_order' => 1],
            ['name' => 'Pens & Pencils', 'slug' => 'pens-pencils', 'description' => 'Smooth writing essentials for class and exams.', 'icon' => '✏️', 'accent_color' => '#DDE8FF', 'sort_order' => 2],
            ['name' => 'Backpacks', 'slug' => 'backpacks', 'description' => 'Durable school bags for everyday use.', 'icon' => '🎒', 'accent_color' => '#FFE0E0', 'sort_order' => 3],
            ['name' => 'Art Supplies', 'slug' => 'art-supplies', 'description' => 'Creative materials for projects and activities.', 'icon' => '🎨', 'accent_color' => '#DCF6EF', 'sort_order' => 4],
        ])->mapWithKeys(fn (array $category): array => [
            $category['slug'] => Category::query()->updateOrCreate(['slug' => $category['slug']], $category),
        ]);

        $products = [
            ['category' => 'notebooks', 'name' => 'Classic Notebook', 'sku' => 'NOTE-001', 'subtitle' => 'Soft cover, college ruled', 'description' => 'A clean everyday notebook for lectures, quizzes, and homework.', 'price' => 90, 'stock' => 39, 'image_url' => 'https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?auto=format&fit=crop&w=800&q=80', 'is_featured' => true, 'rating' => 4.9],
            ['category' => 'pens-pencils', 'name' => 'Premium Pencil Set', 'sku' => 'PEN-002', 'subtitle' => '12-piece graphite bundle', 'description' => 'Smooth No. 2 pencils with erasers for exams and sketching.', 'price' => 45, 'stock' => 45, 'image_url' => 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80', 'is_featured' => false, 'rating' => 4.8],
            ['category' => 'backpacks', 'name' => 'School Backpack', 'sku' => 'BAG-003', 'subtitle' => 'Water-resistant with laptop sleeve', 'description' => 'Built for daily school commute with padded straps and organized storage.', 'price' => 900, 'stock' => 12, 'image_url' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', 'is_featured' => true, 'rating' => 4.9],
            ['category' => 'pens-pencils', 'name' => 'Ballpen Set (10pc)', 'sku' => 'PEN-004', 'subtitle' => '0.5mm black ink', 'description' => 'Reliable pens for note-taking, assignments, and daily use.', 'price' => 65, 'stock' => 36, 'image_url' => 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80', 'is_featured' => false, 'rating' => 4.7],
            ['category' => 'art-supplies', 'name' => 'Watercolor Art Kit', 'sku' => 'ART-005', 'subtitle' => '24-color paint set', 'description' => 'A compact watercolor kit for school projects and hobby sessions.', 'price' => 350, 'stock' => 24, 'image_url' => 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80', 'is_featured' => true, 'rating' => 4.8],
            ['category' => 'notebooks', 'name' => 'Spiral Notebook Set', 'sku' => 'NOTE-006', 'subtitle' => '3-pack assorted colors', 'description' => 'Color-coded spiral notebooks for different subjects.', 'price' => 180, 'stock' => 28, 'image_url' => 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80', 'is_featured' => false, 'rating' => 4.8],
            ['category' => 'art-supplies', 'name' => 'Colored Pen Set', 'sku' => 'ART-007', 'subtitle' => '12 vibrant tones', 'description' => 'Fine-tip colored pens for highlighting, journaling, and diagrams.', 'price' => 220, 'stock' => 18, 'image_url' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80', 'is_featured' => false, 'rating' => 4.7],
            ['category' => 'pens-pencils', 'name' => 'Scientific Calculator', 'sku' => 'TECH-008', 'subtitle' => 'Exam-friendly 2-line display', 'description' => 'A dependable calculator for algebra, statistics, and science classes.', 'price' => 680, 'stock' => 23, 'image_url' => 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=800&q=80', 'is_featured' => true, 'rating' => 4.9],
        ];

        foreach ($products as $product) {
            Product::query()->updateOrCreate(
                ['sku' => $product['sku']],
                [
                    'category_id' => $categories[$product['category']]->id,
                    'name' => $product['name'],
                    'slug' => (string) str($product['name'])->slug(),
                    'subtitle' => $product['subtitle'],
                    'description' => $product['description'],
                    'price' => $product['price'],
                    'stock' => $product['stock'],
                    'image_url' => $product['image_url'],
                    'is_featured' => $product['is_featured'],
                    'rating' => $product['rating'],
                ]
            );
        }

        if (Order::query()->exists()) {
            return;
        }

        $sampleProducts = Product::query()->take(3)->get();

        foreach ([
            ['number' => 'SS-20260416-1001', 'name' => ['Maria', 'Santos'], 'payment' => 'cash_on_delivery', 'status' => 'completed', 'items' => [[$sampleProducts[0], 1], [$sampleProducts[1], 2]]],
            ['number' => 'SS-20260416-1002', 'name' => ['Jose', 'Reyes'], 'payment' => 'gcash_maya', 'status' => 'shipped', 'items' => [[$sampleProducts[2], 1]]],
            ['number' => 'SS-20260416-1003', 'name' => ['Ana', 'Cruz'], 'payment' => 'bank_transfer', 'status' => 'pending', 'items' => [[$sampleProducts[1], 1], [$sampleProducts[2], 1]]],
        ] as $seedOrder) {
            $subtotal = collect($seedOrder['items'])->sum(fn (array $line): int => $line[0]->price * $line[1]);

            $order = Order::query()->create([
                'user_id' => null,
                'order_number' => $seedOrder['number'],
                'status' => $seedOrder['status'],
                'payment_method' => $seedOrder['payment'],
                'customer_first_name' => $seedOrder['name'][0],
                'customer_last_name' => $seedOrder['name'][1],
                'phone' => '+63 912 345 6789',
                'street_address' => '123 Sampaguita St.',
                'city' => 'Quezon City',
                'province' => 'Metro Manila',
                'subtotal' => $subtotal,
                'shipping_fee' => 0,
                'total' => $subtotal,
            ]);

            foreach ($seedOrder['items'] as [$product, $quantity]) {
                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $product->price,
                    'total_price' => $product->price * $quantity,
                ]);
            }
        }
    }
}
