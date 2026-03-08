const mainTrack = document.getElementById('main-track');
const favTrack = document.getElementById('favorite-track');
const container = document.querySelector('.carousel-container');
const clearBtn = document.getElementById('clear-fav-btn');

let scrollPosition = 0;
let speed = 0.5; 
let paused = false;


function animate() {
  if (!paused) {
    scrollPosition -= speed;

    if (mainTrack && Math.abs(scrollPosition) >= mainTrack.scrollWidth / 2) {
      scrollPosition = 0;
    }
    
    if (mainTrack) mainTrack.style.transform = `translateX(${scrollPosition}px)`;
    if (favTrack) favTrack.style.transform = `translateX(${scrollPosition}px)`;
  }
  requestAnimationFrame(animate);
}

container.addEventListener('mouseenter', () => paused = true);
container.addEventListener('mouseleave', () => paused = false);

animate();

const weatherMapping = {
    0: { desc: "Trời quang", icon: "01d" },
    1: { desc: "Chủ yếu quang đãng", icon: "01d" },
    2: { desc: "Bán mây", icon: "02d" },
    3: { desc: "U ám", icon: "03d" },
    45: { desc: "Sương mù", icon: "50d" },
    61: { desc: "Mưa nhẹ", icon: "10d" },
    95: { desc: "Sấm sét", icon: "11d" }
};


async function getWeatherData(lat = 10.8231, lon = 106.6297, cityName = "Hồ Chí Minh", targetTrack = mainTrack) {
  if (!targetTrack) return; // Prevent errors if track is missing

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    targetTrack.innerHTML = ''; 

    for (let i = 0; i < 7; i++) {
      const dateStr = data.daily.time[i];
      const maxTemp = Math.round(data.daily.temperature_2m_max[i]);
      const minTemp = Math.round(data.daily.temperature_2m_min[i]);
      const weatherCode = data.daily.weathercode[i];

      const info = weatherMapping[weatherCode] || { desc: "Có mây", icon: "03d" };
      const iconUrl = `https://openweathermap.org/img/wn/${info.icon}@2x.png`;
      const date = new Date(dateStr).toLocaleDateString('vi-VN', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'numeric' 
      });

      const cardHTML = `
        <div class="d-flex">
          <div class="card square-card border-0 shadow m-3 bg-white">
            <div class="card-body text-center p-4">
              <div class="mb-3">
                <h5 class="fw-bold mb-0">${cityName}</h5>
                <small class="text-muted">${date}</small>
              </div>
              <div class="my-3">
                <img src="${iconUrl}" alt="weather icon">
                <h2 class="display-4 fw-bold">${maxTemp}°c</h2>
              </div>
              <div>
                <p class="mb-0 fw-semibold text-primary">${info.desc}</p>
                <p class="text-muted x-small mt-1">${maxTemp}°C / ${minTemp}°C</p>
              </div> 
            </div>
          </div>
        </div>`;
      
      targetTrack.innerHTML += cardHTML;
    }

    targetTrack.innerHTML += targetTrack.innerHTML; // Duplicate for infinite scroll
  } catch (error) {
    console.error("Không thể hiển thị được thông tin ", error);
  }
}

// 3. Logic to handle the Geocoding and Loading
async function loadFavoriteCity() {
    console.log("1. loadFavoriteCity triggered");
    const favoriteCity = localStorage.getItem('favoriteCityQuery');
    const favTrack = document.getElementById('favorite-track');

    if (!favoriteCity) {
        console.error("2. Failure: No 'favoriteCityQuery' found in Local Storage");
        return;
    }
    if (!favTrack) {
        console.error("2. Failure: Element #favorite-track not found in HTML");
        return;
    }

    console.log(`3. Success: Found city "${favoriteCity}". Fetching coordinates...`);

    try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(favoriteCity)}&count=1&format=json`);
        const geoData = await geoRes.json();
        
        if (geoData.results && geoData.results.length > 0) {
            const { latitude, longitude, name } = geoData.results[0];
            console.log(`4. Coordinates found: ${latitude}, ${longitude}`);
            getWeatherData(latitude, longitude, name, favTrack);
        } else {
            console.warn("4. API returned 0 results for this city name.");
        }
    } catch (err) {
        console.error("4. Network Error:", err);
    }
}



if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        
        localStorage.removeItem('favoriteCityQuery');
        
       
        location.reload();
    });
}
getWeatherData(); 
loadFavoriteCity(); 