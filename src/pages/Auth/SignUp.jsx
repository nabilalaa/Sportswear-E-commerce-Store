import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignup(e) {
        e.preventDefault();
        setLoading(true);


        const { data: authData, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    role: "customer"
                }
            }
        });

        if (!error && authData.user) {
            await supabase.from("app_users").insert({
                auth_id: authData.user.id,
                email: email,
                role: "customer",
            });
        }
        setLoading(false);

        if (error) {
            alert(error.message);
        } else {
            alert("Signup successful!");
            window.location.href = "/login";

        }
    }

    return (
        <div className="max-w-md mx-auto mt-10">

            <h1 className="text-2xl font-semibold mb-6">Create an Account</h1>

            <form onSubmit={handleSignup} className="flex flex-col gap-4">

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
                <div>Already have an account? <Link className="text-black" to={"/login"}>Login</Link> </div>
                <button
                    disabled={loading}
                    className="py-3 bg-black text-white rounded hover:opacity-80 transition"
                >
                    {loading ? "Loading..." : "Sign Up"}
                </button>

            </form>
        </div>
    );
}
