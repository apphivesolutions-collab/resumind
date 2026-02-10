import React from "react";

type Suggestion = {
  type: "good" | "improve";
  tip: string;
};

interface ATSProps {
  score: number; // 0-100
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Logic: >69 = Green/Blue (Good), >39 = Yellow/Orange (Warn), else Red (Bad)
  // Converting to Neon Palette
  const isGood = score > 69;
  const isAvg = score > 49;

  const borderColor = isGood ? "border-neon-blue/50" : isAvg ? "border-yellow-500/50" : "border-red-500/50";
  const titleColor = isGood ? "text-neon-blue" : isAvg ? "text-yellow-500" : "text-red-500";
  const bgGradient = isGood
    ? "bg-gradient-to-br from-neon-blue/10 to-transparent"
    : isAvg
      ? "bg-gradient-to-br from-yellow-500/10 to-transparent"
      : "bg-gradient-to-br from-red-500/10 to-transparent";

  const statusIcon = isGood ? "/icons/ats-good.svg" : isAvg ? "/icons/ats-warning.svg" : "/icons/ats-bad.svg";

  return (
    <div className={`w-full rounded-3xl p-6 sm:p-8 border ${borderColor} ${bgGradient} backdrop-blur-sm relative overflow-hidden`}>
      {/* Background Glow */}
      <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[60px] opacity-20 ${isGood ? 'bg-neon-blue' : isAvg ? 'bg-yellow-500' : 'bg-red-500'}`} />

      {/* Top section: icon + headline */}
      <div className="flex items-center gap-4 relative z-10">
        <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${titleColor}`}>
          <img src={statusIcon} alt="ATS status" className="h-8 w-8" />
        </div>
        <h3 className={`text-2xl font-bold ${titleColor} tracking-wide`}>
          ATS Score - {Math.round(score)}/100
        </h3>
      </div>

      {/* Description + suggestions */}
      <div className="mt-6 relative z-10">
        <h4 className="text-lg font-semibold text-white">Application Tracking System Insights</h4>
        <p className="mt-2 text-sm text-gray-400">
          We analyzed your resume for ATS compatibility. Here are a few things that are going well and areas you can improve:
        </p>

        <ul className="mt-4 space-y-3">
          {suggestions.map((s, idx) => {
            const itemIsGood = s.type === "good";
            // Icons should ideally be updated to white/colored versions or handled via CSS filter if SVGs
            const itemIcon = itemIsGood ? "/icons/check.svg" : "/icons/warning.svg";
            const itemTextColor = itemIsGood ? "text-green-400" : "text-yellow-400";
            const itemBg = itemIsGood ? "bg-green-500/10 border-green-500/20" : "bg-yellow-500/10 border-yellow-500/20";

            return (
              <li key={idx} className={`flex items-start gap-3 rounded-xl border ${itemBg} px-4 py-3`}>
                <img src={itemIcon} alt={itemIsGood ? "Good" : "Improve"} className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span className={`text-sm ${itemTextColor}`}>{s.tip}</span>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-sm text-gray-500">
          Keep refining your resume to improve ATS compatibility and boost your chances of getting noticed.
        </p>
      </div>
    </div>
  );
};

export default ATS;
