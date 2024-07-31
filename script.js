const boardSize = 10;
const mineCount = 10;
let board = [];
let mineLocations = [];

const gameBoard = document.getElementById('gameBoard');

function initializeGame() {
    board = [];
    mineLocations = [];
    gameBoard.innerHTML = '';
    createBoard();
    placeMines();
    updateNumbers();
}

function createBoard() {
    for (let row = 0; row < boardSize; row++) {
        board[row] = [];
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
            board[row][col] = {
                element: cell,
                mine: false,
                number: 0,
                revealed: false
            };
        }
    }
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        if (!board[row][col].mine) {
            board[row][col].mine = true;
            mineLocations.push({ row, col });
            minesPlaced++;
        }
    }
}

function updateNumbers() {
    for (const location of mineLocations) {
        const { row, col } = location;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (isInBounds(newRow, newCol) && !board[newRow][newCol].mine) {
                    board[newRow][newCol].number++;
                }
            }
        }
    }
}

function isInBounds(row, col) {
    return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}

function handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    if (board[row][col].revealed) return;
    revealCell(row, col);
    if (board[row][col].mine) {
        alert('Você perdeu! Clique em "Reiniciar Jogo" para tentar novamente.');
        revealAllMines();
    } else if (checkWin()) {
        alert('Você venceu! Clique em "Reiniciar Jogo" para jogar novamente.');
    }
}

function revealCell(row, col) {
    if (!isInBounds(row, col) || board[row][col].revealed) return;
    board[row][col].revealed = true;
    const cell = board[row][col].element;
    cell.classList.add('revealed');
    if (board[row][col].mine) {
        cell.textContent = '💣';
    } else if (board[row][col].number > 0) {
        cell.textContent = board[row][col].number;
    } else {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                revealCell(row + i, col + j);
            }
        }
    }
}

function revealAllMines() {
    for (const location of mineLocations) {
        const { row, col } = location;
        board[row][col].element.textContent = '💣';
        board[row][col].element.classList.add('revealed');
    }
}

function checkWin() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (!board[row][col].mine && !board[row][col].revealed) {
                return false;
            }
        }
    }
    return true;
}

initializeGame();
