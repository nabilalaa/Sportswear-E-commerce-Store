import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState("");


    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [desc, setDesc] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    async function uploadImage(file) {
        const fileName = `product-${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
            .from("products")
            .upload(fileName, file);
        console.log(data)

        if (error) {
            console.log(error);
            return null;
        }


        const url = supabase.storage.from("products").getPublicUrl(fileName).data
            .publicUrl;

        return url;
    }
    useEffect(() => {
        async function loadCategories() {
            const { data } = await supabase.from("category").select("*");
            setCategories(data);
        }
        loadCategories();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        let imageUrl = null;

        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
            if (!imageUrl) {
                alert("Image upload failed!");
                setLoading(false);
                return;
            }
            console.log(imageUrl)
        }

        const { error } = await supabase.from("products").insert({
            title,
            price: Number(price),
            description: desc,
            image: imageUrl,
            category_id: categoryId

        });

        if (error) {
            console.log(error);
            alert("Error adding product");
        } else {
            navigate("/dashboard/products");
        }

        setLoading(false);
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Add Product</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
                <input
                    type="text"
                    placeholder="Title"
                    className="border p-3 rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Price"
                    className="border p-3 rounded"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <select
                    className="border p-3 rounded"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <textarea
                    placeholder="Description"
                    className="border p-3 rounded"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                ></textarea>

                <label className="cursor-pointer px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium inline-block">
                    Upload Image
                    <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />
                </label>


                <button
                    disabled={loading}
                    className="py-3 bg-black text-white rounded-lg"
                >
                    {loading ? "Adding..." : "Add Product"}
                </button>
            </form>
        </div>
    );
}
