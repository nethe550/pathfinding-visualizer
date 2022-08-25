/**
 * @author nethe550
 * @license MIT
 * @description A canvas renderer for displaying grids.
 */

import Color from '../../util/render/Color.js';
import Vector2 from '../../util/vector/Vector2.js';

/**
 * @typedef {import('../Grid.js').default} Grid - A grid of cells.
 */

/**
 * A canvas renderer for displaying grids.
 * @class
 */
class GridRenderer {
    
    /**
     * Creates a new grid renderer.
     * @param {HTMLCanvasElement|string} canvas - The canvas element to render to.
     * @param {Grid} grid - The grid to render.
     * @param {Color} background - The background color of the display.
     */
    constructor(canvas, grid, background=Color.black) {

        /**
         * The canvas this renderer draws to.
         * @type {HTMLCanvasElement}
         */
        this.canvas = null;
        if (canvas instanceof HTMLCanvasElement) this.canvas = canvas;
        else if (typeof canvas === 'string') {
            this.canvas = document.querySelector(canvas);
            if (!this.canvas) this.canvas = document.getElementById(canvas);
            if (!this.canvas) this.canvas = document.getElementsByClassName(canvas)[0];
            if (!this.canvas) this.canvas = document.getElementsByTagName(canvas)[0];
        }
        if (!this.canvas) throw new TypeError(`GridRenderer.constructor(): Parameter 'canvas' must be of type 'HTMLCanvasElement' or valid query string. (Recieved: '${canvas}')`);

        /**
         * The rendering context of this grid renderer.
         * @type {HTMLCanvasElement}
         */
        this.ctx = this.canvas.getContext ? this.canvas.getContext('2d') : alert('HTML5 Canvas is not supported by your browser.');

        /**
         * The grid this renderer will draw.
         * @type {Grid}
         */
        this.grid = grid;

        /**
         * The background color of this renderer's display.
         * @type {Color}
         */
        this.background = background;

    }

    /**
     * Renders the grid to the canvas.
     */
    render() {

        const size = new Vector2(this.canvas.width / this.grid.size.x, this.canvas.height / this.grid.size.y);

        this.ctx.fillStyle = this.background.css;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let cell of this.grid.cells) {
            cell.render(this.ctx, size, this.grid.border);
        }

    }

}

export default GridRenderer;