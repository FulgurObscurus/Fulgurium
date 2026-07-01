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

// ---------- РАСШИРЕННАЯ ЦВЕТОВАЯ ПАЛИТРА ----------
const COLORS = {
    'B': '#1a4a7a', // тёмный синий (куртка)
    'L': '#3a7aba', // светлый синий (свет на куртке)
    'W': '#f0f0f0', // белый
    'G': '#999999', // серый (металл)
    'K': '#222222', // чёрный (контуры, волосы)
    'S': '#f5d6b8', // телесный (лицо)
    'D': '#0a2a4a', // очень тёмный синий (тени)
    'O': '#ddaa55', // оранжевый (волосы)
    'M': '#8b6a4a', // коричневый (пальто)
    'P': '#aa44aa', // фиолетовый (глаза)
    'C': '#44aacc', // голубой (свечение)
    'E': '#dddddd', // светло-серый (засветы)
    'R': '#cc3333', // красный (галстук)
    'Y': '#ffcc00', // жёлтый (золото)
    'H': '#e8c9a0', // светлый загар
    'N': '#3a6a2a', // тёмно-зелёный (трава)
    'F': '#ffaa77', // персиковый (щёки)
    'U': '#5a4a3a', // тёмно-коричневый (ремень)
    'V': '#7799aa', // серо-голубой (металл)
    'Z': '#aaccee', // светлый голубой (окна)
    'T': '#8a7a6a', // серо-коричневый (тень)
    'X': '#000000', // абсолютный чёрный
};

// ---------- НОВЫЕ КРУПНЫЕ СПРАЙТЫ (32x44 для персонажей, 28x36 для объектов) ----------
// Игрок (парень в синей куртке, светлые волосы, рюкзак, джинсы)
const SPRITE_PLAYER = [
    '        OOOO            ',
    '       OOOOOO           ',
    '      OOOOOOOO          ',
    '     OOOOOOOOOO         ',
    '    OOOOKKKKOOOO        ',
    '    OOOOKKKKOOOO        ',
    '   OOOOKKSSKKOOOO       ',
    '   OOOOKSSSSKOOOO       ',
    '   OOOOBBBBBBOOOO       ',
    '   OOOOBBBBBBOOOO       ',
    '   OOOOBBBBBBOOOO       ',
    '   OOOOBBBBBBOOOO       ',
    '   OOOOBB  BBOOOO       ',
    '   OOOOBB  BBOOOO       ',
    '   OOOOBBBBBBOOOO       ',
    '   OOOOBBBBBBOOOO       ',
    '   OOOOBBBBBBOOOO       ',
    '   OOOOBBBBBBOOOO       ',
    '   OOOOBBBBBBOOOO       ',
    '   OOOOBBBBBBOOOO       ',
    '   OOOOBBBBBBOOOO       ',
    '   OOOOBB  BBOOOO       ',
    '   OOOOBB  BBOOOO       ',
    '   OOOOBB  BBOOOO       ',
    '   OOOOBB  BBOOOO       ',
    '   OOOOBB  BBOOOO       ',
    '   OOOOBB  BBOOOO       ',
    '   OOOOBB  BBOOOO       ',
    '    OOOO  OOOO          ',
    '    OOOO  OOOO          ',
    '    OOOO  OOOO          ',
    '    OOOO  OOOO          ',
    '    OOOO  OOOO          ',
    '    OOOO  OOOO          ',
];

// Доктор (коричневое пальто, галстук-бабочка, седые волосы, очки, трость)
const SPRITE_DOCTOR = [
    '        MMMM            ',
    '       MMMMMM           ',
    '      MMMMMMMM          ',
    '     MMMMMMMMMM         ',
    '    MMMMKKKKMMMM        ',
    '    MMMMKKKKMMMM        ',
    '   MMMMKKSSKKMMMM       ',
    '   MMMMKSSSSKMMMM       ',
    '   MMMMRRRRRRMMMM       ',
    '   MMMMRRRRRRMMMM       ',
    '   MMMMRRRRRRMMMM       ',
    '   MMMMRRRRRRMMMM       ',
    '   MMMMGG  GGMMMM       ',
    '   MMMMGG  GGMMMM       ',
    '   MMMMGGGGGGMMMM       ',
    '   MMMMGGGGGGMMMM       ',
    '   MMMMGGGGGGMMMM       ',
    '   MMMMGGGGGGMMMM       ',
    '   MMMMGGGGGGMMMM       ',
    '   MMMMGGGGGGMMMM       ',
    '   MMMMGGGGGGMMMM       ',
    '   MMMMGG  GGMMMM       ',
    '   MMMMGG  GGMMMM       ',
    '   MMMMGG  GGMMMM       ',
    '   MMMMGG  GGMMMM       ',
    '   MMMMGG  GGMMMM       ',
    '   MMMMGG  GGMMMM       ',
    '   MMMMGG  GGMMMM       ',
    '    MMMM  MMMM          ',
    '    MMMM  MMMM          ',
    '    MMMM  MMMM          ',
    '    MMMM  MMMM          ',
    '    MMMM  MMMM          ',
    '    MMMM  MMMM          ',
];

// Далёк (увеличенный, с антенной и синим глазом)
const SPRITE_DALEK = [
    '       GGGGGG           ',
    '      GGGGGGGG          ',
    '     GGGGGGGGGG         ',
    '    GGGGGBBBGGGG        ',
    '    GGGGGBBBGGGG        ',
    '    GGGGGGGGGGGG        ',
    '     GGGGGGGGGG         ',
    '     GGGGGGGGGG         ',
    '     GGGGGGGGGG         ',
    '     GGG  GGGGG         ',
    '     GGG  GGGGG         ',
    '     GGGGGGGGGG         ',
    '     GGGGGGGGGG         ',
    '     GGG  GGGGG         ',
    '     GGG  GGGGG         ',
    '     GGGGGGGGGG         ',
    '     GGGGGGGGGG         ',
    '     GGGGGGGGGG         ',
    '      GGGGGGGG          ',
    '      GGGGGGGG          ',
    '      GGGGGGGG          ',
    '       GGGGGG           ',
    '       GGGGGG           ',
    '        GGGG            ',
    '        GGGG            ',
    '        GGGG            ',
];

// ТАРДИС (синяя будка, крупная, с окнами и надписью)
const SPRITE_TARDIS = [
    '       BBBBBB           ',
    '      BBBBBBBB          ',
    '     BBBBBBBBBB         ',
    '    BBBBZZBBBBB         ',
    '    BBBBZZBBBBB         ',
    '   BBBBBBBBBBBB         ',
    '   BBBBBBBBBBBB         ',
    '   BBBBZZBBBBB          ',
    '   BBBBZZBBBBB          ',
    '   BBBBBBBBBBBB         ',
    '   BBBBBBBBBBBB         ',
    '   BBBBZZBBBBB          ',
    '   BBBBZZBBBBB          ',
    '   BBBBBBBBBBBB         ',
    '   BBBBBBBBBBBB         ',
    '   BBBBZZBBBBB          ',
    '   BBBBZZBBBBB          ',
    '   BBBBBBBBBBBB         ',
    '    BBBBBBBBBB          ',
    '    BBBBBBBBBB          ',
    '     BBBBBBBB           ',
    '     BBBBBBBB           ',
    '      BBBBBB            ',
    '      BBBBBB            ',
    '      BBBBBB            ',
];

// Звуковая отвёртка (крупная, серебристая, с синим свечением)
const SPRITE_SONIC = [
    '       CCCC             ',
    '      CCCCCC            ',
    '     CCCCCCCC           ',
    '    CCCVVVCCC           ',
    '    CCCVVVCCC           ',
    '    CCCVVVCCC           ',
    '    CCCVVVCCC           ',
    '    CCCVVVCCC           ',
    '    CCCVVVCCC           ',
    '    CCCVVVCCC           ',
    '    CCCVVVCCC           ',
    '    CCCVVVCCC           ',
    '     CCCCCCCC           ',
    '      CCCCCC            ',
    '       CCCC             ',
];

// ---------- ТЕНИ (полупрозрачные эллипсы) ----------
function drawShadow(x, y, scale) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.0)';
    ctx.shadowBlur = 0;
    const w = 20 * scale;
    const h = 8 * scale;
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.ellipse(x, y + 20 * scale, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.restore();
}

// ---------- ФУНКЦИЯ ОТРИСОВКИ СПРАЙТА С ПИКСЕЛЬНЫМ МАСШТАБИРОВАНИЕМ ----------
function drawSprite(sprite, x, y, scale = 1) {
    if (!sprite) return;
    const rows = sprite.length;
    const cols = sprite[0].length;
    // Размер пикселя подбираем так, чтобы спрайт вписывался в 48x48 с запасом
    const baseSize = 48 / Math.max(rows, cols) * 1.1;
    const pixelSize = baseSize * scale;
    const offsetX = - (cols * pixelSize) / 2;
    const offsetY = - (rows * pixelSize) / 2;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const ch = sprite[row][col];
            const color = COLORS[ch];
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

// ---------- ОТРИСОВКА С НОВЫМИ СПРАЙТАМИ И ТЕНЯМИ ----------
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

    // Рисуем объекты (спрайты + тени)
    const objects = map.objects;
    const spriteScale = 1.0; // общий масштаб
    for (let key in objects) {
        const obj = objects[key];
        const x = obj.x * TILE_SIZE + TILE_SIZE/2 - camera.x;
        const y = obj.y * TILE_SIZE + TILE_SIZE/2 - camera.y;
        if (x < -50 || x > canvas.width/scale + 50 || y < -50 || y > canvas.height/scale + 50) continue;

        // Тень
        drawShadow(x, y, spriteScale);

        let sprite = null;
        if (key === 'tardis') sprite = SPRITE_TARDIS;
        else if (key === 'doctor') sprite = SPRITE_DOCTOR;
        else if (key === 'dalek') sprite = SPRITE_DALEK;
        else if (key === 'sonic') sprite = SPRITE_SONIC;
        else if (key === 'advisor') sprite = SPRITE_DOCTOR;

        if (sprite) {
            drawSprite(sprite, x, y, spriteScale);
        } else {
            // fallback
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

    // Рисуем игрока (с тенью)
    const px = player.x - camera.x;
    const py = player.y - camera.y;
    drawShadow(px, py, 1.0);
    drawSprite(SPRITE_PLAYER, px, py, 1.0);

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
