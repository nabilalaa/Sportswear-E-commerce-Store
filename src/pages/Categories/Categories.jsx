import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCategories() {
            const { data, error } = await supabase
                .from("category")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error) setCategories(data);
            setLoading(false);
        }

        loadCategories();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="max-w-6xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-8 text-center">
                Shop by Category
            </h1>

            {/* GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">

                {categories.map((cat) => (
                    <Link
                        to={`/products?category=${cat.id}`}
                        key={cat.id}
                        className="group cursor-pointer"
                    >
                        <div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center">
                            <span className="text-5xl">🏷️</span>
                        </div>

                        <p className="text-center mt-3 text-lg font-medium group-hover:text-black">
                            {cat.name}
                        </p>
                    </Link>
                ))}

            </div>

        </div>
    );
}
