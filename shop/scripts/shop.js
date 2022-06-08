import {ShopItem} from './item.js';

window.addEventListener('load', () => {
	const shop = document.querySelector('.items');
	const cartBtn = document.querySelector('.cart-btn');

	ShopItem.items.forEach(item => {
		item.amount = parseInt(localStorage.getItem(item.name)) || 0;
		item.createCard(shop);

		item.cardDiv?.addEventListener('click', () => {
			if (item.amount > 0) return;

			item.cardDiv.querySelector('.card-buy')?.classList?.remove('zero');
			item.amount++;
			item.updateAmount();
		});

		if (ShopItem.items.map(i => i.amount).reduce((a, b) => a + b) > 0) {
			cartBtn.classList.add('visible');
		}

		item.onAmountChange = ((i) => {
			if (i.amount > 0) {
				cartBtn.classList.add('visible');
			}

			if (ShopItem.items.map(i => i.amount).reduce((a, b) => a + b) === 0) {
				cartBtn.classList.remove('visible');
			}
		});
	});
});
