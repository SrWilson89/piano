// Configuración de las teclas
const keys = [
    { note: 'C', label: '1', freq: 261.63, type: 'white' },
    { note: 'C#', label: '2', freq: 277.18, type: 'black', position: 6 },
    { note: 'D', label: '3', freq: 293.66, type: 'white' },
    { note: 'D#', label: '4', freq: 311.13, type: 'black', position: 18 },
    { note: 'E', label: '5', freq: 329.63, type: 'white' },
    { note: 'F', label: '6', freq: 349.23, type: 'white' },
    { note: 'F#', label: '7', freq: 369.99, type: 'black', position: 42 },
    { note: 'G', label: '8', freq: 392.00, type: 'white' },
    { note: 'G#', label: '9', freq: 415.30, type: 'black', position: 54 },
    { note: 'A', label: '0', freq: 440.00, type: 'white' }
  ];
  
  const keyboardMap = {
    '1': 0, '2': 1, '3': 2, '4': 3, '5': 4,
    '6': 5, '7': 6, '8': 7, '9': 8, '0': 9
  };
  
  let audioContext;
  
  function initAudio() {
    if (!audioContext) {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        document.removeEventListener('click', initAudio);
        document.removeEventListener('touchstart', initAudio);
      } catch (error) {
        console.error('Error al inicializar el AudioContext:', error);
      }
    }
  }
  
  document.addEventListener('click', initAudio);
  document.addEventListener('touchstart', initAudio, { passive: false });
  
  function playNote(frequency) {
    if (!audioContext) {
      initAudio();
    }
  
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
  
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
  
    gainNode.gain.setValueAtTime(0.7, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
  
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
  
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
  }
  
  function createKeyElement(key, index) {
    const keyElement = document.createElement('div');
    keyElement.className = `key ${key.type}`;
    keyElement.dataset.index = index;
  
    const labelElement = document.createElement('div');
    labelElement.className = 'key-label';
    labelElement.textContent = key.label;
  
    keyElement.appendChild(labelElement);
    return keyElement;
  }
  
  function createPiano() {
    const pianoElement = document.getElementById('piano');
    const whiteKeys = keys.filter(key => key.type === 'white');
  
    // Crear teclas blancas
    whiteKeys.forEach((key, index) => {
      pianoElement.appendChild(createKeyElement(key, index));
    });
  
    // Crear teclas negras
    keys.filter(key => key.type === 'black').forEach(key => {
      const keyElement = createKeyElement(key, keys.findIndex(k => k.note === key.note));
      const whiteKeyWidth = 100 / whiteKeys.length;
      const position = key.position / 100 * (whiteKeys.length - 1) * whiteKeyWidth;
      keyElement.style.left = position + '%';
      pianoElement.appendChild(keyElement);
    });
  }
  
  function handleKeyPress(index) {
    const key = keys[index];
    const keyElement = document.querySelector(`.key[data-index="${index}"]`);
  
    if (keyElement) {
      keyElement.classList.add('pressed');
      setTimeout(() => keyElement.classList.remove('pressed'), 300);
      playNote(key.freq);
    }
  }
  
  function addEventListeners() {
    const pianoElement = document.getElementById('piano');
  
    // Delegación de eventos para clics y toques
    pianoElement.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('key')) {
        handleKeyPress(e.target.dataset.index);
      }
    });
  
    pianoElement.addEventListener('touchstart', (e) => {
      if (e.target.classList.contains('key')) {
        e.preventDefault();
        handleKeyPress(e.target.dataset.index);
      }
    }, { passive: false });
  
    // Evento de teclado
    document.addEventListener('keydown', (e) => {
      if (e.key in keyboardMap) {
        handleKeyPress(keyboardMap[e.key]);
      }
    });
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    createPiano();
    addEventListeners();
  });
  // ... (código anterior)

// Función para generar una canción aleatoria
function generateSong() {
    const numberOfNotes = 16; // Número de notas en la canción
    const delayBetweenNotes = 500; // Retardo entre notas en milisegundos
  
    for (let i = 0; i < numberOfNotes; i++) {
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * keys.length); // Selecciona una nota al azar
        handleKeyPress(randomIndex); // Toca la nota
      }, i * delayBetweenNotes); // Añade un retardo entre notas
    }
  }
  
  // Añadir evento al botón de generación de canción
  document.getElementById('generate-song').addEventListener('click', generateSong);
  
  // ... (resto del código)