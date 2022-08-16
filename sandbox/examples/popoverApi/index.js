
import { createPopoverEl } from '../../utils';

import { mypopApi } from './api.js';
import { createItems } from './items';

import './style.less';


export function popoverApi(howMany = 100) {
	
	document.body.className = 'api';

	createItems(howMany);

	document.querySelectorAll('.item').forEach(initializeOne);
	
}


function initializeOne(el, index) {

	const getPopoverEl = (ctx, api, options) => {

		const el = createPopoverEl();

		if (options.openEvent === 'mouseenter') {
			el.addEventListener('mouseenter', () => api.cancelRemoving(ctx));
			el.addEventListener('mouseleave', () => api.scheduleRemove(ctx, options))
		}

		return el;

	}

	const config = {
		index,
		openEvent: 'mouseenter', 
		removeDelay: 1000,
		referenceEl: el.querySelector('.cell.a'),
		getPopoverEl
	};


	// initializing first
	mypopApi.initializePopover(config);

	// initializing second
	mypopApi.initializePopover({
		...config,
		referenceEl: el.querySelector('.cell.c'), 
		placement: 'right',
	});

	// initializing third
	mypopApi.initializePopover({ 
		...config,
		referenceEl: el.querySelector('.cell.b'), 
		openEvent: 'click', 
		showDelay: 0 
	});

}










