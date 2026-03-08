const lat = 10.8231;
const lon = 106.6297;
const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=dust,uv_index,uv_index_clear_sky,pm10,pm2_5&timezone=Asia%2FHo_Chi_Minh`;
const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,cloud_cover,rain,showers&timezone=Asia%2FHo_Chi_Minh`;
const weatherMapping = {
    0: { desc: "Trời quang ☀️", },
    1: { desc: "Chủ yếu quang đãng 🌤️",},
    2: { desc: "Bán mây ⛅",  },
    3: { desc: "U ám ☁️",  },
    45: { desc: "Sương mù 🌫️",  },
    61: { desc: "Mưa nhẹ 🌦️",  },
    95: { desc: "Sấm sét ⛈️", }
};

function getDustDescription(pm25) {
    let description = "";
    let shortDesc = "";
    if (pm25 <= 12){
        description = "Chất lượng không khí tốt. Không có nguy cơ sức khỏe nào được nhận thấy.";
        shortDesc = "Tốt";
    }
    else if (pm25 <= 35) {
        description = "Chất lượng không khí trung bình. Một số người nhạy cảm có thể gặp các vấn đề về sức khỏe.";
        shortDesc = "Trung bình";
    }
    else if (pm25 <= 55) {
        description = "Chất lượng không khí kém. Người nhạy cảm nên hạn chế các hoạt động ngoài trời.";
        shortDesc = "Kém";
    }
    else if (pm25 <= 150) {
        description = "Chất lượng không khí rất kém. Mọi người nên hạn chế các hoạt động ngoài trời.";
        shortDesc = "Rất kém";
    }

    return { description, shortDesc }|| { description: "Dữ liệu không khả dụng", shortDesc: "Không rõ" };
}

    function getDustDescriptionPM10(pm10) {
    let description = "";
    let shortDesc = "";

    if (pm10 <= 50) {
        description = "Chất lượng không khí tốt. Không khí trong lành, an toàn cho tất cả mọi người.";
        shortDesc = "Tốt";
    } 
    else if (pm10 <= 100) {
        description = "Chất lượng không khí trung bình. Chấp nhận được, nhưng người cực kỳ nhạy cảm nên lưu ý.";
        shortDesc = "Trung bình";
    } 
    else if (pm10 <= 250) {
        description = "Chất lượng không khí kém. Bụi đường và bụi xây dựng nhiều, nên đeo khẩu trang.";
        shortDesc = "Kém";
    } 
    else if (pm10 <= 350) {
        description = "Chất lượng không khí rất kém. Ảnh hưởng rõ rệt đến hô hấp, hạn chế ra đường.";
        shortDesc = "Rất kém";
    } 
    else {
        description = "Mức độ nguy hại! Không khí ô nhiễm nặng bởi bụi thô.";
        shortDesc = "Nguy hại";
    }

    return { description, shortDesc };
}


async function getWeatherData() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        const dateStr = data.current.time;
        const maxTemp = Math.round(data.current.temperature_2m);
        const weatherCode = data.current.weathercode;
        const relative_humidity = data.current.relative_humidity_2m;
        const apparent_temperature = data.current.apparent_temperature;
        const is_day = data.current.is_day;
        const wind_speed_10m = data.current.wind_speed_10m;
        const cloud_cover = data.current.cloud_cover;
        const rain = data.current.rain;
        const showers = data.current.showers;
        

        const info = weatherCode ||  { desc: "Có mây ☁️", icon: "03d" };;
        const date = new Date(dateStr).toLocaleDateString('vi-VN', {
            weekday: 'long',
            day: 'numeric',
            month: 'numeric'
        });
    try {
         const airResponse = await fetch(airQualityUrl);
         const airData = await airResponse.json();

         const pm10 = airData.current.pm10;   
         const pm25 = airData.current.pm2_5;
        const dustLevel = getDustDescription(pm25);
        const pm10dustLevel = getDustDescriptionPM10(airData.current.pm10);
        document.getElementById('dust-shortDesc').innerText = `Chất lượng không khí  (Bụi mịn): ${dustLevel.shortDesc} (PM2.5: ${pm25} µg/m³)`;
        document.getElementById('dust-desc').innerText = `${dustLevel.description}`;
        document.getElementById('pm10dust-shortDesc').innerText = `Chất lượng không khí (Bụi thô): ${pm10dustLevel.shortDesc} (PM2.5: ${pm10} µg/m³)`;
        document.getElementById('pm10dust-desc').innerText = `${pm10dustLevel.description}`;
    } catch (airError) {
         console.error("Không thể lấy dữ liệu chất lượng không khí ", airError);
    }


        document.getElementById('city-name').innerText = ` Hồ Chí Minh`;
        document.getElementById('current-date').innerText = `${date}`;
        document.getElementById('temp-main').innerText = `Nhiệt độ: ${maxTemp}°C (Cảm giác như: ${apparent_temperature}°C)`;
        document.getElementById('humidity').innerText = `Độ ẩm: ${relative_humidity}%`;
        document.getElementById('wind').innerText = `Tốc độ gió: ${wind_speed_10m} km/h`;
        document.getElementById('cloud').innerText = `Mây che phủ: ${cloud_cover}%`;
        document.getElementById('rain').innerText = `Lượng mưa: ${rain} mm`;
        document.getElementById('showers').innerText = `Mưa rào: ${showers} mm`;
        document.getElementById('weather-desc').innerText = `${info.desc} - ${is_day ? 'Ban ngày☀️' : 'Ban đêm🌙'}`;


    } catch(error) {
        console.error("Không thể hiển thị được thông tin ", error);
    }
}





getWeatherData();