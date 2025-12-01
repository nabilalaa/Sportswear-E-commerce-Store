import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCart() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                navigate("/login");
                return;
            }

            const { data, error } = await supabase
                .from("cart")
                .select("id, quantity, products(*)")
                .eq("user_id", user.id);

            if (!error) setCart(data);
            setLoading(false);
        }

        loadCart();
    }, []);


    async function handleCheckout() {
        setLoading(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const total = cart.reduce(
            (sum, item) => sum + item.products.price * item.quantity,
            0
        );

        // 1) Create order
        const { data: orderData, error: orderError } = await supabase
            .from("orders")
            .insert({
                user_id: user.id,
                total,
            })
            .select()
            .single();
        alert("done")


        if (orderError) {
            console.log(orderError);
            setLoading(false);
            return;
        }

        const orderId = orderData.id;

        // 2) Create order_items
        const itemsToInsert = cart.map((item) => ({
            order_id: orderId,
            product_id: item.products.id,
            quantity: item.quantity,
            price: item.products.price,
        }));

        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(itemsToInsert);

        if (itemsError) {
            console.log(itemsError);
            setLoading(false);
            return;
        }

        // 3) Clear cart
        await supabase.from("cart").delete().eq("user_id", user.id);

        // 4) Go to success page
        navigate("/order-success");
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-xl mx-auto mt-10">
            <h1 className="text-3xl font-semibold mb-6">Checkout</h1>

            <div className="bg-gray-100 p-4 rounded-lg">
                {cart.map((item) => (
                    <p key={item.id} className="mb-2">
                        {item.products.title} × {item.quantity} — ${item.products.price}
                    </p>
                ))}

                <p className="font-bold text-xl mt-4">
                    Total: $
                    {cart.reduce(
                        (sum, item) => sum + item.products.price * item.quantity,
                        0
                    )}
                </p>
            </div>

            <button
                onClick={handleCheckout}
                className="mt-6 w-full py-3 bg-black text-white rounded-lg hover:opacity-80 transition"
            >
                Confirm Order
            </button>
        </div>
    );
}
