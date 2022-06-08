export class Quizz {
	question;
	answers;
	#correctAnswers;
	#div;
	onSubmit = () => {};

	constructor({
		            question,
		            answers,
		            correctAnswer,
	            }) {
		this.question = question;
		this.answers = answers;
		this.#correctAnswers = correctAnswer;
	}

	#showSubmitButton(div) {
		const submit = document.createElement('button');
		submit.classList.add('submit');
		submit.innerText = 'Valider';
		submit.type = 'button';
		div.appendChild(submit);

		submit.addEventListener('click', () => {
			const selectedAnswers = [...this.#div.querySelectorAll('input:checked+label')];
			const valid = this.checkAnswers(selectedAnswers.map((answer) => answer.innerText));
			const correctAnswers = this.#correctAnswers;
			this.onSubmit({answers: selectedAnswers, correctAnswers, valid});
		});
	}

	#createMultipleAnswersQuizz(div) {
		const question = document.createElement('form');
		question.classList.add('question');

		const questionTitle = document.createElement('h2');
		questionTitle.classList.add('question-title');
		questionTitle.innerText = this.question;
		question.appendChild(questionTitle);

		const answers = document.createElement('div');
		answers.classList.add('answers');

		shuffleArray(this.answers).forEach((a) => {
			const answerName = a.replace(/\s/g, '-').toLowerCase();
			const answer = document.createElement('input');
			answer.classList.add('answer');
			answer.setAttribute('type', 'checkbox');
			answer.setAttribute('name', 'answer');
			answer.setAttribute('id', answerName);
			answers.appendChild(answer);

			const answerLabel = document.createElement('label');
			answerLabel.classList.add('answer-label');
			answerLabel.setAttribute('for', answerName);
			answerLabel.innerText = a;
			answers.appendChild(answerLabel);
		});

		question.appendChild(answers);
		div.appendChild(question);

		this.#div = question;
		this.#showSubmitButton(question);
	}

	#createSingleAnswerQuizz(div) {
		const question = document.createElement('form');
		question.classList.add('question');

		const questionTitle = document.createElement('h2');
		questionTitle.classList.add('question-title');
		questionTitle.innerText = this.question;
		question.appendChild(questionTitle);


		const answers = document.createElement('div');
		answers.classList.add('answers');

		shuffleArray(this.answers).forEach((a) => {
			const answerName = a.replace(/\s/g, '-').toLowerCase();
			const answer = document.createElement('input');
			answer.classList.add('answer');
			answer.setAttribute('type', 'radio');
			answer.setAttribute('name', 'answer');
			answer.setAttribute('id', answerName);
			answers.appendChild(answer);

			const answerLabel = document.createElement('label');
			answerLabel.classList.add('answer-label');
			answerLabel.innerText = a;
			answerLabel.setAttribute('for', answerName);
			answers.appendChild(answerLabel);
		});

		question.appendChild(answers);
		div.appendChild(question);

		this.#div = question;
		this.#showSubmitButton(question);
	}

	checkAnswers(answers) {
		return this.#correctAnswers.every((a) => [...answers].includes(a));
	}

	createQuizz(div) {
		if (this.#correctAnswers.length > 1) {
			this.#createMultipleAnswersQuizz(div);
		} else {
			this.#createSingleAnswerQuizz(div);
		}
	}

	hide() {
		this.#div.style.display = 'none';
	}

	show() {
		this.#div.style.display = 'block';
	}
}

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
}
