const audio = document.querySelector("#custom-audio-player");
// creating a constant variable, naming it 'audio/audio'
const playPauseBtn = document.querySelector("#play-pause-btn");
const playPauseImg = document.querySelector("#play-pause-img");
const progressBarFill = document.querySelector("#progress-bar-fill");
// added the progress bar const with .progress-bar, since the progress bar needed the actual container and not the fill inside of it.
const progressBar = document.querySelector(".progress-bar");
// removed 'default controls remover' here, since reset.css does most of that already.

// creating the canvas constant in JS
const canvas = document.querySelector("#visual-canvas");
// scope is now 2D.
const ctx = canvas.getContext("2d");
// make canvas match the display size
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

audio.addEventListener("timeupdate", updateProgressBar);
// playPauseBtn.addEventListener("click", togglePlayPause);
// this prints the 'audio' thats been defined in line 1 to be printed into the console, or the html page.
function togglePlayPause() {
  if (audio.paused || audio.ended) {
    audio.play();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
  } else {
    audio.pause();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
  }
}
function updateProgressBar() {
  const value = (audio.currentTime / audio.duration) * 100;
  progressBarFill.style.width = value + "%";
  //Updates only the fill element of the container of the entire progress bar.
}

// Add other functionalities here

//This is what allows the progress bar to be clickable and -draggable-
let isDragging = false;
// simple assign to default isDragging to be false. Fixes simple errors such as variables being undefined.
function clickProgressBar(event) {
  // in between the brackets, it needs to accept a parameter
  const rect = progressBar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  // starts reading from the left of the progress bar, and then it divides the click on the X axis by the width.
  const percentage = clickX / rect.width;
  // calculating the percentage of the bar and where its been clicked
  console.log("Clicked at this" + percentage)
  //prints the percentage in 0.00000 form in the console, this was to debug and check if the original idea was working.
  if (audio.duration) {
    audio.currentTime = (percentage) * audio.duration;
  }
}

//this is creating the seeking of dragging along the progress bar.
function seek(event) {
  const rect = progressBar.getBoundingClientRect();
  //assigning logic to the function, thus click and drag
  let x = event.clientX - rect.left;
  //clamps or constrains it to the bar
  x = Math.max(0, Math.min(x, rect.width));
  const percentage = x / rect.width;
  // defaulting the constant to be that dragging is set to false.
  if (!isNaN(audio.duration)) {
    audio.currentTime = percentage * audio.duration;
  }

}
// calling the function without creating/naming a new one
// creating an event listener for all three different type of mouse interactions.
progressBar.addEventListener("mousedown", (e) => {
  progressBar.style.cursor = "grabbing";
  isDragging = true;
  audio.muted = true; //pauses the audio instantly when dragging becomes true, removes audio breaking effect.
  seek(e);

  document.body.style.userSelect = "none"; 
  // stop the outside progress bar jittering.
});
window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  seek(e)
});
window.addEventListener("mouseup", () => {
  // mouseup function is global instead of being constrained to the progress bar.
  isDragging = false;
  audio.muted = false; //music starts playing again on release.
  progressBar.style.cursor = "pointer";
  document.body.style.userSelect = "";
});
window.addEventListener("mouseleave", () => {
  isDragging = false;
  audio.muted = false;
  progressBar.style.cursor = "pointer";
  document.body.style.userSelect = "";
});

//animation loop
function animate() {
  requestAnimationFrame(animate);

  if (!audio.duration) return;
  
  // creating value 0 to 1 is start and end of the audio file.
  // this links it.
  const progress = audio.currentTime / audio.duration;

  draw(progress);
}

//making functions for the transitioning gradients
// lerp stands for 'linear interpolation', 'give me a value beetween x and y'.
// a is the start value
// b is the end value
// t is how far in between
// t is a percentage, but we enter it in it's values as decimals, e.g: 0.5 or 0.88
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// colour converting 
function lerpColor(c1, c2, t) {
  const r = Math.round(lerp(c1.r, c2.r, t));
  const g = Math.round(lerp(c1.g, c2.g, t));
  const b = Math.round(lerp(c1.b, c2.b, t));
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
  const num = parseInt(hex.slice(1), 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

// The first moving visual is here:
function draw(progress) {
  const w = canvas.width;
  const h = canvas.height;
  // progress is the 'scrub' bar value. Or progress bar's progress.
  ctx.clearRect(0, 0, w, h);

  //background
  //ctx.fillStyle = "#87ceeb";
  //ctx.fillRect(0, 0, w, h);

  // we are 1 third of the way through the video/audio
  //if(progress < 0.33) { //using the progress event (funcion) here lets us take advantage of the event we created already.
    //sunrise!!
    //topColor = "#ff9a9e";
    //bottomColor = "#fad0c4";
  //} else if (progress < 0.66) {
    //midday!!
    //topColor = "#87ceeb";
    //bottomColor = "#e0f7ff";
  //} else {
    //SUNSET!!
    //topColor = "#fbc2eb";
    //bottomColor = "#a18cd1";
  //}

  //Making the sky gradient, replacing just 'blue sky' colour.
  const skyGradient = ctx.createLinearGradient(0, 0, 0, h);

  //simple blends, sunrise, midday, sunset.
  let topColor, bottomColor;

  const sunriseTop = hexToRgb("#054f80");
  const sunriseBottom = hexToRgb("#a48177");

  const middayTop = hexToRgb("#87ceeb");
  const middayBottom = hexToRgb("#a4b6bc");

  const sunsetTop = hexToRgb("#a18cd1");
  const sunsetBottom = hexToRgb("#c6513c");

  if (progress < 0.5) {
    // sunrise becoming midday
    const t = progress / 0.5;

  topColor = lerpColor(sunriseTop, middayTop, t);
  bottomColor = lerpColor(sunriseBottom, middayBottom, t);

  } else {
    // midday to sunset
    const t = (progress - 0.5) / 0.5;

    topColor = lerpColor(middayTop, sunsetTop, t);
    bottomColor = lerpColor(middayBottom, sunsetBottom, t);
  }

  skyGradient.addColorStop(0, topColor);
  skyGradient.addColorStop(1, bottomColor);

  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, w, h);

  //making sure the header doesn't overlap the canvas
  const headerOffset = 120;

  const usableHeight = h - headerOffset;
  const radius = usableHeight / 1.2;
  //the position and movement scope
  const centerX = w / 2; // adjust the pinpoint of the sun's movements
  const baseY = usableHeight
  // using pi, as our circle, this makes it so that it starts at half and ends at the other half.
  const angle = Math.PI * progress;

  const x = centerX + radius * Math.cos(angle + Math.PI);
  const y = (h - headerOffset) - radius * Math.sin(angle);
  
  //draw THE SUN
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
  
  //draw THE HILLS
  //its no longer hills
  //we're drawing an ocean now.
  const oceanTop = h * .82;
  const oceanGrad = ctx.createLinearGradient(0, oceanTop, 0, h);
  // the gradient only matters vertically for the ocean

  oceanGrad.addColorStop(0, "#0c6893"); //light
  oceanGrad.addColorStop(0.5, "#0d567e"); //mid way, its medium depth
  oceanGrad.addColorStop(1, "#041420"); //deep oceans

  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, oceanTop, w, h - oceanTop);

  const waveBase = oceanTop;

  ctx.beginPath();
  ctx.moveTo(0, waveBase);

  for (let x=0; x <= w; x += 1) {
    const wave = 
      Math.sin(x * 0.01 + progress * 5) * 8; //ripples

    ctx.lineTo(x, waveBase + wave);
  }

  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();

  //ripples fill
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.fill();

    //reflection from the SUN
  const reflectionW = 100; //width
  const reflectionH = 140; //height

  const shimmerOffset = Math.sin(progress * 15) * 10;

  const left = Math.max(0, x + shimmerOffset - reflectionW / 2.2); //left side adjust
  const right = Math.min(w, x + shimmerOffset + reflectionW / 2.2); //right side adjust

  const reflectionGrad = ctx.createLinearGradient(
    x + shimmerOffset, waveBase,
    x + shimmerOffset, waveBase + reflectionH
  );

  reflectionGrad.addColorStop(0, "rgba(255,255,255,0.4)");
  reflectionGrad.addColorStop(1, "rgba(255,255,255,0)");

  ctx.beginPath();
  ctx.moveTo(left, waveBase);
  //under the sun strip
  for (let xPos = left; xPos <= right; xPos += 10) {
    const t = (xPos - left) / (right - left);
    const edgeFade = Math.sin(t * Math.PI); //smoother edge fade

    const wave =
      Math.sin(xPos * 0.005 + progress * 3) * 0.01 * edgeFade;
    
    ctx.lineTo(xPos, waveBase + wave);
  }
  ctx.lineTo(right, h);
  ctx.lineTo(left, h);
  ctx.closePath();

  ctx.fillStyle = reflectionGrad;
  ctx.fill();

}

animate();