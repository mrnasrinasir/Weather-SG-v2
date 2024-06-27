// Initialize the map using Leaflet.js
const map = L.map('mapid').setView([1.3521, 103.8198], 11); // Centered on Singapore

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to fetch weather data from the backend
async function fetchWeather() {
    try {
        const response = await fetch("/weather");
        const data = await response.json();
        // Display valid period and weather cards/markers for each location
        displayValidPeriodAndWeather(data.items);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Function to display valid period and add weather cards and markers to the map
function displayValidPeriodAndWeather(items) {
    const weatherContainer = document.getElementById('weather-container');
    const validPeriodContainer = document.getElementById('valid-period-container');
    weatherContainer.innerHTML = '';

    // Assuming there's only one item with valid_period
    if (items.length > 0) {
        const validPeriod = items[0].valid_period;
        const validPeriodText = `
            <p><strong>Valid Period:</strong> From ${new Date(validPeriod.start).toLocaleTimeString()} to ${new Date(validPeriod.end).toLocaleTimeString()}</p>
        `;
        validPeriodContainer.innerHTML = validPeriodText;
    }

    items.forEach(item => {
        const { forecasts } = item;

        forecasts.forEach(forecast => {
            const { area, forecast: weather, lat, lon } = forecast;

            // Create a weather card
            const card = document.createElement('div');
            card.className = 'col-md-2';

            card.innerHTML = `
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">${area}</h5>
                        <p class="card-text">${weather}</p>
                    </div>
                </div>
            `;

            weatherContainer.appendChild(card);

            // Add a marker to the map
            const marker = L.marker([lat, lon]).addTo(map);
            marker.bindPopup(`<b>${area}</b><br>${weather}`).openPopup();
        });
    });
}

// Fetch weather data when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchWeather);
