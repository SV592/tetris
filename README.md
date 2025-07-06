# Tetris Game

This repository contains a classic Tetris game implemented using web technologies (HTML, CSS, JavaScript). It provides a playable version of the popular puzzle game directly in your web browser.

## Table of Contents

1.  [Project Overview](#1-project-overview)
2.  [Features](#2-features)
3.  [Installation](#3-installation)
    * [Prerequisites](#prerequisites)
    * [CLI Setup](#cli-setup)
4.  [Usage](#4-usage)
    * [Controls](#controls)
5.  [Project Structure](#5-project-structure)
6.  [Future Enhancements](#6-future-enhancements)

## 1. Project Overview

Tetris is a classic tile-matching puzzle video game. The objective of the game is to manipulate falling blocks (tetrominoes) by moving and rotating them, with the aim of creating a horizontal line of ten units without gaps. When such a line is created, it disappears, and any blocks above it fall to fill the empty space. The game ends when the stack of blocks reaches the top of the playing field.

This implementation provides a straightforward, browser-based version of the game.

## 2. Features

* **Classic Tetris Gameplay**: Adheres to the core rules of Tetris.
* **Falling Tetrominoes**: Various block shapes (I, O, T, S, Z, J, L) fall from the top.
* **Rotation and Movement**: Players can rotate blocks and move them left or right.
* **Line Clearing**: Full horizontal lines are cleared, and points are scored.
* **Score Tracking**: Keeps track of the player's score.
* **Game Over Condition**: The game ends when blocks stack to the top.
* **Basic UI**: A simple and functional user interface.

## 3. Installation

This Tetris game is a client-side web application. No complex installation or build process is required.

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/SV592/tetris.git](https://github.com/SV592/tetris.git)
    cd tetris
    ```

2.  **Open in Browser:**
    * Simply open the `index.html` file directly in your web browser.
        * For example, navigate to the `tetris` directory in your file explorer and double-click `index.html`.
    * Alternatively, you can serve it with a simple local web server (e.g., Python's `http.server`):
        ```bash
        # In the 'tetris' directory
        python -m http.server 8000
        ```
        Then, open your browser and go to `http://localhost:8000`.

## 4. Usage

Once the `index.html` file is open in your browser, the game should start automatically.

### Controls

* **Arrow Left / Left Key**: Move the falling block left.
* **Arrow Right / Right Key**: Move the falling block right.
* **Arrow Down / Down Key**: Soft drop (move the block down faster).
* **Arrow Up / Up Key**: Rotate the block.
* **Spacebar**: Hard drop (immediately drop the block to the bottom).

## 5. Project Structure

The repository typically contains the following files:

* `index.html`: The main HTML file that structures the game's web page.
* `style.css`: Contains the CSS rules for styling the game interface and elements.
* `script.js`: Contains the JavaScript logic for the game, including game state, block movement, collision detection, line clearing, and rendering.
* (Potentially other assets like images or sounds, if implemented).
