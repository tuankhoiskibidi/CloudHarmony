const monthDisplay = document.getElementById('monthDisplay');
const calendarDays = document.getElementById('calendarDays');
const prevBtn = document.getElementById('prevMonth');
const nextBtn = document.getElementById('nextMonth');

const lat = 10.8231;
const lon = 106.6297;

let currentDate = new Date(); 

async function renderCalendar() {
    calendarDays.innerHTML = ""; 
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthDisplay.innerText = `Tháng ${month + 1}, ${year}`;

    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();



    let weatherData = null;
    try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_mean,temperature_2m_max,temperature_2m_min&past_days=92&timezone=Asia%2FHo_Chi_Minh`;
        const response = await fetch(weatherUrl);
        const data = await response.json();
        weatherData = data.daily;
    } catch (error) {
        console.error("Error fetching weather:", error);
    }

    const firstDayIndex = new Date(year, month, 1).getDay();
    const prevLastDay = new Date(year, month, 0).getDate();

    for (let x = firstDayIndex; x > 0; x--) {
        const div = document.createElement('div');
        div.classList.add('day-cell', 'text-muted');
        div.innerText = prevLastDay - x + 1;
        calendarDays.appendChild(div);
    }


    for (let i = 1; i <= lastDayOfMonth; i++) {
        const div = document.createElement('div');
        div.classList.add('day-cell');
        
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dayIdx = weatherData ? weatherData.time.indexOf(dateStr) : -1;

        // Date View (Default)
        const dateSpan = document.createElement('span');
        dateSpan.className = 'date-number';
        dateSpan.innerText = i;

        // Temperature View (Hidden by default)
        const tempDiv = document.createElement('div');
        tempDiv.className = 'temp-info';
        tempDiv.style.display = 'none';
        tempDiv.style.fontSize = '12px';

        if (dayIdx !== -1 && weatherData.temperature_2m_max[dayIdx] !== null) {
            tempDiv.innerHTML = `
                <div style="color: #ff4d4d;">Max: ${weatherData.temperature_2m_max[dayIdx]}°</div>
                <div style="font-weight: bold;">Avg: ${weatherData.temperature_2m_mean[dayIdx]}°</div>
                <div style="color: #3399ff;">Min: ${weatherData.temperature_2m_min[dayIdx]}°</div>
            `;
        } else {
            tempDiv.innerText = "No Data";
        }

        div.appendChild(dateSpan);
        div.appendChild(tempDiv);

        // Click logic: Toggles between showing the date and the temperatures
        div.addEventListener('click', () => {
            const isShowingDate = dateSpan.style.display !== 'none';
            dateSpan.style.display = isShowingDate ? 'none' : 'block';
            tempDiv.style.display = isShowingDate ? 'block' : 'none';
            
            if (div.classList.contains('current-day') && dateSpan.style.display === 'none')  {
                div.classList.toggle('current-day', false);
            } 
           
        });
  
  
  
           
        

        // Highlight today's date
        const today = new Date();
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            div.classList.add('current-day');
        }
        
        calendarDays.appendChild(div);
    }

    // Next month filler days to complete the 6x7 grid
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells; 
    for (let j = 1; j <= remainingCells; j++) {
        const div = document.createElement('div');
        div.classList.add('day-cell', 'text-muted');
        div.innerText = j;
        calendarDays.appendChild(div);
    }
}

// Control buttons
prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

renderCalendar();