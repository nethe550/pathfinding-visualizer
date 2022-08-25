/**
 * @author nethe550
 * @license MIT
 * @description A numerical two-dimensional vector.
 */

/**
 * A numerical two-dimensional vector.
 * @class
 */
class Vector2 {

    /**
     * A 2D vector with both components initialized to zero.
     */
    static zero = new Vector2(0, 0);

    /**
     * A 2D vector pointing up in the HTML canvas coordinate space.
     * @type {Vector2}
     */
    static up = new Vector2(0, -1);
    /**
     * A 2D vector pointing left in the HTML canvas coordinate space.
     * @type {Vector2}
     */
    static left = new Vector2(-1, 0);
    /**
     * A 2D vector pointing down in the HTML canvas coordinate space.
     * @type {Vector2}
     */
    static down = new Vector2(0, 1);
    /**
     * A 2D vector pointing right in the HTML canvas coordinate space.
     * @type {Vector2}
     */
    static right = new Vector2(1, 0);

    /**
     * Creates a new 2D vector.
     * @param {number} x - The x component value.
     * @param {number} y - The y component value.
     */
    constructor(x, y) {
        /**
         * The x component of this 2D vector.
         * @type {number}
         */
        this.x = x;
        /**
         * The y component of this 2D vector.
         * @type {number}
         */
        this.y = y;
    }

    /**
     * The magnitude (length) of this 2D vector.
     * @returns {number}
     */
    get magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    /**
     * The normalized direction of this 2D vector.
     * @returns {Vector2}
     */
    get normalized() {
        const m = this.magnitude;
        return new Vector2(this.x / m, this.y / m);
    }

    /**
     * Creates a new copy of this vector.
     * @returns {Vector2} The new copy.
     */
    copy() { return new Vector2(this.x, this.y); }

    /**
     * Adds a 2D vector or number to this vector.
     * @param {Vector2|number} v - The vector or number to add.
     * @returns {Vector2} The new 2D vector.
     */
    add(v) {
        if (v instanceof Vector2) return new Vector2(this.x + v.x, this.y + v.y);
        else return new Vector2(this.x + v, this.y + v);
    }
    
    /**
     * Subtracts a 2D vector or number from this vector.
     * @param {Vector2|number} v - The vector or number to subtract.
     * @returns {Vector2} The new 2D vector.
     */
    sub(v) {
        if (v instanceof Vector2) return new Vector2(this.x - v.x, this.y - v.y);
        else return new Vector2(this.x - v, this.y - v);
    }

    /**
     * Multiplies this vector by a 2D vector or number.
     * @param {Vector2|number} v - The vector or number to multiply by.
     * @returns {Vector2} The new 2D vector.
     */
    mul(v) {
        if (v instanceof Vector2) return new Vector2(this.x * v.x, this.y * v.y);
        else return new Vector2(this.x * v, this.y * v);
    }

    /**
     * Divides this vector by a 2D vector or number.
     * @param {Vector2|number} v - The vector or number to divide by.
     * @returns {Vector2} The new 2D vector.
     */
    div(v) {
        if (v instanceof Vector2) return new Vector2(this.x / v.x, this.y / v.y);
        else return new Vector2(this.x / v, this.y / v);
    }

    /**
     * Checks if this vector equals another 2D vector or number component-wise.
     * @param {Vector2|number} v - The vector or number to compare against.
     * @returns {boolean} Whether this vector equals the given vector or number.
     */
    equals(v) {
        if (v instanceof Vector2) return this.x == v.x && this.y == v.y;
        else return this.x == v && this.y == v;
    }

    /**
     * Floors the components of a vector.
     * @param {Vector2} v - The vector to floor.
     * @returns {Vector2} The floored vector.
     */
    static Floor(v) {
        return new Vector2(Math.floor(v.x), Math.floor(v.y));
    }

    /**
     * Finds the maximum of a set of vectors component-wise.
     * @param {...Vector2[]} v - The vectors to compare.
     * @returns {Vector2} The maximum component values of the given vectors.
     */
    static Max(...v) {

        const max = new Vector2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);

        for (let vector of v) {
            if (vector.x > max.x) max.x = vector.x;
            if (vector.y > max.y) max.y = vector.y;
        }

        return max;

    } 

    /**
     * Finds the minimum of a set of vectors component-wise.
     * @param  {...Vector2[]} v - The vectors to compare.
     * @returns {Vector2} The minimum component values of the given vectors.
     */
    static Min(...v) {

        const min = new Vector2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);

        for (let vector of v) {
            if (vector.x < min.x) min.x = vector.x;
            if (vector.y < min.y) min.y = vector.y;
        }

        return min;

    }

}

export default Vector2;