window.addEventListener('load', () => {
	const leaderboardDiv = document.querySelector('.leaderboard-list');
	const leaderboard = localStorage.getItem('leaderboard');

	if (leaderboard) {
		const leaderboardObject = Object.entries(JSON.parse(leaderboard)).sort((a, b) => b[1] - a[1]);
		leaderboardObject.forEach((score, index) => {
			const leaderBoardScore = leaderboardObject[index];
			if (!leaderBoardScore) return;
			const time = formatTime(leaderBoardScore[1]);

			const scoreDiv = document.createElement('li');
			scoreDiv.classList.add('score');
			scoreDiv.innerText = `${leaderBoardScore[0]} - ${time}`;
			leaderboardDiv.appendChild(scoreDiv);
		});
	}

	/**
	 * Format time to minutes:seconds.milliseconds
	 * @param time {number} Time in milliseconds
	 * @returns {string}
	 */
	function formatTime(time) {
		const minutes = Math.floor(time / 60000);
		const seconds = Math.floor((time % 60000) / 1000);
		const milliseconds = Math.floor((time % 1000) / 10);
		return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
	}
});
