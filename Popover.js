import { positioningApi } from "./positioningApi.js";
import { applyStylesToElement, parseStringPlacement, positionToStyles } from "./utils.js";

const emptyPosition = {
	top: 0,
	left: 0,
	right: 'unset',
	bottom: 'unset',
}

export class Popover {

	constructor(options) {

		this.scrollListeners = [];
		this.setOptions(options);

		if (options) {
			this.refEl = options.referenceEl;
		}

	}

	setOptions(options) {
		this.options = normalizeOptions(options, { defaultSide: 'bottom', defaultAlign: 'start' });
	}



	setReferenceElement(el, options) {
		this._removeScrollListeners();
		this._setScrollListeners(el, options);
		this.refEl = el;
	}

	_removeScrollListeners() {
		this.scrollListeners.forEach(({ event, callback, el }) => {
			el.removeEventListener(event, callback);
		});
		this.scrollListeners.length = 0;
	}

	_setScrollListeners(el, options) {

		let parent = el.parentNode;
		const callback = () => this.update(options);
		const event = 'scroll';

		while(parent != null) {

			// we have to settle scroll event handler on every parent of reference element
			parent.addEventListener(event, callback);
			this.scrollListeners.push({ el: parent, event, callback });

			parent = parent.parentNode;

		}
	}
	
	setPopoverElement(el) {
		this.el = el;
		this.elBoundingBox = positioningApi.getBoundingBox(el);
	}

	_attachPopoverElement(el) {
		if (el.parentNode == null) {
			document.body.appendChild(el);
		}
	}

	_detachPopoverElement(el) {
		if (el && el.parentNode) {
			el.parentNode.removeChild(el);
		}
	}

	show(options = {}) {
		

		if (this._isShowing) {
			this.hide();
		}
		this._isShowing = true;

		let { referenceEl, popoverEl } = options;
		popoverEl = popoverEl || this.el;
		this._attachPopoverElement(popoverEl);
		this.setPopoverElement(popoverEl);

		options = Object.assign({}, this.options, normalizeOptions(options, { defaultSide: this.options.side, defaultAlign: this.options.align }));

		referenceEl = referenceEl || this.refEl;
		this.setReferenceElement(referenceEl, options);
		
		this.update(options);

	}

	hide() {
		this._detachPopoverElement(this.el);
		this._removeScrollListeners();
		this._isShowing = false;
	}


	update(options) {
		
		const viewport = positioningApi.getViewport();
		const referenceVisibleBox = positioningApi.getVisibleBox(this.refEl, viewport);
		
		let styles = { display: 'none' };
		
		if (referenceVisibleBox.isVisible) {

			options = this.getUpdateOptions(Object.assign({ referenceVisibleBox, viewport }, this.options, options));
			
			styles.display = options.useElementDisplay || 'block';
			
			const { position, side, align } = this.findElementPosition(options);

			const positionStyles = positionToStyles(position);
			Object.assign(styles, positionStyles);

			this.updateElementSideInfo(side, align);

		}
		
		styles = this.getUpdateElementStyles(styles);
		
		applyStylesToElement(this.el, styles);
		
	}

	getUpdateOptions (options) {
		return options;
	}

	getUpdateElementStyles(styles) {
		return styles;
	}

	updateElementSideInfo(side, align) {
		this.el.setAttribute('data-side', side);
		this.el.setAttribute('data-align', align);
	}




	findElementPosition(options = {}) {

		let side = getOption('side', options, this.options);
		let align = getOption('align', options, this.options);

		
		let viewport = options.viewport || positioningApi.getViewport();
		let referenceVisibleBox = options.referenceVisibleBox || positioningApi.getVisibleBox(this.refEl, viewport);

		// resetting element before constructing boundingBox;
		applyStylesToElement(this.el, emptyPosition);

		let elementBoundingBox = this.elBoundingBox;
		// positioningApi.getBoundingBox(this.el);
		// options.elementBoundingBox || this.getElBounding(true);

		

		const context = positioningApi.findPosition(referenceVisibleBox, elementBoundingBox, side, align, options, viewport);

		return context;
	}



	/**
	 * We must use destroy() method to remove scroll handler listeners and element references
	 * @returns void
	 */
	destroy() {
		
		if (this._isDestroying || this._isDestroyed) { return; }

		this._isDestroying = true;

		this.hide();

		delete this.el;
		delete this.refEl;

		this._isDestroyed = true;
	}

	isDestroyed() {
		return this._isDestroyed === true;
	}
}


function normalizeOptions(options, { normalizePlacement = true, defaultSide, defaultAlign, leaveElements } = {}) {
	// no options or only placement
	if (options == null || typeof options === 'string') {
		return normalizePlacement ? parseStringPlacement(options, defaultSide, defaultAlign) : {};
	}

	
	options = Object.assign({}, options);

	if (!options.side && !options.align && normalizePlacement) {
		const parsed = parseStringPlacement(options.placement, defaultSide, defaultAlign);
		options.side = parsed.side;
		options.align = parsed.align;
		delete options.placement;
	}

	if (!leaveElements) {
		delete options.referenceEl;
		delete options.popoverEl;
	}

	return options;
}

function getOption(key, options1, options2) {
	if (key in options1) {
		return options1[key];
	}
	return options2[key];
}