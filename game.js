// game.js — ULTRA HD PIXEL ART

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

// ---------- МЕГА-ПАЛИТРА (30+ цветов) ----------
const C = {
    // Синие
    B0: '#0a2a4a', B1: '#1a4a7a', B2: '#2a6a9a', B3: '#4a8aba', B4: '#6aaada',
    // Коричневые
    M0: '#4a3a2a', M1: '#6a5a3a', M2: '#8a7a5a', M3: '#aa9a7a', M4: '#caba9a',
    // Серые
    G0: '#333333', G1: '#555555', G2: '#777777', G3: '#999999', G4: '#bbbbbb',
    // Телесные
    S0: '#d4b89a', S1: '#e8c9a0', S2: '#f5d6b8', S3: '#fae6d0',
    // Красные
    R0: '#661122', R1: '#aa2233', R2: '#cc4455', R3: '#ee6677',
    // Жёлтые/оранжевые
    O0: '#885522', O1: '#bb7733', O2: '#ddaa55', O3: '#ffcc77',
    // Зелёные
    N0: '#2a4a1a', N1: '#3a6a2a', N2: '#5a8a4a',
    // Другие
    W: '#ffffff', K: '#111111', X: '#000000',
    P: '#8844aa', C0: '#44aacc', Y: '#ffdd00',
    T: '#665544', Z: '#aaccee', E: '#dddddd',
    F: '#ffaa77', U: '#5a4a3a', V: '#7799aa',
    H: '#e8c9a0', D: '#0a2a4a',
};

// ---------- ГИГАНТСКИЕ СПРАЙТЫ (48x64 для персонажей) ----------
// Игрок - парень в синей куртке с рюкзаком, светлые волосы, джинсы
const SPRITE_PLAYER = [
    '            O1O1O1                ',
    '           O2O2O2O2               ',
    '          O3O3O3O3O3              ',
    '         O3O3O3O3O3O3             ',
    '        O3O3K0K0O3O3O3            ',
    '       O3O3K0K0O3O3O3O3           ',
    '      O3O3K0S2S2K0O3O3O3          ',
    '     O3O3K0S2S2K0O3O3O3O3         ',
    '    O3O3B2B2B2B2O3O3O3O3          ',
    '   O3O3B2B2B2B2O3O3O3O3O3         ',
    '  O3O3B2B2B2B2O3O3O3O3O3          ',
    ' O3O3B2B2B2B2O3O3O3O3O3           ',
    'O3O3B2B2B2B2O3O3O3O3O3            ',
    ' O3B2B2B2B2O3O3O3O3O3             ',
    '  O3B2B2B2B2O3O3O3O3              ',
    '   O3B2B2B2B2O3O3O3               ',
    '    O3B2B2B2B2O3O3                ',
    '     O3B2B2B2B2O3                 ',
    '      O3B2B2B2B2                  ',
    '       O3B2B2B2                   ',
    '        O3B2B2                    ',
    '         O3B2                     ',
    '          O3                      ',
    '         O3B2                     ',
    '        O3B2B2                    ',
    '       O3B2B2B2                   ',
    '      O3B2B2B2B2                  ',
    '     O3B2B2B2B2O3                 ',
    '    O3B2B2B2B2O3O3                ',
    '   O3B2B2B2B2O3O3O3               ',
    '  O3B2B2B2B2O3O3O3O3              ',
    ' O3B2B2B2B2O3O3O3O3O3             ',
    'O3B2B2B2B2O3O3O3O3O3              ',
    ' O3B2B2B2B2O3O3O3O3               ',
    '  O3B2B2B2B2O3O3O3                ',
    '   O3B2B2B2B2O3O3                 ',
    '    O3B2B2B2B2O3                  ',
    '     O3B2B2B2B2                   ',
    '      O3B2B2B2                    ',
    '       O3B2B2                     ',
    '        O3B2                      ',
    '         O3                       ',
    '        O3B2                      ',
    '       O3B2B2                     ',
    '      O3B2B2B2                    ',
    '     O3B2B2B2B2                   ',
    '    O3B2B2B2B2O3                  ',
    '   O3B2B2B2B2O3O3                 ',
    '  O3B2B2B2B2O3O3O3                ',
    ' O3B2B2B2B2O3O3O3O3               ',
    'O3B2B2B2B2O3O3O3O3O3              ',
    ' O3B2B2B2B2O3O3O3O3               ',
    '  O3B2B2B2B2O3O3O3                ',
    '   O3B2B2B2B2O3O3                 ',
    '    O3B2B2B2B2O3                  ',
    '     O3B2B2B2B2                   ',
    '      O3B2B2B2                    ',
    '       O3B2B2                     ',
    '        O3B2                      ',
    '         O3                       ',
    '        O3B2                      ',
    '       O3B2B2                     ',
    '      O3B2B2B2                    ',
    '     O3B2B2B2B2                   ',
    '    O3B2B2B2B2O3                  ',
];

// Доктор - в коричневом пальто, галстук-бабочка, седые волосы, очки
const SPRITE_DOCTOR = [
    '            M1M1M1                ',
    '           M2M2M2M2               ',
    '          M3M3M3M3M3              ',
    '         M3M3K0K0M3M3             ',
    '        M3M3K0K0M3M3M3            ',
    '       M3M3K0S2S2K0M3M3           ',
    '      M3M3K0S2S2K0M3M3M3          ',
    '     M3M3R1R1R1R1M3M3M3           ',
    '    M3M3R1R1R1R1M3M3M3            ',
    '   M3M3R1R1R1R1M3M3M3             ',
    '  M3M3R1R1R1R1M3M3M3              ',
    ' M3M3R1R1R1R1M3M3M3               ',
    'M3M3R1R1R1R1M3M3M3                ',
    ' M3R1R1R1R1M3M3M3                 ',
    '  M3R1R1R1R1M3M3                  ',
    '   M3R1R1R1R1M3                   ',
    '    M3R1R1R1R1                    ',
    '     M3R1R1R1                     ',
    '      M3R1R1                      ',
    '       M3R1                       ',
    '        M3                        ',
    '       M3R1                       ',
    '      M3R1R1                      ',
    '     M3R1R1R1                     ',
    '    M3R1R1R1R1                    ',
    '   M3R1R1R1R1M3                   ',
    '  M3R1R1R1R1M3M3                  ',
    ' M3R1R1R1R1M3M3M3                 ',
    'M3R1R1R1R1M3M3M3                  ',
    ' M3R1R1R1R1M3M3M3                 ',
    '  M3R1R1R1R1M3M3                  ',
    '   M3R1R1R1R1M3                   ',
    '    M3R1R1R1R1                    ',
    '     M3R1R1R1                     ',
    '      M3R1R1                      ',
    '       M3R1                       ',
    '        M3                        ',
    '       M3R1                       ',
    '      M3R1R1                      ',
    '     M3R1R1R1                     ',
    '    M3R1R1R1R1                    ',
    '   M3R1R1R1R1M3                   ',
    '  M3R1R1R1R1M3M3                  ',
    ' M3R1R1R1R1M3M3M3                 ',
    'M3R1R1R1R1M3M3M3                  ',
    ' M3R1R1R1R1M3M3M3                 ',
    '  M3R1R1R1R1M3M3                  ',
    '   M3R1R1R1R1M3                   ',
    '    M3R1R1R1R1                    ',
    '     M3R1R1R1                     ',
    '      M3R1R1                      ',
    '       M3R1                       ',
    '        M3                        ',
    '       M3R1                       ',
    '      M3R1R1                      ',
    '     M3R1R1R1                     ',
    '    M3R1R1R1R1                    ',
    '   M3R1R1R1R1M3                   ',
    '  M3R1R1R1R1M3M3                  ',
    ' M3R1R1R1R1M3M3M3                 ',
    'M3R1R1R1R1M3M3M3                  ',
    ' M3R1R1R1R1M3M3M3                 ',
    '  M3R1R1R1R1M3M3                  ',
    '   M3R1R1R1R1M3                   ',
    '    M3R1R1R1R1                    ',
    '     M3R1R1R1                     ',
    '      M3R1R1                      ',
    '       M3R1                       ',
    '        M3                        ',
];

// Далёк - большой серый баклажан с синим глазом
const SPRITE_DALEK = [
    '          G2G2G2                  ',
    '         G3G3G3G3                 ',
    '        G3G3G3G3G3                ',
    '       G3G3B2B2G3G3               ',
    '      G3G3B2B2G3G3G3              ',
    '     G3G3B2B2G3G3G3G3             ',
    '    G3G3B2B2G3G3G3G3G3            ',
    '   G3G3B2B2G3G3G3G3G3             ',
    '  G3G3B2B2G3G3G3G3G3              ',
    ' G3G3B2B2G3G3G3G3G3               ',
    'G3G3B2B2G3G3G3G3G3                ',
    ' G3B2B2G3G3G3G3G3                 ',
    '  G3B2B2G3G3G3G3                  ',
    '   G3B2B2G3G3G3                   ',
    '    G3B2B2G3G3                    ',
    '     G3B2B2G3                     ',
    '      G3B2B2                      ',
    '       G3B2                       ',
    '        G3                        ',
    '       G3B2                       ',
    '      G3B2B2                      ',
    '     G3B2B2G3                     ',
    '    G3B2B2G3G3                    ',
    '   G3B2B2G3G3G3                   ',
    '  G3B2B2G3G3G3G3                  ',
    ' G3B2B2G3G3G3G3G3                 ',
    'G3B2B2G3G3G3G3G3                  ',
    ' G3B2B2G3G3G3G3G3                 ',
    '  G3B2B2G3G3G3G3G3                ',
    '   G3B2B2G3G3G3G3G3               ',
    '    G3B2B2G3G3G3G3G3              ',
    '     G3B2B2G3G3G3G3G3             ',
    '      G3B2B2G3G3G3G3G3            ',
    '       G3B2B2G3G3G3G3G3           ',
    '        G3B2B2G3G3G3G3G3          ',
    '         G3B2B2G3G3G3G3G3         ',
    '          G3B2B2G3G3G3G3G3        ',
    '           G3B2B2G3G3G3G3G3       ',
    '            G3B2B2G3G3G3G3G3      ',
    '             G3B2B2G3G3G3G3G3     ',
    '              G3B2B2G3G3G3G3G3    ',
    '               G3B2B2G3G3G3G3G3   ',
    '                G3B2B2G3G3G3G3G3  ',
    '                 G3B2B2G3G3G3G3G3 ',
    '                  G3B2B2G3G3G3G3G3',
];

// ТАРДИС - синяя будка с окнами и фонарём
const SPRITE_TARDIS = [
    '          B2B2B2                 ',
    '         B3B3B3B3                ',
    '        B3B3B3B3B3               ',
    '       B3B3Z0Z0B3B3              ',
    '      B3B3Z0Z0B3B3B3             ',
    '     B3B3Z0Z0B3B3B3B3            ',
    '    B3B3Z0Z0B3B3B3B3B3           ',
    '   B3B3Z0Z0B3B3B3B3B3B3          ',
    '  B3B3Z0Z0B3B3B3B3B3B3           ',
    ' B3B3Z0Z0B3B3B3B3B3B3            ',
    'B3B3Z0Z0B3B3B3B3B3B3             ',
    ' B3Z0Z0B3B3B3B3B3B3              ',
    '  B3Z0Z0B3B3B3B3B3               ',
    '   B3Z0Z0B3B3B3B3                ',
    '    B3Z0Z0B3B3B3                 ',
    '     B3Z0Z0B3B3                  ',
    '      B3Z0Z0B3                   ',
    '       B3Z0Z0                    ',
    '        B3Z0                     ',
    '         B3                      ',
    '        B3Z0                     ',
    '       B3Z0Z0                    ',
    '      B3Z0Z0B3                   ',
    '     B3Z0Z0B3B3                  ',
    '    B3Z0Z0B3B3B3                 ',
    '   B3Z0Z0B3B3B3B3                ',
    '  B3Z0Z0B3B3B3B3B3               ',
    ' B3Z0Z0B3B3B3B3B3B3              ',
    'B3Z0Z0B3B3B3B3B3B3               ',
    ' B3Z0Z0B3B3B3B3B3B3              ',
    '  B3Z0Z0B3B3B3B3B3B3             ',
    '   B3Z0Z0B3B3B3B3B3B3            ',
    '    B3Z0Z0B3B3B3B3B3B3           ',
    '     B3Z0Z0B3B3B3B3B3B3          ',
    '      B3Z0Z0B3B3B3B3B3B3         ',
    '       B3Z0Z0B3B3B3B3B3B3        ',
    '        B3Z0Z0B3B3B3B3B3B3       ',
    '         B3Z0Z0B3B3B3B3B3B3      ',
    '          B3Z0Z0B3B3B3B3B3B3     ',
    '           B3Z0Z0B3B3B3B3B3B3    ',
    '            B3Z0Z0B3B3B3B3B3B3   ',
    '             B3Z0Z0B3B3B3B3B3B3  ',
    '              B3Z0Z0B3B3B3B3B3B3 ',
    '               B3Z0Z0B3B3B3B3B3B3',
];

// Звуковая отвёртка (серебристая с синим свечением)
const SPRITE_SONIC = [
    '          C0C0                   ',
    '         C0C0C0                  ',
    '        C0C0C0C0                 ',
    '       C0G3G3C0                  ',
    '      C0G3G3G3C0                 ',
    '     C0G3G3G3G3C0                ',
    '    C0G3G3G3G3G3C0               ',
    '   C0G3G3G3G3G3G3C0              ',
    '  C0G3G3G3G3G3G3G3C0             ',
    ' C0G3G3G3G3G3G3G3G3C0            ',
    'C0G3G3G3G3G3G3G3G3G3C0           ',
    ' C0G3G3G3G3G3G3G3G3C0            ',
    '  C0G3G3G3G3G3G3G3C0             ',
    '   C0G3G3G3G3G3G3C0              ',
    '    C0G3G3G3G3G3C0               ',
    '     C0G3G3G3G3C0                ',
    '      C0G3G3G3C0                 ',
    '       C0G3G3C0                  ',
    '        C0G3C0                   ',
    '         C0C0                    ',
];

// ---------- ТЕНИ (полупрозрачные эллипсы) ----------
function drawShadow(x, y, scale) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.0)';
    ctx.shadowBlur = 0;
    const w = 24 * scale;
    const h = 10 * scale;
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.ellipse(x, y + 24 * scale, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.restore();
}

// ---------- ОТРИСОВКА СПРАЙТА С МАСШТАБИРОВАНИЕМ ----------
function drawSprite(sprite, x, y, scale = 1) {
    if (!sprite) return;
    const rows = sprite.length;
    const cols = sprite[0].length;
    // Делаем пиксели крупными, чтобы спрайт занимал почти весь тайл и даже больше
    const baseSize = 50 / Math.max(rows, cols) * 1.3;
    const pixelSize = baseSize * scale;
    const offsetX = - (cols * pixelSize) / 2;
    const offsetY = - (rows * pixelSize) / 2;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const ch = sprite[row][col];
            // Обработка составных цветов (например, B2, G3)
            let color = null;
            if (ch === ' ') continue;
            if (ch.length === 2) {
                const base = ch[0];
                const num = parseInt(ch[1]);
                if (base === 'B') color = [C.B0, C.B1, C.B2, C.B3, C.B4][num] || C.B0;
                else if (base === 'M') color = [C.M0, C.M1, C.M2, C.M3, C.M4][num] || C.M0;
                else if (base === 'G') color = [C.G0, C.G1, C.G2, C.G3, C.G4][num] || C.G0;
                else if (base === 'S') color = [C.S0, C.S1, C.S2, C.S3][num] || C.S0;
                else if (base === 'R') color = [C.R0, C.R1, C.R2, C.R3][num] || C.R0;
                else if (base === 'O') color = [C.O0, C.O1, C.O2, C.O3][num] || C.O0;
                else if (base === 'N') color = [C.N0, C.N1, C.N2][num] || C.N0;
                else if (base === 'Z') color = C.Z;
                else if (base === 'K') color = C.K;
                else if (base === 'W') color = C.W;
                else if (base === 'X') color = C.X;
                else if (base === 'P') color = C.P;
                else if (base === 'C' && num === 0) color = C.C0;
                else if (base === 'Y') color = C.Y;
                else if (base === 'T') color = C.T;
                else if (base === 'E') color = C.E;
                else if (base === 'F') color = C.F;
                else if (base === 'U') color = C.U;
                else if (base === 'V') color = C.V;
                else if (base === 'H') color = C.H;
                else if (base === 'D') color = C.D;
                else color = C.W;
            } else {
                // Одиночные символы (K, W, X и т.д.)
                if (ch === 'K') color = C.K;
                else if (ch === 'W') color = C.W;
                else if (ch === 'X') color = C.X;
                else if (ch === 'P') color = C.P;
                else if (ch === 'Y') color = C.Y;
                else if (ch === 'Z') color = C.Z;
                else if (ch === 'E') color = C.E;
                else if (ch === 'F') color = C.F;
                else if (ch === 'U') color = C.U;
                else if (ch === 'V') color = C.V;
                else if (ch === 'H') color = C.H;
                else if (ch === 'D') color = C.D;
                else if (ch === 'T') color = C.T;
                else if (ch === 'C') color = C.C0;
                else color = C.W;
            }
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
    const spriteScale = 1.2; // увеличенный масштаб
    for (let key in objects) {
        const obj = objects[key];
        const x = obj.x * TILE_SIZE + TILE_SIZE/2 - camera.x;
        const y = obj.y * TILE_SIZE + TILE_SIZE/2 - camera.y;
        if (x < -60 || x > canvas.width/scale + 60 || y < -60 || y > canvas.height/scale + 60) continue;

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

    // Игрок
    const px = player.x - camera.x;
    const py = player.y - camera.y;
    drawShadow(px, py, 1.2);
    drawSprite(SPRITE_PLAYER, px, py, 1.2);

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
