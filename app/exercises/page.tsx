import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ExercisesPage() {
  const exercises = await prisma.exercise.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Exercícios</h1>
      <ul className="space-y-3">
        {exercises.map((ex) => (
          <li key={ex.id}>
            <Link
              href={`/exercises/${ex.id}`}
              className="block border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <p className="font-medium">{ex.name}</p>
              <p className="text-sm text-gray-500">{ex.muscleGroup}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}