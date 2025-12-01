import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
    return (
        <div className="flex flex-wrap">
            <Sidebar />

            {/* Main content */}
            <main className="flex-1 p-8 bg-gray-100 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
}
