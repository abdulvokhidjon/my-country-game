import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FaFlag,
  FaCity,
  FaMapMarkerAlt,
  FaCheck,
  FaTimes,
  FaQuestionCircle,
} from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./App.css";

const apiUrl = "https://restcountries.com/v3.1/all";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [countries, setCountries] = useState([]);
  const [currentQuestionType, setCurrentQuestionType] = useState("flag");
  const [currentCountry, setCurrentCountry] = useState({});
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHintButton, setShowHintButton] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setCountries(data);
      generateQuestion(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const generateQuestion = (countriesList) => {
    if (!countriesList || countriesList.length === 0) return;

    setHintUsed(false);
    setShowHintButton(true);
    setProgress((prev) => Math.min(prev + 1, 10));

    const randomCountry =
      countriesList[Math.floor(Math.random() * countriesList.length)];
    setCurrentCountry(randomCountry);

    let correctAnswer = randomCountry.name.common;
    const incorrectAnswers = [];
    while (incorrectAnswers.length < 3) {
      const randomIncorrectCountry =
        countriesList[Math.floor(Math.random() * countriesList.length)];
      if (
        randomIncorrectCountry.name.common !== correctAnswer &&
        !incorrectAnswers.includes(randomIncorrectCountry.name.common)
      ) {
        incorrectAnswers.push(randomIncorrectCountry.name.common);
      }
    }

    const optionsArray = [correctAnswer, ...incorrectAnswers];
    optionsArray.sort(() => Math.random() - 0.5);
    setOptions(optionsArray);
  };

  const handleAnswer = (option) => {
    setSelected(option);
    const isCorrect = option === currentCountry.name.common;

    if (isCorrect) {
      toast.success(
        <span>
          <FaCheck /> Correct!
        </span>,
        { style: { background: "#4caf50", color: "#fff" } }
      );
      setScore(score + 1);
      setCorrectAnswers(correctAnswers + 1);
    } else {
      toast.error(
        <span>
          <FaTimes /> Wrong answer!
        </span>,
        { style: { background: "#f44336", color: "#fff" } }
      );
      setIncorrectAnswers(incorrectAnswers + 1);
    }

    setTimeout(() => {
      generateQuestion(countries);
      setSelected(null);
    }, 2000);
  };

  const handleHint = () => {
    if (!hintUsed && currentCountry) {
      let hintText = "";
      if (currentQuestionType === "flag" && currentCountry.flags) {
        hintText = `The flag of ${currentCountry.name.common} has colors ${
          currentCountry.flags.alt?.toLowerCase() || "no data"
        }`;
      } else if (currentQuestionType === "capital" && currentCountry.capital) {
        hintText = `The capital of ${currentCountry.name.common} is ${currentCountry.capital[0]}`;
      } else if (currentQuestionType === "borders" && currentCountry.borders) {
        hintText = `One of the countries bordering ${currentCountry.name.common} is ${currentCountry.borders[0]}`;
      }
      toast.success(`Hint: ${hintText}`);
      setHintUsed(true);
      setShowHintButton(false);
    }
  };

  const handleQuestionTypeChange = (type) => {
    setCurrentQuestionType(type);
    generateQuestion(countries);
  };

  const chartData = {
    labels: ["Correct Answers", "Incorrect Answers"],
    datasets: [
      {
        label: "Number of Answers",
        data: [correctAnswers, incorrectAnswers],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  return (
    <div className="App">
      <Toaster />
      <div className="game-container">
        <div
          className="progress-bar"
          style={{ width: `${(progress / 10) * 100}%` }}
        ></div>
        <h1>Guess the Country</h1>
        <p className="description">
          Try to guess the country based on its flag, capital, or borders. Use
          hints if you're stuck!
        </p>
        <div className="question-type-selector">
          <button
            className={`question-type ${
              currentQuestionType === "flag" ? "active" : ""
            }`}
            onClick={() => handleQuestionTypeChange("flag")}
          >
            <FaFlag /> Flag
          </button>
          <button
            className={`question-type ${
              currentQuestionType === "capital" ? "active" : ""
            }`}
            onClick={() => handleQuestionTypeChange("capital")}
          >
            <FaCity /> Capital
          </button>
          <button
            className={`question-type ${
              currentQuestionType === "borders" ? "active" : ""
            }`}
            onClick={() => handleQuestionTypeChange("borders")}
          >
            <FaMapMarkerAlt /> Borders
          </button>
        </div>
        <div className="game-grid">
          <div className="column">
            {currentQuestionType === "flag" && currentCountry.flags && (
              <>
                <h2>
                  <FaFlag /> Guess the Country by Flag
                </h2>
                <img
                  src={currentCountry.flags.svg}
                  alt="Country Flag"
                  className="flag"
                />
              </>
            )}
            {currentQuestionType === "capital" && currentCountry.capital && (
              <>
                <h2>
                  <FaCity /> Guess the Country by Capital
                </h2>
                <p>{currentCountry.capital[0]}</p>
              </>
            )}
            {currentQuestionType === "borders" && currentCountry.borders && (
              <>
                <h2>
                  <FaMapMarkerAlt /> Guess the Country by Borders
                </h2>
                <p>
                  {currentCountry.borders.length > 0
                    ? currentCountry.borders.map((border, index) => (
                        <span key={index}>
                          {border}
                          {index < currentCountry.borders.length - 1 && ", "}
                        </span>
                      ))
                    : "No border data available"}
                </p>
              </>
            )}
            <div className="options">
              {options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${
                    selected === option
                      ? option === currentCountry.name.common
                        ? "correct"
                        : "incorrect"
                      : ""
                  }`}
                  onClick={() => handleAnswer(option)}
                  disabled={selected !== null}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="column">
            <h2>Score: {score}</h2>
            {showHintButton && (
              <button onClick={handleHint} className="hint-button">
                <FaQuestionCircle /> Hint
              </button>
            )}
            <div className="charts">
              <h2>Statistics</h2>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
