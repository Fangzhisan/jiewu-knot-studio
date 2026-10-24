#!/usr/bin/env node
/**
 * Original, dependency-free macrame coordinate codec maintenance tool.
 *
 * Input: the current data directory, an individual macrame-*.ts data module,
 * a macrame.ts backup (legacy varints or Huffman blocks), or a JSON dictionary
 * keyed by square/spiral/net. Each raw JSON entry contains
 * { counts, times, order, values }; values are signed integer coordinates in
 * exact 0.0001 units, ordered frame -> cord -> point -> X/Y/Z. No coordinates
 * are rounded here. Encoded JSON entries with a payload are accepted as well.
 * Output: a JSON dictionary of the current lossless BakedGather format.
 *
 * node scripts/macrame-codec.mjs --input src/lessons/data --verify
 * node scripts/macrame-codec.mjs --input src/lessons/data/macrame-square.ts --verify
 * node scripts/macrame-codec.mjs --input /path/old-macrame.ts --output /path/gathers.json
 * node scripts/macrame-codec.mjs --input /path/gathers.json --mode square --update-data-dir src/lessons/data
 *
 * --update-data-dir writes only the input modes (or the single --mode) into
 * macrame-*.ts data modules. It never replaces lesson code or kumihimo data.
 * --update-source is retained only for legacy sources with BAKED_GATHERS;
 * current lesson modules cannot receive embedded data through that option.
 * Four frames per block; each block chooses temporal-1/spatial-2 or
 * temporal-2/spatial-1 prediction, then canonical Huffman coding. Symbols 0..30
 * are zigzag integers; symbol 31 stores the excess as an unsigned varint.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const MODES = ['square', 'spiral', 'net']

export function readGathers(filename) {
  if (fs.statSync(filename).isDirectory()) {
    return Object.assign({}, ...MODES.map(mode => readGathers(path.join(filename, `macrame-${mode}.ts`))))
  }
  const text = fs.readFileSync(filename, 'utf8')
  if (!filename.endsWith('.ts')) return JSON.parse(text)
  const moduleData = /^export default (\{[^\n]+\})\s*;?\s*$/m.exec(text)
  if (moduleData) {
    const mode = MODES.find(mode => path.basename(filename) === `macrame-${mode}.ts`)
    if (!mode) throw new Error('Expected a macrame-square.ts, macrame-spiral.ts or macrame-net.ts data module')
    const data = JSON.parse(moduleData[1])
    return { [mode]: { ...data, payload: data.payload.replace(/\s/g, '') } }
  }
  const result = {}
  const pattern = /  (square|spiral|net): \{ \.\.\.(\{[^\n]+\}), payload: `\n([\s\S]*?)` \},/g
  for (const match of text.matchAll(pattern)) result[match[1]] = { ...JSON.parse(match[2]), payload: match[3].replace(/\s/g, '') }
  if (!Object.keys(result).length) throw new Error('No embedded BAKED_GATHERS found; use --input src/lessons/data for current lessons')
  return result
}

function strideOf(data) { return data.counts.reduce((sum, count) => sum + count * 3, 0) }

export function decodeLegacy(data) {
  const bytes = Buffer.from(data.payload, 'base64'), stride = strideOf(data)
  const values = new Int16Array(data.times.length * stride)
  let cursor = 0
  for (let i = 0; i < values.length; i++) {
    let value = 0, shift = 0, byte
    do { byte = bytes[cursor++]; value |= (byte & 127) << shift; shift += 7 } while (byte & 128)
    values[i] = ((value >>> 1) ^ -(value & 1)) + (i >= stride ? values[i - stride] : 0)
  }
  return values
}

function codeLengths(values) {
  const frequencies = Array(32).fill(0)
  for (const value of values) frequencies[Math.min((value << 1) ^ (value >> 31), 31)]++
  const nodes = frequencies.map((count, symbol) => ({ count, symbol })).filter(node => node.count)
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.count - b.count)
    const left = nodes.shift(), right = nodes.shift()
    nodes.push({ count: left.count + right.count, left, right })
  }
  const lengths = Array(32).fill(0)
  function visit(node, depth) {
    if (node.symbol !== undefined) lengths[node.symbol] = Math.max(1, depth)
    else { visit(node.left, depth + 1); visit(node.right, depth + 1) }
  }
  visit(nodes[0], 0)
  return lengths
}

function canonicalCodes(lengths) {
  let code = 0
  const codes = []
  for (let bits = 1; bits <= Math.max(...lengths); bits++) {
    for (let symbol = 0; symbol < lengths.length; symbol++) if (lengths[symbol] === bits) {
      let reversed = 0
      for (let bit = 0; bit < bits; bit++) reversed = (reversed << 1) | ((code >>> bit) & 1)
      codes[symbol] = reversed
      code++
    }
    code <<= 1
  }
  return codes
}

function encodeBlock(values) {
  const lengths = codeLengths(values), codes = canonicalCodes(lengths), bytes = [...lengths]
  let buffer = 0, available = 0
  function write(value, bits) {
    buffer |= value << available; available += bits
    while (available >= 8) { bytes.push(buffer & 255); buffer >>>= 8; available -= 8 }
  }
  for (const value of values) {
    let encoded = (value << 1) ^ (value >> 31)
    const symbol = Math.min(encoded, 31)
    write(codes[symbol], lengths[symbol])
    if (symbol === 31) {
      encoded -= 31
      while (encoded >= 128) { write((encoded & 127) | 128, 8); encoded >>>= 7 }
      write(encoded, 8)
    }
  }
  if (available) bytes.push(buffer & 255)
  return Buffer.from(bytes)
}

function differences(data, values, temporalOrder) {
  const stride = strideOf(data), result = []
  for (let frame = 0; frame < data.times.length; frame++) {
    let offset = frame * stride
    for (const count of data.counts) {
      for (let axis = 0; axis < 3; axis++) {
        let previous = 0, beforePrevious = 0
        for (let point = 0; point < count; point++) {
          const at = offset + point * 3 + axis
          let value = values[at]
          if (frame > 0) value -= values[at - stride]
          if (temporalOrder === 2 && frame > 1) value -= values[at - stride] - values[at - stride * 2]
          result.push(value - previous - (temporalOrder === 1 ? previous - beforePrevious : 0))
          beforePrevious = previous; previous = value
        }
      }
      offset += count * 3
    }
  }
  return result
}

export function encodeGather(data, inputValues, blockFrames = 4) {
  const stride = strideOf(data), values = inputValues ?? data.values
  if (values.length !== stride * data.times.length) throw new Error('Coordinate count does not match counts/times')
  for (const value of values) if (!Number.isInteger(value) || value < -32768 || value > 32767) throw new Error('Coordinates must be exact signed 16-bit integers')
  const predictions = [differences(data, values, 1), differences(data, values, 2)]
  const chunks = [], orders = []
  for (let frame = 0; frame < data.times.length; frame += blockFrames) {
    const end = Math.min(data.times.length, frame + blockFrames) * stride
    const candidates = predictions.map(values => encodeBlock(values.slice(frame * stride, end)))
    const choice = candidates[0].length <= candidates[1].length ? 0 : 1
    chunks.push(candidates[choice]); orders.push(choice + 1)
  }
  return { counts: data.counts, times: data.times, order: data.order, blockFrames, sizes: chunks.map(chunk => chunk.length), orders, payload: Buffer.concat(chunks).toString('base64') }
}

/** Decode original integer coordinates; no geometry is reconstructed approximately. */
export function decodeGather(data, stride) {
    const bytes = atob(data.payload);
    const values = new Int16Array(data.times.length * stride);
    let blockOffset = 0;
    for (let block = 0; block < data.sizes.length; block++) {
        const lengths = Array.from({ length: 32 }, (_, i) => bytes.charCodeAt(blockOffset + i));
        const left = [0], right = [0], symbols = [-1];
        let code = 0;
        for (let bits = 1; bits <= Math.max(...lengths); bits++) {
            for (let symbol = 0; symbol < 32; symbol++)
                if (lengths[symbol] === bits) {
                    let node = 0;
                    for (let bit = bits - 1; bit >= 0; bit--) {
                        const children = (code >>> bit) & 1 ? right : left;
                        if (!children[node]) {
                            children[node] = symbols.length;
                            left.push(0);
                            right.push(0);
                            symbols.push(-1);
                        }
                        node = children[node];
                    }
                    symbols[node] = symbol;
                    code++;
                }
            code <<= 1;
        }
        const lookup = new Int32Array(1024);
        for (let prefix = 0; prefix < lookup.length; prefix++) {
            let node = 0, bits = 0;
            while (symbols[node] < 0 && bits < 10) {
                node = (prefix >>> bits) & 1 ? right[node] : left[node];
                bits++;
            }
            lookup[prefix] = symbols[node] >= 0 ? (bits << 16) | (symbols[node] + 1) : -node - 1;
        }
        let cursor = blockOffset + 32, buffer = 0, available = 0;
        const order = data.orders[block];
        const firstFrame = block * data.blockFrames, lastFrame = Math.min(data.times.length, firstFrame + data.blockFrames);
        for (let frame = firstFrame; frame < lastFrame; frame++) {
            let offset = frame * stride;
            for (const count of data.counts) {
                for (let axis = 0; axis < 3; axis++) {
                    let previous = 0, beforePrevious = 0;
                    for (let point = 0; point < count; point++) {
                        while (available < 10) {
                            buffer |= (bytes.charCodeAt(cursor++) || 0) << available;
                            available += 8;
                        }
                        const entry = lookup[buffer & 1023];
                        let symbol;
                        if (entry > 0) {
                            const bits = entry >>> 16;
                            buffer >>>= bits;
                            available -= bits;
                            symbol = (entry & 65535) - 1;
                        }
                        else {
                            buffer >>>= 10;
                            available -= 10;
                            let node = -entry - 1;
                            while (symbols[node] < 0) {
                                if (!available) {
                                    buffer = bytes.charCodeAt(cursor++) || 0;
                                    available = 8;
                                }
                                node = buffer & 1 ? right[node] : left[node];
                                buffer >>>= 1;
                                available--;
                            }
                            symbol = symbols[node];
                        }
                        if (symbol === 31) {
                            let extra = 0, shift = 0, byte;
                            do {
                                while (available < 8) {
                                    buffer |= (bytes.charCodeAt(cursor++) || 0) << available;
                                    available += 8;
                                }
                                byte = buffer & 255;
                                buffer >>>= 8;
                                available -= 8;
                                extra |= (byte & 127) << shift;
                                shift += 7;
                            } while (byte & 128);
                            symbol += extra;
                        }
                        let value = ((symbol >>> 1) ^ -(symbol & 1)) + previous + (order === 1 ? previous - beforePrevious : 0);
                        beforePrevious = previous;
                        previous = value;
                        const at = offset + point * 3 + axis;
                        if (frame > 0)
                            value += values[at - stride];
                        if (order === 2 && frame > 1)
                            value += values[at - stride] - values[at - 2 * stride];
                        values[at] = value;
                    }
                }
                offset += count * 3;
            }
        }
        blockOffset += data.sizes[block];
    }
    return values;
}

export function unpackGather(data) {
  if (data.values) {
    for (const value of data.values) if (!Number.isInteger(value) || value < -32768 || value > 32767) throw new Error('Raw coordinates must be exact signed 16-bit integers')
    return Int16Array.from(data.values)
  }
  return data.blockFrames ? decodeGather(data, strideOf(data)) : decodeLegacy(data)
}

export function replaceGatherData(source, gathers) {
  if (!source.includes('function decodeGather(')) throw new Error('Target source must already contain the current decoder')
  const start = source.indexOf('const BAKED_GATHERS:')
  const end = source.indexOf('\nfor (const [i, mode]', start)
  if (start < 0 || end < 0) throw new Error('Target has no embedded BAKED_GATHERS; use --update-data-dir for current lessons')
  let block = 'const BAKED_GATHERS: Partial<Record<Mode, BakedGather>> = {\n'
  for (const mode of MODES) if (gathers[mode]) {
    const { payload, ...metadata } = gathers[mode]
    block += `  ${mode}: { ...${JSON.stringify(metadata)}, payload: \`\n${payload.match(/.{1,120}/g).join('\n')}\` },\n`
  }
  return source.slice(0, start) + block + '}' + source.slice(end)
}

export function writeGatherModules(directory, gathers) {
  const modes = MODES.filter(mode => gathers[mode])
  if (!modes.length) throw new Error('No macrame modes to write')
  fs.mkdirSync(directory, { recursive: true })
  for (const mode of modes) {
    const source = '/** Authored lossless gathering data; maintained by scripts/macrame-codec.mjs. */\n'
      + `export default ${JSON.stringify(gathers[mode])}\n`
    fs.writeFileSync(path.join(directory, `macrame-${mode}.ts`), source)
  }
}

function cli(args) {
  const options = {}
  const valueFlags = ['--input', '--output', '--update-source', '--update-data-dir', '--mode']
  for (let i = 0; i < args.length; i++) {
    const flag = args[i]
    if (flag === '--verify') { options[flag] = true; continue }
    if (!valueFlags.includes(flag) || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Unknown or incomplete option: ${flag}`)
    if (options[flag] !== undefined) throw new Error(`Duplicate option: ${flag}`)
    options[flag] = args[++i]
  }
  const input = options['--input'], output = options['--output'], target = options['--update-source']
  const dataDirectory = options['--update-data-dir'], selectedMode = options['--mode']
  if (!input || (!output && !target && !dataDirectory && !options['--verify'])) throw new Error('Use --input FILE_OR_DIRECTORY with --verify, --output FILE or --update-data-dir DIRECTORY')
  if (target && dataDirectory) throw new Error('Choose --update-source or --update-data-dir, not both')
  if (selectedMode && !MODES.includes(selectedMode)) throw new Error('--mode must be square, spiral or net')
  const loaded = readGathers(input), packed = {}, report = []
  const modes = selectedMode ? [selectedMode] : MODES.filter(mode => loaded[mode])
  if (!modes.length || modes.some(mode => !loaded[mode])) throw new Error('Input does not contain the requested macrame mode')
  for (const mode of modes) {
    const source = loaded[mode], values = unpackGather(source)
    packed[mode] = encodeGather(source, values)
    const decoded = unpackGather(packed[mode])
    const mismatch = decoded.findIndex((value, i) => value !== values[i])
    if (mismatch >= 0) throw new Error(`${mode}: lossless verification failed at coordinate ${mismatch}`)
    report.push({ mode, frames: source.times.length, coordinates: values.length, bytes: Buffer.byteLength(packed[mode].payload, 'base64'), unchanged: true })
  }
  if (output) fs.writeFileSync(output, JSON.stringify(packed))
  if (target) {
    const existing = readGathers(target)
    fs.writeFileSync(target, replaceGatherData(fs.readFileSync(target, 'utf8'), { ...existing, ...packed }))
  }
  if (dataDirectory) writeGatherModules(dataDirectory, packed)
  console.log(JSON.stringify(report, null, 2))
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) cli(process.argv.slice(2))
