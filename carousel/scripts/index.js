const points = document.querySelector('.points');

class Carousel {
	static images = ['antoine', 'aypierre', 'etchebest', 'fanta', 'jdège', 'johnny', 'kek'];
	#current = 0;

	get current() {
		return this.#current;
	}

	set current(value) {
		this.getCurrentElement().classList.remove('active');

		if (value < 0) this.#current = Carousel.images.length - 1;
		else if (value > Carousel.images.length - 1) this.#current = 0;
		else this.#current = value;
		this.getCurrentElement().classList.add('active');

		points.querySelector('.active').classList.remove('active');
		points.children[this.#current].classList.add('active');
	}

	init() {
		this.getCurrentElement().classList.add('active');
		points.children[0].classList.add('active');
	}

	next() {
		this.current++;
	}

	prev() {
		this.current--;
	}

	getCurrentElement() {
		const list = document.querySelector('.carousel .images');
		return list.children[this.current];
	}
}

window.addEventListener('load', () => {
	const carousel = new Carousel();
	const carouselElement = document.querySelector('.carousel');
	const imagesElement = carouselElement.querySelector('.images');
	const nextButton = carouselElement.querySelector('.next');
	const prevButton = carouselElement.querySelector('.prev');

	Carousel.images.forEach(image => {
		const img = document.createElement('img');
		img.src = `resources/${image}.png`;
		img.classList.add('carousel-image');
		imagesElement.appendChild(img);

		const point = document.createElement('div');
		point.classList.add('point');
		point.addEventListener('click', () => {
			carousel.current = Carousel.images.indexOf(image);
		});
		points.appendChild(point);
	});

	carousel.init();

	nextButton.addEventListener('click', () => carousel.next());
	prevButton.addEventListener('click', () => carousel.prev());
});
