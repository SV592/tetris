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
