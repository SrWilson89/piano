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
  
  // Contexto de audio
  let audioContext;
  
  // Inicializar el audioContext al primer clic/toque
  function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
    }
  }
  
  document.addEventListener('click', initAudio);
  document.addEventListener('touchstart', initAudio, { passive: false });
  
  // Función para tocar una nota
  function playNote(frequency) {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
    
    return oscillator;
  }
  
  // Crear el piano
  function createPiano() {
    const pianoElement = document.getElementById('piano');
    
    // Primero crear las teclas blancas
    const whiteKeys = keys.filter(key => key.type === 'white');
    whiteKeys.forEach((key, index) => {
      const keyElement = document.createElement('div');
      keyElement.className = 'key';
      keyElement.dataset.index = keys.findIndex(k => k.note === key.note);
      
      const labelElement = document.createElement('div');
      labelElement.className = 'key-label';
      labelElement.textContent = key.label;
      
      keyElement.appendChild(labelElement);
      pianoElement.appendChild(keyElement);
    });
    
    // Luego crear las teclas negras superpuestas
    const blackKeys = keys.filter(key => key.type === 'black');
    blackKeys.forEach(key => {
      const keyElement = document.createElement('div');
      keyElement.className = 'key black';
      keyElement.dataset.index = keys.findIndex(k => k.note === key.note);
      
      // Posicionar la tecla negra
      const whiteKeyWidth = 100 / whiteKeys.length;
      const position = key.position / 100 * (whiteKeys.length - 1) * whiteKeyWidth;
      keyElement.style.left = position + '%';
      
      const labelElement = document.createElement('div');
      labelElement.className = 'key-label';
      labelElement.textContent = key.label;
      
      keyElement.appendChild(labelElement);
      pianoElement.appendChild(keyElement);
    });
  }
  
  // Función para manejar el toque o clic en una tecla
  function handleKeyPress(index) {
    if (index >= 0 && index < keys.length) {
      const key = keys[index];
      const keyElement = document.querySelector(`.key[data-index="${index}"]`);
      
      if (keyElement) {
        // Efecto visual
        keyElement.classList.add('pressed');
        setTimeout(() => {
          keyElement.classList.remove('pressed');
        }, 300);
        
        // Reproducir sonido
        playNote(key.freq);
      }
    }
  }
  
  // Event listeners para interfaces táctiles
  function addTouchListeners() {
    const keyElements = document.querySelectorAll('.key');
    keyElements.forEach(key => {
      key.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const index = parseInt(this.dataset.index);
        handleKeyPress(index);
      }, { passive: false });
    });
  }
  
  // Event listeners para clics del ratón
  function addMouseListeners() {
    const keyElements = document.querySelectorAll('.key');
    keyElements.forEach(key => {
      key.addEventListener('mousedown', function() {
        const index = parseInt(this.dataset.index);
        handleKeyPress(index);
      });
    });
  }
  
  // Event listener para el teclado (teclas numéricas)
  function addKeyboardListeners() {
    document.addEventListener('keydown', function(e) {
      if (e.key in keyboardMap) {
        const index = keyboardMap[e.key];
        handleKeyPress(index);
      }
    });
  }
  
  // Inicializar todo
  window.addEventListener('DOMContentLoaded', function() {
    createPiano();
    addTouchListeners();
    addMouseListeners();
    addKeyboardListeners();
  });