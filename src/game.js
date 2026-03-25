var Game =
{
	targetColor: null,
	guessColor: null,
	phase: 'idle',
	difficulty: 'easy',
	round: 0,
	maxRounds: 10,
	score: 0,
	streak: 0,
	attemptsLeft: 0,
	sessionBestMatch: 0,
	maxStreak: 0,
	isGameOver: false,
	isPaused: false,
	hintUsed: false,
	flashUsed: false,

	// Для отмены очков при retry
	_lastPoints: 0,
	_preAttemptStreak: 0,

	// Таймер фазы запоминания
	_timerIntervalId: null,
	_timerStart: 0,
	_timerDuration: 0,
	_timerRemaining: 0,

	// Колбэки
	onTimerTick: null,
	onMemorizeEnd: null,

	init: function (difficulty)
	{
		this.difficulty = difficulty || 'easy';
		this.round = 0;
		this.maxRounds = CONFIG.ROUNDS[difficulty] || 10;
		this.score = 0;
		this.streak = 0;
		this.maxStreak = 0;
		this.sessionBestMatch = 0;
		this.isGameOver = false;
		this.isPaused = false;
		this.hintUsed = false;
		this.flashUsed = false;
		this.phase = 'idle';
		this.guessColor = { r: 128, g: 128, b: 128 };
		this._lastPoints = 0;
		this._preAttemptStreak = 0;
		this._clearTimers();
	},

	generateColor: function ()
	{
		var r = Math.floor(Math.random() * 256);
		var g = Math.floor(Math.random() * 256);
		var b = Math.floor(Math.random() * 256);
		return { r: r, g: g, b: b };
	},

	startRound: function ()
	{
		this.round++;
		this.targetColor = this.generateColor();
		this.guessColor = { r: 128, g: 128, b: 128 };
		this.attemptsLeft = CONFIG.ATTEMPTS[this.difficulty] || 1;
		this.hintUsed = false;
		this.flashUsed = false;
		this._lastPoints = 0;
		this._preAttemptStreak = 0;
		this.phase = 'memorize';

		this._startMemorizeTimer();
	},

	_startMemorizeTimer: function ()
	{
		var self = this;
		this._timerDuration = CONFIG.MEMORIZE_TIME[this.difficulty] || 7000;
		this._timerStart = Date.now();
		this._timerRemaining = this._timerDuration;

		this._timerIntervalId = setInterval(function ()
		{
			if (self.isPaused) return;

			var elapsed = Date.now() - self._timerStart;
			var remaining = self._timerRemaining - elapsed;
			var percent = Math.max(0, remaining / self._timerDuration);

			if (self.onTimerTick)
				self.onTimerTick(percent);

			if (remaining <= 0)
			{
				self._clearTimers();
				self.startGuessPhase();
			}
		}, CONFIG.TIMER_UPDATE_INTERVAL);
	},

	startGuessPhase: function ()
	{
		this._clearTimers();
		this.phase = 'guess';

		if (this.onMemorizeEnd)
			this.onMemorizeEnd();
	},

	// Подсказка: направление каналов
	getHintDirections: function ()
	{
		if (!this.targetColor || !this.guessColor) return null;
		this.hintUsed = true;

		var t = this.targetColor;
		var g = this.guessColor;
		return {
			r: t.r > g.r ? 'up' : t.r < g.r ? 'down' : 'ok',
			g: t.g > g.g ? 'up' : t.g < g.g ? 'down' : 'ok',
			b: t.b > g.b ? 'up' : t.b < g.b ? 'down' : 'ok',
		};
	},

	calculateMatch: function (target, guess)
	{
		var dr = target.r - guess.r;
		var dg = target.g - guess.g;
		var db = target.b - guess.b;
		var dist = Math.sqrt(dr * dr + dg * dg + db * db);
		var maxDist = Math.sqrt(255 * 255 + 255 * 255 + 255 * 255);
		var match = (1 - dist / maxDist) * 100;
		return Math.round(Math.max(0, Math.min(100, match)));
	},

	getChannelDiffs: function (target, guess)
	{
		return {
			r: guess.r - target.r,
			g: guess.g - target.g,
			b: guess.b - target.b,
		};
	},

	calculatePoints: function (matchPercent)
	{
		var base;
		if (matchPercent >= CONFIG.THRESHOLD_PERFECT)
			base = CONFIG.POINTS_PERFECT;
		else if (matchPercent >= CONFIG.THRESHOLD_EXCELLENT)
			base = CONFIG.POINTS_EXCELLENT;
		else if (matchPercent >= CONFIG.THRESHOLD_GOOD)
			base = CONFIG.POINTS_GOOD;
		else if (matchPercent >= CONFIG.THRESHOLD_OK)
			base = CONFIG.POINTS_OK;
		else
			base = CONFIG.POINTS_BAD;

		var streakBonus = 1 + (this.streak * CONFIG.STREAK_MULTIPLIER);
		return Math.round(base * streakBonus);
	},

	submitGuess: function ()
	{
		if (this.phase !== 'guess') return null;

		// Сохраняем состояние до попытки (для retry)
		this._preAttemptStreak = this.streak;

		this.attemptsLeft--;
		var matchPercent = this.calculateMatch(this.targetColor, this.guessColor);
		var diffs = this.getChannelDiffs(this.targetColor, this.guessColor);
		var points = this.calculatePoints(matchPercent);
		var coins = CONFIG.COINS_PER_ROUND;

		// Обновить стрик
		if (matchPercent >= CONFIG.STREAK_THRESHOLD)
			this.streak++;
		else
			this.streak = 0;

		if (this.streak > this.maxStreak)
			this.maxStreak = this.streak;

		this._lastPoints = points;
		this.score += points;

		if (matchPercent > this.sessionBestMatch)
			this.sessionBestMatch = matchPercent;

		this.phase = 'result';

		return {
			matchPercent: matchPercent,
			diffs: diffs,
			points: points,
			coins: coins,
			streak: this.streak,
		};
	},

	canRetry: function ()
	{
		return this.attemptsLeft > 0;
	},

	retryGuess: function ()
	{
		if (!this.canRetry()) return;

		// Откатить очки и стрик предыдущей попытки
		this.score -= this._lastPoints;
		this.streak = this._preAttemptStreak;
		this._lastPoints = 0;

		this.phase = 'guess';
	},

	isLastRound: function ()
	{
		return this.round >= this.maxRounds;
	},

	shouldShowInterstitial: function ()
	{
		return this.round > 0 && this.round % CONFIG.INTERSTITIAL_INTERVAL === 0;
	},

	pause: function ()
	{
		if (this.isGameOver || this.isPaused) return;
		this.isPaused = true;

		if (this.phase === 'memorize')
		{
			var elapsed = Date.now() - this._timerStart;
			this._timerRemaining = this._timerRemaining - elapsed;
		}

		YandexSDK.gameplayStop();
	},

	resume: function ()
	{
		if (!this.isPaused) return;
		this.isPaused = false;

		if (this.phase === 'memorize')
			this._timerStart = Date.now();

		YandexSDK.gameplayStart();
	},

	_clearTimers: function ()
	{
		if (this._timerIntervalId)
		{
			clearInterval(this._timerIntervalId);
			this._timerIntervalId = null;
		}
	},
};
