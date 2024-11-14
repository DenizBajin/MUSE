// Global variables
let selectedCircle = null;

// Initial HSL values for the circles
let color1HSL = { h: 0, s: 0, l: 100 }; // White
let color2HSL = { h: 0, s: 0, l: 100 }; // White

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
  stopAllAudio(); // Stop any audio not currently selected

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
