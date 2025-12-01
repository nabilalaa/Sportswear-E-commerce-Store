import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import DashboardLayout from "./layout/DashboardLayout";

import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import Product from "./pages/Product/Product";
import Categories from "./pages/Categories/Categories";

import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/SignUp";
import OrderSuccess from "./pages/Checkout/OrderSuccess";


import DashboardHome from "./dashboard/Home/Home";
import DashboardCategory from "./dashboard/Category/Categories";
import DashboardProducts from "./dashboard/Products/Products";

import DashboardOrders from "./dashboard/Orders/Orders";
import DashboardUsers from "./dashboard/Users/Users";
import AddProduct from "./dashboard/Products/AddProduct";
import EditProduct from "./dashboard/Products/EditProduct";
import OrderDetails from "./dashboard/Orders/OrderDetails";
import DashboardCategories from "./dashboard/Category/Categories";




export const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout />,
		errorElement: <div>not found</div>,

		children: [
			{ index: true, element: <Home /> },
			{ path: "products", element: <Products /> },
			{ path: "product/:id", element: <Product /> },
			{ path: "categories", element: <Categories /> },

			{ path: "cart", element: <Cart /> },
			{ path: "checkout", element: <Checkout /> },
			{ path: "order-success", element: <OrderSuccess /> },



		],
	},


	{
		path: "/login",
		element: <Login />,
		errorElement: <div>not found</div>
	},
	{
		path: "/signup",
		element: <Signup />,
		errorElement: <div>not found</div>
	},



	// Dashboard
	{
		path: "/dashboard",
		element: <DashboardLayout />,
		errorElement: <div>not found</div>,

		children: [
			{ index: true, element: <DashboardHome /> },
			{ path: "products", element: <DashboardProducts /> },
			{ path: "products/add", element: <AddProduct /> },
			{ path: "products/edit/:id", element: <EditProduct /> },
			{ path: "categories", element: <DashboardCategory /> },
			{ path: "orders", element: <DashboardOrders /> },
			{ path: "orders/:id", element: <OrderDetails /> },
			{ path: "users", element: <DashboardUsers /> },
			{ path: "categories", element: <DashboardCategories /> }

		],
	},
]);


