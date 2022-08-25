/**
 * @author nethe550
 * @license MIT
 * @description A generic priority queue.
 */

import Queue from './Queue.js';

/**
 * A generic priority queue.
 * @class
 */
class PriorityQueue extends Queue {

    /**
     * A priority queue item.
     * @class
     */
    static Item = class {

        /**
         * Creates a new priority queue item.
         * @param {*} item - The item.
         * @param {number} priority - The priority of the item.
         */
        constructor(item, priority=0) {
            this.item = item;
            this.priority = priority;
        }

    };

    /**
     * Creates a new priority queue.
     */
    constructor() {

        super();

    }

    /**
     * The size of this priority queue.
     * @returns {number}
     */
     get size() {
        return this.items.length;
    }

    /**
     * Enqueues an item into the priority queue.
     * @param {*} item - The item to enqueue.
     * @param {number} priority - The priority of the item.
     */
    enqueue(item, priority=0) {

        const queueItem = new PriorityQueue.Item(item, priority);
        let contain = false;

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > queueItem.priority) {
                this.items.splice(i, 0, queueItem);
                contain = true;
                break;
            }
        }

        if (!contain) this.items.push(queueItem);

    }

    /**
     * Dequeues the next item in the priority queue.
     * @param {boolean} includePriority - Whether to return the item and its priority in the queue or only the item.
     * @returns {*|PriorityQueue.Item|undefined} The next item in the priority queue, or undefined if the priority queue is empty.
     */
    dequeue(includePriority=false) {
        if (this.empty()) return undefined;
        return includePriority ? this.items.shift() : this.items.shift().item;
    }

    /**
     * Gets the first item in the priority queue.
     * @param {boolean} includePriority - Whether to return the item and its priority in the queue or only the item.
     * @returns {*|PriorityQueue.Item|undefined} The first item in the priority queue, or undefined if the priority queue is empty.
     */
    front(includePriority=false) {
        if (this.empty()) return undefined;
        return includePriority ? this.items[0] : this.items[0].item;
    }

    /**
     * Gets the last item in the priority queue.
     * @param {boolean} includePriority - Whether to return the item and its priority in the queue or only the item.
     * @returns {*|PriorityQueue.Item|undefined} The last item in the priority queue, or undefined if the priority queue is empty.
     */
    rear(includePriority=false) {
        if (this.empty()) return undefined;
        return includePriority ? this.items[this.items.length - 1] : this.items[this.items.length - 1].item;
    }

    /**
     * Checks if the priority queue contains an item.
     * @param {*|PriorityQueue.Item} item - The item to check for.
     * @returns {boolean} Whether the item is in the priority queue.
     */
    has(item) {
        if (item instanceof PriorityQueue.Item) return this.items.includes(item);
        else {
            for (let i of this.items) {
                if (i.item == item) return true;
            }
            return false;
        }
    }

    /**
     * Calls a function for each element in the priority queue.
     * @param {function(*):void} iterator - An iterator function that accepts the current value in the priority queue.
     * @param {boolean} includePriority - Whether to include the item and its priority in the callback parameter or only the item.
     * @param {Object} thisArg - An optional context to provide to the function.
     */
    forEach(iterator, includePriority=false, thisArg=null) {

        for (let item of this.items) {
            iterator.bind(thisArg)(includePriority ? item : item.item);
        }

    }

    /**
     * Creates an array containing the entries in this priority queue.
     * @param {boolean} includePriority - Whether to include the item and its priority or only the item.
     * @returns {any[]|[*, number][]} The priority queue in array form.
     */
    toArray(includePriority=false) {
        const res = [];
        if (includePriority) {
            for (let item of this.items) {
                res.push([item.item, item.priority]);
            }
        }
        else {
            for (let item of this.items) {
                res.push(item.item);
            }
        }
        return res;
    }

    /**
     * Converts this priority queue into a string format.
     * @returns {string} The formatted string representing this priority queue.
     */
    toString() {
        return `PriorityQueue(${this.items.join(', ')})`;
    }

}

export default PriorityQueue;