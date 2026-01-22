import clsx from "clsx";
import { CriticalIssue, RecommendedFix } from "@/types/speaker";

interface RecommendationsProps {
  room?: string;
  roomStatus?: string;
  criticalIssues?: CriticalIssue[];
  recommendedFixes?: RecommendedFix[];
  totalEstimatedCost?: number;
}
export default function Recommendations({
  room,
  roomStatus,
  criticalIssues,
  recommendedFixes,
  totalEstimatedCost,
}: RecommendationsProps) {
  // looping through criticalIssues to display them
  const severityClass: Record<"Critical" | "Warning" | "Minor", string> = {
    Critical: "bg-red-900/30 border-red-500",
    Warning: "bg-yellow-900/30 border-yellow-500",
    Minor: "bg-blue-900/30 border-blue-500",
  };
  const recommendationClass: Record<"High" | "Medium" | "Low", string> = {
    High: "bg-red-900/30 border-red-500",
    Medium: "bg-yellow-900/30 border-yellow-500",
    Low: "bg-blue-900/30 border-blue-500",
  };

  const getPercentageFromData = Number(roomStatus?.match(/(\d+)%/)?.[1] || "0");

  // using getPercentageFromData to determine color for room status
  const roomStatusColor =
    getPercentageFromData > 70
      ? "bg-green-400"
      : getPercentageFromData > 50
        ? "bg-yellow-400"
        : "bg-red-400";

  //Recommendations

  const displayFixes = recommendedFixes?.map(
    ({ issue_reference, solution, steps, estimated_cost_usd, priority }) => ({
      issue_reference,
      solution,
      steps,
      estimated_cost_usd,
      priority,
    }),
  );

  // critical Issues display
  const displayIssue = criticalIssues?.map((issue, index) => (
    <div
      key={index}
      className={clsx(
        "mt-6 p-6 bg-zinc-800/50 backdrop-blur-sm rounded-2xl max-w-4xl w-full border",
        severityClass[issue.severity],
      )}
    >
      <div className="font-semibold text-sm uppercase tracking-wide mb-2">
        {issue.severity}
      </div>
      <div className="text-white font-medium">{issue.title}</div>
      <p className="text-zinc-300 mt-1">{issue.description}</p>
      <p className="text-sm text-zinc-400 mt-2">Impact: {issue.impact}</p>
    </div>
  ));

  // Recommended Fixes display
  const displayRecmmendedFixes = displayFixes?.map((fix, index) => (
    <div
      key={index}
      className={clsx(
        "mt-6 p-6 bg-zinc-800/50 backdrop-blur-sm rounded-2xl max-w-4xl w-full border",
        recommendationClass[fix.priority],
      )}
    >
      <div className="font-semibold text-sm uppercase tracking-wide mb-2">
        {fix.issue_reference}
      </div>
      <div className="text-white font-medium">{fix.solution}</div>
      <p className="text-zinc-300 mt-1">{fix.steps}</p>
      <p className="text-sm text-zinc-400 mt-2">Priority: {fix.priority}</p>
      <p className="text-sm text-zinc-400 mt-2">
        Estimated Cost: {fix.estimated_cost_usd} USD
      </p>
    </div>
  ));

  return (
    <>
      <section className="mt-6 bg-zinc-800/50 backdrop-blur-sm rounded-2xl max-w-4xl w-full">
        <div className="text-3xl font-ubuntu items-center justify-center text-white mb-4 text-center p-6 m-6">
          Type of Room: {room}
        </div>
        <div>{displayIssue}</div>
      </section>
      <section
        className={clsx(
          "mt-6 backdrop-blur-sm rounded-2xl max-w-4xl w-full",
          roomStatusColor,
        )}
      >
        <div className="text-3xl font-ubuntu items-center justify-center text-white mb-4 text-center p-6 m-6">
          Room Score: {roomStatus}
        </div>
      </section>
      <section className="mt-6 bg-zinc-800/50 backdrop-blur-sm rounded-2xl max-w-4xl w-full">
        <div className="text-3xl font-ubuntu items-center justify-center text-white mb-4 text-center p-6 m-6">
          Recommended Fixes
        </div>
        <div>{displayRecmmendedFixes}</div>
        <div className="text-3xl font-popins items-center justify-center text-white mb-4 text-center p-6 m-6">
          Estimated Cost to Fix Issues: {totalEstimatedCost} USD
        </div>
      </section>
    </>
  );
}
