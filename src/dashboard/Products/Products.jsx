import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

export default function DashboardProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            const { data, error } = await supabase
                .from("products")
                .select(`*,category:category(name)`);

            if (!error) setProducts(data);
            setLoading(false);
        }

        loadProducts();
    }, []);


    async function deleteProduct(id) {
        const { error } = await supabase.from("products").delete().eq("id", id);

        if (!error) {
            setProducts((prev) => prev.filter((p) => p.id !== id));
        }
    }

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Manage Products</h1>
                    <Link
                        to="/dashboard/products/add"
                        className="px-4 py-2 bg-black text-white rounded-lg"
                    >
                        + Add Product
                    </Link>
                </div>
                {products.length > 0 ?
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-3">Image</th>
                                <th className="p-3">category</th>

                                <th className="p-3">Title</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-t text-center">
                                    <td className="p-3">
                                        <img
                                            src={product.image}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </td>
                                    <td className="p-3">{product.category?.name || "No Category"}</td>



                                    <td className="p-3">{product.title}</td>
                                    <td className="p-3">${product.price}</td>

                                    <td className="p-3   gap-3 ">
                                        <Link
                                            to={`/dashboard/products/edit/${product.id}`}
                                            className="text-blue-600 hover:underline  mr-4"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => deleteProduct(product.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    : <div>no items</div>
                }

            </div>
        </>
    );
}
