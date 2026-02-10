import React from "react";
import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionContent,
} from "./Accordion";

// Helper: Local ScoreBadge specific to Details component
const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const tone = score > 69 ? "green" : score > 39 ? "yellow" : "red";
  // Updated colors for dark mode
  const bg =
    tone === "green"
      ? "bg-green-500/20"
      : tone === "yellow"
        ? "bg-yellow-500/20"
        : "bg-red-500/20";
  const text =
    tone === "green"
      ? "text-green-400"
      : tone === "yellow"
        ? "text-yellow-400"
        : "text-red-400";
  const border =
    tone === "green"
      ? "border-green-500/30"
      : tone === "yellow"
        ? "border-yellow-500/30"
        : "border-red-500/30";

  const icon =
    tone === "green"
      ? "/icons/check.svg"
      : tone === "yellow"
        ? "/icons/warning.svg"
        : "/icons/ats-bad.svg";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold border",
        bg,
        text,
        border
      )}
    >
      <img src={icon} alt="status" className="h-3.5 w-3.5" />
      {Math.round(score)}/100
    </span>
  );
};

// Helper: CategoryHeader (title + ScoreBadge)
const CategoryHeader: React.FC<{ title: string; categoryScore: number }> = ({
  title,
  categoryScore,
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <h4 className="text-base sm:text-lg font-semibold text-white tracking-wide">
        {title}
      </h4>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

// Tip type for sections with explanations
type Tip = { type: "good" | "improve"; tip: string; explanation: string };

// Helper: CategoryContent
const CategoryContent: React.FC<{ tips: Tip[] }> = ({ tips }) => {
  return (
    <div className="space-y-6">
      {/* Two-column grid of brief tips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tips.map((t, idx) => {
          const isGood = t.type === "good";
          const icon = isGood ? "/icons/check.svg" : "/icons/warning.svg";
          const textColor = isGood ? "text-green-400" : "text-yellow-400";
          const bg = isGood ? "bg-green-500/10" : "bg-yellow-500/10";
          const border = isGood ? "border-green-500/20" : "border-yellow-500/20";

          return (
            <div
              key={idx}
              className={cn(
                "flex items-start gap-3 rounded-xl px-4 py-3 border",
                bg,
                border
              )}
            >
              <img
                src={icon}
                alt={isGood ? "Good" : "Improve"}
                className="mt-0.5 h-4 w-4 flex-shrink-0"
              />
              <span className={cn("text-sm", textColor)}>{t.tip}</span>
            </div>
          );
        })}
      </div>

      {/* Explanations list */}
      <div className="space-y-4">
        {tips.map((t, idx) => {
          const isGood = t.type === "good";
          const border = isGood ? "border-green-500/30" : "border-yellow-500/30";
          const bg = isGood ? "bg-green-500/5" : "bg-yellow-500/5";
          const heading = isGood ? "Good" : "Improve";
          const headingColor = isGood ? "text-green-400" : "text-yellow-400";

          return (
            <div
              key={`exp-${idx}`}
              className={cn("rounded-xl border p-4 hover:bg-white/5 transition-colors", border, bg)}
            >
              <p
                className={cn("text-xs font-bold uppercase tracking-wider mb-2", headingColor)}
              >
                {heading}
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">{t.explanation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Details component
const Details: React.FC<{ feedback: Feedback }> = ({ feedback }) => {
  return (
    <div className="w-full">
      <Accordion
        defaultOpen="tone"
        className="rounded-3xl !border-0 bg-transparent space-y-4"
      >
        {/* Tone & Style */}
        <AccordionItem id="tone" className="!border !border-white/10 !bg-white/5">
          <AccordionHeader itemId="tone">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={feedback.toneAndStyle.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone">
            <CategoryContent tips={feedback.toneAndStyle.tips as Tip[]} />
          </AccordionContent>
        </AccordionItem>

        {/* Content */}
        <AccordionItem id="content" className="!border !border-white/10 !bg-white/5">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content"
              categoryScore={feedback.content.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={feedback.content.tips as Tip[]} />
          </AccordionContent>
        </AccordionItem>

        {/* Structure */}
        <AccordionItem id="structure" className="!border !border-white/10 !bg-white/5">
          <AccordionHeader itemId="structure">
            <CategoryHeader
              title="Structure"
              categoryScore={feedback.structure.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback.structure.tips as Tip[]} />
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem id="skills" className="!border !border-white/10 !bg-white/5">
          <AccordionHeader itemId="skills">
            <CategoryHeader
              title="Skills"
              categoryScore={feedback.skills.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={feedback.skills.tips as Tip[]} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;
