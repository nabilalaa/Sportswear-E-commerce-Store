import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useParams } from "react-router-dom";

export default function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadOrder() {
            // Load order
            const { data: orderData, error: orderError } = await supabase
                .from("orders")
                .select("*")
                .eq("id", id)
                .single();

            if (!orderError) setOrder(orderData);

            // Load order items + product info
            const { data: itemsData, error: itemsError } = await supabase
                .from("order_items")
                .select("*, products(*)")
                .eq("order_id", id);

            if (!itemsError) setItems(itemsData);

            setLoading(false);
        }
        loadOrder();
    }, []);



    if (loading) return <p>Loading...</p>;
    if (!order) return <p>Order not found</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Order Details</h1>

            {/* ORDER INFO */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>User ID:</strong> {order.user_id}</p>
                <p><strong>Total:</strong> ${order.total}</p>
                <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString("en-GB")}</p>
            </div>

            {/* ORDER ITEMS */}
            <h2 className="text-xl font-semibold mb-4">Items</h2>

            <div className="flex flex-col gap-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex p-4 bg-gray-100 rounded-lg shadow items-center gap-4"
                    >
                        <img
                            src={item.products.image}
                            className="w-20 h-20 object-cover rounded"
                        />

                        <div>
                            <p className="font-bold">{item.products.title}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
