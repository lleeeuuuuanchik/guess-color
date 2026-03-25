var Render =
{
	els: {},

	init: function ()
	{
		this.els =
		{
			score:        document.getElementById('score'),
			round:        document.getElementById('round'),
			timerBar:     document.getElementById('timer-bar'),
			phaseLabel:   document.getElementById('phase-label'),
			swatchTarget: document.getElementById('swatch-target'),
			swatchGuess:  document.getElementById('swatch-guess'),
			pickerWrap:   document.getElementById('picker-wrap'),
			gameActions:  document.getElementById('game-actions'),
			hexTarget:    document.getElementById('hex-target'),
			hexGuess:     document.getElementById('hex-guess'),
			resultTarget: document.getElementById('result-target'),
			resultGuess:  document.getElementById('result-guess'),
			resultMatch:  document.getElementById('result-match'),
			resultDiffs:  document.getElementById('result-diffs'),
			resultPoints: document.getElementById('result-points'),
			resultStreak: document.getElementById('result-streak'),
			resultStreakWrap: document.getElementById('result-streak-wrap'),
			resultEmoji:  document.getElementById('result-emoji'),
			resultWord:   document.getElementById('result-word'),
			resultHexTarget: document.getElementById('result-hex-target'),
			resultHexGuess:  document.getElementById('result-hex-guess'),
			streakChip:   document.getElementById('streak-chip'),
			streakValue:  document.getElementById('streak-value'),
			hintBar:      document.getElementById('hint-bar'),
		};

		ColorPicker.init();
		ColorPicker.resize();
	},

	_rgb: function (r, g, b)
	{
		return 'rgb(' + r + ',' + g + ',' + b + ')';
	},

	_hex: function (r, g, b)
	{
		return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
	},

	showTargetColor: function (r, g, b)
	{
		var el = this.els.swatchTarget;
		if (!el) return;
		el.style.backgroundColor = this._rgb(r, g, b);
		el.classList.remove('swatch--hidden');
		if (this.els.hexTarget)
			this.els.hexTarget.textContent = this._hex(r, g, b);
	},

	hideTargetColor: function ()
	{
		var el = this.els.swatchTarget;
		if (!el) return;
		el.style.backgroundColor = '';
		el.classList.add('swatch--hidden');
		if (this.els.hexTarget)
			this.els.hexTarget.textContent = '';
	},

	flashTargetColor: function (r, g, b, duration)
	{
		var self = this;
		this.showTargetColor(r, g, b);
		setTimeout(function ()
		{
			self.hideTargetColor();
		}, duration);
	},

	updateGuessColor: function (r, g, b)
	{
		var el = this.els.swatchGuess;
		if (el) el.style.backgroundColor = this._rgb(r, g, b);
		if (this.els.hexGuess)
			this.els.hexGuess.textContent = this._hex(r, g, b);
	},

	updateTimer: function (percent)
	{
		var bar = this.els.timerBar;
		if (!bar) return;

		bar.style.width = (percent * 100) + '%';
		bar.classList.remove('is-warning', 'is-danger');
		if (percent < 0.2)
			bar.classList.add('is-danger');
		else if (percent < 0.4)
			bar.classList.add('is-warning');
	},

	setPhaseLabel: function (key)
	{
		if (this.els.phaseLabel)
		{
			this.els.phaseLabel.textContent = i18n.t(key);
			this.els.phaseLabel.setAttribute('data-i18n', key);
		}
	},

	setPickerVisible: function (visible)
	{
		if (this.els.pickerWrap)
			this.els.pickerWrap.style.display = visible ? '' : 'none';
		if (this.els.gameActions)
			this.els.gameActions.style.display = visible ? '' : 'none';

		if (visible)
			ColorPicker.resize();
	},

	updateScore: function (score)
	{
		if (this.els.score) this.els.score.textContent = score;
	},

	updateRound: function (round, maxRounds)
	{
		if (this.els.round)
			this.els.round.textContent = maxRounds ? (round + '/' + maxRounds) : round;
	},

	updateStreak: function (streak)
	{
		if (this.els.streakChip)
			this.els.streakChip.style.display = streak > 0 ? '' : 'none';
		if (this.els.streakValue)
			this.els.streakValue.textContent = streak;
	},

	showHint: function (directions)
	{
		var bar = this.els.hintBar;
		if (!bar) return;

		var arrows = { up: '\u2191', down: '\u2193', ok: '\u2713' };
		var channels = ['r', 'g', 'b'];

		for (var i = 0; i < channels.length; i++)
		{
			var ch = channels[i];
			var arrowEl = document.getElementById('hint-' + ch + '-arrow');
			if (arrowEl)
			{
				arrowEl.textContent = arrows[directions[ch]];
			}
		}

		bar.style.display = '';
	},

	hideHint: function ()
	{
		if (this.els.hintBar)
			this.els.hintBar.style.display = 'none';
	},

	showResult: function (target, guess, matchPercent, diffs, points, streak)
	{
		if (this.els.resultTarget)
			this.els.resultTarget.style.backgroundColor = this._rgb(target.r, target.g, target.b);
		if (this.els.resultGuess)
			this.els.resultGuess.style.backgroundColor = this._rgb(guess.r, guess.g, guess.b);

		if (this.els.resultHexTarget)
			this.els.resultHexTarget.textContent = this._hex(target.r, target.g, target.b);
		if (this.els.resultHexGuess)
			this.els.resultHexGuess.textContent = this._hex(guess.r, guess.g, guess.b);

		if (this.els.resultMatch)
		{
			this.els.resultMatch.textContent = '0';
			this.els.resultMatch.classList.remove('anim-countup');
			void this.els.resultMatch.offsetWidth;
			this.els.resultMatch.classList.add('anim-countup');
			this._animateNumber(this.els.resultMatch, 0, matchPercent, 600);
		}

		if (this.els.resultEmoji)
		{
			var emoji = matchPercent >= 100 ? '\uD83C\uDF1F'
				: matchPercent >= 90 ? '\uD83C\uDF89'
				: matchPercent >= 70 ? '\uD83D\uDE0E'
				: matchPercent >= 50 ? '\uD83D\uDE42'
				: '\uD83D\uDE15';
			this.els.resultEmoji.textContent = emoji;
		}

		if (this.els.resultWord)
		{
			var wordKey = matchPercent >= 100 ? 'result.perfect'
				: matchPercent >= 90 ? 'result.great'
				: matchPercent >= 70 ? 'result.good'
				: matchPercent >= 50 ? 'result.ok'
				: 'result.miss';
			this.els.resultWord.textContent = i18n.t(wordKey);
		}

		if (this.els.resultDiffs)
		{
			var channels = ['r', 'g', 'b'];
			var labels = ['R', 'G', 'B'];
			var html = '';
			for (var i = 0; i < 3; i++)
			{
				var val = diffs[channels[i]];
				var cls = val > 0 ? 'result__ch-val--pos'
					: val < 0 ? 'result__ch-val--neg'
					: 'result__ch-val--zero';
				var sign = val > 0 ? '+' : '';
				html += '<div class="result__ch">'
					+ '<span class="result__ch-label">' + labels[i] + '</span>'
					+ '<span class="result__ch-val ' + cls + '">' + sign + val + '</span>'
					+ '</div>';
			}
			this.els.resultDiffs.innerHTML = html;
		}

		if (this.els.resultPoints)
			this.els.resultPoints.textContent = '+' + points;

		if (this.els.resultStreakWrap)
			this.els.resultStreakWrap.style.display = streak > 0 ? '' : 'none';
		if (this.els.resultStreak)
			this.els.resultStreak.textContent = streak;
	},

	_animateNumber: function (el, from, to, duration)
	{
		var start = performance.now();
		var diff = to - from;

		function step(now)
		{
			var progress = Math.min((now - start) / duration, 1);
			var eased = 1 - Math.pow(1 - progress, 3);
			el.textContent = Math.round(from + diff * eased);
			if (progress < 1)
				requestAnimationFrame(step);
		}

		requestAnimationFrame(step);
	},

	applyTheme: function (color)
	{
		var root = document.documentElement;
		if (!color)
		{
			root.style.removeProperty('--blue');
			root.style.removeProperty('--blue-hover');
			root.style.removeProperty('--blue-bg');
			root.style.removeProperty('--blue-glow');
			return;
		}

		var r = parseInt(color.slice(1, 3), 16);
		var g = parseInt(color.slice(3, 5), 16);
		var b = parseInt(color.slice(5, 7), 16);

		root.style.setProperty('--blue', color);
		root.style.setProperty('--blue-hover',
			'rgb(' + Math.round(r * 0.82) + ',' + Math.round(g * 0.82) + ',' + Math.round(b * 0.82) + ')');
		root.style.setProperty('--blue-bg',
			'rgba(' + r + ',' + g + ',' + b + ',0.08)');
		root.style.setProperty('--blue-glow',
			'rgba(' + r + ',' + g + ',' + b + ',0.18)');
	},
};
