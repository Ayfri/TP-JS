import {Quizz} from './quizz.js';

window.addEventListener('load', () => {
	const quizzesDiv = document.querySelector('.questions');
	const results = [];
	const quizzes = [
		new Quizz({
			answers: ['Super Mario Bros', 'Super Mario World', 'Mario Bros', 'Sonic', 'Donkey Kong', 'B1'],
			correctAnswer: ['Donkey Kong'],
			question: 'Quel est la première apparition de Mario Mario ?',
		}), new Quizz({
			answers: ['1977', '1972', '1982', '1985'],
			correctAnswer: ['1977'],
			question: 'Quel est la date de la première console de jeux vidéos ?',
		}), new Quizz({
			answers: ['Master System', 'GameGear', 'Virtual Boy', 'Jaguar', 'Neo Geo'],
			correctAnswer: ['Master System', 'GameGear'],
			question: 'Quelles sont des consoles de Sega ?',
		}), new Quizz({
			answers: ['Docteur', 'Maçon', 'Plombier', 'Livreur de pizzas', 'Footballeur'],
			correctAnswer: ['Livreur de pizzas'],
			question: 'Quel métier Mario Mario n\'a jamais eu ?',
		}), new Quizz({
			answers: ['PC Engine', 'PlayStation', 'GameCube', 'Saturn', 'CDi'],
			correctAnswer: ['CDi'],
			question: 'Quelle était la première console grand public à utiliser des CD au lieu des cartouches ?',
		}), new Quizz({
			answers: ['1990', '1993', '1998', '2000', '1987'],
			correctAnswer: ['1998'],
			question: 'Quelle est la date de sortie de la GameBoy Color ?',
		}), new Quizz({
			answers: ['Atari 2600', 'NES', 'DreamCast', 'Commodore 64', 'Intellivision'],
			correctAnswer: ['Atari 2600'],
			question: 'Quelle console a majoritairement contribué au grand crash des jeux vidéos de 1982 ?',
		}), new Quizz({
			answers: ['62 millions', '20 millions', '105 millions', '5 millions'],
			correctAnswer: ['62 millions'],
			question: 'Combien de ventes a eu la NES ?',
		}),
	];

	quizzes.forEach((quizz, i) => {
		quizz.createQuizz(quizzesDiv);

		if (i > 0) quizz.hide();

		quizz.onSubmit = ({
			                  answers,
			                  correctAnswers,
			                  valid,
		                  }) => {
			results.push({
				answers,
				correctAnswers,
				valid,
			});

			quizz.hide();
			quizzes[i + 1]?.show();

			if (i === quizzes.length - 1) {
				showResults(results);
			}
		};
	});
});

function showResults(results) {
	document.querySelector('.questions').classList.add('hide');
	const resultsDiv = document.querySelector('.results');
	resultsDiv.classList.remove('hide');

	results.forEach(({
		                 answers,
		                 correctAnswers,
		                 valid,
	                 }) => {
		const result = document.createElement('div');
		result.classList.add('result');

		const title = document.createElement('h2');
		title.innerText = `${valid ? 'Bonne réponse' : 'Mauvaise réponse'}`;
		result.appendChild(title);

		const answersDiv = document.createElement('div');
		answersDiv.classList.add('answers');
		result.appendChild(answersDiv);

		const answersText = document.createElement('p');
		answersText.innerText = `Réponse(s) : ${answers.map((e) => e.innerText).join(', ') || 'Aucune.'}`;
		answersDiv.appendChild(answersText);

		const correctAnswersDiv = document.createElement('div');
		correctAnswersDiv.classList.add('correct-answers');
		result.appendChild(correctAnswersDiv);

		const correctAnswersText = document.createElement('p');
		correctAnswersText.innerText = `Bonne(s) réponse(s) : ${correctAnswers.join(', ')}`;
		correctAnswersDiv.appendChild(correctAnswersText);

		resultsDiv.appendChild(result);
	});

	const statsDiv = document.createElement('div');
	statsDiv.classList.add('stats');
	resultsDiv.appendChild(statsDiv);

	const statsTitle = document.createElement('h3');
	statsTitle.innerText = 'Statistiques';
	statsDiv.appendChild(statsTitle);

	const statsText = document.createElement('p');
	const correctAnswers = results.filter((e) => e.valid).length;
	const answers = results.length;
	const percentage = Math.round(correctAnswers / answers * 100);
	statsText.innerText = `Réponses : ${correctAnswers}/${answers} valides (${percentage}%)`;
	statsDiv.appendChild(statsText);
}
