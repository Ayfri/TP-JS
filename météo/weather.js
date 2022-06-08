window.addEventListener('load', () => {
	const weatherForm = document.querySelector('form');
	const search = weatherForm.querySelector('input');
	const searchBtn = weatherForm.querySelector('button[type="submit"]');
	const results = document.querySelector('.results');
	const loading = document.querySelector('.loading');
	const error = document.querySelector('.error');

	weatherForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		searchBtn.disabled = true;
		loading.classList.remove('hidden');
		document.querySelectorAll('.result').forEach((result) => result.remove());

		const location = search.value;
		const apiKey = '23633429d7925c5e1216ff73a357a535';
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=fr`;

		const response = await fetch(url);
		if (response.status === 404) {
			error.innerHTML = `Aucun résultat pour <code>${location}</code>.`;
			searchBtn.disabled = false;
			loading.classList.add('hidden');
			error.classList.remove('hidden');
			return;
		} else {
			error.classList.add('hidden');
		}

		const data = await response.json();

		setResults(data);
		searchBtn.disabled = false;
		loading.classList.add('hidden');
	});

	function setResults(data) {
		const { main, weather, name } = data;
		const { temp, feels_like } = main;
		const { description } = weather[0];
		const icon = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

		const resultElement = document.createElement('div');
		const cityAndIconElement = document.createElement('div');
		const cityElement = document.createElement('h1');
		const iconElement = document.createElement('img');
		const descElement = document.createElement('p');
		const tempElement = document.createElement('p');
		const feelsLikeElement = document.createElement('p');

		cityElement.innerHTML = name;
		iconElement.src = icon;
		descElement.innerHTML = `Description: ${description}`;
		tempElement.innerHTML = `Température : ${temp}°C`;
		feelsLikeElement.innerHTML = `Température ressentie : ${feels_like}°C`;

		cityAndIconElement.classList.add('city-icon');
		cityElement.classList.add('city');
		iconElement.classList.add('icon');
		descElement.classList.add('description');
		tempElement.classList.add('temp');
		feelsLikeElement.classList.add('feels-like');
		resultElement.classList.add('result');

		cityAndIconElement.appendChild(cityElement);
		cityAndIconElement.appendChild(iconElement);
		resultElement.appendChild(cityAndIconElement);
		resultElement.appendChild(descElement);
		resultElement.appendChild(tempElement);
		resultElement.appendChild(feelsLikeElement);

		results.appendChild(resultElement);
	}
});
