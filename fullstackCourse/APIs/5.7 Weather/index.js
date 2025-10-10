import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_KEY = "dddcbeb35a95273e1d077c5fe2ddbd22";

const geo_url = "http://api.openweathermap.org/geo/1.0/direct";
const weather_url = "https://api.openweathermap.org/data/3.0"

const units = "imperial";
const city = "Las Vegas";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');


app.get("/", async (req, res) => {
  res.render("index");
});


app.post("/get-weather", async (req, res) => {
  const location = req.body.location;
  try {
    const response = await axios.get((geo_url + "?q=" + location + "&limit=1&apiKey=" + API_KEY));
       const lat = response.data[0].lat;
    const lon = response.data[0].lon;

    const weather = await axios.get(`${weather_url}/onecall?lat=${lat}&lon=${lon}&units=${units}&exclude=minutely,hourly,alerts&appid=${API_KEY}`);

   
        
        
    
    console.log(weather.data);
    res.render("index", {content: JSON.stringify(weather.data)});
  }
  catch (error) {
    console.log("Error");
      res.status(404).send(error.message);
  }
});

// New route for geolocation-based weather
app.post("/get-weather-by-location", async (req, res) => {
  console.log("Location request body:", req.body);
  const { lat, lon } = req.body;
  console.log(lat);
  
  if (!lat || !lon) {
    console.log("Missing lat or lon in request body");
    return res.status(400).send("Location coordinates are required");
  }
  
  try {
    const weather = await axios.get(`${weather_url}/onecall?lat=${lat}&lon=${lon}&units=${units}&exclude=minutely,hourly,alerts&appid=${API_KEY}`);
    
    console.log(weather.data);
    res.render("index", {content: JSON.stringify(weather.data)});
  }
  catch (error) {
    console.log("Error getting weather by location:", error.message);
    res.status(404).send(error.message);
  }
});
 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});