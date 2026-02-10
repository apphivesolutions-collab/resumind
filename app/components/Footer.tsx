import { Link } from "react-router";
import { Heart } from "lucide-react";

const Footer = () => {
    return (
        <footer className="w-full border-t border-white/5 bg-[#030014] mt-auto relative z-10">
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row items-center gap-2 text-gray-400 text-sm">
                    <span>&copy; {new Date().getFullYear()} Resumind AI.</span>
                    <span className="hidden md:block w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span>All rights reserved.</span>
                </div>

                <a
                    href="https://www.apphivesolutions.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                    <span>Made with</span>
                    <Heart size={14} className="text-neon-pink fill-neon-pink animate-pulse" />
                    <span>by</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple font-bold group-hover:drop-shadow-[0_0_8px_#a855f780] transition-all">
                        Apphive Solutions
                    </span>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
