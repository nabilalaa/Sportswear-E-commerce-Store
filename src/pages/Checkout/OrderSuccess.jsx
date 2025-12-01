import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="max-w-lg mx-auto mt-20 text-center">
      <h1 className="text-3xl font-semibold mb-4">Order Successful 🎉</h1>
      <p>Your order has been placed successfully.</p>

      <Link
        to="/"
        className="inline-block mt-6 bg-black text-white py-3 px-6 rounded-lg"
      >
        Back to Home
      </Link>
    </div>
  );
}
