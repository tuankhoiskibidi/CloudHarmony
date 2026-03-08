
const cityInput = document.querySelector('.city');
const searchBtn = document.querySelector('.btn-dark');


searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();

    if (city !== "") {
        localStorage.setItem('favoriteCityQuery', city); 
        window.location.href = 'CloudHarmony.html';
    } else {
        alert("Vui lòng nhập tên thành phố!");
    }
});
