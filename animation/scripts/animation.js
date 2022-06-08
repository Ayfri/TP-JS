window.addEventListener('load', () => {
	TweenMax.to('.image-l', 5, {
		repeat: -1,
		backgroundPosition: `0 -46680px`,
		ease: SteppedEase.config(120),
	});
	TweenMax.to('.image-r', 5, {
		repeat: -1,
		backgroundPosition: `0 -39864px`,
		ease: SteppedEase.config(132),
	});
});
