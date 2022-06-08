export class ShopItem {
	static items = [];
	static genshin = new ShopItem('Genshin Impact', 0);
	static ksp = new ShopItem('Kerbal Space Program', 14.99);
	static minecraft = new ShopItem('Minecraft', 23.99);
	static portal = new ShopItem('Portal 2', 20);
	static roblox = new ShopItem('Roblox', 0);
	static rocketLeague = new ShopItem('Rocket League', 14.99);
	static stanley = new ShopItem('The Stanley Parable', 11.99);

	name;
	price;
	image;
	imageHover;
	amount = 0;
	cardDiv = null;

	constructor(name, price) {
		this.name = name;
		this.price = price;
		this.image = `resources/${name}.png`;
		this.imageHover = `resources/${name} Gameplay.png`;

		ShopItem.items.push(this);
	}

	createCard(div) {
		const card = document.createElement('div');
		card.classList.add('card', 'shop-item');
		if (this.amount > 0) card.classList.add('buying');
		this.cardDiv = card;

		const cardImage = document.createElement('img');
		cardImage.classList.add('card-image');
		cardImage.src = this.image;
		card.appendChild(cardImage);
		this.hoverCard(cardImage);

		const cardContent = document.createElement('div');
		cardContent.classList.add('card-content');
		card.appendChild(cardContent);

		const cardTitle = document.createElement('h2');
		cardTitle.classList.add('card-title');
		cardTitle.innerText = this.name;

		const cardPrice = document.createElement('p');
		cardPrice.classList.add('card-price');
		cardPrice.innerText = this.price || 'FREE';

		if (this.price > 0) {
			const cardPriceIcon = document.createElement('i');
			cardPriceIcon.classList.add('fa-light', 'fa-dollar-sign');
			cardPrice.appendChild(cardPriceIcon);
		}

		const cardBuyDiv = document.createElement('div');
		cardBuyDiv.classList.add('card-buy');
		if (this.amount === 0) cardBuyDiv.classList.add('zero');

		const cardAmount = document.createElement('p');
		cardAmount.classList.add('card-amount');
		cardAmount.contentEditable = 'true';
		cardAmount.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				e.stopPropagation();
				e.target.blur();
				this.amount = parseInt(cardAmount.innerText);
				this.updateAmount();
			}
		});
		if (this.amount > 0) cardAmount.classList.add('visible');
		cardAmount.innerText = this.amount.toString();

		const cardBuyMore = document.createElement('button');
		cardBuyMore.classList.add('card-buy-more', 'buy-btn');
		cardBuyMore.innerText = '+';
		cardBuyMore.addEventListener('click', () => {
			this.amount++;
			this.updateAmount();
		});

		const cardBuyLess = document.createElement('button');
		cardBuyLess.classList.add('card-buy-less', 'buy-btn');
		cardBuyLess.innerText = '-';
		cardBuyLess.addEventListener('click', (e) => {
			if (this.amount > 0) {
				this.amount--;
				this.updateAmount();
				e.cancelBubble = true;
			}
		});

		cardBuyDiv.appendChild(cardBuyMore);
		cardBuyDiv.appendChild(cardAmount);
		cardBuyDiv.appendChild(cardBuyLess);

		cardContent.appendChild(cardTitle);
		cardContent.appendChild(cardPrice);
		cardContent.appendChild(cardBuyDiv);

		div.appendChild(card);
	}

	createCartCard(div) {
		const card = document.createElement('div');
		card.classList.add('card', 'cart-item');
		this.cardDiv = card;

		const cardImageLink = document.createElement('a');
		cardImageLink.classList.add('card-image-link');
		cardImageLink.href = 'index.html';

		const cardImage = document.createElement('img');
		cardImage.classList.add('card-image');
		cardImage.src = this.image;
		cardImageLink.appendChild(cardImage);
		card.appendChild(cardImageLink);

		const cardContent = document.createElement('div');
		cardContent.classList.add('card-content');
		card.appendChild(cardContent);

		const cardTitle = document.createElement('h2');
		cardTitle.classList.add('card-title');
		cardTitle.innerText = this.name;
		cardContent.appendChild(cardTitle);

		const cardInfos = document.createElement('div');
		cardInfos.classList.add('card-infos');

		const cardPrice = document.createElement('p');
		cardPrice.classList.add('card-price');
		cardPrice.innerText = this.price ? this.price : 'FREE';

		if (this.price > 0) {
			const cardPriceIcon = document.createElement('i');
			cardPriceIcon.classList.add('fa-light', 'fa-dollar-sign');
			cardPrice.appendChild(cardPriceIcon);
		}

		const cardAmount = document.createElement('p');
		cardAmount.classList.add('card-amount');
		cardAmount.innerText = `Amount : ${this.amount.toString()}`;

		const bin = document.createElement('i');
		bin.classList.add('fa-solid', 'fa-trash', 'delete');
		bin.addEventListener('click', () => this.delete());
		cardContent.appendChild(bin);

		cardInfos.appendChild(cardPrice);
		cardInfos.appendChild(cardAmount);
		cardContent.appendChild(cardInfos);

		div.appendChild(card);
	}

	delete() {
		this.amount = 0;
		this.updateAmount();
		this.cardDiv.remove();
	}

	hoverCard(img) {
		let timeout;
		img.addEventListener('mouseover', () => {
			timeout = setTimeout(() => {
				img.setAttribute('src', this.imageHover);
			}, 300);
		});
		img.addEventListener('mouseout', () => {
			clearTimeout(timeout);
			img.setAttribute('src', this.image);
		});
	}

	onAmountChange = () => {
	};

	updateAmount() {
		this.cardDiv.querySelector('.card-amount').innerText = this.amount.toString();
		localStorage.setItem(this.name, this.amount.toString());
		this.onAmountChange(this);

		const isOnList = !this.cardDiv.classList.contains('cart-item');
		if (this.amount < 1) {
			this.cardDiv.querySelector('.card-buy')?.classList?.add('zero');
			if (isOnList) this.cardDiv.classList.remove('buying');
		} else {
			if (isOnList) this.cardDiv.classList.add('buying');
		}
	}
}
