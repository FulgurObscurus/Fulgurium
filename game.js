// game.js — с анимациями, покемоном, способностью MK

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

// ---------- РАЗМЕР ПОЛНОЭКРАННЫЙ ----------
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

// ---------- ДАННЫЕ ПОКЕМОНОВ ----------
const pokemonData = {
    'Бульбазавр': { type: 'Трава', color: '#3a8a3a', attack: 'Семенной луч' },
    'Чармандер': { type: 'Огонь', color: '#cc5533', attack: 'Огненный хвост' },
    'Сквиртл': { type: 'Вода', color: '#3a8aba', attack: 'Водяная пушка' },
    'Пикачу': { type: 'Электричество', color: '#ffcc00', attack: 'Удар молнии' },
    'Иви': { type: 'Нормальный', color: '#bb9966', attack: 'Быстрый удар' },
    'Драттини': { type: 'Дракон', color: '#6a8aba', attack: 'Драконья ярость' },
    'Лавита': { type: 'Камень', color: '#8a8a6a', attack: 'Каменный удар' },
    'Риолу': { type: 'Боевой', color: '#4a6a8a', attack: 'Удар волной' },
    'Гибли': { type: 'Тёмный', color: '#6a4a6a', attack: 'Тёмный клинок' },
    'Зоруа': { type: 'Тёмный', color: '#4a4a6a', attack: 'Теневой шар' },
};

// ---------- СПИСОК СПОСОБНОСТЕЙ MK ----------
const mkAbilities = {
    'Ледяные шары': { desc: 'Замораживает врагов на 2 секунды', color: '#44aacc' },
    'Огненный шар': { desc: 'Наносит 30 ед. урона', color: '#cc5533' },
    'Телепортация': { desc: 'Мгновенный рывок в направлении движения', color: '#9966cc' },
    'Теневой удар': { desc: 'Оглушает врага на 1.5 сек', color: '#6644aa' },
    'Молния': { desc: 'Парализует врага', color: '#ffdd44' },
    'Исцеление': { desc: 'Восстанавливает 25 HP', color: '#44cc66' },
    'Землетрясение': { desc: 'АОЕ урон по всем врагам рядом', color: '#aa8844' },
    'Щит': { desc: 'Блокирует следующую атаку', color: '#44aacc' },
    'Ядовитое облако': { desc: 'Отравление на 5 сек (10 урона/сек)', color: '#66aa44' },
    'Клон': { desc: 'Создаёт копию, отвлекающую врага', color: '#8888aa' },
};

// ---------- КАРТА ----------
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
    inventory: [],
    // Данные персонажа
    name: 'Искатель',
    color: '#2a6a9a',
    pokemon: 'Пикачу',
    mkAbility: 'Огненный шар',
    hp: 100,
    maxHp: 100,
};

let camera = { x: 0, y: 0 };
let dialogActive = false;
let dialogText = '';

// Анимация
let frame = 0;
let frameCounter = 0;
const FRAME_DELAY = 6;
let direction = 'down'; // 'up', 'down', 'left', 'right'
let moving = false;

// Джойстик
let joystickActive = false;
let joystickDir = { x: 0, y: 0 };
let keys = {};

// Вспомогательные объекты на карте
let companion = null; // покемон-компаньон (будет следовать)

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
        dialogText = 'Доктор: "Привет! Я Доктор. Твой покемон силён! Используй способность MK по клавише Q!"';
        dialogActive = true;
        setTimeout(() => { dialogActive = false; dialogText = ''; }, 3000);
        return;
    }

    if (obj.key === 'dalek') {
        dialogText = 'Далёк атакует! Используй способность! (Нажми Q)';
        dialogActive = true;
        setTimeout(() => { dialogActive = false; dialogText = ''; }, 2000);
        return;
    }

    dialogText = `Вы взаимодействуете с ${obj.label}.`;
    dialogActive = true;
    setTimeout(() => { dialogActive = false; dialogText = ''; }, 1500);
}

// ---------- ИСПОЛЬЗОВАНИЕ СПОСОБНОСТИ MK ----------
function useAbility() {
    if (dialogActive) return;
    const abilityName = player.mkAbility;
    const ability = mkAbilities[abilityName];
    if (!ability) return;
    dialogText = `💥 ${abilityName}: ${ability.desc}`;
    dialogActive = true;
    setTimeout(() => { dialogActive = false; dialogText = ''; }, 2000);
    // Здесь можно добавить эффекты (урон, замедление и т.п.)
    // Пока просто диалог
}

// ---------- КЛАВИАТУРА ----------
document.addEventListener('keydown', (e) => {
    const code = e.code;
    if (code === 'KeyW' || code === 'KeyA' || code === 'KeyS' || code === 'KeyD' ||
        code === 'ArrowUp' || code === 'ArrowDown' || code === 'ArrowLeft' || code === 'ArrowRight' ||
        code === 'KeyE' || code === 'KeyQ') {
        e.preventDefault();
    }
    keys[code] = true;
    if (code === 'KeyE') {
        interact();
    }
    if (code === 'KeyQ') {
        useAbility();
    }
});
document.addEventListener('keyup', (e) => {
    const code = e.code;
    if (code === 'KeyW' || code === 'KeyA' || code === 'KeyS' || code === 'KeyD' ||
        code === 'ArrowUp' || code === 'ArrowDown' || code === 'ArrowLeft' || code === 'ArrowRight' ||
        code === 'KeyE' || code === 'KeyQ') {
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

// ---------- ОБНОВЛЕНИЕ ИГРОКА ----------
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

    moving = (dx !== 0 || dy !== 0);
    if (moving) {
        // определяем направление
        if (Math.abs(dx) > Math.abs(dy)) {
            direction = dx > 0 ? 'right' : 'left';
        } else {
            direction = dy > 0 ? 'down' : 'up';
        }
        // анимация
        frameCounter++;
        if (frameCounter >= FRAME_DELAY) {
            frameCounter = 0;
            frame = (frame + 1) % 4; // 4 кадра
        }
    } else {
        frame = 0;
        frameCounter = 0;
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

    // Компаньон следует за игроком (упрощённо)
    if (companion) {
        const followDist = 40;
        const dxc = player.x - companion.x;
        const dyc = player.y - companion.y;
        const dist = Math.hypot(dxc, dyc);
        if (dist > followDist) {
            companion.x += dxc / dist * 1.5;
            companion.y += dyc / dist * 1.5;
        }
    }
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

// ---------- РИСОВАНИЕ ПЕРСОНАЖА С АНИМАЦИЕЙ ----------
function drawPlayer(x, y) {
    const s = 2.0;
    // Тень
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.ellipse(x, y + 18*s, 18*s, 6*s, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();
    ctx.restore();

    // Голова
    ctx.fillStyle = '#f7d9aa';
    ctx.beginPath();
    ctx.arc(x, y - 14*s, 11*s, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5*s;
    ctx.stroke();

    // Волосы (оранжевые)
    ctx.fillStyle = '#ddaa55';
    ctx.beginPath();
    ctx.arc(x, y - 16*s, 11*s, -Math.PI, 0);
    ctx.fill();

    // Глаза
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(x - 4*s, y - 14*s, 2*s, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 4*s, y - 14*s, 2*s, 0, Math.PI*2);
    ctx.fill();

    // Тело (куртка с выбранным цветом)
    ctx.fillStyle = player.color;
    ctx.fillRect(x - 14*s, y - 4*s, 28*s, 18*s);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5*s;
    ctx.strokeRect(x - 14*s, y - 4*s, 28*s, 18*s);

    // Пуговицы
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(x, y + 2*s, 1.5*s, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y + 8*s, 1.5*s, 0, Math.PI*2);
    ctx.fill();

    // Руки (с анимацией)
    const armOffset = moving ? Math.sin(frame * Math.PI/2) * 2 * s : 0;
    ctx.fillStyle = player.color;
    ctx.fillRect(x - 20*s, y - 2*s + armOffset, 6*s, 14*s);
    ctx.fillRect(x + 14*s, y - 2*s - armOffset, 6*s, 14*s);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5*s;
    ctx.strokeRect(x - 20*s, y - 2*s + armOffset, 6*s, 14*s);
    ctx.strokeRect(x + 14*s, y - 2*s - armOffset, 6*s, 14*s);

    // Ноги (с анимацией)
    const legOffset = moving ? Math.sin(frame * Math.PI/2 + 1) * 3 * s : 0;
    ctx.fillStyle = '#3a6a8a';
    ctx.fillRect(x - 12*s, y + 14*s + legOffset, 8*s, 12*s);
    ctx.fillRect(x + 4*s, y + 14*s - legOffset, 8*s, 12*s);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5*s;
    ctx.strokeRect(x - 12*s, y + 14*s + legOffset, 8*s, 12*s);
    ctx.strokeRect(x + 4*s, y + 14*s - legOffset, 8*s, 12*s);

    // Обувь
    ctx.fillStyle = '#5a3a2a';
    ctx.fillRect(x - 13*s, y + 26*s + legOffset, 10*s, 4*s);
    ctx.fillRect(x + 3*s, y + 26*s - legOffset, 10*s, 4*s);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1*s;
    ctx.strokeRect(x - 13*s, y + 26*s + legOffset, 10*s, 4*s);
    ctx.strokeRect(x + 3*s, y + 26*s - legOffset, 10*s, 4*s);

    // Имя над головой
    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(player.name, x, y - 26*s);
}

// ---------- РИСОВАНИЕ ПОКЕМОНА-КОМПАНЬОНА ----------
function drawPokemon(x, y) {
    const s = 1.5;
    const pkmn = pokemonData[player.pokemon];
    if (!pkmn) return;
    // Тень
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(x, y + 10*s, 12*s, 4*s, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fill();
    ctx.restore();

    // Тело (круг)
    ctx.fillStyle = pkmn.color;
    ctx.beginPath();
    ctx.arc(x, y, 12*s, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5*s;
    ctx.stroke();
    // Глаза
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x - 4*s, y - 3*s, 3*s, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 4*s, y - 3*s, 3*s, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(x - 3*s, y - 2*s, 1.5*s, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 5*s, y - 2*s, 1.5*s, 0, Math.PI*2);
    ctx.fill();
    // Имя покемона
    ctx.fillStyle = '#fff';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(player.pokemon, x, y - 16*s);
}

// ---------- РИСОВАНИЕ ОБЪЕКТОВ (ТАРДИС, ДОКТОР, ДАЛЁК) ----------
function drawTardis(x, y) {
    const s = 2.0;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(x, y + 16*s, 18*s, 6*s, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#1a4a7a';
    ctx.fillRect(x - 18*s, y - 22*s, 36*s, 36*s);
    ctx.strokeStyle = '#0a2a4a';
    ctx.lineWidth = 2*s;
    ctx.strokeRect(x - 18*s, y - 22*s, 36*s, 36*s);
    ctx.fillStyle = '#aaccee';
    ctx.fillRect(x - 12*s, y - 16*s, 8*s, 10*s);
    ctx.fillRect(x + 4*s, y - 16*s, 8*s, 10*s);
    ctx.fillRect(x - 12*s, y + 2*s, 8*s, 10*s);
    ctx.fillRect(x + 4*s, y + 2*s, 8*s, 10*s);
    ctx.strokeStyle = '#0a2a4a';
    ctx.lineWidth = 1.5*s;
    ctx.strokeRect(x - 12*s, y - 16*s, 8*s, 10*s);
    ctx.strokeRect(x + 4*s, y - 16*s, 8*s, 10*s);
    ctx.strokeRect(x - 12*s, y + 2*s, 8*s, 10*s);
    ctx.strokeRect(x + 4*s, y + 2*s, 8*s, 10*s);
    ctx.fillStyle = '#0a2a4a';
    ctx.fillRect(x - 20*s, y - 26*s, 40*s, 6*s);
    ctx.fillStyle = '#44aacc';
    ctx.beginPath();
    ctx.arc(x, y - 28*s, 5*s, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5*s;
    ctx.stroke();
}

function drawDoctor(x, y) {
    const s = 2.0;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(x, y + 18*s, 18*s, 6*s, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#f7d9aa';
    ctx.beginPath();
    ctx.arc(x, y - 14*s, 12*s, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5*s;
    ctx.stroke();
    ctx.fillStyle = '#ddd';
    ctx.beginPath();
    ctx.arc(x, y - 16*s, 12*s, -Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1.5*s;
    ctx.beginPath();
    ctx.arc(x - 5*s, y - 13*s, 4*s, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 5*s, y - 13*s, 4*s, 0, Math.PI*2);
    ctx.stroke();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(x - 4*s, y - 13*s, 1.5*s, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 6*s, y - 13*s, 1.5*s, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#8b6a4a';
    ctx.fillRect(x - 16*s, y - 4*s, 32*s, 20*s);
    ctx.strokeStyle = '#5a4a3a';
    ctx.lineWidth = 1.5*s;
    ctx.strokeRect(x - 16*s, y - 4*s, 32*s, 20*s);
    ctx.fillStyle = '#cc3333';
    ctx.beginPath();
    ctx.moveTo(x - 6*s, y - 2*s);
    ctx.quadraticCurveTo(x, y - 6*s, x + 6*s, y - 2*s);
    ctx.quadraticCurveTo(x, y, x - 6*s, y - 2*s);
    ctx.fill();
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(x, y + 4*s, 2*s, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y + 10*s, 2*s, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(x - 12*s, y + 16*s, 8*s, 12*s);
    ctx.fillRect(x + 4*s, y + 16*s, 8*s, 12*s);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5*s;
    ctx.strokeRect(x - 12*s, y + 16*s, 8*s, 12*s);
    ctx.strokeRect(x + 4*s, y + 16*s, 8*s, 12*s);
    ctx.fillStyle = '#333';
    ctx.fillRect(x - 13*s, y + 28*s, 10*s, 4*s);
    ctx.fillRect(x + 3*s, y + 28*s, 10*s, 4*s);
}

function drawDalek(x, y) {
    const s = 2.0;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(x, y + 18*s, 16*s, 6*s, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#999';
    ctx.beginPath();
    ctx.moveTo(x - 16*s, y + 4*s);
    ctx.quadraticCurveTo(x - 20*s, y - 10*s, x - 12*s, y - 18*s);
    ctx.quadraticCurveTo(x, y - 24*s, x + 12*s, y - 18*s);
    ctx.quadraticCurveTo(x + 20*s, y - 10*s, x + 16*s, y + 4*s);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1.5*s;
    ctx.stroke();
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
    ctx.fillStyle = '#44aacc';
    ctx.beginPath();
    ctx.arc(x, y - 12*s, 6*s, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5*s;
    ctx.stroke();
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.moveTo(x - 18*s, y + 4*s);
    ctx.lineTo(x - 20*s, y + 10*s);
    ctx.lineTo(x + 20*s, y + 10*s);
    ctx.lineTo(x + 18*s, y + 4*s);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1.5*s;
    ctx.stroke();
    ctx.fillStyle = '#777';
    ctx.beginPath();
    ctx.arc(x - 8*s, y + 12*s, 5*s, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 8*s, y + 12*s, 5*s, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1.5*s;
    ctx.stroke();
}

// ---------- ОСНОВНОЙ ЦИКЛ ОТРИСОВКИ ----------
function draw() {
    const scale = canvas._scale || 1;
    ctx.save();
    ctx.scale(scale, scale);

    ctx.clearRect(-camera.x, -camera.y, MAP_WIDTH, MAP_HEIGHT);

    const map = getMap();
    // Тайлы
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

    // Объекты
    const objects = map.objects;
    for (let key in objects) {
        const obj = objects[key];
        const x = obj.x * TILE_SIZE + TILE_SIZE/2 - camera.x;
        const y = obj.y * TILE_SIZE + TILE_SIZE/2 - camera.y;
        if (x < -40 || x > canvas.width/scale + 40 || y < -40 || y > canvas.height/scale + 40) continue;
        const type = obj.type || key;
        switch (type) {
            case 'tardis': drawTardis(x, y); break;
            case 'dalek': drawDalek(x, y); break;
            case 'doctor': drawDoctor(x, y); break;
            default: drawDoctor(x, y); break;
        }
    }

    // Компаньон-покемон
    if (companion) {
        const cx = companion.x - camera.x;
        const cy = companion.y - camera.y;
        drawPokemon(cx, cy);
    }

    // Игрок
    drawPlayer(player.x - camera.x, player.y - camera.y);

    // Диалог
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

    // Инвентарь и способность
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(canvas.width/scale - 220, 10, 210, 50);
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const invText = `🎒 ${player.inventory.length ? player.inventory.join(', ') : 'пусто'}`;
    ctx.fillText(invText, canvas.width/scale - 210, 25);
    ctx.fillStyle = '#ffcc00';
    ctx.font = '12px monospace';
    ctx.fillText(`⚡${player.mkAbility} (Q)`, canvas.width/scale - 210, 45);

    ctx.restore();
}

// ---------- ИГРОВОЙ ЦИКЛ ----------
function gameLoop() {
    updatePlayer();
    updateCamera();
    draw();
    requestAnimationFrame(gameLoop);
}

// ---------- ЭКРАН СОЗДАНИЯ ПЕРСОНАЖА ----------
function setupCreationScreen() {
    const screen = document.getElementById('creation-screen');
    const nameInput = document.getElementById('player-name');
    const colorBtns = document.querySelectorAll('#color-options button');
    const pokemonSelect = document.getElementById('starter-pokemon');
    const abilitySelect = document.getElementById('mk-ability');
    const abilityDesc = document.getElementById('ability-desc');
    const startBtn = document.getElementById('start-game-btn');

    // Цвет
    let selectedColor = '#2a6a9a';
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedColor = btn.dataset.color;
        });
    });

    // Описание способности
    function updateAbilityDesc() {
        const val = abilitySelect.value;
        const ab = mkAbilities[val];
        if (ab) abilityDesc.textContent = ab.desc;
    }
    abilitySelect.addEventListener('change', updateAbilityDesc);
    updateAbilityDesc();

    // Кнопка старта
    startBtn.addEventListener('click', () => {
        const name = nameInput.value.trim() || 'Искатель';
        const pokemon = pokemonSelect.value;
        const ability = abilitySelect.value;
        // Сохраняем в player
        player.name = name;
        player.color = selectedColor;
        player.pokemon = pokemon;
        player.mkAbility = ability;
        // Создаём компаньона
        companion = {
            x: player.x - TILE_SIZE,
            y: player.y,
        };
        // Скрываем экран
        screen.style.display = 'none';
        // Запускаем игру
        gameLoop();
    });
}

// Запуск после загрузки страницы
window.onload = function() {
    setupCreationScreen();
    // Начальное позиционирование компаньона
    companion = {
        x: player.x - TILE_SIZE,
        y: player.y,
    };
};
