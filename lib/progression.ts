interface DataPoint {
  date: Date;
  weight: number;
}

interface ProgressionResult {
  trend: number;
  suggestion: "increase" | "maintain" | "deload";
  confidence: "low" | "medium" | "high";
}

export function calculateProgression(logs: DataPoint[]): ProgressionResult {
  if (logs.length < 3) {
    return { trend: 0, suggestion: "maintain", confidence: "low" };
  }

  const n = logs.length;
  const firstDate = logs[0].date.getTime();

  const xs = logs.map(
    (l) => (l.date.getTime() - firstDate) / (1000 * 60 * 60 * 24 * 7)
  );
  const ys = logs.map((l) => l.weight);

  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((sum, x, i) => sum + x * ys[i], 0);
  const sumX2 = xs.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  let suggestion: ProgressionResult["suggestion"] = "maintain";
  if (slope > 0.3) suggestion = "increase";
  if (slope < -0.2) suggestion = "deload";

  return {
    trend: Number(slope.toFixed(2)),
    suggestion,
    confidence: n >= 8 ? "high" : n >= 5 ? "medium" : "low",
  };
}