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

// Draw the game board and current tetromino
function draw(_g) {
    const g = _g || game; // Use passed game state or global game state
    const bw = canvasSize.width / COLS;
    const bh = canvasSize.height / ROWS;

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    ctx.fillStyle = COLORS[0];
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw placed blocks
    for (let y = 0; y < ROWS; y++)
        for (let x = 0; x < COLS; x++)
            if (g.grid[y][x]) {
                ctx.fillStyle = COLORS[g.grid[y][x]];
                ctx.fillRect(x * bw, y * bh, bw - 2, bh - 2);
                ctx.strokeStyle = "#2d2d2d";
                ctx.lineWidth = 1;
                ctx.strokeRect(x * bw + 1, y * bh + 1, bw - 3, bh - 3);
            }

    // Draw the falling tetromino
    if (!g.over && !paused) {
        const { current } = g;
        for (let y = 0; y < current.shape.length; y++)
            for (let x = 0; x < current.shape[y].length; x++)
                if (current.shape[y][x]) {
                    ctx.fillStyle = COLORS[current.shape[y][x]];
                    ctx.fillRect(
                        (current.pos.x + x) * bw,
                        (current.pos.y + y) * bh,
                        bw - 2,
                        bh - 2
                    );
                    ctx.strokeStyle = "#2d2d2d";
                    ctx.strokeRect(
                        (current.pos.x + x) * bw + 1,
                        (current.pos.y + y) * bh + 1,
                        bw - 3,
                        bh - 3
                    );
                }
    }

    // Update score display in HTML
    if (scoreDisplay) {
        scoreDisplay.textContent = g.score;
    }

    // Draw pause overlay
    if (paused && !g.over) {
        ctx.fillStyle = "rgba(46,43,44,0.94)"; // Using a slightly transparent version of COLORS[0]
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${Math.max(20, bw * 1.1)}px Helvetica`;
        ctx.textAlign = "center";
        ctx.fillText("Paused", canvasSize.width / 2, canvasSize.height / 2 - 30); // Adjusted position

        // Draw controls
        ctx.font = `bold 13px Helvetica`;
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 0.95;
        ctx.fillText(
            "Controls: ← → ↓ (move), F (rotate), D (drop)",
            canvasSize.width / 2,
            canvasSize.height / 2 + 22 // Adjusted position
        );
        ctx.font = `11px Helvetica`;
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 0.85;
        ctx.fillText(
            `Click to resume`,
            canvasSize.width / 2,
            canvasSize.height / 2 + 42 // Adjusted position
        );
    }

    // Draw game over overlay
    if (g.over) {
        ctx.fillStyle = "rgba(46,43,44,0.94)";
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${Math.max(18, bw)}px Helvetica`;
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvasSize.width / 2, canvasSize.height / 2 - 20); // Adjusted position

        // Show score on game over screen
        ctx.font = `bold 16px Helvetica`;
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 0.95;
        ctx.fillText(
            `Final Score: ${g.score}`,
            canvasSize.width / 2,
            canvasSize.height / 2 + 5
        );

        // Show a custom message below "Game Over"
        ctx.font = `bold 14px Helvetica`;
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 0.95;
        ctx.fillText(
            "Hire me 😐",
            canvasSize.width / 2,
            canvasSize.height / 2 + 32
        );
        ctx.font = `12px Helvetica`;
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 0.85;
        ctx.fillText(
            "Click to restart",
            canvasSize.width / 2,
            canvasSize.height / 2 + 54
        );
    }
}

// Main game loop
function loop() {
    if (game.over || paused) {
        draw(game);
        aniFrame = requestAnimationFrame(loop); // Keep loop running even when paused/over for drawing
        return;
    }

    let { current, dropTick, score: sc } = game;
    let over = game.over;
    const { grid, delay } = game;

    dropTick++;

    // Drop tetromino down by one row if enough ticks have passed
    if (dropTick >= delay) {
        dropTick = 0;
        const test = {
            ...current,
            pos: { x: current.pos.x, y: current.pos.y + 1 },
        };
        if (fits(grid, test)) {
            current = test;
        } else {
            // Merge tetromino into grid and check for line clears
            merge(grid, current);
            const lines = clearLines(grid);
            sc += lines * 100;
            if (grid[0].some(Boolean)) {
                over = true;
                gameOver = true; // Update global gameOver state
            } else {
                current = randomTetromino();
            }
        }
    }
    score = sc; // Update global score variable
    game = { // Update global game state
        ...game,
        grid,
        current,
        dropTick,
        score: sc,
        over,
    };
    draw(game); // Pass the updated game state to draw
    aniFrame = requestAnimationFrame(loop);
}

// Keyboard controls
function handleKeydown(e) {
    const keysToPreventDefault = [
        "arrowleft",
        "arrowright",
        "arrowdown",
        "f",
        "d",
    ];
    if (keysToPreventDefault.includes(e.key.toLowerCase())) {
        e.preventDefault();
    }

    if (game.over || paused) return;

    let changed = false;
    let { current, grid } = game; // Destructure from current game state

    if (e.key === "ArrowLeft") {
        const test = {
            ...current,
            pos: { x: current.pos.x - 1, y: current.pos.y },
        };
        if (fits(grid, test)) {
            current = test;
            changed = true;
        }
    } else if (e.key === "ArrowRight") {
        const test = {
            ...current,
            pos: { x: current.pos.x + 1, y: current.pos.y },
        };
        if (fits(grid, test)) {
            current = test;
            changed = true;
        }
    } else if (e.key === "ArrowDown") {
        const test = {
            ...current,
            pos: { x: current.pos.x, y: current.pos.y + 1 },
        };
        if (fits(grid, test)) {
            current = test;
            changed = true;
        }
    } else if (e.key.toLowerCase() === "f") {
        const originalRotationState = current.rotationState;
        const nextRotationState = (originalRotationState + 1) % 4;

        const rotated = {
            ...current,
            shape: rotate(current.shape),
            rotationState: nextRotationState,
        };

        const kicksToTry = getKickData(
            current.name,
            originalRotationState,
            nextRotationState
        );

        for (const [dx, dy] of kicksToTry) {
            const test = {
                ...rotated,
                pos: { x: current.pos.x + dx, y: current.pos.y + dy },
            };
            if (fits(grid, test)) {
                current = test;
                changed = true;
                break;
            }
        }
    } else if (e.key.toLowerCase() === "d") {
        let test = { ...current };
        while (
            fits(grid, { ...test, pos: { x: test.pos.x, y: test.pos.y + 1 } })
        ) {
            test = { ...test, pos: { x: test.pos.x, y: test.pos.y + 1 } };
        }
        current = test;
        changed = true;
    }

    if (changed) {
        game = { ...game, current }; // Update global game state after successful move/rotation
        draw(game); // Redraw with new state
    }
}

// Pause, resume, or restart the game by clicking the canvas
function handleCanvasClick() {
    if (gameOver) { // Use global gameOver state
        game = freshState(); // Reset global game state
        score = 0; // Reset global score
        paused = false;
        gameOver = false;
        draw(game);
        if (aniFrame) cancelAnimationFrame(aniFrame);
        aniFrame = requestAnimationFrame(loop); // Restart loop
    } else {
        paused = !paused; // Toggle global paused state
        draw(game); // Redraw to show pause/resume state
        if (!paused) { // If unpaused, ensure loop is running
            if (aniFrame) cancelAnimationFrame(aniFrame);
            aniFrame = requestAnimationFrame(loop);
        } else { // If paused, cancel animation frame
            if (aniFrame) cancelAnimationFrame(aniFrame);
        }
    }
}

// Responsive canvas sizing
function handleResize() {
    if (container) {
        const width = container.clientWidth;
        canvasSize.width = width;
        canvasSize.height = width * (ROWS / COLS);
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        draw(game); // Redraw after resize
    }
}

// Initialization function
function initGame() {
    container = document.getElementById("game-container");
    canvas = document.getElementById("tetris-canvas");
    ctx = canvas.getContext("2d");
    scoreDisplay = document.getElementById("score-display"); // Get score display element

    game = freshState(); // Initialize global game state

    handleResize(); // Set initial canvas size
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeydown);
    canvas.addEventListener("click", handleCanvasClick); // Add click listener to canvas

    // Start the game loop (it will immediately pause due to initial paused=true)
    aniFrame = requestAnimationFrame(loop);
}

// Start the game when the DOM is fully loaded
window.onload = initGame;
