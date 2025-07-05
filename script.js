// Board dimensions
const COLS = 10;
const ROWS = 20;

// Tetromino definitions (shapes and colors)
const TETROMINOS = [
    { shape: [[1, 1, 1, 1]], color: "#06b6d4", name: "I" },
    {
        shape: [
            [0, 2],
            [0, 2],
            [2, 2],
        ],
        color: "#2563EB",
        name: "J",
    },
    {
        shape: [
            [3, 0],
            [3, 0],
            [3, 3],
        ],
        color: "#f59e42",
        name: "L",
    },
    {
        shape: [
            [4, 4],
            [4, 4],
        ],
        color: "#FFD600",
        name: "O",
    },
    {
        shape: [
            [0, 5, 5],
            [5, 5, 0],
        ],
        color: "#22d3ee",
        name: "S",
    },
    {
        shape: [
            [6, 6, 6],
            [0, 6, 0],
        ],
        color: "#a21caf",
        name: "T",
    },
    {
        shape: [
            [7, 7, 0],
            [0, 7, 7],
        ],
        color: "#ef4444",
        name: "Z",
    },
];


// SRS Kick Data (Wall Kick Data)
const WALL_KICKS_JLSTZ = {
    "0_1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    "1_2": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    "2_3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    "3_0": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    "0_3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    "3_2": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    "2_1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    "1_0": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
};

const WALL_KICKS_I = {
    "0_1": [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
    "1_2": [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
    "2_3": [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
    "3_0": [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
    "0_3": [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
    "3_2": [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
    "2_1": [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
    "1_0": [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
};

// Helper function to get kick data for a specific transition
function getKickData(pieceName, originalState, nextState) {
    const key = `${originalState}_${nextState}`;
    if (pieceName === "I") {
        return WALL_KICKS_I[key] || [];
    } else {
        return WALL_KICKS_JLSTZ[key] || [];
    }
}

// Generate a random tetromino with a starting position and initial rotation state
function randomTetromino() {
    const i = Math.floor(Math.random() * TETROMINOS.length);
    return { ...TETROMINOS[i], pos: { x: 3, y: 0 }, rotationState: 0 };
}

// Rotate a tetromino shape (clockwise)
function rotate(shape) {
    return shape[0].map((_, i) => shape.map((row) => row[i]).reverse());
}

// Check if a tetromino fits in the grid at its current position
function fits(grid, tetro) {
    const { shape, pos } = tetro;
    for (let y = 0; y < shape.length; y++)
        for (let x = 0; x < shape[y].length; x++)
            if (
                shape[y][x] &&
                (pos.y + y >= ROWS || // Check bottom bound
                    pos.x + x < 0 || // Check left bound
                    pos.x + x >= COLS || // Check right bound
                    (pos.y + y >= 0 && grid[pos.y + y][pos.x + x])) // Check for collision with existing blocks (only if within top boundary)
            )
                return false;
    return true;
}

// Merge a tetromino into the grid (when it lands)
function merge(grid, tetro) {
    const { shape, pos } = tetro;
    for (let y = 0; y < shape.length; y++)
        for (let x = 0; x < shape[y].length; x++)
            if (shape[y][x] && pos.y + y >= 0)
                grid[pos.y + y][pos.x + x] = shape[y][x];
}

// Clear completed lines and return the number of lines cleared
function clearLines(grid) {
    let lines = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
        if (grid[y].every(Boolean)) {
            grid.splice(y, 1);
            grid.unshift(Array(COLS).fill(null));
            lines++;
            y++;
        }
    }
    return lines;
}

// Color palette for tetrominos and background
const COLORS = [
    "#2E2B2C", // background
    "#06b6d4", // I-piece
    "#2563EB", // J-piece
    "#f59e42", // L-piece
    "#FFD600", // O-piece
    "#22d3ee", // S-piece
    "#a21caf", // T-piece
    "#ef4444", // Z-piece
];

// Game state variables (global)
let game;
let paused = true;
let gameOver = false;
let canvasSize = { width: 0, height: 0 };
let aniFrame;
let score = 0; // Global score variable

let canvas;
let ctx;
let container;
let scoreDisplay; // Reference to the score display element

// Create a fresh game state
function freshState() {
    return {
        grid: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
        current: randomTetromino(),
        over: false,
        dropTick: 0,
        delay: 28,
        score: 0, // Reset score in fresh state
    };
}
