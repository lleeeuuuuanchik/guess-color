/**
 * ColorPicker — визуальный пикер цвета.
 * Квадратная палитра (насыщенность x яркость) + полоска оттенка (hue).
 * Работает через Canvas, возвращает RGB.
 */
var ColorPicker =
{
	_areaCanvas: null,
	_areaCtx: null,
	_hueCanvas: null,
	_hueCtx: null,
	_cursor: null,
	_hueCursor: null,

	_hue: 0,
	_saturation: 0.5,
	_brightness: 0.5,

	_areaDown: false,
	_hueDown: false,

	onChange: null,

	init: function ()
	{
		this._areaCanvas = document.getElementById('picker-area');
		this._hueCanvas = document.getElementById('picker-hue');
		this._cursor = document.getElementById('picker-cursor');
		this._hueCursor = document.getElementById('picker-hue-cursor');

		if (!this._areaCanvas || !this._hueCanvas) return;

		this._areaCtx = this._areaCanvas.getContext('2d');
		this._hueCtx = this._hueCanvas.getContext('2d');

		this._bindEvents();
		this._drawHueStrip();
		this._drawArea();
		this._updateCursors();
	},

	setFromRGB: function (r, g, b)
	{
		var hsv = this._rgbToHsv(r, g, b);
		this._hue = hsv.h;
		this._saturation = hsv.s;
		this._brightness = hsv.v;
		this._drawArea();
		this._updateCursors();
	},

	getRGB: function ()
	{
		return this._hsvToRgb(this._hue, this._saturation, this._brightness);
	},

	resize: function ()
	{
		if (!this._areaCanvas) return;
		var wrap = this._areaCanvas.parentElement;
		if (!wrap) return;

		var w = wrap.clientWidth;
		var h = Math.round(w * 0.72);
		this._areaCanvas.width = w;
		this._areaCanvas.height = h;

		var hueWrap = this._hueCanvas.parentElement;
		this._hueCanvas.width = hueWrap ? hueWrap.clientWidth : w;
		this._hueCanvas.height = 20;

		this._drawHueStrip();
		this._drawArea();
		this._updateCursors();
	},

	// === Рисование ===

	_drawArea: function ()
	{
		var ctx = this._areaCtx;
		var w = this._areaCanvas.width;
		var h = this._areaCanvas.height;

		// Базовый цвет при текущем hue (полная насыщенность, полная яркость)
		var baseRgb = this._hsvToRgb(this._hue, 1, 1);
		var baseStr = 'rgb(' + baseRgb.r + ',' + baseRgb.g + ',' + baseRgb.b + ')';

		// Слой 1: горизонтальный градиент белый → hue-цвет
		var gradH = ctx.createLinearGradient(0, 0, w, 0);
		gradH.addColorStop(0, '#ffffff');
		gradH.addColorStop(1, baseStr);
		ctx.fillStyle = gradH;
		ctx.fillRect(0, 0, w, h);

		// Слой 2: вертикальный градиент прозрачный → чёрный
		var gradV = ctx.createLinearGradient(0, 0, 0, h);
		gradV.addColorStop(0, 'rgba(0,0,0,0)');
		gradV.addColorStop(1, '#000000');
		ctx.fillStyle = gradV;
		ctx.fillRect(0, 0, w, h);
	},

	_drawHueStrip: function ()
	{
		var ctx = this._hueCtx;
		var w = this._hueCanvas.width;
		var h = this._hueCanvas.height;
		var grad = ctx.createLinearGradient(0, 0, w, 0);

		for (var i = 0; i <= 6; i++)
		{
			var rgb = this._hsvToRgb(i / 6, 1, 1);
			grad.addColorStop(i / 6, 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
		}

		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, w, h);
	},

	_updateCursors: function ()
	{
		if (!this._cursor || !this._areaCanvas) return;

		var aw = this._areaCanvas.width;
		var ah = this._areaCanvas.height;
		var x = this._saturation * aw;
		var y = (1 - this._brightness) * ah;

		this._cursor.style.left = x + 'px';
		this._cursor.style.top = y + 'px';

		// Цвет курсора — контрастный
		var rgb = this.getRGB();
		var lum = (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114);
		this._cursor.style.borderColor = lum > 128 ? '#000' : '#fff';

		// Hue cursor
		if (this._hueCursor && this._hueCanvas)
		{
			var hx = this._hue * this._hueCanvas.width;
			this._hueCursor.style.left = hx + 'px';
		}
	},

	// === События ===

	_bindEvents: function ()
	{
		var self = this;

		// Area
		this._areaCanvas.addEventListener('pointerdown', function (e) { self._areaDown = true; self._handleArea(e); e.preventDefault(); });
		document.addEventListener('pointermove', function (e) { if (self._areaDown) { self._handleArea(e); e.preventDefault(); } });
		document.addEventListener('pointerup', function () { self._areaDown = false; });

		// Hue
		this._hueCanvas.addEventListener('pointerdown', function (e) { self._hueDown = true; self._handleHue(e); e.preventDefault(); });
		document.addEventListener('pointermove', function (e) { if (self._hueDown) { self._handleHue(e); e.preventDefault(); } });
		document.addEventListener('pointerup', function () { self._hueDown = false; });
	},

	_handleArea: function (e)
	{
		var rect = this._areaCanvas.getBoundingClientRect();
		var x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
		var y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

		this._saturation = x;
		this._brightness = 1 - y;
		this._updateCursors();
		this._emitChange();
	},

	_handleHue: function (e)
	{
		var rect = this._hueCanvas.getBoundingClientRect();
		var x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

		this._hue = x;
		this._drawArea();
		this._updateCursors();
		this._emitChange();
	},

	_emitChange: function ()
	{
		if (this.onChange)
		{
			var rgb = this.getRGB();
			this.onChange(rgb.r, rgb.g, rgb.b);
		}
	},

	// === Конвертация ===

	_hsvToRgb: function (h, s, v)
	{
		var r, g, b;
		var i = Math.floor(h * 6);
		var f = h * 6 - i;
		var p = v * (1 - s);
		var q = v * (1 - f * s);
		var t = v * (1 - (1 - f) * s);

		switch (i % 6)
		{
			case 0: r = v; g = t; b = p; break;
			case 1: r = q; g = v; b = p; break;
			case 2: r = p; g = v; b = t; break;
			case 3: r = p; g = q; b = v; break;
			case 4: r = t; g = p; b = v; break;
			case 5: r = v; g = p; b = q; break;
		}

		return {
			r: Math.round(r * 255),
			g: Math.round(g * 255),
			b: Math.round(b * 255),
		};
	},

	_rgbToHsv: function (r, g, b)
	{
		r /= 255; g /= 255; b /= 255;
		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);
		var d = max - min;
		var h = 0;
		var s = max === 0 ? 0 : d / max;
		var v = max;

		if (d !== 0)
		{
			switch (max)
			{
				case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
				case g: h = ((b - r) / d + 2) / 6; break;
				case b: h = ((r - g) / d + 4) / 6; break;
			}
		}

		return { h: h, s: s, v: v };
	},
};
