import { prisma } from "@/lib/prisma";
import { calculateProgression } from "@/lib/progression";
import { ProgressChart } from "@/components/ProgressChart";
import { notFound } from "next/navigation";

const suggestionLabels = {
  increase: { text: "Hora de aumentar a carga 💪", color: "text-green-600" },
  maintain: { text: "Manter a carga atual", color: "text-blue-600" },
  deload: { text: "Considere reduzir a carga (deload)", color: "text-orange-600" },
};

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const exercise = await prisma.exercise.findUnique({
    where: { id },
    include: { workoutLogs: { orderBy: { date: "asc" } } },
  });

  if (!exercise) notFound();

  const progression = calculateProgression(
    exercise.workoutLogs.map((log) => ({ date: log.date, weight: log.weight }))
  );

  const chartData = exercise.workoutLogs.map((log) => ({
    date: new Date(log.date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
    weight: log.weight,
  }));

  const suggestion = suggestionLabels[progression.suggestion];

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold">{exercise.name}</h1>
      <p className="text-gray-500 mb-6">{exercise.muscleGroup}</p>

      <div className="border rounded-lg p-4 mb-6">
        <ProgressChart data={chartData} />
      </div>

      <div className="border rounded-lg p-4 space-y-2">
        <p className={`font-semibold ${suggestion.color}`}>{suggestion.text}</p>
        <p className="text-sm text-gray-600">
          Tendência: {progression.trend > 0 ? "+" : ""}
          {progression.trend} kg/semana
        </p>
        <p className="text-xs text-gray-400">
          Confiança: {progression.confidence} ({exercise.workoutLogs.length} registros)
        </p>
      </div>
    </main>
  );
}