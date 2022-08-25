/**
 * @author nethe550
 * @license MIT
 * @description The greedy best-first pathfinding algorithm.
 */

import PriorityQueue from '../../util/struct/PriorityQueue.js';
import Cell from '../../grid/Cell.js';
import Algorithm from '../Algorithm.js';

/**
 * The greedy best-first pathfinding algorithm.
 * @class
 */
class GreedyBestFirstAlgorithm extends Algorithm {

    /**
     * Creates a new greedy best-first pathfinding algorithm.
     * @param {Grid} grid - The grid to search in.
     */
    constructor(grid) {

        super(grid);

        /**
         * The priority queue of cells that have been explored, sorted by the taxicab distance from the end.
         * @type {PriorityQueue}
         */
        this.priorityQueue = new PriorityQueue();

    }

    /**
     * Steps the algorithm forward one search.
     * @param {number} loop - The interval ID calling this method.
     * @returns {boolean} Whether the pathfinding algorithm still requires more steps to finish searching. 
     */
    step(loop) {

        if (this.priorityQueue.size == 0) {
            this.visited.push(this.start);
            this.priorityQueue.enqueue(this.start, -this.taxicabDistance(this.start, this.end));
        }

        if (!this.priorityQueue.empty()) {
            
            const currentCell = this.priorityQueue.dequeue();

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
                    this.priorityQueue.enqueue(neighbour, this.taxicabDistance(currentCell, this.end));
                    this.visited.push(neighbour);
                    this.path.set(neighbour, currentCell);
                }

            }

            this.visited.forEach(cell => {
                if (![Cell.Type.Start, Cell.Type.End].includes(cell.type)) cell.type = Cell.Type.Searched;
            });

            this.priorityQueue.forEach(cell => {
                if (![Cell.Type.Start, Cell.Type.End].includes(cell.type)) cell.type = Cell.Type.Searching;
            }); 

            return true;

        }

        return false;

    }

}

export default GreedyBestFirstAlgorithm;