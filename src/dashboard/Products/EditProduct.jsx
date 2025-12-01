import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProduct() {
    const { id } = useParams(); // id coming from URL /products/edit/:id
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [desc, setDesc] = useState("");
    const [image, setImage] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const [loading, setLoading] = useState(true);

    // -----------------------------------
    // LOAD PRODUCT DATA
    // -----------------------------------
    useEffect(() => {
        async function loadProduct() {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("id", id)
                .single();

            if (!error && data) {
                setTitle(data.title);
                setPrice(data.price);
                setDesc(data.description);
                setImage(data.image);
            }

            setLoading(false);
        }

        loadProduct();
    }, [id]);

    // -----------------------------------
    // UPLOAD IMAGE (optional)
    // -----------------------------------
    async function uploadImage(file) {
        const fileName = `product-${Date.now()}-${file.name}`;

        const { error } = await supabase.storage
            .from("products")
            .upload(fileName, file);

        if (error) {
            console.log(error);
            return null;
        }

        const publicUrl = supabase.storage
            .from("products")
            .getPublicUrl(fileName).data.publicUrl;

        return publicUrl;
    }

    // -----------------------------------
    // UPDATE PRODUCT
    // -----------------------------------
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        let imageUrl = image;

        // لو رفع صورة جديدة
        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
        }

        const { error } = await supabase
            .from("products")
            .update({
                title,
                price: Number(price),
                description: desc,
                image: imageUrl,
            })
            .eq("id", id);

        if (error) {
            console.log(error);
            alert("Error updating product");
        } else {
            navigate("/dashboard/products");
        }

        setLoading(false);
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

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

                <textarea
                    placeholder="Description"
                    className="border p-3 rounded"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                ></textarea>

                {/* PREVIEW IMAGE */}
                <img
                    src={image}
                    alt="product"
                    className="w-32 h-32 object-cover rounded"
                />

                <label className="cursor-pointer px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium inline-block">
                    Upload Image
                    <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />
                </label>

                <button className="py-3 bg-black text-white rounded-lg">
                    Update Product
                </button>
            </form>
        </div>
    );
}
