import { useState } from "react";
import "./styles/App.css";
import Header from "./components/Header.jsx";
import IntroScreen from "./components/IntroScreen.jsx";
import QuizScreen from "./components/QuizScreen.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import ResultsScreen from "./components/ResultsScreen.jsx";
import { QUESTIONS, tiebreakerQuestions } from "./data/questions.js";
import { emptyScores, findTopAndTie } from "./utils/scoring.js";
import { generateStyleProfile, categoryCodeFromName } from "./utils/llm.js";

const SCREENS = {
  INTRO: "intro",
  QUIZ: "quiz",
  LOADING: "loading",
  RESULTS: "results",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.INTRO);
  const [activeQuestions, setActiveQuestions] = useState(QUESTIONS);
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState(emptyScores());
  const [chosenLabels, setChosenLabels] = useState([]);
  const [inTiebreak, setInTiebreak] = useState(false);
  const [profile, setProfile] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [resultCategoryCode, setResultCategoryCode] = useState(null);

  function startQuiz() {
    setActiveQuestions(QUESTIONS);
    setIndex(0);
    setScores(emptyScores());
    setChosenLabels([]);
    setInTiebreak(false);
    setScreen(SCREENS.QUIZ);
  }

  async function handleAnswer(categoryCode, label) {
    const nextScores = {
      ...scores,
      [categoryCode]: (scores[categoryCode] || 0) + 1,
    };
    const nextLabels = [...chosenLabels, label];
    setScores(nextScores);
    setChosenLabels(nextLabels);

    const nextIndex = index + 1;
    if (nextIndex < activeQuestions.length) {
      setIndex(nextIndex);
      return;
    }
    if (!inTiebreak) {
      const { isTie, tiedCodes } = findTopAndTie(nextScores);
      if (isTie) {
        setInTiebreak(true);
        setActiveQuestions(tiebreakerQuestions(tiedCodes[0], tiedCodes[1]));
        setIndex(0);
        return;
      }
    }

    await runLLMProfile(nextScores, nextLabels);
  }

  async function runLLMProfile(finalScores, finalLabels) {
    setScreen(SCREENS.LOADING);
    const { topCode } = findTopAndTie(finalScores);
    const { result, usedFallback: fellBack } = await generateStyleProfile({
      scores: finalScores,
      chosenLabels: finalLabels,
      topCode,
    });

    const code = categoryCodeFromName(result.aestheticName, topCode);
    setProfile(result);
    setUsedFallback(fellBack);
    setResultCategoryCode(code);
    setScreen(SCREENS.RESULTS);
  }

  function restart() {
    setScreen(SCREENS.INTRO);
  }

  return (
    <div className="app">
      <div className="stitch" />
      <Header />
      <main>
        {screen === SCREENS.INTRO && <IntroScreen onStart={startQuiz} />}
        {screen === SCREENS.QUIZ && (
          <QuizScreen
            question={activeQuestions[index]}
            index={index}
            total={activeQuestions.length}
            onAnswer={handleAnswer}
          />
        )}
        {screen === SCREENS.LOADING && <LoadingScreen />}
        {screen === SCREENS.RESULTS && profile && (
          <ResultsScreen
            profile={profile}
            usedFallback={usedFallback}
            categoryCode={resultCategoryCode}
            onRestart={restart}
          />
        )}
      </main>
    </div>
  );
}
