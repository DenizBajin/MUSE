// Global variables
let selectedCircle = null;

// Initial colors for the large circles (HSL values)
let color1HSL = { h: 0, s: 100, l: 50 }; // Red (H: 0, S: 100, L: 50)
let color2HSL = { h: 60, s: 100, l: 50 }; // Yellow (H: 60, S: 100, L: 50)
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
  const color1Name = Object.keys(colorValues).find(
    key => colorValues[key].h === color1HSL.h &&
           colorValues[key].s === color1HSL.s &&
           colorValues[key].l === color1HSL.l
  );
  if (color1Name && audioTracks[color1Name]) {
    audioTracks[color1Name].play();
  }

  // Play audio for the right circle color
  const color2Name = Object.keys(colorValues).find(
    key => colorValues[key].h === color2HSL.h &&
           colorValues[key].s === color2HSL.s &&
           colorValues[key].l === color2HSL.l
  );
  if (color2Name && audioTracks[color2Name]) {
    audioTracks[color2Name].play();
  }
}

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

// Function to update the mixed color display in the middle circle
function updateMixedColorDisplay() {
  const mixedColorHSL = mixHSLColors(color1HSL, color2HSL);
  const rgb = hslToRgb(mixedColorHSL.h, mixedColorHSL.s, mixedColorHSL.l);
  document.getElementById('savedColors').style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

// Event listener for the color palette
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

function updateActiveAudio(color) {
  if (audioTracks[color]) {
    activeAudio = audioTracks[color];
    console.log(`Active audio set to: ${color}`);
  } else {
    console.warn(`No audio found for color: ${color}`);
    activeAudio = null;
  }
}


// Event listeners for sliders

//tint - speed slider

//needs to be reversed
document.getElementById('color1tint').addEventListener('input', (event) => {
  //const speed = Math.min(2,Math.max(0.5, parseFloat(event.target.value)/50));
  color1HSL.l = Math.min(100, Math.max(50, parseInt(event.target.value)));
  updateCircleColor('circle1', color1HSL);
  updateMixedColorDisplay();
  const speed = Math.min(2, Math.max(0.5, parseFloat(event.target.value) / 50)); // Map value to 0.5–2 range
  if (activeAudio) {
    activeAudio.playbackRate = speed;
    console.log(`Speed (Tint) for active audio set to: ${speed}`);
  }
});


document.getElementById('color1saturation').addEventListener('input', (event) => {
  color1HSL.s = Math.min(100, Math.max(0, parseInt(event.target.value)));
  updateCircleColor('circle1', color1HSL);
  updateMixedColorDisplay();
  const volumeValue = parseInt(event.target.value) / 100;  // Convert slider value to 0-1 range
  if (activeAudio) {
    activeAudio.volume = volumeValue;  // Adjust the volume of the active audio
    console.log(`Volume for active audio set to: ${volumeValue * 100}%`);
  }
});

//TODO: Figure out how tint and shade should relate
document.getElementById('color1shade').addEventListener('input', (event) => {
  color1HSL.l = Math.min(50, Math.max(0, parseInt(event.target.value)));
  updateCircleColor('circle1', color1HSL);
  updateMixedColorDisplay();
});

//TODO: make lightness dependent on tint - shade
document.getElementById('color2tint').addEventListener('input', (event) => {
  color2HSL.l = Math.min(100, Math.max(50, parseInt(event.target.value)));
  updateCircleColor('circle2', color2HSL);
});

document.getElementById('color2shade').addEventListener('input', (event) => {
  color2HSL.l = Math.min(50, Math.max(0, parseInt(event.target.value)));
  updateCircleColor('circle2', color2HSL);
});

document.getElementById('color2saturation').addEventListener('input', (event) => {
  color2HSL.s = Math.min(100, Math.max(0, parseInt(event.target.value)));
  updateCircleColor('circle2', color2HSL);
});

const colorCircles = document.querySelectorAll('.color-circle');

colorCircles.forEach(circle => {
  circle.addEventListener('click', (event) => {
    const selectedColor = event.target.getAttribute('data-color');
    updateActiveAudio(selectedColor); // Update the active audio
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
