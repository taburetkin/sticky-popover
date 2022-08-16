import { ALIGNS, SIDES } from "./sides.js";

/**
 * converts string placement to object
 * @param {string} text string to parse (f.e. 'bottom-end', 'left-start', 'top' etc)
 * @returns { {side: string, align: string} }
 */
export function parseStringPlacement (text = '', defaultSide, defaultAlign) {

    const chunks = text.split('-');
    let side = chunks[0];
    let align = chunks[1];
    if (side && !align) {
        align = 'center';
    }
    if (side in SIDES === false) {

        side = defaultSide;

    }
    if (align in ALIGNS === false) {

        align = defaultAlign;

    }
    return { side, align };

}



/**
 * Applies styles to an element
 * @param {Element} el 
 * @param {object} styles 
 */
export function applyStylesToElement (el, styles) {
    Object.assign(el.style, styles);
}

/**
 * Converts position object to css styles object
 * @param {object} position 
 * @returns {object} styles object
 */
export function positionToStyles(position) {
    const styles = Object.keys(position).reduce((css, key) => {
        let value = position[key];
        if (value == null) {

            value = 'unset';

        } else {

            value += 'px';

        }
        css[key] = value;
        return css;
    }, {});
    return styles;
}

