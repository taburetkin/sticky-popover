// const popoverContextDefaults = {
// 	singleton: 'default', // singleton key for single appearence strategy (no more than one popover at a time for given singleton key)
// 	toggleStrategy: false, // hide showed popover instead of showing new one when true
// 	showDelay: 500, // show delay in ms
// 	removeDelay: 500, // hide delay
// 	show(options) {}, // show action, provide your own,
// 	remove() {}, // removing popoverContext.  should remove all registered listeners
// }

function notImplemented(errorMessage = 'not implemented', warnMessage) {
	const error =  new Error(errorMessage);
	console.warn(warnMessage);
	throw error;
}

export const singletons = {
	items: new Map(),

	getKey(popoverCtx) {
		return popoverCtx.singleton || 'default';
	},

	get(popoverCtx) {
		const key = this.getKey(popoverCtx);
		return this.items.get(key);
	},
	remove(popoverCtx) {
		const key = this.getKey(popoverCtx);
		this.items.delete(key);
	},
	create(popoverCtx, remove) {
		const key = this.getKey(popoverCtx);
		const singleton = { key, popoverContext: popoverCtx, remove };
		this.items.set(key, singleton);
	}
}

export class AbstractPopoverApi {

	initializePopover(options) {
		const callback = event => this._open(options, event);
		this.setupPopoverShow(options, callback);
	}

	//abstract, add event listeners to schedule popover show
	setupPopoverShow(options, callback) {
		const message = `setupPopoverShow should implement settling event listeners to schedule popover show
		setupPopoverShow(options, callback) {
			// information about reference element should be provided by you in config
			options.referenceEl.addEventListener('mouseenter', callback);
		}`;
		notImplemented('setupPopoverShowTrigger not implemented', message);
	}

	//abstract, get/create popoverContext with show/remove method
	getPopoverContext(options) {
		const message = `getPopoverContext should return your popoverContext
		getPopoverContext(options) {
			// popoverContext should have show method.

			return {
				show() {
					// ...
				},
				remove() {
					// ...
				}
			}

		}
		`;
		notImplemented('getPopoverContext not implemented', message);
	}

	_open(options, event) {
		// obtaining popoverContext;
		const popoverCtx = this.getPopoverContext(options);

		// removing destroy timer
		this.cancelRemoving(popoverCtx);

		// if popover is showing:
		if (popoverCtx.showing === true) {
			// we should destroy popover if its show strategy is `toggle` 
			if (popoverCtx.toggleStrategy === true) {
				this._removePopover(popoverCtx);
			}
			// otherwise we are done.
			return;
		}

		// we are done if popover has scheduled show timer
		// it means we have complete all needed things early
		if (popoverCtx.showTimer) {
			return;
		}

		this.scheduleShow(popoverCtx, options);

	}



	_ensureSingleton(popoverCtx) {
		
		const remove = () => {
			singletons.remove(popoverCtx);
			this._removePopover(popoverCtx);
			this._tryRemoveShowedSingleton(popoverCtx, false);
		};
		
		singletons.create(popoverCtx, remove);

	}


	_tryRemoveShowedSingleton (popoverCtx, condition) {


		const singleton = singletons.get(popoverCtx);

		if (!singleton) { return; }

		const showedPopoverContext = singleton.popoverContext;

		if (!showedPopoverContext || !showedPopoverContext.showing) { return; }

		if ((popoverCtx === showedPopoverContext) === condition) {
			singleton.remove();
		}
	
	}

	_removePopover (popoverContext) {

		this.cancelRemoving(popoverContext);
		this.cancelShowing(popoverContext);
		popoverContext.remove();
		popoverContext.showing = false;
		
	}


	scheduleRemove(popoverCtx) {
		let removeDelay = popoverCtx.removeDelay;
		if (removeDelay == null) {
			removeDelay = 500;
		}
		this.cancelShowing(popoverCtx);
		if (popoverCtx.showing) {
			this.cancelRemoving(popoverCtx);
			popoverCtx.removeTimeout = setTimeout(() => this._removePopover(popoverCtx), removeDelay);
		}
	}

	scheduleShow(popoverCtx, options) {
		
		let showDelay = popoverCtx.showDelay;
		if (showDelay == null) {
			showDelay = 500;
		}
		popoverCtx.showTimeout = setTimeout(() => {

			this._tryRemoveShowedSingleton(popoverCtx, false);
			
			this._ensureSingleton(popoverCtx);

			popoverCtx.show(options);
			popoverCtx.showing = true;
			


		}, showDelay);

	}

	cancelRemoving (popoverCtx) {

		if (!popoverCtx.removeTimeout) { 
			return;
		}
		clearTimeout(popoverCtx.removeTimeout);
		delete popoverCtx.removeTimeout;

	}

	cancelShowing (popoverCtx) {

		if (!popoverCtx.showTimeout) { return; }
		clearTimeout(popoverCtx.showTimeout);
		delete popoverCtx.showTimeout;

	}


}