import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

export default function DashboardOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadOrders() {
            const { data, error } = await supabase
                .from("orders")
                .select("*, user_id")
                .order("created_at", { ascending: false });
            console.log(data)
            if (!error) setOrders(data);
            setLoading(false);
        }
        loadOrders();
    }, []);



    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Orders</h1>

            {orders.length === 0 ? <p>No orders found.</p> : <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-3">Order ID</th>
                        <th className="p-3">User</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-t text-center">
                            <td className="p-3">{order.id}</td>
                            <td className="p-3">{order.user_id}</td>
                            <td className="p-3">${order.total}</td>


                            <td className="p-3">
                                {new Date(order.created_at).toLocaleDateString("en-GB")}
                            </td>

                            <td className="p-3">
                                <Link
                                    to={`/dashboard/orders/${order.id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>}


        </div>
    );
}
