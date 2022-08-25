/**
 * @author nethe550
 * @license MIT
 * @description A pathfinding cell.
 */

import Color from '../util/render/Color.js';

/**
 * @typedef {import('../util/vector/Vector2.js').default} Vector2 - A numerical two-dimensional vector.
 */

/**
 * A pathfinding cell.
 * @class
 */
class Cell {

    /**
     * An enumeration of valid cell types.
     * @enum
     * @property {string} Empty - An empty cell.
     * @property {string} Wall - A wall that obstructs the pathfinding algorithm.
     * @property {string} Start - The starting cell of the pathfinding algorithm.
     * @property {string} End - The ending cell of the pathfinding algorithm.
     * @property {string} Searching - A cell that is currently being searched by the pathfinding algorithm.
     * @property {string} Searched - A cell that has already been searched by the pathfinding algorithm.
     */
    static Type = {
        Empty: 'empty',
        Wall: 'wall',
        Start: 'start',
        End: 'end',
        Searching: 'searching',
        Searched: 'searched',
        Path: 'path',
        /**
         * Finds the cell type key from a value, if it exists.
         * @param {string} value - The value to search for.
         * @returns {string[]|null} The found keys, or null if none could be found.
         */
        key: value => {
            const candidates = Object.values(Cell.Type).filter(v => v == value);
            if (candidates.length > 0 && candidates[0]) return candidates;
            else return null;
        },
        /**
         * Creates a safe cell type with an attempt and an alternative type.
         * @param {string} attempt - The cell type that may be null.
         * @param {string} alternative - The fallback cell type.
         * @returns {string} The safe cell type.
         */
        fallback: (attempt, alternative) => {
            if (alternative == null || !Cell.Type.key(alternative)) alternative = Cell.Type.Empty;
            if (!attempt || typeof attempt !== 'string') return alternative;
            if (Object.values(Cell.Type).includes(attempt.trim().toLowerCase())) return attempt;
            return alternative;
        }
    };

    /**
     * An enumeration of cell type colours.
     * @enum
     * @property {Color} empty - The color of an empty cell.
     * @property {Color} wall - The color of a wall cell.
     * @property {Color} start - The color of the starting cell.
     * @property {Color} end - The color of the ending cell.
     * @property {Color} searching - The color of a cell that is being searched.
     * @property {Color} searched - The color of a cell that has been searched.
     */
    static Colours = {
        empty: Color.white,
        wall: Color.black,
        start: Color.mint,
        end: Color.red,
        searching: Color.grey,
        searched: Color.lightgrey,
        path: Color.pink
    };

    /**
     * Creates a new cell.
     * @param {Vector2} position - The position of the cell.
     * @param {string} type - The type of the cell.
     */
    constructor(position, type=Cell.Type.Empty) {

        /**
         * The position of this cell.
         * @type {Vector2}
         */
        this.position = position;

        type = type.trim().toLowerCase();

        /**
         * The type of this cell.
         * @type {string}
         */
        this.type = Object.values(Cell.Type).includes(type) ? type : Cell.Type.Empty;

    }

    /**
     * Renders this cell to a specified rendering context.
     * @param {CanvasRenderingContext2D} ctx - The rendering context to draw this cell to.
     * @param {Vector2} size - The size in pixels to render this cell at.
     * @param {number} border - The thickness of the cell border.
     */
    render(ctx, size, border=1) {

        const cellOffset = this.position.mul(size).add(border * 0.5);
        const cellSize = size.copy().sub(border * 0.5);

        ctx.fillStyle = Cell.Colours[this.type].css;

        ctx.fillRect(cellOffset.x, cellOffset.y, cellSize.x, cellSize.y);

    }

}

export default Cell;