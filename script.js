document.getElementById("searchBtn").addEventListener("click", function () {
  const locationInput = document.getElementById("locationInput").value;
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,weathercode`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const hourlyForecast = data.hourly;
      const hourlyForecastDiv = document.getElementById("hourlyForecast");
      hourlyForecastDiv.innerHTML = "";
      const maxHours = Math.min(hourlyForecast.time.length, 24);
      const cardsPerPage = 3;
      let currentPage = 1;
      const cardsContainer = document.createElement("div");
      cardsContainer.classList.add(
        "cards-container",
        "d-flex",
        "flex-wrap",
        "justify-content-start"
      );

      function getWeatherImage(weatherCode) {
        switch (weatherCode) {
          case 1:
            return "assets/sunny.png";
          case 2:
          case 3:
          case 4:
            return "assets/cloudy.png";
          case 10:
          case 11:
          case 12:
          case 21:
          case 22:
          case 23:
          case 30:
            return "assets/rainy.png";
          default:
            return "assets/unknown.png";
        }
      }

      for (let i = 0; i < maxHours; i++) {
        const timestamp = new Date(hourlyForecast.time[i]);
        const card = document.createElement("div");
        card.classList.add("card", "my-3", "p-3", "mx-2");
        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = `${timestamp.getDate()}-${(
          timestamp.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${timestamp.getFullYear()}`;
        const cardImage = document.createElement("img");
        cardImage.classList.add("card-img-top", "weather-image");
        cardImage.src = getWeatherImage(hourlyForecast.weathercode[i]);
        const cardText = document.createElement("div");
        cardText.classList.add("card-text");
        cardText.innerHTML = `
                    <p>Time: ${timestamp
                      .getHours()
                      .toString()
                      .padStart(2, "0")}:${timestamp
          .getMinutes()
          .toString()
          .padStart(2, "0")}</p>
                    <p>Temperature: ${hourlyForecast.temperature_2m[i]}°C</p>
                    <p>Wind Speed: ${(
                      hourlyForecast.windspeed_10m[i] * 3.6
                    ).toFixed(0)} km/h</p>
                `;

        if (i >= cardsPerPage) {
          card.style.display = "none";
        }

        card.appendChild(cardTitle);
        card.appendChild(cardImage);
        card.appendChild(cardText);
        cardsContainer.appendChild(card);
      }

      const prevButton = document.createElement("button");
      prevButton.classList.add(
        "btn",
        "btn-primary",
        "prev-button",
        "d-flex",
        "align-items-center",
        "mx-md-2",
        "mx-lg-0"
      );
      prevButton.innerHTML = "&lt;";
      prevButton.disabled = true;

      const nextButton = document.createElement("button");
      nextButton.classList.add(
        "btn",
        "btn-primary",
        "next-button",
        "d-flex",
        "align-items-center",
        "mx-md-2",
        "mx-lg-0"
      );
      nextButton.innerHTML = "&gt;";

      hourlyForecastDiv.appendChild(prevButton);
      hourlyForecastDiv.appendChild(nextButton);
      hourlyForecastDiv.appendChild(cardsContainer);

      function updateCards() {
        const cards = document.querySelectorAll(".card");
        cards.forEach((card, index) => {
          if (
            index >= (currentPage - 1) * cardsPerPage &&
            index < currentPage * cardsPerPage
          ) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });

        prevButton.disabled = currentPage === 1;
        nextButton.disabled =
          currentPage === Math.ceil(maxHours / cardsPerPage);
      }

      updateCards();

      prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          updateCards();
        }
      });

      nextButton.addEventListener("click", () => {
        if (currentPage < Math.ceil(maxHours / cardsPerPage)) {
          currentPage++;
          updateCards();
        }
      });
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });
});