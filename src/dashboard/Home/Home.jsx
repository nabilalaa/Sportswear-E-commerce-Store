import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

export default function DashboardOverview() {
    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        orders: 0,
        revenue: 0,
    });

    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {

            // 1) Count users
            const { count: usersCount } = await supabase
                .from("app_users")
                .select("*", { count: "exact", head: true });

            // 2) Count products
            const { count: productsCount } = await supabase
                .from("products")
                .select("*", { count: "exact", head: true });

            // 3) Orders + revenue
            const { data: ordersData, count: ordersCount } = await supabase
                .from("orders")
                .select("*", { count: "exact" });

            const totalRevenue = ordersData?.reduce(
                (sum, ord) => sum + ord.total,
                0
            ) || 0;

            // 4) Recent 5 orders (manual user join)
            const { data: rawRecent } = await supabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(5);

            // get user email for each order
            const recent = await Promise.all(
                rawRecent.map(async (order) => {
                    const { data: user } = await supabase
                        .from("app_users")
                        .select("email")
                        .eq("auth_id", order.user_id)
                    console.log(user)

                    return {
                        ...order,
                        user_email: user[0]?.email || "Unknown",
                    };

                })
            );

            setStats({
                users: usersCount || 0,
                products: productsCount || 0,
                orders: ordersCount || 0,
                revenue: totalRevenue,
            });

            setRecentOrders(recent || []);
            setLoading(false);
        }

        loadData();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="p-6 bg-white shadow rounded text-center">
                    <h2 className="text-xl font-semibold">Users</h2>
                    <p className="text-3xl font-bold mt-2">{stats.users}</p>
                </div>

                <div className="p-6 bg-white shadow rounded text-center">
                    <h2 className="text-xl font-semibold">Products</h2>
                    <p className="text-3xl font-bold mt-2">{stats.products}</p>
                </div>

                <div className="p-6 bg-white shadow rounded text-center">
                    <h2 className="text-xl font-semibold">Orders</h2>
                    <p className="text-3xl font-bold mt-2">{stats.orders}</p>
                </div>

                <div className="p-6 bg-white shadow rounded text-center">
                    <h2 className="text-xl font-semibold">Revenue</h2>
                    <p className="text-3xl font-bold mt-2">${stats.revenue}</p>
                </div>
            </div>

            {/* RECENT ORDERS */}
            <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
            <div className="bg-white shadow rounded p-4">

                {recentOrders.length === 0 && (
                    <p>No recent orders.</p>
                )}

                {recentOrders.length > 0 && (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2">Order ID</th>
                                <th className="py-2">User Email</th>
                                <th className="py-2">Total</th>
                                <th className="py-2">Date</th>
                                <th className="py-2">View</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="border-b text-center">
                                    <td className="py-2">{order.id}</td>
                                    <td className="py-2">{order.user_email}</td>
                                    <td className="py-2">${order.total}</td>
                                    <td className="py-2">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-2">
                                        <Link
                                            to={`/dashboard/orders/${order.id}`}
                                            className="text-blue-600"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

            </div>
        </div>
    );
}
