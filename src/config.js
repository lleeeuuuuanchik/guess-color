var CONFIG =
{
	GAME_ID: 'guess_color',

	// Тайминги фазы запоминания (мс)
	MEMORIZE_TIME: { easy: 7000, normal: 5000, hard: 3000 },

	// Количество раундов в партии
	ROUNDS: { easy: 10, normal: 15, hard: 20 },

	// Попытки на раунд
	ATTEMPTS: { easy: 3, normal: 1, hard: 1 },

	// Очки за процент совпадения
	POINTS_PERFECT:   1000,
	POINTS_EXCELLENT: 700,
	POINTS_GOOD:      400,
	POINTS_OK:        200,
	POINTS_BAD:       50,

	// Пороги процентов
	THRESHOLD_PERFECT:   100,
	THRESHOLD_EXCELLENT: 90,
	THRESHOLD_GOOD:      70,
	THRESHOLD_OK:        50,

	// Стрик
	STREAK_THRESHOLD:   90,
	STREAK_MULTIPLIER:  0.2,

	// Монеты
	COINS_PER_ROUND: 5,

	// Rewarded бонусы
	REWARDED_FLASH_DURATION: 1000,

	// Interstitial каждые N раундов
	INTERSTITIAL_INTERVAL: 5,

	// Обновление таймера (мс)
	TIMER_UPDATE_INTERVAL: 30,

	SOUND_ENABLED: true,

	// Магазин — акцентные темы
	SHOP:
	[
		{ id: 'theme_purple', price: 50,  color: '#AF52DE' },
		{ id: 'theme_green',  price: 50,  color: '#34C759' },
		{ id: 'theme_orange', price: 75,  color: '#FF9500' },
		{ id: 'theme_pink',   price: 75,  color: '#FF2D55' },
		{ id: 'theme_teal',   price: 100, color: '#5AC8FA' },
		{ id: 'theme_indigo', price: 100, color: '#5856D6' },
	],
};
