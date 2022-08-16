export function createPopoverEl({ addAfterContent = '' } = {}) {
	const popup = document.createElement('div');
	popup.innerHTML = `<div class="content">
	Hello! I am the POPOVER!<br/>kawabanga<br/>
	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fusce id velit ut tortor pretium viverra. Iaculis nunc sed augue lacus viverra vitae congue eu consequat. Risus ultricies tristique nulla aliquet. Vestibulum lectus mauris ultrices eros in cursus. A arcu cursus vitae congue mauris rhoncus. Risus pretium quam vulputate dignissim suspendisse in. Urna et pharetra pharetra massa massa ultricies. Molestie ac feugiat sed lectus vestibulum mattis ullamcorper velit. Varius quam quisque id diam vel quam. Ut venenatis tellus in metus vulputate eu scelerisque. Et malesuada fames ac turpis egestas sed. Curabitur vitae nunc sed velit dignissim sodales. Sit amet mauris commodo quis imperdiet massa tincidunt nunc. Eget nullam non nisi est sit amet. Mi quis hendrerit dolor magna eget. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus. Adipiscing commodo elit at imperdiet dui accumsan sit amet nulla.</p>
	${addAfterContent}
	</div>
	<div class="arrow"></div>`;
	popup.className = 'popup-container';
	
	return popup;
}
