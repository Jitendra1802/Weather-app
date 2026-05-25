async function getWeather() {
  const location = document.getElementById("locationInput").value.trim();

  if (!location) {
    document.getElementById("result").innerText =
      "⚠️ Please enter a city name.";
    return;
  }

  const apiKey = "ccf2cb579ee04b9689153155250606";
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;

  document.getElementById("result").innerText = "⏳ Loading...";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Invalid city name or location not found");
    }

    const data = await response.json();

    const cityName = data.location.name;
    const country = data.location.country;
    const tempC = data.current.temp_c;
    const humidity = data.current.humidity;
    const windSpeed = data.current.wind_kph;
    const condition = data.current.condition.text;
    const icon = data.current.condition.icon;
    const dateTime = data.location.localtime;

    document.getElementById("result").innerHTML = `
    <img src="https:${icon}" alt="Weather Icon">
    <h2>${cityName}, ${country}</h2>
    <p>🕒 ${dateTime}</p>
    <p>🌡️ Temperature: ${tempC}°C</p>
    <p>💧 Humidity: ${humidity}%</p>
    <p>💨 Wind Speed: ${windSpeed} km/h</p>
    <p>🌥️ Condition: ${condition}</p>
  `;
    

  } catch (error) {
    document.getElementById("result").innerText =
      `❌ Error: ${error.message}`;
  }
}
