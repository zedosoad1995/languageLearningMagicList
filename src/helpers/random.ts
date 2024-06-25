export const pickRandomIndex = (scores: number[]) => {
  const sumScores = scores.reduce((prev, score) => prev + score, 0);

  let rand = Math.random() * sumScores;
  for (let i = 0; i < scores.length; i++) {
    const score = scores[i];

    if (rand < score) return i;
    rand -= score;
  }

  return -1;
};
