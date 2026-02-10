import React from "react";

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let borderColor = "border-red-500/50";
  let textColor = "text-red-400";
  let glowColor = "rgba(239, 68, 68, 0.2)";
  let label = "Needs Work";

  if (score >= 80) {
    borderColor = "border-neon-blue/50";
    textColor = "text-neon-blue";
    glowColor = "rgba(59, 130, 246, 0.2)";
    label = "Excellent";
  } else if (score >= 70) {
    borderColor = "border-neon-purple/50";
    textColor = "text-neon-purple";
    glowColor = "rgba(168, 85, 247, 0.2)";
    label = "Strong";
  } else if (score >= 50) {
    borderColor = "border-yellow-500/50";
    textColor = "text-yellow-400";
    glowColor = "rgba(234, 179, 8, 0.2)";
    label = "Good Start";
  }

  return (
    <div
      className={`inline-flex items-center rounded-full px-3 py-1 bg-white/5 backdrop-blur-md border ${borderColor} shadow-lg transition-all duration-300`}
      style={{ boxShadow: `0 0 15px ${glowColor}, inset 0 0 10px ${glowColor}` }}
    >
      <p className={`text-xs font-bold tracking-wider uppercase ${textColor} drop-shadow-sm`}>
        {label}
      </p>
    </div>
  );
};

export default ScoreBadge;
