import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            alert(error.message);
        } else {
            alert("Logged in successfully!");
            window.location.href = "/";
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10">

            <h1 className="text-2xl font-semibold mb-6">Login</h1>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">

                <input
                    type="email"
                    placeholder="Email"
                    className="border p-3 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="border p-3 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div>Don't have an account? <Link className="text-black" to={"/signup"}>Sign Up</Link> </div>
                <button
                    disabled={loading}
                    className="py-3 bg-black text-white rounded hover:opacity-80 transition"
                >
                    {loading ? "Loading..." : "Login"}
                </button>

            </form>
        </div>
    );
}
