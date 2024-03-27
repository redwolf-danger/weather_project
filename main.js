const userWeatherTab=document.querySelector('[userWeather]');
const searchWeatherTab=document.querySelector('[searchWeather]');

const userContainer=document.querySelector('.user-weather-container');
const searchContainer=document.querySelector('.search-weather-container');
const grantContainer=document.querySelector('.grant-location-container');
const loadingContainer=document.querySelector('.loading-container');
const errorContainer=document.querySelector('.error-page-container');

const searchInputField=document.querySelector('[searchInputField]');

const grantLocationBtn=document.querySelector('[grantLocationBtn]');
const searchBtn=document.querySelector('[searchBtn]');

const API_KEY='5a3994afc5accdf20625eaef178aea6a';
userWeatherTab.classList.add('current-tab');
let oldTab=userWeatherTab;

getFromSessionStorage();

function switchTab(newTab){
    if(oldTab!=newTab)
    {
        newTab.classList.add('current-tab');
        oldTab.classList.remove('current-tab');
        oldTab=newTab;

        if(!searchContainer.classList.contains("active"))
        {
            console.log("search weather container is active");
            searchContainer.classList.add('active');
            errorContainer.classList.remove('active');
            grantContainer.classList.remove('active');
            userContainer.classList.remove('active');
        }
        else{
            searchContainer.classList.remove('active');
            errorContainer.classList.remove('active');
            loadingContainer.classList.add('active');

            getFromSessionStorage();

            if(loadingContainer.classList.contains('active'))
            loadingContainer.classList.remove('active');
        }
    }
}

userWeatherTab.addEventListener('click',()=>{
    console.log("User Weather Container is clicked");
    switchTab(userWeatherTab);
});

searchWeatherTab.addEventListener('click',()=>{
    console.log("Search Weather Container is clicked");    
    switchTab(searchWeatherTab);
});

function renderWeatherInfo(data){
    console.log('data is been fetched');
    console.log(data);
    const cityName=document.querySelector('[cityName]');
    const countryFlag=document.querySelector('[countryFlag]');
    const weatherDesc=document.querySelector('[weatherDesc]');
    const weatherDescImg=document.querySelector('[weatherDescImg]');
    const Temp=document.querySelector('[Temp]');
    const windspeed=document.querySelector('[windspeed]');
    const humidity=document.querySelector('[humidity]');
    const cloudiness=document.querySelector('[cloudiness]');

    cityName.innerText=data?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText=data?.weather?.[0]?.main;
    weatherDescImg.src= `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    Temp.innerText = `${(data?.main?.temp-273).toFixed(2)} °C`;
    windspeed.innerText=`${data?.wind?.speed}m/s`;
    humidity.innerText=`${data?.main?.humidity}%`
    cloudiness.innerText=`${data?.clouds?.all}%`;

    loadingContainer.classList.remove('active');
    userContainer.classList.add('active');
}

async function fetchUserWeatherInfo(coordinates)
{
    const {lat, lon} = coordinates;
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data=await response.json();
        if(data.cod=='400')
        {
            throw"coordinates";
        }
        console.log(data);
        renderWeatherInfo(data);           
    }
    catch(err){
        errorContainer.classList.add('active');
        loadingContainer.classList.remove('active');
        console.log("user info me error aya hai bhai",err);
    }
}

function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

function showPosition(position){
    console.log(position);
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    console.log(userCoordinates);
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } 
      else {
        loadingContainer.classList.remove('active');
        grantContainer.classList.add('active');
        window.alert('Please Provide Your Location to Get Weather Information');
      }
}

grantLocationBtn.addEventListener("click",()=>{
    console.log("grant Location button is clicked");
    grantContainer.classList.remove('active');
    loadingContainer.classList.add('active');
    getLocation();
})

async function fetchWeatherInfo(city)
{
    console.log("fetching the details of the entered city");
    try{
        if(city=="")
        {
            throw "city is not entered";
        }
    
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const data=await response.json();
        if(data.message=='city not found')
        {
            throw"city invalid hai";
        }
        console.log(data);
        renderWeatherInfo(data);
    }
    catch(err){
        userContainer.classList.remove('active');
        errorContainer.classList.add('active');
        loadingContainer.classList.remove('active');
        console.log(err);
    }
}

searchBtn.addEventListener('click',()=>{
    console.log("search button is clicked");
    userContainer.classList.remove('active');
    errorContainer.classList.remove('active');
    loadingContainer.classList.add('active');
    fetchWeatherInfo(searchInputField.value);
})