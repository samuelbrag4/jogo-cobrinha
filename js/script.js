// Seleciona o elemento canvas e obtém o contexto 2D
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Seleciona elementos de pontuação e menu
const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

// Carrega o áudio do jogo
const audio = new Audio("../assets/audio.mp3");

// Define o tamanho da cobra e do canvas
const size = 30;
const radius = size / 2;
const canvasSize = 600;

// Define a posição inicial da cobra
let snake = [ 
    { x: 270, y: 240 }, 
    { x: 300, y: 240 }, 
    { x: 330, y: 240 }, 
    { x: 360, y: 240 }, 
    { x: 390, y: 240 }, 
    { x: 420, y: 240 } 
];

// Posição inicial da cobra
const initialPosition = { x: 270, y: 240 };

// Função para incrementar a pontuação quando a cobra come
const incrementScore = () => {
    score.innerText = +score.innerText + 10;
}

// Função para gerar um número aleatório entre min e max
const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para gerar uma posição aleatória no canvas
const randomPosition = () => {
    return Math.floor(Math.random() * (canvasSize / size)) * size;
}

// Função para gerar uma cor amarela para a comida
const randomColor = () => {
    return "yellow";
}

// Objeto que representa a comida
const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction;
let loopId;

// Função para desenhar a comida no canvas com sombra branca brilhante
const drawFood = () => {
    const { x, y, color } = food;
    ctx.fillStyle = color;
    ctx.shadowColor = "white";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0; // Reseta a sombra para não afetar outros desenhos
}

// Função para desenhar a cobra no canvas
const drawSnake = () => {
    snake.forEach((position, index) => {
        ctx.fillStyle = index === snake.length - 1 ? "lime" : "limeGreen";
        ctx.beginPath();
        ctx.arc(position.x + radius, position.y + radius, radius, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Função para mover a cobra
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

// Função para desenhar a grade no canvas
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

// Função para verificar se a cobra comeu a comida
const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x === food.x && head.y === food.y) {
        incrementScore();
        audio.play();

        // Adiciona um novo segmento à cobra
        const newSegment = { ...snake[0] };
        snake.unshift(newSegment);

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

// Função para verificar colisões
const checkCollision = () => {
    const head = snake[snake.length - 1];
    const wallCollision =
        head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize;

    const selfCollision = snake.slice(0, -1).some(position => position.x === head.x && position.y === head.y);

    if (wallCollision || selfCollision) {
        gameOver();
    }
}

// Função para finalizar o jogo
const gameOver = () => {
    direction = undefined;
    menu.style.display = "flex";
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(2px)";
}

// Função principal do jogo que é executada em loop
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

// Inicia o loop do jogo
gameLoop();

// Evento de teclado para mudar a direção da cobra
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

// Evento de clique no botão de jogar novamente
buttonPlay.addEventListener("click", () => {
    // Reinicia a pontuação
    score.innerText = "00";
    // Esconde o menu e remove o filtro do canvas
    menu.style.display = "none";
    canvas.style.filter = "none";

    // Reinicia a posição da cobra
    snake = [
        { x: 270, y: 240 },
        { x: 300, y: 240 },
        { x: 330, y: 240 },
        { x: 360, y: 240 },
        { x: 390, y: 240 },
        { x: 420, y: 240 }
    ];
    // Reseta a direção
    direction = undefined;
});