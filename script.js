const container = document.querySelector('#container');
const canvas = document.querySelector('#canvas1');
const file = document.querySelector('#fileupload');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

let audioSource;
let analyser;

function getRandomHex() {
  return Math.round(Math.floor(Math.random() * 255 + 1));
}

file.addEventListener('change', () => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const files = file.files;
  let audio1 = document.querySelector('#audio1');
  audio1.src = URL.createObjectURL(files[0]);
  audio1.load();
  audio1.play();

  audioSource = audioCtx.createMediaElementSource(audio1);
  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 128;
  const bufferLength = analyser.frequencyBinCount; //fftsize/2
  const dataArray = new Uint8Array(bufferLength);

  const barWidth = canvas.width / bufferLength;
  let barHeight;
  let x;

  function animateBars() {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);

    drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);

    requestAnimationFrame(animateBars);
  }

  animateBars();
});

function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 1.5;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((i * Math.PI * 2) / bufferLength);
    // const r = i * (barHeight / 20);
    // const g = barHeight / 5;
    // const b = getRandomHex();
    const hue = i * 5;
    ctx.fillStyle = `hsl(${hue},100%,50%)`;
    ctx.fillRect(0, 0, barWidth, barHeight);
    x += barWidth;
    ctx.restore();
  }
}
