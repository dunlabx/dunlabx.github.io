/* Small, self-contained QR Model 2 encoder for UTF-8 wallet strings.
 * QR versions 1-L through 40-L support up to 2953 UTF-8 bytes, including a URI prefix.
 * Uses byte mode, Reed-Solomon error correction and mask 0.
 */
(function () {
  "use strict";

  const ECC_PER_BLOCK = [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30];
  const BLOCKS = [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25];

  function rawDataWords(version) {
    let modules = (16 * version + 128) * version + 64;
    if (version >= 2) {
      const numAlign = Math.floor(version / 7) + 2;
      modules -= (25 * numAlign - 10) * numAlign - 55;
      if (version >= 7) modules -= 36;
    }
    return Math.floor(modules / 8);
  }

  function dataWordCount(version) {
    return rawDataWords(version) - ECC_PER_BLOCK[version] * BLOCKS[version];
  }

  function multiply(x, y) {
    let z = 0;
    for (let i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11D);
      z ^= ((y >>> i) & 1) * x;
    }
    return z;
  }

  function divisor(degree) {
    const result = new Array(degree).fill(0);
    result[degree - 1] = 1;
    let root = 1;
    for (let i = 0; i < degree; i++) {
      for (let j = 0; j < degree; j++) {
        result[j] = multiply(result[j], root);
        if (j + 1 < degree) result[j] ^= result[j + 1];
      }
      root = multiply(root, 2);
    }
    return result;
  }

  function remainder(data, polynomial) {
    const result = new Array(polynomial.length).fill(0);
    for (const byte of data) {
      const factor = byte ^ result.shift();
      result.push(0);
      for (let i = 0; i < result.length; i++) result[i] ^= multiply(polynomial[i], factor);
    }
    return result;
  }

  function appendBits(out, value, length) {
    for (let i = length - 1; i >= 0; i--) out.push((value >>> i) & 1);
  }

  function makeData(text, version) {
    const bytes = Array.from(new TextEncoder().encode(text));
    if (bytes.length > 2953) throw new RangeError("Wallet QR data is longer than 2953 UTF-8 bytes.");
    const dataWords = dataWordCount(version);
    const bits = [];
    appendBits(bits, 0x4, 4);
    appendBits(bits, bytes.length, version < 10 ? 8 : 16);
    for (const byte of bytes) appendBits(bits, byte, 8);
    appendBits(bits, 0, Math.min(4, dataWords * 8 - bits.length));
    while (bits.length % 8) bits.push(0);
    const data = [];
    for (let i = 0; i < bits.length; i += 8) {
      let byte = 0;
      for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
      data.push(byte);
    }
    for (let pad = 0xEC; data.length < dataWords; pad ^= 0xEC ^ 0x11) data.push(pad);

    const numBlocks = BLOCKS[version];
    const eccWords = ECC_PER_BLOCK[version];
    const rawWords = rawDataWords(version);
    const numShortBlocks = numBlocks - rawWords % numBlocks;
    const shortBlockLength = Math.floor(rawWords / numBlocks);
    const poly = divisor(eccWords);
    const blocks = [];
    let offset = 0;
    for (let i = 0; i < numBlocks; i++) {
      const dataLength = shortBlockLength - eccWords + (i < numShortBlocks ? 0 : 1);
      const block = data.slice(offset, offset + dataLength);
      offset += dataLength;
      const ecc = remainder(block, poly);
      if (i < numShortBlocks) block.push(0);
      blocks.push(block.concat(ecc));
    }
    const result = [];
    for (let i = 0; i < blocks[0].length; i++) {
      blocks.forEach((block, index) => {
        if (i !== shortBlockLength - eccWords || index >= numShortBlocks) result.push(block[i]);
      });
    }
    return result;
  }

  function encode(text) {
    const bytes = new TextEncoder().encode(text);
    let version = 1;
    for (; version <= 40; version++) {
      const countBits = version < 10 ? 8 : 16;
      if (bytes.length < (1 << countBits) && 4 + countBits + bytes.length * 8 <= dataWordCount(version) * 8) break;
    }
    if (version > 40) throw new RangeError("Wallet QR data is longer than 2953 UTF-8 bytes.");
    const size = version * 4 + 17;
    const modules = Array.from({ length: size }, () => new Array(size).fill(false));
    const functions = Array.from({ length: size }, () => new Array(size).fill(false));
    const setFunction = (x, y, dark) => {
      modules[y][x] = dark;
      functions[y][x] = true;
    };

    function finder(cx, cy) {
      for (let dy = -1; dy <= 7; dy++) for (let dx = -1; dx <= 7; dx++) {
        const x = cx + dx, y = cy + dy;
        if (x < 0 || x >= size || y < 0 || y >= size) continue;
        const inside = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6;
        const dark = inside && (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
        setFunction(x, y, dark);
      }
    }

    finder(0, 0);
    finder(size - 7, 0);
    finder(0, size - 7);
    for (let i = 8; i < size - 8; i++) {
      setFunction(6, i, i % 2 === 0);
      setFunction(i, 6, i % 2 === 0);
    }

    const numAlign = version === 1 ? 0 : Math.floor(version / 7) + 2;
    const alignStep = numAlign > 1 ? Math.floor((version * 8 + numAlign * 3 + 5) / (numAlign * 4 - 4)) * 2 : 0;
    const alignPositions = numAlign ? [6] : [];
    for (let pos = size - 7; alignPositions.length < numAlign; pos -= alignStep) alignPositions.splice(1, 0, pos);
    for (const cy of alignPositions) for (const cx of alignPositions) {
      if ((cx === 6 && cy === 6) || (cx === 6 && cy === size - 7) || (cx === size - 7 && cy === 6)) continue;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        setFunction(cx + dx, cy + dy, dist === 2 || dist === 0);
      }
    }

    function drawFormatBits() {
      const mask = 0;
      const data = (1 << 3) | mask; // Error correction level L.
      let rem = data;
      for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      const bits = ((data << 10) | rem) ^ 0x5412;
      const bit = i => ((bits >>> i) & 1) !== 0;
      for (let i = 0; i <= 5; i++) setFunction(8, i, bit(i));
      setFunction(8, 7, bit(6));
      setFunction(8, 8, bit(7));
      setFunction(7, 8, bit(8));
      for (let i = 9; i < 15; i++) setFunction(14 - i, 8, bit(i));
      for (let i = 0; i < 8; i++) setFunction(size - 1 - i, 8, bit(i));
      for (let i = 8; i < 15; i++) setFunction(8, size - 15 + i, bit(i));
      setFunction(8, size - 8, true);
    }
    drawFormatBits();

    if (version >= 7) {
      let rem = version;
      for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
      const bits = (version << 12) | rem;
      for (let i = 0; i < 18; i++) {
        const dark = ((bits >>> i) & 1) !== 0;
        const x = size - 11 + i % 3;
        const y = Math.floor(i / 3);
        setFunction(x, y, dark);
        setFunction(y, x, dark);
      }
    }

    const codewords = makeData(text, version);
    let bitIndex = 0;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < size; vert++) {
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        for (let offset = 0; offset < 2; offset++) {
          const x = right - offset;
          if (functions[y][x]) continue;
          let dark = bitIndex < codewords.length * 8 && ((codewords[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1) !== 0;
          bitIndex++;
          if ((x + y) % 2 === 0) dark = !dark;
          modules[y][x] = dark;
        }
      }
    }
    return modules;
  }

  function draw(canvas, text) {
    const matrix = encode(text);
    const context = canvas.getContext("2d");
    const scale = Math.max(2, Math.floor(256 / (matrix.length + 8)));
    const quiet = 4;
    const extent = (matrix.length + quiet * 2) * scale;
    canvas.width = extent;
    canvas.height = extent;
    context.fillStyle = "#fff";
    context.fillRect(0, 0, extent, extent);
    context.fillStyle = "#07111f";
    for (let y = 0; y < matrix.length; y++) for (let x = 0; x < matrix.length; x++) {
      if (matrix[y][x]) context.fillRect((x + quiet) * scale, (y + quiet) * scale, scale, scale);
    }
  }

  window.SupportQR = { draw };
}());
