import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="sm:w-64 w-full  bg-gray-900 text-white min-h-screen p-4" >
            <h2 className="text-xl font-bold mb-6">Dashboard</h2>

            <nav className="flex flex-col gap-4">
                <Link to="/dashboard" className="hover:text-gray-300">Overview</Link>
                <Link to="/dashboard/categories" className="hover:text-gray-300">Categories</Link>
                <Link to="/dashboard/products" className="hover:text-gray-300">Products</Link>
                <Link to="/dashboard/orders" className="hover:text-gray-300">Orders</Link>
                <Link to="/dashboard/users" className="hover:text-gray-300">Users</Link>

            </nav>
        </aside>
    )
}
