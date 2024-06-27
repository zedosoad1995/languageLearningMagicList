import { daysDiff } from "@/helpers/date";
import prisma from "@/helpers/prisma";
import { pickRandomIndex } from "@/helpers/random";
import { Prisma } from "@prisma/client";

const calculateScoreTraining = (
  {
    knowledge,
    last_seen,
    relevance,
    last_training_try: wordLastTrainingTry,
  }: {
    relevance: number;
    knowledge: number;
    last_seen: Date;
    last_training_try: number;
  },
  trainingTryNum: number
) => {
  const baseScore = (6 - knowledge) * relevance;
  const now = new Date();
  const daysSinceLastSeen = daysDiff(last_seen, now);
  const numTriesSinceLast = Math.max(trainingTryNum - wordLastTrainingTry, 1);

  const c = Math.max(numTriesSinceLast, daysSinceLastSeen + 1);

  return baseScore * c;
};

const calculateScore = ({
  knowledge,
  last_seen,
  relevance,
}: {
  relevance: number;
  knowledge: number;
  last_seen: Date;
}) => {
  const baseScore = (6 - knowledge) * relevance;
  const now = new Date();
  const daysSinceLastSeen = daysDiff(last_seen, now);

  return baseScore * (daysSinceLastSeen + 1);
};

const pickRandomWordsByScore = async (numWords: number) => {
  const allWords = await prisma.word.findMany();
  const scores = allWords.map((word) => calculateScore(word));

  const pickedWords: Prisma.PromiseReturnType<typeof prisma.word.findMany> = [];
  for (let i = 0; i < numWords; i++) {
    const indexPicked = pickRandomIndex(scores);

    if (indexPicked === -1) {
      return pickedWords;
    }

    const pickedWord = allWords[indexPicked];
    pickedWords.push(pickedWord);

    scores.splice(indexPicked, 1);
    allWords.splice(indexPicked, 1);
  }

  return pickedWords;
};

const pickRandomWordTraining = async (trainingTryNum: number) => {
  const allWords = await prisma.word.findMany();
  const scores = allWords.map((word) =>
    calculateScoreTraining(word, trainingTryNum)
  );

  const indexPicked = pickRandomIndex(scores);
  if (indexPicked === -1) {
    return;
  }

  return allWords[indexPicked];
};

export const WordModel = {
  ...prisma.word,
  pickRandomWordsByScore,
  pickRandomWordTraining,
};
