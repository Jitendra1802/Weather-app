async function getWeather() {
  const location = document.getElementById("locationInput").value.trim();
  const resultDiv = document.getElementById("result");
  const forecastDiv = document.getElementById("forecast");

  if (!location) {
    resultDiv.innerText = "⚠️ Please enter a city name.";
    if (forecastDiv) forecastDiv.innerHTML = "";
    return;
  }

  const apiKey = "ccf2cb579ee04b9689153155250606";
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=5&aqi=yes`;

  resultDiv.innerText = "⏳ Loading...";
  if (forecastDiv) forecastDiv.innerHTML = "";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 400 || response.status === 404) {
        throw new Error("Invalid city name or location not found");
      }
      throw new Error(`API request failed (Status: ${response.status})`);
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

    // Render 5-Day Forecast
    if (forecastDiv) {
      const forecastDays = data.forecast && Array.isArray(data.forecast.forecastday)
        ? data.forecast.forecastday
        : [];

      if (forecastDays.length === 0) {
        forecastDiv.innerHTML = `
          <div class="forecast-section">
            <p>⚠️ Forecast data is unavailable for this location.</p>
          </div>
        `;
        return;
      }

      const cardsHtml = forecastDays.map((dayData) => {
        const dateObj = new Date(dayData.date + "T00:00:00");
        const formattedDate = dateObj.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric"
        });

        const dayCondition = dayData.day.condition.text;
        const dayIcon = dayData.day.condition.icon;
        const maxTemp = dayData.day.maxtemp_c;
        const minTemp = dayData.day.mintemp_c;
        const dayHumidity = dayData.day.avghumidity;
        const maxWind = dayData.day.maxwind_kph;
        const rainChance = dayData.day.daily_chance_of_rain !== undefined 
          ? `${dayData.day.daily_chance_of_rain}%` 
          : "N/A";

        return `
          <div class="forecast-card">
            <div class="forecast-date">${formattedDate}</div>
            <img src="https:${dayIcon}" alt="${dayCondition}">
            <div class="forecast-condition">${dayCondition}</div>
            <p class="forecast-temp">🌡️ Max: ${maxTemp}°C</p>
            <p class="forecast-temp min-temp">❄️ Min: ${minTemp}°C</p>
            <p>💧 Humidity: ${dayHumidity}%</p>
            <p>💨 Wind: ${maxWind} km/h</p>
            <p>🌧️ Rain Chance: ${rainChance}</p>
          </div>
        `;
      }).join("");

      forecastDiv.innerHTML = `
        <div class="forecast-section">
          <h3 class="forecast-title">📅 ${forecastDays.length}-Day Forecast</h3>
          <div class="forecast-cards">
            ${cardsHtml}
          </div>
        </div>
      `;
    }

  } catch (error) {
    resultDiv.innerText =
      `❌ Error: ${error.message}`;
    if (forecastDiv) forecastDiv.innerHTML = "";
  }
}