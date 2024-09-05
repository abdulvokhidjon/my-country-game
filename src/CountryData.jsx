// // src/CountryData.js
// import axios from "axios";
// import { useEffect, useState } from "react";

// const CountryData = ({ setCountries }) => {
//   useEffect(() => {
//     const fetchCountries = async () => {
//       const response = await axios.get("https://restcountries.com/v3.1/all");
//       setCountries(response.data);
//     };
//     fetchCountries();
//   }, [setCountries]);

//   return null;
// };

// export default CountryData;
