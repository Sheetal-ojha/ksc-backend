interface HuffmanNode {
  char: string | null;
  freq: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
}

function buildFreqMap(data: Buffer): Map<number, number> {
  const map = new Map<number, number>();
  for (const byte of data) {
    map.set(byte, (map.get(byte) || 0) + 1);
  }
  return map;
}

function buildTree(freqMap: Map<number, number>): HuffmanNode {
  const nodes: HuffmanNode[] = [];
  freqMap.forEach((freq, byte) => {
    nodes.push({ char: String.fromCharCode(byte), freq, left: null, right: null });
  });
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    nodes.push({ char: null, freq: left.freq + right.freq, left, right });
  }
  return nodes[0];
}

function buildCodes(node: HuffmanNode | null, prefix: string, codes: Map<string, string>) {
  if (!node) return;
  if (node.char !== null) {
    codes.set(node.char, prefix || '0');
    return;
  }
  buildCodes(node.left, prefix + '0', codes);
  buildCodes(node.right, prefix + '1', codes);
}

function serializeTree(node: HuffmanNode | null): string {
  if (!node) return '#';
  if (node.char !== null) return `L${node.char.charCodeAt(0).toString(16).padStart(2, '0')}`;
  return `I${serializeTree(node.left)}${serializeTree(node.right)}`;
}

function deserializeTree(data: string, index: { val: number }): HuffmanNode | null {
  if (index.val >= data.length) return null;
  const type = data[index.val++];
  if (type === '#') return null;
  if (type === 'L') {
    const hex = data.slice(index.val, index.val + 2);
    index.val += 2;
    return { char: String.fromCharCode(parseInt(hex, 16)), freq: 0, left: null, right: null };
  }
  const left = deserializeTree(data, index);
  const right = deserializeTree(data, index);
  return { char: null, freq: 0, left, right };
}

export function huffmanCompress(input: Buffer): string {
  if (input.length === 0) return '';

  console.log(`[Huffman] Original size: ${input.length} bytes`);

  const freqMap = buildFreqMap(input);
  const tree = buildTree(freqMap);
  const codes = new Map<string, string>();
  buildCodes(tree, '', codes);
  const treeStr = serializeTree(tree);

  let bitString = '';
  for (const byte of input) {
    bitString += codes.get(String.fromCharCode(byte))!;
  }

  const padding = (8 - (bitString.length % 8)) % 8;
  bitString += '0'.repeat(padding);

  const compressedBytes = Buffer.alloc(bitString.length / 8);
  for (let i = 0; i < bitString.length; i += 8) {
    compressedBytes[i / 8] = parseInt(bitString.slice(i, i + 8), 2);
  }

  const result = Buffer.from(JSON.stringify({
    tree: treeStr,
    padding,
    data: compressedBytes.toString('base64'),
  })).toString('base64');

  console.log(`[Huffman] Compressed size: ${result.length} bytes`);
  console.log(`[Huffman] Compression ratio: ${((1 - result.length / (input.length * 1.37)) * 100).toFixed(1)}%`);

  return result;
}

export function huffmanDecompress(compressed: string): Buffer {
  if (!compressed) return Buffer.alloc(0);

  console.log(`[Huffman] Decompressing ${compressed.length} bytes`);

  const { tree: treeStr, padding, data } = JSON.parse(Buffer.from(compressed, 'base64').toString('utf8'));
  const root = deserializeTree(treeStr, { val: 0 });
  if (!root) return Buffer.alloc(0);

  const compressedBytes = Buffer.from(data, 'base64');
  let bitString = '';
  for (const byte of compressedBytes) {
    bitString += byte.toString(2).padStart(8, '0');
  }
  bitString = bitString.slice(0, bitString.length - padding);

  const output: number[] = [];
  let node = root;
  for (const bit of bitString) {
    node = (bit === '0' ? node.left : node.right)!;
    if (node.char !== null) {
      output.push(node.char.charCodeAt(0));
      node = root;
    }
  }

  const result = Buffer.from(output);
  console.log(`[Huffman] Decompressed size: ${result.length} bytes`);
  return result;
}