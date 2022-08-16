import './style.less';
import { Popover } from '../../../Popover';
import { createPopoverEl } from '../../utils';

const template = `
<div class="item i1">click me</div>
<div class="item i2">hover me</div>
`;

export function popover() {

	document.body.className = 'popover';
	document.body.innerHTML = template;

	const popover = new Popover();

	document.querySelectorAll('.item').forEach((referenceEl, index) => {
		
		const event = index ? 'mouseenter' : 'click';
		const placement = index ? 'left-end' : 'top';
		const offsetMain = index ? 0 : 15;

		referenceEl.addEventListener(event, () => {

			const popoverEl = createPopoverEl();

			popover.show({ referenceEl, popoverEl, placement, offsetMain });

		});

	});

}