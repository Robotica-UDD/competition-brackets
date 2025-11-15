import { Howl } from 'howler';

// Asegúrate de tener estos archivos de audio en la carpeta /public/sounds/
export const playSound = (sound: keyof typeof sounds) => {
  sounds[sound]?.play();
};

const sounds = {
  silbato: new Howl({ src: ['/sounds/silbato.mp3'], volume: 0.7 }),
  goal: new Howl({ src: ['/sounds/goal1.mp3'], volume: 0.7 }),
  fin: new Howl({ src: ['/sounds/fin.mp3'], volume: 0.7 }),
  start: new Howl({ src: ['/sounds/start.mp3'], volume: 0.7 }),
  winner: new Howl({ src: ['/sounds/winner.mp3'], volume: 0.7 }),
};