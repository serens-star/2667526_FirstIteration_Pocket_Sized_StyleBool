import { findTopAndTie } from "./scoring";
import { tiebreakerQuestions, suddenDeathQuestion } from "../data/questions";

export function nextTieRound(scores, alreadyInTieBreak) {
  const { isTie, tiedCodes } = findTopAndTie(scores);
  if (!isTie) return null;
  const [a, b] = tiedCodes;
  return alreadyInTieBreak
    ? [suddenDeathQuestion(a, b)]
    : tiebreakerQuestions(a, b);
}
