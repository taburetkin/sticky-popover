import { PopoverApi } from "../../../PopoverApi";

class MyPopoverApi extends PopoverApi {



	setupPopoverShow(options, callback) {
		const referenceEl = options.referenceEl;
		referenceEl.addEventListener(options.openEvent, callback);
	}

	getPopoverContext(options) {

		if (options.context) {
			return options.context;
		}

		const { referenceEl, getPopoverEl, openEvent, showDelay, removeDelay, placement, singleton } = options;
		
		const hoverable = openEvent === 'mouseenter';
		const toggleStrategy = openEvent === 'click'

		
		const extend = {
			showDelay, 
			removeDelay, 
			toggleStrategy, 
			singleton,
		}

		const getShowOptions = (ctx) => ({
			referenceEl,
			popoverEl: getPopoverEl(ctx, this, options),
			placement
		});

		let ctx = this.createPopoverContext(options, getShowOptions, extend);

		if (hoverable) {
			referenceEl.addEventListener('mouseleave', () => this.scheduleRemove(ctx, options));
		}

		options.context = ctx;

		return ctx;
	}


}

export const mypopApi = new MyPopoverApi();