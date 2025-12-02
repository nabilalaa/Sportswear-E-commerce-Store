import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DashboardUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // -----------------------------
    // LOAD USERS
    // -----------------------------
    async function loadUsers() {
        const { data, error } = await supabase
            .from("app_users")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error) setUsers(data);
        setLoading(false);
    }
    console.log(users)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadUsers();
    }, []);

    // -----------------------------
    // MAKE ADMIN
    // -----------------------------
    async function makeAdmin(id) {
        await supabase
            .from("app_users")
            .update({ role: "admin" })
            .eq("id", id);

        loadUsers();
    }

    // -----------------------------
    // REMOVE ADMIN
    // -----------------------------
    async function removeAdmin(id) {
        await supabase
            .from("app_users")
            .update({ role: "customer" })
            .eq("id", id);

        loadUsers();
    }

    // -----------------------------
    // DELETE USER
    // -----------------------------
    async function deleteUser(id) {
        await supabase.from("app_users").delete().eq("id", id);
        loadUsers();
    }

    if (loading) return <p>Loading...</p>;


    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Users</h1>
            {users.length === 0 ? <p>No users found.</p> : <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200 text-center">
                        <th className="p-3">Email</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-t text-center">
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">{user.role}</td>

                            <td className="p-3 flex gap-4 justify-center">

                                {user.role !== "admin" ? (
                                    <button
                                        onClick={() => makeAdmin(user.id)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Make Admin
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => removeAdmin(user.id)}
                                        className="text-yellow-600 hover:underline"
                                    >
                                        Remove Admin
                                    </button>
                                )}

                                <button
                                    onClick={() => deleteUser(user.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Delete
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>}

        </div>
    );
}
