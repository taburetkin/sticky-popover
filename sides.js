const _sides = {
	top: 'bottom',
	left: 'right'
}
const _sideDimensions = {
	top: 'height',
	bottom: 'height',
	left: 'width',
	right: 'width'
}

const _dimensions = {
	width: {
		dimension: 'width',
		opposite: 'height',
		start: 'left',
		end: 'right'
	},
	height: {
		dimension: 'height',
		opposite: 'width',
		start: 'top',
		end: 'bottom'
	}
}




function createSideInfo(id, opposite) {

	const dimension = _sideDimensions[id];
	const dimensionInfo = _dimensions[dimension];
	const altDimension = dimensionInfo.opposite;
	const aldDimensionInfo = _dimensions[altDimension];
	const info = {
		id,
		opposite,
		dimension,
		dimensionStart: dimensionInfo.start,
		dimensionEnd: dimensionInfo.end,
		altDimension,
		altStart: aldDimensionInfo.start,
		altEnd: aldDimensionInfo.end,
		main: { ...dimensionInfo },
		alt: { ...aldDimensionInfo }
	}
	return info;
}

export const SIDES = Object.keys(_sides).reduce((info, side) => {
	const oppositeSide = _sides[side];
	info[side] = createSideInfo(side, oppositeSide);
	info[oppositeSide] = createSideInfo(oppositeSide, side);
	return info;
}, {})

export const ALIGNS = {
	start: 1,
	center: 1,
	end: 1,
}