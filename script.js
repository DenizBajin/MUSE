// Global variables to track the selected circle (left or right)
let selectedCircle = null;

// Initial colors for the large circles (HSL values)
let color1HSL = { h: 0, s: 100, l: 50 }; // Red
let color2HSL = { h: 60, s: 100, l: 50 }; // Yellow

// Audio elements for the tracks associated with colors
const audioTracks = {
  red: new Audio('drums.m4a'),
  yellow: new Audio('piano.m4a'),
  blue: new Audio('piano2.m4a'),
  green: new Audio('piano3.m4a'),
  orange: new Audio('piano4.m4a'),
  purple: new Audio('piano5.m4a'),
};

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

// Function to convert HSL to RGB for color display
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

// Function to update the color of a large circle
function updateCircleColor(circleId, hsl) {
  const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  document.getElementById(circleId).style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

// Function to play audio based on the current color of each circle
function playAudioBasedOnSelection() {
  // Get the color name for each circle based on HSL values
  const color1Audio = Object.keys(colorValues).find(
    key => colorValues[key].h === color1HSL.h && colorValues[key].s === color1HSL.s && colorValues[key].l === color1HSL.l
  );
  const color2Audio = Object.keys(colorValues).find(
    key => colorValues[key].h === color2HSL.h && colorValues[key].s === color2HSL.s && colorValues[key].l === color2HSL.l
  );

  // Stop any currently playing audio
  stopAllAudio();

  // Play audio for circle 1 if it has a color selected
  if (color1Audio && audioTracks[color1Audio]) {
    audioTracks[color1Audio].play();
  }

  // Play audio for circle 2 if it has a color selected
  if (color2Audio && audioTracks[color2Audio]) {
    audioTracks[color2Audio].play();
  }
}

// Function to handle clicking on a color palette and change the large circle's color
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

    // Play audio based on the current selection of each circle
    playAudioBasedOnSelection();
  });
});

// Function to track which circle is selected
document.querySelectorAll('.circle').forEach(circle => {
  circle.addEventListener('click', (event) => {
    selectedCircle = event.target.id;
  });
});
