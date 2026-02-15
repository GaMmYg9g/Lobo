// ---------- MÚSICA DE FONDO AMBIENTAL ----------
const AmbientMusic = {
    audioContext: null,
    isPlaying: false,
    gainNode: null,
    lowOscillator: null,
    midOscillator: null,
    highOscillator: null,
    
    initAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioContext;
    },
    
    createOscillators() {
        const ctx = this.audioContext;
        
        this.gainNode = ctx.createGain();
        this.gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        this.gainNode.connect(ctx.destination);
        
        this.lowOscillator = ctx.createOscillator();
        this.lowOscillator.type = 'sine';
        this.lowOscillator.frequency.setValueAtTime(65.41, ctx.currentTime);
        
        this.midOscillator = ctx.createOscillator();
        this.midOscillator.type = 'sine';
        this.midOscillator.frequency.setValueAtTime(130.81, ctx.currentTime);
        
        this.highOscillator = ctx.createOscillator();
        this.highOscillator.type = 'sine';
        this.highOscillator.frequency.setValueAtTime(261.63, ctx.currentTime);
        
        this.lowOscillator.connect(this.gainNode);
        this.midOscillator.connect(this.gainNode);
        this.highOscillator.connect(this.gainNode);
    },
    
    play() {
        if (this.isPlaying) return;
        
        const ctx = this.initAudio();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        
        this.createOscillators();
        
        const now = ctx.currentTime;
        
        this.lowOscillator.start(now);
        this.lowOscillator.frequency.setValueAtTime(65.41, now);
        this.lowOscillator.frequency.linearRampToValueAtTime(73.42, now + 8);
        this.lowOscillator.frequency.linearRampToValueAtTime(65.41, now + 16);
        this.lowOscillator.frequency.linearRampToValueAtTime(61.74, now + 24);
        this.lowOscillator.frequency.linearRampToValueAtTime(65.41, now + 32);
        
        this.midOscillator.start(now);
        this.midOscillator.frequency.setValueAtTime(130.81, now);
        this.midOscillator.frequency.linearRampToValueAtTime(146.83, now + 6);
        this.midOscillator.frequency.linearRampToValueAtTime(130.81, now + 12);
        this.midOscillator.frequency.linearRampToValueAtTime(123.47, now + 18);
        this.midOscillator.frequency.linearRampToValueAtTime(130.81, now + 24);
        this.midOscillator.frequency.linearRampToValueAtTime(110.00, now + 30);
        this.midOscillator.frequency.linearRampToValueAtTime(130.81, now + 36);
        
        setTimeout(() => {
            if (this.isPlaying) {
                this.highOscillator.start(ctx.currentTime);
                this.highOscillator.frequency.setValueAtTime(261.63, ctx.currentTime);
                this.highOscillator.frequency.linearRampToValueAtTime(293.66, ctx.currentTime + 10);
                this.highOscillator.frequency.linearRampToValueAtTime(261.63, ctx.currentTime + 20);
                this.highOscillator.frequency.linearRampToValueAtTime(246.94, ctx.currentTime + 30);
                this.highOscillator.frequency.linearRampToValueAtTime(261.63, ctx.currentTime + 40);
            }
        }, 4000);
        
        this.isPlaying = true;
    },
    
    stop() {
        if (!this.isPlaying) return;
        
        const now = this.audioContext?.currentTime;
        if (now) {
            this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
            this.gainNode.gain.linearRampToValueAtTime(0, now + 2);
            
            setTimeout(() => {
                try {
                    this.lowOscillator?.stop();
                    this.midOscillator?.stop();
                    this.highOscillator?.stop();
                } catch (e) {}
                this.isPlaying = false;
            }, 2000);
        } else {
            this.isPlaying = false;
        }
    },
    
    toggleForScreen(screenName) {
        if (screenName === 'menu' || screenName === 'asignarRoles' || screenName === 'juego' || screenName === 'votacion') {
            this.play();
        } else {
            this.stop();
        }
    }
};

// ---------- SISTEMA DE SONIDO ----------
const SoundEffects = {
    audioContext: null,
    
    initAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    },
    
    playRevealSound() {
        this.initAudio();
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        osc.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.3);
    },
    
    playVoteSound() {
        this.initAudio();
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
        
        osc.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.15);
    },
    
    playImpostorFoundSound() {
        this.initAudio();
        const now = this.audioContext.currentTime;
        
        const frequencies = [523.25, 659.25, 783.99, 1046.50];
        frequencies.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            gainNode.gain.setValueAtTime(0.3, now + i * 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.3);
            
            osc.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            osc.start(now + i * 0.15);
            osc.stop(now + i * 0.15 + 0.3);
        });
    },
    
    playErrorSound() {
        this.initAudio();
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        
        osc.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.4);
    },
    
    playRoundEndSound(ganador) {
        this.initAudio();
        if (ganador === 'ciudadanos') {
            this.playImpostorFoundSound();
        } else {
            const osc = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            osc.type = 'square';
            osc.frequency.setValueAtTime(110, this.audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(55, this.audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);
            
            osc.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.6);
        }
    }
};

// ---------- ANIMACIONES CSS ----------
const animacionesCSS = `
    @keyframes fadeInScale {
        0% { opacity: 0; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1); }
    }
    
    @keyframes slideInFromBottom {
        0% { opacity: 0; transform: translateY(50px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
        70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes glow {
        0% { box-shadow: 0 0 5px #667eea; }
        50% { box-shadow: 0 0 20px #667eea, 0 0 30px #764ba2; }
        100% { box-shadow: 0 0 5px #667eea; }
    }
    
    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
    }
    
    @keyframes bounceIn {
        0% { transform: scale(0); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes rotateY {
        from { transform: rotateY(0deg); }
        to { transform: rotateY(360deg); }
    }
    
    .animate-fade-in { animation: fadeInScale 0.5s ease-out; }
    .animate-slide-up { animation: slideInFromBottom 0.5s ease-out; }
    .animate-pulse { animation: pulse 1s infinite; }
    .animate-shake { animation: shake 0.5s ease-in-out; }
    .animate-glow { animation: glow 2s infinite; }
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-bounce { animation: bounceIn 0.3s ease; }
    
    .vote-player-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .vote-player-card:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }
    
    .vote-player-card:active {
        transform: scale(0.98);
    }
    
    .rol-card {
        transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    .rol-card.revealed {
        animation: rotateY 0.5s ease-out;
    }
    
    .vote-count-badge {
        animation: bounceIn 0.3s ease;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = animacionesCSS;
document.head.appendChild(styleSheet);

// ---------- Estado Global ----------

// ---------- TUTORIAL ----------
let tutorialActivo = false;
let tutorialCompletado = localStorage.getItem('tutorial_completado') === 'true';
let pasoActualTutorial = 0;

// ---------- 🔥 VARIABLES PARA TUTORIAL INTERACTIVO ----------
let tutorialEnCurso = false;
let tutorialEsperandoInteraccion = false;
let tutorialListenersActivos = [];

// ---------- PASOS DEL TUTORIAL INTERACTIVO (ACTUALIZADO) ----------
const pasosTutorial = [
    {
        id: 1,
        titulo: "🐑 ¡Bienvenido a Ovejas y Lobos!",
        descripcion: "Vamos a aprender a jugar. Te guiaré paso a paso.",
        imagen: "🐺🐑",
        pantalla: "menu",
        accion: "esperar", // ✅ Esto es correcto
        elemento: null
    },
    {
        id: 2,
        titulo: "👥 Agregar un Jugador",
        descripcion: "Primero, necesitamos jugadores. Toca el botón '➕ Agregar Jugador'",
        imagen: "➕",
        pantalla: "menu",
        accion: "clic",
        elemento: "btnAddPlayer",
        feedback: "¡Bien! Ahora escribe un nombre"
    },
    {
        id: 3,
        titulo: "✏️ Escribe un nombre",
        descripcion: "Escribe cualquier nombre (ej: 'Jugador1') y toca 'Guardar'",
        imagen: "✏️",
        pantalla: "addPlayer",
        accion: "escribirYGuardar",
        elementoInput: "newPlayerName",
        elementoBoton: "saveNewPlayer",
        valorEjemplo: "Jugador1",
        feedback: "¡Perfecto! El jugador fue agregado"
    },
    {
        id: 4,
        titulo: "🐑 Ver el Rebaño",
        descripcion: "Ahora toca el botón '🐑 Rebaño 🐑' para ver los jugadores",
        imagen: "🐑",
        pantalla: "menu",
        accion: "clic",
        elemento: "btnGroupManager",
        feedback: "¡Bien! Aquí puedes ver, editar o eliminar jugadores"
    },
    {
        id: 5,
        titulo: "🔙 Volver al menú",
        descripcion: "Toca 'Volver al Corral' para regresar",
        imagen: "🔙",
        pantalla: "groupManager",
        accion: "clic",
        elemento: "backToMenu",
        feedback: "¡Excelente! Sigamos"
    },
    {
        id: 6,
        titulo: "⚙️ Configurar Partida",
        descripcion: "Toca '⚙️ Configurar Partida' para ajustar el juego",
        imagen: "⚙️",
        pantalla: "menu",
        accion: "clic",
        elemento: "btnGameSetup",
        feedback: "Muy bien. Aquí decidiremos cuántos lobos habrá"
    },
    {
        id: 7,
        titulo: "🐺 Elegir número de Lobos",
        descripcion: "Mueve el deslizador para elegir 2 lobos",
        imagen: "🐺",
        pantalla: "gameSetup",
        accion: "moverSlider",
        elemento: "impRange",
        valorObjetivo: 2,
        feedback: "¡Así se hace! Ahora verás que hay 2 lobos y 1 oveja"
    },
    {
        id: 8,
        titulo: "👁️ Opción del Lobo",
        descripcion: "Activa esta opción para que el lobo vea la categoría",
        imagen: "👁️",
        pantalla: "gameSetup",
        accion: "marcarCheckbox",
        elemento: "impostorVeCategoria",
        feedback: "Correcto. El lobo tendrá una pista"
    },
    {
        id: 9,
        titulo: "📁 Seleccionar Categoría",
        descripcion: "Elige la categoría 'Animales'",
        imagen: "📁",
        pantalla: "gameSetup",
        accion: "seleccionarOpcion",
        elemento: "categoriaSelect",
        valorObjetivo: "Animales",
        feedback: "¡Bien! La categoría será Animales"
    },
    {
        id: 10,
        titulo: "💾 Guardar Configuración",
        descripcion: "¡IMPORTANTE! Toca '💾 GUARDAR CONFIGURACIÓN'",
        imagen: "💾",
        pantalla: "gameSetup",
        accion: "clic",
        elemento: "guardarConfigBtn",
        feedback: "✅ Configuración guardada. Bien hecho"
    },
    {
        id: 11,
        titulo: "🔙 Volver al menú",
        descripcion: "Toca 'Volver al Corral' para regresar",
        imagen: "🔙",
        pantalla: "gameSetup",
        accion: "clic",
        elemento: "backToMenu",
        feedback: "Ya casi estamos listos"
    },
    {
        id: 12,
        titulo: "▶️ Iniciar Partida",
        descripcion: "Toca '▶ Iniciar Partida' para comenzar",
        imagen: "▶️",
        pantalla: "menu",
        accion: "clic",
        elemento: "btnStartGame",
        feedback: "¡Comenzamos! Ahora verás la asignación de roles"
    },
    {
        id: 13,
        titulo: "🎭 Mostrar Rol",
        descripcion: "Toca '✨ Mostrar Rol' para revelar tu rol",
        imagen: "✨",
        pantalla: "asignarRoles",
        accion: "clic",
        elemento: "revelarRol",
        feedback: "¡Mira qué rol te tocó!"
    },
    {
        id: 14,
        titulo: "🐺 Rol de Lobo",
        descripcion: "Toca 'Aceptar y pasar' para continuar",
        imagen: "🐺",
        pantalla: "asignarRoles",
        accion: "clic",
        elemento: "siguienteRol",  // ✅ Esto debe ser "siguienteRol"
        feedback: "Bien. Ahora pasamos al siguiente jugador"
    },
    {
        id: 15,
        titulo: "🐑 Rol de Oveja",
        descripcion: "Este es el rol de oveja. Toca 'Aceptar y pasar'",
        imagen: "🐑",
        pantalla: "asignarRoles",
        accion: "clic",
        elemento: "siguienteRol",
        feedback: "Perfecto. Ya todos tienen su rol"
    },
    {
        id: 16,
        titulo: "❓ Ronda de Preguntas",
        descripcion: "Aquí ves el orden de preguntas. Toca '🗳️ Iniciar Votación'",
        imagen: "🔄",
        pantalla: "juego",
        accion: "clic",
        elemento: "abrirVotacionBtn",
        feedback: "Muy bien. Vamos a votar"
    },
    {
        id: 17,
        titulo: "🗳️ Votar",
        descripcion: "Toca el nombre del Jugador 1 para votar (es el lobo de ejemplo)",
        imagen: "🗳️",
        pantalla: "votacion",
        accion: "clicEnJugador",
        elemento: "vote-player-card",
        indiceJugador: 0,
        feedback: "¡Correcto! Has emitido tu voto"
    },
    {
        id: 18,
        titulo: "📊 Ver Resultado",
        descripcion: "Toca '🔍 Ver Resultado' para ver qué pasó",
        imagen: "📊",
        pantalla: "votacion",
        accion: "clic",
        elemento: "finalizarVotacionBtn",
        feedback: "¡Mira el resultado!"
    },
    {
        id: 19,
        titulo: "🎉 Fin de la Partida",
        descripcion: "Toca 'Cerrar' para continuar",
        imagen: "🎉",
        pantalla: "modal",
        accion: "clic",
        elemento: "tutorialModalCloseBtn",
        feedback: "¡Excelente!"
    },
    {
        id: 20,
        titulo: "📊 Ver Estadísticas",
        descripcion: "Toca '📊 Estadísticas' para ver el resumen de tus partidas",
        imagen: "📊",
        pantalla: "menu",
        accion: "clic",
        elemento: "btnStats",
        feedback: "¡Bien! Aquí puedes ver todas tus estadísticas"
    },
    {
        
        id: 21,
        titulo: "📊 Tabla de Estadísticas",
        descripcion: "Observa las columnas: 🐺 Victorias como Lobo, 🐑 Victorias como Oveja, ⭐ Puntos totales",
        imagen: "📋",
        pantalla: "stats",
        accion: "temporizador",  // Cambiado de "esperar" a "temporizador"
        tiempo: 8, // 8 segundos para ver la tabla
        feedback: "Tiempo completado. Continuando..."

    },
    {
        id: 22,
        titulo: "🎉 ¡Tutorial Completado!",
        descripcion: "¡Ya sabes jugar! Puedes repetir el tutorial cuando quieras desde el botón naranja.",
        imagen: "🎉",
        pantalla: "menu",
        accion: "final",
       feedback: "¡A disfrutar el juego!"
    }
];

let players = JSON.parse(localStorage.getItem('undercover_players')) || [];

// Categorías con 25 palabras cada una
let categorias = {
    'Lugares': ['PLAYA', 'MONTAÑA', 'BOSQUE', 'DESIERTO', 'ISLA', 'LAGO', 'RÍO', 'VALLE', 'CUEVA', 'VOLCÁN', 'SELVA', 'GLACIAR', 'OCÉANO', 'CASCADA', 'CAMPING', 'MIRADOR', 'SENDERO', 'PRADERA', 'ACANTILADO', 'ARROYO', 'CUMBRE', 'LLANURA', 'PANTANO', 'ARRECIFE', 'CAÑÓN'],
    'Ciudades': ['MADRID', 'BARCELONA', 'LONDRES', 'PARÍS', 'ROMA', 'BERLÍN', 'TOKIO', 'NUEVA YORK', 'MOSCÚ', 'DUBAI', 'SIDNEY', 'CIUDAD DE MÉXICO', 'BUENOS AIRES', 'LIMA', 'BOGOTÁ', 'SANTIAGO', 'CARACAS', 'LA PAZ', 'QUITO', 'MONTEVIDEO', 'ASUNCIÓN', 'PANAMÁ', 'SAN JOSÉ', 'LA HABANA', 'SANTO DOMINGO'],
    'Fútbol': ['BALÓN', 'CANCHA', 'ARCO', 'PENALTI', 'CÓRNER', 'FUERA DE JUEGO', 'ÁRBITRO', 'TARJETA AMARILLA', 'TARJETA ROJA', 'VAR', 'LESIÓN', 'CAMBIOS', 'PRÓRROGA', 'TANDA DE PENALES', 'FINAL', 'COPA', 'LIGA', 'CHAMPIONS', 'MUNDIAL', 'ENTRENADOR', 'CAPITÁN', 'DELANTERO', 'DEFENSA', 'MEDIOCAMPISTA', 'PORTERO'],
    'Futbolistas': ['MESSI', 'CR7', 'NEYMAR', 'MBAPPÉ', 'HAALAND', 'BENZEMA', 'LEWANDOWSKI', 'MODRIĆ', 'DE BRUYNE', 'SALAH', 'MANÉ', 'KANE', 'VINICIUS', 'BELLINGHAM', 'PEDRI', 'GAVI', 'MUSIALA', 'VALVERDE', 'COUTINHO', 'SUÁREZ', 'AGÜERO', 'DI MARÍA', 'INIESTA', 'XAVI', 'CASILLAS'],
    'Animales': ['PERRO', 'GATO', 'LEÓN', 'TIGRE', 'ELEFANTE', 'JIRAFA', 'CEBRA', 'RINOCERONTE', 'HIPOPÓTAMO', 'MONO', 'GORILA', 'OSO', 'LOBO', 'ZORRO', 'CIERVO', 'CANGURO', 'KOALA', 'PANDA', 'COALA', 'SERPIENTE', 'COCODRILO', 'TORTUGA', 'ÁGUILA', 'HALCÓN', 'PINGÜINO'],
    'Comida': ['PIZZA', 'HAMBURGUESA', 'PERRO CALIENTE', 'TACOS', 'ENCHILADAS', 'POLLO FRITO', 'PASTA', 'LASAGÑA', 'SUSHI', 'ARROZ', 'FRIJOLES', 'TORTILLA', 'QUESADILLA', 'BURRITO', 'CHILAQUILES', 'MOLE', 'POZOLE', 'TAMALES', 'EMPANADAS', 'AREPS', 'CACHAPA', 'PABELLÓN', 'BANDEJA PAISA', 'CEVICHE', 'CAUSA']
};

let palabrasPorDefecto = [];
Object.values(categorias).forEach(lista => {
    palabrasPorDefecto.push(...lista);
});

let words = JSON.parse(localStorage.getItem('undercover_words')) || palabrasPorDefecto;

let currentScreen = 'menu';
let gameState = {
    status: 'off',
    playersInGame: [],
    impostorIndexes: [],
    palabraSecreta: '',
    categoriaSecreta: '',
    impostorVeCategoria: false,
    currentRolIndex: 0,
    round: 1,
    votes: [],
    eliminatedPlayers: [],
    ordenPreguntas: []
};

const app = document.getElementById('app');

// Modales
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

const voteModal = document.getElementById('voteModal');
const guessModal = document.getElementById('guessModal');
const guessInput = document.getElementById('guessInput');
const submitGuessBtn = document.getElementById('submitGuessBtn');
const guessModalClose = document.getElementById('guessModal-close');

// Iniciar música con el primer click
document.addEventListener('click', function initMusicOnFirstClick() {
    AmbientMusic.play();
    document.removeEventListener('click', initMusicOnFirstClick);
}, { once: true });

/// ---------- RENDER PRINCIPAL (ACTUALIZADO) ----------
function renderScreen() {
    AmbientMusic.toggleForScreen(currentScreen);
    
    // Si es la primera vez, iniciar tutorial automáticamente
    if (!tutorialCompletado && !tutorialActivo && currentScreen === 'menu') {
        setTimeout(() => {
            iniciarTutorial();
        }, 500);
    }
    
    if (currentScreen === 'menu') renderMenu();
    else if (currentScreen === 'addPlayer') renderAddPlayer();
    else if (currentScreen === 'groupManager') renderGroupManager();
    else if (currentScreen === 'dictionary') renderDictionary();
    else if (currentScreen === 'gameSetup') renderGameSetup();
    else if (currentScreen === 'stats') renderStats();
    else if (currentScreen === 'asignarRoles') renderAsignarRoles();
    else if (currentScreen === 'juego') renderJuego();
    else if (currentScreen === 'votacion') renderVotacion();
    else if (currentScreen === 'finRonda') renderFinRonda();
    else renderMenu();
}

/// ---------- MENÚ PRINCIPAL (ACTUALIZADO) ----------
function renderMenu() {
    currentScreen = 'menu';
    let html = `
        <div class="screen">
            <h1>🐑Ovejas y Lobos🐺</h1>
            <p class="subtitle">¡Descubre el Lobo entre las Ovejas antes de que sea Tarde!</p>
            
            <div style="display: flex; justify-content: center; gap: 10px; margin: 10px 0;">
                <button class="btn btn-music" id="musicOnBtn" style="background: #4CAF50; ${AmbientMusic.isPlaying ? 'display: none;' : ''}">🎵 Activar Música</button>
                <button class="btn btn-music" id="musicOffBtn" style="background: #f44336; ${!AmbientMusic.isPlaying ? 'display: none;' : ''}">🔇 Silenciar</button>
            </div>
            
            <!-- 🔥 NUEVO: Botón de Tutorial -->
            <div style="margin: 10px 0;">
                <button class="btn btn-info" id="btnTutorial" style="background: #ff9800; color: white; width: 100%; padding: 15px; border-radius: 15px; font-weight: bold; border: none; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                    📖 ${tutorialCompletado ? 'Ver Tutorial nuevamente' : '¡NUEVO! Tutorial interactivo'}
                </button>
            </div>
            
            <div class="menu-grid">
                <button class="btn btn-primary" id="btnAddPlayer">➕ Agregar Jugador</button>
                <button class="btn btn-primary" id="btnGroupManager">🐑 Rebaño 🐑</button>
                <button class="btn btn-primary" id="btnDictionary">📚 Diccionario</button>
                <button class="btn btn-primary" id="btnGameSetup">⚙️ Configurar Partida</button>
                <button class="btn btn-primary" id="btnStats">📊 Estadísticas</button>
                <button class="btn btn-success" id="btnStartGame">▶ Iniciar Partida</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
    
    document.getElementById('musicOnBtn')?.addEventListener('click', () => {
        AmbientMusic.play();
        renderMenu();
    });
    
    document.getElementById('musicOffBtn')?.addEventListener('click', () => {
        AmbientMusic.stop();
        renderMenu();
    });
    
    // 🔥 NUEVO: Botón de Tutorial
    document.getElementById('btnTutorial')?.addEventListener('click', iniciarTutorial);
    
    document.getElementById('btnAddPlayer')?.addEventListener('click', () => renderAddPlayer());
    document.getElementById('btnGroupManager')?.addEventListener('click', () => renderGroupManager());
    document.getElementById('btnDictionary')?.addEventListener('click', () => renderDictionary());
    document.getElementById('btnGameSetup')?.addEventListener('click', () => renderGameSetup());
    document.getElementById('btnStats')?.addEventListener('click', () => renderStats());
    document.getElementById('btnStartGame')?.addEventListener('click', () => iniciarPartida());
}

// ---------- AGREGAR JUGADOR ----------
function renderAddPlayer() {
    let html = `
        <div class="screen animate-fade-in">
            <h2>Nuevo Jugador</h2>
            <input type="text" id="newPlayerName" placeholder="Nombre del jugador">
            <button class="btn btn-primary" id="saveNewPlayer">Guardar</button>
            <div class="back-button-container">
                <button class="btn btn-secondary" id="backToMenu">Volver al Corral</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
    
    document.getElementById('saveNewPlayer')?.addEventListener('click', () => {
        let name = document.getElementById('newPlayerName').value.trim();
        if(name) {
            players.push({
                id: Date.now() + Math.random(),
                nombre: name,
                partidas: 0,
                victoriasImp: 0,
                victoriasCiud: 0,
                derrotasImp: 0,
                derrotasCiud: 0,
                totalPuntos: 0,
                palabrasAdivinadas: 0
            });
            localStorage.setItem('undercover_players', JSON.stringify(players));
            renderGroupManager();
        } else alert('Escribe un nombre');
    });
    
    document.getElementById('backToMenu')?.addEventListener('click', renderMenu);
}

// ---------- GESTIÓN DE GRUPO ----------
function renderGroupManager() {
    let playersList = players.map((p, index) => `
        <div class="player-item animate-slide-up" style="animation-delay: ${index * 0.1}s;">
            <span class="player-name">${p.nombre}</span>
            <div class="player-actions">
                <button class="edit-player" data-index="${index}">✏️</button>
                <button class="delete-player" data-index="${index}">❌</button>
            </div>
        </div>
    `).join('') || '<p style="color: gray;">No hay jugadores. Agrega uno.</p>';

    let html = `
        <div class="screen animate-fade-in">
            <h2>🐑 Rebaño 🐑</h2>
            <button class="btn btn-primary" id="addNewFromGroup">➕ Nuevo</button>
            <div class="players-list">
                ${playersList}
            </div>
            <div class="back-button-container">
                <button class="btn btn-secondary" id="backToMenu">Volver al Corral</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
    
    document.getElementById('addNewFromGroup')?.addEventListener('click', renderAddPlayer);
    document.getElementById('backToMenu')?.addEventListener('click', renderMenu);
    
    document.querySelectorAll('.delete-player').forEach(btn => {
        btn.addEventListener('click', (e) => {
            let index = e.target.dataset.index;
            players.splice(index, 1);
            localStorage.setItem('undercover_players', JSON.stringify(players));
            renderGroupManager();
        });
    });
    
    document.querySelectorAll('.edit-player').forEach(btn => {
        btn.addEventListener('click', (e) => {
            let index = e.target.dataset.index;
            let newName = prompt('Nuevo nombre:', players[index].nombre);
            if(newName) {
                players[index].nombre = newName;
                localStorage.setItem('undercover_players', JSON.stringify(players));
                renderGroupManager();
            }
        });
    });
}

// ---------- DICCIONARIO CON CATEGORÍAS ----------
function renderDictionary() {
    let categoriasHtml = Object.keys(categorias).map(cat => `
        <div style="margin-bottom: 20px;" class="animate-slide-up">
            <h3 style="color: white; margin-bottom: 10px;">📁 ${cat}</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px;">
                ${categorias[cat].map(palabra => `
                    <span style="background: #2a2a3a; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.8rem;">${palabra}</span>
                `).join('')}
            </div>
        </div>
    `).join('');

    let html = `
        <div class="screen animate-fade-in">
            <h2>📚 Diccionario por Categorías</h2>
            <p style="color: #a0a0a0; text-align: center; margin-bottom: 15px;">Cada categoría tiene 25 palabras</p>
            
            <div style="max-height: 400px; overflow-y: auto; padding: 10px;">
                ${categoriasHtml}
            </div>
            
            <div style="margin-top: 20px;">
                <button class="btn btn-primary" id="btnVolverDic">Volver al Corral</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
    
    document.getElementById('btnVolverDic')?.addEventListener('click', renderMenu);
}

// ---------- CONFIGURACIÓN DE PARTIDA (CON BOTÓN GUARDAR) ----------
function renderGameSetup() {
    let totalJugadores = players.length;
    
    // Cargar configuración guardada (si existe)
    let configGuardada = JSON.parse(localStorage.getItem('undercover_config')) || {
        numImpostores: 1,
        impostorVeCategoria: false,
        categoria: 'aleatoria'
    };
    
    let html = `
        <div class="screen animate-fade-in">
            <h2>⚙️ Configurar Partida</h2>
            
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 20px; padding: 15px; margin: 10px 0; text-align: center;">
                <h3 style="color: white; margin: 0;">🎮 Configuración de la partida</h3>
            </div>
            
            <div style="background: #1e1e2e; border-radius: 20px; padding: 15px; margin: 10px 0;">
                <h3 style="color: white; margin-bottom: 10px;">📊 Jugadores</h3>
                <div style="display: flex; justify-content: space-between; align-items: center; background: #2a2a3a; border-radius: 15px; padding: 15px;">
                    <span style="color: white;">Disponibles:</span>
                    <span style="color: #ffd700; font-size: 1.5rem; font-weight: bold;">${totalJugadores}</span>
                </div>
            </div>
            
            <div style="background: #1e1e2e; border-radius: 20px; padding: 15px; margin: 10px 0;">
                <h3 style="color: white; margin-bottom: 15px;">🎭 Roles</h3>
                
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: white;">🐺LOBO/S:</span>
                        <span style="color: #ffd700; font-weight: bold; background: #2a2a3a; padding: 5px 15px; border-radius: 20px;" id="impCountDisplay">${configGuardada.numImpostores}</span>
                    </div>
                    <input type="range" id="impRange" min="1" max="${Math.max(1, Math.min(3, Math.floor(totalJugadores/2)))}" value="${configGuardada.numImpostores}" step="1" style="width: 100%;">
                </div>
                
                <div style="display: flex; justify-content: space-between; background: #2a2a3a; border-radius: 15px; padding: 15px;">
                    <span style="color: white;">🐑OVEJAS:</span>
                    <span style="color: #4CAF50; font-weight: bold; font-size: 1.2rem;" id="ciudCountDisplay">${totalJugadores - configGuardada.numImpostores}</span>
                </div>
            </div>
            
            <div style="background: #1e1e2e; border-radius: 20px; padding: 15px; margin: 10px 0;">
                <h3 style="color: white; margin-bottom: 15px;">Lobo 🐺</h3>
                
                <label style="display: flex; align-items: center; gap: 15px; background: #2a2a3a; border-radius: 15px; padding: 15px; cursor: pointer;">
                    <input type="checkbox" id="impostorVeCategoria" ${configGuardada.impostorVeCategoria ? 'checked' : ''} style="width: 20px; height: 20px;">
                    <span style="color: white; flex: 1;">Mostrar la categoría al Lobo</span>
                </label>
            </div>
            
            <div style="background: #1e1e2e; border-radius: 20px; padding: 15px; margin: 10px 0;">
                <h3 style="color: white; margin-bottom: 15px;">📁 Categoría</h3>
                
                <select id="categoriaSelect" style="width: 100%; padding: 15px; border-radius: 15px; background: #2a2a3a; color: white; border: 2px solid #3a3a4a; font-size: 1rem;">
                    <option value="aleatoria" ${configGuardada.categoria === 'aleatoria' ? 'selected' : ''}>🎲 Categoría Aleatoria</option>
                    ${Object.keys(categorias).map(cat => 
                        `<option value="${cat}" ${configGuardada.categoria === cat ? 'selected' : ''}>📁 ${cat}</option>`
                    ).join('')}
                </select>
            </div>
            
            <!-- BOTÓN GUARDAR CONFIGURACIÓN -->
            <div style="background: linear-gradient(135deg, #00b09b, #96c93d); border-radius: 20px; padding: 20px; margin: 15px 0; text-align: center;">
                <button id="guardarConfigBtn" style="background: white; color: #1a1a2e; border: none; border-radius: 30px; padding: 15px 30px; font-size: 1.2rem; font-weight: bold; cursor: pointer; width: 100%; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                    💾 GUARDAR CONFIGURACIÓN
                </button>
                <p style="color: white; margin-top: 10px; font-size: 0.9rem;">Toca aquí para guardar los cambios</p>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button class="btn btn-secondary" style="flex: 1;" id="backToMenu">🔙 Volver al Corral</button>
            </div>
            
            <!-- Mensaje de confirmación -->
            <div id="configSavedMessage" style="display: none; background: #4CAF50; color: white; padding: 15px; border-radius: 15px; text-align: center; margin-top: 10px; animation: slideUp 0.3s ease;">
                ✅ Configuración guardada correctamente
            </div>
        </div>
    `;
    
    app.innerHTML = html;
    
    let impRange = document.getElementById('impRange');
    let impCountDisplay = document.getElementById('impCountDisplay');
    let ciudCountDisplay = document.getElementById('ciudCountDisplay');
    let guardarBtn = document.getElementById('guardarConfigBtn');
    let configSavedMessage = document.getElementById('configSavedMessage');
    
    // Actualizar contadores al mover el slider
    impRange.addEventListener('input', () => {
        let imp = parseInt(impRange.value);
        impCountDisplay.textContent = imp;
        ciudCountDisplay.textContent = totalJugadores - imp;
    });
    
    // BOTÓN GUARDAR - Captura TODOS los valores y los guarda
    guardarBtn.addEventListener('click', () => {
        // Obtener valores actuales
        let numImpostores = parseInt(impRange.value);
        let impostorVeCategoria = document.getElementById('impostorVeCategoria').checked;
        let categoria = document.getElementById('categoriaSelect').value;
        
        // Crear objeto de configuración
        let config = {
            numImpostores: numImpostores,
            impostorVeCategoria: impostorVeCategoria,
            categoria: categoria,
            fechaGuardado: new Date().toLocaleString()
        };
        
        // Guardar en localStorage
        localStorage.setItem('undercover_config', JSON.stringify(config));
        
        // Mostrar mensaje de confirmación
        configSavedMessage.style.display = 'block';
        setTimeout(() => {
            configSavedMessage.style.display = 'none';
        }, 2000);
        
        // Feedback táctil/vibración (si está disponible)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        console.log('📋 Configuración guardada:', config);
    });
    
    document.getElementById('backToMenu').addEventListener('click', renderMenu);
}

// ---------- ESTADÍSTICAS (CON VICTORIAS CIUDADANO) ----------
function renderStats() {
    let statsPlayers = [...players].sort((a,b) => b.totalPuntos - a.totalPuntos);
    let rows = statsPlayers.map((p, idx) => {
        let posClass = idx === 0 ? 'pos-1' : (idx === 1 ? 'pos-2' : (idx === 2 ? 'pos-3' : 'pos-rest'));
        return `
            <div class="stats-row animate-slide-up" style="animation-delay: ${idx * 0.1}s;">
                <span class="${posClass}">#${idx+1}</span>
                <span class="stats-nombre">${p.nombre}</span>
                <span class="stats-numero">${p.partidas}</span>
                <span class="stats-numero">${p.victoriasImp}</span>
                <span class="stats-numero">${p.victoriasCiud}</span>
                <span class="stats-numero">${p.totalPuntos}</span>
            </div>
        `;
    }).join('');

    let html = `
        <div class="screen animate-fade-in">
            <h2>📊 Estadísticas</h2>
            
            <div class="stats-container">
                <div class="stats-header-row">
                    <span class="stats-header-item">#</span>
                    <span class="stats-header-item">Nombre</span>
                    <span class="stats-header-item">PJ</span>
                    <span class="stats-header-item">🐺</span>
                    <span class="stats-header-item">🐑</span>
                    <span class="stats-header-item">⭐</span>
                </div>
                
                <div class="stats-rows-container">
                    ${rows}
                </div>
            </div>
            
            <div class="stats-legend">
                <div class="stats-legend-item">
                    <span class="stats-legend-icon">🐺</span> = Victorias como Lobo.
                </div>
                <div class="stats-legend-item">
                    <span class="stats-legend-icon">🐑</span> = Victorias como Oveja.
                </div>
                <div class="stats-legend-item">
                    <span class="stats-legend-icon">⭐</span> = Puntos totales.
                </div>
            </div>
            
            <div class="back-button-container">
                <button class="btn btn-secondary" id="backToMenu">Volver al Corral</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
    document.getElementById('backToMenu')?.addEventListener('click', renderMenu);
}

// ---------- INICIAR PARTIDA (USANDO CONFIGURACIÓN GUARDADA) ----------
function iniciarPartida() {
    if(players.length < 3) {
        alert('Necesitas al menos 3 jugadores');
        return;
    }
    
    // CARGAR CONFIGURACIÓN GUARDADA
    let config = JSON.parse(localStorage.getItem('undercover_config')) || {
        numImpostores: 1,
        impostorVeCategoria: false,
        categoria: 'aleatoria'
    };
    
    console.log('📋 Configuración cargada:', config);
    
    // ASIGNAR VALORES DE CONFIGURACIÓN
    let numImpostores = config.numImpostores;
    let impostorVeCategoria = config.impostorVeCategoria;
    let categoriaElegida = config.categoria;
    
    console.log('🎮 Valores asignados:', {
        numImpostores,
        impostorVeCategoria,
        categoriaElegida
    });
    
    // Validar que el número de impostores sea válido
    let maxImpostores = Math.floor(players.length / 2);
    if (numImpostores > maxImpostores) {
        numImpostores = maxImpostores;
        console.log('⚠️ Ajustando Lobos a:', numImpostores);
    }
    
    // Seleccionar categoría y palabra
    let categoriaSeleccionada = '';
    let palabraSeleccionada = '';
    
    if (categoriaElegida === 'aleatoria') {
        let categoriasList = Object.keys(categorias);
        categoriaSeleccionada = categoriasList[Math.floor(Math.random() * categoriasList.length)];
        let palabrasCategoria = categorias[categoriaSeleccionada];
        palabraSeleccionada = palabrasCategoria[Math.floor(Math.random() * palabrasCategoria.length)];
        console.log('🎲 Categoría aleatoria seleccionada:', categoriaSeleccionada);
    } else {
        categoriaSeleccionada = categoriaElegida;
        let palabrasCategoria = categorias[categoriaElegida];
        palabraSeleccionada = palabrasCategoria[Math.floor(Math.random() * palabrasCategoria.length)];
        console.log('📁 Categoría fija seleccionada:', categoriaSeleccionada);
    }
    
    console.log('🔤 Palabra secreta:', palabraSeleccionada);
    
    gameState = {
        status: 'asignando',
        playersInGame: players.map(p => ({ ...p })),
        impostorIndexes: [],
        palabraSecreta: palabraSeleccionada,
        categoriaSecreta: categoriaSeleccionada,
        impostorVeCategoria: impostorVeCategoria,
        currentRolIndex: 0,
        round: 1,
        votes: [],
        eliminatedPlayers: [],
        ordenPreguntas: []
    };

    let total = gameState.playersInGame.length;
    while(gameState.impostorIndexes.length < numImpostores) {
        let r = Math.floor(Math.random() * total);
        if(!gameState.impostorIndexes.includes(r)) gameState.impostorIndexes.push(r);
    }
    
    // 🔄 Generar orden aleatorio inicial
    gameState.ordenPreguntas = generarOrdenPreguntas();
    console.log('🔄 Orden de preguntas inicial:', gameState.ordenPreguntas.map(idx => gameState.playersInGame[idx].nombre));
    
    console.log('🎭 GameState creado:', {
        impostorIndexes: gameState.impostorIndexes,
        impostorVeCategoria: gameState.impostorVeCategoria,
        categoriaSecreta: gameState.categoriaSecreta,
        ordenPreguntas: gameState.ordenPreguntas
    });

    currentScreen = 'asignarRoles';
    renderScreen();
}

// ---------- ASIGNAR ROLES ----------
function renderAsignarRoles() {
    if(gameState.currentRolIndex >= gameState.playersInGame.length) {
        currentScreen = 'juego';
        renderScreen();
        return;
    }

    let jugador = gameState.playersInGame[gameState.currentRolIndex];
    let esImpostor = gameState.impostorIndexes.includes(gameState.currentRolIndex);
    
    console.log(`🎭 Mostrando rol a ${jugador.nombre}:`, {
        esImpostor,
        impostorVeCategoria: gameState.impostorVeCategoria,
        categoria: gameState.categoriaSecreta
    });
    
    let contenidoRol = '';
    if (esImpostor) {
        if (gameState.impostorVeCategoria) {
            contenidoRol = `
                <div style="text-align: center;">
                    <p class="impostor-msg animate-glow" style="font-size: 2rem; margin-bottom: 20px;">🐺 ERES EL LOBO</p>
                    <div style="background: rgba(255,215,0,0.2); border: 2px solid #ffd700; border-radius: 20px; padding: 20px; margin: 15px 0;">
                        <p style="color: #ffd700; font-size: 1.2rem; margin-bottom: 5px;">📁 Categoría de la palabra:</p>
                        <p style="color: white; font-size: 2rem; font-weight: bold;">${gameState.categoriaSecreta}</p>
                        <p style="color: #a0a0a0; font-size: 0.9rem; margin-top: 10px;">(Tienes que adivinar la palabra exacta)</p>
                    </div>
                </div>
            `;
        } else {
            contenidoRol = '<p class="impostor-msg animate-glow" style="font-size: 2rem;">¡🐺 ERES EL LOBO! Evita ser descubierto por las OVEJAS</p>';
        }
    } else {
        contenidoRol = `
            <div style="text-align: center;">
                <p style="color: #4CAF50; font-size: 1.2rem; margin-bottom: 10px;">🐑 ¡ERES UNA OVEJA! Encuentra al LOBO antes de que sea tarde.</p>
                <div style="background: rgba(102,126,234,0.2); border: 2px solid #667eea; border-radius: 20px; padding: 20px; margin: 15px 0;">
                    <p style="color: white; font-size: 2.5rem; font-weight: bold; margin-bottom: 10px;">${gameState.palabraSecreta}</p>
                    <p style="color: #ffd700; font-size: 1.1rem;">📁 Categoría: ${gameState.categoriaSecreta}</p>
                </div>
            </div>
        `;
    }
    
    let html = `
        <div class="screen animate-fade-in" style="justify-content: center;">
            <div class="rol-card" id="rolCard" style="background: linear-gradient(145deg, #2a2a4a, #1a1a3a);">
                <h2 id="playerNameDisplay" class="animate-float" style="font-size: 2.5rem; color: white; margin-bottom: 20px;">${jugador.nombre}</h2>
                <div id="rolContent" style="display: none;">
                    ${contenidoRol}
                </div>
            </div>
            <button class="btn btn-primary animate-pulse" id="revelarRol" style="background: linear-gradient(135deg, #667eea, #764ba2);">✨ Mostrar Rol</button>
            <button class="btn btn-success" id="siguienteRol" style="display: none; background: linear-gradient(135deg, #00b09b, #96c93d);">Aceptar y pasar</button>
            
        </div>
    `;
    app.innerHTML = html;

    document.getElementById('revelarRol').addEventListener('click', () => {
        SoundEffects.playRevealSound();
        
        let rolCard = document.getElementById('rolCard');
        rolCard.classList.add('revealed');
        
        setTimeout(() => {
            document.getElementById('playerNameDisplay').style.display = 'none';
            document.getElementById('rolContent').style.display = 'block';
            document.getElementById('revelarRol').style.display = 'none';
            document.getElementById('siguienteRol').style.display = 'block';
        }, 300);
    });

    document.getElementById('siguienteRol').addEventListener('click', () => {
        gameState.currentRolIndex++;
        renderAsignarRoles();
    });
}

// ---------- PANTALLA DE JUEGO (ACTUALIZADA - CON ORDEN DE PREGUNTAS) ----------
function renderJuego() {
    if(gameState.eliminatedPlayers.length === gameState.playersInGame.length - 1) {
        terminarJuego('impostor');
        return;
    }

    currentScreen = 'juego';
    
    // Determinar si mostrar la categoría o no
    let mostrarCategoria = gameState.impostorVeCategoria;
    
    // 🔄 Obtener nombres en orden de preguntas
    let ordenNombres = gameState.ordenPreguntas
        .map(idx => gameState.playersInGame[idx].nombre)
        .join(' → ');
    
    let html = `
        <div class="screen game-screen-black animate-fade-in">
            <h2 class="animate-float">🔍 Juego en curso</h2>
            <p style="color: #aaa;">Ronda ${gameState.round}</p>
            
            ${mostrarCategoria ? 
                `<p style="color: #ccc; text-align:center;">📁 Categoría: ${gameState.categoriaSecreta}</p>` : 
                `<p style="color: #333; text-align:center;">🔒 Categoría oculta</p>`
            }
            
            <!-- 🔄 NUEVO: Orden de preguntas -->
            <div style="background: rgba(102,126,234,0.2); border: 2px solid #667eea; border-radius: 20px; padding: 15px; margin: 15px 0;">
                <p style="color: #ffd700; font-size: 1rem; margin-bottom: 5px;">🔄 Orden de preguntas:</p>
                <p style="color: white; font-size: 1.2rem; font-weight: bold;">${ordenNombres}</p>
                <p style="color: #a0a0a0; font-size: 0.8rem; margin-top: 5px;">Sigan este orden para preguntar</p>
            </div>
            
            <p style="color: #ccc; text-align:center;">¡TIEMPO PARA LAS PREGUNTAS!</p>
            <button class="btn btn-primary animate-pulse" id="abrirVotacionBtn">🗳️ Iniciar Votación</button>
            <div class="back-button-container" style="width:100%;">
                <button class="btn btn-secondary" id="salirAlMenu">Volver al Corral</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
    
    document.getElementById('abrirVotacionBtn').addEventListener('click', () => {
        currentScreen = 'votacion';
        renderScreen();
    });
    
    document.getElementById('salirAlMenu').addEventListener('click', renderMenu);
}

// ---------- VOTACIÓN DEFINITIVA (CORREGIDA - MÚLTIPLES LOBOS Y ORDEN ALEATORIO) ----------
function renderVotacion() {
    let activePlayers = gameState.playersInGame.filter((_, idx) => !gameState.eliminatedPlayers.includes(idx));
    let votos = [];
    let votanteActual = 0;
    
    let html = `
        <div class="screen animate-fade-in">
            <h2 class="animate-float">🗳️ VOTACIÓN - Ronda ${gameState.round}</h2>
            
            <div class="animate-glow" style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 20px; padding: 20px; margin: 10px 0; text-align: center;">
                <div style="font-size: 1.2rem; color: white; margin-bottom: 5px;">🎯 Pasa el telefono al proximo jugador para votar:</div>
                <div style="font-size: 2rem; color: white; font-weight: bold;" id="nombreVotante">${activePlayers[0]?.nombre || ''}</div>
                <div style="color: rgba(255,255,255,0.8); margin-top: 5px;" id="contadorVotos">Voto 1 de ${activePlayers.length}</div>
            </div>
            
            <p style="color: #a0a0a0; text-align: center; margin: 10px 0;">Toca el nombre de tu sospechoso</p>
            
            <div class="players-list" id="votacionList" style="margin-top: 5px;">
                ${activePlayers.map((p, idx) => {
                    let originalIndex = gameState.playersInGame.findIndex(sp => sp.id === p.id);
                    return `
                        <div class="vote-player-card animate-slide-up" data-originalindex="${originalIndex}" data-voteforindex="${originalIndex}" style="animation-delay: ${idx * 0.1}s;">
                            <div class="vote-player-avatar">${p.nombre.charAt(0).toUpperCase()}</div>
                            <div class="vote-player-info">
                                <div class="vote-player-name">${p.nombre}</div>
                                <div class="vote-player-status">
                                    👤 Jugador
                                </div>
                            </div>
                            <div class="vote-count-badge" style="display: none;">0</div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn btn-secondary" style="flex: 1;" id="reiniciarVotosBtn">🔄 Reiniciar</button>
                <button class="btn btn-primary" style="flex: 1;" id="finalizarVotacionBtn">🔍 Ver Resultado</button>
            </div>
            
            <div class="back-button-container">
                <button class="btn btn-secondary" id="volverJuego">◀️ Seguir preguntando</button>
            </div>
        </div>
    `;
    
    app.innerHTML = html;
    
    let nombreVotante = document.getElementById('nombreVotante');
    let contadorVotos = document.getElementById('contadorVotos');
    let reiniciarBtn = document.getElementById('reiniciarVotosBtn');
    let finalizarBtn = document.getElementById('finalizarVotacionBtn');
    
    function actualizarBadges() {
        document.querySelectorAll('.vote-count-badge').forEach(badge => {
            badge.style.display = 'none';
        });
        
        let conteo = {};
        votos.forEach(v => {
            conteo[v.votadoIndex] = (conteo[v.votadoIndex] || 0) + 1;
        });
        
        Object.keys(conteo).forEach(idx => {
            let card = document.querySelector(`.vote-player-card[data-originalindex="${idx}"]`);
            if (card) {
                let badge = card.querySelector('.vote-count-badge');
                badge.style.display = 'block';
                badge.textContent = `${conteo[idx]} ${conteo[idx] === 1 ? 'voto' : 'votos'}`;
                
                badge.style.animation = 'pulse 0.5s';
                setTimeout(() => {
                    badge.style.animation = '';
                }, 500);
            }
        });
    }
    
    function actualizarVotanteActual() {
        if (votanteActual < activePlayers.length) {
            nombreVotante.textContent = activePlayers[votanteActual].nombre;
            contadorVotos.textContent = `Voto ${votos.length + 1} de ${activePlayers.length}`;
            
            nombreVotante.style.animation = 'pulse 0.5s';
            setTimeout(() => {
                nombreVotante.style.animation = '';
            }, 500);
        } else {
            nombreVotante.textContent = "✓ Votación completa";
            contadorVotos.textContent = `${activePlayers.length} votos emitidos`;
        }
    }
    
    document.querySelectorAll('.vote-player-card').forEach(card => {
        card.addEventListener('click', function() {
            if (votanteActual >= activePlayers.length) {
                mostrarToast('✓ Todos ya votaron');
                return;
            }
            
            let votadoIndex = parseInt(this.dataset.voteforindex);
            let votanteNombre = activePlayers[votanteActual].nombre;
            let votadoNombre = gameState.playersInGame[votadoIndex].nombre;
            
            votos.push({
                votanteIndex: votanteActual,
                votadoIndex: votadoIndex
            });
            
            SoundEffects.playVoteSound();
            this.classList.add('animate-shake');
            setTimeout(() => {
                this.classList.remove('animate-shake');
            }, 500);
            
            this.style.backgroundColor = '#2a2a4a';
            this.style.borderColor = '#667eea';
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.backgroundColor = '';
                this.style.borderColor = '';
                this.style.transform = '';
            }, 200);
            
            mostrarToast(`🗳️ ${votanteNombre} votó por ${votadoNombre}`);
            
            actualizarBadges();
            
            votanteActual++;
            actualizarVotanteActual();
        });
    });
    
    reiniciarBtn.addEventListener('click', () => {
        votos = [];
        votanteActual = 0;
        actualizarBadges();
        actualizarVotanteActual();
        
        document.querySelectorAll('.vote-player-card').forEach(card => {
            card.style.animation = 'shake 0.5s';
            setTimeout(() => {
                card.style.animation = '';
            }, 500);
        });
        
        mostrarToast('🔄 Votación reiniciada');
    });
    
    finalizarBtn.addEventListener('click', () => {
        if (votos.length === 0) {
            mostrarToast('❌ Debe haber al menos un voto');
            return;
        }
        
        let conteo = {};
        votos.forEach(v => {
            conteo[v.votadoIndex] = (conteo[v.votadoIndex] || 0) + 1;
        });
        
        // Encontrar el máximo de votos
        let maxVotos = 0;
        Object.values(conteo).forEach(votos => {
            if (votos > maxVotos) maxVotos = votos;
        });
        
        // Encontrar todos los que tienen el máximo de votos (posible empate)
        let masVotados = [];
        Object.keys(conteo).forEach(idx => {
            if (conteo[idx] === maxVotos) {
                masVotados.push(parseInt(idx));
            }
        });
        
        // CASO 1: HAY EMPATE
        if (masVotados.length > 1) {
            SoundEffects.playErrorSound();
            
            modalTitle.textContent = '🤝 ¡EMPATE!';
            
            let nombresEmpate = masVotados.map(idx => gameState.playersInGame[idx].nombre).join(' y ');
            
            modalBody.innerHTML = `
                <div style="text-align: center; padding: 20px;" class="animate-fade-in">
                    <div style="font-size: 3rem; margin-bottom: 15px; animation: float 2s infinite;">🤝</div>
                    <h3 style="color: #ffd700; font-size: 2rem; margin: 10px 0;">¡EMPATE!</h3>
                    <p style="color: white; margin: 20px 0; font-size: 1.2rem;">
                        ${nombresEmpate} empataron con ${maxVotos} votos cada uno.
                    </p>
                    <div style="background: #1e1e2e; border-radius: 15px; padding: 15px; margin-top: 15px;">
                        <p style="color: #a0a0a0; margin: 0;">🔍 Nadie es eliminado esta ronda</p>
                        <p style="color: #a0a0a0; margin-top: 5px;">Habrá otra ronda de preguntas</p>
                    </div>
                </div>
            `;
            
            modal.classList.remove('hidden');
            
            modalClose.onclick = () => {
                modal.classList.add('hidden');
                // En caso de empate, nadie es eliminado, solo avanzamos a la siguiente ronda
                gameState.round++;
                // 🔄 Reordenar aleatoriamente para la siguiente ronda
                gameState.ordenPreguntas = generarOrdenPreguntas();
                console.log('🔄 Nuevo orden de preguntas (tras empate):', gameState.ordenPreguntas.map(idx => gameState.playersInGame[idx].nombre));
                currentScreen = 'juego';
                renderScreen();
            };
            
            return;
        }
        
        // CASO 2: HAY UN GANADOR (SIN EMPATE)
        let eliminadoIdx = masVotados[0];
        let jugadorEliminado = gameState.playersInGame[eliminadoIdx];
        let esImpostor = gameState.impostorIndexes.includes(eliminadoIdx);
        
        if (esImpostor) {
            SoundEffects.playImpostorFoundSound();
        } else {
            SoundEffects.playErrorSound();
        }
        
        modalTitle.textContent = esImpostor ? '🎉 ¡LOBO DESCUBIERTO!' : '😢 ¡Votación Errónea!';
        
        let mensaje = esImpostor 
            ? `✅ ¡Correcto! ${jugadorEliminado.nombre} era un LOBO.`
            : `❌ Oh no... ${jugadorEliminado.nombre} NO era el LOBO. Era una OVEJA.`;
        
        // Verificar cuántos lobos quedan
        let lobosRestantes = gameState.impostorIndexes.filter(idx => !gameState.eliminatedPlayers.includes(idx) && idx !== eliminadoIdx).length;
        
        modalBody.innerHTML = `
            <div style="text-align: center; padding: 20px;" class="animate-fade-in">
                <div style="font-size: 3rem; margin-bottom: 15px; animation: float 2s infinite;">${esImpostor ? '🐺' : '💔'}</div>
                <h3 style="color: ${esImpostor ? '#00ff00' : '#ff6b6b'}; font-size: 2rem; margin: 10px 0;">${jugadorEliminado.nombre}</h3>
                <p style="color: white; margin: 20px 0; font-size: 1.2rem;">${mensaje}</p>
                <div style="background: #1e1e2e; border-radius: 15px; padding: 15px; margin-top: 15px;">
                    <p style="color: #ffd700; margin: 0;">🗳️ Recibió ${maxVotos} ${maxVotos === 1 ? 'voto' : 'votos'}</p>
                    <p style="color: #a0a0a0; margin-top: 5px;">Total de votos: ${votos.length}</p>
                    ${esImpostor ? `<p style="color: #ff6b6b; margin-top: 10px;">🐺 Quedan ${lobosRestantes} ${lobosRestantes === 1 ? 'lobo' : 'lobos'} en el rebaño</p>` : ''}
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
        
        modalClose.onclick = () => {
            modal.classList.add('hidden');
            
            // Siempre eliminar al jugador votado
            if (!gameState.eliminatedPlayers.includes(eliminadoIdx)) {
                gameState.eliminatedPlayers.push(eliminadoIdx);
            }
            
            // Verificar si TODOS los lobos han sido eliminados
let lobosEliminados = gameState.impostorIndexes.every(idx => gameState.eliminatedPlayers.includes(idx));
let ovejasRestantes = gameState.playersInGame.filter((_, idx) => 
    !gameState.impostorIndexes.includes(idx) && !gameState.eliminatedPlayers.includes(idx)
).length;
let lobosVivos = gameState.impostorIndexes.filter(idx => !gameState.eliminatedPlayers.includes(idx)).length;

if (lobosEliminados) {
    // 🐑 ¡GANAN LAS OVEJAS! Todos los lobos descubiertos
    terminarJuego('ciudadanos');
} else if (ovejasRestantes <= lobosVivos) {
    // 🐺 ¡GANAN LOS LOBOS! Quedan IGUAL O MÁS lobos que ovejas
    console.log(`🐺 Victoria de lobos: ${lobosVivos} lobos vs ${ovejasRestantes} ovejas`);
    terminarJuego('impostor');
} else {
    // El juego continúa
    gameState.round++;
    // 🔄 Reordenar aleatoriamente para la siguiente ronda
    gameState.ordenPreguntas = generarOrdenPreguntas();
    console.log('🔄 Nuevo orden de preguntas:', gameState.ordenPreguntas.map(idx => gameState.playersInGame[idx].nombre));
    currentScreen = 'juego';
    renderScreen();
}
        };
    });
    
    document.getElementById('volverJuego').addEventListener('click', () => {
        currentScreen = 'juego';
        renderScreen();
    });
    
    actualizarVotanteActual();
}

// ---------- 🔄 FUNCIÓN PARA MEZCLAR ARRAY ALEATORIAMENTE ----------
function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ---------- 🔄 FUNCIÓN PARA GENERAR ORDEN ALEATORIO DE PREGUNTAS ----------
function generarOrdenPreguntas() {
    // Obtener índices de jugadores activos (no eliminados)
    let activos = [];
    gameState.playersInGame.forEach((_, idx) => {
        if (!gameState.eliminatedPlayers.includes(idx)) {
            activos.push(idx);
        }
    });
    
    // Mezclar aleatoriamente
    return mezclarArray(activos);
}

// ---------- INICIAR TUTORIAL ----------
function iniciarTutorial() {
    console.log('🎮 Iniciando tutorial interactivo');
    tutorialActivo = true;
    tutorialCompletado = false;
    tutorialPasoActual = 0;
    tutorialEnCurso = true;
    
    // Limpiar cualquier listener previo
    eliminarListenersTutorial();
    
    // Mostrar primer paso
    mostrarPasoTutorial();
}

// ---------- ELIMINAR LISTENERS ----------
function eliminarListenersTutorial() {
    tutorialListenersActivos.forEach(({elemento, tipo, listener}) => {
        if (elemento) {
            elemento.removeEventListener(tipo, listener);
        }
    });
    tutorialListenersActivos = [];
}

// ---------- MOSTRAR PASO DEL TUTORIAL ----------
function mostrarPasoTutorial() {
    let paso = pasosTutorial[tutorialPasoActual];
    if (!paso) {
        // Tutorial completado
        tutorialActivo = false;
        tutorialCompletado = true;
        localStorage.setItem('tutorial_completado', 'true');
        renderMenu();
        return;
    }
    
    console.log(`📋 Paso ${tutorialPasoActual + 1}: ${paso.titulo}`);
    
    // Navegar a la pantalla necesaria
    navegarAPantallaTutorial(paso.pantalla, paso);
    
    // Mostrar overlay con instrucciones
    setTimeout(() => {
        mostrarOverlayTutorial(paso);
        
        // Si el paso requiere interacción, configurar listeners
        if (paso.accion !== 'esperar' && paso.accion !== 'final') {
            configurarListenerPaso(paso);
        }
    }, 300);
}

// ---------- NAVEGAR A PANTALLA ----------
function navegarAPantallaTutorial(pantalla, paso) {
    if (pantalla === 'menu') renderMenuTutorial();
    else if (pantalla === 'addPlayer') renderAddPlayerTutorial();
    else if (pantalla === 'groupManager') renderGroupManagerTutorial();
    else if (pantalla === 'gameSetup') renderGameSetupTutorial();
    else if (pantalla === 'stats') renderStatsTutorial();  // ✅ AÑADIR ESTA LÍNEA
    else if (pantalla === 'asignarRoles') renderAsignarRolesTutorial();
    else if (pantalla === 'juego') renderJuegoTutorial();
    else if (pantalla === 'votacion') renderVotacionTutorial();
    else if (pantalla === 'modal') {
        // Mantener la pantalla actual, solo mostrar modal
    }
}

// ---------- CONFIGURAR LISTENER SEGÚN ACCIÓN ----------
function configurarListenerPaso(paso) {
    eliminarListenersTutorial();
    
    setTimeout(() => {
        switch (paso.accion) {
            case 'clic':
                configurarListenerClic(paso);
                break;
            case 'escribirYGuardar':
                configurarListenerEscribirYGuardar(paso);
                break;
            case 'moverSlider':
                configurarListenerSlider(paso);
                break;
            case 'marcarCheckbox':
                configurarListenerCheckbox(paso);
                break;
            case 'seleccionarOpcion':
                configurarListenerSelect(paso);
                break;
            case 'clicEnJugador':
                configurarListenerClicEnJugador(paso);
                break;
            case 'temporizador':
                // No hacer nada, el temporizador se maneja aparte
                console.log(`⏳ Paso con temporizador de ${paso.tiempo} segundos`);
                break;
        }
    }, 200);
}

// ---------- LISTENER PARA CLIC EN ELEMENTO ----------
function configurarListenerClic(paso) {
    let elemento = document.getElementById(paso.elemento);
    if (!elemento) {
        console.warn(`⚠️ Elemento no encontrado: ${paso.elemento}`);
        return;
    }
    
    // Destacar elemento
    elemento.style.animation = 'pulse 1s infinite';
    elemento.style.border = '4px solid #ffd700';
    elemento.style.boxShadow = '0 0 20px #ffd700';
    elemento.style.transform = 'scale(1.05)';
    elemento.style.transition = 'all 0.3s ease';
    
    let listener = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Quitar efectos
        elemento.style.animation = '';
        elemento.style.border = '';
        elemento.style.boxShadow = '';
        elemento.style.transform = '';
        
        // Eliminar listener
        elemento.removeEventListener('click', listener);
        
        // Eliminar overlay
        let overlay = document.getElementById('tutorialOverlay');
        if (overlay) overlay.remove();
        
        // Mostrar feedback
        mostrarToast(paso.feedback || '✅ Correcto!');
        
        // Avanzar al siguiente paso
        setTimeout(() => {
            tutorialPasoActual++;
            mostrarPasoTutorial();
        }, 500);
    };
    
    elemento.addEventListener('click', listener);
    tutorialListenersActivos.push({elemento, tipo: 'click', listener});
}

// ---------- LISTENER PARA ESCRIBIR Y GUARDAR ----------
function configurarListenerEscribirYGuardar(paso) {
    let input = document.getElementById(paso.elementoInput);
    let boton = document.getElementById(paso.elementoBoton);
    
    if (!input || !boton) return;
    
    // Destacar elementos
    input.style.animation = 'pulse 1s infinite';
    input.style.border = '4px solid #ffd700';
    boton.style.animation = 'pulse 1s infinite';
    boton.style.border = '4px solid #ffd700';
    
    // Listener para el input
    let inputListener = () => {
        if (input.value.trim() !== '') {
            // Cuando el input tiene texto, destacar botón
            boton.style.animation = 'pulse 1s infinite';
            boton.style.border = '4px solid #ffd700';
        }
    };
    
    // Listener para el botón
    let botonListener = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (input.value.trim() !== '') {
            // Quitar efectos
            input.style.animation = '';
            input.style.border = '';
            boton.style.animation = '';
            boton.style.border = '';
            
            // Eliminar listeners
            input.removeEventListener('input', inputListener);
            boton.removeEventListener('click', botonListener);
            
            // Eliminar overlay
            let overlay = document.getElementById('tutorialOverlay');
            if (overlay) overlay.remove();
            
            mostrarToast(paso.feedback || '✅ Guardado!');
            
            setTimeout(() => {
                tutorialPasoActual++;
                mostrarPasoTutorial();
            }, 500);
        }
    };
    
    input.addEventListener('input', inputListener);
    boton.addEventListener('click', botonListener);
    
    tutorialListenersActivos.push({elemento: input, tipo: 'input', listener: inputListener});
    tutorialListenersActivos.push({elemento: boton, tipo: 'click', listener: botonListener});
}

// ---------- LISTENER PARA MOVER SLIDER ----------
function configurarListenerSlider(paso) {
    let slider = document.getElementById(paso.elemento);
    if (!slider) return;
    
    slider.style.animation = 'pulse 1s infinite';
    slider.style.border = '4px solid #ffd700';
    
    let listener = () => {
        if (parseInt(slider.value) === paso.valorObjetivo) {
            slider.style.animation = '';
            slider.style.border = '';
            
            slider.removeEventListener('input', listener);
            
            // Eliminar overlay
            let overlay = document.getElementById('tutorialOverlay');
            if (overlay) overlay.remove();
            
            mostrarToast(paso.feedback || '✅ Correcto!');
            
            setTimeout(() => {
                tutorialPasoActual++;
                mostrarPasoTutorial();
            }, 500);
        }
    };
    
    slider.addEventListener('input', listener);
    tutorialListenersActivos.push({elemento: slider, tipo: 'input', listener});
}

// ---------- LISTENER PARA MARCAR CHECKBOX ----------
function configurarListenerCheckbox(paso) {
    let checkbox = document.getElementById(paso.elemento);
    if (!checkbox) return;
    
    checkbox.style.animation = 'pulse 1s infinite';
    checkbox.style.outline = '4px solid #ffd700';
    
    let listener = () => {
        if (checkbox.checked) {
            checkbox.style.animation = '';
            checkbox.style.outline = '';
            
            checkbox.removeEventListener('change', listener);
            
            // Eliminar overlay
            let overlay = document.getElementById('tutorialOverlay');
            if (overlay) overlay.remove();
            
            mostrarToast(paso.feedback || '✅ Activado!');
            
            setTimeout(() => {
                tutorialPasoActual++;
                mostrarPasoTutorial();
            }, 500);
        }
    };
    
    checkbox.addEventListener('change', listener);
    tutorialListenersActivos.push({elemento: checkbox, tipo: 'change', listener});
}

// ---------- LISTENER PARA SELECT ----------
function configurarListenerSelect(paso) {
    let select = document.getElementById(paso.elemento);
    if (!select) return;
    
    select.style.animation = 'pulse 1s infinite';
    select.style.border = '4px solid #ffd700';
    
    let listener = () => {
        if (select.value === paso.valorObjetivo) {
            select.style.animation = '';
            select.style.border = '';
            
            select.removeEventListener('change', listener);
            
            // Eliminar overlay
            let overlay = document.getElementById('tutorialOverlay');
            if (overlay) overlay.remove();
            
            mostrarToast(paso.feedback || '✅ Seleccionado!');
            
            setTimeout(() => {
                tutorialPasoActual++;
                mostrarPasoTutorial();
            }, 500);
        }
    };
    
    select.addEventListener('change', listener);
    tutorialListenersActivos.push({elemento: select, tipo: 'change', listener});
}

// ---------- LISTENER PARA CLIC EN JUGADOR ----------
function configurarListenerClicEnJugador(paso) {
    let jugadores = document.querySelectorAll(`.${paso.elemento}`);
    if (jugadores.length === 0) return;
    
    let jugadorObjetivo = jugadores[paso.indiceJugador];
    if (!jugadorObjetivo) return;
    
    jugadorObjetivo.style.animation = 'pulse 1s infinite';
    jugadorObjetivo.style.border = '4px solid #ffd700';
    jugadorObjetivo.style.transform = 'scale(1.05)';
    
    let listener = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        jugadorObjetivo.style.animation = '';
        jugadorObjetivo.style.border = '';
        jugadorObjetivo.style.transform = '';
        
        jugadorObjetivo.removeEventListener('click', listener);
        
        // Eliminar overlay
        let overlay = document.getElementById('tutorialOverlay');
        if (overlay) overlay.remove();
        
        mostrarToast(paso.feedback || '✅ Voto emitido!');
        
        setTimeout(() => {
            tutorialPasoActual++;
            mostrarPasoTutorial();
        }, 500);
    };
    
    jugadorObjetivo.addEventListener('click', listener);
    tutorialListenersActivos.push({elemento: jugadorObjetivo, tipo: 'click', listener});
}

/// ---------- MOSTRAR OVERLAY INTERACTIVO ----------
function mostrarOverlayTutorial(paso) {
    // Eliminar overlay existente
    let overlayExistente = document.getElementById('tutorialOverlay');
    if (overlayExistente) overlayExistente.remove();
    
    // Si el paso es "esperar" o "final", mostramos overlay con botón
    if (paso.accion === 'esperar' || paso.accion === 'final') {
        mostrarOverlayConBoton(paso);
    } else {
        // Para acciones interactivas, mostramos overlay pequeño arriba
        mostrarOverlayInformativo(paso);
    }
}

// ---------- MOSTRAR OVERLAY CON BOTÓN (para pasos de bienvenida y final) ----------
function mostrarOverlayConBoton(paso) {
    let overlay = document.createElement('div');
    overlay.id = 'tutorialOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 3000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
        pointer-events: auto;
        animation: fadeInScale 0.3s ease;
    `;
    
    let tarjeta = document.createElement('div');
    tarjeta.style.cssText = `
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 30px;
        padding: 25px;
        max-width: 350px;
        width: 100%;
        box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        border: 3px solid white;
        text-align: center;
    `;
    
    let progreso = ((tutorialPasoActual + 1) / pasosTutorial.length) * 100;
    
    tarjeta.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 15px;">${paso.imagen}</div>
        <h2 style="color: white; font-size: 1.8rem; margin-bottom: 10px;">${paso.titulo}</h2>
        <p style="color: #e0e0e0; font-size: 1rem; margin-bottom: 20px;">${paso.descripcion}</p>
        
        <div style="background: rgba(255,255,255,0.3); border-radius: 10px; height: 10px; margin: 15px 0;">
            <div style="background: #ffd700; width: ${progreso}%; height: 10px; border-radius: 10px;"></div>
        </div>
        <p style="color: white; margin-bottom: 20px;">Paso ${tutorialPasoActual + 1} de ${pasosTutorial.length}</p>
        
        <button id="tutorialContinueBtn" style="background: #4CAF50; color: white; border: none; border-radius: 30px; padding: 15px 30px; font-size: 1.2rem; font-weight: bold; cursor: pointer; width: 100%;">
            👉 Continuar
        </button>
        
        <button id="tutorialSkipBtn" style="background: transparent; color: #ccc; border: 1px solid #ccc; border-radius: 30px; padding: 10px; font-size: 0.9rem; cursor: pointer; width: 100%; margin-top: 10px;">
            ⏭️ Omitir tutorial
        </button>
    `;
    
    overlay.appendChild(tarjeta);
    document.body.appendChild(overlay);
    
    document.getElementById('tutorialContinueBtn').addEventListener('click', () => {
        overlay.remove();
        tutorialPasoActual++;
        mostrarPasoTutorial();
    });
    
    document.getElementById('tutorialSkipBtn').addEventListener('click', () => {
        eliminarListenersTutorial();
        tutorialActivo = false;
        tutorialCompletado = true;
        localStorage.setItem('tutorial_completado', 'true');
        overlay.remove();
        renderMenu();
    });
}

// ---------- MOSTRAR OVERLAY INFORMATIVO (para pasos interactivos) ----------
function mostrarOverlayInformativo(paso) {
    // Eliminar overlay existente
    let overlayExistente = document.getElementById('tutorialOverlay');
    if (overlayExistente) overlayExistente.remove();
    
    // Determinar si estamos en la pantalla de estadísticas
    let esPantallaStats = (paso.pantalla === 'stats');
    
    let overlay = document.createElement('div');
    overlay.id = 'tutorialOverlay';
    
    if (esPantallaStats) {
        // Para estadísticas: overlay en esquina inferior derecha (no tapa la tabla)
        overlay.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            z-index: 3000;
            padding: 15px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            border: 2px solid white;
            pointer-events: none;
            animation: fadeInScale 0.3s ease;
            max-width: 280px;
        `;
    } else {
        // Para el resto: overlay superior (como al inicio)
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #667eea, #764ba2);
            z-index: 3000;
            padding: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border-bottom: 3px solid white;
            pointer-events: none;
            animation: slideDown 0.3s ease;
        `;
    }
    
    let progreso = ((tutorialPasoActual + 1) / pasosTutorial.length) * 100;
    
    // Si es un paso con temporizador, mostrar cuenta regresiva
    let temporizadorHTML = '';
    if (paso.accion === 'temporizador' && paso.tiempo) {
        temporizadorHTML = `
            <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.3); border-radius: 30px; padding: 8px 12px; ${esPantallaStats ? '' : 'max-width: 200px;'}">
                <span style="color: white; font-size: 0.9rem;">⏳</span>
                <span id="temporizador" style="color: #ffd700; font-weight: bold; font-size: 1.2rem;">${paso.tiempo}s</span>
            </div>
        `;
    }
    
    if (esPantallaStats) {
        // Versión para estadísticas (compacta, esquina)
        overlay.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="font-size: 2rem;">${paso.imagen}</div>
                    <div>
                        <h3 style="color: white; font-size: 1rem; margin: 0;">${paso.titulo}</h3>
                        <p style="color: #e0e0e0; font-size: 0.85rem; margin: 5px 0 0 0;">${paso.descripcion}</p>
                    </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.3); border-radius: 10px; height: 4px; margin: 5px 0;">
                    <div style="background: #ffd700; width: ${progreso}%; height: 4px; border-radius: 10px;"></div>
                </div>
                
                ${temporizadorHTML}
                
                <div style="display: flex; justify-content: flex-end; margin-top: 5px;">
                    <span style="color: rgba(255,255,255,0.5); font-size: 0.7rem;">Paso ${tutorialPasoActual + 1}/${pasosTutorial.length}</span>
                </div>
            </div>
        `;
    } else {
        // Versión para resto de pantallas (barra superior)
        overlay.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; max-width: 400px; margin: 0 auto;">
                <div style="font-size: 2rem;">${paso.imagen}</div>
                <div style="flex: 1;">
                    <h3 style="color: white; font-size: 1rem; margin-bottom: 5px;">${paso.titulo}</h3>
                    <p style="color: #e0e0e0; font-size: 0.9rem;">${paso.descripcion}</p>
                    <div style="background: rgba(255,255,255,0.3); border-radius: 10px; height: 4px; margin-top: 5px;">
                        <div style="background: #ffd700; width: ${progreso}%; height: 4px; border-radius: 10px;"></div>
                    </div>
                    ${temporizadorHTML}
                </div>
            </div>
        `;
    }
    
    document.body.appendChild(overlay);
    
    // Si es un paso con temporizador, iniciar la cuenta regresiva
    if (paso.accion === 'temporizador' && paso.tiempo) {
        iniciarTemporizadorTutorial(paso.tiempo);
    }
}

// ---------- FUNCIÓN PARA TEMPORIZADOR ----------
function iniciarTemporizadorTutorial(segundos) {
    let tiempoRestante = segundos;
    let temporizadorElement = document.getElementById('temporizador');
    
    let intervalo = setInterval(() => {
        tiempoRestante--;
        if (temporizadorElement) {
            temporizadorElement.textContent = `${tiempoRestante}s`;
        }
        
        if (tiempoRestante <= 0) {
            clearInterval(intervalo);
            
            // Eliminar overlay
            let overlay = document.getElementById('tutorialOverlay');
            if (overlay) overlay.remove();
            
            // Mostrar toast
            mostrarToast('⏭️ Continuando...');
            
            // Avanzar al siguiente paso
            setTimeout(() => {
                tutorialPasoActual++;
                mostrarPasoTutorial();
            }, 500);
        }
    }, 1000);
    
    // Guardar el intervalo para poder limpiarlo si es necesario
    tutorialListenersActivos.push({ elemento: null, tipo: 'intervalo', listener: intervalo });
}

// ---------- AÑADE ESTA ANIMACIÓN AL CSS ----------
const animacionExtra = `
    @keyframes slideDown {
        from { transform: translateY(-100%); }
        to { transform: translateY(0); }
    }
`;

// Añadir al styleSheet existente
styleSheet.textContent += animacionExtra;

// ---------- RENDER MENÚ PARA TUTORIAL ----------
function renderMenuTutorial() {
    currentScreen = 'menu';
    let html = `
        <div class="screen">
            <h1>🐑Ovejas y Lobos🐺</h1>
            <p class="subtitle">¡Modo Tutorial Activo!</p>
            
            <div class="menu-grid">
                <button class="btn btn-primary" id="btnAddPlayer">➕ Agregar Jugador</button>
                <button class="btn btn-primary" id="btnGroupManager">🐑 Rebaño 🐑</button>
                <button class="btn btn-primary" id="btnDictionary">📚 Diccionario</button>
                <button class="btn btn-primary" id="btnGameSetup">⚙️ Configurar Partida</button>
                <button class="btn btn-primary" id="btnStats">📊 Estadísticas</button>
                <button class="btn btn-success" id="btnStartGame">▶ Iniciar Partida</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
}

// ---------- RENDER ADD PLAYER PARA TUTORIAL ----------
function renderAddPlayerTutorial() {
    let html = `
        <div class="screen animate-fade-in">
            <h2>Nuevo Jugador (Tutorial)</h2>
            <input type="text" id="newPlayerName" placeholder="Escribe un nombre...">
            <button class="btn btn-primary" id="saveNewPlayer">Guardar</button>
            <div class="back-button-container">
                <button class="btn btn-secondary" id="backToMenu">Volver al Corral</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
}

// ---------- RENDER GROUP MANAGER PARA TUTORIAL ----------
function renderGroupManagerTutorial() {
    let playersList = players.map((p, index) => `
        <div class="player-item">
            <span class="player-name">${p.nombre}</span>
            <div class="player-actions">
                <button class="edit-player" data-index="${index}">✏️</button>
                <button class="delete-player" data-index="${index}">❌</button>
            </div>
        </div>
    `).join('') || '<p style="color: gray;">No hay jugadores. Agrega uno.</p>';

    let html = `
        <div class="screen animate-fade-in">
            <h2>🐑 Rebaño 🐑 (Tutorial)</h2>
            <button class="btn btn-primary" id="addNewFromGroup">➕ Nuevo</button>
            <div class="players-list">
                ${playersList}
            </div>
            <div class="back-button-container">
                <button class="btn btn-secondary" id="backToMenu">Volver al Corral</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
}

// ---------- RENDER GAME SETUP PARA TUTORIAL ----------
function renderGameSetupTutorial() {
    let totalJugadores = players.length;
    
    let html = `
        <div class="screen animate-fade-in">
            <h2>⚙️ Configurar Partida (Tutorial)</h2>
            
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 20px; padding: 15px; margin: 10px 0;">
                <h3 style="color: white; margin: 0;">Configuración de la partida</h3>
            </div>
            
            <div style="background: #1e1e2e; border-radius: 20px; padding: 15px; margin: 10px 0;">
                <h3 style="color: white; margin-bottom: 10px;">📊 Jugadores</h3>
                <div style="display: flex; justify-content: space-between; background: #2a2a3a; border-radius: 15px; padding: 15px;">
                    <span style="color: white;">Disponibles:</span>
                    <span style="color: #ffd700; font-weight: bold;">${totalJugadores}</span>
                </div>
            </div>
            
            <div style="background: #1e1e2e; border-radius: 20px; padding: 15px; margin: 10px 0;">
                <h3 style="color: white; margin-bottom: 15px;">🎭 Roles</h3>
                
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: white;">🐺LOBO/S:</span>
                        <span style="color: #ffd700;" id="impCountDisplay">1</span>
                    </div>
                    <input type="range" id="impRange" min="1" max="3" value="1" step="1" style="width: 100%;">
                </div>
                
                <div style="display: flex; justify-content: space-between; background: #2a2a3a; border-radius: 15px; padding: 15px;">
                    <span style="color: white;">🐑OVEJAS:</span>
                    <span style="color: #4CAF50;" id="ciudCountDisplay">${totalJugadores - 1}</span>
                </div>
            </div>
            
            <div style="background: #1e1e2e; border-radius: 20px; padding: 15px; margin: 10px 0;">
                <h3 style="color: white; margin-bottom: 15px;">Lobo 🐺</h3>
                
                <label style="display: flex; align-items: center; gap: 15px; background: #2a2a3a; border-radius: 15px; padding: 15px;">
                    <input type="checkbox" id="impostorVeCategoria" style="width: 20px; height: 20px;">
                    <span style="color: white;">Mostrar la categoría al Lobo</span>
                </label>
            </div>
            
            <div style="background: #1e1e2e; border-radius: 20px; padding: 15px; margin: 10px 0;">
                <h3 style="color: white; margin-bottom: 15px;">📁 Categoría</h3>
                
                <select id="categoriaSelect" style="width: 100%; padding: 15px; border-radius: 15px; background: #2a2a3a; color: white;">
                    <option value="aleatoria">🎲 Categoría Aleatoria</option>
                    <option value="Animales">📁 Animales</option>
                    <option value="Lugares">📁 Lugares</option>
                    <option value="Ciudades">📁 Ciudades</option>
                </select>
            </div>
            
            <div style="background: linear-gradient(135deg, #00b09b, #96c93d); border-radius: 20px; padding: 20px; margin: 15px 0;">
                <button id="guardarConfigBtn" style="background: white; color: #1a1a2e; border: none; border-radius: 30px; padding: 15px; font-size: 1.2rem; font-weight: bold; cursor: pointer; width: 100%;">
                    💾 GUARDAR CONFIGURACIÓN
                </button>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-secondary" style="flex: 1;" id="backToMenu">🔙 Volver</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
}

// ---------- RENDER STATS PARA TUTORIAL ----------
function renderStatsTutorial() {
    // Crear datos de ejemplo para mostrar en el tutorial
    let statsEjemplo = [
        { nombre: "Jugador 1", partidas: 5, victoriasImp: 2, victoriasCiud: 3, totalPuntos: 19 },
        { nombre: "Jugador 2", partidas: 5, victoriasImp: 1, victoriasCiud: 4, totalPuntos: 14 },
        { nombre: "Jugador 3", partidas: 5, victoriasImp: 2, victoriasCiud: 3, totalPuntos: 19 }
    ];
    
    let rows = statsEjemplo.map((p, idx) => {
        let posClass = idx === 0 ? 'pos-1' : (idx === 1 ? 'pos-2' : 'pos-3');
        return `
            <div class="stats-row">
                <span class="${posClass}">#${idx+1}</span>
                <span class="stats-nombre">${p.nombre}</span>
                <span class="stats-numero">${p.partidas}</span>
                <span class="stats-numero">${p.victoriasImp}</span>
                <span class="stats-numero">${p.victoriasCiud}</span>
                <span class="stats-numero">${p.totalPuntos}</span>
            </div>
        `;
    }).join('');

    let html = `
        <div class="screen animate-fade-in">
            <h2>📊 Estadísticas (Tutorial)</h2>
            
            <div class="stats-container">
                <div class="stats-header-row">
                    <span class="stats-header-item">#</span>
                    <span class="stats-header-item">Nombre</span>
                    <span class="stats-header-item">PJ</span>
                    <span class="stats-header-item">🐺</span>
                    <span class="stats-header-item">🐑</span>
                    <span class="stats-header-item">⭐</span>
                </div>
                
                <div class="stats-rows-container">
                    ${rows}
                </div>
            </div>
            
            <div class="stats-legend">
                <div class="stats-legend-item">
                    <span class="stats-legend-icon">🐺</span> = Victorias como Lobo
                </div>
                <div class="stats-legend-item">
                    <span class="stats-legend-icon">🐑</span> = Victorias como Oveja
                </div>
                <div class="stats-legend-item">
                    <span class="stats-legend-icon">⭐</span> = Puntos totales
                </div>
            </div>
            
            <div class="back-button-container">
                <button class="btn btn-secondary" id="backToMenu">Volver al Corral</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
    
    // En el tutorial, cuando estén en la pantalla de stats, el overlay ya maneja el avance
}

// ---------- RENDER ASIGNAR ROLES PARA TUTORIAL ----------
function renderAsignarRolesTutorial() {
    let paso = pasosTutorial[tutorialPasoActual];
    let jugador = { nombre: "Jugador 1" };
    
    // Determinar qué rol mostrar según el paso
    let esLobo = (paso.id === 13 || paso.id === 14); // Pasos 13 y 14 son del lobo
    
    let contenidoRol = '';
    if (esLobo) {
        contenidoRol = `
            <div style="text-align: center;">
                <p class="impostor-msg animate-glow" style="font-size: 2rem; margin-bottom: 20px;">🐺 ERES EL LOBO</p>
                <div style="background: rgba(255,215,0,0.2); border: 2px solid #ffd700; border-radius: 20px; padding: 20px; margin: 15px 0;">
                    <p style="color: #ffd700; font-size: 1.2rem; margin-bottom: 5px;">📁 Categoría de la palabra:</p>
                    <p style="color: white; font-size: 2rem; font-weight: bold;">Animales</p>
                    <p style="color: #a0a0a0; font-size: 0.9rem; margin-top: 10px;">(Tienes que adivinar la palabra exacta)</p>
                </div>
            </div>
        `;
    } else {
        contenidoRol = `
            <div style="text-align: center;">
                <p style="color: #4CAF50; font-size: 1.2rem; margin-bottom: 10px;">🐑 ¡ERES UNA OVEJA!</p>
                <div style="background: rgba(102,126,234,0.2); border: 2px solid #667eea; border-radius: 20px; padding: 20px; margin: 15px 0;">
                    <p style="color: white; font-size: 2.5rem; font-weight: bold; margin-bottom: 10px;">LOBO</p>
                    <p style="color: #ffd700; font-size: 1.1rem;">📁 Categoría: Animales</p>
                    <p style="color: #a0a0a0; font-size: 0.9rem; margin-top: 10px;">(Tú ves la palabra completa, el lobo no)</p>
                </div>
            </div>
        `;
    }
    
    let html = `
        <div class="screen animate-fade-in" style="justify-content: center;">
            <div class="rol-card" style="background: linear-gradient(145deg, #2a2a4a, #1a1a3a);">
                <h2 id="playerNameDisplay" style="font-size: 2.5rem; color: white; margin-bottom: 20px;">${jugador.nombre}</h2>
                <div id="rolContent" style="display: none;">
                    ${contenidoRol}
                </div>
            </div>
            <button class="btn btn-primary" id="revelarRol" style="background: linear-gradient(135deg, #667eea, #764ba2);">✨ Mostrar Rol</button>
            <button class="btn btn-success" id="siguienteRol" style="display: none; background: linear-gradient(135deg, #00b09b, #96c93d);">Aceptar y pasar</button>
        </div>
    `;
    app.innerHTML = html;
    
    // Configurar el botón "Mostrar Rol" para el tutorial
    let revelarBtn = document.getElementById('revelarRol');
    let siguienteBtn = document.getElementById('siguienteRol');
    let playerName = document.getElementById('playerNameDisplay');
    let rolContent = document.getElementById('rolContent');
    
    revelarBtn.addEventListener('click', () => {
        SoundEffects.playRevealSound();
        
        // Ocultar nombre y mostrar rol
        playerName.style.display = 'none';
        rolContent.style.display = 'block';
        revelarBtn.style.display = 'none';
        siguienteBtn.style.display = 'block';
        
        // Si estamos en el paso del tutorial que espera el clic en "siguienteRol"
        if (paso && paso.elemento === 'siguienteRol') {
            configurarListenerPaso(paso);
        }
    });
}

// ---------- RENDER JUEGO PARA TUTORIAL ----------
function renderJuegoTutorial() {
    let html = `
        <div class="screen game-screen-black animate-fade-in">
            <h2 class="animate-float">🔍 Juego en curso</h2>
            <p style="color: #aaa;">Ronda 1</p>
            <p style="color: #ccc; text-align:center;">📁 Categoría: Animales</p>
            
            <div style="background: rgba(102,126,234,0.2); border: 2px solid #667eea; border-radius: 20px; padding: 15px; margin: 15px 0;">
                <p style="color: #ffd700; font-size: 1rem; margin-bottom: 5px;">🔄 Orden de preguntas:</p>
                <p style="color: white; font-size: 1.2rem; font-weight: bold;">Jugador 1 → Jugador 2 → Jugador 3</p>
            </div>
            
            <p style="color: #ccc; text-align:center;">¡TIEMPO PARA LAS PREGUNTAS!</p>
            <button class="btn btn-primary" id="abrirVotacionBtn">🗳️ Iniciar Votación</button>
        </div>
    `;
    app.innerHTML = html;
}

// ---------- RENDER VOTACIÓN PARA TUTORIAL ----------
function renderVotacionTutorial() {
    let html = `
        <div class="screen animate-fade-in">
            <h2 class="animate-float">🗳️ VOTACIÓN - Ronda 1</h2>
            
            <div class="animate-glow" style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 20px; padding: 20px; margin: 10px 0; text-align: center;">
                <div style="font-size: 1.2rem; color: white; margin-bottom: 5px;">🎯 Pasa el telefono al proximo jugador:</div>
                <div style="font-size: 2rem; color: white; font-weight: bold;">Jugador 1</div>
            </div>
            
            <p style="color: #a0a0a0; text-align: center; margin: 10px 0;">Toca el nombre de tu sospechoso</p>
            
            <div class="players-list">
                <div class="vote-player-card" style="background: #2a2a3a;">
                    <div class="vote-player-avatar">J</div>
                    <div class="vote-player-info">
                        <div class="vote-player-name">Jugador 1</div>
                        <div class="vote-player-status">👤 Jugador</div>
                    </div>
                </div>
                <div class="vote-player-card" style="background: #2a2a3a;">
                    <div class="vote-player-avatar">J</div>
                    <div class="vote-player-info">
                        <div class="vote-player-name">Jugador 2</div>
                        <div class="vote-player-status">👤 Jugador</div>
                    </div>
                </div>
                <div class="vote-player-card" style="background: #2a2a3a;">
                    <div class="vote-player-avatar">J</div>
                    <div class="vote-player-info">
                        <div class="vote-player-name">Jugador 3</div>
                        <div class="vote-player-status">👤 Jugador</div>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn btn-secondary" style="flex: 1;" id="reiniciarVotosBtn">🔄 Reiniciar</button>
                <button class="btn btn-primary" style="flex: 1;" id="finalizarVotacionBtn">🔍 Ver Resultado</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
    
    // Simular que ya hay votos para que el botón "Ver Resultado" funcione
    // Configurar el botón "Ver Resultado" para el tutorial
    let finalizarBtn = document.getElementById('finalizarVotacionBtn');
    finalizarBtn.addEventListener('click', () => {
        // Mostrar modal de resultado para el tutorial
        mostrarModalResultadoTutorial();
    });
}

// ---------- MOSTRAR MODAL DE RESULTADO PARA TUTORIAL ----------
function mostrarModalResultadoTutorial() {
    // Crear modal
    let modal = document.createElement('div');
    modal.id = 'tutorialModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
        z-index: 3500;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        animation: fadeInScale 0.3s ease;
    `;
    
    let modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, #00b09b, #96c93d);
        border-radius: 30px;
        padding: 30px;
        max-width: 350px;
        width: 100%;
        box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        border: 3px solid white;
        text-align: center;
    `;
    
    modalContent.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 15px;">🎉</div>
        <h2 style="color: white; font-size: 2rem; margin-bottom: 15px;">¡LOBO DESCUBIERTO!</h2>
        <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 15px; margin: 15px 0;">
            <p style="color: #ffd700; font-size: 1.2rem;">🐺 El Lobo era:</p>
            <p style="color: white; font-size: 2rem; font-weight: bold;">Jugador 1</p>
        </div>
        <p style="color: white; margin-bottom: 20px;">✅ ¡Correcto! Has descubierto al lobo.</p>
        
        <button id="tutorialModalCloseBtn" style="background: white; color: #1a1a2e; border: none; border-radius: 30px; padding: 15px 30px; font-size: 1.2rem; font-weight: bold; cursor: pointer; width: 100%;">
            ✖ Cerrar
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Configurar botón cerrar
    document.getElementById('tutorialModalCloseBtn').addEventListener('click', () => {
        modal.remove();
        
        // Avanzar al siguiente paso del tutorial
        setTimeout(() => {
            tutorialPasoActual++;
            mostrarPasoTutorial();
        }, 500);
    });
}

// ---------- TERMINAR JUEGO (CORREGIDO - MÚLTIPLES LOBOS) ----------
function terminarJuego(ganador) {
    SoundEffects.playRoundEndSound(ganador);
    
    let impostorIndexes = gameState.impostorIndexes;
    let ciudadanoIndexes = gameState.playersInGame.map((_, idx) => idx).filter(i => !impostorIndexes.includes(i));

    // Verificar si TODOS los lobos han sido eliminados
    let todosLobosEliminados = impostorIndexes.every(idx => gameState.eliminatedPlayers.includes(idx));
    
    if (ganador === 'ciudadanos' || todosLobosEliminados) {
        // 🐑 GANAN LAS OVEJAS (todos los lobos descubiertos)
        
        // Ovejas vivas ganan puntos
        ciudadanoIndexes.forEach(idx => {
            if (!gameState.eliminatedPlayers.includes(idx)) {
                let p = gameState.playersInGame[idx];
                let originalPlayer = players.find(pl => pl.id === p.id);
                if (originalPlayer) {
                    originalPlayer.partidas++;
                    originalPlayer.victoriasCiud++;
                    originalPlayer.totalPuntos += 2;
                }
            }
        });
        
        // Lobos (todos, incluso los eliminados) pierden
        impostorIndexes.forEach(idx => {
            let p = gameState.playersInGame[idx];
            let originalPlayer = players.find(pl => pl.id === p.id);
            if (originalPlayer) {
                originalPlayer.partidas++;
                originalPlayer.derrotasImp++;
            }
        });
    } else {
        // 🐺 GANA EL LOBO (o los lobos)
        
        // Lobos vivos ganan puntos
        impostorIndexes.forEach(idx => {
            if (!gameState.eliminatedPlayers.includes(idx)) {
                let p = gameState.playersInGame[idx];
                let originalPlayer = players.find(pl => pl.id === p.id);
                if (originalPlayer) {
                    originalPlayer.partidas++;
                    originalPlayer.victoriasImp++;
                    originalPlayer.totalPuntos += 5;
                }
            }
        });
        
        // Ovejas (vivas o muertas) pierden
        ciudadanoIndexes.forEach(idx => {
            let p = gameState.playersInGame[idx];
            let originalPlayer = players.find(pl => pl.id === p.id);
            if (originalPlayer) {
                originalPlayer.partidas++;
                originalPlayer.derrotasCiud++;
            }
        });
    }

    localStorage.setItem('undercover_players', JSON.stringify(players));

    currentScreen = 'finRonda';
    renderFinRonda(ganador);
}

// ---------- FIN DE RONDA (MEJORADO - CON MENSAJES ADAPTADOS) ----------
function renderFinRonda(ganador) {
    // Verificar si TODOS los lobos han sido eliminados
    let todosLobosEliminados = gameState.impostorIndexes.every(idx => gameState.eliminatedPlayers.includes(idx));
    
    let mensaje = (ganador === 'ciudadanos' || todosLobosEliminados)
        ? '🎉 ¡VICTORIA! El rebaño se salva.' 
        : '🐺 ¡DERROTA! Los lobos devoran el rebaño.';
    
    // Color de fondo según el ganador
    let fondoGradiente = (ganador === 'ciudadanos' || todosLobosEliminados)
        ? 'linear-gradient(135deg, #00b09b, #96c93d)'  // Verde para ovejas
        : 'linear-gradient(135deg, #f43b47, #453a94)'; // Rojo/oscuro para lobos
    
    let impostorNames = gameState.impostorIndexes.map(idx => gameState.playersInGame[idx].nombre).join(', ');
    
    // Adaptar el mensaje según si hay uno o múltiples lobos
    let lobosInfo = '';
    let lobosTitulo = '';
    
    if (gameState.impostorIndexes.length === 1) {
        lobosTitulo = '🐺 El Lobo era:';
        lobosInfo = '';
    } else {
        lobosTitulo = '🐺 Los Lobos eran:';
        lobosInfo = `<p style="color: #a0a0a0; margin-top: 5px;">Había ${gameState.impostorIndexes.length} lobos en la partida</p>`;
    }
    
    let html = `
        <div class="screen animate-fade-in" style="justify-content: center; text-align: center; gap:20px;">
            <div style="background: ${fondoGradiente}; border-radius: 30px; padding: 30px; margin: 0; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <h1 style="color: white; font-size: 2.2rem; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); margin-bottom: 15px;">
                    ${mensaje}
                </h1>
                <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 15px; margin: 15px 0;">
                    <p style="color: #ffd700; font-size: 1.2rem; margin-bottom: 5px;">${lobosTitulo}</p>
                    <p style="color: white; font-size: 1.8rem; font-weight: bold; text-shadow: 0 0 10px rgba(255,255,255,0.5);">
                        ${impostorNames}
                    </p>
                    ${lobosInfo}
                </div>
                <div style="background: rgba(255,255,255,0.1); border-radius: 15px; padding: 15px; margin-top: 10px;">
                    <p style="color: white; font-size: 1.2rem;">Palabra: <strong style="color: #ffd700;">${gameState.palabraSecreta}</strong></p>
                    <p style="color: #e0e0e0;">Categoría: ${gameState.categoriaSecreta}</p>
                </div>
            </div>
            
            <div style="background: #1e1e2e; border-radius: 20px; padding: 20px; border: 2px solid #3a3a4a;">
                <h3 style="color: white; font-size: 1.5rem; margin-bottom: 15px;">📊 Puntos</h3>
                <div style="display: flex; justify-content: space-around; gap: 10px;">
                    <div style="background: #2a2a3a; border-radius: 15px; padding: 15px; flex: 1;">
                        <div style="color: #4CAF50; font-size: 1.2rem;">🐑 Ovejas</div>
                        <div style="color: white; font-size: 1.5rem; font-weight: bold;">+2 c/u</div>
                    </div>
                    <div style="background: #2a2a3a; border-radius: 15px; padding: 15px; flex: 1;">
                        <div style="color: #f44336; font-size: 1.2rem;">🐺 Lobo/s</div>
                        <div style="color: white; font-size: 1.5rem; font-weight: bold;">+5 c/u</div>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
                <button class="btn btn-primary animate-pulse" id="nuevaPartida" style="background: linear-gradient(135deg, #667eea, #764ba2);">
                    🔄 Jugar otra ronda
                </button>
                <button class="btn btn-secondary" id="menuPrincipal">
                    🏠 Volver al Corral
                </button>
            </div>
        </div>
    `;
    
    app.innerHTML = html;
    
    document.getElementById('nuevaPartida')?.addEventListener('click', () => {
        iniciarPartida();
    });
    
    document.getElementById('menuPrincipal')?.addEventListener('click', renderMenu);
}

// ---------- FUNCIÓN AUXILIAR PARA TOAST ----------
function mostrarToast(mensaje) {
    let toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 30px;
        font-size: 1rem;
        z-index: 2000;
        animation: slideInFromBottom 0.3s ease;
        border-left: 5px solid #667eea;
        box-shadow: 0 5px 20px rgba(0,0,0,0.5);
        font-weight: 500;
    `;
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// Inicializar
renderScreen();

// Cerrar modales
modalClose.addEventListener('click', () => modal.classList.add('hidden'));
guessModalClose.addEventListener('click', () => guessModal.classList.add('hidden'));
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
    if (e.target === guessModal) guessModal.classList.add('hidden');
});
