export default function Footer() {
    return (
        <footer className="w-full border-t border-gray-200 mt-16 py-6">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">

                {/* Left Text */}
                <p>© 2025 SPORTX. All rights reserved.</p>

                {/* Links */}
                <div className="flex gap-4">
                    <a className="hover:text-black transition cursor-pointer">Privacy</a>
                    <a className="hover:text-black transition cursor-pointer">Terms</a>
                    <a className="hover:text-black transition cursor-pointer">Support</a>
                </div>

            </div>
        </footer>
    );
}
