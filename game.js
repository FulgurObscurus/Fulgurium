// game.js — улучшенная графика с чёткими персонажами

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const joystickArea = document.getElementById('joystick-area');
const joystickKnob = document.getElementById('joystick-knob');
const actionBtn = document.getElementById('action-button');

const TILE_SIZE = 48;
const COLS = 25;
const ROWS = 20;
const MAP_WIDTH = COLS * TILE_SIZE;
const MAP_HEIGHT = ROWS * TILE_SIZE;

function resizeCanvas() {
    const wrapper = document.getElementById('canvas-wrapper');
    const rect = wrapper.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const aspect = MAP_WIDTH / MAP_HEIGHT;
    let displayWidth = w;
    let displayHeight = h;
    if (displayWidth / displayHeight > aspect) {
        displayWidth = displayHeight * aspect;
    } else {
        displayHeight = displayWidth / aspect;
    }
    const scaleX = displayWidth / MAP_WIDTH;
    const scaleY = displayHeight / MAP_HEIGHT;
    const scale = Math.min(scaleX, scaleY);
    canvas.width = MAP_WIDTH * scale;
    canvas.height = MAP_HEIGHT * scale;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    canvas._scale = scale;
    canvas.style.position = 'absolute';
    canvas.style.left = (w - canvas.width) / 2 + 'px';
    canvas.style.top = (h - canvas.height) / 2 + 'px';
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ---------- РИСОВАНИЕ ПЕРСОНАЖЕЙ ----------
// Все персонажи рисуются в масштабе 1:1 внутри квадрата 40x40 пикселей.
// При отрисовке они масштабируются под размер тайла.

function drawPlayer(x, y, scale) {
    const s = scale * 1.2; // делаем крупнее
    // Тень
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(x, y + 20*s, 18*s, 6*s, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fill();
    ctx.restore();

    // Голова (светлый круг)
    ctx.fillStyle = '#f7d9aa';
    ctx.beginPath();
    ctx.arc(x, y - 16*s, 10*s, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5*s;
    ctx.stroke();

    // Волосы (оранжевые)
    ctx.fillStyle = '#ddaa55';
    ctx.beginPath();
    ctx.arc(x, y - 18*s, 10*s, -Math.PI, 0);
    ctx.fill();

    // Глаза
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(x - 5*s, y - 18*s, 2*s, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 5*s, y - 18*s, 2*s, 0, Math.PI*2);
    ctx.fill();

    // Тело (синяя куртка)
    ctx.fillStyle = '#2a6a9a';
    ctx.fillRect(x - 12*s, y - 6*s, 24*s, 16*s);
    ctx.strokeStyle = '#1a4a7a';
    ctx.lineWidth = 1.5*s;
    ctx.strokeRect(x - 12*s, y - 6*s, 24*s, 16*s);

    // Руки (синие)
    ctx.fillStyle = '#2a6a9a';
    ctx.fillRect(x - 18*s, y - 4*s, 6*s, 14*s);
    ctx.fillRect(x + 12*s, y - 4*s, 6*s, 14*s);
    ctx.strokeStyle = '#1a4a7a';
    ctx.lineWidth = 1.5*s;
    ctx.strokeRect(x - 18*s, y - 4*s, 6*s, 14*s);
    ctx.strokeRect(x + 12*s, y - 4*s, 6*s, 14*s);

    // Ноги (джинсы)
    ctx.fillStyle = '#3a6a8a';
    ctx.fillRect(x - 10*s, y + 10*s, 8*s, 12*s);
    ctx.fillRect(x + 2*s, y + 10*s, 8*s, 12*s);
    ctx.strokeStyle = '#1a4a7a';
    ctx.lineWidth = 1.5*s;
    ctx.strokeRect(x - 10*s, y + 10*s, 8*s, 12*s);
    ctx.strokeRect(x + 2*s, y + 10*s, 8*s, 12*s);

    // Обувь (тёмная)
    ctx.fillStyle = '#333';
    ctx.fillRect(x - 11*s, y + 22*s, 10*s, 4*s);
    ctx.fillRect(x + 1*s, y + 22*s, 10*s, 4*s);
}

function drawDoctor(x, y, scale) {
    const s = scale * 1.2;
    // Тень
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(x, y + 20*s, 18*s, 6*s, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fill();
    ctx.restore();

    // Голова
    ctx.fillStyle = '#f7d9aa';
    ctx.beginPath();
    ctx.arc(x, y - 16*s, 10*s, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5*s;
    ctx.stroke();

    // Седые волосы
    ctx.fillStyle = '#cccccc';
    ctx.beginPath();
    ctx.arc(x, y - 18*s, 10*s, -Math.PI, 0);
    ctx.fill();

    // Очки (два круга)
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1.5*s;
    ctx.beginPath();
    ctx.arc(x - 5*s, y - 17*s, 4*s, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 5*s, y - 17*s, 4*s, 0, Math.PI*2);
    ctx.stroke();
    // дужка
    ctx.beginPath();
    ctx.moveTo(x - 9*s, y - 17*s);
    ctx.lineTo(x - 13*s, y - 19*s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 9*s, y - 17*s);
    ctx.lineTo(x + 13*s, y - 19*s);
    ctx.stroke();

    // Глаза (под очками)
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(x - 5*s, y - 17*s, 1.5*s, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 5*s, y - 17*s, 1.5*s, 0, Math.PI*2);
    ctx.fill();

    // Тело (коричневое пальто)
    ctx.fillStyle = '#8b6a4a';
    ctx.fillRect(x - 14*s, y - 6*s, 28*s, 18*s);
    ctx.strokeStyle = '#5a4a3a';
    ctx.lineWidth = 1.5*s;
    ctx.strokeRect(x - 14*s, y - 6*s, 28*s, 18*s);

    // Галстук-бабочка (красный)
    ctx.fillStyle = '#cc3333';
    ctx.fillRect(x - 5*s, y - 6*s, 10*s, 4*s);
    ctx.fillRect(x - 7*s, y - 4*s, 14*s, 3*s);

    // Руки (коричневые)
    ctx.fillStyle = '#8b6a4a';
    ctx.fillRect(x - 20*s, y - 4*s, 6*s, 14*s);
    ctx.fillRect(x + 14*s, y - 4*s, 6*s, 14*s);
    ctx.strokeStyle = '#5a4a3a';
    ctx.lineWidth = 1.5*s;
    ctx.strokeRect(x - 20*s, y - 4*s, 6*s, 14*s);
    ctx.strokeRect(x + 14*s, y - 4*s, 6*s, 14*s);

    // Трость (в правой руке)
    ctx.strokeStyle = '#8a7a6a';
    ctx.lineWidth = 2*s;
    ctx.beginPath();
    ctx.moveTo(x + 18*s, y - 2*s);
    ctx.lineTo(x + 24*s, y + 20*s);
    ctx.stroke();

    // Ноги (тёмные брюки)
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(x - 10*s, y + 12*s, 8*s, 12*s);
    ctx.fillRect(x + 2*s, y + 12*s, 8*s, 12*s);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5*s;
    ctx.strokeRect(x - 10*s, y + 12*s, 8*s, 12*s);
    ctx.strokeRect(x + 2*s, y + 12*s, 8*s, 12*s);
}

function drawDalek(x, y, scale) {
    const s = scale * 1.2;
    // Тень
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(x, y + 20*s, 16*s, 6*s, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fill();
    ctx.restore();

    // Корпус (серый баклажан)
    ctx.fillStyle = '#999999';
    ctx.beginPath();
    ctx.moveTo(x - 14*s, y + 4*s);
    ctx.quadraticCurveTo(x - 18*s, y - 10*s, x - 10*s, y - 18*s);
    ctx.quadraticCurveTo(x, y - 24*s, x + 10*s, y - 18*s);
    ctx.quadraticCurveTo(x + 18*s, y - 10*s, x + 14*s, y + 4*s);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1.5*s;
    ctx.stroke();

    // Антенна (сверху)
    ctx.strokeStyle = '#777';
    ctx.lineWidth = 2*s;
    ctx.beginPath();
    ctx.moveTo(x, y - 22*s);
    ctx.lineTo(x, y - 30*s);
    ctx.stroke();
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(x, y - 30*s, 3*s, 0, Math.PI*2);
    ctx.fill();

    // Глаз (синий)
    ctx.fillStyle = '#44aacc';
    ctx.beginPath();
    ctx.arc(x, y - 14*s, 6*s, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5*s;
    ctx.stroke();

    // Огни (кнопки)
    ctx.fillStyle = '#44aacc';
    ctx.beginPath();
    ctx.arc(x - 8*s, y - 4*s, 3*s, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 8*s, y - 4*s, 3*s, 0, Math.PI*2);
    ctx.fill();

    // Нижняя часть (юбка)
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.moveTo(x - 16*s, y + 4*s);
    ctx.lineTo(x - 18*s, y + 10*s);
    ctx.lineTo(x + 18*s, y + 10*s);
    ctx.lineTo(x + 16*s, y + 4*s);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1.5*s;
    ctx.stroke();

    // Шарики (ноги)
    ctx.fillStyle = '#777';
    ctx.beginPath();
    ctx.arc(x - 8*s, y + 12*s, 5*s, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1.5*s;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 8*s, y + 12*s, 5*s, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
}

function drawTardis(x, y, scale) {
    const s = scale * 1.2;
    // Тень
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(x, y + 18*s, 18*s, 6*s, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fill();
    ctx.restore();

    // Корпус (синий)
    ctx.fillStyle = '#1a4a7a';
    ctx.fillRect(x - 16*s, y - 20*s, 32*s, 32*s);
    ctx.strokeStyle = '#0a2a4a';
    ctx.lineWidth = 2*s;
    ctx.strokeRect(x - 16*s, y - 20*s, 32*s, 32*s);

    // Окна (белые)
    ctx.fillStyle = '#aaccee';
    ctx.fillRect(x - 12*s, y - 14*s, 8*s, 10*s);
    ctx.fillRect(x + 4*s, y - 14*s, 8*s, 10*s);
    ctx.fillRect(x - 12*s, y + 2*s, 8*s, 10*s);
    ctx.fillRect(x + 4*s, y + 2*s, 8*s, 10*s);

    // Рамы окон (тёмно-синие)
    ctx.strokeStyle = '#0a2a4a';
    ctx.lineWidth = 1.5*s;
    ctx.strokeRect(x - 12*s, y - 14*s, 8*s, 10*s);
    ctx.strokeRect(x + 4*s, y - 14*s, 8*s, 10*s);
    ctx.strokeRect(x - 12*s, y + 2*s, 8*s, 10*s);
    ctx.strokeRect(x + 4*s, y + 2*s, 8*s, 10*s);

    // Крыша (тёмно-синяя)
    ctx.fillStyle = '#0a2a4a';
    ctx.fillRect(x - 18*s, y - 24*s, 36*s, 6*s);
    // Фонарь
    ctx.fillStyle = '#44aacc';
    ctx.beginPath();
    ctx.arc(x, y - 26*s, 4*s, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5*s;
    ctx.stroke();
}

function drawSonic(x, y, scale) {
    const s = scale * 1.2;
    // Свечение
    ctx.save();
    ctx.shadowColor = 'rgba(68, 170, 204, 0.6)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#44aacc';
    ctx.beginPath();
    ctx.arc(x, y, 8*s, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // Стержень (серебристый)
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(x - 2*s, y - 14*s, 4*s, 28*s);
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1.5*s;
    ctx.strokeRect(x - 2*s, y - 14*s, 4*s, 28*s);

    // Наконечник (синий)
    ctx.fillStyle = '#44aacc';
    ctx.beginPath();
    ctx.arc(x, y - 14*s, 4*s, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#2a6a9a';
    ctx.lineWidth = 1.5*s;
    ctx.stroke();

    // Рукоятка (тёмная)
    ctx.fillStyle = '#555';
    ctx.fillRect(x - 4*s, y + 2*s, 8*s, 4*s);
}

// ---------- КАРТА (без изменений) ----------
const maps = {
    earth: {
        name: 'Земля',
        tiles: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        objects: {
            tardis: { x: 10, y: 8, label: 'ТАРДИС', type: 'tardis' },
            dalek:  { x: 18, y: 5, label: 'Далёк', type: 'dalek' },
            doctor: { x: 6, y: 14, label: 'Доктор', type: 'doctor' },
            sonic:  { x: 14, y: 12, label: 'Звуковая отвёртка', type: 'sonic' }
        }
    },
    gallifrey: {
        name: 'Галлифрей',
        tiles: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        objects: {
            tardis: { x: 12, y: 10, label: 'ТАРДИС (Галлифрей)', type: 'tardis' },
            advisor: { x: 6, y: 8, label: 'Советник', type: 'doctor' }
        }
    }
};

// ---------- ИГРОВОЕ СОСТОЯНИЕ ----------
let currentMap = 'earth';
let player = {
    x: 5 * TILE_SIZE + TILE_SIZE/2,
    y: 10 * TILE_SIZE + TILE_SIZE/2,
    radius: 12,
    speed: 3,
    inventory: []
};

let camera = { x: 0, y: 0 };
let dialogActive = false;
let dialogText = '';

let joystickActive = false;
let joystickDir = { x: 0, y: 0 };
let keys = {};

function getMap() { return maps[currentMap]; }

function getTile(col, row) {
    const map = getMap();
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return 1;
    return map.tiles[row][col];
}

function isBlocked(x, y) {
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);
    const offsets = [
        [-player.radius, -player.radius],
        [ player.radius, -player.radius],
        [-player.radius,  player.radius],
        [ player.radius,  player.radius]
    ];
    for (let [dx, dy] of offsets) {
        const cx = x + dx;
        const cy = y + dy;
        const c = Math.floor(cx / TILE_SIZE);
        const r = Math.floor(cy / TILE_SIZE);
        if (getTile(c, r) === 1) return true;
    }
    return false;
}

function getNearbyObject() {
    const map = getMap();
    const objects = map.objects;
    for (let key in objects) {
        const obj = objects[key];
        const objX = obj.x * TILE_SIZE + TILE_SIZE/2;
        const objY = obj.y * TILE_SIZE + TILE_SIZE/2;
        const dist = Math.hypot(player.x - objX, player.y - objY);
        if (dist < TILE_SIZE) {
            return { key, ...obj };
        }
    }
    return null;
}

function interact() {
    if (dialogActive) {
        dialogActive = false;
        dialogText = '';
        return;
    }
    const obj = getNearbyObject();
    if (!obj) {
        dialogText = 'Рядом ничего нет.';
        dialogActive = true;
        setTimeout(() => { dialogActive = false; dialogText = ''; }, 1500);
        return;
    }

    if (obj.key === 'tardis') {
        if (currentMap === 'earth') {
            currentMap = 'gallifrey';
            const newMap = getMap();
            const tardisObj = newMap.objects.tardis;
            player.x = tardisObj.x * TILE_SIZE + TILE_SIZE/2;
            player.y = tardisObj.y * TILE_SIZE + TILE_SIZE/2;
        } else {
            currentMap = 'earth';
            const newMap = getMap();
            const tardisObj = newMap.objects.tardis;
            player.x = tardisObj.x * TILE_SIZE + TILE_SIZE/2;
            player.y = tardisObj.y * TILE_SIZE + TILE_SIZE/2;
        }
        dialogText = 'ТАРДИС перемещает вас...';
        dialogActive = true;
        setTimeout(() => { dialogActive = false; dialogText = ''; }, 1500);
        return;
    }

    if (obj.key === 'doctor') {
        dialogText = 'Доктор: "Привет! Я Доктор. Помоги мне победить Далеков!"';
        dialogActive = true;
        setTimeout(() => { dialogActive = false; dialogText = ''; }, 3000);
        return;
    }

    if (obj.key === 'dalek') {
        if (player.inventory.includes('sonic')) {
            dialogText = 'Вы используете звуковую отвёртку! Далёк деактивирован!';
            delete getMap().objects.dalek;
            dialogActive = true;
            setTimeout(() => { dialogActive = false; dialogText = ''; }, 2000);
        } else {
            dialogText = 'Далёк атакует! У вас нет защиты! Игра окончена.';
            dialogActive = true;
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
        return;
    }

    if (obj.key === 'sonic') {
        if (!player.inventory.includes('sonic')) {
            player.inventory.push('sonic');
            delete getMap().objects.sonic;
            dialogText = 'Вы подобрали звуковую отвёртку!';
        } else {
            dialogText = 'У вас уже есть отвёртка.';
        }
        dialogActive = true;
        setTimeout(() => { dialogActive = false; dialogText = ''; }, 1500);
        return;
    }

    dialogText = `Вы взаимодействуете с ${obj.label}.`;
    dialogActive = true;
    setTimeout(() => { dialogActive = false; dialogText = ''; }, 1500);
}

// ---------- КЛАВИАТУРА ----------
document.addEventListener('keydown', (e) => {
    const code = e.code;
    if (code === 'KeyW' || code === 'KeyA' || code === 'KeyS' || code === 'KeyD' ||
        code === 'ArrowUp' || code === 'ArrowDown' || code === 'ArrowLeft' || code === 'ArrowRight' ||
        code === 'KeyE') {
        e.preventDefault();
    }
    keys[code] = true;
    if (code === 'KeyE') {
        interact();
    }
});
document.addEventListener('keyup', (e) => {
    const code = e.code;
    if (code === 'KeyW' || code === 'KeyA' || code === 'KeyS' || code === 'KeyD' ||
        code === 'ArrowUp' || code === 'ArrowDown' || code === 'ArrowLeft' || code === 'ArrowRight' ||
        code === 'KeyE') {
        e.preventDefault();
    }
    keys[code] = false;
});

// ---------- ДЖОЙСТИК ----------
function handleJoystickStart(e) {
    e.preventDefault();
    joystickActive = true;
    updateJoystick(e);
}
function handleJoystickMove(e) {
    e.preventDefault();
    if (joystickActive) updateJoystick(e);
}
function handleJoystickEnd(e) {
    e.preventDefault();
    joystickActive = false;
    joystickDir = { x: 0, y: 0 };
    joystickKnob.style.transform = 'translate(-50%, -50%)';
}
function updateJoystick(e) {
    const rect = joystickArea.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    let dx = touch.clientX - cx;
    let dy = touch.clientY - cy;
    const maxDist = rect.width/2 - 25;
    const dist = Math.hypot(dx, dy);
    if (dist > maxDist) {
        dx = dx / dist * maxDist;
        dy = dy / dist * maxDist;
    }
    joystickKnob.style.transform = `translate(${-50 + (dx/rect.width*100)}%, ${-50 + (dy/rect.height*100)}%)`;
    const normX = dx / maxDist;
    const normY = dy / maxDist;
    joystickDir = { x: Math.min(1, Math.max(-1, normX)), y: Math.min(1, Math.max(-1, normY)) };
}

joystickArea.addEventListener('touchstart', handleJoystickStart, { passive: false });
joystickArea.addEventListener('touchmove', handleJoystickMove, { passive: false });
joystickArea.addEventListener('touchend', handleJoystickEnd, { passive: false });
joystickArea.addEventListener('touchcancel', handleJoystickEnd, { passive: false });

actionBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    interact();
}, { passive: false });
actionBtn.addEventListener('click', interact);

// ---------- ИГРОВАЯ ЛОГИКА ----------
function updatePlayer() {
    let dx = 0, dy = 0;
    if (keys['ArrowUp'] || keys['KeyW']) dy = -player.speed;
    if (keys['ArrowDown'] || keys['KeyS']) dy = player.speed;
    if (keys['ArrowLeft'] || keys['KeyA']) dx = -player.speed;
    if (keys['ArrowRight'] || keys['KeyD']) dx = player.speed;

    if (joystickActive) {
        const joyX = joystickDir.x * player.speed;
        const joyY = joystickDir.y * player.speed;
        if (dx === 0 && dy === 0) {
            dx = joyX;
            dy = joyY;
        } else {
            dx += joyX;
            dy += joyY;
            const len = Math.hypot(dx, dy);
            if (len > player.speed) {
                dx = dx / len * player.speed;
                dy = dy / len * player.speed;
            }
        }
    }

    if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
    }

    if (dx !== 0) {
        const newX = player.x + dx;
        if (!isBlocked(newX, player.y)) {
            player.x = newX;
        }
    }
    if (dy !== 0) {
        const newY = player.y + dy;
        if (!isBlocked(player.x, newY)) {
            player.y = newY;
        }
    }

    player.x = Math.max(player.radius, Math.min(MAP_WIDTH - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(MAP_HEIGHT - player.radius, player.y));
}

function updateCamera() {
    const scale = canvas._scale || 1;
    const viewW = canvas.width / scale;
    const viewH = canvas.height / scale;
    camera.x = player.x - viewW/2;
    camera.y = player.y - viewH/2;
    camera.x = Math.max(0, Math.min(MAP_WIDTH - viewW, camera.x));
    camera.y = Math.max(0, Math.min(MAP_HEIGHT - viewH, camera.y));
}

// ---------- ОТРИСОВКА ----------
function draw() {
    const scale = canvas._scale || 1;
    ctx.save();
    ctx.scale(scale, scale);

    ctx.clearRect(-camera.x, -camera.y, MAP_WIDTH, MAP_HEIGHT);

    const map = getMap();
    // Рисуем тайлы
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const x = col * TILE_SIZE - camera.x;
            const y = row * TILE_SIZE - camera.y;
            if (x + TILE_SIZE < 0 || x > canvas.width/scale || y + TILE_SIZE < 0 || y > canvas.height/scale) continue;
            const tile = map.tiles[row][col];
            if (tile === 1) {
                ctx.fillStyle = '#3a4a5a';
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = '#2a3a4a';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            } else {
                ctx.fillStyle = '#2d5a3a';
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                if ((row+col) % 2 === 0) {
                    ctx.fillStyle = '#3a6a4a';
                    ctx.fillRect(x+4, y+4, 4, 4);
                }
            }
        }
    }

    // Рисуем объекты
    const objects = map.objects;
    for (let key in objects) {
        const obj = objects[key];
        const x = obj.x * TILE_SIZE + TILE_SIZE/2 - camera.x;
        const y = obj.y * TILE_SIZE + TILE_SIZE/2 - camera.y;
        if (x < -40 || x > canvas.width/scale + 40 || y < -40 || y > canvas.height/scale + 40) continue;

        const type = obj.type || key;
        switch (type) {
            case 'tardis': drawTardis(x, y, 1.0); break;
            case 'dalek': drawDalek(x, y, 1.0); break;
            case 'doctor': drawDoctor(x, y, 1.0); break;
            case 'sonic': drawSonic(x, y, 1.0); break;
            default: drawDoctor(x, y, 1.0); break;
        }
    }

    // Рисуем игрока
    drawPlayer(player.x - camera.x, player.y - camera.y, 1.0);

    // Диалоговое окно
    if (dialogActive && dialogText) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 0;
        const pad = 20;
        ctx.font = '18px monospace';
        const tw = ctx.measureText(dialogText).width;
        const tx = (canvas.width/scale - tw - pad*2) / 2;
        const ty = (canvas.height/scale - 60);
        ctx.fillRect(tx, ty, tw + pad*2, 50);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(dialogText, tx + pad, ty + 25);
    }

    // Инвентарь
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(canvas.width/scale - 160, 10, 150, 30);
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const invText = '🎒 ' + (player.inventory.length ? player.inventory.join(', ') : 'пусто');
    ctx.fillText(invText, canvas.width/scale - 150, 25);

    ctx.restore();
}

// ---------- ИГРОВОЙ ЦИКЛ ----------
function gameLoop() {
    updatePlayer();
    updateCamera();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

window.addEventListener('resize', () => {
    resizeCanvas();
});
