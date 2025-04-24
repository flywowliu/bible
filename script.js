// 定义游戏区域和方块大小
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
const canvasSize = 320;
canvas.width = canvasSize;
canvas.height = canvasSize;

// 添加难度等级选择
const difficultyLevels = {
  easy: 200,
  medium: 100,
  hard: 50
};
let currentDifficulty = 'medium';

// 初始化蛇
let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box
};

// 初始化食物
let food = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
};

// 初始化分数
let score = 0;

// 控制蛇的移动方向
let d;

// 监听键盘事件
document.addEventListener('keydown', direction);

// 添加难度选择事件监听
const difficultySelect = document.createElement('select');
const difficultyOptions = Object.keys(difficultyLevels);
difficultyOptions.forEach(option => {
  const optionElement = document.createElement('option');
  optionElement.value = option;
  optionElement.textContent = option.charAt(0).toUpperCase() + option.slice(1);
  difficultySelect.appendChild(optionElement);
});
difficultySelect.value = currentDifficulty;
document.body.appendChild(difficultySelect);

difficultySelect.addEventListener('change', function() {
  currentDifficulty = this.value;
  clearInterval(game);
  game = setInterval(draw, difficultyLevels[currentDifficulty]);
});

function direction(event) {
    let key = event.keyCode;
    if (key == 37 && d != 'RIGHT') {
        d = 'LEFT';
    } else if (key == 38 && d != 'DOWN') {
        d = 'UP';
    } else if (key == 39 && d != 'LEFT') {
        d = 'RIGHT';
    } else if (key == 40 && d != 'UP') {
        d = 'DOWN';
    }
}

// 检查蛇是否撞到自己
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

// 绘制游戏元素
function draw() {
    // 绘制背景
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // 绘制蛇
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? 'green' : 'lightgreen';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // 绘制食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // 记录蛇的头部位置
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // 根据移动方向更新蛇的头部位置
    if (d == 'LEFT') snakeX -= box;
    if (d == 'UP') snakeY -= box;
    if (d == 'RIGHT') snakeX += box;
    if (d == 'DOWN') snakeY += box;

    // 检查蛇是否吃到食物
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 15 + 1) * box,
            y: Math.floor(Math.random() * 15 + 1) * box
        };
    } else {
        // 移除蛇的尾部
        snake.pop();
    }

    // 创建新的蛇头
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // 检查游戏是否结束
    if (snakeX < 0 || snakeX >= canvasSize || snakeY < 0 || snakeY >= canvasSize || collision(newHead, snake)) {
        clearInterval(game);
    }

    // 将新的蛇头添加到蛇的数组中
    snake.unshift(newHead);

    // 显示分数
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('分数: ' + score, 10, 30);
}

// 游戏主循环
let game = setInterval(draw, difficultyLevels[currentDifficulty]);