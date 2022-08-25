/**
 * @author nethe550
 * @license MIT
 * @description The entrypoint of the implementation.
 */

import Vector2 from '../../../util/vector/Vector2.js';
import Color from '../../../util/render/Color.js';
import Cell from '../../../grid/Cell.js';
import Grid from '../../../grid/Grid.js';
import GridRenderer from '../../../grid/render/GridRenderer.js';
import BreadthFirstAlgorithm from '../../../algorithm/impl/BreadthFirstAlgorithm.js';
import GreedyBestFirstAlgorithm from '../../../algorithm/impl/GreedyBestFirstAlgorithm.js';

const grid = new Grid(25, 25, Cell.Type.Empty, 1);
const renderer = new GridRenderer('#display', grid, Color.black);


const Tools = {
    Move: 'move',
    Draw: 'draw'
};

const ControlState = {
    simulation: {
        paused: true,
        timestep: 250,
        minTimestep: 0,
        maxTimestep: 1000,
        algorithm: null,
        loop: null
    },
    zoom: {
        gridSize: renderer.grid.size.copy(),
        canvasSize: new Vector2(renderer.canvas.width, renderer.canvas.height),
        speed: 0.001,
        min: new Vector2(3, 3),
        max: new Vector2(50, 50),
        current: 1.0
    },
    mouse: [0, 0, 0, 0],
    currentType: Cell.Type.Empty,
    currentTool: Tools.Move,
    tools: {
        move: {
            mousedown: null,
            mousemove: null,
            mouseup: null,
            wheel: null
        },
        draw: {
            pageToGrid: null,
            draw: null,
            mousedown: null,
            mousemove: null,
            mouseup: null
        }
    }
};

ControlState.tools.move.mousemove = e => {
    e.preventDefault();
    ControlState.mouse[0] = ControlState.mouse[2] - e.clientX;
    ControlState.mouse[1] = ControlState.mouse[3] - e.clientY;
    ControlState.mouse[2] = e.clientX;
    ControlState.mouse[3] = e.clientY;
    renderer.canvas.style.left = (renderer.canvas.offsetLeft - ControlState.mouse[0]) + 'px';
    renderer.canvas.style.top = (renderer.canvas.offsetTop - ControlState.mouse[1]) + 'px';
};

ControlState.tools.move.mouseup = _ => {
    renderer.canvas.onmouseup = null;
    renderer.canvas.onmousemove = null;
};

ControlState.tools.move.mousedown = e => {
    e.preventDefault();
    ControlState.mouse[2] = e.clientX;
    ControlState.mouse[3] = e.clientY;
    renderer.canvas.onmouseup = ControlState.tools.move.mouseup;
    renderer.canvas.onmousemove = ControlState.tools.move.mousemove;
};

ControlState.tools.move.wheel = e => {
    ControlState.zoom.current += ControlState.zoom.speed * -e.deltaY;
    renderer.grid.size = Vector2.Min(ControlState.zoom.max, Vector2.Max(ControlState.zoom.min, Vector2.Floor(ControlState.zoom.gridSize.mul(ControlState.zoom.current))));
    renderer.canvas.width = ControlState.zoom.canvasSize.x * ControlState.zoom.current;
    renderer.canvas.height = ControlState.zoom.canvasSize.y * ControlState.zoom.current;
    renderer.render();
};

ControlState.tools.draw.draw = (e, callback) => {
    const pos = Vector2.Floor(
        new Vector2(e.clientX, e.clientY)
        .sub(new Vector2(renderer.canvas.offsetLeft, renderer.canvas.offsetTop))
        .div(new Vector2(renderer.canvas.width, renderer.canvas.height)
        ).mul(renderer.grid.size)
    );
    renderer.grid.setCell(ControlState.currentType, pos);
    renderer.render();
    if (callback) callback();
};

ControlState.tools.draw.mousemove = ControlState.tools.draw.draw;

ControlState.tools.draw.mouseup = _ => {
    renderer.canvas.onmousemove = null;
    renderer.canvas.onmouseup = null;
};

ControlState.tools.draw.mousedown = e => ControlState.tools.draw.draw(e, () => {
    renderer.canvas.onmousemove = ControlState.tools.draw.mousemove;
    renderer.canvas.onmouseup = ControlState.tools.draw.mouseup;
    renderer.canvas.onmouseout = ControlState.tools.draw.mouseup;
});

const buildUI = renderer => {

    // root
    const controls = document.querySelector('#controls');


    // cell types
    const cellTypesWrapper = document.createElement('div');
    cellTypesWrapper.classList.add('controls-cell-types');

    const cellTypeButtons = [];

    for (let cellType of Object.values(Cell.Type)) {

        if (typeof cellType != 'string' || cellType == Cell.Type.Searching || cellType == Cell.Type.Searched || cellType == Cell.Type.Pathfinder || cellType == Cell.Type.Path) continue;
        
        const elem = document.createElement('button');
        elem.classList.add('controls-cell-type');
        elem.style.backgroundColor = Cell.Colours[cellType.toLowerCase()].css;
        
        if (ControlState.currentType == cellType) elem.style.border = '6px solid var(--foreground-1)';
        
        elem.addEventListener('click', _ => {
            ControlState.currentType = cellType;
            cellTypeButtons.filter(e => e != elem).forEach(e => e.style.border = '6px solid transparent');
            elem.style.border = '6px solid var(--foreground-1)';
        });

        elem.title = cellType;

        cellTypesWrapper.appendChild(elem);
        cellTypeButtons.push(elem);

    }
    controls.appendChild(cellTypesWrapper);


    // tools
    const toolsWrapper = document.createElement('div');
    toolsWrapper.classList.add('controls-tools');

    const toolsButtons = [];
    for (let tool of Object.keys(Tools)) {

        const button = document.createElement('button');
        button.classList.add('controls-tool');
        button.title = tool;

        if (ControlState.currentTool == Tools[tool]) {
            button.style.backgroundColor = 'var(--background-6)';
            renderer.canvas.onmousedown = ControlState.tools[Tools[tool]].mousedown;
            if (ControlState.tools[Tools[tool]].wheel) renderer.canvas.onwheel = ControlState.tools[Tools[tool]].wheel;
            else renderer.canvas.onwheel = null;
        }
        
        toolsWrapper.appendChild(button);

        const buttonIcon = document.createElement('img');
        buttonIcon.src = `./static/ico/tools/${Tools[tool]}.svg`;
        buttonIcon.width = 32;
        buttonIcon.height = 32;
        buttonIcon.alt = tool;

        buttonIcon.onload = () => button.appendChild(buttonIcon);
        toolsButtons.push(button);

        button.onclick = () => {
            renderer.canvas.onmousedown = ControlState.tools[Tools[tool]].mousedown;
            if (ControlState.tools[Tools[tool]].wheel) renderer.canvas.onwheel = ControlState.tools[Tools[tool]].wheel;
            else renderer.canvas.onwheel = null;
            toolsButtons.filter(b => b !== button).forEach(b => b.style.backgroundColor = 'var(--background-3');
            button.style.backgroundColor = 'var(--background-6)';
        };

    }

    controls.appendChild(toolsWrapper);

    // simulation settings
    const simulationSettingsWrapper = document.createElement('div');
    simulationSettingsWrapper.classList.add('controls-simulation');
    
    const toggleSimulation = document.createElement('button');
    toggleSimulation.classList.add('controls-simulation-button');
    toggleSimulation.innerHTML = ControlState.simulation.paused ? 'Start' : 'Pause';

    simulationSettingsWrapper.appendChild(toggleSimulation);

    const simulationTimestep = document.createElement('input');
    simulationTimestep.classList.add('controls-simulation-timestep');
    simulationTimestep.type = 'range';
    simulationTimestep.min = ControlState.simulation.minTimestep;
    simulationTimestep.max = ControlState.simulation.maxTimestep;
    simulationTimestep.value = ControlState.simulation.timestep;
    simulationTimestep.title = 'Timestep';

    simulationSettingsWrapper.appendChild(simulationTimestep);

    const simulationTimestepInput = document.createElement('input');
    simulationTimestepInput.classList.add('controls-simulation-timestep-input');
    simulationTimestepInput.type = 'number';
    simulationTimestepInput.min = ControlState.simulation.minTimestep;
    simulationTimestepInput.max = ControlState.simulation.maxTimestep;
    simulationTimestepInput.value = ControlState.simulation.timestep;
    simulationTimestepInput.title = 'Timestep';
    simulationTimestepInput.placeholder = 'Timestep';

    simulationSettingsWrapper.appendChild(simulationTimestepInput);

    simulationTimestep.oninput = _ => {
        ControlState.simulation.timestep = simulationTimestep.value;
        simulationTimestepInput.value = simulationTimestep.value;
    };

    simulationTimestepInput.oninput = _ => {
        ControlState.simulation.timestep = simulationTimestepInput.value;
        simulationTimestep.value = simulationTimestepInput.value;
    };

    const simulationAlgorithm = document.createElement('select');
    simulationAlgorithm.classList.add('controls-simulation-algorithm');

    const optionElement = (name, value, selected=false) => {
        const element = document.createElement('option');
        element.innerText = name;
        element.title = name;
        element.value = value;
        element.selected = selected;
        return element;
    }

    simulationAlgorithm.options.add(optionElement('Breadth-First', 'breadth-first', true));
    simulationAlgorithm.options.add(optionElement('Greedy Best-First', 'greedy'));

    const setAlgorithm = () => {
        switch (simulationAlgorithm.options[simulationAlgorithm.selectedIndex].value) {
            case 'breadth-first':
                try {
                    ControlState.simulation.algorithm = new BreadthFirstAlgorithm(renderer.grid);
                }
                catch (e) {
                    alert(e);
                    return false;
                }
                break;
            case 'greedy':
                try {
                    ControlState.simulation.algorithm = new GreedyBestFirstAlgorithm(renderer.grid);
                }
                catch (e) {
                    alert(e);
                    return false;
                }
                break;
        }
        return true;
    };

    toggleSimulation.onclick = _ => {
        ControlState.simulation.paused = !ControlState.simulation.paused;
        toggleSimulation.innerText = ControlState.simulation.paused ? 'Start' : 'Pause';
        if (setAlgorithm()) {
            if (!ControlState.simulation.paused) {
                ControlState.simulation.loop = setInterval(() => {
                    ControlState.simulation.algorithm.step(ControlState.simulation.loop);
                    renderer.render();
                }, ControlState.simulation.timestep);
            }
            else {
                clearInterval(ControlState.simulation.loop);
                toggleSimulation.innerText = 'Start';
                ControlState.simulation.paused = true;
                renderer.grid.clearPathfinding();
            }
        }
    };

    const simulationRandom = document.createElement('button');
    simulationRandom.classList.add('controls-simulation-random');
    simulationRandom.innerText = 'Random Grid';
    simulationRandom.title = 'Random Grid';

    simulationRandom.onclick = _ => {
        
        const weight = Math.random();

        for (let cell of renderer.grid.cells) {
            
            if (![Cell.Type.Start, Cell.Type.End].includes(cell.type)) {
                if (Math.random() > weight) cell.type = Cell.Type.Wall;
                else cell.type = Cell.Type.Empty;
            }

        }

        renderer.render();

    };

    simulationSettingsWrapper.appendChild(simulationRandom);

    simulationSettingsWrapper.appendChild(simulationAlgorithm);

    controls.appendChild(simulationSettingsWrapper);

};

const initDisplay = renderer => {

    buildUI(renderer);

    // center canvas
    const box = renderer.canvas.getBoundingClientRect();
    renderer.canvas.style.left = `calc(50% - ${box.width * 0.5}px)`;
    renderer.canvas.style.top = `calc(50% - ${box.height * 0.5}px)`;
    renderer.render();

};

initDisplay(renderer);
