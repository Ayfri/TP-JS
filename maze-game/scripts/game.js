class Cell {
	static theme;
	x;
	y;
	value;

	constructor(x, y, value = 0) {
		this.x = x;
		this.y = y;
		this.value = value;
	}

	getColor() {
		switch (this.value) {
			case 0:
				return Cell.theme.cellNormalColor;
			case 1:
				return Cell.theme.cellSelectableColor;
			case 2:
				return Cell.theme.cellSelectedColor;
			default:
				return Cell.theme.cellInvalidColor;
		}
	}
}

class Timer {
	startTime;
	endTime;
	#div;

	constructor(div) {
		this.#div = div;
	}

	end() {
		this.endTime = new Date();
	}

	getTime() {
		if (this.startTime) {
			return this.endTime ? this.endTime - this.startTime : new Date() - this.startTime;
		}
		return 0;
	}

	reset() {
		this.startTime = null;
		this.endTime = null;
	}

	start() {
		this.startTime = new Date();
	}

	update() {
		const time = this.getTime();
		const minutes = Math.floor(time / 60000);
		const seconds = Math.floor((time % 60000) / 1000);
		const milliseconds = Math.floor((time % 1000) / 10);

		this.#div.innerHTML = `${minutes}:${seconds}.${milliseconds}`;
	}
}

class Theme {
	static themes = {
		default: new Theme('hsl(180,71%,69%)', 'hsl(135,71%,69%)', '#fff', '#000000dd', 1),
		black: new Theme('hsl(180,71%,20%)', 'hsl(135,71%,20%)', '#000', '#ffffffdd', 1),
		dark: new Theme('hsl(300,71%,20%)', 'hsl(200,71%,20%)', '#222', '#ffffff99', 1),
		flat: new Theme('hsl(50, 71%, 50%)', 'hsl(190, 71%, 50%)', '#fff', '#00000000', 0),
		bold: new Theme('hsl(20,71%,60%)', 'hsl(220,71%,60%)', '#fff', '#00000055', 10),
		big: new Theme('hsl(0,71%,60%)', 'hsl(95,71%,60%)', '#fff', '#00000055', 30),
	};
	static themeSelector = document.querySelector('.themes');

	cellNormalColor;
	cellBorderColor;
	cellBorderSize;
	cellSelectableColor;
	cellSelectedColor;
	cellInvalidColor = '#f00';

	constructor(cellSelectableColor, cellSelectedColor, cellNormalColor, cellBorderColor, cellBorderSize) {
		this.cellSelectableColor = cellSelectableColor;
		this.cellSelectedColor = cellSelectedColor;
		this.cellNormalColor = cellNormalColor;
		this.cellBorderColor = cellBorderColor;
		this.cellBorderSize = cellBorderSize;
	}
}

class Game {
	static cellSize = 20;
	static #directions = [
		{
			x: 0,
			y: -1,
		}, {
			x: 1,
			y: 0,
		}, {
			x: 0,
			y: 1,
		}, {
			x: -1,
			y: 0,
		},
	];
	static pointsToWin = 15;
	static theme = Theme.themes.default;
	cols;
	rows;
	levelDiv;
	path = [];
	pathLength = 10;
	playerName;
	playerPath = [];
	playerStarted = false;
	timer = new Timer(document.querySelector('.timer'));
	#canvas;
	#cheated = false;
	#ctx;
	#difficulty = 0;
	#grid = [];
	#_level = 1;
	#timerInterval;

	constructor(ctx, canvas, playerName = 'Player', difficulty = 1) {
		const settings = Game.#getSizeFromDifficulty(difficulty);
		this.cols = settings.size;
		this.rows = settings.size;
		this.pathLength = settings.pathLength;

		this.#ctx = ctx;
		this.#canvas = canvas;
		this.playerName = playerName;
		this.levelDiv = document.querySelector('.level');
		this.levelDiv.innerText = 'Level 1';
		this.#difficulty = difficulty;
		this.generateCells();

		this.timer.start();
		this.#timerInterval = setInterval(() => this.timer.update(), 10);
		Cell.theme = Game.theme;
	}

	get #level() {
		return this.#_level;
	}

	set #level(value) {
		this.#_level = value;
		this.levelDiv.innerText = `Level ${value}`;
	}

	set playerStart(value) {
		this.playerPath[0] = value;
	}

	static #getDirections(already) {
		return Game.#directions.filter((direction) => !already.includes(direction)).sort(() => Math.random() - 0.5);
	}

	static #getSizeFromDifficulty(difficulty) {
		switch (difficulty) {
			case 0:
				return {
					size: 5,
					pathLength: 10,
				};
			case 1:
				return {
					size: 6,
					pathLength: 15,
				};
			default:
				return {
					size: 8,
					pathLength: 25,
				};
		}
	}

	#saveToLeaderboard() {
		const leaderboard = localStorage.getItem('leaderboard');
		const leaderboardObj = leaderboard ? JSON.parse(leaderboard) : {};
		leaderboardObj[this.playerName] = this.timer.getTime();
		localStorage.setItem('leaderboard', JSON.stringify(leaderboardObj));
	}

	cheat(points) {
		this.#level += points;
		this.#cheated = true;
		if (this.#level % 5 === 0) {
			this.increaseDifficulty();
		}

		if (this.#level >= Game.pointsToWin) {
			this.timer.startTime = new Date();
			this.#level = 15;
			this.gameOver();
		}

		this.restartLevel();
	}

	clear() {
		this.#ctx.clearRect(0, 0, this.cols * Game.cellSize, this.rows * Game.cellSize);
		this.#grid.forEach((row, i) => {
			row.forEach((cell, j) => this.setCellValue(i, j, 0));
		});
	}

	draw() {
		this.drawCells();
		this.drawGrid();
	}

	drawCells() {
		this.#grid.forEach((row) => {
			row.forEach((cell) => {
				this.#ctx.fillStyle = cell.getColor();
				this.#ctx.fillRect(cell.x * Game.cellSize, cell.y * Game.cellSize, Game.cellSize, Game.cellSize);
			});
		});
	}

	drawGrid() {
		this.#ctx.strokeStyle = Game.theme.cellBorderColor;
		this.#ctx.lineWidth = Game.theme.cellBorderSize;
		this.#ctx.beginPath();

		for (let i = 0; i <= this.rows; i++) {
			this.#ctx.moveTo(0, i * Game.cellSize);
			this.#ctx.lineTo(this.cols * Game.cellSize, i * Game.cellSize);
		}

		for (let i = 0; i <= this.cols; i++) {
			this.#ctx.moveTo(i * Game.cellSize, 0);
			this.#ctx.lineTo(i * Game.cellSize, this.rows * Game.cellSize);
		}

		this.#ctx.stroke();
	}

	gameOver() {
		this.clear();
		this.timer.end();
		this.timer.update();
		if (!this.#cheated) {
			this.#saveToLeaderboard();
		}
		clearInterval(this.#timerInterval);
		this.#canvas.remove();
		window.location.href = 'leaderboard.html';
	}

	generateCells() {
		this.#grid = [];
		for (let i = 0; i < this.rows; i++) {
			this.#grid[i] = [];
			for (let j = 0; j < this.cols; j++) {
				this.#grid[i][j] = new Cell(i, j);
			}
		}
	}

	generatePath() {
		const start = this.getRandomCell();
		this.path = [
			{
				x: start.x,
				y: start.y,
			},
		];
		let current = start;
		let lastDirection = {
			x: 0,
			y: 0,
		};

		let valid = false;
		while (!valid) {
			while (this.path.length < this.pathLength) {
				const nextCell = this.getNextCell(current);
				if (!nextCell) break;

				this.path.push(nextCell);
				current = nextCell;
				lastDirection = {
					cols: current.x - current.x,
					rows: current.y - current.y,
				};
			}

			if (this.path.length < this.pathLength) {
				this.path = [];
				current = start;
				lastDirection = {
					cols: 0,
					rows: 0,
				};
			} else {
				valid = true;
			}
		}

		this.setPathInGrid();
	}

	getCell(x, y) {
		return this.#grid[x]?.[y];
	}

	getNextCell(current) {
		const testedDirections = [];
		let newDirection;

		do {
			newDirection = Game.#getDirections(testedDirections)[0];
			testedDirections.push(newDirection);

			const newX = current.x + newDirection.x;
			const newY = current.y + newDirection.y;


			if (newX < 0 || newX >= this.cols || newY < 0 || newY >= this.rows) {
				continue;
			}

			if (this.path.some((cell) => cell.x === newX && cell.y === newY)) {
				continue;
			}

			return {
				x: newX,
				y: newY,
			};
		} while (testedDirections.length < 4);

		return null;
	}

	getRandomCell() {
		const randomX = Math.floor(Math.random() * this.rows);
		const randomY = Math.floor(Math.random() * this.cols);
		return this.getCell(randomX, randomY);
	}

	handlePlayer() {
		let clicked;
		let oldCell;
		this.#canvas.addEventListener('pointerdown', (e) => {
			if (clicked) return;
			this.playerPath = [];
			const x = Math.floor(e.offsetX / Game.cellSize);
			const y = Math.floor(e.offsetY / Game.cellSize);
			const cell = this.getCell(x, y);

			if (cell.value === 1) {
				this.playerStarted = true;
				this.playerStart = {
					x,
					y,
				};
				oldCell = cell;
				this.setCellValue(x, y, 2);
			}

			this.draw();
			clicked = true;
		});

		this.#canvas.addEventListener('pointermove', (e) => {
			if (!this.playerStarted || !clicked) return;

			const x = Math.floor(e.offsetX / Game.cellSize);
			const y = Math.floor(e.offsetY / Game.cellSize);
			const cell = this.getCell(x, y);

			if (!cell) {
				this.restartLevel();
				clicked = false;
				return;
			}

			if (oldCell?.x === x && oldCell?.y === y) return;
			oldCell = cell;

			if (cell.value === 0) {
				this.restartLevel();
				clicked = false;
				return;
			}

			if (this.playerPath.some((cell) => cell.x === (oldCell?.x ?? -1) && cell.y === (oldCell?.y ?? -1))) {
				this.restartLevel();
				clicked = false;
				return;
			}

			this.playerPath.push({
				x: cell.x,
				y: cell.y,
			});
			this.setCellValue(x, y, 2);
			this.draw();
		});

		this.#canvas.addEventListener('pointerleave', (e) => {
			if (!this.playerStarted || !clicked) return;
			this.restartLevel();
			clicked = false;
		});

		this.#canvas.addEventListener('pointerup', (e) => {
			if (!clicked) return;

			oldCell = null;
			clicked = false;

			const x = Math.floor(e.offsetX / Game.cellSize);
			const y = Math.floor(e.offsetY / Game.cellSize);
			const cell = this.getCell(x, y);

			if (cell.value !== 2) {
				this.restartLevel();
				return;
			}

			let valid = true;
			if (this.playerPath.length !== this.path.length) valid = false;
			const playerPath = JSON.stringify(this.playerPath.sort((a, b) => a.x - b.x || a.y - b.y));
			const path = JSON.stringify(this.path.sort((a, b) => a.x - b.x || a.y - b.y));
			if (playerPath !== path) valid = false;

			if (valid) {
				this.#level++;
				if (this.#level % 5 === 0) {
					this.increaseDifficulty();
				}

				if (this.#level === Game.pointsToWin) {
					this.gameOver();
				}
			}

			this.restartLevel();
		});
	}

	increaseDifficulty() {
		this.#difficulty++;
		const settings = Game.#getSizeFromDifficulty(this.#difficulty);

		this.cols = settings.size;
		this.rows = settings.size;
		this.pathLength = settings.pathLength;

		Game.cellSize = 600 / settings.size;
		this.generateCells();
		this.restartLevel();
	}

	restartLevel() {
		this.playerPath = [];
		this.playerStarted = false;
		this.clear();
		this.generatePath();
		this.draw();
	}

	resetPoints() {
		this.#level = 0;
	}

	setCellValue(x, y, value) {
		this.#grid[x][y].value = value;
	}

	setPathInGrid() {
		this.path.forEach((cell) => this.setCellValue(cell.x, cell.y, 1));
	}
}

window.addEventListener('load', () => {
	const startBtn = document.querySelector('#start');
	const nameInput = document.querySelector('#name');
	const beforePlayDiv = document.querySelector('.before-play');
	nameInput.addEventListener('keyup', (e) => {
		if (e.key === 'Enter') {
			startBtn.click();
		}
	});

	startBtn.addEventListener('click', () => {
		const name = nameInput.value;
		beforePlayDiv.remove();
		play(name);

		const gameDiv = document.querySelector('.game');
		gameDiv.classList.remove('hidden');
	});

	for (const themeName in Theme.themes) {
		const theme = Theme.themes[themeName];
		const themeBtn = Theme.themeSelector.querySelector(`[data-theme="${themeName}"]`);

		themeBtn.style.borderRadius = `${theme.cellBorderSize * 5}px`;
		themeBtn.style.setProperty('--theme-main-color', theme.cellSelectableColor);
		themeBtn.style.setProperty('--theme-secondary-color', theme.cellSelectedColor);
		themeBtn.style.setProperty('--theme-border-color', theme.cellBorderColor);
		themeBtn.style.setProperty('--theme-border-size', `${theme.cellBorderSize / 5}px`);

		setTimeout(() => themeBtn.style.transition = 'all 0.3s ease-in-out', 50);
	}

	Theme.themeSelector.querySelectorAll('.theme').forEach(themeBtn => {
		themeBtn.addEventListener('click', () => {
			const theme = Theme.themes[themeBtn.dataset.theme];
			if (theme) {
				Cell.theme = theme;
				Game.theme = theme;

				Theme.themeSelector.querySelectorAll('.theme').forEach(themeBtn => {
					themeBtn.classList.remove('selected');
				});
				themeBtn.classList.add('selected');

				// set root CSS variables
				let primaryColor = theme.cellSelectableColor;
				const primaryColorHsl = primaryColor.split('(')[1].split(')')[0].split(',');
				if (parseInt(primaryColorHsl[2]) > 65) {
					primaryColor = `hsl(${primaryColorHsl[0]}, ${primaryColorHsl[1]}, ${parseInt(primaryColorHsl[2]) / 1.5}%)`;
				}
				if (parseInt(primaryColorHsl[2]) < 40) {
					primaryColor = `hsl(${primaryColorHsl[0]}, ${primaryColorHsl[1]}, ${parseInt(primaryColorHsl[2]) * 1.8}%)`;
				}
				document.documentElement.style.setProperty('--primary-color', primaryColor);
			}
		});
	});
});

function play(name) {
	const canvas = document.querySelector('#game');
	const ctx = canvas.getContext('2d');
	const game = new Game(ctx, canvas, name || undefined);

	game.pathLength = 10;
	const size = game.rows;
	Game.cellSize = 600 / size;
	ctx.canvas.width = size * Game.cellSize;
	ctx.canvas.height = size * Game.cellSize;

	game.generatePath();
	game.draw();
	game.handlePlayer();

	const playerNameDiv = document.querySelector('.player-name');
	playerNameDiv.textContent = game.playerName;

	const restartLevelBtn = document.querySelector('.restart');
	restartLevelBtn.addEventListener('click', () => {
		game.restartLevel();
		game.resetPoints();
	});

	const restartGameBtn = document.querySelector('.change-user');
	restartGameBtn.addEventListener('click', () => window.location.reload());


	window.addEventListener('keydown', (e) => {
		if (e.key.toLowerCase() === 'p') {
			game.cheat(1);
		}
	});

	Theme.themeSelector.querySelectorAll('.theme').forEach(themeBtn => {
		themeBtn.addEventListener('click', () => game.draw());
	});
}
