import express from "express";
import axios from "axios";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Latitude and longitude mapping for each area in Singapore
const locationCoordinates = {
    "Ang Mo Kio": { lat: 1.3691, lon: 103.8454 },
    "Bedok": { lat: 1.3250, lon: 103.9301 },
    "Bishan": { lat: 1.3516, lon: 103.8485 },
    "Boon Lay": { lat: 1.3030, lon: 103.7069 },
    "Bukit Batok": { lat: 1.3536, lon: 103.7542 },
    "Bukit Merah": { lat: 1.2777, lon: 103.8195 },
    "Bukit Panjang": { lat: 1.3784, lon: 103.7641 },
    "Bukit Timah": { lat: 1.3294, lon: 103.8021 },
    "Central Water Catchment": { lat: 1.3604, lon: 103.8141 },
    "Changi": { lat: 1.3644, lon: 103.9915 },
    "Choa Chu Kang": { lat: 1.3854, lon: 103.7448 },
    "Clementi": { lat: 1.3151, lon: 103.7649 },
    "City": { lat: 1.2903, lon: 103.8518 },
    "Geylang": { lat: 1.3182, lon: 103.8844 },
    "Hougang": { lat: 1.3710, lon: 103.8921 },
    "Jalan Bahar": { lat: 1.3476, lon: 103.6703 },
    "Jurong East": { lat: 1.3325, lon: 103.7436 },
    "Jurong Island": { lat: 1.2719, lon: 103.6999 },
    "Jurong West": { lat: 1.3404, lon: 103.7090 },
    "Kallang": { lat: 1.3106, lon: 103.8623 },
    "Lim Chu Kang": { lat: 1.4220, lon: 103.7176 },
    "Mandai": { lat: 1.4017, lon: 103.7890 },
    "Marine Parade": { lat: 1.3022, lon: 103.9050 },
    "Novena": { lat: 1.3205, lon: 103.8435 },
    "Pasir Ris": { lat: 1.3731, lon: 103.9490 },
    "Paya Lebar": { lat: 1.3180, lon: 103.8915 },
    "Pioneer": { lat: 1.3198, lon: 103.6628 },
    "Pulau Tekong": { lat: 1.4014, lon: 104.0520 },
    "Pulau Ubin": { lat: 1.4052, lon: 103.9679 },
    "Punggol": { lat: 1.3994, lon: 103.9073 },
    "Queenstown": { lat: 1.2949, lon: 103.7879 },
    "Seletar": { lat: 1.4043, lon: 103.8701 },
    "Sembawang": { lat: 1.4480, lon: 103.8185 },
    "Sengkang": { lat: 1.3964, lon: 103.8952 },
    "Sentosa": { lat: 1.2494, lon: 103.8303 },
    "Serangoon": { lat: 1.3532, lon: 103.8702 },
    "Southern Islands": { lat: 1.2331, lon: 103.8474 },
    "Sungei Kadut": { lat: 1.4152, lon: 103.7583 },
    "Tampines": { lat: 1.3495, lon: 103.9568 },
    "Tanglin": { lat: 1.3065, lon: 103.8125 },
    "Tengah": { lat: 1.3755, lon: 103.7159 },
    "Toa Payoh": { lat: 1.3343, lon: 103.8566 },
    "Tuas": { lat: 1.3217, lon: 103.6493 },
    "Western Islands": { lat: 1.2602, lon: 103.7463 },
    "Western Water Catchment": { lat: 1.3419, lon: 103.6741 },
    "Woodlands": { lat: 1.4385, lon: 103.7865 },
    "Yishun": { lat: 1.4182, lon: 103.8390 }
};

// Route to fetch and process weather data
app.get("/weather", async (req, res) => {
    try {
        const response = await axios.get("https://api.data.gov.sg/v1/environment/2-hour-weather-forecast");
        const data = response.data;

        // Map coordinates to each forecast
        const items = data.items.map(item => ({
            timestamp: item.timestamp,
            valid_period: item.valid_period,
            forecasts: item.forecasts.map(forecast => ({
                area: forecast.area,
                forecast: forecast.forecast,
                lat: locationCoordinates[forecast.area]?.lat || 0,
                lon: locationCoordinates[forecast.area]?.lon || 0
            }))
        }));

        res.json({ items });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching weather data");
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
