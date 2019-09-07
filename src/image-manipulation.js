import pixelmatch from 'pixelmatch';
import {PNG} from 'pngjs';

const getMax = (data, key) =>
  data.reduce((acc, row) => Math.max(row[key], acc), 0);

/* eslint-disable */
const toBuffer = img =>
  new Buffer.from(img.replace(/^data:image\/\w+;base64,/, ''), 'base64');
/* eslint-enable */

export const toPng = buff => PNG.sync.read(toBuffer(buff));

// always give back an image
export function concatImages(images) {
  const pngs = images.map(buff => PNG.sync.read(toBuffer(buff)));
  const totalWidth = pngs.reduce((acc, {width}) => width + acc, 0);
  const maxHeight = getMax(pngs, 'height');
  const outputImage = new PNG({width: totalWidth || 1, height: maxHeight || 1});
  let widthOffset = 0;
  pngs.forEach(png => {
    const {width, height, data} = png;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = 4 * (width * y + x);
        const targetIdx = 4 * (totalWidth * y + (x + widthOffset));
        for (let color = 0; color < 4; color++) {
          outputImage.data[targetIdx + color] = data[idx + color];
          // outputImage.data[targetIdx] = 0;
        }
      }
    }
    widthOffset += 4 * width;
  });
  return {
    data: `data:image/png;base64,${PNG.sync
      .write(outputImage)
      .toString('base64')}`,
    dims: {height: maxHeight, width: totalWidth},
  };
}

const floorClamp = x => Math.max(Math.min(Math.floor(x), 255), 0);
// always give back an image
export function overlayImages(images, opacity) {
  if (!images.length) {
    return {
      data: null,
      dims: {height: 0, width: 0},
    };
  }
  const pngs = images.map(buff => PNG.sync.read(toBuffer(buff)));
  const maxWidth = getMax(pngs, 'width');
  const maxHeight = getMax(pngs, 'height');
  const outputImage = new PNG({width: maxWidth, height: maxHeight});
  for (let y = 0; y < maxHeight; y++) {
    for (let x = 0; x < maxWidth; x++) {
      const idx = 4 * (maxWidth * y + x);
      for (let w = 0; w < 4; w++) {
        outputImage.data[idx + w] = 255;
      }
    }
  }
  pngs.forEach((png, pngIndx) => {
    const {width, height, data} = png;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = 4 * (width * y + x);
        const targetIdx = 4 * (maxWidth * y + x);
        outputImage.data[targetIdx + 3] = 255;
        for (let color = 0; color < 3; color++) {
          outputImage.data[targetIdx + color] =
            opacity * outputImage.data[targetIdx + color] +
            (data[idx + 3] ? data[idx + color] : 255) * (1 - opacity);
        }
      }
    }
  });

  for (let y = 0; y < maxHeight; y++) {
    for (let x = 0; x < maxWidth; x++) {
      const idx = 4 * (maxWidth * y + x);
      for (let w = 0; w < 4; w++) {
        outputImage.data[idx + w] = floorClamp(outputImage.data[idx + w]);
      }
    }
  }
  return {
    data: `data:image/png;base64,${PNG.sync
      .write(outputImage)
      .toString('base64')}`,
    dims: {height: maxHeight, width: maxWidth},
  };
}

/**
 * Make an image have particular dimensions, will crop if less, will fill with white if empty
 */
export function padImageToSize(png, padHeight, padWidth) {
  /* eslint-disable max-depth */
  const outputImage = new PNG({height: padHeight, width: padWidth});
  for (let y = 0; y < padHeight; y++) {
    for (let x = 0; x < padWidth; x++) {
      const idx = 4 * (padWidth * y + x);
      if (x < png.width) {
        for (let color = 0; color < 4; color++) {
          outputImage.data[idx + color] = png.data[idx + color];
        }
      }
    }
  }
  /* eslint-enable max-depth */
  return outputImage;
}

export function makeBlank(height, width, color = [255, 255, 255, 1]) {
  /* eslint-disable max-depth */
  const outputImage = new PNG({height, width});
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = 4 * (width * y + x);
      for (let cdx = 0; cdx < 4; cdx++) {
        outputImage.data[idx + cdx] = color[color];
      }
    }
  }
  /* eslint-enable max-depth */
  return {
    data: `data:image/png;base64,${PNG.sync
      .write(outputImage)
      .toString('base64')}`,
    dims: {height, width},
  };
}

/**
 * Create a pixelmatch based difference between two input data streams
 */
export function buildPixelDiff(oldRendering, newRendering) {
  const img2 = PNG.sync.read(toBuffer(oldRendering));
  const img1 = PNG.sync.read(toBuffer(newRendering));
  const width = Math.max(img1.width, img2.width);
  const height = Math.max(img1.height, img2.height);
  const diff = new PNG({width, height});
  const delta = pixelmatch(
    padImageToSize(img1, height, width).data,
    padImageToSize(img2, height, width).data,
    diff.data,
    width,
    height,
    {threshold: 0.01},
  );
  const diffStr = `data:image/png;base64,${PNG.sync
    .write(diff)
    .toString('base64')}`;
  return {delta, diffStr};
}
