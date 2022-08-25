/**
 * @author nethe550
 * @license MIT
 * @description A grid of cells.
 */

import Vector2 from '../util/vector/Vector2.js';
import Cell from './Cell.js';

/**
 * A grid of cells.
 * @class
 */
class Grid extends EventTarget {

    /**
     * Creates a new grid of cells.
     * @param {number} width - The width of the grid.
     * @param {number} height - The height of the grid.
     * @param {string} fill - The cell type to fill the grid with.
     * @param {number} border - The thickness of the grid cell border.
     */
    constructor(width, height, fill=null, border=1) {

        super();

        /**
         * The size of this grid.
         * @type {Vector2}
         */
        this._size = new Vector2(width, height);

        /**
         * The cells in this grid.
         * @type {Cell[]}
         */
        this.cells = [];

        /**
         * The default cell type to fill the grid with.
         * @type {string}
         */
        this.defaultFill = Cell.Type.fallback(fill, Cell.Type.Empty);
        
        /**
         * The thickness of this grid's cell border.
         * @type {number}
         */
        this.border = border;

        /**
         * Checks if a coordinate pair is within the bounds of this grid.
         * @param {number} x - The x coordinate to test.
         * @param {number} y - The y coordinate to test.
         * @returns {boolean} Whether the coordinate pair is within the bounds of this grid.
         */
        this.inGrid = (x, y) => x >= 0 && x < this._size.x && y >= 0 && y < this._size.y;

        /**
         * Checks if this grid already has a starting cell in it.
         * @returns {boolean} Whether this grid already has a starting cell in it.
         */
        this.hasStart = () => this.cells.filter(cell => cell.type == Cell.Type.Start).length > 0;

        /**
         * Checks if this grid already has an ending cell in it.
         * @returns {boolean} Whether this grid already has an ending cell in it.
         */
        this.hasEnd = () => this.cells.filter(cell => cell.type == Cell.Type.End).length > 0;

        this.generate(fill);

    }

    /**
     * Sets the width of this grid.
     * Regenerates the grid cells upon resize.
     * @param {number} width - The new width of the grid.
     */
    set width(width) {
        this._size.x = width;
        this.generate(this.defaultFill);
        this.dispatchEvent(new Event('resize'));
    }

    /**
     * Sets the height of this grid.
     * Regenerates the grid cells upon resize.
     * @param {number} height - The new height of the grid.
     */
    set height(height) {
        this._size.y = height;
        this.generate(this.defaultFill);
        this.dispatchEvent(new Event('resize'));
    }

    /**
     * Sets the size of this grid.
     * Regenerates the grid cells upon resize.
     * @param {Vector2} size - The new size of the grid.
     */
    set size(size) {
        this._size = size;
        this.generate(this.defaultFill);
        this.dispatchEvent(new Event('resize'));
    }

    /**
     * The size of this grid.
     * @returns {Vector2}
     */
    get size() {
        return this._size;
    }

    /**
     * Gets a cell in the grid.
     * 
     * Accepts Vector2 as parameter 'a', or x and y coordinates as parameters 'a' and 'b'.
     * @param {Vector2|number} a - The 2D coordinates of the cell, or the x position of the cell.
     * @param {number} b - The y position of the cell.
     * @returns {Cell|undefined} The cell, or null if the position is outside the grid.
     */
    getCell(a, b=null) {
        if (a instanceof Vector2) return this.inGrid(a.x, a.y) ? this.cells.find(cell => cell.position.equals(a)) : undefined;
        else if (typeof a === 'number' && typeof b === 'number') return this.inGrid(a, b) ? this.cells.find(cell => cell.position.equals(new Vector2(a, b))) : undefined;
        else return undefined;
    }

    /**
     * Sets the cell type of a cell in the grid.
     * @param {string} type - The new cell type.
     * @param {Vector2|number} a - The 2D coordinates of the cell, or the x position of the cell.
     * @param {number} b - The y position of the cell.
     * @returns {boolean} Whether the cell type was set.
     */
    setCell(type=Cell.Type.Empty, a=null, b=null) {
        if (!Cell.Type.key(type)) return false;
        if (type == Cell.Type.Start && this.hasStart()) this.cells.find(cell => cell.type == Cell.Type.Start).type = Cell.Type.Empty;
        if (type == Cell.Type.End && this.hasEnd()) this.cells.find(cell => cell.type == Cell.Type.End).type = Cell.Type.Empty;
        const cell = this.getCell(a, b);
        if (cell) {
            cell.type = type;
            return true;
        }
        return false;
    }

    /**
     * Initializes the grid cells.
     * @param {string} fill - The cell type to fill the grid with.
     */
    generate(fill=Cell.Type.Empty) {

        const previousCells = this.cells.filter(cell => cell.type != Cell.Type.Searching && cell.type != Cell.Type.Searched && cell.type != Cell.Type.Path);
        this.cells = [];

        for (let y = 0; y < this._size.y; y++) {
            for (let x = 0; x < this._size.x; x++) {
                const pos = new Vector2(x, y);
                const prevCell = previousCells.find(cell => cell.position.equals(pos));
                this.cells.push(
                    prevCell ? prevCell :
                    new Cell(pos, this.defaultFill ? this.defaultFill : Cell.Type.fallback(fill, Cell.Type.Empty))
                );
            }
        }

    }

    /**
     * Clears all pathfinding cells to be empty.
     */
    clearPathfinding() {

        for (let cell of this.cells) {
            if (cell.type == Cell.Type.Searching || cell.type == Cell.Type.Searched || cell.type == Cell.Type.Path) cell.type = Cell.Type.Empty;
        }

    }

}

export default Grid;