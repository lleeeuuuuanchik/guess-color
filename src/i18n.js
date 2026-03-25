/**
 * Локализация.
 * Все переводимые тексты — здесь. Элементы с атрибутом data-i18n="ключ"
 * переводятся автоматически при вызове i18n.apply().
 */
var i18n =
{
	_lang: 'ru',

	_map:
	{
		ru: 'ru', be: 'ru', kk: 'ru', uk: 'ru', uz: 'ru',
		en: 'en', tr: 'en', de: 'en', fr: 'en', es: 'en',
		pt: 'en', it: 'en', ar: 'en', he: 'en', ja: 'en',
		ko: 'en', zh: 'en',
	},

	_texts:
	{
		ru:
		{
			'game.title':       'Угадай цвет',

			'btn.play':    'Начать игру',
			'btn.pause':   'Пауза',
			'btn.resume':  'Продолжить',
			'btn.menu':    'В меню',
			'btn.restart': 'Играть снова',
			'btn.check':   'Проверить',
			'btn.reset':   'Сбросить',
			'btn.next':    'Следующий раунд',
			'btn.records': 'Мои рекорды',
			'btn.back':    'Назад',

			'game-over.title':   'Результаты',
			'game-over.subtitle': 'Отличная игра!',
			'score.label':       'очки',
			'score.result':      'Итого очков',
			'round.label':       'раунд',

			'phase.memorize':    'Запомни этот цвет',
			'phase.guess':       'Воспроизведи цвет',

			'difficulty.easy':   'Лёгкий',
			'difficulty.normal': 'Нормальный',
			'difficulty.hard':   'Сложный',
			'difficulty.easy.desc':   '7 сек, 3 попытки',
			'difficulty.normal.desc': '5 сек, 1 попытка',
			'difficulty.hard.desc':   '3 сек, 1 попытка',

			'result.match':   'совпадение',
			'result.points':  'очков',
			'result.streak':  'серия',
			'result.perfect': 'Идеально!',
			'result.great':   'Отлично!',
			'result.good':    'Хорошо!',
			'result.ok':      'Неплохо',
			'result.miss':    'Попробуй ещё',

			'rewarded.x2':        'Удвоить очки',
			'rewarded.x2.desc':   'x2 за этот раунд',
			'rewarded.retry':     'Ещё попытка',
			'rewarded.retry.desc': 'Попробовать снова',
			'rewarded.flash':      'Вспышка цвета',
			'rewarded.flash.desc': 'Увидеть цвет на 1 сек',

			'records.title':       'Рекорды',
			'records.highScore':   'Лучший счёт',
			'records.bestMatch':   'Лучшее совпадение',
			'records.bestStreak':  'Лучшая серия',
			'records.gamesPlayed': 'Игр сыграно',
			'records.totalRounds': 'Раундов пройдено',
			'records.coins':       'Монет заработано',

			'color.target': 'Цель',
			'color.yours':  'Твой цвет',

			'gameover.rounds':    'Раундов',
			'gameover.bestMatch': 'Лучший %',
			'gameover.streak':    'Макс. серия',

			'howto.title':        'Как играть',
			'howto.step1':        'Запомни',
			'howto.step1.desc':   'Тебе покажут цвет на несколько секунд — запомни его',
			'howto.step2':        'Воспроизведи',
			'howto.step2.desc':   'Подбери цвет на палитре как можно точнее',
			'howto.step3':        'Набирай очки',
			'howto.step3.desc':   'Чем точнее совпадение — тем больше очков',
			'howto.step4':        'Серия побед',
			'howto.step4.desc':   '90%+ подряд — бонусный множитель к очкам',
			'howto.goal':         'Пройди все раунды и набери максимальный счёт!',
			'howto.rounds':       'раундов',
			'btn.finish':         'Завершить',

			'shop.title':        'Магазин',
			'shop.themes':       'Акцентные темы',
			'shop.equipped':     'Выбрано',
			'shop.equip':        'Выбрать',
			'shop.default':      'Стандартная',
			'shop.theme_purple': 'Фиолетовая',
			'shop.theme_green':  'Зелёная',
			'shop.theme_orange': 'Оранжевая',
			'shop.theme_pink':   'Розовая',
			'shop.theme_teal':   'Бирюзовая',
			'shop.theme_indigo': 'Индиго',
		},
		en:
		{
			'game.title':       'Guess the Color',

			'btn.play':    'Start Game',
			'btn.pause':   'Pause',
			'btn.resume':  'Resume',
			'btn.menu':    'Menu',
			'btn.restart': 'Play Again',
			'btn.check':   'Check',
			'btn.reset':   'Reset',
			'btn.next':    'Next Round',
			'btn.records': 'My Records',
			'btn.back':    'Back',

			'game-over.title':   'Results',
			'game-over.subtitle': 'Great game!',
			'score.label':       'score',
			'score.result':      'Total Score',
			'round.label':       'round',

			'phase.memorize':    'Memorize this color',
			'phase.guess':       'Reproduce the color',

			'difficulty.easy':   'Easy',
			'difficulty.normal': 'Normal',
			'difficulty.hard':   'Hard',
			'difficulty.easy.desc':   '7 sec, 3 attempts',
			'difficulty.normal.desc': '5 sec, 1 attempt',
			'difficulty.hard.desc':   '3 sec, 1 attempt',

			'result.match':   'match',
			'result.points':  'points',
			'result.streak':  'streak',
			'result.perfect': 'Perfect!',
			'result.great':   'Great!',
			'result.good':    'Good!',
			'result.ok':      'Not bad',
			'result.miss':    'Try again',

			'rewarded.x2':        'Double Points',
			'rewarded.x2.desc':   'x2 for this round',
			'rewarded.retry':     'Retry',
			'rewarded.retry.desc': 'Try once more',
			'rewarded.flash':      'Color Flash',
			'rewarded.flash.desc': 'See color for 1 sec',

			'records.title':       'Records',
			'records.highScore':   'High Score',
			'records.bestMatch':   'Best Match',
			'records.bestStreak':  'Best Streak',
			'records.gamesPlayed': 'Games Played',
			'records.totalRounds': 'Rounds Played',
			'records.coins':       'Coins Earned',

			'color.target': 'Target',
			'color.yours':  'Your color',

			'gameover.rounds':    'Rounds',
			'gameover.bestMatch': 'Best %',
			'gameover.streak':    'Max streak',

			'howto.title':        'How to Play',
			'howto.step1':        'Memorize',
			'howto.step1.desc':   'A color will be shown for a few seconds — memorize it',
			'howto.step2':        'Reproduce',
			'howto.step2.desc':   'Pick the color on the palette as closely as possible',
			'howto.step3':        'Score Points',
			'howto.step3.desc':   'The closer the match — the more points you get',
			'howto.step4':        'Win Streak',
			'howto.step4.desc':   '90%+ in a row — bonus multiplier for points',
			'howto.goal':         'Complete all rounds and get the highest score!',
			'howto.rounds':       'rounds',
			'btn.finish':         'Finish',

			'shop.title':        'Shop',
			'shop.themes':       'Accent Themes',
			'shop.equipped':     'Equipped',
			'shop.equip':        'Equip',
			'shop.default':      'Default',
			'shop.theme_purple': 'Purple',
			'shop.theme_green':  'Green',
			'shop.theme_orange': 'Orange',
			'shop.theme_pink':   'Pink',
			'shop.theme_teal':   'Teal',
			'shop.theme_indigo': 'Indigo',
		},
	},

	setLang: function (code)
	{
		this._lang = this._map[code] || 'en';
		document.documentElement.lang = this._lang;
	},

	detectFromBrowser: function ()
	{
		try
		{
			var code = (navigator.language || 'ru').split('-')[0];
			this.setLang(code);
		}
		catch (e) { this._lang = 'ru'; }
	},

	t: function (key)
	{
		var dict = this._texts[this._lang] || this._texts['ru'] || {};
		return dict[key] || (this._texts['ru'] && this._texts['ru'][key]) || key;
	},

	lang: function ()
	{
		return this._lang;
	},

	apply: function ()
	{
		var els = document.querySelectorAll('[data-i18n]');
		for (var i = 0; i < els.length; i++)
		{
			var el = els[i];
			var key = el.getAttribute('data-i18n');
			var attr = el.getAttribute('data-i18n-attr');
			var text = this.t(key);

			if (attr)
				el.setAttribute(attr, text);
			else
				el.textContent = text;
		}

		document.title = this.t('game.title');
	},
};
