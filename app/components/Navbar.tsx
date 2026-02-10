import { Link } from "react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="navbar relative z-50">
                <Link to="/" onClick={() => setIsOpen(false)}>
                    <p className="text-2xl font-bold text-gradient tracking-wide glow-text">RESUMIND</p>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <Link className="text-sm font-semibold text-gray-300 hover:text-white transition-colors" to="/builder">
                        Create Resume
                    </Link>
                    <Link className="primary-button w-fit shadow-lg shadow-neon-purple/20 !px-6 !py-2 !text-sm flex items-center justify-center" to="/upload">
                        Upload Resume
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-dark-bg/95 backdrop-blur-xl md:hidden pt-28 px-6 animate-in slide-in-from-top-10 duration-300 flex flex-col items-center gap-8">
                    <Link
                        className="text-xl font-semibold text-gray-300 hover:text-white transition-colors"
                        to="/builder"
                        onClick={() => setIsOpen(false)}
                    >
                        Create Resume
                    </Link>
                    <Link
                        className="primary-button w-full shadow-lg shadow-neon-purple/20 text-center justify-center flex py-4 text-lg"
                        to="/upload"
                        onClick={() => setIsOpen(false)}
                    >
                        Upload Resume
                    </Link>
                </div>
            )}
        </>
    );
};

export default Navbar;