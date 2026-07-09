import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const recentLogs = await prisma.workoutLog.findMany({
    orderBy: { date: "desc" },
    take: 5,
    include: { exercise: true },
  });

  const exerciseCount = await prisma.exercise.count();

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-1">Progresso</h1>
      <p className="text-gray-500 mb-8">
        Acompanhe sua evolução de carga nos treinos
      </p>

      <div className="flex gap-3 mb-8">
        <Link
          href="/log/new"
          className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition"
        >
          + Registrar treino
        </Link>
        <Link
          href="/exercises"
          className="border rounded-lg px-4 py-2 font-medium hover:bg-gray-50 transition"
        >
          Ver exercícios ({exerciseCount})
        </Link>
      </div>

      <h2 className="text-lg font-semibold mb-3">Últimos treinos</h2>
      <ul className="space-y-2">
        {recentLogs.map((log) => (
          <li
            key={log.id}
            className="flex justify-between items-center border rounded-lg p-3"
          >
            <div>
              <p className="font-medium">{log.exercise.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(log.date).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <p className="font-semibold">
              {log.weight}kg × {log.reps} ({log.sets}x)
            </p>
          </li>
        ))}
        {recentLogs.length === 0 && (
          <p className="text-gray-400 text-sm">Nenhum treino registrado ainda.</p>
        )}
      </ul>
    </main>
  );
}