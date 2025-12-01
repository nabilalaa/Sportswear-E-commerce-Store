import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DashboardCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  async function loadCategories() {
    const { data, error } = await supabase
      .from("category")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setCategories(data);
    setLoading(false);

  }
  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadCategories();
  }, []);

  async function addCategory() {
    if (!newCategory.trim()) return;
    await supabase.from("category").insert({ name: newCategory });

    setNewCategory("");
    loadCategories();
  }

  function startEdit(cat) {
    setEditingId(cat.id);
    setEditingName(cat.name);
  }

  async function saveEdit() {
    await supabase
      .from("category")
      .update({ name: editingName })
      .eq("id", editingId);

    setEditingId(null);
    setEditingName("");
    loadCategories();
  }

  async function deleteCategory(id) {
    await supabase.from("category").delete().eq("id", id);
    loadCategories();
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          className="border p-2 rounded flex-1"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          onClick={addCategory}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Add
        </button>
      </div>
      {categories.length === 0 ? <p>No categories found.</p> : <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="p-3">Name</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="border-t text-center">
              <td className="p-3">
                {editingId === cat.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="border p-2 rounded"
                  />
                ) : (
                  cat.name
                )}
              </td>

              <td className="p-3 flex justify-center gap-4">
                {editingId === cat.id ? (
                  <button onClick={saveEdit} className="text-green-600">
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(cat)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-red-600"
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
