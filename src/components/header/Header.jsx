import { Link } from "react-router-dom";
import { getCurrentUser } from "../../lib/auth"
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Header() {
    const [user, setUser] = useState(null);
    const [productLength, setProductLength] = useState(null);

    useEffect(() => {
        async function loadUser() {
            const u = await getCurrentUser();
            setUser(u);
        }
        loadUser();
    });
    useEffect(() => {
        if (!user) return;

        async function getLengthProducts() {
            const { count, error } = await supabase
                .from("cart")
                .select("*", { count: "exact" })
                .eq("user_id", user.id);


            if (!error) setProductLength(count);
        }

        getLengthProducts();
    });
    async function logout() {
        await supabase.auth.signOut();
        window.location.reload();
    }

    return (
        <header className="w-full py-4 border-b border-gray-200 bg-white">
            <div className="container mx-auto flex gap-7 flex-wrap items-center justify-between">

                {/* LOGO */}
                <Link to="/" className="text-2xl font-bold">
                    SPORTX
                </Link>

                {/* NAVIGATION */}
                <nav className="flex gap-6 text-gray-700">
                    <Link to="/" className="hover:text-black transition">Home</Link>
                    <Link to="/products" className="hover:text-black transition">Products</Link>
                    <Link to={"/Categories"} className="hover:text-black transition">Categories</Link>
                </nav>

                {/* ACTIONS */}
                <div className="flex items-center gap-4">
                    {user && <div className="flex gap-5 flex-wrap">
                        <p>Hello, {user.email}</p>
                        <button className="text-gray-700 hover:text-black transition cursor-pointer" onClick={logout}>Logout</button>

                        <Link to="/cart" className="relative">
                            <span className="text-gray-700 hover:text-black transition">
                                🛒
                            </span>

                            {/* Badge */}
                            <span
                                className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                            >
                                {productLength}
                            </span>
                        </Link>
                    </div>}

                    {!user && <div className="flex gap-5">
                        <Link to="/login" className=" text-gray-700 hover:text-black transition">
                            Login
                        </Link>
                        <Link to="/signup" className="text-gray-700 hover:text-black transition">
                            Sign Up
                        </Link>
                    </div>}
                </div>
            </div>
        </header>
    );
}
