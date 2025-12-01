import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
    const navigate = useNavigate()

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;

        async function fetchCart() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                navigate("/login")
                if (!ignore) setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("cart")
                .select("id, quantity, products(*)")
                .eq("user_id", user.id);


            if (!ignore) {
                if (error) console.log(error);
                setCartItems(data || []);
                setLoading(false);
            }
        }

        fetchCart();

        return () => {
            ignore = true; // prevent state updates after unmount
        };
    }, []);

    const total = cartItems.reduce(
        (sum, item) => sum + item.products.price * item.quantity,
        0
    );

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

            {cartItems.length === 0 && <p>Your cart is empty.</p>}

            <div className="flex flex-col gap-6">
                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-center bg-gray-100 p-4 rounded-xl"
                    >
                        <div className="w-20 h-20 bg-white rounded-xl overflow-hidden">
                            <img
                                src={item.products.image}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 ml-4">
                            <p className="font-semibold">{item.products.title}</p>
                            <p className="text-gray-600">${item.products.price}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>

                        <button
                            className="text-red-500 text-sm hover:underline"
                            onClick={async () => {
                                await supabase.from("cart").delete().eq("id", item.id);
                                setCartItems((prev) => prev.filter((x) => x.id !== item.id));
                            }}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {cartItems.length > 0 && (
                <div className="mt-8">
                    <p className="text-xl font-semibold">Total: ${total}</p>
                    <Link to={"/checkout"} className="flex justify-center mt-4 w-full py-3 bg-black text-white rounded-full hover:opacity-80 transition">
                        Checkout
                    </Link>
                </div>
            )}
        </div>
    );
}
