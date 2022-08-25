/**
 * @author nethe550
 * @license MIT
 * @description A colour manager and converter.
 */

/**
 * A colour manager and converter.
 * @class
 */
class Color {

    static white      = new Color(1.00, 1.00, 1.00);
    static grey       = new Color(0.50, 0.50, 0.50);
    static lightgrey  = new Color(0.75, 0.75, 0.75);
    static black      = new Color(0.00, 0.00, 0.00);
    static red        = new Color(1.00, 0.00, 0.00);
    static orange     = new Color(1.00, 0.50, 0.00);
    static yellow     = new Color(1.00, 1.00, 0.00);
    static chartreuse = new Color(0.50, 1.00, 0.00);
    static green      = new Color(0.00, 1.00, 0.00);
    static mint       = new Color(0.00, 1.00, 0.50);
    static cyan       = new Color(0.00, 1.00, 1.00);
    static azure      = new Color(0.00, 0.50, 1.00);
    static blue       = new Color(0.00, 0.00, 1.00);
    static purple     = new Color(0.50, 0.00, 1.00);
    static magenta    = new Color(1.00, 0.00, 1.00);
    static pink       = new Color(1.00, 0.75, 0.75);

    /**
     * Creates a new colour.
     * @param {number} r - The red component.
     * @param {number} g - The green component.
     * @param {number} b - The blue component.
     * @param {number} a - The alpha component.
     */
    constructor(r, g, b, a=1) {
        /**
         * The red component of this colour.
         * @type {number}
         */
        this.r = r;
        /**
         * The green component of this colour.
         * @type {number}
         */
        this.g = g;
        /**
         * The blue component of this colour.
         * @type {number}
         */
        this.b = b;
        /**
         * The alpha component of this colour.
         * @type {number}
         */
        this.a = a;
    }

    /**
     * The CSS colour string representation of this colour.
     * @returns {string}
     */
    get css() {
        return `rgba(${Math.floor(this.r * 255)},${Math.floor(this.g * 255)},${Math.floor(this.b * 255)},${this.a})`;
    }

    /**
     * The hexadecimal string representation of this colour.
     * @returns {string}
     */
    get hex() {
        return `#${Math.floor(this.r * 255).toString(16).padStart(2, '0')}${Math.floor(this.g * 255).toString(16).padStart(2, '0')}${Math.floor(this.b * 255).toString(16).padStart(2, '0')}`;
    }

}

export default Color;