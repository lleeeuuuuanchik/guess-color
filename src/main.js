(function ()
{
	var selectedDifficulty = 'easy';
	var lastRoundResult = null;

	// === Экраны ===

	function showScreen(id)
	{
		var screens = document.querySelectorAll('.screen');
		for (var i = 0; i < screens.length; i++)
			screens[i].classList.remove('is-active');

		var target = document.getElementById(id);
		if (target)
			target.classList.add('is-active');
	}

	function updateSoundIcon()
	{
		var btn = document.getElementById('btn-sound');
		if (!btn) return;

		if (SoundManager.isMuted())
		{
			btn.innerHTML = '&#128263;';
			btn.classList.add('is-active');
		}
		else
		{
			btn.innerHTML = '&#128266;';
			btn.classList.remove('is-active');
		}
	}

	// === Сложность ===

	function initDifficultySelect()
	{
		var saved = Progress.get('difficulty');
		if (saved) selectedDifficulty = saved;

		var cards = document.querySelectorAll('[data-difficulty]');
		for (var i = 0; i < cards.length; i++)
		{
			cards[i].classList.remove('is-active');
			if (cards[i].getAttribute('data-difficulty') === selectedDifficulty)
				cards[i].classList.add('is-active');
		}

		var wrap = document.getElementById('difficulty-select');
		if (wrap)
		{
			wrap.addEventListener('click', function (e)
			{
				var card = e.target.closest('[data-difficulty]');
				if (!card) return;

				selectedDifficulty = card.getAttribute('data-difficulty');
				Progress.set('difficulty', selectedDifficulty);

				var all = wrap.querySelectorAll('[data-difficulty]');
				for (var j = 0; j < all.length; j++)
					all[j].classList.remove('is-active');
				card.classList.add('is-active');
			});
		}
	}

	// === Кнопки ===

	function bindButton(id, handler)
	{
		var el = document.getElementById(id);
		if (el) el.addEventListener('click', handler);
	}

	function bindButtons()
	{
		bindButton('btn-play', function () { startGame(); });
		bindButton('btn-restart', function () { startGame(); });

		bindButton('btn-menu', function ()
		{
			showScreen('screen-menu');
		});

		bindButton('btn-pause', function ()
		{
			if (!Game.isGameOver && !Game.isPaused)
			{
				Game.pause();
				updatePauseStats();
				showScreen('screen-pause');
			}
		});

		bindButton('btn-resume', function ()
		{
			Game.resume();
			showScreen('screen-game');
		});

		bindButton('btn-pause-menu', function ()
		{
			Game._clearTimers();
			Game.isPaused = false;
			endGame();
			showScreen('screen-menu');
		});

		bindButton('btn-sound', function ()
		{
			SoundManager.toggleMute();
			updateSoundIcon();
		});

		bindButton('btn-check', function () { submitGuess(); });

		bindButton('btn-reset-sliders', function ()
		{
			Game.guessColor = { r: 128, g: 128, b: 128 };
			ColorPicker.setFromRGB(128, 128, 128);
			Render.updateGuessColor(128, 128, 128);
			Render.hideHint();
		});

		bindButton('btn-next', function () { nextRound(); });

		bindButton('btn-records', function ()
		{
			updateRecordsScreen();
			showScreen('screen-records');
		});

		bindButton('btn-records-back', function ()
		{
			showScreen('screen-menu');
		});

		bindButton('btn-howto', function ()
		{
			showScreen('screen-howto');
		});

		bindButton('btn-howto-back', function ()
		{
			showScreen('screen-menu');
		});

		bindButton('btn-shop', function ()
		{
			renderShop();
			showScreen('screen-shop');
		});

		bindButton('btn-shop-back', function ()
		{
			showScreen('screen-menu');
		});

		// --- Rewarded ---

		bindButton('btn-rewarded-x2', function ()
		{
			if (!lastRoundResult) return;
			YandexSDK.showRewarded(
				function ()
				{
					var bonus = lastRoundResult.points;
					Game.score += bonus;
					Render.updateScore(Game.score);
					var el = document.getElementById('result-points');
					if (el) el.textContent = '+' + (lastRoundResult.points * 2);
					disableRewardedBtn('btn-rewarded-x2');
				},
				function () {}
			);
		});

		bindButton('btn-rewarded-retry', function ()
		{
			YandexSDK.showRewarded(
				function ()
				{
					Game.retryGuess();
					disableRewardedBtn('btn-rewarded-retry');
					showScreen('screen-game');
					Render.setPickerVisible(true);
					Render.setPhaseLabel('phase.guess');
				},
				function () {}
			);
		});

		bindButton('btn-rewarded-flash', function ()
		{
			if (Game.flashUsed) return;
			YandexSDK.showRewarded(
				function ()
				{
					Game.flashUsed = true;
					disableRewardedBtn('btn-rewarded-flash');
					showScreen('screen-game');
					Render.setPickerVisible(true);
					Render.setPhaseLabel('phase.guess');
					var t = Game.targetColor;
					Render.flashTargetColor(t.r, t.g, t.b, CONFIG.REWARDED_FLASH_DURATION);
				},
				function () {}
			);
		});
	}

	function disableRewardedBtn(id)
	{
		var btn = document.getElementById(id);
		if (btn) btn.disabled = true;
	}

	function enableAllRewardedBtns()
	{
		var ids = ['btn-rewarded-x2', 'btn-rewarded-retry', 'btn-rewarded-flash'];
		for (var i = 0; i < ids.length; i++)
		{
			var btn = document.getElementById(ids[i]);
			if (btn) btn.disabled = false;
		}
	}

	// === Пикер ===

	function bindPicker()
	{
		ColorPicker.onChange = function (r, g, b)
		{
			Game.guessColor.r = r;
			Game.guessColor.g = g;
			Game.guessColor.b = b;
			Render.updateGuessColor(r, g, b);
		};
	}

	// === Пауза ===

	function updatePauseStats()
	{
		var set = function (id, val)
		{
			var el = document.getElementById(id);
			if (el) el.textContent = val;
		};
		set('pause-score', Game.score);
		set('pause-round', Game.round);
		set('pause-streak', Game.streak);
	}

	// === Язык ===

	function bindLangSwitch()
	{
		var wrap = document.getElementById('lang-switch');
		if (!wrap) return;

		// Обновить активную кнопку
		function updateActive()
		{
			var btns = wrap.querySelectorAll('.lang-switch__btn');
			for (var i = 0; i < btns.length; i++)
			{
				btns[i].classList.remove('is-active');
				if (btns[i].getAttribute('data-lang') === i18n.lang())
					btns[i].classList.add('is-active');
			}
		}

		updateActive();

		wrap.addEventListener('click', function (e)
		{
			var btn = e.target.closest('.lang-switch__btn');
			if (!btn) return;

			var lang = btn.getAttribute('data-lang');
			i18n.setLang(lang);
			i18n.apply();
			updateActive();
		});
	}

	// === Магазин ===

	function renderShop()
	{
		var grid = document.getElementById('shop-grid');
		if (!grid) return;

		var coins = Progress.get('coins');
		var equipped = Progress.get('equipped') || '';
		var purchased = Progress.get('purchased') || [];

		var html = '';

		// Стандартная тема
		var isDefault = !equipped;
		html += '<div class="shop__item' + (isDefault ? ' is-active' : '') + '" data-shop-id="">'
			+ '<div class="shop__item-swatch" style="background:#007AFF"></div>'
			+ '<span class="shop__item-name">' + i18n.t('shop.default') + '</span>';
		if (isDefault)
			html += '<span class="shop__item-status">' + i18n.t('shop.equipped') + '</span>';
		else
			html += '<button class="shop__item-btn shop__item-btn--equip">' + i18n.t('shop.equip') + '</button>';
		html += '</div>';

		// Товары
		for (var i = 0; i < CONFIG.SHOP.length; i++)
		{
			var item = CONFIG.SHOP[i];
			var owned = purchased.indexOf(item.id) !== -1;
			var active = equipped === item.id;

			html += '<div class="shop__item' + (active ? ' is-active' : '') + '" data-shop-id="' + item.id + '">';
			html += '<div class="shop__item-swatch" style="background:' + item.color + '"></div>';
			html += '<span class="shop__item-name">' + i18n.t('shop.' + item.id) + '</span>';

			if (active)
				html += '<span class="shop__item-status">' + i18n.t('shop.equipped') + '</span>';
			else if (owned)
				html += '<button class="shop__item-btn shop__item-btn--equip">' + i18n.t('shop.equip') + '</button>';
			else
				html += '<button class="shop__item-btn"' + (coins < item.price ? ' disabled' : '') + '>' + item.price + ' &#129689;</button>';

			html += '</div>';
		}

		grid.innerHTML = html;

		var shopCoins = document.getElementById('shop-coins');
		if (shopCoins) shopCoins.textContent = coins;
	}

	function bindShop()
	{
		var grid = document.getElementById('shop-grid');
		if (!grid) return;

		grid.addEventListener('click', function (e)
		{
			var btn = e.target.closest('.shop__item-btn');
			if (!btn) return;

			var itemEl = btn.closest('.shop__item');
			if (!itemEl) return;

			var id = itemEl.getAttribute('data-shop-id');

			if (btn.classList.contains('shop__item-btn--equip') || id === '')
			{
				Progress.set('equipped', id);
				var shopItem = getShopItem(id);
				Render.applyTheme(shopItem ? shopItem.color : null);
				renderShop();
			}
			else
			{
				var shopItem = getShopItem(id);
				if (!shopItem) return;

				var coins = Progress.get('coins');
				if (coins < shopItem.price) return;

				Progress.addCoins(-shopItem.price);
				var list = Progress.get('purchased') || [];
				list.push(id);
				Progress.set('purchased', list);

				// Автоэкипировка после покупки
				Progress.set('equipped', id);
				Render.applyTheme(shopItem.color);
				renderShop();
			}
		});
	}

	function getShopItem(id)
	{
		for (var i = 0; i < CONFIG.SHOP.length; i++)
		{
			if (CONFIG.SHOP[i].id === id)
				return CONFIG.SHOP[i];
		}
		return null;
	}

	function loadEquippedTheme()
	{
		var equipped = Progress.get('equipped');
		if (equipped)
		{
			var item = getShopItem(equipped);
			if (item)
				Render.applyTheme(item.color);
		}
	}

	// === Платформа ===

	function bindPlatformEvents()
	{
		document.addEventListener('visibilitychange', function ()
		{
			if (document.hidden)
			{
				SoundManager.pauseAll();
				if (!Game.isGameOver && !Game.isPaused && Game.phase === 'memorize')
				{
					Game.pause();
					updatePauseStats();
					showScreen('screen-pause');
				}
			}
			else
			{
				SoundManager.resumeAll();
			}
		});

		document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
		document.addEventListener('selectstart', function (e) { e.preventDefault(); });
		document.addEventListener('gesturestart', function (e) { e.preventDefault(); });

		document.addEventListener('touchmove', function (e)
		{
			if (!e.target.closest('.card') && !e.target.closest('.picker'))
				e.preventDefault();
		}, { passive: false });

		document.addEventListener('keydown', function (e)
		{
			if (e.key !== 'Escape' && e.key !== 'Control') return;

			var gameScreen = document.getElementById('screen-game');
			var pauseScreen = document.getElementById('screen-pause');

			if (gameScreen && gameScreen.classList.contains('is-active'))
			{
				if (!Game.isGameOver && !Game.isPaused)
				{
					Game.pause();
					updatePauseStats();
					showScreen('screen-pause');
				}
				return;
			}

			if (pauseScreen && pauseScreen.classList.contains('is-active'))
			{
				Game.resume();
				showScreen('screen-game');
			}
		});

		window.addEventListener('resize', function ()
		{
			ColorPicker.resize();
		});
	}

	// === Орб в меню ===

	function animateMenuOrb()
	{
		var canvas = document.getElementById('menu-orb');
		if (!canvas) return;
		var ctx = canvas.getContext('2d');
		var w = canvas.width;
		var h = canvas.height;
		var t = 0;

		function draw()
		{
			t += 0.008;
			var cx = w / 2;
			var cy = h / 2;
			var r = Math.min(cx, cy);

			ctx.clearRect(0, 0, w, h);

			var grad = ctx.createConicGradient(t, cx, cy);
			grad.addColorStop(0, 'hsl(' + ((t * 60) % 360) + ', 80%, 60%)');
			grad.addColorStop(0.33, 'hsl(' + ((t * 60 + 120) % 360) + ', 80%, 60%)');
			grad.addColorStop(0.66, 'hsl(' + ((t * 60 + 240) % 360) + ', 80%, 60%)');
			grad.addColorStop(1, 'hsl(' + ((t * 60) % 360) + ', 80%, 60%)');

			ctx.beginPath();
			ctx.arc(cx, cy, r, 0, Math.PI * 2);
			ctx.fillStyle = grad;
			ctx.fill();

			requestAnimationFrame(draw);
		}

		draw();
	}

	// === Игровой цикл ===

	function startGame()
	{
		Game.init(selectedDifficulty);
		Render.init();
		Render.hideHint();
		showScreen('screen-game');
		YandexSDK.gameplayStart();
		startRound();
	}

	function startRound()
	{
		Game.startRound();
		lastRoundResult = null;

		var t = Game.targetColor;
		Render.showTargetColor(t.r, t.g, t.b);

		// Сброс пикера
		ColorPicker.setFromRGB(128, 128, 128);
		Render.updateGuessColor(128, 128, 128);

		Render.setPickerVisible(false);
		Render.setPhaseLabel('phase.memorize');
		Render.updateScore(Game.score);
		Render.updateRound(Game.round, Game.maxRounds);
		Render.updateStreak(Game.streak);
		Render.updateTimer(1);
		Render.hideHint();
	}

	Game.onTimerTick = function (percent)
	{
		Render.updateTimer(percent);
	};

	Game.onMemorizeEnd = function ()
	{
		Render.hideTargetColor();
		Render.setPickerVisible(true);
		Render.setPhaseLabel('phase.guess');
		Render.updateTimer(0);
	};

	function submitGuess()
	{
		if (Game.phase !== 'guess') return;

		var result = Game.submitGuess();
		if (!result) return;

		lastRoundResult = result;

		Progress.addCoins(result.coins);
		Progress.updateBestMatch(result.matchPercent);
		Progress.updateBestStreak(result.streak);
		Progress.set('totalRounds', Progress.get('totalRounds') + 1);

		Render.showResult(
			Game.targetColor, Game.guessColor,
			result.matchPercent, result.diffs, result.points, result.streak
		);
		Render.updateStreak(result.streak);

		enableAllRewardedBtns();

		var retryBtn = document.getElementById('btn-rewarded-retry');
		if (retryBtn)
			retryBtn.style.display = Game.canRetry() ? '' : 'none';

		var flashBtn = document.getElementById('btn-rewarded-flash');
		if (flashBtn)
			flashBtn.style.display = (!Game.flashUsed && Game.canRetry()) ? '' : 'none';

		// Обновить текст кнопки «Далее» / «Завершить»
		var nextBtn = document.getElementById('btn-next');
		if (nextBtn)
		{
			if (Game.isLastRound())
			{
				nextBtn.textContent = i18n.t('btn.finish');
				nextBtn.removeAttribute('data-i18n');
			}
			else
			{
				nextBtn.textContent = i18n.t('btn.next');
				nextBtn.setAttribute('data-i18n', 'btn.next');
			}
		}

		showScreen('screen-result');
	}

	function nextRound()
	{
		if (Game.isLastRound())
		{
			endGame();
			showScreen('screen-gameover');
			return;
		}

		showScreen('screen-game');

		if (Game.shouldShowInterstitial())
		{
			YandexSDK.showInterstitial(function ()
			{
				startRound();
			});
		}
		else
		{
			startRound();
		}
	}

	function endGame()
	{
		Game.isGameOver = true;
		YandexSDK.gameplayStop();

		Progress.updateHighScore(Game.score);
		Progress.set('gamesPlayed', Progress.get('gamesPlayed') + 1);

		var set = function (id, val)
		{
			var el = document.getElementById(id);
			if (el) el.textContent = val;
		};

		set('final-score', Game.score);
		set('final-rounds', Game.round);
		set('final-best-match', Game.sessionBestMatch + '%');
		set('final-streak', Game.maxStreak);
	}

	function updateRecordsScreen()
	{
		var set = function (id, val)
		{
			var el = document.getElementById(id);
			if (el) el.textContent = val;
		};
		set('rec-high-score', Progress.get('highScore'));
		set('rec-best-match', Progress.get('bestMatch') + '%');
		set('rec-best-streak', Progress.get('bestStreak'));
		set('rec-games-played', Progress.get('gamesPlayed'));
		set('rec-total-rounds', Progress.get('totalRounds'));
		set('rec-coins', Progress.get('coins'));
	}

	// === Init ===

	function init()
	{
		Progress.load();
		var appRoot = document.getElementById('app');
		if (appRoot)
			appRoot.style.pointerEvents = 'none';

		YandexSDK.init(function ()
		{
			i18n.apply();
			updateLangSwitchState();

			showScreen('screen-menu');
			initDifficultySelect();
			bindButtons();
			bindPicker();
			bindPlatformEvents();
			bindLangSwitch();
			bindShop();
			animateMenuOrb();
			loadEquippedTheme();

			// Игра доступна только после полной инициализации меню.
			YandexSDK.notifyReady();
			if (appRoot)
				appRoot.style.pointerEvents = '';
		});
	}

	function updateLangSwitchState()
	{
		var wrap = document.getElementById('lang-switch');
		if (!wrap) return;

		var btns = wrap.querySelectorAll('.lang-switch__btn');
		for (var i = 0; i < btns.length; i++)
		{
			btns[i].classList.remove('is-active');
			if (btns[i].getAttribute('data-lang') === i18n.lang())
				btns[i].classList.add('is-active');
		}
	}

	window.showScreen = showScreen;
	window.startGame = startGame;
	window.endGame = endGame;

	if (document.readyState === 'loading')
		document.addEventListener('DOMContentLoaded', init);
	else
		init();
})();
