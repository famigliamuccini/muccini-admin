;(function () {
	var $ = function (id) {
		return document.getElementById(id)
	}

	var canvas = (this.__canvas = new fabric.Canvas('c', {
		isDrawingMode: true,
	}))

	fabric.Object.prototype.transparentCorners = false

	var btnBrush = $('drawing-mode'),
		drawingOptionsEl = $('drawing-mode-options'),
		drawingColorEl = $('drawing-color'),
		drawingShadowColorEl = $('drawing-shadow-color'),
		drawingLineWidthEl = $('drawing-line-width'),
		drawingShadowWidth = $('drawing-shadow-width'),
		drawingShadowOffset = $('drawing-shadow-offset'),
		clearEl = $('clear-canvas')

	btnErase.onclick = function () {
		canvas.clear()
	}

	btnBrush.onclick = function () {
		canvas.isDrawingMode = !canvas.isDrawingMode
		if (canvas.isDrawingMode) {
			btnBrush.innerHTML = 'Cancel drawing mode'
			drawingOptionsEl.style.display = ''
		} else {
			btnBrush.innerHTML = 'Enter drawing mode'
			drawingOptionsEl.style.display = 'none'
		}
	}

	if (fabric.PatternBrush) {
		var vLinePatternBrush = new fabric.PatternBrush(canvas)
		vLinePatternBrush.getPatternSrc = function () {
			var patternCanvas = fabric.document.createElement('canvas')
			patternCanvas.width = patternCanvas.height = 10
			var ctx = patternCanvas.getContext('2d')

			ctx.strokeStyle = this.color
			ctx.lineWidth = 5
			ctx.beginPath()
			ctx.moveTo(0, 5)
			ctx.lineTo(10, 5)
			ctx.closePath()
			ctx.stroke()

			return patternCanvas
		}

		var hLinePatternBrush = new fabric.PatternBrush(canvas)
		hLinePatternBrush.getPatternSrc = function () {
			var patternCanvas = fabric.document.createElement('canvas')
			patternCanvas.width = patternCanvas.height = 10
			var ctx = patternCanvas.getContext('2d')

			ctx.strokeStyle = this.color
			ctx.lineWidth = 5
			ctx.beginPath()
			ctx.moveTo(5, 0)
			ctx.lineTo(5, 10)
			ctx.closePath()
			ctx.stroke()

			return patternCanvas
		}

		var squarePatternBrush = new fabric.PatternBrush(canvas)
		squarePatternBrush.getPatternSrc = function () {
			var squareWidth = 10,
				squareDistance = 2

			var patternCanvas = fabric.document.createElement('canvas')
			patternCanvas.width = patternCanvas.height =
				squareWidth + squareDistance
			var ctx = patternCanvas.getContext('2d')

			ctx.fillStyle = this.color
			ctx.fillRect(0, 0, squareWidth, squareWidth)

			return patternCanvas
		}

		var diamondPatternBrush = new fabric.PatternBrush(canvas)
		diamondPatternBrush.getPatternSrc = function () {
			var squareWidth = 10,
				squareDistance = 5
			var patternCanvas = fabric.document.createElement('canvas')
			var rect = new fabric.Rect({
				width: squareWidth,
				height: squareWidth,
				angle: 45,
				fill: this.color,
			})

			var canvasWidth = rect.getBoundingRect().width

			patternCanvas.width = patternCanvas.height =
				canvasWidth + squareDistance
			rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 })

			var ctx = patternCanvas.getContext('2d')
			rect.render(ctx)

			return patternCanvas
		}

		var img = new Image()
		img.src = '../assets/honey_im_subtle.png'

		var texturePatternBrush = new fabric.PatternBrush(canvas)
		texturePatternBrush.source = img
	}

	$('drawing-mode-selector').onchange = function () {
		if (this.value === 'hline') {
			canvas.freeDrawingBrush = vLinePatternBrush
		} else if (this.value === 'vline') {
			canvas.freeDrawingBrush = hLinePatternBrush
		} else if (this.value === 'square') {
			canvas.freeDrawingBrush = squarePatternBrush
		} else if (this.value === 'diamond') {
			canvas.freeDrawingBrush = diamondPatternBrush
		} else if (this.value === 'texture') {
			canvas.freeDrawingBrush = texturePatternBrush
		} else {
			canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas)
		}

		if (canvas.freeDrawingBrush) {
			var brush = canvas.freeDrawingBrush
			brush.color = drawingColorEl.value
			if (brush.getPatternSrc) {
				brush.source = brush.getPatternSrc.call(brush)
			}
			brush.width = parseInt(drawingLineWidthEl.value, 10) || 1
			brush.shadow = new fabric.Shadow({
				blur: parseInt(drawingShadowWidth.value, 10) || 0,
				offsetX: 0,
				offsetY: 0,
				affectStroke: true,
				color: drawingShadowColorEl.value,
			})
		}
	}

	drawingColorEl.onchange = function () {
		var brush = canvas.freeDrawingBrush
		brush.color = this.value
		if (brush.getPatternSrc) {
			brush.source = brush.getPatternSrc.call(brush)
		}
	}
	drawingShadowColorEl.onchange = function () {
		canvas.freeDrawingBrush.shadow.color = this.value
	}
	drawingLineWidthEl.onchange = function () {
		canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1
		this.previousSibling.innerHTML = this.value
	}
	drawingShadowWidth.onchange = function () {
		canvas.freeDrawingBrush.shadow.blur = parseInt(this.value, 10) || 0
		this.previousSibling.innerHTML = this.value
	}
	drawingShadowOffset.onchange = function () {
		canvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 0
		canvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 0
		this.previousSibling.innerHTML = this.value
	}

	if (canvas.freeDrawingBrush) {
		canvas.freeDrawingBrush.color = drawingColorEl.value
		canvas.freeDrawingBrush.source = canvas.freeDrawingBrush.getPatternSrc.call(
			this
		)
		canvas.freeDrawingBrush.width =
			parseInt(drawingLineWidthEl.value, 10) || 1
		canvas.freeDrawingBrush.shadow = new fabric.Shadow({
			blur: parseInt(drawingShadowWidth.value, 10) || 0,
			offsetX: 0,
			offsetY: 0,
			affectStroke: true,
			color: drawingShadowColorEl.value,
		})
	}
})()
