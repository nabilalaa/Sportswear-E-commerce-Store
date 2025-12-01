import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

export default function MainLayout() {
    return (
        <>
            <Header />
            <main className="container mx-auto py-6">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
