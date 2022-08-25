/**
 * @author nethe550
 * @license MIT
 * @description The breadth-first pathfinding algorithm.
 */

import Queue from '../../util/struct/Queue.js';
import Cell from '../../grid/Cell.js';
import Algorithm from '../Algorithm.js';

/**
 * @typedef {import('../grid/Grid.js').default} Grid - A grid of cells.
 */

/**
 * The breadth-first pathfinding algorithm.
 * @class
 */
class BreadthFirstAlgorithm extends Algorithm {

    /**
     * Creates a new breadth-first pathfinding algorithm.
     * @param {Grid} grid - The grid to search in.
     */
    constructor(grid) {

        super(grid);

        /**
         * The queue of cells that have been explored.
         * @type {Queue}
         */
        this.queue = new Queue();

    }

    /**
     * Steps the algorithm forward one search.
     * @param {number} loop - The interval ID calling this method.
     * @returns {boolean} Whether the pathfinding algorithm still requires more steps to finish searching. 
     */
    step(loop) {

        if (this.queue.size == 0) {
            this.visited.push(this.start);
            this.queue.enqueue(this.start);
        }

        if (!this.queue.empty()) {

            const currentCell = this.queue.dequeue();

            if (currentCell == this.end) {
                this.path.set(this.end, currentCell);
                return this.createPath(loop);
            }

            const neighbours = this.neighbours(currentCell.position).filter(neighbour => neighbour.type != Cell.Type.Wall);
            for (let neighbour of neighbours) {

                if (neighbour == this.end) {
                    this.path.set(neighbour, currentCell);
                    return this.createPath(loop);
                }

                if (!this.visited.includes(neighbour)) {
                    this.queue.enqueue(neighbour);
                    this.visited.push(neighbour);
                    this.path.set(neighbour, currentCell);
                }

            }

            this.visited.forEach(cell => {
                if (![Cell.Type.Start, Cell.Type.End].includes(cell.type)) cell.type = Cell.Type.Searched;
            });

            this.queue.forEach(cell => {
                if (![Cell.Type.Start, Cell.Type.End].includes(cell.type)) cell.type = Cell.Type.Searching;
            });

            return true;

        }

        return false;

    }

}

export default BreadthFirstAlgorithm;