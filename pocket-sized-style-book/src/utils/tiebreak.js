import { findTopAndTie } from "./scoring";
import { tiebreakerQuestions, suddenDeathQuestion } from "../data/questions";


export function nextTieRound(scores, alreadyInTieBreak) {
  const { isTie, tiedCodes } = findTopAndTie(scores);
  if (!isTie) return null;
  return alreadyInTieBreak
    ? [suddenDeathQuestion(...tiedCodes)]
    : tiebreakerQuestions(...tiedCodes);
}
