/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import AddToCart from "../../components/AddToCart";

export default function Product() {
    const navigate = useNavigate()
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function fetchProduct() {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("id", id)
                .single();


            setProduct(data);

            setLoading(false);
        }

        fetchProduct();




    }, [id]);
    if (loading) {
        return <p>Loading...</p>;
    }

    if (!product) {
        return <p>Product not found.</p>;
    }

    return (
        <div className="product-page ">

            {/* GRID LAYOUT */}

            <div className="grid md:grid-cols-2 gap-10 p-4">
                {/* PRODUCT IMAGE */}
                <div className="w-full h-80 bg-gray-100 rounded-xl"></div>

                {/* PRODUCT INFO */}
                <div>
                    <h1 className="text-3xl font-semibold mb-3">{product.title}</h1>

                    <p className="text-2xl font-bold mb-4">$120</p>

                    {/* DESCRIPTION */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Morbi at dui euismod, feugiat turpis id, facilisis turpis.
                    </p>

                    {/* ADD TO CART BUTTON */}
                    {/* <button className="px-6 py-3 bg-black text-white rounded-full hover:opacity-80 transition">
                        Add to Cart
                    </button> */}
                    <AddToCart product={product.id} />

                </div>
            </div>
        </div>
    );
}
