// Global variables
let selectedCircle = "circle1";
let circle1Audio = null;
let circle2Audio = null;

// Initial colors for the large circles (HSL values)
let color1HSL = { h: 0, s: 0, l: 100 }; // Red (H: 0, S: 100, L: 50)
let color2HSL = { h: 0, s: 0, l: 100 }; // Yellow (H: 60, S: 100, L: 50)
let currentMixedColor = null;
let currentMixedAudio = null; //THE LOGIC FOR THIS IS WRONG RIGHT NOW WORKING ON IT
//console.log ("heygurl"); fun lil print statement

// Audio elements for the tracks associated with colors
const audioTracks = {
  red: new Audio('drums.m4a'),
  yellow: new Audio('piano.m4a'),
  blue: new Audio('piano2.m4a'),
  green: new Audio('piano3.m4a'),
  orange: new Audio('piano4.m4a'),
  purple: new Audio('piano5.m4a'),
};
//let activeAudio = null;



// Set each audio track to loop
Object.values(audioTracks).forEach(track => {
  track.loop = true;
});

// Object mapping color names to HSL values
const colorValues = {
  red: { h: 0, s: 100, l: 50 },
  yellow: { h: 60, s: 100, l: 50 },
  blue: { h: 240, s: 100, l: 50 },
  green: { h: 120, s: 100, l: 50 },
  orange: { h: 30, s: 100, l: 50 },
  purple: { h: 270, s: 100, l: 50 },
};

// Function to stop all audio tracks
function stopAllAudio() {
  Object.values(audioTracks).forEach(track => {
    track.pause();
    track.currentTime = 0; // Reset to the beginning
  });
}

// Function to play audio for selected colors
function playSelectedAudio() {
  // Stop audio only for tracks that are not currently selected
  Object.entries(audioTracks).forEach(([color, track]) => {
    const isPlayingForCircle1 = colorValues[color].h === color1HSL.h &&
                                colorValues[color].s === color1HSL.s &&
                                colorValues[color].l === color1HSL.l;

    const isPlayingForCircle2 = colorValues[color].h === color2HSL.h &&
                                colorValues[color].s === color2HSL.s &&
                                colorValues[color].l === color2HSL.l;

    if (!isPlayingForCircle1 && !isPlayingForCircle2) {
      track.pause();
      track.currentTime = 0; // Reset to the beginning
    }
  });

  // Play audio for the left circle color
  let audioTrackLeft = null; //REMOVE EVENTUALLY
  const color1Name = Object.keys(colorValues).find(
    key => colorValues[key].h === color1HSL.h &&
           colorValues[key].s === color1HSL.s &&
           colorValues[key].l === color1HSL.l
  );
  if (color1Name && audioTracks[color1Name]) {
    audioTrackLeft = audioTracks[color1Name];
    audioTracks[color1Name].play();
  }

  // Play audio for the right circle color
  let audioTrackRight = null; //REMOVE EVENTUALLY
  const color2Name = Object.keys(colorValues).find(
    key => colorValues[key].h === color2HSL.h &&
           colorValues[key].s === color2HSL.s &&
           colorValues[key].l === color2HSL.l
  );
  if (color2Name && audioTracks[color2Name]) {
    audioTrackRight = audioTracks[color2Name];
    audioTracks[color2Name].play();
  }
  currentMixedAudio= [audioTrackLeft, audioTrackRight]; //DOESNT WORK CAUSE ALL AUDIOS BECOME PART OF IT
}

// Event listeners for remove buttons
document.getElementById('removeLeftButton').addEventListener('click', () => {
  color1HSL = { h: 0, s: 0, l: 100 }; // Reset to white
  updateCircleColor('circle1', color1HSL);
  updateCircleAudio()
  playSelectedAudio(); // Update audio playback
  updateMixedColorDisplay(); // Update mixed color display
});

document.getElementById('removeRightButton').addEventListener('click', () => {
  color2HSL = { h: 0, s: 0, l: 100 }; // Reset to white
  updateCircleColor('circle2', color2HSL);
  playSelectedAudio(); // Update audio playback
  updateMixedColorDisplay(); // Update mixed color display
});


// Function to update the color of a circle
function updateCircleColor(circleId, hsl) {
  const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  document.getElementById(circleId).style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

// Function to convert HSL to RGB
function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

// Function to mix two HSL colors
function mixHSLColors(hsl1, hsl2) {
  const mixedH = (hsl1.h + hsl2.h) / 2;  // Average the hues
  const mixedS = (hsl1.s + hsl2.s) / 2;  // Average the saturations
  const mixedL = (hsl1.l + hsl2.l) / 2;  // Average the lightness values
  return { h: mixedH, s: mixedS, l: mixedL };
}

//COLOR MIXING 
//SOURCE: https://stackoverflow.com/questions/14819058/mixing-two-colors-naturally-in-javascript

//colorChannelA and colorChannelB are ints ranging from 0 to 255
function colorChannelMixer(colorChannelA, colorChannelB, amountToMix){
  var channelA = colorChannelA*amountToMix;
  var channelB = colorChannelB*(1-amountToMix);
  return parseInt(channelA+channelB);
}
//rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0, hard coded to 0.5 to mix evenly
//example (red): rgbA = [255,0,0]
function colorMixer(rgbA, rgbB){
  var r = colorChannelMixer(rgbA[0],rgbB[0],0.5);
  var g = colorChannelMixer(rgbA[1],rgbB[1],0.5);
  var b = colorChannelMixer(rgbA[2],rgbB[2],0.5);
  //return "rgb("+r+","+g+","+b+")";
  return [r,g,b];
}

// Function to update the mixed color display in the middle circle
function updateMixedColorDisplay() {
  const color1RGB = hslToRgb(color1HSL.h, color1HSL.s, color1HSL.l);
  const color2RGB = hslToRgb(color2HSL.h, color2HSL.s, color2HSL.l);


  const rgb = colorMixer(color1RGB,color2RGB);
  currentMixedColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

  document.getElementById('savedColors').style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

document.getElementById('saveButton').addEventListener('click', saveMixedColor);

function saveMixedColor(){
  // Get saved colors or initialize an empty array
  if (!currentMixedColor) {
    console.log("No mixed color to save.");
    alert("No mixed color to save.");
    return;
  }
  let savedColors = JSON.parse(localStorage.getItem('savedColors')) || [];

  // Get audio names for the current mixed audio
  const audioNames = Object.keys(audioTracks).map(track => audioTracks[track].src.split('/').pop()); //LOOK AT THIS AGAIN


  if (!audioNames.every(name => name)) {
    console.log("One or more audio tracks are not associated with a name.");
    return;
  }

  const colorExists = savedColors.some(savedColor => savedColor.color === currentMixedColor);

  if (colorExists) {
    console.log("Color already saved.");
    alert("Color already saved.")
    return; // Do not save the color if it's already in the list
  }
  // Add the new color to the saved colors
  savedColors.push({ color: currentMixedColor, audio: currentMixedAudio }); //CANNOT SEND CURRENT MIXEDAUDIO HERE THIS SAVED COLORS IS PUSHED TO LOCAL STORAGE
  // Keep only the last 20 colors (or any limit you choose)
  while (savedColors.length > 20) {
    console.log('Removing oldest color:', savedColors[0]);
    savedColors.shift();
}

// Event listener for the color palette'
 // Save the updated array back to localStorage
 localStorage.setItem('savedColors', JSON.stringify(savedColors));
  // Reload saved colors on the page
  loadSavedColors();
  console.log('Color and audio saved successfully:', currentMixedColor);
  alert("color/audio saved successfully")
}
// Event listener for the color palette

function isActiveCircle(circleId) {
  return selectedCircle === circleId; // Check if the currently active circle matches
}
// Function to update the active circle (and its visuals)
function setActiveCircle(circleId) {
  selectedCircle = circleId;
  document.querySelectorAll('.color-circle').forEach(circle => {
    circle.classList.remove('active'); // Remove active class from all circles
  });
  document.getElementById(circleId).classList.add('active'); // Add active class to the selected circle

  // enable / disable sliders when other disk is clicked
  if (selectedCircle == "circle1") {
    enableSlider = true;
  } else {
    enableSlider = false;
  }
  
  const tintSlider1 = document.getElementById('color1tint');
    tintSlider1.disabled = !enableSlider;
  const tintSaturation1 = document.getElementById('color1saturation');
    tintSaturation1.disabled = !enableSlider;
  
  const tintSlider2 = document.getElementById('color2tint');
    tintSlider2.disabled = enableSlider;
  const tintSaturation2 = document.getElementById('color2saturation');
    tintSaturation2.disabled = enableSlider;
  }


// Event listener for the color palette'
document.querySelectorAll('.color-circle').forEach(circle => {
  circle.addEventListener('click', () => {
    const selectedColor = circle.getAttribute('data-color');
    if (selectedCircle === 'circle1') {
      color1HSL = { ...colorValues[selectedColor] };
      updateCircleColor('circle1', color1HSL);
    } else if (selectedCircle === 'circle2') {
      color2HSL = { ...colorValues[selectedColor] };
      updateCircleColor('circle2', color2HSL);
    }

    // Update the mixed color display and play selected audio
    updateMixedColorDisplay();
    playSelectedAudio();
  });
});

// Event listener for large circle selection
document.querySelectorAll('.circle').forEach(circle => {
  circle.addEventListener('click', (event) => {
    selectedCircle = event.target.id;
  });
});

// Event listeners for remove buttons
document.getElementById('removeLeftButton').addEventListener('click', () => {
  color1HSL = { h: 0, s: 0, l: 100 }; // Reset to white
  updateCircleColor('circle1', color1HSL);
  playSelectedAudio(); // Update audio playback
  updateMixedColorDisplay(); // Update mixed color display
});

document.getElementById('removeRightButton').addEventListener('click', () => {
  color2HSL = { h: 0, s: 0, l: 100 }; // Reset to white
  updateCircleColor('circle2', color2HSL);
  playSelectedAudio(); // Update audio playback
  updateMixedColorDisplay(); // Update mixed color display
});

// Ensure both circles are white when the page loads
window.onload = function() {
  updateCircleColor('circle1', color1HSL);
  updateCircleColor('circle2', color2HSL);
  updateMixedColorDisplay();
};

//getting the sliders to work for sound too
let activeAudio = null;

function updateActiveAudio(circleId, color) {
  if (audioTracks[color]) {
    if (circleId == 'circle1'){
      circle1Audio = audioTracks[color];
      console.log(`Circle 1 audio set to: ${color}`);
    } else if (circleId === 'circle2'){
      circle2Audio = audioTracks[color];
      console.log(`Circle 2 audio set to: ${color}`);
    }
    //activeAudio = audioTracks[color];
    //console.log(`Active audio set to: ${color}`);
  } else {
    console.warn(`No audio found for color: ${color}`);
    //activeAudio = null;
  }
}


// Event listeners for sliders
// Initialize by making Circle 1 active on load
document.addEventListener('DOMContentLoaded', () => {
  setActiveCircle('circle1');
});

// Event listeners for Circle selection
document.getElementById('circle1').addEventListener('click', () => setActiveCircle('circle1'));
document.getElementById('circle2').addEventListener('click', () => setActiveCircle('circle2'));

//tint - speed slider

//needs to be reversed
document.getElementById('color1tint').addEventListener('input', (event) => {
if (isActiveCircle('circle1')&& circle1Audio){
  //const speed = Math.min(2,Math.max(0.5, parseFloat(event.target.value)/50));
  color1HSL.l = Math.min(100, Math.max(0, parseInt(event.target.value)));
  updateCircleColor('circle1', color1HSL);
  updateMixedColorDisplay();
  
  const speed = Math.min(2, Math.max(0.5, parseFloat(event.target.value) / 50)); // Map value to 0.5–2 range
    circle1Audio.playbackRate = speed;
    console.log(`Speed (Tint) for active audio set to: ${speed}`);

}
});


document.getElementById('color1saturation').addEventListener('input', (event) => {
  if (isActiveCircle('circle1') && circle1Audio){
  color1HSL.s = Math.min(100, Math.max(0, parseInt(event.target.value)));
  updateCircleColor('circle1', color1HSL);
  updateMixedColorDisplay();
  const volumeValue = parseInt(event.target.value) / 100;  // Convert slider value to 0-1 range
    circle1Audio.volume = volumeValue;  // Adjust the volume of the active audio
    console.log(`Volume for active audio set to: ${volumeValue * 100}%`);
  
}
});

document.getElementById('color2tint').addEventListener('input', (event) => {
  if (isActiveCircle('circle2')&& circle2Audio){
  color2HSL.l = Math.min(100, Math.max(50, parseInt(event.target.value)));
  updateCircleColor('circle2', color2HSL);
  updateMixedColorDisplay();

  const speed = Math.min(2, Math.max(0.5, parseFloat(event.target.value) / 50)); // Map value to 0.5–2 range
    circle2Audio.playbackRate = speed;
      console.log(`Speed (Tint) for Circle 2 audio set to: ${speed}`);
    
  }
});

document.getElementById('color2saturation').addEventListener('input', (event) => {
  if (isActiveCircle('circle2')&& circle2Audio){
  color2HSL.s = Math.min(100, Math.max(0, parseInt(event.target.value)));
  updateCircleColor('circle2', color2HSL);
  updateMixedColorDisplay();
  const volumeValue = parseInt(event.target.value) / 100;  // Convert slider value to 0-1 range
    circle2Audio.volume = volumeValue;  // Adjust the volume of the active audio
    console.log(`Volume for active audio set to: ${volumeValue * 100}%`);
  
}
});


const colorCircles = document.querySelectorAll('.color-circle');

colorCircles.forEach(circle => {
  circle.addEventListener('click', (event) => {
    const selectedColor = event.target.getAttribute('data-color');
    updateActiveAudio(selectedCircle, selectedColor); // Update the active audio
  });
});

//adding click funtionality to both circles
const circle1ne = document.querySelector("#circle1");
const circle2wo = document.querySelector("#circle2");
const clickcircles = [circle1ne, circle2wo]

console.log(clickcircles);

// Add a click event listener to the circle
clickcircles.forEach(circle => {
  console.log (circle);

  circle.addEventListener("click", function() {
    // Remove 'active' class from all circles to reset animations
    clickcircles.forEach(c => c.classList.remove("active"));
    
    
    // Add 'active' class to the clicked circle to start the animation
    this.classList.add("active");
    console.log ("onclick toggled");
  });
});

// Automatically set the left circle (circle1) as active on page load
document.addEventListener("DOMContentLoaded", function() {
  // Add 'active' class to the left circle (circle1)
  circle1ne.classList.add("active");

  const selectedColor = circle1.dataset.color; // assuming you use a data-color attribute
  updateActiveAudio(selectedCircle, selectedColor); 
  console.log("Left circle is active on page load");
});