class Item {
	icon;
	win1;
	win2;
	win3;
	chance;

	constructor({
		            icon,
		            win1 = 0,
		            win2 = 0,
		            win3 = 0,
		            chance = 1,
	            }) {
		this.icon = icon;
		this.win1 = win1;
		this.win2 = win2;
		this.win3 = win3;
		this.chance = chance;
	}
}

class Casino {
	static betsDiv = document.querySelector('.bets');
	static gainElement = document.querySelector('.gain');
	static moneyCountDiv = document.querySelector('.money-wrappers');
	static slotsDiv = document.querySelector('.slots');
	static resetMoneyDiv = document.querySelector('.reset');
	static casino = new Item({
		icon: 'casino',
		win3: 10,
		chance: 0.5,
	});
	static diamond = new Item({
		icon: 'diamond',
		win1: 0.5,
		win2: 1,
		win3: 2.5,
	});
	static cherry = new Item({
		icon: 'cherry',
		win3: 1.5,
	});
	static lemon = new Item({
		icon: 'lemon',
		win3: 1.25,
	});
	static items = [this.casino, this.diamond, this.cherry, this.lemon];
	static #cooldown = 500;
	static startingMoney = 100;
	coins;

	bet;

	constructor(coins) {
		this.coins = coins;

		Casino.betsDiv.querySelectorAll('button').forEach(button => {
			button.addEventListener('click', () => {
				this.bet = parseInt(button.innerText);
				this.play(button);
				button.disabled = true;

				setTimeout(() => button.disabled = false, Casino.#cooldown);
			});
		});

		Casino.resetMoneyDiv.addEventListener('click', () => {
			this.coins = Casino.startingMoney;
			this.updateMoney();
		});
	}

	static generateNumbers() {
		return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '.'];
	}

	animateGain(count) {
		const sign = Math.sign(count);
		const signText = sign === 1 ? '+' : sign === -1 ? '-' : '';
		Casino.gainElement.parentElement.classList.add('active');
		Casino.gainElement.innerText = `${signText}${Math.abs(count)}`;

		setTimeout(() => Casino.gainElement.parentElement.classList.remove('active'), Casino.#cooldown);
	}

	calculateWin(result) {
		let multiple = 0;

		if (result.every(i => i === result[0])) {
			multiple += Casino.items[result[0]].win3;

			return this.bet * multiple;
		}

		const presentTwoTimes = result.filter((item, index) => result.indexOf(item) !== index)[0];
		if (presentTwoTimes) {
			multiple += Casino.items[presentTwoTimes].win2;

			const otherItem = result.filter(item => item !== presentTwoTimes)[0];
			multiple += Casino.items[otherItem].win1 ?? 1;

			return this.bet * multiple;
		}

		result.forEach(item => multiple += Casino.items[item].win1 ?? 1);

		return this.bet * multiple;
	}

	play(button) {
		document.querySelectorAll('.play').forEach(i => i.remove());

		if (this.coins < this.bet) {
			button.classList.add('cancel');
			setTimeout(() => button.classList.remove('cancel'), 500);

			const notEnoughMoneyP = document.createElement('p');
			notEnoughMoneyP.classList.add('not-enough');
			notEnoughMoneyP.innerText = 'Not enough money';
			document.body.appendChild(notEnoughMoneyP);
			setTimeout(() => notEnoughMoneyP.remove(), 800);

			return;
		}

		this.coins -= this.bet;
		this.animateGain(-this.bet);
		this.updateMoney();
		this.spin();
	}

	spin() {
		const resultDiv = Casino.slotsDiv.querySelectorAll('.slot-item');
		const frameTime = 10;
		const countNumber = 5;

		resultDiv.forEach((img) => {
			const first = img.lastElementChild;
			first.remove();

			const children = Array.from(img.children).filter(e => !e.src.endsWith("none"));
			children.sort(() => Math.random() - 0.5);
			children.forEach(child => img.appendChild(child));

			first.setAttribute('src', img.firstElementChild.src);
			img.appendChild(first);

			let i = 0;
			let count = 0;
			let interval = setInterval(() => {
				i += 2;
				[...img.children].forEach(e => e.style.top = `-${i}rem`);
				if (i % 40 === 0 && i > 0) {
					count++;
					i = 0;
				}

				if (count > countNumber) {
					clearInterval(interval);
				}
			}, frameTime);
		});

		setTimeout(() => {
			const result = [...resultDiv].map((e) => {
				const item = e.firstElementChild;
				const itemName = item.src.replace(/.+?resources\/(\w+).png/g, '$1');
				return Casino.items.findIndex(i => i.icon === itemName);
			});

			this.results(result);
		}, frameTime * 24 * countNumber);
	}

	results(result) {
		const win = this.calculateWin(result);
		this.coins += win;
		if (win !== 0) {
			this.animateGain(win);
			this.updateMoney();
		}
	}

	updateMoney() {
		function randomize() {
			const rand = Math.floor(Math.random() * 9);
			this.style.top = -1 * rand + 'em';
			this.classList.toggle('animate');
		}

		Casino.moneyCountDiv.dataset.coins = this.coins;

		const elements = [...Casino.moneyCountDiv.querySelectorAll('.money-wrapper')];
		elements.forEach((element) => {
			element.addEventListener('animationend', randomize, false);
			element.addEventListener('webkitAnimationEnd', randomize, false);
			element.addEventListener('oanimationend', randomize, false);
			element.addEventListener('MSAnimationEnd', randomize, false);
		});

		Casino.moneyCountDiv.innerHTML = [...this.coins.toString()]
			.map(() => `<div class="money-wrapper">
				<span class="money-number animate">${Casino.generateNumbers().join(' ')}</span>
			</div>`)
			.join(' ');
		localStorage.setItem('coins', this.coins.toString());
		setTimeout(() => {
			document.querySelectorAll('.money-number').forEach((wrapper, index) => {
				wrapper.classList.remove('animate');
				let number = this.coins.toString()[index];
				if (number === '.') number = 10;
				wrapper.style.top = `-${number}em`;
			});
		}, 200);
	}
}

window.addEventListener('load', () => {
	let coins = parseFloat(localStorage.getItem('coins'));
	if (isNaN(coins)) {
		coins = Casino.startingMoney;
	}

	const casino = new Casino(coins);
	casino.updateMoney();
});
