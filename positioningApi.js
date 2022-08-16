import { SIDES } from "./sides";

const normNum = num => num < 0 ? 0 : num;
const normSide = side => typeof side === 'string' ? SIDES[side] : side;


const normSideValue = (box, res, side, c, aside = SIDES[side].opposite) =>
    c(box[side], res[side]) ? res[side]
    : c(box[side], res[aside]) ? box[side]
    : res[aside];

const normSideValueLess = (box, res, side) => normSideValue(box, res, side, (a,b) => a < b);
                            // box[side] < res[side] ? res[side]
                            // : box[side] < res[aside] ? box[side]
                            // : res[aside];

const normSideValueMore = (box, res, side) => normSideValue(box, res, side, (a,b) => a > b);
                            // box[side] > res[side] ? res[side]
                            // : box[side] > res[aside] ? box[side]
                            // : res[aside];

function updateVisibleFields(box)
{
    box.visibleHeight = normNum(box.bottom - box.top);
    box.visibleWidth = normNum(box.right - box.left);
    // if any of visible dimensions is 0 then box is not visible
    box.isVisible = box.visibleHeight > 0 && box.visibleWidth > 0;
    return box;
}

function getSideMainOffset(side, options) {
    
    let offset = options.offsetMain || 0;
	return (side.id === side.dimensionStart) ? -offset : offset;
}

function getSideAltOffset(options, align) {
	const offset = options.offsetAlt || 0;
	if (align === 'center' || offset === 0) { return 0; }
	return align === 'start' ? offset : -offset;
}

function getSideMainValue(refBox, elBox, side, options) {
	
	const sideValue = refBox[side.id];
	const dimValue = elBox[side.dimension]
	const extract = side.id === side.dimensionStart
	const offset = getSideMainOffset(side, options);

	return (extract ? sideValue - dimValue : sideValue) + offset;
}

function getSideAltValue(refBox, elBox, side, align, options) {
	const start = refBox[side.altStart];
	const end = refBox[side.altEnd];
	const plcDimensionValue = elBox[side.altDimension];
	const offset = getSideAltOffset(options, align);

	switch(align) {
    case 'start':
        return start + offset;
    case 'end':
        return (end - plcDimensionValue) + offset;
    }
        
    return (start + end) / 2 - plcDimensionValue / 2;
}

function getAvailableAlign(side, align, refVBox, viewportValue, elementValue) {

    const refPoints = {
        start: refVBox[side.alt.start],
        center: (refVBox[side.alt.start] + refVBox[side.alt.end]) / 2,
        end: refVBox[side.alt.end]
    }
    const viewportRemains = {
        start: (viewportValue - refPoints.start) > elementValue,
        center: (refPoints.center > (elementValue / 2)) && ((viewportValue - refPoints.center) > (elementValue / 2)),
        end: refPoints.end > elementValue,
    }

    if (viewportRemains[align]) {
        return align;
    }

    if (align === 'center') {
        return viewportRemains.start ? 'start'
            : viewportRemains.end ? 'end'
            : align
    }


    if (viewportRemains.center) {
        return 'center';
    }

    const opposite = align === 'start' ? 'end' : 'start';
    
    return viewportRemains[opposite] ? opposite : align;

}

function getSidePlace(side, rvBox, viewport, offsetMain) {
    side = normSide(side);
    const res = {
        [side.alt.dimension]: viewport[side.alt.dimension],
        [side.main.dimension]: side.id === side.main.start 
            ? rvBox[side.id] - offsetMain
            : viewport[side.dimension] - rvBox[side.id] - offsetMain,
    }
    return res;
}


export const positioningApi = {

	getBoundingBox(el, modifyable) {

		const rect = el.getBoundingClientRect();
		if (!modifyable) { return rect; }

		const { left, top, right, bottom, width, height } = rect;
		return { left, top, right, bottom, width, height };
	},

	getVisibleBox(el, viewport) {

        viewport = viewport || this.getViewport();

		if (!el || el === document.body) {
            return viewport;
        }
    
        let parent = el;
        let elements = [];
        while (parent != null) {
            elements.push(parent);
            if (parent.parentNode !== document.body) {
                parent = parent.parentNode;
            } else {
                parent = null;
            }
        }
        let { left, top, right, bottom } = viewport;
        const res = { left, top, right, bottom };
    
		
        while (elements.length) {
            let node = elements.pop();
            const box = this.getBoundingBox(node);

            res.width = box.width ;
            res.height = box.height;
        
            left = normSideValueLess(box, res, 'left');
            
            top = normSideValueLess(box, res, 'top');

            right = normSideValueMore(box, res, 'right');
                
            bottom = normSideValueMore(box, res, 'bottom');

            res.left = left;
            res.top = top;
            res.right = right;
            res.bottom = bottom;
        }
        return updateVisibleFields(res);
	},

	getViewport() {
        let width = window.innerWidth;
        let height = window.innerHeight
        const viewport = {
            left: 0, 
			top: 0, 
			right: width, 
			bottom: height,
			width,
			height,
		}
        
        const vp = window.visualViewport;
		if (vp) {
			viewport.width = vp.width;
			viewport.height = vp.height;
		}

		return updateVisibleFields(viewport);
	},

	findPosition(referenceVisibleBox, elementBoundingBox, side, align, options, viewport) {
        let availableSide = SIDES[side];
        let availableAlign = align;

        if (options.autoPlacement !== false) {
            let res = this.detectAvailableSide(referenceVisibleBox, elementBoundingBox, availableSide, align, viewport, options);
            availableSide = res.side;
            availableAlign = res.align;
        }

        return {
            position: this.getSidePosition(referenceVisibleBox, elementBoundingBox, availableSide, availableAlign, options),
            side: availableSide.id,
            align: availableAlign
        }

	},

	detectAvailableSide(referenceVisibleBox, elementBoundingBox, side, align, viewport, options) {

        if (typeof side === 'string') {
			side = SIDES[side];
		}

		let availSide = side;
		let availAlign = align;

        const offsetMain = getSideMainOffset(side, options);

        const sideIds = [
            side.id,
            side.altEnd,
            side.altStart,
            side.opposite,
        ];

        for (let id of sideIds) {
            const place = getSidePlace(id, referenceVisibleBox, viewport, offsetMain);

            if (place.width >= elementBoundingBox.width && place.height >= elementBoundingBox.height) {
                // suitable place found

                availSide = SIDES[id];

                // width or hight of element
                const elementValue = elementBoundingBox[availSide.altDimension];
                // width or hight of viewport
                const viewportValue = place[availSide.altDimension];

                availAlign = getAvailableAlign(availSide, align, referenceVisibleBox, viewportValue, elementValue);

                break;
            }
        }

        return {
                side: availSide,
                align: availAlign
            }
	},

	getSidePosition(refBox, elBox, side, align, options) {
        return {
            [side.dimensionStart]: getSideMainValue(refBox, elBox, side, options),
            [side.altStart]: getSideAltValue(refBox, elBox, side, align, options),
            [side.dimensionEnd]: undefined,
            [side.altEnd]: undefined,
        }
	},


}