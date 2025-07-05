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