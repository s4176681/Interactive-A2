const audio = document.querySelector("#custom-audio-player");
// creating a constant variable, naming it 'audio/audio'
const playPauseBtn = document.querySelector("#play-pause-btn");
const playPauseImg = document.querySelector("#play-pause-img");
const progressBarFill = document.querySelector("#progress-bar-fill");
// added the progress bar const with .progress-bar, since the progress bar needed the actual container and not the fill inside of it.
const progressBar = document.querySelector(".progress-bar");
// removed 'default controls remover' here, since reset.css does most of that already.
// playPauseBtn.addEventListener("click", togglePlayPause);
// this prints the 'audio' thats been defined in line 1 to be printed into the console, or the html page.
audio.addEventListener("timeupdate", updateProgressBar);
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
})

