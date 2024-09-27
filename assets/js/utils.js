import { cnv } from "./globals";

// TODO : remove idx from pixelate()

function getRedFromCoords(x, y, width) {
  return ~~(4*(y*width+x));
}

export function getClientCoords(e) {
  if (e.touches) {
    return [
      e.touches[0].clientX,
      e.touches[0].clientY,
    ];
  } else {
    return [e.clientX, e.clientY]
  }
}

export async function loadImg(path) {
  const img = new Image();
  img.src = path;

  return new Promise((res, rej) => {
    img.addEventListener("load", () => {
      res(img);
    });

    img.addEventListener("error", e => {
      rej(e);
    });
  });
}

export function pixelate(cnv, row, col) {
  const ctx = cnv.getContext("2d");
  const { data } = ctx.getImageData(0, 0, cnv.width, cnv.height);
  const newData = [];

  let idx = 0

  for (let y = 0; y < cnv.height; y += row) {
    for (let x = 0; x < cnv.width; x += col) {
      const red_i = getRedFromCoords(x, y, cnv.width);
      
      const red = data[red_i];
      const green = data[red_i + 1];
      const blue = data[red_i + 2];

      newData.push({
        color: [red, green, blue],
        x, y,
        i: idx++
      })
    }
  }

  return newData;
}

export function chunk({
  data, x, y, width, cell, chunkDimX, chunkDimY
} = {}) {
  const chunkData = [];
  const height = Math.ceil(data.length / width);
  const base_idx = x + y*width;

  let color, index;
  
  for (let i = 0; i < chunkDimY; i++) {
    for (let j = 0; j < chunkDimX; j++) {
      if (x + j < 0 || x + j + 1 > width || y + i < 0 || y + i >= height) {
        color = [0, 0, 0];
        index = -1;
      } else {
        const idx = base_idx + i*width + j;
        color = data[idx].color;
        index = data[idx].i;
      }

      chunkData.push({ color, index });
    }
  }

  return chunkData;
}

function color_mult(color, s) {
  return color.map(c => c*s);
}

function color_sum(...colors) {
  const color = colors.reduce((c1, c2) => [c1[0] + c2[0], c1[1] + c2[1], c1[2] + c2[2]], [0, 0, 0]);
  return color;
}

export function convolveImg(data, width, cell, kernel) {
  const newData = [];

  const m = kernel.length; // data height
  const n = kernel[0]?.length || 1;
  const flat_kernel = kernel.flat();

  for (let i = 1 - n - m*width; i < data.length; i++) {
    const chunkData = chunk({
      data, width, cell,
      x: i%width, y: ~~(i/width),
      chunkDimX: n, chunkDimY: m
    });

    const colors = [];

    for (let ki = 0; ki < chunkData.length; ki++) {
      const newColor = color_mult(chunkData[ki].color, flat_kernel[ki]);
      colors.push(newColor);
    }

    newData.push({ color: color_sum(...colors), x: (i%width)*cell, y: (~~(i/width))*cell });
  }

  return newData;
}

export function drawImage(cnv, data, COL_SIZE, ROW_SIZE) {
  const ctx = cnv.getContext("2d");

  ctx.clearRect(0, 0, cnv.width, cnv.height);

  for (let i = 0; i < data.length; i++) {
    const { x, y, color } = data[i];

    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.fillRect(x, y, COL_SIZE, ROW_SIZE);
  }
}
