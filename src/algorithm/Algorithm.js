/**
 * @author nethe550
 * @license MIT
 * @description An abstract pathfinding algorithm.
 */

import Cell from '../grid/Cell.js';
import Vector2 from '../util/vector/Vector2.js';

/**
 * @typedef {import('../grid/Grid.js').default} Grid - A grid of cells.
 */

/**
 * An abstract pathfinding algorithm.
 * @class
 */
class Algorithm {

    /**
     * Creates a new pathfinding algorithm.
     * @param {Grid} grid - The grid to search in.
     */
    constructor(grid) {

        /**
         * The grid this algorithm will search.
         * @type {Grid}
         */
        this.grid = grid;

        /**
         * The starting cell.
         * @type {Cell}
         */
        this.start = this.grid.cells.find(cell => cell.type == Cell.Type.Start);
        if (!this.start) throw new TypeError(`Grid must contain a Start cell.`);

        /**
         * The ending or target cell.
         * @type {Cell}
         */
        this.end = this.grid.cells.find(cell => cell.type == Cell.Type.End);
        if (!this.end) throw new TypeError(`Grid must contain an End cell.`);
        
        if (this.start == this.end) throw new Error(`Grid Start cell and End cell must not be the same cell.`);

        /**
         * The cells that have been visited by this algorithm.
         * @type {Cell[]}
         */
        this.visited = [];

        /**
         * The path found by this algorithm.
         * A tree of parent and children cells.
         * @type {Map<Cell, Cell>}
         */
        this.path = new Map();

    }

    /**
     * Steps the algorithm forward one search.
     * @param {number} loop - The interval ID calling this method.
     * @returns {boolean} Whether the pathfinding algorithm still requires more steps to finish searching. 
     */
    step(loop) { // NOSONAR
        throw new Error(`This method cannot be exectued. A pathfinding algorithm must extend the Algorithm class.`);
    }

    /**
     * Finds the neighbours in the cardinal directions of a specified position in the grid.
     * @param {Vector2} position - The position to retrieve neighbours from.
     * @returns {Cell[]} The neighbours of that position in the grid.
     */
     neighbours(position) {
        return [
            this.grid.getCell(position.add(new Vector2(0, -1))),
            this.grid.getCell(position.add(new Vector2(1, 0))),
            this.grid.getCell(position.add(new Vector2(0, 1))),
            this.grid.getCell(position.add(new Vector2(-1, 0)))
        ].filter(neighbour => neighbour);
    }

    /**
     * Creates the path after the algorithm finds the ending cell.
     * @param {number} loop - The interval ID calling the step method.
     * @returns {false} 
     */
     createPath(loop) {

        clearInterval(loop);

        const pathCells = [];

        let currentPosition = this.end;
        while (currentPosition != null) {
            pathCells.push(currentPosition);
            currentPosition = this.path.get(currentPosition);
        }

        pathCells.forEach(cell => {
            if (![Cell.Type.Start, Cell.Type.End].includes(cell.type)) cell.type = Cell.Type.Path;
        });

        return false;

    }

    /**
     * Calculates the taxicab distance (a.k.a. rectilinear distance) between two cells.
     * @param {Cell} a - The first cell.
     * @param {Cell} b - The second cell.
     * @returns {number} The taxicab distance between the two cells.
     */
    taxicabDistance(a, b) {
        return Math.abs(a.position.y - a.position.x) + Math.abs(b.position.y - b.position.x);
    }

    /**
     * Calculates the Euclidian distance between two cells.
     * @param {Cell} a - The first cell.
     * @param {Cell} b - The second cell.
     * @returns {number} The Euclidian distance between the two cells.
     */
    euclidianDistance(a, b) {
        return Math.sqrt((b.position.x - a.position.x) ** 2 + (b.position.y - a.position.y) ** 2);
    }

}

export default Algorithm;