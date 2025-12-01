import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link, useLocation } from "react-router-dom";

export default function Products() {
    const location = useLocation();
    const categoryIdFromURL = new URLSearchParams(location.search).get("category");

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(categoryIdFromURL || "all");
    const [sortOrder, setSortOrder] = useState("");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load categories
    useEffect(() => {
        async function loadCategories() {
            const { data, error } = await supabase
                .from("category")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error) setCategories(data);
        }
        loadCategories();
    }, []);

    // Load products with filters
    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);

            let query = supabase.from("products").select("*");

            // Filter by category
            if (selectedCategory !== "all") {
                query = query.eq("category_id", selectedCategory);
            }

            // Sort by price
            if (sortOrder === "low") {
                query = query.order("price", { ascending: true });
            } else if (sortOrder === "high") {
                query = query.order("price", { ascending: false });
            }
            console.log(query)

            const { data, error } = await query;

            if (!error) setProducts(data || []);
            setLoading(false);
        }

        fetchProducts();
    }, [selectedCategory, sortOrder]);


    return (
        <div className="products-page">

            {/* TITLE */}
            <h1 className="text-3xl font-semibold mb-6">All Products</h1>

            {/* FILTERS */}
            <div className="flex items-center gap-4 mb-10 flex-wrap">

                {/* Category Filter */}
                <select className="border border-gray-300 px-4 py-2 rounded-lg text-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option  value="all">All Categories</option>

                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}</option>
                    ))}

                </select>

                {/* Price Filter */}
                <select className="border border-gray-300 px-4 py-2 rounded-lg text-sm"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}>
                    <option>Sort by price</option>
                    <option>Low to High</option>
                    <option>High to Low</option>
                </select>

            </div>

            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                {/* PRODUCT CARD */}
                {loading ? "loading" :
                    products.map((product) => (
                        <Link to={"/product/" + product.id} key={product.id}>
                            <div className="flex flex-col items-center">
                                <div className="flex justify-center items-center  w-full h-40 bg-gray-100 rounded-xl mb-3
                                group-hover:shadow-lg transition"><img className="h-full object-cover" src={product.image} alt="" /></div>                                <p className="text-sm text-gray-700">{product.title}</p>
                                <p className="text-lg font-semibold">{product.price}$</p>
                            </div>
                        </Link>

                    ))
                }

            </div>
        </div >
    );
}
