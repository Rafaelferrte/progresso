import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function createLog(formData: FormData) {
  "use server";

  const exerciseId = formData.get("exerciseId") as string;
  const weight = parseFloat(formData.get("weight") as string);
  const reps = parseInt(formData.get("reps") as string);
  const sets = parseInt(formData.get("sets") as string);
  const rpeRaw = formData.get("rpe") as string;
  const rpe = rpeRaw ? parseInt(rpeRaw) : null;

  await prisma.workoutLog.create({
    data: { exerciseId, weight, reps, sets, rpe },
  });

  revalidatePath(`/exercises/${exerciseId}`);
  redirect(`/exercises/${exerciseId}`);
}

export default async function NewLogPage() {
  const exercises = await prisma.exercise.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Registrar treino</h1>

      <form action={createLog} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Exercício</label>
          <select
            name="exerciseId"
            required
            className="w-full border rounded-lg p-2"
          >
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Carga (kg)</label>
          <input
            type="number"
            name="weight"
            step="0.5"
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Séries</label>
            <input
              type="number"
              name="sets"
              required
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reps</label>
            <input
              type="number"
              name="reps"
              required
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            RPE (1-10, opcional)
          </label>
          <input
            type="number"
            name="rpe"
            min="1"
            max="10"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg p-2 font-medium hover:bg-blue-700 transition"
        >
          Salvar treino
        </button>
      </form>
    </main>
  );
}