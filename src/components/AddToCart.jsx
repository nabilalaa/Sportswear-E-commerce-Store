import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AddToCart({ product }) {
    const navigate = useNavigate();
    console.log(product)
    async function addToCart() {
        const
            { data: user }
                = await supabase.auth.getUser();
        if (!user) {
            navigate("/login")
        }

        const { error } = await supabase.from("cart").insert([
            {
                user_id: user.user.id,
                product_id: product,
                quantity: 1,
            },
        ]);
        navigate("/cart")


        if (error) {
            console.log(error);
            alert("Error adding to cart");
        } else {
            alert("Added to cart!");
        }

    }

    return (
        <button onClick={addToCart} className="px-6 py-3 bg-black text-white rounded-full hover:opacity-80 transition">
            Add to Cart
        </button>)
}
