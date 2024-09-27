import "./style.css";
import imgUrl from "./assets/images/img.jpg";
import { cnv, ctx, KERNEL_MATRIX } from "./assets/js/globals.js"
import { loadImg, pixelate, convolveImg, getClientCoords, chunk, drawImage } from "./assets/js/utils.js";

function gcd(a, b) {
  if (a == 0) return b;
  else if (b == 0) return a;

  return a > b ? gcd(a%b, b) : gcd(b%a, a);
}

loadImg(imgUrl).then(img => {
  cnv.image.width = cnv.filtered.width = img.width;
  cnv.image.height = cnv.filtered.height = img.height;

  const gcd_size = gcd(~~cnv.image.width, ~~cnv.image.height);
  const div = 23;

  const CELL_SIZE = ~~(gcd_size / div);
  const ROW_SIZE = CELL_SIZE;
  const COL_SIZE = CELL_SIZE;

  ctx.image.drawImage(
    img, 0, 0, cnv.image.width, cnv.image.height
  );

  // { color: String, x, y }
  const pixelateData = pixelate(cnv.image, ROW_SIZE, COL_SIZE);
  drawImage(cnv.image, pixelateData, COL_SIZE, ROW_SIZE);

  const convolve = convolveImg(pixelateData, Math.ceil(cnv.image.width/CELL_SIZE), CELL_SIZE, KERNEL_MATRIX);
  drawImage(cnv.filtered, convolve, COL_SIZE, ROW_SIZE);

  addEventListener("mousemove", (e) => {
    let [x, y] = getClientCoords(e);
    const box = cnv.image.getBoundingClientRect();

    cnv.preview.style.cssText = `
      top: ${y}px;
      left: ${x}px
    `;

    const chunkDimX = 8;
    const chunkDimY = 8;

    const chunkData = chunk({
      data: pixelateData,
      x: Math.floor((x-box.left)/CELL_SIZE),
      y: Math.floor((y-box.top)/CELL_SIZE),
      width: Math.ceil(cnv.image.width/CELL_SIZE),
      cell: CELL_SIZE,
      chunkDimX,
      chunkDimY,
    });

    cnv.preview.width = chunkDimX*CELL_SIZE;
    cnv.preview.height = chunkDimY*CELL_SIZE;
    
    let preview_y = -1;

    for (let i = 0; i < chunkData.length; i++) {
      if (i%chunkDimX === 0) preview_y++;
      
      const { color } = chunkData[i];
      const x = i%chunkDimY*CELL_SIZE
      const y = preview_y*CELL_SIZE;

      ctx.preview.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      ctx.preview.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      //ctx.preview.fillStyle = "white";
      //ctx.preview.fillText(chunkData[i].index, x + CELL_SIZE / 2, y + CELL_SIZE / 2)
    }
  });
});

