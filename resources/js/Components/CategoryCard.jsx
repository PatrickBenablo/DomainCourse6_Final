export default function CategoryCard({ category }) {
    return (
        <div className="rounded-2xl p-5" style={{ backgroundColor: category.accentColor }}>
            <div className="text-2xl">{category.icon}</div>
            <h3 className="mt-4 text-sm font-semibold text-stone-900">{category.name}</h3>
            <p className="mt-1 text-xs text-stone-500">{category.productCount} products</p>
        </div>
    );
}
