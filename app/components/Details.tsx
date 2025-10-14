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
  const bg =
    tone === "green"
      ? "bg-green-100"
      : tone === "yellow"
        ? "bg-yellow-100"
        : "bg-red-100";
  const text =
    tone === "green"
      ? "text-green-700"
      : tone === "yellow"
        ? "text-yellow-700"
        : "text-red-700";
  const icon =
    tone === "green"
      ? "/icons/check.svg"
      : tone === "yellow"
        ? "/icons/warning.svg"
        : "/icons/ats-bad.svg";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        bg,
        text,
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
      <h4 className="text-sm sm:text-base font-semibold text-gray-800">
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
    <div className="space-y-4">
      {/* Two-column grid of brief tips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {tips.map((t, idx) => {
          const isGood = t.type === "good";
          const icon = isGood ? "/icons/check.svg" : "/icons/warning.svg";
          const textColor = isGood ? "text-green-700" : "text-yellow-700";
          const bg = isGood ? "bg-green-50" : "bg-yellow-50";
          return (
            <div
              key={idx}
              className={cn(
                "flex items-start gap-2 rounded-md px-2 py-1.5",
                bg,
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
      <div className="space-y-2">
        {tips.map((t, idx) => {
          const isGood = t.type === "good";
          const border = isGood ? "border-green-200" : "border-yellow-200";
          const bg = isGood ? "bg-green-50" : "bg-yellow-50";
          const heading = isGood ? "Good" : "Improve";
          const headingColor = isGood ? "text-green-700" : "text-yellow-700";
          return (
            <div
              key={`exp-${idx}`}
              className={cn("rounded-lg border p-3", border, bg)}
            >
              <p
                className={cn("text-xs font-semibold uppercase", headingColor)}
              >
                {heading}
              </p>
              <p className="mt-1 text-sm text-gray-700">{t.explanation}</p>
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
        className="rounded-xl border border-gray-200 bg-white"
      >
        {/* Tone & Style */}
        <AccordionItem id="tone">
          <AccordionHeader itemId="tone" className="hover:bg-gray-50">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={feedback.toneAndStyle.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone" className="bg-gray-50/40">
            <CategoryContent tips={feedback.toneAndStyle.tips as Tip[]} />
          </AccordionContent>
        </AccordionItem>

        {/* Content */}
        <AccordionItem id="content">
          <AccordionHeader itemId="content" className="hover:bg-gray-50">
            <CategoryHeader
              title="Content"
              categoryScore={feedback.content.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="content" className="bg-gray-50/40">
            <CategoryContent tips={feedback.content.tips as Tip[]} />
          </AccordionContent>
        </AccordionItem>

        {/* Structure */}
        <AccordionItem id="structure">
          <AccordionHeader itemId="structure" className="hover:bg-gray-50">
            <CategoryHeader
              title="Structure"
              categoryScore={feedback.structure.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure" className="bg-gray-50/40">
            <CategoryContent tips={feedback.structure.tips as Tip[]} />
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem id="skills">
          <AccordionHeader itemId="skills" className="hover:bg-gray-50">
            <CategoryHeader
              title="Skills"
              categoryScore={feedback.skills.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills" className="bg-gray-50/40">
            <CategoryContent tips={feedback.skills.tips as Tip[]} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;
