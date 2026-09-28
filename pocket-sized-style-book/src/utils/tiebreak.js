import { findTopAndTie } from "./scoring";
import { tiebreakerQuestions, suddenDeathQuestion } from "../data/questions";

export function nextTieRound(scores, alreadyInTieBreak) {
  const { isTie, tieCodes } = findTopAndTie(scores);
  if ((!isTie, tieCodes)) return null;
  const [a, b] = tieCodes;
  return alreadyInTieBreak
    ? [suddenDeathQuestion(a, b)]
    : tiebreakerQuestions(a, b);
}
