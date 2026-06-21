import { Link } from "react-router";
import { useState } from "react";
import { Menu, X, ChevronRight, Sparkles } from "lucide-react";

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
                <div className="fixed inset-0 z-40 bg-[#030014]/98 backdrop-blur-2xl md:hidden pt-40 pb-10 px-6 overflow-y-auto flex flex-col justify-start gap-6 animate-in fade-in duration-300">
                    <div className="flex flex-col gap-4 w-full max-w-md mx-auto mt-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-2">Navigation</p>
                        
                        <Link
                            to="/builder"
                            onClick={() => setIsOpen(false)}
                            className="group flex flex-col gap-1.5 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-left active:scale-[0.98]"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-lg text-white group-hover:text-neon-purple transition-colors">Create Resume</span>
                                <ChevronRight size={18} className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                            <span className="text-xs text-gray-400">Build a resume from scratch with AI-powered suggestions.</span>
                        </Link>

                        <Link
                            to="/upload"
                            onClick={() => setIsOpen(false)}
                            className="group flex flex-col gap-1.5 p-5 bg-gradient-to-br from-white/5 to-neon-purple/5 border border-white/10 rounded-2xl hover:from-white/5 hover:to-neon-purple/10 hover:border-neon-purple/30 transition-all duration-300 text-left active:scale-[0.98]"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-lg text-white group-hover:text-neon-blue transition-colors">Upload & Analyze</span>
                                <Sparkles size={18} className="text-neon-purple group-hover:text-neon-blue group-hover:animate-pulse transition-all" />
                            </div>
                            <span className="text-xs text-gray-400">Get an instant ATS score and AI optimization tips.</span>
                        </Link>
                    </div>

                    <div className="mt-auto border-t border-white/5 pt-6 text-center w-full max-w-md mx-auto">
                        <p className="text-xs text-gray-600 font-medium">© 2026 RESUMIND. All rights reserved.</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;