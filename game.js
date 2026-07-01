// game.js

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

// ---------- ПИКСЕЛЬНЫЕ СПРАЙТЫ ----------
// Каждый спрайт — массив строк, каждая строка — ряд пикселей.
// Символы: B=синий, W=белый, G=серый, R=красный, Y=жёлтый, K=чёрный, S=телесный, D=тёмно-синий, L=светло-синий, O=оранжевый, M=коричневый, P=фиолетовый, C=голубой, E=светло-серый.

const SPRITES = {
    player: [
        '    BB    ',
        '   BBBB   ',
        '  BBBBBB  ',
        '  BKKBKB  ',
        '  BBBBBB  ',
        '  BB  BB  ',
        '  BB  BB  ',
        ' BBBBBBBB ',
        ' BBBBBBBB ',
        ' B B  B B ',
        ' B B  B B ',
        '  B    B  ',
    ],
    doctor: [
        '    MM    ',
        '   MMMM   ',
        '  MMMMMM  ',
        '  MWKWM   ',
        '  MMMMMM  ',
        '  MM  MM  ',
        '  MM  MM  ',
        ' MMMMMMMM ',
        ' MMMMMMMM ',
        ' M M  M M ',
        ' M M  M M ',
        '  M    M  ',
    ],
    dalek: [
        '   GGGG   ',
        '  GGGGGG  ',
        ' GGGGGGGG ',
        ' GGBBBGG  ',
        ' GGGGGGGG ',
        '  GGGGGG  ',
        '  G GGGG  ',
        '  G G  G  ',
        '  G G  G  ',
        '  GGGGGG  ',
        '  GG  GG  ',
        '  G    G  ',
    ],
    tardis: [
        '   BB     ',
        '  BBBB    ',
        '  BBBB    ',
        ' BBWWBBB  ',
        ' BBWWBBB  ',
        ' BBBBBBBB ',
        ' BBBBBBBB ',
        ' BBWWBBB  ',
        ' BBWWBBB  ',
        ' BBBBBBBB ',
        ' BBBBBBBB ',
        '   BB     ',
    ],
    sonic: [
        '   KK   ',
        '  KKKK  ',
        '  KKKK  ',
        '  KKKK  ',
        '  KKKK  ',
        '   KK   ',
    ],
};

// Функция отрисовки спрайта по матрице
function drawSprite(sprite, x, y, scale = 1) {
    const rows = sprite.length;
    const cols = sprite[0].length;
    const pixelSize = 3 * scale; // базовый размер пикселя, масштабируется
    const offsetX = - (cols * pixelSize) / 2;
    const offsetY = - (rows * pixelSize) / 2;
    const colorMap = {
        'B': '#2a5a8a',
        'W': '#ffffff',
        'G': '#888888',
        'R': '#cc3333',
        'Y': '#ffcc00',
        'K': '#222222',
        'S': '#f7d9aa',
        'D': '#1a3a5a',
        'L': '#4a8ab5',
        'O': '#cc8833',
        'M': '#8b5a3a',
        'P': '#aa44aa',
        'C': '#44aacc',
        'E': '#cccccc',
    };
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const ch = sprite[row][col];
            const color = colorMap[ch];
            if (color) {
                ctx.fillStyle = color;
                const px = x + offsetX + col * pixelSize;
                const py = y + offsetY + row * pixelSize;
                ctx.fillRect(px, py, pixelSize, pixelSize);
            }
        }
    }
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
            tardis: { x: 10, y: 8, label: 'ТАРДИС', color: '#4a7db5' },
            dalek:  { x: 18, y: 5, label: 'Далёк', color: '#b33a3a' },
            doctor: { x: 6, y: 14, label: 'Доктор', color: '#f4c542' },
            sonic:  { x: 14, y: 12, label: 'Звуковая отвёртка', color: '#aaa' }
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
            tardis: { x: 12, y: 10, label: 'ТАРДИС (Галлифрей)', color: '#4a7db5' },
            advisor: { x: 6, y: 8, label: 'Советник', color: '#8a6e3b' }
        }
    }
};

// ---------- Игровое состояние ----------
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

// ---------- Клавиатура (исправлена для любой раскладки) ----------
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

// ---------- Джойстик ----------
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

// ---------- Игровая логика ----------
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

// ---------- ОТРИСОВКА С ПИКСЕЛЬНЫМИ СПРАЙТАМИ ----------
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

    // Рисуем объекты (спрайты)
    const objects = map.objects;
    const spriteScale = TILE_SIZE / 20; // подгоняем размер спрайта под тайл
    for (let key in objects) {
        const obj = objects[key];
        const x = obj.x * TILE_SIZE + TILE_SIZE/2 - camera.x;
        const y = obj.y * TILE_SIZE + TILE_SIZE/2 - camera.y;
        if (x < -30 || x > canvas.width/scale + 30 || y < -30 || y > canvas.height/scale + 30) continue;

        let sprite = null;
        if (key === 'tardis') sprite = SPRITES.tardis;
        else if (key === 'doctor') sprite = SPRITES.doctor;
        else if (key === 'dalek') sprite = SPRITES.dalek;
        else if (key === 'sonic') sprite = SPRITES.sonic;
        else if (key === 'advisor') sprite = SPRITES.doctor; // используем спрайт доктора для советника

        if (sprite) {
            drawSprite(sprite, x, y, spriteScale);
        } else {
            // fallback: кружок
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 10;
            ctx.fillStyle = obj.color || '#888';
            ctx.beginPath();
            ctx.arc(x, y, 16, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#fff';
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(obj.label, x, y - 20);
        }
    }

    // Рисуем игрока (спрайт)
    const playerScale = TILE_SIZE / 20;
    drawSprite(SPRITES.player, player.x - camera.x, player.y - camera.y, playerScale);

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

// ---------- Игровой цикл ----------
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
