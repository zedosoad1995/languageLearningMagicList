import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.user.create({
    data: {
      settings: {
        create: {
          words_per_day: 5,
        },
      },
    },
  });

  await prisma.word.deleteMany();
  await prisma.word.createMany({
    data: [
      {
        original: "Mutter (f)",
        translation: "mother",
        knowledge: 5,
        relevance: 5,
      },
      {
        original: "Esel (m)",
        translation: "donkey",
        knowledge: 3,
        relevance: 2,
      },
      {
        original: "Kröte (f)",
        translation: "toad",
        knowledge: 2,
        relevance: 2,
      },
      {
        original: "Frosch (m)",
        translation: "frog",
        knowledge: 2,
        relevance: 2,
      },
      {
        original: "Augenbraue (f)",
        translation: "eyebrow",
        knowledge: 3,
        relevance: 3,
      },
      {
        original: "Wimper(n) (f)",
        translation: "eyelash",
        knowledge: 1,
        relevance: 3,
      },
      {
        original: "Nabel (m)",
        translation: "navel",
        knowledge: 2,
        relevance: 3,
      },
      {
        original: "misstrauisch",
        translation: "distrustful",
        knowledge: 2,
        relevance: 2,
      },
      {
        original: "vertrauen",
        translation: "to trust",
        knowledge: 4,
        relevance: 4,
      },
    ],
  });
}

main()
  .then(() => {
    console.log("Seed successful!");
  })
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
