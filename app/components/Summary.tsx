import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string; score: number }) => {
  let borderColor = "group-hover:border-red-500/50";
  let shadowColor = "group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]";
  let textColor = "text-red-400";

  if (score >= 70) {
    borderColor = "group-hover:border-neon-blue/50";
    shadowColor = "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]";
    textColor = "text-neon-blue";
  } else if (score >= 50) {
    borderColor = "group-hover:border-yellow-500/50";
    shadowColor = "group-hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]";
    textColor = "text-yellow-400";
  }

  return (
    <div className="w-full h-full">
      <div className={`group relative h-full flex flex-col justify-between p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl transition-all duration-300 ${borderColor} ${shadowColor} hover:-translate-y-1`}>
        <div className="flex flex-row justify-between items-start w-full mb-4">
          <p className="text-lg font-medium text-gray-300 group-hover:text-white transition-colors">{title}</p>
          <ScoreBadge score={score} />
        </div>

        <div className="flex items-baseline gap-1">
          <span className={`text-5xl font-bold ${textColor} drop-shadow-lg`}>
            {score}
          </span>
          <span className="text-sm text-gray-500 font-medium">/100</span>
        </div>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Overall Score Section */}
      <div className="glass-panel rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-50" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-neon-purple/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-10 z-10 relative">
          <div className="flex flex-col gap-3 text-center md:text-left max-w-md">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Score</span>
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Here is the breakdown of your resume's performance based on ATS standards and recruiter preferences.
            </p>
          </div>
          <div className="relative">
            <ScoreGauge score={feedback.overallScore} />
          </div>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <Category title={"Tone & Style"} score={feedback.toneAndStyle.score} />
        <Category title={"Content"} score={feedback.content.score} />
        <Category title={"Skills"} score={feedback.skills.score} />
        <Category title={"Structure"} score={feedback.structure.score} />
      </div>
    </div>
  );
};
export default Summary;
