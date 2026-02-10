import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface ComboboxProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    allowCustom?: boolean;
}

const Combobox = ({
    options,
    value,
    onChange,
    placeholder = "Select...",
    className = "",
    allowCustom = true,
}: ComboboxProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (option: string) => {
        onChange(option);
        setSearch("");
        setIsOpen(false);
    };

    const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        if (allowCustom) {
            onChange(val);
        }
        if (!isOpen) setIsOpen(true);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div className="relative">
                <input
                    type="text"
                    value={isOpen ? search : value} // Show search term when open, value when closed (unless empty)
                    // Actually, better UX: always show value if set, but if user types, show search?
                    // Let's keep it simple: simpler controlled input
                    // If allowCustom is true, the input creates the value.
                    // IF not, it just filters.
                    // Integrating "search" and "value" can be tricky.
                    // Let's try this: Input always reflects the current value if closed, or the search term if open/typing.
                    // BUT if I type "Rea", I want to see "React" in list.
                    // If I select "React", value becomes "React".
                    onChange={handleCustomInput}
                    onClick={() => {
                        setSearch(value); // Initialize search with current value
                        setIsOpen(true)
                    }}
                    placeholder={placeholder}
                    className="w-full px-5 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm font-medium text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-neon-purple/50 focus:bg-white/[0.05] transition-all duration-300"
                />
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                    <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-[#1a1a20] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => handleSelect(option)}
                                className="w-full text-left px-4 py-2 text-gray-300 hover:bg-neon-purple/20 hover:text-white transition-colors flex items-center justify-between group"
                            >
                                <span>{option}</span>
                                {value === option && <Check size={14} className="text-neon-purple" />}
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-gray-500 text-sm">
                            {allowCustom ? "Type to create custom..." : "No results found."}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Combobox;
