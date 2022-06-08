import {ShopItem} from './item.js';

class Cart {
	items = [];
	pricesDiv;
	constructor(pricesDiv, ...items) {
		this.items.push(...items);
		this.pricesDiv = pricesDiv;
	}

	calculateTotal() {
		return this.items.reduce((total, item) => total + item.price * item.amount, 0);
	}

	generatePrices() {
		const prices = this.items.map(item =>
			`${item.name} : ${item.price * item.amount} $ (${item.price}$ x ${item.amount}) <span class="prices-plus">+</span>`
		);
		const total = this.calculateTotal();
		prices.forEach(prices => {
			this.pricesDiv.innerHTML += `<p class="price">${prices}</p>`;
		});
		this.pricesDiv.innerHTML += `<p class="total">Total : ${total} $</p>`;
	}
}

window.addEventListener('load', () => {
	const cartElement = document.querySelector('.cart');
	const pricesDiv = document.querySelector('.prices');
	const cart = new Cart(pricesDiv);

	ShopItem.items.forEach(item => {
		item.amount = parseInt(localStorage.getItem(item.name)) || 0;

		if (item.amount > 0) {
			cart.items.push(item);
			item.createCartCard(cartElement);
		}

		item.onAmountChange = () => {
			cart.items.forEach((cartItem, i) => {
				if (cartItem.name === item.name) {
					cart.items.splice(i, 1);
				}
			});

			pricesDiv.innerHTML = '';
			cart.generatePrices();
		}
	});

	cart.generatePrices();
});
