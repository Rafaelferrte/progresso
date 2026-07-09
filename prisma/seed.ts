import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const supino = await prisma.exercise.create({
    data: { name: "Supino reto", muscleGroup: "Peito" },
  });

  const baseDate = new Date();
  const weights = [60, 60, 62.5, 62.5, 65, 65, 67.5, 70];

  for (let i = 0; i < weights.length; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - (weights.length - i) * 7);

    await prisma.workoutLog.create({
      data: {
        exerciseId: supino.id,
        weight: weights[i],
        reps: 8,
        sets: 4,
        rpe: 7 + (i % 3),
        date,
      },
    });
  }

  console.log("Seed concluído!");
}

main().finally(() => prisma.$disconnect());