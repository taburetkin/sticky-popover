import _ from 'underscore';

const itemTemplate = _.template(`<header>item number #<%= index %></header><div class="cell a">A</div><div class="cell b">B</div><div class="cell c">C</div>`);

export function createItems(howMany = 5) {
	const views = [];
	for(let index = 0; index < howMany; index ++) {
		const view = createItem(index);
		views.push(view);
		document.body.appendChild(view.el);
	}
	return views;
}


function createItem(index) {
	const el = document.createElement('div');
	el.innerHTML = itemTemplate({ index });
	el.className = 'item';
	return {
		cid: _.uniqueId('v'), 
		el
	}
}
