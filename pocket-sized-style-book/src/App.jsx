import { useState, UseCallback } from "react";
import "./styles/App.css";
import Header from "./components/Header.jsx";
import SplashScreen from "./components/SplashScreen.jsx";
import LandingScreen from "./components/LandingScreen.jsx";
import QuizScreen from "./components/QuizScreen.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import ResultsScreen from "./components/ResultsScreen.jsx";
import { QUESTIONS, tiebreakerQuestions } from "./data/questions.js";
import { emptyScores, findTopAndTie } from "./utils/scoring.js";
import { generateStyleProfile, categoryCodeFromName } from "./utils/llm.js";

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem("psb_user"));
  } catch {
    return null;
  }
}

function signIn(u, setUser, start) {
  try {
    localStorage.setItem("psb_user", JSON.stringify(u));
  } catch {}
  setUser(u);
  start();
}

const SCREENS = {
  SPLASH: "splash",
  LANDING: "landing",
  QUIZ: "quiz",
  LOADING: "loading",
  RESULTS: "results",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.SPLASH);
  const [user, setUser] = useState(loadUser);
  const goLanding = useCallback(() => setScreen(SCREENS.LANDING), []);
  const [activeQuestions, setActiveQuestions] = useState(QUESTIONS);
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState(emptyScores());
  const [answers, setAnswers] = useState([]);
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
    setAnswers([]);
    setInTiebreak(false);
    setScreen(SCREENS.QUIZ);
  }

  function goBack() {
    const last = answers[answers.length - 1];
    if (index === 0 || !last) return;
    setScores((sc) => ({
      ...sc,
      [last.code]: Math.max(0, (sc[last.code] || 0) - 1),
    }));
    setAnswers((a) => a.slice(0, -1));
    setChosenLabels((l) => l.slice(0, -1));
    setIndex(index - 1);
  }

  async function handleAnswer(categoryCode, label) {
    const nextScores = {
      ...scores,
      [categoryCode]: (scores[categoryCode] || 0) + 1,
    };
    const nextLabels = [...chosenLabels, label];
    setScores(nextScores);
    setAnswers((a) => [...a, { label, code: categoryCode }]);
    setChosenLabels(nextLabels);

    const nextIndex = index + 1;
    if (nextIndex < activeQuestions.length) {
      setIndex(nextIndex);
      return;
    }
    const round = nextTieRound(nextScores, inTiebreak);
    if (round) {
      setInTiebreak(true);
      setActiveQuestions(round);
      setIndex(0);
      return;
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

  function signOut() {
    try {
      localStorage.removeItem("psb_user");
    } catch {}
    setUser(null);
  }

  function restart() {
    setScreen(SCREENS.LANDING);
  }

  if (screen === SCREENS.SPLASH) return <SplashScreen onDone={goLanding} />;
  if (screen === SCREENS.LANDING)
    return (
      <LandingScreen
        user={user}
        onExplore={startQuiz}
        onSignIn={(u) => signIn(u, setUser, StartQuiz)}
        onSignOut={signOut}
      />
    );

  return (
    <div className="app">
      <div className="stitch" />
      <Header />
      <main>
        {screen === SCREENS.QUIZ && (
          <QuizScreen
            question={activeQuestions[index]}
            index={index}
            total={activeQuestions.length}
            onAnswer={handleAnswer}
            onBack={index > 0 ? goBack : null}
          />
        )}
        {screen === SCREENS.LOADING && <LoadingScreen />}
        {screen === SCREENS.RESULTS && profile && (
          <ResultsScreen
            profile={profile}
            usedFallback={usedFallback}
            categoryCode={resultCategoryCode}
            scores={scores}
            answers={answers}
            onRestart={restart}
          />
        )}
      </main>
    </div>
  );
}
