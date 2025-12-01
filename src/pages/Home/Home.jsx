import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";

export default function Home() {
    const [categories, setCategories] = useState([]);

    const [products, setProducts] = useState([]);



    useEffect(() => {
        async function getProducts() {
            const { data } = await supabase.from("products").select("*").limit(6)
            setProducts(data)


            // console.log(data)
        }
        async function getcategories() {
            const { data } = await supabase.from("category").select("id,name").limit(6)
            setCategories(data)


        }
        getProducts()
        getcategories()
    }, [])
    return (
        <div className="home px-4 sm:px-6 lg:px-12">

            {/* HERO SECTION */}
            <section className="w-full h-[60vh] sm:h-[70vh] rounded-2xl mt-6 
                bg-gradient-to-r from-gray-900 to-gray-700 text-white
                flex items-center justify-center">

                <div className="text-center px-4 max-w-xl">
                    <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-4">
                        Elevate Your Performance
                    </h1>

                    <p className="text-gray-200 sm:text-lg mb-6">
                        Discover premium sportswear built for athletes at every level.
                    </p>

                    <button className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-full
                        shadow hover:scale-105 transition-transform">
                        Shop Now
                    </button>
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="mt-16">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
                    Shop by Category
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                    {categories.map((cat) => (
                        <div key={cat.id}
                            className="p-6 bg-gray-100 rounded-xl cursor-pointer 
                                hover:bg-gray-200 hover:-translate-y-1 transition shadow-sm">
                            <h3 className="text-base sm:text-lg font-medium text-center">
                                {cat.name}
                            </h3>
                        </div>
                    ))}

                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section className="mt-16 mb-20">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
                        Featured Products
                    </h2>
                    <Link to={"/products"} className="text-sm text-blue-600 hover:underline">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">

                    {/* Product Card */}
                    {products.map((item) => (
                        <Link to={"/product/" + item.id} key={item.id} className="flex flex-col items-center group cursor-pointer">
                            <div className="flex justify-center items-center  w-full h-40 bg-gray-100 rounded-xl mb-3
                                group-hover:shadow-lg transition"><img className="h-full object-cover" src={item.image} alt="" /></div>

                            <p className="text-sm text-center mb-2 text-gray-700">{item.title}</p>
                            <p className="text-lg text-center font-semibold">${item.price}</p>
                        </Link>
                    ))}

                </div>
            </section >

        </div >
    );
}
