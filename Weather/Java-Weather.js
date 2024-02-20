const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "c37269e8265a11f3e26a94eb8e0ee88f";
let intervalId;

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value;

    if(city){
        try{
            const weatherData = await getWeatherData(city);
            console.log(weatherData)
            const timeData = await getTimeData(city);
            console.log(timeData)
            clearInterval(intervalId);
            displayWeatherInfo(weatherData, timeData);   
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please Input City Name");
    }
})

async function getTimeData(city){
    const timeApiUrl = `https://api.api-ninjas.com/v1/worldtime?city=${city}`;
    const timeKey = 'oQjxqPJuCkTssxhPZa5ecHJNJuRcczU3vCT3iXUH';

    const timeResponse = await fetch(timeApiUrl, {
        headers: {
            'X-Api-Key': timeKey
        }
    });

    if (!timeResponse.ok){
        throw new Error("Could not fetch time data");

    }

    return await timeResponse.json();
}

async function getWeatherData(city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok){
        throw new Error("Could not fetch weather data");

    }

    return await response.json();
}

function displayWeatherInfo(data, timeData){
    const {name: city, 
        main: {temp, humidity}, 
        weather: [{description, id}]} = data;
    const {date: date, hour: hour, minute: minute, second: second} = timeData

    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");
    const dateDisplay = document.createElement("p");
    const timer = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${((temp - 273.15)*9/5+32).toFixed(1)}°F`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);
    dateDisplay.textContent = date;

    [ogClock, newHour, newMin, newSec] =  getTime(hour, minute, second);
    timer.textContent = ogClock
    intervalId = setInterval(() =>{
        [ogClock, newHour, newMin, newSec] =  getTime(newHour, newMin, newSec);
        timer.textContent = ogClock
    }, 1000);

    cityDisplay.classList.add("cityDisplay");
    dateDisplay.classList.add("dateDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
    card.appendChild(dateDisplay);
    card.appendChild(timer);

}

function getTime(hour, minute, second){
    if (hour == 0){
        hour = 24;
    }
    second++;

    if (second > 59)
    {
        second = 0;
        minute++; 
        if (minute > 59)
        {
            minute = 0;
            hour++;
            if (hour == 25)
            {
                hour = 1
            }
        }
    }
    
    if (hour >= 12 && hour < 24){
        ind = "PM";
    }
    else{
        ind = "AM";
    }
    if (hour > 12){
        Displayhour = hour - 12;
    }
    else{
        Displayhour = hour;
    }

    minute = minute.toString().padStart(2, '0');
    second = second.toString().padStart(2, '0');

    return [Displayhour + ":" + minute + ":" + second + " " + ind, hour, minute, second];

}



function getWeatherEmoji(weatherId){

    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "⚡";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case (weatherId >= 600 && weatherId < 400):
            return "❄️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case (weatherId == 800):
            return "☀️";
        case (weatherId >= 801 && weatherId <810):    
            return "☁️";
        default:
            return "❓";
    }

}

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}