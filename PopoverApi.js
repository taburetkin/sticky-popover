import { AbstractPopoverApi } from "./AbstractPopoverApi";
import { Popover } from "./Popover";

export class PopoverApi extends AbstractPopoverApi {
	constructor() {
		super();
		this._popoverInstances = new Map();
	}

	getPopoverInstance(options) {
		const key = options.singleton || 'default';
		let popover = this._popoverInstances.get(key);
		if (!popover) {
			popover = new Popover();
			this._popoverInstances.set(key, popover);
		}
		return popover;
	}

	createPopoverContext(options, getShowOptions, extend = {}) {
		const popover = this.getPopoverInstance(options);
		return {
			show() {
				const showOptions = getShowOptions(this);
				popover.show(showOptions);
			},
			remove() {
				popover.hide();
			},
			...extend,
		}
	}
}