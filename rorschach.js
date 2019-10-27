/**
 * Renders a Rorschach ink blot into a canvas
 * @param {HTMLCanvasElement} canvas
 * @param {object} [options]
 * @param {number} [options.blots] how many ink blots to render
 * @param {number} [options.iterations] how many passes to let the ink bleed
 */
function renderRorschachInkBlot (canvas, {
  blots = randInt(10, 100),
  iterations = 50
} = {}) {
  const width = canvas.width * 0.525; // A little bigger than half the width so the mirroring looks good
  const height = canvas.height;

  // Initialize an empty grid of pixels for half the scene
  const pixels = new Array(height).fill(true).map(() => new Array(width).fill(0));

  // Convenience methods to get and set pixels while we work
  const get = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return 0;
    }
    return pixels[y][x];
  };

  const set = (x, y, value) => {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      pixels[y][x] = value;
    }
  };

  // Throw a bunch of seed blots onto the scene
  let lastLocation = [randInt(0, width), randInt(0, height)];
  for (let i = 0; i < blots; i++) {
    const nextLocation = Math.random() < 0.9
      ? lastLocation.map(v => v + (randInt(0, 50) - 25))
      : [randInt(0, width), randInt(0, height)];
    set(...nextLocation, randInt(1, Math.pow(iterations, 4)));
    lastLocation = nextLocation;
  }

  // Blend each pixel into those around it several times
  for (let i = 0; i < iterations; i++) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const self = get(x, y);
        const n = get(x, y - 1);
        const ne = get(x + 1, y - 1);
        const e = get(x + 1, y);
        const se = get(x + 1, y + 1);
        const s = get(x, y + 1);
        const sw = get(x - 1, y + 1);
        const w = get(x - 1, y);
        const nw = get(x - 1, y - 1);
        set(x, y, (self + n + ne + e + se + s + sw + w + nw) / 9);
      }
    }
  }

  // Fade the edges
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (get(x, y) < iterations * 0.25) {
        set(x, y, 0);
      }
    }
  }

  // Draw the ink blots to the canvas
  const ctx = canvas.getContext('2d');
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width / 2; x++) {
      const value = get(x, y);
      ctx.fillStyle = `rgba(0, 0, 0, ${value / iterations})`;
      ctx.fillRect(x, y, 1, 1);
      ctx.fillRect(canvas.width - (x + 1), y, 1, 1);
    }
  }
}

function randInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}