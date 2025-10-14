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
  const gradientFrom = score > 69 ? "from-green-100" : score > 49 ? "from-yellow-100" : "from-red-100";
  const statusIcon = score > 69 ? "/icons/ats-good.svg" : score > 49 ? "/icons/ats-warning.svg" : "/icons/ats-bad.svg";
  const titleColor = score > 69 ? "text-green-700" : score > 49 ? "text-yellow-700" : "text-red-700";

  return (
    <div className={`w-full rounded-xl bg-gradient-to-br ${gradientFrom} to-white p-4 sm:p-6 border border-gray-200`}>
      {/* Top section: icon + headline */}
      <div className="flex items-center gap-3">
        <img src={statusIcon} alt="ATS status" className="h-8 w-8" />
        <h3 className={`text-lg sm:text-xl font-semibold ${titleColor}`}>
          ATS Score - {Math.round(score)}/100
        </h3>
      </div>

      {/* Description + suggestions */}
      <div className="mt-4">
        <h4 className="text-base font-medium">Application Tracking System Insights</h4>
        <p className="mt-1 text-sm text-gray-600">
          We analyzed your resume for ATS compatibility. Here are a few things that are going well and areas you can improve:
        </p>

        <ul className="mt-3 space-y-2">
          {suggestions.map((s, idx) => {
            const isGood = s.type === "good";
            const itemIcon = isGood ? "/icons/check.svg" : "/icons/warning.svg";
            const textColor = isGood ? "text-green-700" : "text-yellow-700";
            const bg = isGood ? "bg-green-50" : "bg-yellow-50";
            return (
              <li key={idx} className={`flex items-start gap-2 rounded-md ${bg} px-2 py-1.5`}>
                <img src={itemIcon} alt={isGood ? "Good" : "Improve"} className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span className={`text-sm ${textColor}`}>{s.tip}</span>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-sm text-gray-700">
          Keep refining your resume to improve ATS compatibility and boost your chances of getting noticed.
        </p>
      </div>
    </div>
  );
};

export default ATS;
