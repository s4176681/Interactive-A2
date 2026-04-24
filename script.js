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

//This is what allows the progress bar to be clickable
function clickProgressBar(event) {
  // in between the brackets, it needs to accept a parameter
  const rect = progressBar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  // starts reading from the left of the progress bar, and then it divides the click on the X axis by the width.
  const percentage = clickX / rect.width;
  // calculating the percentage of the bar and where its been clicked
  console.log("Clicked at this" + percentage)
  //prints the percentage in 0.00000 form in the console.
  if (audio.duration) {
    audio.currentTime = (percentage) * audio.duration;
  }
}
