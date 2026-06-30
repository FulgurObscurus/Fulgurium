// game.js

// ---------- Данные комнат ----------
const rooms = {
    "лес": {
        описание: "Вы в тёмном лесу. Слышно уханье совы. Видны две тропы: на север и на восток.",
        выходы: { "север": "поляна", "восток": "хижина" },
        предметы: []
    },
    "поляна": {
        описание: "Солнечная поляна, посреди которой лежит старый меч.",
        выходы: { "юг": "лес", "восток": "озеро" },
        предметы: ["меч"]
    },
    "хижина": {
        описание: "Маленькая хижина. На стене висит ключ, а на столе лежит записка.",
        выходы: { "запад": "лес" },
        предметы: ["ключ", "записка"]
    },
    "озеро": {
        описание: "Берег озера. Вода прозрачная, видно дно.",
        выходы: { "запад": "поляна" },
        предметы: []
    }
};

// ---------- Состояние игрока ----------
const player = {
    currentRoom: "лес",
    inventory: []
};

// ---------- DOM-элементы ----------
const roomDescEl = document.getElementById("room-description");
const messagesEl = document.getElementById("game-messages");
const inputEl = document.getElementById("command-input");
const sendBtn = document.getElementById("send-btn");
const inventoryDisplay = document.getElementById("inventory-display");

// ---------- Вспомогательные функции ----------
function updateUI() {
    const room = rooms[player.currentRoom];
    roomDescEl.innerHTML = `
        <strong>📍 ${player.currentRoom.toUpperCase()}</strong><br>
        ${room.описание}<br>
        ${room.предметы.length ? `<span class="highlight">📦 Здесь: ${room.предметы.join(", ")}</span>` : ""}
        <br><span style="color:#888;">🚪 Выходы: ${Object.keys(room.выходы).join(", ")}</span>
    `;

    // Обновляем инвентарь
    if (player.inventory.length === 0) {
        inventoryDisplay.textContent = "🎒 Инвентарь: пусто";
    } else {
        inventoryDisplay.textContent = `🎒 Инвентарь: ${player.inventory.join(", ")}`;
    }

    // Прокручиваем вывод вниз
    const output = document.getElementById("output");
    output.scrollTop = output.scrollHeight;
}

function addMessage(text, type = "") {
    const msg = document.createElement("div");
    msg.textContent = text;
    if (type) msg.className = type;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function clearMessages() {
    messagesEl.innerHTML = "";
}

// ---------- Игровая логика ----------
function processCommand(command) {
    command = command.trim().toLowerCase();
    if (!command) return;

    addMessage(`> ${command}`, "highlight");

    // Команда: выход
    if (command === "выход") {
        addMessage("До свидания!", "error");
        setTimeout(() => {
            document.body.innerHTML = "<h1 style='text-align:center;margin-top:50px;'>Игра завершена</h1>";
        }, 500);
        return;
    }

    // Команда: осмотреться
    if (command === "осмотреться") {
        updateUI();
        return;
    }

    // Команда: инвентарь
    if (command === "инвентарь") {
        if (player.inventory.length === 0) {
            addMessage("У вас ничего нет.", "error");
        } else {
            addMessage(`Ваш инвентарь: ${player.inventory.join(", ")}`);
        }
        return;
    }

    // Команда: идти [направление]
    if (command.startsWith("идти ")) {
        const direction = command.substring(5);
        const room = rooms[player.currentRoom];
        if (room.выходы[direction]) {
            player.currentRoom = room.выходы[direction];
            clearMessages();
            addMessage(`Вы пошли на ${direction}.`);
            updateUI();
        } else {
            addMessage(`Туда нельзя пойти.`, "error");
        }
        return;
    }

    // Команда: взять [предмет]
    if (command.startsWith("взять ")) {
        const item = command.substring(6);
        const room = rooms[player.currentRoom];
        const index = room.предметы.indexOf(item);
        if (index !== -1) {
            room.предметы.splice(index, 1);
            player.inventory.push(item);
            clearMessages();
            addMessage(`Вы взяли ${item}.`, "success");
            updateUI();
        } else {
            addMessage(`Здесь нет такого предмета.`, "error");
        }
        return;
    }

    // Неизвестная команда
    addMessage(`Неизвестная команда. Доступно: идти, взять, осмотреться, инвентарь, выход.`, "error");
}

// ---------- Обработчики событий ----------
function handleInput() {
    const command = inputEl.value;
    if (command.trim()) {
        processCommand(command);
        inputEl.value = "";
    }
}

sendBtn.addEventListener("click", handleInput);
inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleInput();
    }
});

// ---------- Запуск игры ----------
clearMessages();
addMessage("Добро пожаловать в текстовый квест!");
addMessage("Вводите команды: идти [направление], взять [предмет], осмотреться, инвентарь, выход.");
updateUI();
inputEl.focus(); 
