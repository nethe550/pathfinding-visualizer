/**
 * @author nethe550
 * @license MIT
 * @description A generic queue.
 */

/**
 * A generic queue.
 * @class
 */
class Queue {

    /**
     * Creates a new Queue
     * @param  {...*} items - The items to be placed in the queue.
     */
    constructor(...items) {

        /**
         * The items in this queue.
         * @type {any[]}
         */
        this.items = items;

    }

    /**
     * The size of this queue.
     * @returns {number}
     */
    get size() {
        return this.items.length;
    }

    /**
     * Enqueues an item into the queue.
     * @param {*} item - The item to enqueue.
     */
    enqueue(item) {
        this.items.push(item);
    }

    /**
     * Dequeues the next item in the queue.
     * @returns {*|undefined} The next item in the queue, or undefined if the queue is empty.
     */
    dequeue() {
        if (this.empty()) return undefined;
        return this.items.shift();
    }

    /**
     * Gets the first item in the queue.
     * @returns {*|undefined} The first item in the queue, or undefined if the queue is empty.
     */
    front() {
        if (this.empty()) return undefined;
        return this.items[0];
    }

    /**
     * Gets the last item in the queue.
     * @returns {*|undefined} The last item in the queue, or undefined if the queue is empty.
     */
    rear() {
        if (this.empty()) return undefined;
        return this.items[this.items.length - 1];
    }

    /**
     * Checks if this queue is empty.
     * @returns {boolean} Whether this queue is empty.
     */
    empty() {
        return this.items.length == 0;
    }

    /**
     * Checks if the queue contains an item.
     * @param {*} item - The item to check for.
     * @returns {boolean} Whether the queue contains the item.
     */
    has(item) {
        return this.items.includes(item);
    }

    /**
     * Calls a function for each element in the queue.
     * @param {function(*):void} iterator - An iterator function that accepts the current value in the queue.
     * @param {Object} thisArg - An optional context to provide to the function.
     */
    forEach(iterator, thisArg=null) {

        for (let item of this.items) {
            iterator.bind(thisArg)(item);
        }

    }

    /**
     * Creates an array containing the entries in this queue.
     * @returns {any[]} The queue in array form.
     */
    toArray() {
        return this.items;
    }

    /**
     * Converts this queue into a string format.
     * @returns {string} The formatted string representing this queue.
     */
    toString() {
        return `Queue(${this.items.join(', ')})`;
    }
    
}

export default Queue;