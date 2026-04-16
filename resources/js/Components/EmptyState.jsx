export default function EmptyState({ icon, title, description, action }) {
    return (
        <div className="card-panel flex min-h-[340px] flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="text-5xl">{icon}</div>
            <div>
                <h3 className="text-3xl font-bold text-stone-900">{title}</h3>
                <p className="mt-2 max-w-md text-sm text-stone-500">{description}</p>
            </div>
            {action}
        </div>
    );
}
