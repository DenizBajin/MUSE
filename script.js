// Global variables to track the selected circle (left or right)
let selectedCircle = null;

// Initial colors for the large circles (HSL values)
let color1HSL = { h: 0, s: 100, l: 50 }; // Red (H: 0, S: 100, L: 50)
let color2HSL = { h: 60, s: 100, l: 50 }; // Yellow (H: 60, S: 100, L: 50)

// Audio elements for the tracks associated with colors
const audioTracks = {
  red: new Audio('drums.m4a'), // Corrected path
  yellow: new Audio('piano.m4a'),
  blue: new Audio('piano2.m4a'),
  green: new Audio('piano3.m4a'),
  orange: new Audio('piano4.m4a'),
  purple: new Audio('piano5.m4a'),
};

// Function to stop all audio tracks
function stopAllAudio() {
  Object.values(audioTracks).forEach(track => track.pause());
}

// Function to convert HSL to RGB
function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  
  let r, g, b;
  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

// Function to update the color of the circle based on HSL values
function updateCircleColor(circleId, hsl) {
  const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  const color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  document.getElementById(circleId).style.backgroundColor = color;
}

// Function to update sliders based on the color's HSL values
function updateSliders() {
  if (selectedCircle === 'circle1') {
    document.getElementById('color1tint').value = color1HSL.l + 10;
    document.getElementById('color1shade').value = color1HSL.l - 10;
    document.getElementById('color1saturation').value = color1HSL.s;
  } else if (selectedCircle === 'circle2') {
    document.getElementById('color2tint').value = color2HSL.l + 10;
    document.getElementById('color2shade').value = color2HSL.l - 10;
    document.getElementById('color2saturation').value = color2HSL.s;
  }
}

// Function to handle clicking on a large circle (left or right)
document.querySelectorAll('.circle').forEach(circle => {
  circle.addEventListener('click', (event) => {
    // Track which circle was clicked
    selectedCircle = event.target.id;
  });
});

// Function to handle clicking on a color palette and change the large circle's color
document.querySelectorAll('.color-circle').forEach(circle => {
  circle.addEventListener('click', () => {
    const selectedColor = circle.getAttribute('data-color');
    if (selectedCircle === 'circle1') {
      color1HSL = { ...color1HSL, ...colorValues[selectedColor] };
      updateCircleColor('circle1', color1HSL);
    } else if (selectedCircle === 'circle2') {
      color2HSL = { ...color2HSL, ...colorValues[selectedColor] };
      updateCircleColor('circle2', color2HSL);
    }

    // Stop any currently playing audio
    stopAllAudio();

    // Play the audio associated with the selected color
    audioTracks[selectedColor].play();

    // Update sliders based on the selected color
    updateSliders();
  });
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

// Event listeners for sliders to adjust color properties
document.getElementById('color1tint').addEventListener('input', (event) => {
  color1HSL.l = Math.min(100, Math.max(0, parseInt(event.target.value)));
  updateCircleColor('circle1', color1HSL);
});

document.getElementById('color1shade').addEventListener('input', (event) => {
  color1HSL.l = Math.min(100, Math.max(0, parseInt(event.target.value)));
  updateCircleColor('circle1', color1HSL);
});

document.getElementById('color1saturation').addEventListener('input', (event) => {
  color1HSL.s = Math.min(100, Math.max(0, parseInt(event.target.value)));
  updateCircleColor('circle1', color1HSL);
});

document.getElementById('color2tint').addEventListener('input', (event) => {
  color2HSL.l = Math.min(100, Math.max(0, parseInt(event.target.value)));
  updateCircleColor('circle2', color2HSL);
});

document.getElementById('color2shade').addEventListener('input', (event) => {
  color2HSL.l = Math.min(100, Math.max(0, parseInt(event.target.value)));
  updateCircleColor('circle2', color2HSL);
});

document.getElementById('color2saturation').addEventListener('input', (event) => {
  color2HSL.s = Math.min(100, Math.max(0, parseInt(event.target.value)));
  updateCircleColor('circle2', color2HSL);
});
