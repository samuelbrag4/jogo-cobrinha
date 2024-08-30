const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const audio = new Audio("../assets/audio.mp3");

const size = 30;
const radius = size / 2;
const canvasSize = 600;

// CObra
let snake = [ 
    { x: 270, y: 240 }, 
    { x: 300, y: 240 }, 
    { x: 330, y: 240 }, 
    { x: 360, y: 240 }, 
    { x: 390, y: 240 }, 
    { x: 420, y: 240 } 
];

// Posição inicial
const initialPosition = { x: 270, y: 240 };

// Aumento do score quando come
const incrementScore = () => {
    score.innerText = +score.innerText + 10;
}

const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomPosition = () => {
    return Math.floor(Math.random() * (canvasSize / size)) * size;
}

// Cor aleatória da comida
const randomColor = () => {
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);
    return `rgb(${red}, ${green}, ${blue})`;
}

// Comida
const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction;
let loopId;

// Desenho da comida
const drawFood = () => {
    const { x, y, color } = food;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
    ctx.fill();
}

// Desenho da cobra
const drawSnake = () => {
    snake.forEach((position, index) => {
        ctx.fillStyle = index === snake.length - 1 ? "lime" : "limeGreen";
        ctx.beginPath();
        ctx.arc(position.x + radius, position.y + radius, radius, 0, 2 * Math.PI);
        ctx.fill();
    });
}

const moveSnake = () => {
    if (!direction) return;

    const head = { ...snake[snake.length - 1] };

    if (direction === "right") {
        head.x += size;
    } else if (direction === "left") {
        head.x -= size;
    } else if (direction === "down") {
        head.y += size;
    } else if (direction === "up") {
        head.y -= size;
    }

    snake.push(head);
    snake.shift();
}

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";
    for (let i = 0; i < canvasSize; i += size) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvasSize);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvasSize, i);
        ctx.stroke();
    }
}

const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x === food.x && head.y === food.y) {
        incrementScore();
        audio.play();

        let newFoodPosition;
        do {
            newFoodPosition = {
                x: randomPosition(),
                y: randomPosition()
            };
        } while (snake.some(position => position.x === newFoodPosition.x && position.y === newFoodPosition.y));

        food.x = newFoodPosition.x;
        food.y = newFoodPosition.y;
        food.color = randomColor();
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const wallCollision =
        head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize;

    const selfCollision = snake.slice(0, -1).some(position => position.x === head.x && position.y === head.y);

    if (wallCollision || selfCollision) {
        gameOver();
    }
}

const gameOver = () => {
    direction = undefined;
    menu.style.display = "flex";
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(2px)";
}

const gameLoop = () => {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setTimeout(gameLoop, 150);
}

gameLoop();

document.addEventListener("keydown", ({ key }) => {
    if (key === "ArrowRight" && direction !== "left") {
        direction = "right";
    } else if (key === "ArrowLeft" && direction !== "right") {
        direction = "left";
    } else if (key === "ArrowDown" && direction !== "up") {
        direction = "down";
    } else if (key === "ArrowUp" && direction !== "down") {
        direction = "up";
    }
});

buttonPlay.addEventListener("click", () => {
    score.innerText = "00";
    menu.style.display = "none";
    canvas.style.filter = "none";


    snake = [
        { x: 270, y: 240 },
        { x: 300, y: 240 },
        { x: 330, y: 240 },
        { x: 360, y: 240 },
        { x: 390, y: 240 },
        { x: 420, y: 240 }
    ];
    direction = undefined;
});
