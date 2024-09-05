// // src/Game.js
// import React, { useState } from "react";

// const Game = ({ countries }) => {
//   // State to hold current question
//   const [question, setQuestion] = useState(null);
//   const [score, setScore] = useState(0);

//   // Shuffle logic to select a country
//   const getRandomCountry = () => {
//     const randomIndex = Math.floor(Math.random() * countries.length);
//     return countries[randomIndex];
//   };

//   const startNewQuestion = () => {
//     const country = getRandomCountry();
//     setQuestion(country);
//     // Reset other states if needed
//   };

//   // Guessing logic goes here
//   const checkAnswer = (answer) => {
//     // Validate the answer against the current question
//   };

//   return (
//     <div>
//       <h1>Country Quiz Game</h1>
//       {question ? (
//         <>
//           <h2>What is the capital of {question.name.common}?</h2>
//           {/* Provide input for user's guess */}
//           <button onClick={() => checkAnswer("userGuess")}>Submit</button>
//         </>
//       ) : (
//         <button onClick={startNewQuestion}>Start Game</button>
//       )}
//       <p>Score: {score}</p>
//     </div>
//   );
// };

// export default Game;

