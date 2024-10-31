document.getElementById("weatherForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const city = document.getElementById("cityInput").value;
    const country = document.getElementById("countryInput").value;
    getWeather(city, country);
});

async function getWeather(city, country) {
    const apiKey = "2317ed4800c701ba704e79c16ffd08f9"; // This API key may be invalid or expired
    const query = country ? `${city},${country}` : city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&APPID=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.status === 401) {
            throw new Error("Invalid API key. Please check your OpenWeather API key.");
        } else if (response.status === 404 || data.cod === "404") {
            throw new Error("City not found. Please check the city name and try again.");
        } else if (!response.ok) {
            throw new Error("An error occurred while fetching weather data.");
        }
        
        displayWeather(data);
    } catch (error) {
        const weatherResult = document.getElementById("weatherResult");
        weatherResult.textContent = error.message;
        weatherResult.style.backgroundColor = "rgba(255,0,0,0.1)";
    }
}

function displayWeather(data) {
    const { name } = data;
    const { temp } = data.main;
    const { main: weatherType, description } = data.weather[0];
    
    const weatherResult = document.getElementById("weatherResult");
    const container = document.querySelector("body");
    
    // Update weather information
    weatherResult.innerHTML = `
        <h2>${name}</h2>
        <div class="weather-icon"></div>
        <p>${Math.round(temp)}°C</p>
        <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
    `;

    // Remove all weather classes
    container.classList.remove("sunny", "rainy", "cloudy", "snowy", "stormy");
    
    // Add appropriate weather class
    switch(weatherType.toLowerCase()) {
        case "clear":
            container.classList.add("sunny");
            break;
        case "rain":
        case "drizzle":
            container.classList.add("rainy");
            break;
        case "clouds":
            container.classList.add("cloudy");
            break;
        case "snow":
            container.classList.add("snowy");
            break;
        case "thunderstorm":
            container.classList.add("stormy");
            break;
        default:
            container.classList.add("cloudy");
    }
}