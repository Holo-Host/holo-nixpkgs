
function _loadWasmModule (sync, src, imports) {
  var len = src.length
  var trailing = src[len-2] == '=' ? 2 : src[len-1] == '=' ? 1 : 0
  var buf = new Uint8Array((len * 3/4) - trailing)

  var _table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  var table = new Uint8Array(130)
  for (var c = 0; c < _table.length; c++) table[_table.charCodeAt(c)] = c

  for (var i = 0, b = 0; i < len; i+=4) {
    var second = table[src.charCodeAt(i+1)]
    var third = table[src.charCodeAt(i+2)]
    buf[b++] = (table[src.charCodeAt(i)] << 2) | (second >> 4)
    buf[b++] = ((second & 15) << 4) | (third >> 2)
    buf[b++] = ((third & 3) << 6) | (table[src.charCodeAt(i+3)] & 63)
  }

  if (imports && !sync) {
    return WebAssembly.instantiate(buf, imports)
  } else if (!imports && !sync) {
    return WebAssembly.compile(buf)
  } else {
    var mod = new WebAssembly.Module(buf)
    return imports ? new WebAssembly.Instance(mod, imports) : mod
  }
}
'use strict';

var process_1 = require('process');
var EventEmitter = require('events');
var https = require('https');
var http = require('http');
var net = require('net');
var tls = require('tls');
var crypto = require('crypto');
var Url = require('url');
var zlib = require('zlib');
var fs = require('fs');
var path$1 = require('path');
var os = require('os');
var Stream = require('stream');
var assert = require('assert');
var require$$0$4 = require('util');
var require$$3 = require('child_process');
var tty = require('tty');
var buffer = require('buffer');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var process_1__default = /*#__PURE__*/_interopDefaultLegacy(process_1);
var EventEmitter__default = /*#__PURE__*/_interopDefaultLegacy(EventEmitter);
var https__default = /*#__PURE__*/_interopDefaultLegacy(https);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var net__default = /*#__PURE__*/_interopDefaultLegacy(net);
var tls__default = /*#__PURE__*/_interopDefaultLegacy(tls);
var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);
var Url__default = /*#__PURE__*/_interopDefaultLegacy(Url);
var zlib__default = /*#__PURE__*/_interopDefaultLegacy(zlib);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path$1);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os);
var Stream__default = /*#__PURE__*/_interopDefaultLegacy(Stream);
var assert__default = /*#__PURE__*/_interopDefaultLegacy(assert);
var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0$4);
var require$$3__default = /*#__PURE__*/_interopDefaultLegacy(require$$3);
var tty__default = /*#__PURE__*/_interopDefaultLegacy(tty);
var buffer__default = /*#__PURE__*/_interopDefaultLegacy(buffer);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getAugmentedNamespace(n) {
if (n.__esModule) return n;
var a = Object.defineProperty({}, '__esModule', {value: true});
Object.keys(n).forEach(function (k) {
var d = Object.getOwnPropertyDescriptor(n, k);
Object.defineProperty(a, k, d.get ? d : {
enumerable: true,
get: function () {
  return n[k];
}
});
});
return a;
}

function createCommonjsModule(fn) {
var module = { exports: {} };
return fn(module, module.exports), module.exports;
}

function commonjsRequire (target) {
throw new Error('Could not dynamically require "' + target + '". Please configure the dynamicRequireTargets option of @rollup/plugin-commonjs appropriately for this require call to behave properly.');
}

Object.defineProperty(exports, "__esModule", { value: true });

var admin = /*#__PURE__*/Object.freeze({
__proto__: null
});

Object.defineProperty(exports, "__esModule", { value: true });

var app = /*#__PURE__*/Object.freeze({
__proto__: null
});

var types = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeAgentPubKey = void 0;
exports.fakeAgentPubKey = (x) => Buffer.from([0x84, 0x20, 0x24].concat('000000000000000000000000000000000000'
.split('')
.map((x) => parseInt(x, 10))));

});

var constants = {
BINARY_TYPES: ['nodebuffer', 'arraybuffer', 'fragments'],
GUID: '258EAFA5-E914-47DA-95CA-C5AB0DC85B11',
kStatusCode: Symbol('status-code'),
kWebSocket: Symbol('websocket'),
EMPTY_BUFFER: Buffer.alloc(0),
NOOP: () => {}
};

// Workaround to fix webpack's build warnings: 'the request of a dependency is an expression'
var runtimeRequire = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : commonjsRequire; // eslint-disable-line

var vars = (process.config && process.config.variables) || {};
var prebuildsOnly = !!process.env.PREBUILDS_ONLY;
var abi = process.versions.modules; // TODO: support old node where this is undef
var runtime = isElectron() ? 'electron' : 'node';
var arch = os__default['default'].arch();
var platform = os__default['default'].platform();
var libc = process.env.LIBC || (isAlpine(platform) ? 'musl' : 'glibc');
var armv = process.env.ARM_VERSION || (arch === 'arm64' ? '8' : vars.arm_version) || '';
var uv = (process.versions.uv || '').split('.')[0];

var nodeGypBuild = load;

function load (dir) {
return runtimeRequire(load.path(dir))
}

load.path = function (dir) {
dir = path__default['default'].resolve(dir || '.');

try {
var name = runtimeRequire(path__default['default'].join(dir, 'package.json')).name.toUpperCase().replace(/-/g, '_');
if (process.env[name + '_PREBUILD']) dir = process.env[name + '_PREBUILD'];
} catch (err) {}

if (!prebuildsOnly) {
var release = getFirst(path__default['default'].join(dir, 'build/Release'), matchBuild);
if (release) return release

var debug = getFirst(path__default['default'].join(dir, 'build/Debug'), matchBuild);
if (debug) return debug
}

var prebuild = resolve(dir);
if (prebuild) return prebuild

var nearby = resolve(path__default['default'].dirname(process.execPath));
if (nearby) return nearby

var target = [
'platform=' + platform,
'arch=' + arch,
'runtime=' + runtime,
'abi=' + abi,
'uv=' + uv,
armv ? 'armv=' + armv : '',
'libc=' + libc,
'node=' + process.versions.node,
(process.versions && process.versions.electron) ? 'electron=' + process.versions.electron : '',
typeof __webpack_require__ === 'function' ? 'webpack=true' : '' // eslint-disable-line
].filter(Boolean).join(' ');

throw new Error('No native build was found for ' + target + '\n    loaded from: ' + dir + '\n')

function resolve (dir) {
// Find most specific flavor first
var prebuilds = path__default['default'].join(dir, 'prebuilds', platform + '-' + arch);
var parsed = readdirSync(prebuilds).map(parseTags);
var candidates = parsed.filter(matchTags(runtime, abi));
var winner = candidates.sort(compareTags(runtime))[0];
if (winner) return path__default['default'].join(prebuilds, winner.file)
}
};

function readdirSync (dir) {
try {
return fs__default['default'].readdirSync(dir)
} catch (err) {
return []
}
}

function getFirst (dir, filter) {
var files = readdirSync(dir).filter(filter);
return files[0] && path__default['default'].join(dir, files[0])
}

function matchBuild (name) {
return /\.node$/.test(name)
}

function parseTags (file) {
var arr = file.split('.');
var extension = arr.pop();
var tags = { file: file, specificity: 0 };

if (extension !== 'node') return

for (var i = 0; i < arr.length; i++) {
var tag = arr[i];

if (tag === 'node' || tag === 'electron' || tag === 'node-webkit') {
tags.runtime = tag;
} else if (tag === 'napi') {
tags.napi = true;
} else if (tag.slice(0, 3) === 'abi') {
tags.abi = tag.slice(3);
} else if (tag.slice(0, 2) === 'uv') {
tags.uv = tag.slice(2);
} else if (tag.slice(0, 4) === 'armv') {
tags.armv = tag.slice(4);
} else if (tag === 'glibc' || tag === 'musl') {
tags.libc = tag;
} else {
continue
}

tags.specificity++;
}

return tags
}

function matchTags (runtime, abi) {
return function (tags) {
if (tags == null) return false
if (tags.runtime !== runtime && !runtimeAgnostic(tags)) return false
if (tags.abi !== abi && !tags.napi) return false
if (tags.uv && tags.uv !== uv) return false
if (tags.armv && tags.armv !== armv) return false
if (tags.libc && tags.libc !== libc) return false

return true
}
}

function runtimeAgnostic (tags) {
return tags.runtime === 'node' && tags.napi
}

function compareTags (runtime) {
// Precedence: non-agnostic runtime, abi over napi, then by specificity.
return function (a, b) {
if (a.runtime !== b.runtime) {
return a.runtime === runtime ? -1 : 1
} else if (a.abi !== b.abi) {
return a.abi ? -1 : 1
} else if (a.specificity !== b.specificity) {
return a.specificity > b.specificity ? -1 : 1
} else {
return 0
}
}
}

function isElectron () {
if (process.versions && process.versions.electron) return true
if (process.env.ELECTRON_RUN_AS_NODE) return true
return typeof window !== 'undefined' && window.process && window.process.type === 'renderer'
}

function isAlpine (platform) {
return platform === 'linux' && fs__default['default'].existsSync('/etc/alpine-release')
}

// Exposed for unit tests
// TODO: move to lib
load.parseTags = parseTags;
load.matchTags = matchTags;
load.compareTags = compareTags;

/**
* Masks a buffer using the given mask.
*
* @param {Buffer} source The buffer to mask
* @param {Buffer} mask The mask to use
* @param {Buffer} output The buffer where to store the result
* @param {Number} offset The offset at which to start writing
* @param {Number} length The number of bytes to mask.
* @public
*/
const mask = (source, mask, output, offset, length) => {
for (var i = 0; i < length; i++) {
output[offset + i] = source[i] ^ mask[i & 3];
}
};

/**
* Unmasks a buffer using the given mask.
*
* @param {Buffer} buffer The buffer to unmask
* @param {Buffer} mask The mask to use
* @public
*/
const unmask = (buffer, mask) => {
// Required until https://github.com/nodejs/node/issues/9006 is resolved.
const length = buffer.length;
for (var i = 0; i < length; i++) {
buffer[i] ^= mask[i & 3];
}
};

var fallback = { mask, unmask };

var bufferutil = createCommonjsModule(function (module) {

try {
module.exports = nodeGypBuild(__dirname);
} catch (e) {
module.exports = fallback;
}
});

var bufferUtil = createCommonjsModule(function (module) {

const { EMPTY_BUFFER } = constants;

/**
* Merges an array of buffers into a new buffer.
*
* @param {Buffer[]} list The array of buffers to concat
* @param {Number} totalLength The total length of buffers in the list
* @return {Buffer} The resulting buffer
* @public
*/
function concat(list, totalLength) {
if (list.length === 0) return EMPTY_BUFFER;
if (list.length === 1) return list[0];

const target = Buffer.allocUnsafe(totalLength);
let offset = 0;

for (let i = 0; i < list.length; i++) {
const buf = list[i];
target.set(buf, offset);
offset += buf.length;
}

if (offset < totalLength) return target.slice(0, offset);

return target;
}

/**
* Masks a buffer using the given mask.
*
* @param {Buffer} source The buffer to mask
* @param {Buffer} mask The mask to use
* @param {Buffer} output The buffer where to store the result
* @param {Number} offset The offset at which to start writing
* @param {Number} length The number of bytes to mask.
* @public
*/
function _mask(source, mask, output, offset, length) {
for (let i = 0; i < length; i++) {
output[offset + i] = source[i] ^ mask[i & 3];
}
}

/**
* Unmasks a buffer using the given mask.
*
* @param {Buffer} buffer The buffer to unmask
* @param {Buffer} mask The mask to use
* @public
*/
function _unmask(buffer, mask) {
// Required until https://github.com/nodejs/node/issues/9006 is resolved.
const length = buffer.length;
for (let i = 0; i < length; i++) {
buffer[i] ^= mask[i & 3];
}
}

/**
* Converts a buffer to an `ArrayBuffer`.
*
* @param {Buffer} buf The buffer to convert
* @return {ArrayBuffer} Converted buffer
* @public
*/
function toArrayBuffer(buf) {
if (buf.byteLength === buf.buffer.byteLength) {
return buf.buffer;
}

return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

/**
* Converts `data` to a `Buffer`.
*
* @param {*} data The data to convert
* @return {Buffer} The buffer
* @throws {TypeError}
* @public
*/
function toBuffer(data) {
toBuffer.readOnly = true;

if (Buffer.isBuffer(data)) return data;

let buf;

if (data instanceof ArrayBuffer) {
buf = Buffer.from(data);
} else if (ArrayBuffer.isView(data)) {
buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
} else {
buf = Buffer.from(data);
toBuffer.readOnly = false;
}

return buf;
}

try {
const bufferUtil = bufferutil;
const bu = bufferUtil.BufferUtil || bufferUtil;

module.exports = {
concat,
mask(source, mask, output, offset, length) {
if (length < 48) _mask(source, mask, output, offset, length);
else bu.mask(source, mask, output, offset, length);
},
toArrayBuffer,
toBuffer,
unmask(buffer, mask) {
if (buffer.length < 32) _unmask(buffer, mask);
else bu.unmask(buffer, mask);
}
};
} catch (e) /* istanbul ignore next */ {
module.exports = {
concat,
mask: _mask,
toArrayBuffer,
toBuffer,
unmask: _unmask
};
}
});

const kDone = Symbol('kDone');
const kRun = Symbol('kRun');

/**
* A very simple job queue with adjustable concurrency. Adapted from
* https://github.com/STRML/async-limiter
*/
class Limiter {
/**
* Creates a new `Limiter`.
*
* @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
*     to run concurrently
*/
constructor(concurrency) {
this[kDone] = () => {
this.pending--;
this[kRun]();
};
this.concurrency = concurrency || Infinity;
this.jobs = [];
this.pending = 0;
}

/**
* Adds a job to the queue.
*
* @param {Function} job The job to run
* @public
*/
add(job) {
this.jobs.push(job);
this[kRun]();
}

/**
* Removes a job from the queue and runs it if possible.
*
* @private
*/
[kRun]() {
if (this.pending === this.concurrency) return;

if (this.jobs.length) {
const job = this.jobs.shift();

this.pending++;
job(this[kDone]);
}
}
}

var limiter = Limiter;

const { kStatusCode, NOOP } = constants;

const TRAILER = Buffer.from([0x00, 0x00, 0xff, 0xff]);
const kPerMessageDeflate = Symbol('permessage-deflate');
const kTotalLength = Symbol('total-length');
const kCallback = Symbol('callback');
const kBuffers = Symbol('buffers');
const kError = Symbol('error');

//
// We limit zlib concurrency, which prevents severe memory fragmentation
// as documented in https://github.com/nodejs/node/issues/8871#issuecomment-250915913
// and https://github.com/websockets/ws/issues/1202
//
// Intentionally global; it's the global thread pool that's an issue.
//
let zlibLimiter;

/**
* permessage-deflate implementation.
*/
class PerMessageDeflate {
/**
* Creates a PerMessageDeflate instance.
*
* @param {Object} [options] Configuration options
* @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
*     disabling of server context takeover
* @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
*     acknowledge disabling of client context takeover
* @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
*     use of a custom server window size
* @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
*     for, or request, a custom client window size
* @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
*     deflate
* @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
*     inflate
* @param {Number} [options.threshold=1024] Size (in bytes) below which
*     messages should not be compressed
* @param {Number} [options.concurrencyLimit=10] The number of concurrent
*     calls to zlib
* @param {Boolean} [isServer=false] Create the instance in either server or
*     client mode
* @param {Number} [maxPayload=0] The maximum allowed message length
*/
constructor(options, isServer, maxPayload) {
this._maxPayload = maxPayload | 0;
this._options = options || {};
this._threshold =
this._options.threshold !== undefined ? this._options.threshold : 1024;
this._isServer = !!isServer;
this._deflate = null;
this._inflate = null;

this.params = null;

if (!zlibLimiter) {
const concurrency =
  this._options.concurrencyLimit !== undefined
    ? this._options.concurrencyLimit
    : 10;
zlibLimiter = new limiter(concurrency);
}
}

/**
* @type {String}
*/
static get extensionName() {
return 'permessage-deflate';
}

/**
* Create an extension negotiation offer.
*
* @return {Object} Extension parameters
* @public
*/
offer() {
const params = {};

if (this._options.serverNoContextTakeover) {
params.server_no_context_takeover = true;
}
if (this._options.clientNoContextTakeover) {
params.client_no_context_takeover = true;
}
if (this._options.serverMaxWindowBits) {
params.server_max_window_bits = this._options.serverMaxWindowBits;
}
if (this._options.clientMaxWindowBits) {
params.client_max_window_bits = this._options.clientMaxWindowBits;
} else if (this._options.clientMaxWindowBits == null) {
params.client_max_window_bits = true;
}

return params;
}

/**
* Accept an extension negotiation offer/response.
*
* @param {Array} configurations The extension negotiation offers/reponse
* @return {Object} Accepted configuration
* @public
*/
accept(configurations) {
configurations = this.normalizeParams(configurations);

this.params = this._isServer
? this.acceptAsServer(configurations)
: this.acceptAsClient(configurations);

return this.params;
}

/**
* Releases all resources used by the extension.
*
* @public
*/
cleanup() {
if (this._inflate) {
this._inflate.close();
this._inflate = null;
}

if (this._deflate) {
const callback = this._deflate[kCallback];

this._deflate.close();
this._deflate = null;

if (callback) {
  callback(
    new Error(
      'The deflate stream was closed while data was being processed'
    )
  );
}
}
}

/**
*  Accept an extension negotiation offer.
*
* @param {Array} offers The extension negotiation offers
* @return {Object} Accepted configuration
* @private
*/
acceptAsServer(offers) {
const opts = this._options;
const accepted = offers.find((params) => {
if (
  (opts.serverNoContextTakeover === false &&
    params.server_no_context_takeover) ||
  (params.server_max_window_bits &&
    (opts.serverMaxWindowBits === false ||
      (typeof opts.serverMaxWindowBits === 'number' &&
        opts.serverMaxWindowBits > params.server_max_window_bits))) ||
  (typeof opts.clientMaxWindowBits === 'number' &&
    !params.client_max_window_bits)
) {
  return false;
}

return true;
});

if (!accepted) {
throw new Error('None of the extension offers can be accepted');
}

if (opts.serverNoContextTakeover) {
accepted.server_no_context_takeover = true;
}
if (opts.clientNoContextTakeover) {
accepted.client_no_context_takeover = true;
}
if (typeof opts.serverMaxWindowBits === 'number') {
accepted.server_max_window_bits = opts.serverMaxWindowBits;
}
if (typeof opts.clientMaxWindowBits === 'number') {
accepted.client_max_window_bits = opts.clientMaxWindowBits;
} else if (
accepted.client_max_window_bits === true ||
opts.clientMaxWindowBits === false
) {
delete accepted.client_max_window_bits;
}

return accepted;
}

/**
* Accept the extension negotiation response.
*
* @param {Array} response The extension negotiation response
* @return {Object} Accepted configuration
* @private
*/
acceptAsClient(response) {
const params = response[0];

if (
this._options.clientNoContextTakeover === false &&
params.client_no_context_takeover
) {
throw new Error('Unexpected parameter "client_no_context_takeover"');
}

if (!params.client_max_window_bits) {
if (typeof this._options.clientMaxWindowBits === 'number') {
  params.client_max_window_bits = this._options.clientMaxWindowBits;
}
} else if (
this._options.clientMaxWindowBits === false ||
(typeof this._options.clientMaxWindowBits === 'number' &&
  params.client_max_window_bits > this._options.clientMaxWindowBits)
) {
throw new Error(
  'Unexpected or invalid parameter "client_max_window_bits"'
);
}

return params;
}

/**
* Normalize parameters.
*
* @param {Array} configurations The extension negotiation offers/reponse
* @return {Array} The offers/response with normalized parameters
* @private
*/
normalizeParams(configurations) {
configurations.forEach((params) => {
Object.keys(params).forEach((key) => {
  let value = params[key];

  if (value.length > 1) {
    throw new Error(`Parameter "${key}" must have only a single value`);
  }

  value = value[0];

  if (key === 'client_max_window_bits') {
    if (value !== true) {
      const num = +value;
      if (!Number.isInteger(num) || num < 8 || num > 15) {
        throw new TypeError(
          `Invalid value for parameter "${key}": ${value}`
        );
      }
      value = num;
    } else if (!this._isServer) {
      throw new TypeError(
        `Invalid value for parameter "${key}": ${value}`
      );
    }
  } else if (key === 'server_max_window_bits') {
    const num = +value;
    if (!Number.isInteger(num) || num < 8 || num > 15) {
      throw new TypeError(
        `Invalid value for parameter "${key}": ${value}`
      );
    }
    value = num;
  } else if (
    key === 'client_no_context_takeover' ||
    key === 'server_no_context_takeover'
  ) {
    if (value !== true) {
      throw new TypeError(
        `Invalid value for parameter "${key}": ${value}`
      );
    }
  } else {
    throw new Error(`Unknown parameter "${key}"`);
  }

  params[key] = value;
});
});

return configurations;
}

/**
* Decompress data. Concurrency limited.
*
* @param {Buffer} data Compressed data
* @param {Boolean} fin Specifies whether or not this is the last fragment
* @param {Function} callback Callback
* @public
*/
decompress(data, fin, callback) {
zlibLimiter.add((done) => {
this._decompress(data, fin, (err, result) => {
  done();
  callback(err, result);
});
});
}

/**
* Compress data. Concurrency limited.
*
* @param {Buffer} data Data to compress
* @param {Boolean} fin Specifies whether or not this is the last fragment
* @param {Function} callback Callback
* @public
*/
compress(data, fin, callback) {
zlibLimiter.add((done) => {
this._compress(data, fin, (err, result) => {
  done();
  callback(err, result);
});
});
}

/**
* Decompress data.
*
* @param {Buffer} data Compressed data
* @param {Boolean} fin Specifies whether or not this is the last fragment
* @param {Function} callback Callback
* @private
*/
_decompress(data, fin, callback) {
const endpoint = this._isServer ? 'client' : 'server';

if (!this._inflate) {
const key = `${endpoint}_max_window_bits`;
const windowBits =
  typeof this.params[key] !== 'number'
    ? zlib__default['default'].Z_DEFAULT_WINDOWBITS
    : this.params[key];

this._inflate = zlib__default['default'].createInflateRaw({
  ...this._options.zlibInflateOptions,
  windowBits
});
this._inflate[kPerMessageDeflate] = this;
this._inflate[kTotalLength] = 0;
this._inflate[kBuffers] = [];
this._inflate.on('error', inflateOnError);
this._inflate.on('data', inflateOnData);
}

this._inflate[kCallback] = callback;

this._inflate.write(data);
if (fin) this._inflate.write(TRAILER);

this._inflate.flush(() => {
const err = this._inflate[kError];

if (err) {
  this._inflate.close();
  this._inflate = null;
  callback(err);
  return;
}

const data = bufferUtil.concat(
  this._inflate[kBuffers],
  this._inflate[kTotalLength]
);

if (fin && this.params[`${endpoint}_no_context_takeover`]) {
  this._inflate.close();
  this._inflate = null;
} else {
  this._inflate[kTotalLength] = 0;
  this._inflate[kBuffers] = [];
}

callback(null, data);
});
}

/**
* Compress data.
*
* @param {Buffer} data Data to compress
* @param {Boolean} fin Specifies whether or not this is the last fragment
* @param {Function} callback Callback
* @private
*/
_compress(data, fin, callback) {
const endpoint = this._isServer ? 'server' : 'client';

if (!this._deflate) {
const key = `${endpoint}_max_window_bits`;
const windowBits =
  typeof this.params[key] !== 'number'
    ? zlib__default['default'].Z_DEFAULT_WINDOWBITS
    : this.params[key];

this._deflate = zlib__default['default'].createDeflateRaw({
  ...this._options.zlibDeflateOptions,
  windowBits
});

this._deflate[kTotalLength] = 0;
this._deflate[kBuffers] = [];

//
// An `'error'` event is emitted, only on Node.js < 10.0.0, if the
// `zlib.DeflateRaw` instance is closed while data is being processed.
// This can happen if `PerMessageDeflate#cleanup()` is called at the wrong
// time due to an abnormal WebSocket closure.
//
this._deflate.on('error', NOOP);
this._deflate.on('data', deflateOnData);
}

this._deflate[kCallback] = callback;

this._deflate.write(data);
this._deflate.flush(zlib__default['default'].Z_SYNC_FLUSH, () => {
if (!this._deflate) {
  //
  // The deflate stream was closed while data was being processed.
  //
  return;
}

let data = bufferUtil.concat(
  this._deflate[kBuffers],
  this._deflate[kTotalLength]
);

if (fin) data = data.slice(0, data.length - 4);

//
// Ensure that the callback will not be called again in
// `PerMessageDeflate#cleanup()`.
//
this._deflate[kCallback] = null;

if (fin && this.params[`${endpoint}_no_context_takeover`]) {
  this._deflate.close();
  this._deflate = null;
} else {
  this._deflate[kTotalLength] = 0;
  this._deflate[kBuffers] = [];
}

callback(null, data);
});
}
}

var permessageDeflate = PerMessageDeflate;

/**
* The listener of the `zlib.DeflateRaw` stream `'data'` event.
*
* @param {Buffer} chunk A chunk of data
* @private
*/
function deflateOnData(chunk) {
this[kBuffers].push(chunk);
this[kTotalLength] += chunk.length;
}

/**
* The listener of the `zlib.InflateRaw` stream `'data'` event.
*
* @param {Buffer} chunk A chunk of data
* @private
*/
function inflateOnData(chunk) {
this[kTotalLength] += chunk.length;

if (
this[kPerMessageDeflate]._maxPayload < 1 ||
this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload
) {
this[kBuffers].push(chunk);
return;
}

this[kError] = new RangeError('Max payload size exceeded');
this[kError][kStatusCode] = 1009;
this.removeListener('data', inflateOnData);
this.reset();
}

/**
* The listener of the `zlib.InflateRaw` stream `'error'` event.
*
* @param {Error} err The emitted error
* @private
*/
function inflateOnError(err) {
//
// There is no need to call `Zlib#close()` as the handle is automatically
// closed when an error is emitted.
//
this[kPerMessageDeflate]._inflate = null;
err[kStatusCode] = 1007;
this[kCallback](err);
}

/**
* Checks if a given buffer contains only correct UTF-8.
* Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
* Markus Kuhn.
*
* @param {Buffer} buf The buffer to check
* @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
* @public
*/
const isValidUTF8 = (buf) => {
var len = buf.length;
var i = 0;

while (i < len) {
if (buf[i] < 0x80) {  // 0xxxxxxx
i++;
} else if ((buf[i] & 0xe0) === 0xc0) {  // 110xxxxx 10xxxxxx
if (
  i + 1 === len ||
  (buf[i + 1] & 0xc0) !== 0x80 ||
  (buf[i] & 0xfe) === 0xc0  // overlong
) {
  return false;
} else {
  i += 2;
}
} else if ((buf[i] & 0xf0) === 0xe0) {  // 1110xxxx 10xxxxxx 10xxxxxx
if (
  i + 2 >= len ||
  (buf[i + 1] & 0xc0) !== 0x80 ||
  (buf[i + 2] & 0xc0) !== 0x80 ||
  buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80 ||  // overlong
  buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0     // surrogate (U+D800 - U+DFFF)
) {
  return false;
} else {
  i += 3;
}
} else if ((buf[i] & 0xf8) === 0xf0) {  // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
if (
  i + 3 >= len ||
  (buf[i + 1] & 0xc0) !== 0x80 ||
  (buf[i + 2] & 0xc0) !== 0x80 ||
  (buf[i + 3] & 0xc0) !== 0x80 ||
  buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80 ||  // overlong
  buf[i] === 0xf4 && buf[i + 1] > 0x8f || buf[i] > 0xf4  // > U+10FFFF
) {
  return false;
} else {
  i += 4;
}
} else {
return false;
}
}

return true;
};

var fallback$1 = isValidUTF8;

var utf8Validate = createCommonjsModule(function (module) {

try {
module.exports = nodeGypBuild(__dirname);
} catch (e) {
module.exports = fallback$1;
}
});

var validation = createCommonjsModule(function (module, exports) {

try {
const isValidUTF8 = utf8Validate;

exports.isValidUTF8 =
typeof isValidUTF8 === 'object'
? isValidUTF8.Validation.isValidUTF8 // utf-8-validate@<3.0.0
: isValidUTF8;
} catch (e) /* istanbul ignore next */ {
exports.isValidUTF8 = () => true;
}

/**
* Checks if a status code is allowed in a close frame.
*
* @param {Number} code The status code
* @return {Boolean} `true` if the status code is valid, else `false`
* @public
*/
exports.isValidStatusCode = (code) => {
return (
(code >= 1000 &&
code <= 1014 &&
code !== 1004 &&
code !== 1005 &&
code !== 1006) ||
(code >= 3000 && code <= 4999)
);
};
});

const { Writable } = Stream__default['default'];


const {
BINARY_TYPES,
EMPTY_BUFFER,
kStatusCode: kStatusCode$1,
kWebSocket
} = constants;
const { concat, toArrayBuffer, unmask: unmask$1 } = bufferUtil;
const { isValidStatusCode, isValidUTF8: isValidUTF8$1 } = validation;

const GET_INFO = 0;
const GET_PAYLOAD_LENGTH_16 = 1;
const GET_PAYLOAD_LENGTH_64 = 2;
const GET_MASK = 3;
const GET_DATA = 4;
const INFLATING = 5;

/**
* HyBi Receiver implementation.
*
* @extends stream.Writable
*/
class Receiver extends Writable {
/**
* Creates a Receiver instance.
*
* @param {String} [binaryType=nodebuffer] The type for binary data
* @param {Object} [extensions] An object containing the negotiated extensions
* @param {Boolean} [isServer=false] Specifies whether to operate in client or
*     server mode
* @param {Number} [maxPayload=0] The maximum allowed message length
*/
constructor(binaryType, extensions, isServer, maxPayload) {
super();

this._binaryType = binaryType || BINARY_TYPES[0];
this[kWebSocket] = undefined;
this._extensions = extensions || {};
this._isServer = !!isServer;
this._maxPayload = maxPayload | 0;

this._bufferedBytes = 0;
this._buffers = [];

this._compressed = false;
this._payloadLength = 0;
this._mask = undefined;
this._fragmented = 0;
this._masked = false;
this._fin = false;
this._opcode = 0;

this._totalPayloadLength = 0;
this._messageLength = 0;
this._fragments = [];

this._state = GET_INFO;
this._loop = false;
}

/**
* Implements `Writable.prototype._write()`.
*
* @param {Buffer} chunk The chunk of data to write
* @param {String} encoding The character encoding of `chunk`
* @param {Function} cb Callback
* @private
*/
_write(chunk, encoding, cb) {
if (this._opcode === 0x08 && this._state == GET_INFO) return cb();

this._bufferedBytes += chunk.length;
this._buffers.push(chunk);
this.startLoop(cb);
}

/**
* Consumes `n` bytes from the buffered data.
*
* @param {Number} n The number of bytes to consume
* @return {Buffer} The consumed bytes
* @private
*/
consume(n) {
this._bufferedBytes -= n;

if (n === this._buffers[0].length) return this._buffers.shift();

if (n < this._buffers[0].length) {
const buf = this._buffers[0];
this._buffers[0] = buf.slice(n);
return buf.slice(0, n);
}

const dst = Buffer.allocUnsafe(n);

do {
const buf = this._buffers[0];
const offset = dst.length - n;

if (n >= buf.length) {
  dst.set(this._buffers.shift(), offset);
} else {
  dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
  this._buffers[0] = buf.slice(n);
}

n -= buf.length;
} while (n > 0);

return dst;
}

/**
* Starts the parsing loop.
*
* @param {Function} cb Callback
* @private
*/
startLoop(cb) {
let err;
this._loop = true;

do {
switch (this._state) {
  case GET_INFO:
    err = this.getInfo();
    break;
  case GET_PAYLOAD_LENGTH_16:
    err = this.getPayloadLength16();
    break;
  case GET_PAYLOAD_LENGTH_64:
    err = this.getPayloadLength64();
    break;
  case GET_MASK:
    this.getMask();
    break;
  case GET_DATA:
    err = this.getData(cb);
    break;
  default:
    // `INFLATING`
    this._loop = false;
    return;
}
} while (this._loop);

cb(err);
}

/**
* Reads the first two bytes of a frame.
*
* @return {(RangeError|undefined)} A possible error
* @private
*/
getInfo() {
if (this._bufferedBytes < 2) {
this._loop = false;
return;
}

const buf = this.consume(2);

if ((buf[0] & 0x30) !== 0x00) {
this._loop = false;
return error(RangeError, 'RSV2 and RSV3 must be clear', true, 1002);
}

const compressed = (buf[0] & 0x40) === 0x40;

if (compressed && !this._extensions[permessageDeflate.extensionName]) {
this._loop = false;
return error(RangeError, 'RSV1 must be clear', true, 1002);
}

this._fin = (buf[0] & 0x80) === 0x80;
this._opcode = buf[0] & 0x0f;
this._payloadLength = buf[1] & 0x7f;

if (this._opcode === 0x00) {
if (compressed) {
  this._loop = false;
  return error(RangeError, 'RSV1 must be clear', true, 1002);
}

if (!this._fragmented) {
  this._loop = false;
  return error(RangeError, 'invalid opcode 0', true, 1002);
}

this._opcode = this._fragmented;
} else if (this._opcode === 0x01 || this._opcode === 0x02) {
if (this._fragmented) {
  this._loop = false;
  return error(RangeError, `invalid opcode ${this._opcode}`, true, 1002);
}

this._compressed = compressed;
} else if (this._opcode > 0x07 && this._opcode < 0x0b) {
if (!this._fin) {
  this._loop = false;
  return error(RangeError, 'FIN must be set', true, 1002);
}

if (compressed) {
  this._loop = false;
  return error(RangeError, 'RSV1 must be clear', true, 1002);
}

if (this._payloadLength > 0x7d) {
  this._loop = false;
  return error(
    RangeError,
    `invalid payload length ${this._payloadLength}`,
    true,
    1002
  );
}
} else {
this._loop = false;
return error(RangeError, `invalid opcode ${this._opcode}`, true, 1002);
}

if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
this._masked = (buf[1] & 0x80) === 0x80;

if (this._isServer) {
if (!this._masked) {
  this._loop = false;
  return error(RangeError, 'MASK must be set', true, 1002);
}
} else if (this._masked) {
this._loop = false;
return error(RangeError, 'MASK must be clear', true, 1002);
}

if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
else return this.haveLength();
}

/**
* Gets extended payload length (7+16).
*
* @return {(RangeError|undefined)} A possible error
* @private
*/
getPayloadLength16() {
if (this._bufferedBytes < 2) {
this._loop = false;
return;
}

this._payloadLength = this.consume(2).readUInt16BE(0);
return this.haveLength();
}

/**
* Gets extended payload length (7+64).
*
* @return {(RangeError|undefined)} A possible error
* @private
*/
getPayloadLength64() {
if (this._bufferedBytes < 8) {
this._loop = false;
return;
}

const buf = this.consume(8);
const num = buf.readUInt32BE(0);

//
// The maximum safe integer in JavaScript is 2^53 - 1. An error is returned
// if payload length is greater than this number.
//
if (num > Math.pow(2, 53 - 32) - 1) {
this._loop = false;
return error(
  RangeError,
  'Unsupported WebSocket frame: payload length > 2^53 - 1',
  false,
  1009
);
}

this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
return this.haveLength();
}

/**
* Payload length has been read.
*
* @return {(RangeError|undefined)} A possible error
* @private
*/
haveLength() {
if (this._payloadLength && this._opcode < 0x08) {
this._totalPayloadLength += this._payloadLength;
if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
  this._loop = false;
  return error(RangeError, 'Max payload size exceeded', false, 1009);
}
}

if (this._masked) this._state = GET_MASK;
else this._state = GET_DATA;
}

/**
* Reads mask bytes.
*
* @private
*/
getMask() {
if (this._bufferedBytes < 4) {
this._loop = false;
return;
}

this._mask = this.consume(4);
this._state = GET_DATA;
}

/**
* Reads data bytes.
*
* @param {Function} cb Callback
* @return {(Error|RangeError|undefined)} A possible error
* @private
*/
getData(cb) {
let data = EMPTY_BUFFER;

if (this._payloadLength) {
if (this._bufferedBytes < this._payloadLength) {
  this._loop = false;
  return;
}

data = this.consume(this._payloadLength);
if (this._masked) unmask$1(data, this._mask);
}

if (this._opcode > 0x07) return this.controlMessage(data);

if (this._compressed) {
this._state = INFLATING;
this.decompress(data, cb);
return;
}

if (data.length) {
//
// This message is not compressed so its lenght is the sum of the payload
// length of all fragments.
//
this._messageLength = this._totalPayloadLength;
this._fragments.push(data);
}

return this.dataMessage();
}

/**
* Decompresses data.
*
* @param {Buffer} data Compressed data
* @param {Function} cb Callback
* @private
*/
decompress(data, cb) {
const perMessageDeflate = this._extensions[permessageDeflate.extensionName];

perMessageDeflate.decompress(data, this._fin, (err, buf) => {
if (err) return cb(err);

if (buf.length) {
  this._messageLength += buf.length;
  if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
    return cb(
      error(RangeError, 'Max payload size exceeded', false, 1009)
    );
  }

  this._fragments.push(buf);
}

const er = this.dataMessage();
if (er) return cb(er);

this.startLoop(cb);
});
}

/**
* Handles a data message.
*
* @return {(Error|undefined)} A possible error
* @private
*/
dataMessage() {
if (this._fin) {
const messageLength = this._messageLength;
const fragments = this._fragments;

this._totalPayloadLength = 0;
this._messageLength = 0;
this._fragmented = 0;
this._fragments = [];

if (this._opcode === 2) {
  let data;

  if (this._binaryType === 'nodebuffer') {
    data = concat(fragments, messageLength);
  } else if (this._binaryType === 'arraybuffer') {
    data = toArrayBuffer(concat(fragments, messageLength));
  } else {
    data = fragments;
  }

  this.emit('message', data);
} else {
  const buf = concat(fragments, messageLength);

  if (!isValidUTF8$1(buf)) {
    this._loop = false;
    return error(Error, 'invalid UTF-8 sequence', true, 1007);
  }

  this.emit('message', buf.toString());
}
}

this._state = GET_INFO;
}

/**
* Handles a control message.
*
* @param {Buffer} data Data to handle
* @return {(Error|RangeError|undefined)} A possible error
* @private
*/
controlMessage(data) {
if (this._opcode === 0x08) {
this._loop = false;

if (data.length === 0) {
  this.emit('conclude', 1005, '');
  this.end();
} else if (data.length === 1) {
  return error(RangeError, 'invalid payload length 1', true, 1002);
} else {
  const code = data.readUInt16BE(0);

  if (!isValidStatusCode(code)) {
    return error(RangeError, `invalid status code ${code}`, true, 1002);
  }

  const buf = data.slice(2);

  if (!isValidUTF8$1(buf)) {
    return error(Error, 'invalid UTF-8 sequence', true, 1007);
  }

  this.emit('conclude', code, buf.toString());
  this.end();
}
} else if (this._opcode === 0x09) {
this.emit('ping', data);
} else {
this.emit('pong', data);
}

this._state = GET_INFO;
}
}

var receiver = Receiver;

/**
* Builds an error object.
*
* @param {(Error|RangeError)} ErrorCtor The error constructor
* @param {String} message The error message
* @param {Boolean} prefix Specifies whether or not to add a default prefix to
*     `message`
* @param {Number} statusCode The status code
* @return {(Error|RangeError)} The error
* @private
*/
function error(ErrorCtor, message, prefix, statusCode) {
const err = new ErrorCtor(
prefix ? `Invalid WebSocket frame: ${message}` : message
);

Error.captureStackTrace(err, error);
err[kStatusCode$1] = statusCode;
return err;
}

const { randomFillSync } = crypto__default['default'];


const { EMPTY_BUFFER: EMPTY_BUFFER$1 } = constants;
const { isValidStatusCode: isValidStatusCode$1 } = validation;
const { mask: applyMask, toBuffer } = bufferUtil;

const mask$1 = Buffer.alloc(4);

/**
* HyBi Sender implementation.
*/
class Sender {
/**
* Creates a Sender instance.
*
* @param {net.Socket} socket The connection socket
* @param {Object} [extensions] An object containing the negotiated extensions
*/
constructor(socket, extensions) {
this._extensions = extensions || {};
this._socket = socket;

this._firstFragment = true;
this._compress = false;

this._bufferedBytes = 0;
this._deflating = false;
this._queue = [];
}

/**
* Frames a piece of data according to the HyBi WebSocket protocol.
*
* @param {Buffer} data The data to frame
* @param {Object} options Options object
* @param {Number} options.opcode The opcode
* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
*     modified
* @param {Boolean} [options.fin=false] Specifies whether or not to set the
*     FIN bit
* @param {Boolean} [options.mask=false] Specifies whether or not to mask
*     `data`
* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
*     RSV1 bit
* @return {Buffer[]} The framed data as a list of `Buffer` instances
* @public
*/
static frame(data, options) {
const merge = options.mask && options.readOnly;
let offset = options.mask ? 6 : 2;
let payloadLength = data.length;

if (data.length >= 65536) {
offset += 8;
payloadLength = 127;
} else if (data.length > 125) {
offset += 2;
payloadLength = 126;
}

const target = Buffer.allocUnsafe(merge ? data.length + offset : offset);

target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
if (options.rsv1) target[0] |= 0x40;

target[1] = payloadLength;

if (payloadLength === 126) {
target.writeUInt16BE(data.length, 2);
} else if (payloadLength === 127) {
target.writeUInt32BE(0, 2);
target.writeUInt32BE(data.length, 6);
}

if (!options.mask) return [target, data];

randomFillSync(mask$1, 0, 4);

target[1] |= 0x80;
target[offset - 4] = mask$1[0];
target[offset - 3] = mask$1[1];
target[offset - 2] = mask$1[2];
target[offset - 1] = mask$1[3];

if (merge) {
applyMask(data, mask$1, target, offset, data.length);
return [target];
}

applyMask(data, mask$1, data, 0, data.length);
return [target, data];
}

/**
* Sends a close message to the other peer.
*
* @param {Number} [code] The status code component of the body
* @param {String} [data] The message component of the body
* @param {Boolean} [mask=false] Specifies whether or not to mask the message
* @param {Function} [cb] Callback
* @public
*/
close(code, data, mask, cb) {
let buf;

if (code === undefined) {
buf = EMPTY_BUFFER$1;
} else if (typeof code !== 'number' || !isValidStatusCode$1(code)) {
throw new TypeError('First argument must be a valid error code number');
} else if (data === undefined || data === '') {
buf = Buffer.allocUnsafe(2);
buf.writeUInt16BE(code, 0);
} else {
const length = Buffer.byteLength(data);

if (length > 123) {
  throw new RangeError('The message must not be greater than 123 bytes');
}

buf = Buffer.allocUnsafe(2 + length);
buf.writeUInt16BE(code, 0);
buf.write(data, 2);
}

if (this._deflating) {
this.enqueue([this.doClose, buf, mask, cb]);
} else {
this.doClose(buf, mask, cb);
}
}

/**
* Frames and sends a close message.
*
* @param {Buffer} data The message to send
* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
* @param {Function} [cb] Callback
* @private
*/
doClose(data, mask, cb) {
this.sendFrame(
Sender.frame(data, {
  fin: true,
  rsv1: false,
  opcode: 0x08,
  mask,
  readOnly: false
}),
cb
);
}

/**
* Sends a ping message to the other peer.
*
* @param {*} data The message to send
* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
* @param {Function} [cb] Callback
* @public
*/
ping(data, mask, cb) {
const buf = toBuffer(data);

if (buf.length > 125) {
throw new RangeError('The data size must not be greater than 125 bytes');
}

if (this._deflating) {
this.enqueue([this.doPing, buf, mask, toBuffer.readOnly, cb]);
} else {
this.doPing(buf, mask, toBuffer.readOnly, cb);
}
}

/**
* Frames and sends a ping message.
*
* @param {Buffer} data The message to send
* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
* @param {Boolean} [readOnly=false] Specifies whether `data` can be modified
* @param {Function} [cb] Callback
* @private
*/
doPing(data, mask, readOnly, cb) {
this.sendFrame(
Sender.frame(data, {
  fin: true,
  rsv1: false,
  opcode: 0x09,
  mask,
  readOnly
}),
cb
);
}

/**
* Sends a pong message to the other peer.
*
* @param {*} data The message to send
* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
* @param {Function} [cb] Callback
* @public
*/
pong(data, mask, cb) {
const buf = toBuffer(data);

if (buf.length > 125) {
throw new RangeError('The data size must not be greater than 125 bytes');
}

if (this._deflating) {
this.enqueue([this.doPong, buf, mask, toBuffer.readOnly, cb]);
} else {
this.doPong(buf, mask, toBuffer.readOnly, cb);
}
}

/**
* Frames and sends a pong message.
*
* @param {Buffer} data The message to send
* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
* @param {Boolean} [readOnly=false] Specifies whether `data` can be modified
* @param {Function} [cb] Callback
* @private
*/
doPong(data, mask, readOnly, cb) {
this.sendFrame(
Sender.frame(data, {
  fin: true,
  rsv1: false,
  opcode: 0x0a,
  mask,
  readOnly
}),
cb
);
}

/**
* Sends a data message to the other peer.
*
* @param {*} data The message to send
* @param {Object} options Options object
* @param {Boolean} [options.compress=false] Specifies whether or not to
*     compress `data`
* @param {Boolean} [options.binary=false] Specifies whether `data` is binary
*     or text
* @param {Boolean} [options.fin=false] Specifies whether the fragment is the
*     last one
* @param {Boolean} [options.mask=false] Specifies whether or not to mask
*     `data`
* @param {Function} [cb] Callback
* @public
*/
send(data, options, cb) {
const buf = toBuffer(data);
const perMessageDeflate = this._extensions[permessageDeflate.extensionName];
let opcode = options.binary ? 2 : 1;
let rsv1 = options.compress;

if (this._firstFragment) {
this._firstFragment = false;
if (rsv1 && perMessageDeflate) {
  rsv1 = buf.length >= perMessageDeflate._threshold;
}
this._compress = rsv1;
} else {
rsv1 = false;
opcode = 0;
}

if (options.fin) this._firstFragment = true;

if (perMessageDeflate) {
const opts = {
  fin: options.fin,
  rsv1,
  opcode,
  mask: options.mask,
  readOnly: toBuffer.readOnly
};

if (this._deflating) {
  this.enqueue([this.dispatch, buf, this._compress, opts, cb]);
} else {
  this.dispatch(buf, this._compress, opts, cb);
}
} else {
this.sendFrame(
  Sender.frame(buf, {
    fin: options.fin,
    rsv1: false,
    opcode,
    mask: options.mask,
    readOnly: toBuffer.readOnly
  }),
  cb
);
}
}

/**
* Dispatches a data message.
*
* @param {Buffer} data The message to send
* @param {Boolean} [compress=false] Specifies whether or not to compress
*     `data`
* @param {Object} options Options object
* @param {Number} options.opcode The opcode
* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
*     modified
* @param {Boolean} [options.fin=false] Specifies whether or not to set the
*     FIN bit
* @param {Boolean} [options.mask=false] Specifies whether or not to mask
*     `data`
* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
*     RSV1 bit
* @param {Function} [cb] Callback
* @private
*/
dispatch(data, compress, options, cb) {
if (!compress) {
this.sendFrame(Sender.frame(data, options), cb);
return;
}

const perMessageDeflate = this._extensions[permessageDeflate.extensionName];

this._bufferedBytes += data.length;
this._deflating = true;
perMessageDeflate.compress(data, options.fin, (_, buf) => {
if (this._socket.destroyed) {
  const err = new Error(
    'The socket was closed while data was being compressed'
  );

  if (typeof cb === 'function') cb(err);

  for (let i = 0; i < this._queue.length; i++) {
    const callback = this._queue[i][4];

    if (typeof callback === 'function') callback(err);
  }

  return;
}

this._bufferedBytes -= data.length;
this._deflating = false;
options.readOnly = false;
this.sendFrame(Sender.frame(buf, options), cb);
this.dequeue();
});
}

/**
* Executes queued send operations.
*
* @private
*/
dequeue() {
while (!this._deflating && this._queue.length) {
const params = this._queue.shift();

this._bufferedBytes -= params[1].length;
Reflect.apply(params[0], this, params.slice(1));
}
}

/**
* Enqueues a send operation.
*
* @param {Array} params Send operation parameters.
* @private
*/
enqueue(params) {
this._bufferedBytes += params[1].length;
this._queue.push(params);
}

/**
* Sends a frame.
*
* @param {Buffer[]} list The frame to send
* @param {Function} [cb] Callback
* @private
*/
sendFrame(list, cb) {
if (list.length === 2) {
this._socket.cork();
this._socket.write(list[0]);
this._socket.write(list[1], cb);
this._socket.uncork();
} else {
this._socket.write(list[0], cb);
}
}
}

var sender = Sender;

/**
* Class representing an event.
*
* @private
*/
class Event {
/**
* Create a new `Event`.
*
* @param {String} type The name of the event
* @param {Object} target A reference to the target to which the event was
*     dispatched
*/
constructor(type, target) {
this.target = target;
this.type = type;
}
}

/**
* Class representing a message event.
*
* @extends Event
* @private
*/
class MessageEvent extends Event {
/**
* Create a new `MessageEvent`.
*
* @param {(String|Buffer|ArrayBuffer|Buffer[])} data The received data
* @param {WebSocket} target A reference to the target to which the event was
*     dispatched
*/
constructor(data, target) {
super('message', target);

this.data = data;
}
}

/**
* Class representing a close event.
*
* @extends Event
* @private
*/
class CloseEvent extends Event {
/**
* Create a new `CloseEvent`.
*
* @param {Number} code The status code explaining why the connection is being
*     closed
* @param {String} reason A human-readable string explaining why the
*     connection is closing
* @param {WebSocket} target A reference to the target to which the event was
*     dispatched
*/
constructor(code, reason, target) {
super('close', target);

this.wasClean = target._closeFrameReceived && target._closeFrameSent;
this.reason = reason;
this.code = code;
}
}

/**
* Class representing an open event.
*
* @extends Event
* @private
*/
class OpenEvent extends Event {
/**
* Create a new `OpenEvent`.
*
* @param {WebSocket} target A reference to the target to which the event was
*     dispatched
*/
constructor(target) {
super('open', target);
}
}

/**
* Class representing an error event.
*
* @extends Event
* @private
*/
class ErrorEvent extends Event {
/**
* Create a new `ErrorEvent`.
*
* @param {Object} error The error that generated this event
* @param {WebSocket} target A reference to the target to which the event was
*     dispatched
*/
constructor(error, target) {
super('error', target);

this.message = error.message;
this.error = error;
}
}

/**
* This provides methods for emulating the `EventTarget` interface. It's not
* meant to be used directly.
*
* @mixin
*/
const EventTarget = {
/**
* Register an event listener.
*
* @param {String} type A string representing the event type to listen for
* @param {Function} listener The listener to add
* @param {Object} [options] An options object specifies characteristics about
*     the event listener
* @param {Boolean} [options.once=false] A `Boolean`` indicating that the
*     listener should be invoked at most once after being added. If `true`,
*     the listener would be automatically removed when invoked.
* @public
*/
addEventListener(type, listener, options) {
if (typeof listener !== 'function') return;

function onMessage(data) {
listener.call(this, new MessageEvent(data, this));
}

function onClose(code, message) {
listener.call(this, new CloseEvent(code, message, this));
}

function onError(error) {
listener.call(this, new ErrorEvent(error, this));
}

function onOpen() {
listener.call(this, new OpenEvent(this));
}

const method = options && options.once ? 'once' : 'on';

if (type === 'message') {
onMessage._listener = listener;
this[method](type, onMessage);
} else if (type === 'close') {
onClose._listener = listener;
this[method](type, onClose);
} else if (type === 'error') {
onError._listener = listener;
this[method](type, onError);
} else if (type === 'open') {
onOpen._listener = listener;
this[method](type, onOpen);
} else {
this[method](type, listener);
}
},

/**
* Remove an event listener.
*
* @param {String} type A string representing the event type to remove
* @param {Function} listener The listener to remove
* @public
*/
removeEventListener(type, listener) {
const listeners = this.listeners(type);

for (let i = 0; i < listeners.length; i++) {
if (listeners[i] === listener || listeners[i]._listener === listener) {
  this.removeListener(type, listeners[i]);
}
}
}
};

var eventTarget = EventTarget;

//
// Allowed token characters:
//
// '!', '#', '$', '%', '&', ''', '*', '+', '-',
// '.', 0-9, A-Z, '^', '_', '`', a-z, '|', '~'
//
// tokenChars[32] === 0 // ' '
// tokenChars[33] === 1 // '!'
// tokenChars[34] === 0 // '"'
// ...
//
// prettier-ignore
const tokenChars = [
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, // 32 - 47
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, // 80 - 95
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0 // 112 - 127
];

/**
* Adds an offer to the map of extension offers or a parameter to the map of
* parameters.
*
* @param {Object} dest The map of extension offers or parameters
* @param {String} name The extension or parameter name
* @param {(Object|Boolean|String)} elem The extension parameters or the
*     parameter value
* @private
*/
function push(dest, name, elem) {
if (dest[name] === undefined) dest[name] = [elem];
else dest[name].push(elem);
}

/**
* Parses the `Sec-WebSocket-Extensions` header into an object.
*
* @param {String} header The field value of the header
* @return {Object} The parsed object
* @public
*/
function parse(header) {
const offers = Object.create(null);

if (header === undefined || header === '') return offers;

let params = Object.create(null);
let mustUnescape = false;
let isEscaping = false;
let inQuotes = false;
let extensionName;
let paramName;
let start = -1;
let end = -1;
let i = 0;

for (; i < header.length; i++) {
const code = header.charCodeAt(i);

if (extensionName === undefined) {
if (end === -1 && tokenChars[code] === 1) {
  if (start === -1) start = i;
} else if (code === 0x20 /* ' ' */ || code === 0x09 /* '\t' */) {
  if (end === -1 && start !== -1) end = i;
} else if (code === 0x3b /* ';' */ || code === 0x2c /* ',' */) {
  if (start === -1) {
    throw new SyntaxError(`Unexpected character at index ${i}`);
  }

  if (end === -1) end = i;
  const name = header.slice(start, end);
  if (code === 0x2c) {
    push(offers, name, params);
    params = Object.create(null);
  } else {
    extensionName = name;
  }

  start = end = -1;
} else {
  throw new SyntaxError(`Unexpected character at index ${i}`);
}
} else if (paramName === undefined) {
if (end === -1 && tokenChars[code] === 1) {
  if (start === -1) start = i;
} else if (code === 0x20 || code === 0x09) {
  if (end === -1 && start !== -1) end = i;
} else if (code === 0x3b || code === 0x2c) {
  if (start === -1) {
    throw new SyntaxError(`Unexpected character at index ${i}`);
  }

  if (end === -1) end = i;
  push(params, header.slice(start, end), true);
  if (code === 0x2c) {
    push(offers, extensionName, params);
    params = Object.create(null);
    extensionName = undefined;
  }

  start = end = -1;
} else if (code === 0x3d /* '=' */ && start !== -1 && end === -1) {
  paramName = header.slice(start, i);
  start = end = -1;
} else {
  throw new SyntaxError(`Unexpected character at index ${i}`);
}
} else {
//
// The value of a quoted-string after unescaping must conform to the
// token ABNF, so only token characters are valid.
// Ref: https://tools.ietf.org/html/rfc6455#section-9.1
//
if (isEscaping) {
  if (tokenChars[code] !== 1) {
    throw new SyntaxError(`Unexpected character at index ${i}`);
  }
  if (start === -1) start = i;
  else if (!mustUnescape) mustUnescape = true;
  isEscaping = false;
} else if (inQuotes) {
  if (tokenChars[code] === 1) {
    if (start === -1) start = i;
  } else if (code === 0x22 /* '"' */ && start !== -1) {
    inQuotes = false;
    end = i;
  } else if (code === 0x5c /* '\' */) {
    isEscaping = true;
  } else {
    throw new SyntaxError(`Unexpected character at index ${i}`);
  }
} else if (code === 0x22 && header.charCodeAt(i - 1) === 0x3d) {
  inQuotes = true;
} else if (end === -1 && tokenChars[code] === 1) {
  if (start === -1) start = i;
} else if (start !== -1 && (code === 0x20 || code === 0x09)) {
  if (end === -1) end = i;
} else if (code === 0x3b || code === 0x2c) {
  if (start === -1) {
    throw new SyntaxError(`Unexpected character at index ${i}`);
  }

  if (end === -1) end = i;
  let value = header.slice(start, end);
  if (mustUnescape) {
    value = value.replace(/\\/g, '');
    mustUnescape = false;
  }
  push(params, paramName, value);
  if (code === 0x2c) {
    push(offers, extensionName, params);
    params = Object.create(null);
    extensionName = undefined;
  }

  paramName = undefined;
  start = end = -1;
} else {
  throw new SyntaxError(`Unexpected character at index ${i}`);
}
}
}

if (start === -1 || inQuotes) {
throw new SyntaxError('Unexpected end of input');
}

if (end === -1) end = i;
const token = header.slice(start, end);
if (extensionName === undefined) {
push(offers, token, params);
} else {
if (paramName === undefined) {
push(params, token, true);
} else if (mustUnescape) {
push(params, paramName, token.replace(/\\/g, ''));
} else {
push(params, paramName, token);
}
push(offers, extensionName, params);
}

return offers;
}

/**
* Builds the `Sec-WebSocket-Extensions` header field value.
*
* @param {Object} extensions The map of extensions and parameters to format
* @return {String} A string representing the given object
* @public
*/
function format(extensions) {
return Object.keys(extensions)
.map((extension) => {
let configurations = extensions[extension];
if (!Array.isArray(configurations)) configurations = [configurations];
return configurations
  .map((params) => {
    return [extension]
      .concat(
        Object.keys(params).map((k) => {
          let values = params[k];
          if (!Array.isArray(values)) values = [values];
          return values
            .map((v) => (v === true ? k : `${k}=${v}`))
            .join('; ');
        })
      )
      .join('; ');
  })
  .join(', ');
})
.join(', ');
}

var extension = { format, parse };

const { randomBytes, createHash } = crypto__default['default'];
const { URL } = Url__default['default'];




const {
BINARY_TYPES: BINARY_TYPES$1,
EMPTY_BUFFER: EMPTY_BUFFER$2,
GUID,
kStatusCode: kStatusCode$2,
kWebSocket: kWebSocket$1,
NOOP: NOOP$1
} = constants;
const { addEventListener, removeEventListener } = eventTarget;
const { format: format$1, parse: parse$1 } = extension;
const { toBuffer: toBuffer$1 } = bufferUtil;

const readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
const protocolVersions = [8, 13];
const closeTimeout = 30 * 1000;

/**
* Class representing a WebSocket.
*
* @extends EventEmitter
*/
class WebSocket extends EventEmitter__default['default'] {
/**
* Create a new `WebSocket`.
*
* @param {(String|url.URL)} address The URL to which to connect
* @param {(String|String[])} [protocols] The subprotocols
* @param {Object} [options] Connection options
*/
constructor(address, protocols, options) {
super();

this._binaryType = BINARY_TYPES$1[0];
this._closeCode = 1006;
this._closeFrameReceived = false;
this._closeFrameSent = false;
this._closeMessage = '';
this._closeTimer = null;
this._extensions = {};
this._protocol = '';
this._readyState = WebSocket.CONNECTING;
this._receiver = null;
this._sender = null;
this._socket = null;

if (address !== null) {
this._bufferedAmount = 0;
this._isServer = false;
this._redirects = 0;

if (Array.isArray(protocols)) {
  protocols = protocols.join(', ');
} else if (typeof protocols === 'object' && protocols !== null) {
  options = protocols;
  protocols = undefined;
}

initAsClient(this, address, protocols, options);
} else {
this._isServer = true;
}
}

/**
* This deviates from the WHATWG interface since ws doesn't support the
* required default "blob" type (instead we define a custom "nodebuffer"
* type).
*
* @type {String}
*/
get binaryType() {
return this._binaryType;
}

set binaryType(type) {
if (!BINARY_TYPES$1.includes(type)) return;

this._binaryType = type;

//
// Allow to change `binaryType` on the fly.
//
if (this._receiver) this._receiver._binaryType = type;
}

/**
* @type {Number}
*/
get bufferedAmount() {
if (!this._socket) return this._bufferedAmount;

return this._socket._writableState.length + this._sender._bufferedBytes;
}

/**
* @type {String}
*/
get extensions() {
return Object.keys(this._extensions).join();
}

/**
* @type {String}
*/
get protocol() {
return this._protocol;
}

/**
* @type {Number}
*/
get readyState() {
return this._readyState;
}

/**
* @type {String}
*/
get url() {
return this._url;
}

/**
* Set up the socket and the internal resources.
*
* @param {net.Socket} socket The network socket between the server and client
* @param {Buffer} head The first packet of the upgraded stream
* @param {Number} [maxPayload=0] The maximum allowed message size
* @private
*/
setSocket(socket, head, maxPayload) {
const receiver$1 = new receiver(
this.binaryType,
this._extensions,
this._isServer,
maxPayload
);

this._sender = new sender(socket, this._extensions);
this._receiver = receiver$1;
this._socket = socket;

receiver$1[kWebSocket$1] = this;
socket[kWebSocket$1] = this;

receiver$1.on('conclude', receiverOnConclude);
receiver$1.on('drain', receiverOnDrain);
receiver$1.on('error', receiverOnError);
receiver$1.on('message', receiverOnMessage);
receiver$1.on('ping', receiverOnPing);
receiver$1.on('pong', receiverOnPong);

socket.setTimeout(0);
socket.setNoDelay();

if (head.length > 0) socket.unshift(head);

socket.on('close', socketOnClose);
socket.on('data', socketOnData);
socket.on('end', socketOnEnd);
socket.on('error', socketOnError);

this._readyState = WebSocket.OPEN;
this.emit('open');
}

/**
* Emit the `'close'` event.
*
* @private
*/
emitClose() {
if (!this._socket) {
this._readyState = WebSocket.CLOSED;
this.emit('close', this._closeCode, this._closeMessage);
return;
}

if (this._extensions[permessageDeflate.extensionName]) {
this._extensions[permessageDeflate.extensionName].cleanup();
}

this._receiver.removeAllListeners();
this._readyState = WebSocket.CLOSED;
this.emit('close', this._closeCode, this._closeMessage);
}

/**
* Start a closing handshake.
*
*          +----------+   +-----------+   +----------+
*     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
*    |     +----------+   +-----------+   +----------+     |
*          +----------+   +-----------+         |
* CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
*          +----------+   +-----------+   |
*    |           |                        |   +---+        |
*                +------------------------+-->|fin| - - - -
*    |         +---+                      |   +---+
*     - - - - -|fin|<---------------------+
*              +---+
*
* @param {Number} [code] Status code explaining why the connection is closing
* @param {String} [data] A string explaining why the connection is closing
* @public
*/
close(code, data) {
if (this.readyState === WebSocket.CLOSED) return;
if (this.readyState === WebSocket.CONNECTING) {
const msg = 'WebSocket was closed before the connection was established';
return abortHandshake(this, this._req, msg);
}

if (this.readyState === WebSocket.CLOSING) {
if (this._closeFrameSent && this._closeFrameReceived) this._socket.end();
return;
}

this._readyState = WebSocket.CLOSING;
this._sender.close(code, data, !this._isServer, (err) => {
//
// This error is handled by the `'error'` listener on the socket. We only
// want to know if the close frame has been sent here.
//
if (err) return;

this._closeFrameSent = true;
if (this._closeFrameReceived) this._socket.end();
});

//
// Specify a timeout for the closing handshake to complete.
//
this._closeTimer = setTimeout(
this._socket.destroy.bind(this._socket),
closeTimeout
);
}

/**
* Send a ping.
*
* @param {*} [data] The data to send
* @param {Boolean} [mask] Indicates whether or not to mask `data`
* @param {Function} [cb] Callback which is executed when the ping is sent
* @public
*/
ping(data, mask, cb) {
if (this.readyState === WebSocket.CONNECTING) {
throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
}

if (typeof data === 'function') {
cb = data;
data = mask = undefined;
} else if (typeof mask === 'function') {
cb = mask;
mask = undefined;
}

if (typeof data === 'number') data = data.toString();

if (this.readyState !== WebSocket.OPEN) {
sendAfterClose(this, data, cb);
return;
}

if (mask === undefined) mask = !this._isServer;
this._sender.ping(data || EMPTY_BUFFER$2, mask, cb);
}

/**
* Send a pong.
*
* @param {*} [data] The data to send
* @param {Boolean} [mask] Indicates whether or not to mask `data`
* @param {Function} [cb] Callback which is executed when the pong is sent
* @public
*/
pong(data, mask, cb) {
if (this.readyState === WebSocket.CONNECTING) {
throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
}

if (typeof data === 'function') {
cb = data;
data = mask = undefined;
} else if (typeof mask === 'function') {
cb = mask;
mask = undefined;
}

if (typeof data === 'number') data = data.toString();

if (this.readyState !== WebSocket.OPEN) {
sendAfterClose(this, data, cb);
return;
}

if (mask === undefined) mask = !this._isServer;
this._sender.pong(data || EMPTY_BUFFER$2, mask, cb);
}

/**
* Send a data message.
*
* @param {*} data The message to send
* @param {Object} [options] Options object
* @param {Boolean} [options.compress] Specifies whether or not to compress
*     `data`
* @param {Boolean} [options.binary] Specifies whether `data` is binary or
*     text
* @param {Boolean} [options.fin=true] Specifies whether the fragment is the
*     last one
* @param {Boolean} [options.mask] Specifies whether or not to mask `data`
* @param {Function} [cb] Callback which is executed when data is written out
* @public
*/
send(data, options, cb) {
if (this.readyState === WebSocket.CONNECTING) {
throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
}

if (typeof options === 'function') {
cb = options;
options = {};
}

if (typeof data === 'number') data = data.toString();

if (this.readyState !== WebSocket.OPEN) {
sendAfterClose(this, data, cb);
return;
}

const opts = {
binary: typeof data !== 'string',
mask: !this._isServer,
compress: true,
fin: true,
...options
};

if (!this._extensions[permessageDeflate.extensionName]) {
opts.compress = false;
}

this._sender.send(data || EMPTY_BUFFER$2, opts, cb);
}

/**
* Forcibly close the connection.
*
* @public
*/
terminate() {
if (this.readyState === WebSocket.CLOSED) return;
if (this.readyState === WebSocket.CONNECTING) {
const msg = 'WebSocket was closed before the connection was established';
return abortHandshake(this, this._req, msg);
}

if (this._socket) {
this._readyState = WebSocket.CLOSING;
this._socket.destroy();
}
}
}

readyStates.forEach((readyState, i) => {
const descriptor = { enumerable: true, value: i };

Object.defineProperty(WebSocket.prototype, readyState, descriptor);
Object.defineProperty(WebSocket, readyState, descriptor);
});

[
'binaryType',
'bufferedAmount',
'extensions',
'protocol',
'readyState',
'url'
].forEach((property) => {
Object.defineProperty(WebSocket.prototype, property, { enumerable: true });
});

//
// Add the `onopen`, `onerror`, `onclose`, and `onmessage` attributes.
// See https://html.spec.whatwg.org/multipage/comms.html#the-websocket-interface
//
['open', 'error', 'close', 'message'].forEach((method) => {
Object.defineProperty(WebSocket.prototype, `on${method}`, {
configurable: true,
enumerable: true,
/**
* Return the listener of the event.
*
* @return {(Function|undefined)} The event listener or `undefined`
* @public
*/
get() {
const listeners = this.listeners(method);
for (let i = 0; i < listeners.length; i++) {
  if (listeners[i]._listener) return listeners[i]._listener;
}

return undefined;
},
/**
* Add a listener for the event.
*
* @param {Function} listener The listener to add
* @public
*/
set(listener) {
const listeners = this.listeners(method);
for (let i = 0; i < listeners.length; i++) {
  //
  // Remove only the listeners added via `addEventListener`.
  //
  if (listeners[i]._listener) this.removeListener(method, listeners[i]);
}
this.addEventListener(method, listener);
}
});
});

WebSocket.prototype.addEventListener = addEventListener;
WebSocket.prototype.removeEventListener = removeEventListener;

var websocket = WebSocket;

/**
* Initialize a WebSocket client.
*
* @param {WebSocket} websocket The client to initialize
* @param {(String|url.URL)} address The URL to which to connect
* @param {String} [protocols] The subprotocols
* @param {Object} [options] Connection options
* @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
*     permessage-deflate
* @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
*     handshake request
* @param {Number} [options.protocolVersion=13] Value of the
*     `Sec-WebSocket-Version` header
* @param {String} [options.origin] Value of the `Origin` or
*     `Sec-WebSocket-Origin` header
* @param {Number} [options.maxPayload=104857600] The maximum allowed message
*     size
* @param {Boolean} [options.followRedirects=false] Whether or not to follow
*     redirects
* @param {Number} [options.maxRedirects=10] The maximum number of redirects
*     allowed
* @private
*/
function initAsClient(websocket, address, protocols, options) {
const opts = {
protocolVersion: protocolVersions[1],
maxPayload: 100 * 1024 * 1024,
perMessageDeflate: true,
followRedirects: false,
maxRedirects: 10,
...options,
createConnection: undefined,
socketPath: undefined,
hostname: undefined,
protocol: undefined,
timeout: undefined,
method: undefined,
host: undefined,
path: undefined,
port: undefined
};

if (!protocolVersions.includes(opts.protocolVersion)) {
throw new RangeError(
`Unsupported protocol version: ${opts.protocolVersion} ` +
  `(supported versions: ${protocolVersions.join(', ')})`
);
}

let parsedUrl;

if (address instanceof URL) {
parsedUrl = address;
websocket._url = address.href;
} else {
parsedUrl = new URL(address);
websocket._url = address;
}

const isUnixSocket = parsedUrl.protocol === 'ws+unix:';

if (!parsedUrl.host && (!isUnixSocket || !parsedUrl.pathname)) {
throw new Error(`Invalid URL: ${websocket.url}`);
}

const isSecure =
parsedUrl.protocol === 'wss:' || parsedUrl.protocol === 'https:';
const defaultPort = isSecure ? 443 : 80;
const key = randomBytes(16).toString('base64');
const get = isSecure ? https__default['default'].get : http__default['default'].get;
let perMessageDeflate;

opts.createConnection = isSecure ? tlsConnect : netConnect;
opts.defaultPort = opts.defaultPort || defaultPort;
opts.port = parsedUrl.port || defaultPort;
opts.host = parsedUrl.hostname.startsWith('[')
? parsedUrl.hostname.slice(1, -1)
: parsedUrl.hostname;
opts.headers = {
'Sec-WebSocket-Version': opts.protocolVersion,
'Sec-WebSocket-Key': key,
Connection: 'Upgrade',
Upgrade: 'websocket',
...opts.headers
};
opts.path = parsedUrl.pathname + parsedUrl.search;
opts.timeout = opts.handshakeTimeout;

if (opts.perMessageDeflate) {
perMessageDeflate = new permessageDeflate(
opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
false,
opts.maxPayload
);
opts.headers['Sec-WebSocket-Extensions'] = format$1({
[permessageDeflate.extensionName]: perMessageDeflate.offer()
});
}
if (protocols) {
opts.headers['Sec-WebSocket-Protocol'] = protocols;
}
if (opts.origin) {
if (opts.protocolVersion < 13) {
opts.headers['Sec-WebSocket-Origin'] = opts.origin;
} else {
opts.headers.Origin = opts.origin;
}
}
if (parsedUrl.username || parsedUrl.password) {
opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
}

if (isUnixSocket) {
const parts = opts.path.split(':');

opts.socketPath = parts[0];
opts.path = parts[1];
}

let req = (websocket._req = get(opts));

if (opts.timeout) {
req.on('timeout', () => {
abortHandshake(websocket, req, 'Opening handshake has timed out');
});
}

req.on('error', (err) => {
if (req === null || req.aborted) return;

req = websocket._req = null;
websocket._readyState = WebSocket.CLOSING;
websocket.emit('error', err);
websocket.emitClose();
});

req.on('response', (res) => {
const location = res.headers.location;
const statusCode = res.statusCode;

if (
location &&
opts.followRedirects &&
statusCode >= 300 &&
statusCode < 400
) {
if (++websocket._redirects > opts.maxRedirects) {
  abortHandshake(websocket, req, 'Maximum redirects exceeded');
  return;
}

req.abort();

const addr = new URL(location, address);

initAsClient(websocket, addr, protocols, options);
} else if (!websocket.emit('unexpected-response', req, res)) {
abortHandshake(
  websocket,
  req,
  `Unexpected server response: ${res.statusCode}`
);
}
});

req.on('upgrade', (res, socket, head) => {
websocket.emit('upgrade', res);

//
// The user may have closed the connection from a listener of the `upgrade`
// event.
//
if (websocket.readyState !== WebSocket.CONNECTING) return;

req = websocket._req = null;

const digest = createHash('sha1')
.update(key + GUID)
.digest('base64');

if (res.headers['sec-websocket-accept'] !== digest) {
abortHandshake(websocket, socket, 'Invalid Sec-WebSocket-Accept header');
return;
}

const serverProt = res.headers['sec-websocket-protocol'];
const protList = (protocols || '').split(/, */);
let protError;

if (!protocols && serverProt) {
protError = 'Server sent a subprotocol but none was requested';
} else if (protocols && !serverProt) {
protError = 'Server sent no subprotocol';
} else if (serverProt && !protList.includes(serverProt)) {
protError = 'Server sent an invalid subprotocol';
}

if (protError) {
abortHandshake(websocket, socket, protError);
return;
}

if (serverProt) websocket._protocol = serverProt;

if (perMessageDeflate) {
try {
  const extensions = parse$1(res.headers['sec-websocket-extensions']);

  if (extensions[permessageDeflate.extensionName]) {
    perMessageDeflate.accept(extensions[permessageDeflate.extensionName]);
    websocket._extensions[
      permessageDeflate.extensionName
    ] = perMessageDeflate;
  }
} catch (err) {
  abortHandshake(
    websocket,
    socket,
    'Invalid Sec-WebSocket-Extensions header'
  );
  return;
}
}

websocket.setSocket(socket, head, opts.maxPayload);
});
}

/**
* Create a `net.Socket` and initiate a connection.
*
* @param {Object} options Connection options
* @return {net.Socket} The newly created socket used to start the connection
* @private
*/
function netConnect(options) {
options.path = options.socketPath;
return net__default['default'].connect(options);
}

/**
* Create a `tls.TLSSocket` and initiate a connection.
*
* @param {Object} options Connection options
* @return {tls.TLSSocket} The newly created socket used to start the connection
* @private
*/
function tlsConnect(options) {
options.path = undefined;

if (!options.servername && options.servername !== '') {
options.servername = net__default['default'].isIP(options.host) ? '' : options.host;
}

return tls__default['default'].connect(options);
}

/**
* Abort the handshake and emit an error.
*
* @param {WebSocket} websocket The WebSocket instance
* @param {(http.ClientRequest|net.Socket)} stream The request to abort or the
*     socket to destroy
* @param {String} message The error message
* @private
*/
function abortHandshake(websocket, stream, message) {
websocket._readyState = WebSocket.CLOSING;

const err = new Error(message);
Error.captureStackTrace(err, abortHandshake);

if (stream.setHeader) {
stream.abort();
stream.once('abort', websocket.emitClose.bind(websocket));
websocket.emit('error', err);
} else {
stream.destroy(err);
stream.once('error', websocket.emit.bind(websocket, 'error'));
stream.once('close', websocket.emitClose.bind(websocket));
}
}

/**
* Handle cases where the `ping()`, `pong()`, or `send()` methods are called
* when the `readyState` attribute is `CLOSING` or `CLOSED`.
*
* @param {WebSocket} websocket The WebSocket instance
* @param {*} [data] The data to send
* @param {Function} [cb] Callback
* @private
*/
function sendAfterClose(websocket, data, cb) {
if (data) {
const length = toBuffer$1(data).length;

//
// The `_bufferedAmount` property is used only when the peer is a client and
// the opening handshake fails. Under these circumstances, in fact, the
// `setSocket()` method is not called, so the `_socket` and `_sender`
// properties are set to `null`.
//
if (websocket._socket) websocket._sender._bufferedBytes += length;
else websocket._bufferedAmount += length;
}

if (cb) {
const err = new Error(
`WebSocket is not open: readyState ${websocket.readyState} ` +
  `(${readyStates[websocket.readyState]})`
);
cb(err);
}
}

/**
* The listener of the `Receiver` `'conclude'` event.
*
* @param {Number} code The status code
* @param {String} reason The reason for closing
* @private
*/
function receiverOnConclude(code, reason) {
const websocket = this[kWebSocket$1];

websocket._socket.removeListener('data', socketOnData);
websocket._socket.resume();

websocket._closeFrameReceived = true;
websocket._closeMessage = reason;
websocket._closeCode = code;

if (code === 1005) websocket.close();
else websocket.close(code, reason);
}

/**
* The listener of the `Receiver` `'drain'` event.
*
* @private
*/
function receiverOnDrain() {
this[kWebSocket$1]._socket.resume();
}

/**
* The listener of the `Receiver` `'error'` event.
*
* @param {(RangeError|Error)} err The emitted error
* @private
*/
function receiverOnError(err) {
const websocket = this[kWebSocket$1];

websocket._socket.removeListener('data', socketOnData);

websocket._readyState = WebSocket.CLOSING;
websocket._closeCode = err[kStatusCode$2];
websocket.emit('error', err);
websocket._socket.destroy();
}

/**
* The listener of the `Receiver` `'finish'` event.
*
* @private
*/
function receiverOnFinish() {
this[kWebSocket$1].emitClose();
}

/**
* The listener of the `Receiver` `'message'` event.
*
* @param {(String|Buffer|ArrayBuffer|Buffer[])} data The message
* @private
*/
function receiverOnMessage(data) {
this[kWebSocket$1].emit('message', data);
}

/**
* The listener of the `Receiver` `'ping'` event.
*
* @param {Buffer} data The data included in the ping frame
* @private
*/
function receiverOnPing(data) {
const websocket = this[kWebSocket$1];

websocket.pong(data, !websocket._isServer, NOOP$1);
websocket.emit('ping', data);
}

/**
* The listener of the `Receiver` `'pong'` event.
*
* @param {Buffer} data The data included in the pong frame
* @private
*/
function receiverOnPong(data) {
this[kWebSocket$1].emit('pong', data);
}

/**
* The listener of the `net.Socket` `'close'` event.
*
* @private
*/
function socketOnClose() {
const websocket = this[kWebSocket$1];

this.removeListener('close', socketOnClose);
this.removeListener('end', socketOnEnd);

websocket._readyState = WebSocket.CLOSING;

//
// The close frame might not have been received or the `'end'` event emitted,
// for example, if the socket was destroyed due to an error. Ensure that the
// `receiver` stream is closed after writing any remaining buffered data to
// it. If the readable side of the socket is in flowing mode then there is no
// buffered data as everything has been already written and `readable.read()`
// will return `null`. If instead, the socket is paused, any possible buffered
// data will be read as a single chunk and emitted synchronously in a single
// `'data'` event.
//
websocket._socket.read();
websocket._receiver.end();

this.removeListener('data', socketOnData);
this[kWebSocket$1] = undefined;

clearTimeout(websocket._closeTimer);

if (
websocket._receiver._writableState.finished ||
websocket._receiver._writableState.errorEmitted
) {
websocket.emitClose();
} else {
websocket._receiver.on('error', receiverOnFinish);
websocket._receiver.on('finish', receiverOnFinish);
}
}

/**
* The listener of the `net.Socket` `'data'` event.
*
* @param {Buffer} chunk A chunk of data
* @private
*/
function socketOnData(chunk) {
if (!this[kWebSocket$1]._receiver.write(chunk)) {
this.pause();
}
}

/**
* The listener of the `net.Socket` `'end'` event.
*
* @private
*/
function socketOnEnd() {
const websocket = this[kWebSocket$1];

websocket._readyState = WebSocket.CLOSING;
websocket._receiver.end();
this.end();
}

/**
* The listener of the `net.Socket` `'error'` event.
*
* @private
*/
function socketOnError() {
const websocket = this[kWebSocket$1];

this.removeListener('error', socketOnError);
this.on('error', NOOP$1);

if (websocket) {
websocket._readyState = WebSocket.CLOSING;
this.destroy();
}
}

const { Duplex } = Stream__default['default'];

/**
* Emits the `'close'` event on a stream.
*
* @param {stream.Duplex} The stream.
* @private
*/
function emitClose(stream) {
stream.emit('close');
}

/**
* The listener of the `'end'` event.
*
* @private
*/
function duplexOnEnd() {
if (!this.destroyed && this._writableState.finished) {
this.destroy();
}
}

/**
* The listener of the `'error'` event.
*
* @param {Error} err The error
* @private
*/
function duplexOnError(err) {
this.removeListener('error', duplexOnError);
this.destroy();
if (this.listenerCount('error') === 0) {
// Do not suppress the throwing behavior.
this.emit('error', err);
}
}

/**
* Wraps a `WebSocket` in a duplex stream.
*
* @param {WebSocket} ws The `WebSocket` to wrap
* @param {Object} [options] The options for the `Duplex` constructor
* @return {stream.Duplex} The duplex stream
* @public
*/
function createWebSocketStream(ws, options) {
let resumeOnReceiverDrain = true;

function receiverOnDrain() {
if (resumeOnReceiverDrain) ws._socket.resume();
}

if (ws.readyState === ws.CONNECTING) {
ws.once('open', function open() {
ws._receiver.removeAllListeners('drain');
ws._receiver.on('drain', receiverOnDrain);
});
} else {
ws._receiver.removeAllListeners('drain');
ws._receiver.on('drain', receiverOnDrain);
}

const duplex = new Duplex({
...options,
autoDestroy: false,
emitClose: false,
objectMode: false,
writableObjectMode: false
});

ws.on('message', function message(msg) {
if (!duplex.push(msg)) {
resumeOnReceiverDrain = false;
ws._socket.pause();
}
});

ws.once('error', function error(err) {
if (duplex.destroyed) return;

duplex.destroy(err);
});

ws.once('close', function close() {
if (duplex.destroyed) return;

duplex.push(null);
});

duplex._destroy = function (err, callback) {
if (ws.readyState === ws.CLOSED) {
callback(err);
process.nextTick(emitClose, duplex);
return;
}

let called = false;

ws.once('error', function error(err) {
called = true;
callback(err);
});

ws.once('close', function close() {
if (!called) callback(err);
process.nextTick(emitClose, duplex);
});
ws.terminate();
};

duplex._final = function (callback) {
if (ws.readyState === ws.CONNECTING) {
ws.once('open', function open() {
  duplex._final(callback);
});
return;
}

// If the value of the `_socket` property is `null` it means that `ws` is a
// client websocket and the handshake failed. In fact, when this happens, a
// socket is never assigned to the websocket. Wait for the `'error'` event
// that will be emitted by the websocket.
if (ws._socket === null) return;

if (ws._socket._writableState.finished) {
callback();
if (duplex._readableState.endEmitted) duplex.destroy();
} else {
ws._socket.once('finish', function finish() {
  // `duplex` is not destroyed here because the `'end'` event will be
  // emitted on `duplex` after this `'finish'` event. The EOF signaling
  // `null` chunk is, in fact, pushed when the websocket emits `'close'`.
  callback();
});
ws.close();
}
};

duplex._read = function () {
if (ws.readyState === ws.OPEN && !resumeOnReceiverDrain) {
resumeOnReceiverDrain = true;
if (!ws._receiver._writableState.needDrain) ws._socket.resume();
}
};

duplex._write = function (chunk, encoding, callback) {
if (ws.readyState === ws.CONNECTING) {
ws.once('open', function open() {
  duplex._write(chunk, encoding, callback);
});
return;
}

ws.send(chunk, callback);
};

duplex.on('end', duplexOnEnd);
duplex.on('error', duplexOnError);
return duplex;
}

var stream = createWebSocketStream;

const { createHash: createHash$1 } = crypto__default['default'];
const { createServer, STATUS_CODES } = http__default['default'];



const { format: format$2, parse: parse$2 } = extension;
const { GUID: GUID$1, kWebSocket: kWebSocket$2 } = constants;

const keyRegex = /^[+/0-9A-Za-z]{22}==$/;

/**
* Class representing a WebSocket server.
*
* @extends EventEmitter
*/
class WebSocketServer extends EventEmitter__default['default'] {
/**
* Create a `WebSocketServer` instance.
*
* @param {Object} options Configuration options
* @param {Number} [options.backlog=511] The maximum length of the queue of
*     pending connections
* @param {Boolean} [options.clientTracking=true] Specifies whether or not to
*     track clients
* @param {Function} [options.handleProtocols] A hook to handle protocols
* @param {String} [options.host] The hostname where to bind the server
* @param {Number} [options.maxPayload=104857600] The maximum allowed message
*     size
* @param {Boolean} [options.noServer=false] Enable no server mode
* @param {String} [options.path] Accept only connections matching this path
* @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
*     permessage-deflate
* @param {Number} [options.port] The port where to bind the server
* @param {http.Server} [options.server] A pre-created HTTP/S server to use
* @param {Function} [options.verifyClient] A hook to reject connections
* @param {Function} [callback] A listener for the `listening` event
*/
constructor(options, callback) {
super();

options = {
maxPayload: 100 * 1024 * 1024,
perMessageDeflate: false,
handleProtocols: null,
clientTracking: true,
verifyClient: null,
noServer: false,
backlog: null, // use default (511 as implemented in net.js)
server: null,
host: null,
path: null,
port: null,
...options
};

if (options.port == null && !options.server && !options.noServer) {
throw new TypeError(
  'One of the "port", "server", or "noServer" options must be specified'
);
}

if (options.port != null) {
this._server = createServer((req, res) => {
  const body = STATUS_CODES[426];

  res.writeHead(426, {
    'Content-Length': body.length,
    'Content-Type': 'text/plain'
  });
  res.end(body);
});
this._server.listen(
  options.port,
  options.host,
  options.backlog,
  callback
);
} else if (options.server) {
this._server = options.server;
}

if (this._server) {
const emitConnection = this.emit.bind(this, 'connection');

this._removeListeners = addListeners(this._server, {
  listening: this.emit.bind(this, 'listening'),
  error: this.emit.bind(this, 'error'),
  upgrade: (req, socket, head) => {
    this.handleUpgrade(req, socket, head, emitConnection);
  }
});
}

if (options.perMessageDeflate === true) options.perMessageDeflate = {};
if (options.clientTracking) this.clients = new Set();
this.options = options;
}

/**
* Returns the bound address, the address family name, and port of the server
* as reported by the operating system if listening on an IP socket.
* If the server is listening on a pipe or UNIX domain socket, the name is
* returned as a string.
*
* @return {(Object|String|null)} The address of the server
* @public
*/
address() {
if (this.options.noServer) {
throw new Error('The server is operating in "noServer" mode');
}

if (!this._server) return null;
return this._server.address();
}

/**
* Close the server.
*
* @param {Function} [cb] Callback
* @public
*/
close(cb) {
if (cb) this.once('close', cb);

//
// Terminate all associated clients.
//
if (this.clients) {
for (const client of this.clients) client.terminate();
}

const server = this._server;

if (server) {
this._removeListeners();
this._removeListeners = this._server = null;

//
// Close the http server if it was internally created.
//
if (this.options.port != null) {
  server.close(() => this.emit('close'));
  return;
}
}

process.nextTick(emitClose$1, this);
}

/**
* See if a given request should be handled by this server instance.
*
* @param {http.IncomingMessage} req Request object to inspect
* @return {Boolean} `true` if the request is valid, else `false`
* @public
*/
shouldHandle(req) {
if (this.options.path) {
const index = req.url.indexOf('?');
const pathname = index !== -1 ? req.url.slice(0, index) : req.url;

if (pathname !== this.options.path) return false;
}

return true;
}

/**
* Handle a HTTP Upgrade request.
*
* @param {http.IncomingMessage} req The request object
* @param {net.Socket} socket The network socket between the server and client
* @param {Buffer} head The first packet of the upgraded stream
* @param {Function} cb Callback
* @public
*/
handleUpgrade(req, socket, head, cb) {
socket.on('error', socketOnError$1);

const key =
req.headers['sec-websocket-key'] !== undefined
  ? req.headers['sec-websocket-key'].trim()
  : false;
const version = +req.headers['sec-websocket-version'];
const extensions = {};

if (
req.method !== 'GET' ||
req.headers.upgrade.toLowerCase() !== 'websocket' ||
!key ||
!keyRegex.test(key) ||
(version !== 8 && version !== 13) ||
!this.shouldHandle(req)
) {
return abortHandshake$1(socket, 400);
}

if (this.options.perMessageDeflate) {
const perMessageDeflate = new permessageDeflate(
  this.options.perMessageDeflate,
  true,
  this.options.maxPayload
);

try {
  const offers = parse$2(req.headers['sec-websocket-extensions']);

  if (offers[permessageDeflate.extensionName]) {
    perMessageDeflate.accept(offers[permessageDeflate.extensionName]);
    extensions[permessageDeflate.extensionName] = perMessageDeflate;
  }
} catch (err) {
  return abortHandshake$1(socket, 400);
}
}

//
// Optionally call external client verification handler.
//
if (this.options.verifyClient) {
const info = {
  origin:
    req.headers[`${version === 8 ? 'sec-websocket-origin' : 'origin'}`],
  secure: !!(req.connection.authorized || req.connection.encrypted),
  req
};

if (this.options.verifyClient.length === 2) {
  this.options.verifyClient(info, (verified, code, message, headers) => {
    if (!verified) {
      return abortHandshake$1(socket, code || 401, message, headers);
    }

    this.completeUpgrade(key, extensions, req, socket, head, cb);
  });
  return;
}

if (!this.options.verifyClient(info)) return abortHandshake$1(socket, 401);
}

this.completeUpgrade(key, extensions, req, socket, head, cb);
}

/**
* Upgrade the connection to WebSocket.
*
* @param {String} key The value of the `Sec-WebSocket-Key` header
* @param {Object} extensions The accepted extensions
* @param {http.IncomingMessage} req The request object
* @param {net.Socket} socket The network socket between the server and client
* @param {Buffer} head The first packet of the upgraded stream
* @param {Function} cb Callback
* @throws {Error} If called more than once with the same socket
* @private
*/
completeUpgrade(key, extensions, req, socket, head, cb) {
//
// Destroy the socket if the client has already sent a FIN packet.
//
if (!socket.readable || !socket.writable) return socket.destroy();

if (socket[kWebSocket$2]) {
throw new Error(
  'server.handleUpgrade() was called more than once with the same ' +
    'socket, possibly due to a misconfiguration'
);
}

const digest = createHash$1('sha1')
.update(key + GUID$1)
.digest('base64');

const headers = [
'HTTP/1.1 101 Switching Protocols',
'Upgrade: websocket',
'Connection: Upgrade',
`Sec-WebSocket-Accept: ${digest}`
];

const ws = new websocket(null);
let protocol = req.headers['sec-websocket-protocol'];

if (protocol) {
protocol = protocol.trim().split(/ *, */);

//
// Optionally call external protocol selection handler.
//
if (this.options.handleProtocols) {
  protocol = this.options.handleProtocols(protocol, req);
} else {
  protocol = protocol[0];
}

if (protocol) {
  headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
  ws._protocol = protocol;
}
}

if (extensions[permessageDeflate.extensionName]) {
const params = extensions[permessageDeflate.extensionName].params;
const value = format$2({
  [permessageDeflate.extensionName]: [params]
});
headers.push(`Sec-WebSocket-Extensions: ${value}`);
ws._extensions = extensions;
}

//
// Allow external modification/inspection of handshake headers.
//
this.emit('headers', headers, req);

socket.write(headers.concat('\r\n').join('\r\n'));
socket.removeListener('error', socketOnError$1);

ws.setSocket(socket, head, this.options.maxPayload);

if (this.clients) {
this.clients.add(ws);
ws.on('close', () => this.clients.delete(ws));
}

cb(ws, req);
}
}

var websocketServer = WebSocketServer;

/**
* Add event listeners on an `EventEmitter` using a map of <event, listener>
* pairs.
*
* @param {EventEmitter} server The event emitter
* @param {Object.<String, Function>} map The listeners to add
* @return {Function} A function that will remove the added listeners when
*     called
* @private
*/
function addListeners(server, map) {
for (const event of Object.keys(map)) server.on(event, map[event]);

return function removeListeners() {
for (const event of Object.keys(map)) {
server.removeListener(event, map[event]);
}
};
}

/**
* Emit a `'close'` event on an `EventEmitter`.
*
* @param {EventEmitter} server The event emitter
* @private
*/
function emitClose$1(server) {
server.emit('close');
}

/**
* Handle premature socket errors.
*
* @private
*/
function socketOnError$1() {
this.destroy();
}

/**
* Close the connection when preconditions are not fulfilled.
*
* @param {net.Socket} socket The socket of the upgrade request
* @param {Number} code The HTTP response status code
* @param {String} [message] The HTTP response body
* @param {Object} [headers] Additional HTTP response headers
* @private
*/
function abortHandshake$1(socket, code, message, headers) {
if (socket.writable) {
message = message || STATUS_CODES[code];
headers = {
Connection: 'close',
'Content-Type': 'text/html',
'Content-Length': Buffer.byteLength(message),
...headers
};

socket.write(
`HTTP/1.1 ${code} ${STATUS_CODES[code]}\r\n` +
  Object.keys(headers)
    .map((h) => `${h}: ${headers[h]}`)
    .join('\r\n') +
  '\r\n\r\n' +
  message
);
}

socket.removeListener('error', socketOnError$1);
socket.destroy();
}

websocket.createWebSocketStream = stream;
websocket.Server = websocketServer;
websocket.Receiver = receiver;
websocket.Sender = sender;

var ws = websocket;

var node = ws;

var TEXT_ENCODING_AVAILABLE = typeof process !== "undefined" &&
process.env.TEXT_ENCODING !== "never" &&
typeof TextEncoder !== "undefined" &&
typeof TextDecoder !== "undefined";
var STR_SIZE_MAX = 4294967295; // uint32_max
function utf8Count(str) {
var strLength = str.length;
var byteLength = 0;
var pos = 0;
while (pos < strLength) {
  var value = str.charCodeAt(pos++);
  if ((value & 0xffffff80) === 0) {
      // 1-byte
      byteLength++;
      continue;
  }
  else if ((value & 0xfffff800) === 0) {
      // 2-bytes
      byteLength += 2;
  }
  else {
      // handle surrogate pair
      if (value >= 0xd800 && value <= 0xdbff) {
          // high surrogate
          if (pos < strLength) {
              var extra = str.charCodeAt(pos);
              if ((extra & 0xfc00) === 0xdc00) {
                  ++pos;
                  value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
              }
          }
      }
      if ((value & 0xffff0000) === 0) {
          // 3-byte
          byteLength += 3;
      }
      else {
          // 4-byte
          byteLength += 4;
      }
  }
}
return byteLength;
}
function utf8EncodeJs(str, output, outputOffset) {
var strLength = str.length;
var offset = outputOffset;
var pos = 0;
while (pos < strLength) {
  var value = str.charCodeAt(pos++);
  if ((value & 0xffffff80) === 0) {
      // 1-byte
      output[offset++] = value;
      continue;
  }
  else if ((value & 0xfffff800) === 0) {
      // 2-bytes
      output[offset++] = ((value >> 6) & 0x1f) | 0xc0;
  }
  else {
      // handle surrogate pair
      if (value >= 0xd800 && value <= 0xdbff) {
          // high surrogate
          if (pos < strLength) {
              var extra = str.charCodeAt(pos);
              if ((extra & 0xfc00) === 0xdc00) {
                  ++pos;
                  value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
              }
          }
      }
      if ((value & 0xffff0000) === 0) {
          // 3-byte
          output[offset++] = ((value >> 12) & 0x0f) | 0xe0;
          output[offset++] = ((value >> 6) & 0x3f) | 0x80;
      }
      else {
          // 4-byte
          output[offset++] = ((value >> 18) & 0x07) | 0xf0;
          output[offset++] = ((value >> 12) & 0x3f) | 0x80;
          output[offset++] = ((value >> 6) & 0x3f) | 0x80;
      }
  }
  output[offset++] = (value & 0x3f) | 0x80;
}
}
var sharedTextEncoder = TEXT_ENCODING_AVAILABLE ? new TextEncoder() : undefined;
var TEXT_ENCODER_THRESHOLD = !TEXT_ENCODING_AVAILABLE
? STR_SIZE_MAX
: typeof process !== "undefined" && process.env.TEXT_ENCODING !== "force"
  ? 200
  : 0;
function utf8EncodeTEencode(str, output, outputOffset) {
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
output.set(sharedTextEncoder.encode(str), outputOffset);
}
function utf8EncodeTEencodeInto(str, output, outputOffset) {
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
}
var utf8EncodeTE = (sharedTextEncoder === null || sharedTextEncoder === void 0 ? void 0 : sharedTextEncoder.encodeInto) ? utf8EncodeTEencodeInto : utf8EncodeTEencode;
var CHUNK_SIZE = 4096;
function utf8DecodeJs(bytes, inputOffset, byteLength) {
var offset = inputOffset;
var end = offset + byteLength;
var units = [];
var result = "";
while (offset < end) {
  var byte1 = bytes[offset++];
  if ((byte1 & 0x80) === 0) {
      // 1 byte
      units.push(byte1);
  }
  else if ((byte1 & 0xe0) === 0xc0) {
      // 2 bytes
      var byte2 = bytes[offset++] & 0x3f;
      units.push(((byte1 & 0x1f) << 6) | byte2);
  }
  else if ((byte1 & 0xf0) === 0xe0) {
      // 3 bytes
      var byte2 = bytes[offset++] & 0x3f;
      var byte3 = bytes[offset++] & 0x3f;
      units.push(((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3);
  }
  else if ((byte1 & 0xf8) === 0xf0) {
      // 4 bytes
      var byte2 = bytes[offset++] & 0x3f;
      var byte3 = bytes[offset++] & 0x3f;
      var byte4 = bytes[offset++] & 0x3f;
      var unit = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
      if (unit > 0xffff) {
          unit -= 0x10000;
          units.push(((unit >>> 10) & 0x3ff) | 0xd800);
          unit = 0xdc00 | (unit & 0x3ff);
      }
      units.push(unit);
  }
  else {
      units.push(byte1);
  }
  if (units.length >= CHUNK_SIZE) {
      result += String.fromCharCode.apply(String, units);
      units.length = 0;
  }
}
if (units.length > 0) {
  result += String.fromCharCode.apply(String, units);
}
return result;
}
var sharedTextDecoder = TEXT_ENCODING_AVAILABLE ? new TextDecoder() : null;
var TEXT_DECODER_THRESHOLD = !TEXT_ENCODING_AVAILABLE
? STR_SIZE_MAX
: typeof process !== "undefined" && process.env.TEXT_DECODER !== "force"
  ? 200
  : 0;
function utf8DecodeTD(bytes, inputOffset, byteLength) {
var stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
return sharedTextDecoder.decode(stringBytes);
}

/**
* ExtData is used to handle Extension Types that are not registered to ExtensionCodec.
*/
var ExtData = /** @class */ (function () {
function ExtData(type, data) {
  this.type = type;
  this.data = data;
}
return ExtData;
}());

// DataView extension to handle int64 / uint64,
// where the actual range is 53-bits integer (a.k.a. safe integer)
function setUint64(view, offset, value) {
var high = value / 4294967296;
var low = value; // high bits are truncated by DataView
view.setUint32(offset, high);
view.setUint32(offset + 4, low);
}
function setInt64(view, offset, value) {
var high = Math.floor(value / 4294967296);
var low = value; // high bits are truncated by DataView
view.setUint32(offset, high);
view.setUint32(offset + 4, low);
}
function getInt64(view, offset) {
var high = view.getInt32(offset);
var low = view.getUint32(offset + 4);
return high * 4294967296 + low;
}
function getUint64(view, offset) {
var high = view.getUint32(offset);
var low = view.getUint32(offset + 4);
return high * 4294967296 + low;
}

// https://github.com/msgpack/msgpack/blob/master/spec.md#timestamp-extension-type
var EXT_TIMESTAMP = -1;
var TIMESTAMP32_MAX_SEC = 0x100000000 - 1; // 32-bit unsigned int
var TIMESTAMP64_MAX_SEC = 0x400000000 - 1; // 34-bit unsigned int
function encodeTimeSpecToTimestamp(_a) {
var sec = _a.sec, nsec = _a.nsec;
if (sec >= 0 && nsec >= 0 && sec <= TIMESTAMP64_MAX_SEC) {
  // Here sec >= 0 && nsec >= 0
  if (nsec === 0 && sec <= TIMESTAMP32_MAX_SEC) {
      // timestamp 32 = { sec32 (unsigned) }
      var rv = new Uint8Array(4);
      var view = new DataView(rv.buffer);
      view.setUint32(0, sec);
      return rv;
  }
  else {
      // timestamp 64 = { nsec30 (unsigned), sec34 (unsigned) }
      var secHigh = sec / 0x100000000;
      var secLow = sec & 0xffffffff;
      var rv = new Uint8Array(8);
      var view = new DataView(rv.buffer);
      // nsec30 | secHigh2
      view.setUint32(0, (nsec << 2) | (secHigh & 0x3));
      // secLow32
      view.setUint32(4, secLow);
      return rv;
  }
}
else {
  // timestamp 96 = { nsec32 (unsigned), sec64 (signed) }
  var rv = new Uint8Array(12);
  var view = new DataView(rv.buffer);
  view.setUint32(0, nsec);
  setInt64(view, 4, sec);
  return rv;
}
}
function encodeDateToTimeSpec(date) {
var msec = date.getTime();
var sec = Math.floor(msec / 1e3);
var nsec = (msec - sec * 1e3) * 1e6;
// Normalizes { sec, nsec } to ensure nsec is unsigned.
var nsecInSec = Math.floor(nsec / 1e9);
return {
  sec: sec + nsecInSec,
  nsec: nsec - nsecInSec * 1e9,
};
}
function encodeTimestampExtension(object) {
if (object instanceof Date) {
  var timeSpec = encodeDateToTimeSpec(object);
  return encodeTimeSpecToTimestamp(timeSpec);
}
else {
  return null;
}
}
function decodeTimestampToTimeSpec(data) {
var view = new DataView(data.buffer, data.byteOffset, data.byteLength);
// data may be 32, 64, or 96 bits
switch (data.byteLength) {
  case 4: {
      // timestamp 32 = { sec32 }
      var sec = view.getUint32(0);
      var nsec = 0;
      return { sec: sec, nsec: nsec };
  }
  case 8: {
      // timestamp 64 = { nsec30, sec34 }
      var nsec30AndSecHigh2 = view.getUint32(0);
      var secLow32 = view.getUint32(4);
      var sec = (nsec30AndSecHigh2 & 0x3) * 0x100000000 + secLow32;
      var nsec = nsec30AndSecHigh2 >>> 2;
      return { sec: sec, nsec: nsec };
  }
  case 12: {
      // timestamp 96 = { nsec32 (unsigned), sec64 (signed) }
      var sec = getInt64(view, 4);
      var nsec = view.getUint32(0);
      return { sec: sec, nsec: nsec };
  }
  default:
      throw new Error("Unrecognized data size for timestamp: " + data.length);
}
}
function decodeTimestampExtension(data) {
var timeSpec = decodeTimestampToTimeSpec(data);
return new Date(timeSpec.sec * 1e3 + timeSpec.nsec / 1e6);
}
var timestampExtension = {
type: EXT_TIMESTAMP,
encode: encodeTimestampExtension,
decode: decodeTimestampExtension,
};

// ExtensionCodec to handle MessagePack extensions
var ExtensionCodec = /** @class */ (function () {
function ExtensionCodec() {
  // built-in extensions
  this.builtInEncoders = [];
  this.builtInDecoders = [];
  // custom extensions
  this.encoders = [];
  this.decoders = [];
  this.register(timestampExtension);
}
ExtensionCodec.prototype.register = function (_a) {
  var type = _a.type, encode = _a.encode, decode = _a.decode;
  if (type >= 0) {
      // custom extensions
      this.encoders[type] = encode;
      this.decoders[type] = decode;
  }
  else {
      // built-in extensions
      var index = 1 + type;
      this.builtInEncoders[index] = encode;
      this.builtInDecoders[index] = decode;
  }
};
ExtensionCodec.prototype.tryToEncode = function (object, context) {
  // built-in extensions
  for (var i = 0; i < this.builtInEncoders.length; i++) {
      var encoder = this.builtInEncoders[i];
      if (encoder != null) {
          var data = encoder(object, context);
          if (data != null) {
              var type = -1 - i;
              return new ExtData(type, data);
          }
      }
  }
  // custom extensions
  for (var i = 0; i < this.encoders.length; i++) {
      var encoder = this.encoders[i];
      if (encoder != null) {
          var data = encoder(object, context);
          if (data != null) {
              var type = i;
              return new ExtData(type, data);
          }
      }
  }
  if (object instanceof ExtData) {
      // to keep ExtData as is
      return object;
  }
  return null;
};
ExtensionCodec.prototype.decode = function (data, type, context) {
  var decoder = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
  if (decoder) {
      return decoder(data, type, context);
  }
  else {
      // decode() does not fail, returns ExtData instead.
      return new ExtData(type, data);
  }
};
ExtensionCodec.defaultCodec = new ExtensionCodec();
return ExtensionCodec;
}());

function ensureUint8Array(buffer) {
if (buffer instanceof Uint8Array) {
  return buffer;
}
else if (ArrayBuffer.isView(buffer)) {
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
}
else if (buffer instanceof ArrayBuffer) {
  return new Uint8Array(buffer);
}
else {
  // ArrayLike<number>
  return Uint8Array.from(buffer);
}
}
function createDataView(buffer) {
if (buffer instanceof ArrayBuffer) {
  return new DataView(buffer);
}
var bufferView = ensureUint8Array(buffer);
return new DataView(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength);
}

var DEFAULT_MAX_DEPTH = 100;
var DEFAULT_INITIAL_BUFFER_SIZE = 2048;
var Encoder = /** @class */ (function () {
function Encoder(extensionCodec, context, maxDepth, initialBufferSize, sortKeys, forceFloat32, ignoreUndefined, forceIntegerToFloat) {
  if (extensionCodec === void 0) { extensionCodec = ExtensionCodec.defaultCodec; }
  if (context === void 0) { context = undefined; }
  if (maxDepth === void 0) { maxDepth = DEFAULT_MAX_DEPTH; }
  if (initialBufferSize === void 0) { initialBufferSize = DEFAULT_INITIAL_BUFFER_SIZE; }
  if (sortKeys === void 0) { sortKeys = false; }
  if (forceFloat32 === void 0) { forceFloat32 = false; }
  if (ignoreUndefined === void 0) { ignoreUndefined = false; }
  if (forceIntegerToFloat === void 0) { forceIntegerToFloat = false; }
  this.extensionCodec = extensionCodec;
  this.context = context;
  this.maxDepth = maxDepth;
  this.initialBufferSize = initialBufferSize;
  this.sortKeys = sortKeys;
  this.forceFloat32 = forceFloat32;
  this.ignoreUndefined = ignoreUndefined;
  this.forceIntegerToFloat = forceIntegerToFloat;
  this.pos = 0;
  this.view = new DataView(new ArrayBuffer(this.initialBufferSize));
  this.bytes = new Uint8Array(this.view.buffer);
}
Encoder.prototype.getUint8Array = function () {
  return this.bytes.subarray(0, this.pos);
};
Encoder.prototype.reinitializeState = function () {
  this.pos = 0;
};
Encoder.prototype.encode = function (object) {
  this.reinitializeState();
  this.doEncode(object, 1);
  return this.getUint8Array();
};
Encoder.prototype.doEncode = function (object, depth) {
  if (depth > this.maxDepth) {
      throw new Error("Too deep objects in depth " + depth);
  }
  if (object == null) {
      this.encodeNil();
  }
  else if (typeof object === "boolean") {
      this.encodeBoolean(object);
  }
  else if (typeof object === "number") {
      this.encodeNumber(object);
  }
  else if (typeof object === "string") {
      this.encodeString(object);
  }
  else {
      this.encodeObject(object, depth);
  }
};
Encoder.prototype.ensureBufferSizeToWrite = function (sizeToWrite) {
  var requiredSize = this.pos + sizeToWrite;
  if (this.view.byteLength < requiredSize) {
      this.resizeBuffer(requiredSize * 2);
  }
};
Encoder.prototype.resizeBuffer = function (newSize) {
  var newBuffer = new ArrayBuffer(newSize);
  var newBytes = new Uint8Array(newBuffer);
  var newView = new DataView(newBuffer);
  newBytes.set(this.bytes);
  this.view = newView;
  this.bytes = newBytes;
};
Encoder.prototype.encodeNil = function () {
  this.writeU8(0xc0);
};
Encoder.prototype.encodeBoolean = function (object) {
  if (object === false) {
      this.writeU8(0xc2);
  }
  else {
      this.writeU8(0xc3);
  }
};
Encoder.prototype.encodeNumber = function (object) {
  if (Number.isSafeInteger(object) && !this.forceIntegerToFloat) {
      if (object >= 0) {
          if (object < 0x80) {
              // positive fixint
              this.writeU8(object);
          }
          else if (object < 0x100) {
              // uint 8
              this.writeU8(0xcc);
              this.writeU8(object);
          }
          else if (object < 0x10000) {
              // uint 16
              this.writeU8(0xcd);
              this.writeU16(object);
          }
          else if (object < 0x100000000) {
              // uint 32
              this.writeU8(0xce);
              this.writeU32(object);
          }
          else {
              // uint 64
              this.writeU8(0xcf);
              this.writeU64(object);
          }
      }
      else {
          if (object >= -0x20) {
              // nagative fixint
              this.writeU8(0xe0 | (object + 0x20));
          }
          else if (object >= -0x80) {
              // int 8
              this.writeU8(0xd0);
              this.writeI8(object);
          }
          else if (object >= -0x8000) {
              // int 16
              this.writeU8(0xd1);
              this.writeI16(object);
          }
          else if (object >= -0x80000000) {
              // int 32
              this.writeU8(0xd2);
              this.writeI32(object);
          }
          else {
              // int 64
              this.writeU8(0xd3);
              this.writeI64(object);
          }
      }
  }
  else {
      // non-integer numbers
      if (this.forceFloat32) {
          // float 32
          this.writeU8(0xca);
          this.writeF32(object);
      }
      else {
          // float 64
          this.writeU8(0xcb);
          this.writeF64(object);
      }
  }
};
Encoder.prototype.writeStringHeader = function (byteLength) {
  if (byteLength < 32) {
      // fixstr
      this.writeU8(0xa0 + byteLength);
  }
  else if (byteLength < 0x100) {
      // str 8
      this.writeU8(0xd9);
      this.writeU8(byteLength);
  }
  else if (byteLength < 0x10000) {
      // str 16
      this.writeU8(0xda);
      this.writeU16(byteLength);
  }
  else if (byteLength < 0x100000000) {
      // str 32
      this.writeU8(0xdb);
      this.writeU32(byteLength);
  }
  else {
      throw new Error("Too long string: " + byteLength + " bytes in UTF-8");
  }
};
Encoder.prototype.encodeString = function (object) {
  var maxHeaderSize = 1 + 4;
  var strLength = object.length;
  if (strLength > TEXT_ENCODER_THRESHOLD) {
      var byteLength = utf8Count(object);
      this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
      this.writeStringHeader(byteLength);
      utf8EncodeTE(object, this.bytes, this.pos);
      this.pos += byteLength;
  }
  else {
      var byteLength = utf8Count(object);
      this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
      this.writeStringHeader(byteLength);
      utf8EncodeJs(object, this.bytes, this.pos);
      this.pos += byteLength;
  }
};
Encoder.prototype.encodeObject = function (object, depth) {
  // try to encode objects with custom codec first of non-primitives
  var ext = this.extensionCodec.tryToEncode(object, this.context);
  if (ext != null) {
      this.encodeExtension(ext);
  }
  else if (Array.isArray(object)) {
      this.encodeArray(object, depth);
  }
  else if (ArrayBuffer.isView(object)) {
      this.encodeBinary(object);
  }
  else if (typeof object === "object") {
      this.encodeMap(object, depth);
  }
  else {
      // symbol, function and other special object come here unless extensionCodec handles them.
      throw new Error("Unrecognized object: " + Object.prototype.toString.apply(object));
  }
};
Encoder.prototype.encodeBinary = function (object) {
  var size = object.byteLength;
  if (size < 0x100) {
      // bin 8
      this.writeU8(0xc4);
      this.writeU8(size);
  }
  else if (size < 0x10000) {
      // bin 16
      this.writeU8(0xc5);
      this.writeU16(size);
  }
  else if (size < 0x100000000) {
      // bin 32
      this.writeU8(0xc6);
      this.writeU32(size);
  }
  else {
      throw new Error("Too large binary: " + size);
  }
  var bytes = ensureUint8Array(object);
  this.writeU8a(bytes);
};
Encoder.prototype.encodeArray = function (object, depth) {
  var size = object.length;
  if (size < 16) {
      // fixarray
      this.writeU8(0x90 + size);
  }
  else if (size < 0x10000) {
      // array 16
      this.writeU8(0xdc);
      this.writeU16(size);
  }
  else if (size < 0x100000000) {
      // array 32
      this.writeU8(0xdd);
      this.writeU32(size);
  }
  else {
      throw new Error("Too large array: " + size);
  }
  for (var _i = 0, object_1 = object; _i < object_1.length; _i++) {
      var item = object_1[_i];
      this.doEncode(item, depth + 1);
  }
};
Encoder.prototype.countWithoutUndefined = function (object, keys) {
  var count = 0;
  for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
      var key = keys_1[_i];
      if (object[key] !== undefined) {
          count++;
      }
  }
  return count;
};
Encoder.prototype.encodeMap = function (object, depth) {
  var keys = Object.keys(object);
  if (this.sortKeys) {
      keys.sort();
  }
  var size = this.ignoreUndefined ? this.countWithoutUndefined(object, keys) : keys.length;
  if (size < 16) {
      // fixmap
      this.writeU8(0x80 + size);
  }
  else if (size < 0x10000) {
      // map 16
      this.writeU8(0xde);
      this.writeU16(size);
  }
  else if (size < 0x100000000) {
      // map 32
      this.writeU8(0xdf);
      this.writeU32(size);
  }
  else {
      throw new Error("Too large map object: " + size);
  }
  for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
      var key = keys_2[_i];
      var value = object[key];
      if (!(this.ignoreUndefined && value === undefined)) {
          this.encodeString(key);
          this.doEncode(value, depth + 1);
      }
  }
};
Encoder.prototype.encodeExtension = function (ext) {
  var size = ext.data.length;
  if (size === 1) {
      // fixext 1
      this.writeU8(0xd4);
  }
  else if (size === 2) {
      // fixext 2
      this.writeU8(0xd5);
  }
  else if (size === 4) {
      // fixext 4
      this.writeU8(0xd6);
  }
  else if (size === 8) {
      // fixext 8
      this.writeU8(0xd7);
  }
  else if (size === 16) {
      // fixext 16
      this.writeU8(0xd8);
  }
  else if (size < 0x100) {
      // ext 8
      this.writeU8(0xc7);
      this.writeU8(size);
  }
  else if (size < 0x10000) {
      // ext 16
      this.writeU8(0xc8);
      this.writeU16(size);
  }
  else if (size < 0x100000000) {
      // ext 32
      this.writeU8(0xc9);
      this.writeU32(size);
  }
  else {
      throw new Error("Too large extension object: " + size);
  }
  this.writeI8(ext.type);
  this.writeU8a(ext.data);
};
Encoder.prototype.writeU8 = function (value) {
  this.ensureBufferSizeToWrite(1);
  this.view.setUint8(this.pos, value);
  this.pos++;
};
Encoder.prototype.writeU8a = function (values) {
  var size = values.length;
  this.ensureBufferSizeToWrite(size);
  this.bytes.set(values, this.pos);
  this.pos += size;
};
Encoder.prototype.writeI8 = function (value) {
  this.ensureBufferSizeToWrite(1);
  this.view.setInt8(this.pos, value);
  this.pos++;
};
Encoder.prototype.writeU16 = function (value) {
  this.ensureBufferSizeToWrite(2);
  this.view.setUint16(this.pos, value);
  this.pos += 2;
};
Encoder.prototype.writeI16 = function (value) {
  this.ensureBufferSizeToWrite(2);
  this.view.setInt16(this.pos, value);
  this.pos += 2;
};
Encoder.prototype.writeU32 = function (value) {
  this.ensureBufferSizeToWrite(4);
  this.view.setUint32(this.pos, value);
  this.pos += 4;
};
Encoder.prototype.writeI32 = function (value) {
  this.ensureBufferSizeToWrite(4);
  this.view.setInt32(this.pos, value);
  this.pos += 4;
};
Encoder.prototype.writeF32 = function (value) {
  this.ensureBufferSizeToWrite(4);
  this.view.setFloat32(this.pos, value);
  this.pos += 4;
};
Encoder.prototype.writeF64 = function (value) {
  this.ensureBufferSizeToWrite(8);
  this.view.setFloat64(this.pos, value);
  this.pos += 8;
};
Encoder.prototype.writeU64 = function (value) {
  this.ensureBufferSizeToWrite(8);
  setUint64(this.view, this.pos, value);
  this.pos += 8;
};
Encoder.prototype.writeI64 = function (value) {
  this.ensureBufferSizeToWrite(8);
  setInt64(this.view, this.pos, value);
  this.pos += 8;
};
return Encoder;
}());

var defaultEncodeOptions = {};
/**
* It encodes `value` in the MessagePack format and
* returns a byte buffer.
*
* The returned buffer is a slice of a larger `ArrayBuffer`, so you have to use its `#byteOffset` and `#byteLength` in order to convert it to another typed arrays including NodeJS `Buffer`.
*/
function encode(value, options) {
if (options === void 0) { options = defaultEncodeOptions; }
var encoder = new Encoder(options.extensionCodec, options.context, options.maxDepth, options.initialBufferSize, options.sortKeys, options.forceFloat32, options.ignoreUndefined, options.forceIntegerToFloat);
return encoder.encode(value);
}

function prettyByte(byte) {
return (byte < 0 ? "-" : "") + "0x" + Math.abs(byte).toString(16).padStart(2, "0");
}

var DEFAULT_MAX_KEY_LENGTH = 16;
var DEFAULT_MAX_LENGTH_PER_KEY = 16;
var CachedKeyDecoder = /** @class */ (function () {
function CachedKeyDecoder(maxKeyLength, maxLengthPerKey) {
  if (maxKeyLength === void 0) { maxKeyLength = DEFAULT_MAX_KEY_LENGTH; }
  if (maxLengthPerKey === void 0) { maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY; }
  this.maxKeyLength = maxKeyLength;
  this.maxLengthPerKey = maxLengthPerKey;
  this.hit = 0;
  this.miss = 0;
  // avoid `new Array(N)` to create a non-sparse array for performance.
  this.caches = [];
  for (var i = 0; i < this.maxKeyLength; i++) {
      this.caches.push([]);
  }
}
CachedKeyDecoder.prototype.canBeCached = function (byteLength) {
  return byteLength > 0 && byteLength <= this.maxKeyLength;
};
CachedKeyDecoder.prototype.get = function (bytes, inputOffset, byteLength) {
  var records = this.caches[byteLength - 1];
  var recordsLength = records.length;
  FIND_CHUNK: for (var i = 0; i < recordsLength; i++) {
      var record = records[i];
      var recordBytes = record.bytes;
      for (var j = 0; j < byteLength; j++) {
          if (recordBytes[j] !== bytes[inputOffset + j]) {
              continue FIND_CHUNK;
          }
      }
      return record.value;
  }
  return null;
};
CachedKeyDecoder.prototype.store = function (bytes, value) {
  var records = this.caches[bytes.length - 1];
  var record = { bytes: bytes, value: value };
  if (records.length >= this.maxLengthPerKey) {
      // `records` are full!
      // Set `record` to a randomized position.
      records[(Math.random() * records.length) | 0] = record;
  }
  else {
      records.push(record);
  }
};
CachedKeyDecoder.prototype.decode = function (bytes, inputOffset, byteLength) {
  var cachedValue = this.get(bytes, inputOffset, byteLength);
  if (cachedValue != null) {
      this.hit++;
      return cachedValue;
  }
  this.miss++;
  var value = utf8DecodeJs(bytes, inputOffset, byteLength);
  // Ensure to copy a slice of bytes because the byte may be NodeJS Buffer and Buffer#slice() returns a reference to its internal ArrayBuffer.
  var slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
  this.store(slicedCopyOfBytes, value);
  return value;
};
return CachedKeyDecoder;
}());

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
return new (P || (P = Promise))(function (resolve, reject) {
  function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
  function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
  function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
  step((generator = generator.apply(thisArg, _arguments || [])).next());
});
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
function verb(n) { return function (v) { return step([n, v]); }; }
function step(op) {
  if (f) throw new TypeError("Generator is already executing.");
  while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
          case 0: case 1: t = op; break;
          case 4: _.label++; return { value: op[1], done: false };
          case 5: _.label++; y = op[1]; op = [0]; continue;
          case 7: op = _.ops.pop(); _.trys.pop(); continue;
          default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
              if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
              if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
              if (t[2]) _.ops.pop();
              _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
  } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
  if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
}
};
var __asyncValues = (undefined && undefined.__asyncValues) || function (o) {
if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
var m = o[Symbol.asyncIterator], i;
return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (undefined && undefined.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); };
var __asyncGenerator = (undefined && undefined.__asyncGenerator) || function (thisArg, _arguments, generator) {
if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
var g = generator.apply(thisArg, _arguments || []), i, q = [];
return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
function fulfill(value) { resume("next", value); }
function reject(value) { resume("throw", value); }
function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var isValidMapKeyType = function (key) {
var keyType = typeof key;
return keyType === "string" || keyType === "number";
};
var HEAD_BYTE_REQUIRED = -1;
var EMPTY_VIEW = new DataView(new ArrayBuffer(0));
var EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
// IE11: Hack to support IE11.
// IE11: Drop this hack and just use RangeError when IE11 is obsolete.
var DataViewIndexOutOfBoundsError = (function () {
try {
  // IE11: The spec says it should throw RangeError,
  // IE11: but in IE11 it throws TypeError.
  EMPTY_VIEW.getInt8(0);
}
catch (e) {
  return e.constructor;
}
throw new Error("never reached");
})();
var MORE_DATA = new DataViewIndexOutOfBoundsError("Insufficient data");
var DEFAULT_MAX_LENGTH = 4294967295; // uint32_max
var sharedCachedKeyDecoder = new CachedKeyDecoder();
var Decoder = /** @class */ (function () {
function Decoder(extensionCodec, context, maxStrLength, maxBinLength, maxArrayLength, maxMapLength, maxExtLength, keyDecoder) {
  if (extensionCodec === void 0) { extensionCodec = ExtensionCodec.defaultCodec; }
  if (context === void 0) { context = undefined; }
  if (maxStrLength === void 0) { maxStrLength = DEFAULT_MAX_LENGTH; }
  if (maxBinLength === void 0) { maxBinLength = DEFAULT_MAX_LENGTH; }
  if (maxArrayLength === void 0) { maxArrayLength = DEFAULT_MAX_LENGTH; }
  if (maxMapLength === void 0) { maxMapLength = DEFAULT_MAX_LENGTH; }
  if (maxExtLength === void 0) { maxExtLength = DEFAULT_MAX_LENGTH; }
  if (keyDecoder === void 0) { keyDecoder = sharedCachedKeyDecoder; }
  this.extensionCodec = extensionCodec;
  this.context = context;
  this.maxStrLength = maxStrLength;
  this.maxBinLength = maxBinLength;
  this.maxArrayLength = maxArrayLength;
  this.maxMapLength = maxMapLength;
  this.maxExtLength = maxExtLength;
  this.keyDecoder = keyDecoder;
  this.totalPos = 0;
  this.pos = 0;
  this.view = EMPTY_VIEW;
  this.bytes = EMPTY_BYTES;
  this.headByte = HEAD_BYTE_REQUIRED;
  this.stack = [];
}
Decoder.prototype.reinitializeState = function () {
  this.totalPos = 0;
  this.headByte = HEAD_BYTE_REQUIRED;
};
Decoder.prototype.setBuffer = function (buffer) {
  this.bytes = ensureUint8Array(buffer);
  this.view = createDataView(this.bytes);
  this.pos = 0;
};
Decoder.prototype.appendBuffer = function (buffer) {
  if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining()) {
      this.setBuffer(buffer);
  }
  else {
      // retried because data is insufficient
      var remainingData = this.bytes.subarray(this.pos);
      var newData = ensureUint8Array(buffer);
      var concated = new Uint8Array(remainingData.length + newData.length);
      concated.set(remainingData);
      concated.set(newData, remainingData.length);
      this.setBuffer(concated);
  }
};
Decoder.prototype.hasRemaining = function (size) {
  if (size === void 0) { size = 1; }
  return this.view.byteLength - this.pos >= size;
};
Decoder.prototype.createExtraByteError = function (posToShow) {
  var _a = this, view = _a.view, pos = _a.pos;
  return new RangeError("Extra " + (view.byteLength - pos) + " of " + view.byteLength + " byte(s) found at buffer[" + posToShow + "]");
};
Decoder.prototype.decode = function (buffer) {
  this.reinitializeState();
  this.setBuffer(buffer);
  var object = this.doDecodeSync();
  if (this.hasRemaining()) {
      throw this.createExtraByteError(this.pos);
  }
  return object;
};
Decoder.prototype.decodeAsync = function (stream) {
  var stream_1, stream_1_1;
  var e_1, _a;
  return __awaiter(this, void 0, void 0, function () {
      var decoded, object, buffer, e_1_1, _b, headByte, pos, totalPos;
      return __generator(this, function (_c) {
          switch (_c.label) {
              case 0:
                  decoded = false;
                  _c.label = 1;
              case 1:
                  _c.trys.push([1, 6, 7, 12]);
                  stream_1 = __asyncValues(stream);
                  _c.label = 2;
              case 2: return [4 /*yield*/, stream_1.next()];
              case 3:
                  if (!(stream_1_1 = _c.sent(), !stream_1_1.done)) return [3 /*break*/, 5];
                  buffer = stream_1_1.value;
                  if (decoded) {
                      throw this.createExtraByteError(this.totalPos);
                  }
                  this.appendBuffer(buffer);
                  try {
                      object = this.doDecodeSync();
                      decoded = true;
                  }
                  catch (e) {
                      if (!(e instanceof DataViewIndexOutOfBoundsError)) {
                          throw e; // rethrow
                      }
                      // fallthrough
                  }
                  this.totalPos += this.pos;
                  _c.label = 4;
              case 4: return [3 /*break*/, 2];
              case 5: return [3 /*break*/, 12];
              case 6:
                  e_1_1 = _c.sent();
                  e_1 = { error: e_1_1 };
                  return [3 /*break*/, 12];
              case 7:
                  _c.trys.push([7, , 10, 11]);
                  if (!(stream_1_1 && !stream_1_1.done && (_a = stream_1.return))) return [3 /*break*/, 9];
                  return [4 /*yield*/, _a.call(stream_1)];
              case 8:
                  _c.sent();
                  _c.label = 9;
              case 9: return [3 /*break*/, 11];
              case 10:
                  if (e_1) throw e_1.error;
                  return [7 /*endfinally*/];
              case 11: return [7 /*endfinally*/];
              case 12:
                  if (decoded) {
                      if (this.hasRemaining()) {
                          throw this.createExtraByteError(this.totalPos);
                      }
                      return [2 /*return*/, object];
                  }
                  _b = this, headByte = _b.headByte, pos = _b.pos, totalPos = _b.totalPos;
                  throw new RangeError("Insufficient data in parsing " + prettyByte(headByte) + " at " + totalPos + " (" + pos + " in the current buffer)");
          }
      });
  });
};
Decoder.prototype.decodeArrayStream = function (stream) {
  return this.decodeMultiAsync(stream, true);
};
Decoder.prototype.decodeStream = function (stream) {
  return this.decodeMultiAsync(stream, false);
};
Decoder.prototype.decodeMultiAsync = function (stream, isArray) {
  return __asyncGenerator(this, arguments, function decodeMultiAsync_1() {
      var isArrayHeaderRequired, arrayItemsLeft, stream_2, stream_2_1, buffer, e_2, e_3_1;
      var e_3, _a;
      return __generator(this, function (_b) {
          switch (_b.label) {
              case 0:
                  isArrayHeaderRequired = isArray;
                  arrayItemsLeft = -1;
                  _b.label = 1;
              case 1:
                  _b.trys.push([1, 13, 14, 19]);
                  stream_2 = __asyncValues(stream);
                  _b.label = 2;
              case 2: return [4 /*yield*/, __await(stream_2.next())];
              case 3:
                  if (!(stream_2_1 = _b.sent(), !stream_2_1.done)) return [3 /*break*/, 12];
                  buffer = stream_2_1.value;
                  if (isArray && arrayItemsLeft === 0) {
                      throw this.createExtraByteError(this.totalPos);
                  }
                  this.appendBuffer(buffer);
                  if (isArrayHeaderRequired) {
                      arrayItemsLeft = this.readArraySize();
                      isArrayHeaderRequired = false;
                      this.complete();
                  }
                  _b.label = 4;
              case 4:
                  _b.trys.push([4, 9, , 10]);
                  _b.label = 5;
              case 5:
                  return [4 /*yield*/, __await(this.doDecodeSync())];
              case 6: return [4 /*yield*/, _b.sent()];
              case 7:
                  _b.sent();
                  if (--arrayItemsLeft === 0) {
                      return [3 /*break*/, 8];
                  }
                  return [3 /*break*/, 5];
              case 8: return [3 /*break*/, 10];
              case 9:
                  e_2 = _b.sent();
                  if (!(e_2 instanceof DataViewIndexOutOfBoundsError)) {
                      throw e_2; // rethrow
                  }
                  return [3 /*break*/, 10];
              case 10:
                  this.totalPos += this.pos;
                  _b.label = 11;
              case 11: return [3 /*break*/, 2];
              case 12: return [3 /*break*/, 19];
              case 13:
                  e_3_1 = _b.sent();
                  e_3 = { error: e_3_1 };
                  return [3 /*break*/, 19];
              case 14:
                  _b.trys.push([14, , 17, 18]);
                  if (!(stream_2_1 && !stream_2_1.done && (_a = stream_2.return))) return [3 /*break*/, 16];
                  return [4 /*yield*/, __await(_a.call(stream_2))];
              case 15:
                  _b.sent();
                  _b.label = 16;
              case 16: return [3 /*break*/, 18];
              case 17:
                  if (e_3) throw e_3.error;
                  return [7 /*endfinally*/];
              case 18: return [7 /*endfinally*/];
              case 19: return [2 /*return*/];
          }
      });
  });
};
Decoder.prototype.doDecodeSync = function () {
  DECODE: while (true) {
      var headByte = this.readHeadByte();
      var object = void 0;
      if (headByte >= 0xe0) {
          // negative fixint (111x xxxx) 0xe0 - 0xff
          object = headByte - 0x100;
      }
      else if (headByte < 0xc0) {
          if (headByte < 0x80) {
              // positive fixint (0xxx xxxx) 0x00 - 0x7f
              object = headByte;
          }
          else if (headByte < 0x90) {
              // fixmap (1000 xxxx) 0x80 - 0x8f
              var size = headByte - 0x80;
              if (size !== 0) {
                  this.pushMapState(size);
                  this.complete();
                  continue DECODE;
              }
              else {
                  object = {};
              }
          }
          else if (headByte < 0xa0) {
              // fixarray (1001 xxxx) 0x90 - 0x9f
              var size = headByte - 0x90;
              if (size !== 0) {
                  this.pushArrayState(size);
                  this.complete();
                  continue DECODE;
              }
              else {
                  object = [];
              }
          }
          else {
              // fixstr (101x xxxx) 0xa0 - 0xbf
              var byteLength = headByte - 0xa0;
              object = this.decodeUtf8String(byteLength, 0);
          }
      }
      else if (headByte === 0xc0) {
          // nil
          object = null;
      }
      else if (headByte === 0xc2) {
          // false
          object = false;
      }
      else if (headByte === 0xc3) {
          // true
          object = true;
      }
      else if (headByte === 0xca) {
          // float 32
          object = this.readF32();
      }
      else if (headByte === 0xcb) {
          // float 64
          object = this.readF64();
      }
      else if (headByte === 0xcc) {
          // uint 8
          object = this.readU8();
      }
      else if (headByte === 0xcd) {
          // uint 16
          object = this.readU16();
      }
      else if (headByte === 0xce) {
          // uint 32
          object = this.readU32();
      }
      else if (headByte === 0xcf) {
          // uint 64
          object = this.readU64();
      }
      else if (headByte === 0xd0) {
          // int 8
          object = this.readI8();
      }
      else if (headByte === 0xd1) {
          // int 16
          object = this.readI16();
      }
      else if (headByte === 0xd2) {
          // int 32
          object = this.readI32();
      }
      else if (headByte === 0xd3) {
          // int 64
          object = this.readI64();
      }
      else if (headByte === 0xd9) {
          // str 8
          var byteLength = this.lookU8();
          object = this.decodeUtf8String(byteLength, 1);
      }
      else if (headByte === 0xda) {
          // str 16
          var byteLength = this.lookU16();
          object = this.decodeUtf8String(byteLength, 2);
      }
      else if (headByte === 0xdb) {
          // str 32
          var byteLength = this.lookU32();
          object = this.decodeUtf8String(byteLength, 4);
      }
      else if (headByte === 0xdc) {
          // array 16
          var size = this.readU16();
          if (size !== 0) {
              this.pushArrayState(size);
              this.complete();
              continue DECODE;
          }
          else {
              object = [];
          }
      }
      else if (headByte === 0xdd) {
          // array 32
          var size = this.readU32();
          if (size !== 0) {
              this.pushArrayState(size);
              this.complete();
              continue DECODE;
          }
          else {
              object = [];
          }
      }
      else if (headByte === 0xde) {
          // map 16
          var size = this.readU16();
          if (size !== 0) {
              this.pushMapState(size);
              this.complete();
              continue DECODE;
          }
          else {
              object = {};
          }
      }
      else if (headByte === 0xdf) {
          // map 32
          var size = this.readU32();
          if (size !== 0) {
              this.pushMapState(size);
              this.complete();
              continue DECODE;
          }
          else {
              object = {};
          }
      }
      else if (headByte === 0xc4) {
          // bin 8
          var size = this.lookU8();
          object = this.decodeBinary(size, 1);
      }
      else if (headByte === 0xc5) {
          // bin 16
          var size = this.lookU16();
          object = this.decodeBinary(size, 2);
      }
      else if (headByte === 0xc6) {
          // bin 32
          var size = this.lookU32();
          object = this.decodeBinary(size, 4);
      }
      else if (headByte === 0xd4) {
          // fixext 1
          object = this.decodeExtension(1, 0);
      }
      else if (headByte === 0xd5) {
          // fixext 2
          object = this.decodeExtension(2, 0);
      }
      else if (headByte === 0xd6) {
          // fixext 4
          object = this.decodeExtension(4, 0);
      }
      else if (headByte === 0xd7) {
          // fixext 8
          object = this.decodeExtension(8, 0);
      }
      else if (headByte === 0xd8) {
          // fixext 16
          object = this.decodeExtension(16, 0);
      }
      else if (headByte === 0xc7) {
          // ext 8
          var size = this.lookU8();
          object = this.decodeExtension(size, 1);
      }
      else if (headByte === 0xc8) {
          // ext 16
          var size = this.lookU16();
          object = this.decodeExtension(size, 2);
      }
      else if (headByte === 0xc9) {
          // ext 32
          var size = this.lookU32();
          object = this.decodeExtension(size, 4);
      }
      else {
          throw new Error("Unrecognized type byte: " + prettyByte(headByte));
      }
      this.complete();
      var stack = this.stack;
      while (stack.length > 0) {
          // arrays and maps
          var state = stack[stack.length - 1];
          if (state.type === 0 /* ARRAY */) {
              state.array[state.position] = object;
              state.position++;
              if (state.position === state.size) {
                  stack.pop();
                  object = state.array;
              }
              else {
                  continue DECODE;
              }
          }
          else if (state.type === 1 /* MAP_KEY */) {
              if (!isValidMapKeyType(object)) {
                  throw new Error("The type of key must be string or number but " + typeof object);
              }
              state.key = object;
              state.type = 2 /* MAP_VALUE */;
              continue DECODE;
          }
          else {
              // it must be `state.type === State.MAP_VALUE` here
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              state.map[state.key] = object;
              state.readCount++;
              if (state.readCount === state.size) {
                  stack.pop();
                  object = state.map;
              }
              else {
                  state.key = null;
                  state.type = 1 /* MAP_KEY */;
                  continue DECODE;
              }
          }
      }
      return object;
  }
};
Decoder.prototype.readHeadByte = function () {
  if (this.headByte === HEAD_BYTE_REQUIRED) {
      this.headByte = this.readU8();
      // console.log("headByte", prettyByte(this.headByte));
  }
  return this.headByte;
};
Decoder.prototype.complete = function () {
  this.headByte = HEAD_BYTE_REQUIRED;
};
Decoder.prototype.readArraySize = function () {
  var headByte = this.readHeadByte();
  switch (headByte) {
      case 0xdc:
          return this.readU16();
      case 0xdd:
          return this.readU32();
      default: {
          if (headByte < 0xa0) {
              return headByte - 0x90;
          }
          else {
              throw new Error("Unrecognized array type byte: " + prettyByte(headByte));
          }
      }
  }
};
Decoder.prototype.pushMapState = function (size) {
  if (size > this.maxMapLength) {
      throw new Error("Max length exceeded: map length (" + size + ") > maxMapLengthLength (" + this.maxMapLength + ")");
  }
  this.stack.push({
      type: 1 /* MAP_KEY */,
      size: size,
      key: null,
      readCount: 0,
      map: {},
  });
};
Decoder.prototype.pushArrayState = function (size) {
  if (size > this.maxArrayLength) {
      throw new Error("Max length exceeded: array length (" + size + ") > maxArrayLength (" + this.maxArrayLength + ")");
  }
  this.stack.push({
      type: 0 /* ARRAY */,
      size: size,
      array: new Array(size),
      position: 0,
  });
};
Decoder.prototype.decodeUtf8String = function (byteLength, headerOffset) {
  var _a;
  if (byteLength > this.maxStrLength) {
      throw new Error("Max length exceeded: UTF-8 byte length (" + byteLength + ") > maxStrLength (" + this.maxStrLength + ")");
  }
  if (this.bytes.byteLength < this.pos + headerOffset + byteLength) {
      throw MORE_DATA;
  }
  var offset = this.pos + headerOffset;
  var object;
  if (this.stateIsMapKey() && ((_a = this.keyDecoder) === null || _a === void 0 ? void 0 : _a.canBeCached(byteLength))) {
      object = this.keyDecoder.decode(this.bytes, offset, byteLength);
  }
  else if (byteLength > TEXT_DECODER_THRESHOLD) {
      object = utf8DecodeTD(this.bytes, offset, byteLength);
  }
  else {
      object = utf8DecodeJs(this.bytes, offset, byteLength);
  }
  this.pos += headerOffset + byteLength;
  return object;
};
Decoder.prototype.stateIsMapKey = function () {
  if (this.stack.length > 0) {
      var state = this.stack[this.stack.length - 1];
      return state.type === 1 /* MAP_KEY */;
  }
  return false;
};
Decoder.prototype.decodeBinary = function (byteLength, headOffset) {
  if (byteLength > this.maxBinLength) {
      throw new Error("Max length exceeded: bin length (" + byteLength + ") > maxBinLength (" + this.maxBinLength + ")");
  }
  if (!this.hasRemaining(byteLength + headOffset)) {
      throw MORE_DATA;
  }
  var offset = this.pos + headOffset;
  var object = this.bytes.subarray(offset, offset + byteLength);
  this.pos += headOffset + byteLength;
  return object;
};
Decoder.prototype.decodeExtension = function (size, headOffset) {
  if (size > this.maxExtLength) {
      throw new Error("Max length exceeded: ext length (" + size + ") > maxExtLength (" + this.maxExtLength + ")");
  }
  var extType = this.view.getInt8(this.pos + headOffset);
  var data = this.decodeBinary(size, headOffset + 1 /* extType */);
  return this.extensionCodec.decode(data, extType, this.context);
};
Decoder.prototype.lookU8 = function () {
  return this.view.getUint8(this.pos);
};
Decoder.prototype.lookU16 = function () {
  return this.view.getUint16(this.pos);
};
Decoder.prototype.lookU32 = function () {
  return this.view.getUint32(this.pos);
};
Decoder.prototype.readU8 = function () {
  var value = this.view.getUint8(this.pos);
  this.pos++;
  return value;
};
Decoder.prototype.readI8 = function () {
  var value = this.view.getInt8(this.pos);
  this.pos++;
  return value;
};
Decoder.prototype.readU16 = function () {
  var value = this.view.getUint16(this.pos);
  this.pos += 2;
  return value;
};
Decoder.prototype.readI16 = function () {
  var value = this.view.getInt16(this.pos);
  this.pos += 2;
  return value;
};
Decoder.prototype.readU32 = function () {
  var value = this.view.getUint32(this.pos);
  this.pos += 4;
  return value;
};
Decoder.prototype.readI32 = function () {
  var value = this.view.getInt32(this.pos);
  this.pos += 4;
  return value;
};
Decoder.prototype.readU64 = function () {
  var value = getUint64(this.view, this.pos);
  this.pos += 8;
  return value;
};
Decoder.prototype.readI64 = function () {
  var value = getInt64(this.view, this.pos);
  this.pos += 8;
  return value;
};
Decoder.prototype.readF32 = function () {
  var value = this.view.getFloat32(this.pos);
  this.pos += 4;
  return value;
};
Decoder.prototype.readF64 = function () {
  var value = this.view.getFloat64(this.pos);
  this.pos += 8;
  return value;
};
return Decoder;
}());

var defaultDecodeOptions = {};
/**
* It decodes a MessagePack-encoded buffer.
*
* This is a synchronous decoding function. See other variants for asynchronous decoding: `decodeAsync()`, `decodeStream()`, `decodeArrayStream()`.
*/
function decode(buffer, options) {
if (options === void 0) { options = defaultDecodeOptions; }
var decoder = new Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
return decoder.decode(buffer);
}

// utility for whatwg streams
var __generator$1 = (undefined && undefined.__generator) || function (thisArg, body) {
var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
function verb(n) { return function (v) { return step([n, v]); }; }
function step(op) {
  if (f) throw new TypeError("Generator is already executing.");
  while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
          case 0: case 1: t = op; break;
          case 4: _.label++; return { value: op[1], done: false };
          case 5: _.label++; y = op[1]; op = [0]; continue;
          case 7: op = _.ops.pop(); _.trys.pop(); continue;
          default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
              if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
              if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
              if (t[2]) _.ops.pop();
              _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
  } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
  if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
}
};
var __await$1 = (undefined && undefined.__await) || function (v) { return this instanceof __await$1 ? (this.v = v, this) : new __await$1(v); };
var __asyncGenerator$1 = (undefined && undefined.__asyncGenerator) || function (thisArg, _arguments, generator) {
if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
var g = generator.apply(thisArg, _arguments || []), i, q = [];
return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
function step(r) { r.value instanceof __await$1 ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
function fulfill(value) { resume("next", value); }
function reject(value) { resume("throw", value); }
function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
function isAsyncIterable(object) {
return object[Symbol.asyncIterator] != null;
}
function assertNonNull(value) {
if (value == null) {
  throw new Error("Assertion Failure: value must not be null nor undefined");
}
}
function asyncIterableFromStream(stream) {
return __asyncGenerator$1(this, arguments, function asyncIterableFromStream_1() {
  var reader, _a, done, value;
  return __generator$1(this, function (_b) {
      switch (_b.label) {
          case 0:
              reader = stream.getReader();
              _b.label = 1;
          case 1:
              _b.trys.push([1, , 9, 10]);
              _b.label = 2;
          case 2:
              return [4 /*yield*/, __await$1(reader.read())];
          case 3:
              _a = _b.sent(), done = _a.done, value = _a.value;
              if (!done) return [3 /*break*/, 5];
              return [4 /*yield*/, __await$1(void 0)];
          case 4: return [2 /*return*/, _b.sent()];
          case 5:
              assertNonNull(value);
              return [4 /*yield*/, __await$1(value)];
          case 6: return [4 /*yield*/, _b.sent()];
          case 7:
              _b.sent();
              return [3 /*break*/, 2];
          case 8: return [3 /*break*/, 10];
          case 9:
              reader.releaseLock();
              return [7 /*endfinally*/];
          case 10: return [2 /*return*/];
      }
  });
});
}
function ensureAsyncIterabe(streamLike) {
if (isAsyncIterable(streamLike)) {
  return streamLike;
}
else {
  return asyncIterableFromStream(streamLike);
}
}

var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
return new (P || (P = Promise))(function (resolve, reject) {
  function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
  function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
  function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
  step((generator = generator.apply(thisArg, _arguments || [])).next());
});
};
var __generator$2 = (undefined && undefined.__generator) || function (thisArg, body) {
var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
function verb(n) { return function (v) { return step([n, v]); }; }
function step(op) {
  if (f) throw new TypeError("Generator is already executing.");
  while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
          case 0: case 1: t = op; break;
          case 4: _.label++; return { value: op[1], done: false };
          case 5: _.label++; y = op[1]; op = [0]; continue;
          case 7: op = _.ops.pop(); _.trys.pop(); continue;
          default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
              if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
              if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
              if (t[2]) _.ops.pop();
              _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
  } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
  if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
}
};
function decodeAsync(streamLike, options) {
if (options === void 0) { options = defaultDecodeOptions; }
return __awaiter$1(this, void 0, void 0, function () {
  var stream, decoder;
  return __generator$2(this, function (_a) {
      stream = ensureAsyncIterabe(streamLike);
      decoder = new Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
      return [2 /*return*/, decoder.decodeAsync(stream)];
  });
});
}
function decodeArrayStream(streamLike, options) {
if (options === void 0) { options = defaultDecodeOptions; }
var stream = ensureAsyncIterabe(streamLike);
var decoder = new Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
return decoder.decodeArrayStream(stream);
}
function decodeStream(streamLike, options) {
if (options === void 0) { options = defaultDecodeOptions; }
var stream = ensureAsyncIterabe(streamLike);
var decoder = new Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
return decoder.decodeStream(stream);
}

// Main Functions:

var dist_es5_esm = /*#__PURE__*/Object.freeze({
__proto__: null,
encode: encode,
decode: decode,
decodeAsync: decodeAsync,
decodeArrayStream: decodeArrayStream,
decodeStream: decodeStream,
Decoder: Decoder,
Encoder: Encoder,
ExtensionCodec: ExtensionCodec,
ExtData: ExtData,
EXT_TIMESTAMP: EXT_TIMESTAMP,
encodeDateToTimeSpec: encodeDateToTimeSpec,
encodeTimeSpecToTimestamp: encodeTimeSpecToTimestamp,
decodeTimestampToTimeSpec: decodeTimestampToTimeSpec,
encodeTimestampExtension: encodeTimestampExtension,
decodeTimestampExtension: decodeTimestampExtension
});

// This alphabet uses `A-Za-z0-9_-` symbols. The genetic algorithm helped
// optimize the gzip compression for this alphabet.
let urlAlphabet =
'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW';

var urlAlphabet_1 = { urlAlphabet };

let { urlAlphabet: urlAlphabet$1 } = urlAlphabet_1;

// It is best to make fewer, larger requests to the crypto module to
// avoid system call overhead. So, random numbers are generated in a
// pool. The pool is a Buffer that is larger than the initial random
// request size by this multiplier. The pool is enlarged if subsequent
// requests exceed the maximum buffer size.
const POOL_SIZE_MULTIPLIER = 32;
let pool, poolOffset;

let random = bytes => {
if (!pool || pool.length < bytes) {
pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
crypto__default['default'].randomFillSync(pool);
poolOffset = 0;
} else if (poolOffset + bytes > pool.length) {
crypto__default['default'].randomFillSync(pool);
poolOffset = 0;
}

let res = pool.subarray(poolOffset, poolOffset + bytes);
poolOffset += bytes;
return res
};

let customRandom = (alphabet, size, getRandom) => {
// First, a bitmask is necessary to generate the ID. The bitmask makes bytes
// values closer to the alphabet size. The bitmask calculates the closest
// `2^31 - 1` number, which exceeds the alphabet size.
// For example, the bitmask for the alphabet size 30 is 31 (00011111).
let mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1;
// Though, the bitmask solution is not perfect since the bytes exceeding
// the alphabet size are refused. Therefore, to reliably generate the ID,
// the random bytes redundancy has to be satisfied.

// Note: every hardware random generator call is performance expensive,
// because the system call for entropy collection takes a lot of time.
// So, to avoid additional system calls, extra bytes are requested in advance.

// Next, a step determines how many random bytes to generate.
// The number of random bytes gets decided upon the ID size, mask,
// alphabet size, and magic number 1.6 (using 1.6 peaks at performance
// according to benchmarks).
let step = Math.ceil((1.6 * mask * size) / alphabet.length);

return () => {
let id = '';
while (true) {
let bytes = getRandom(step);
// A compact alternative for `for (var i = 0; i < step; i++)`.
let i = step;
while (i--) {
  // Adding `|| ''` refuses a random byte that exceeds the alphabet size.
  id += alphabet[bytes[i] & mask] || '';
  if (id.length === size) return id
}
}
}
};

let customAlphabet = (alphabet, size) => customRandom(alphabet, size, random);

let nanoid = (size = 21) => {
let bytes = random(size);
let id = '';
// A compact alternative for `for (var i = 0; i < step; i++)`.
while (size--) {
// It is incorrect to use bytes exceeding the alphabet size.
// The following mask reduces the random byte in the 0-255 value
// range to the 0-63 value range. Therefore, adding hacks, such
// as empty string fallback or magic numbers, is unneccessary because
// the bitmask trims bytes down to the alphabet size.
id += urlAlphabet$1[bytes[size] & 63];
}
return id
};

var nanoid_1 = { nanoid, customAlphabet, customRandom, urlAlphabet: urlAlphabet$1, random };

var require$$0 = /*@__PURE__*/getAugmentedNamespace(dist_es5_esm);

var client = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
if (k2 === undefined) k2 = k;
Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
if (k2 === undefined) k2 = k;
o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
if (mod && mod.__esModule) return mod;
var result = {};
if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
__setModuleDefault(result, mod);
return result;
};
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
return new (P || (P = Promise))(function (resolve, reject) {
  function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
  function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
  function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
  step((generator = generator.apply(thisArg, _arguments || [])).next());
});
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsClient = void 0;
const isomorphic_ws_1 = __importDefault(node);
const msgpack = __importStar(require$$0);

/**
* A Websocket client which can make requests and receive responses,
* as well as send and receive signals
*
* Uses Holochain's websocket WireMessage for communication.
*/
class WsClient {
constructor(socket) {
  this.socket = socket;
  this.pendingRequests = {};
  // TODO: allow adding signal handlers later
}
emitSignal(data) {
  const encodedMsg = msgpack.encode({
      type: 'Signal',
      data: msgpack.encode(data),
  });
  this.socket.send(encodedMsg);
}
request(data) {
  const id = nanoid_1.nanoid();
  const encodedMsg = msgpack.encode({
      id,
      type: 'Request',
      data: msgpack.encode(data),
  });
  const promise = new Promise((fulfill) => {
      this.pendingRequests[id] = { fulfill };
  });
  if (this.socket.readyState === this.socket.OPEN) {
      this.socket.send(encodedMsg);
  }
  else {
      return Promise.reject(new Error(`Socket is not open`));
  }
  return promise;
}
close() {
  this.socket.close();
  return this.awaitClose();
}
awaitClose() {
  return new Promise((resolve) => this.socket.on('close', resolve));
}
static connect(url, signalCb) {
  return new Promise((resolve, reject) => {
      const socket = new isomorphic_ws_1.default(url);
      // make sure that there are no uncaught connection
      // errors because that causes nodejs thread to crash
      // with uncaught exception
      socket.onerror = (e) => {
          reject(new Error(`could not connect to holochain conductor, please check that a conductor service is running and available at ${url}`));
      };
      socket.onopen = () => {
          const hw = new WsClient(socket);
          socket.onmessage = (encodedMsg) => __awaiter(this, void 0, void 0, function* () {
              let data = encodedMsg.data;
              // If data is not a buffer (nodejs), it will be a blob (browser)
              if (typeof Buffer === "undefined" || !Buffer.isBuffer(data)) {
                  data = yield data.arrayBuffer();
              }
              const msg = msgpack.decode(data);
              if (signalCb && msg.type === 'Signal') {
                  const decodedMessage = msgpack.decode(msg.data);
                  // Note: holochain currently returns signals as an array of two values: cellId and the seralized signal payload
                  // and this array is nested within the App key within the returned message.
                  const decodedCellId = decodedMessage.App[0];
                  // Note:In order to return readible content to the UI, the signal payload must also be decoded.
                  const decodedPayload = signalTransform(decodedMessage.App[1]);
                  // Return a uniform format to UI (ie: { type, data } - the same format as with callZome and appInfo...)
                  const signal = { type: msg.type, data: { cellId: decodedCellId, payload: decodedPayload } };
                  signalCb(signal);
              }
              else if (msg.type === 'Response') {
                  const id = msg.id;
                  if (hw.pendingRequests[id]) {
                      // resolve response
                      hw.pendingRequests[id].fulfill(msgpack.decode(msg.data));
                  }
                  else {
                      console.error(`Got response with no matching request. id=${id}`);
                  }
              }
              else {
                  console.error(`Got unrecognized Websocket message type: ${msg.type}`);
              }
          });
          resolve(hw);
      };
  });
}
}
exports.WsClient = WsClient;
const signalTransform = (res) => {
return msgpack.decode(res);
};

});

var common = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.promiseTimeout = exports.catchError = exports.DEFAULT_TIMEOUT = void 0;
const ERROR_TYPE = 'error';
exports.DEFAULT_TIMEOUT = 15000;
exports.catchError = (res) => {
return res.type === ERROR_TYPE
  ? Promise.reject(res)
  : Promise.resolve(res);
};
exports.promiseTimeout = (promise, tag, ms) => {
let id;
let timeout = new Promise((resolve, reject) => {
  id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(`Timed out in ${ms}ms: ${tag}`));
  }, ms);
});
return new Promise((res, rej) => {
  Promise.race([
      promise,
      timeout
  ]).then((a) => {
      clearTimeout(id);
      return res(a);
  })
      .catch(e => {
      return rej(e);
  });
});
};

});

var common$1 = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
return new (P || (P = Promise))(function (resolve, reject) {
  function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
  function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
  function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
  step((generator = generator.apply(thisArg, _arguments || [])).next());
});
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requesterTransformer = void 0;
/**
* Take a Requester function which deals with tagged requests and responses,
* and return a Requester which deals only with the inner data types, also
* with the optional Transformer applied to further modify the input and output.
*/
exports.requesterTransformer = (requester, tag, transform = identityTransformer) => ((req, timeout) => __awaiter(void 0, void 0, void 0, function* () {
const input = { type: tag, data: transform.input(req) };
const response = yield requester(input, timeout);
const output = transform.output(response.data);
return output;
}));
const identity = x => x;
const identityTransformer = {
input: identity,
output: identity,
};

});

var admin$1 = createCommonjsModule(function (module, exports) {
/**
* Defines AdminWebsocket, an easy-to-use websocket implementation of the
* Conductor Admin API
*
*    const client = AdminWebsocket.connect(
*      'ws://localhost:9000'
*    )
*
*    client.generateAgentPubKey()
*      .then(agentPubKey => {
*        console.log('Agent successfully generated:', agentPubKey)
*      })
*      .catch(err => {
*        console.error('problem generating agent:', err)
*      })
*/
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
return new (P || (P = Promise))(function (resolve, reject) {
  function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
  function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
  function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
  step((generator = generator.apply(thisArg, _arguments || [])).next());
});
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminWebsocket = void 0;



class AdminWebsocket {
constructor(client, defaultTimeout) {
  this._requester = (tag, transformer) => common$1.requesterTransformer((req, timeout) => common.promiseTimeout(this.client.request(req), tag, timeout || this.defaultTimeout).then(common.catchError), tag, transformer);
  // the specific request/response types come from the Interface
  // which this class implements
  this.activateApp = this._requester('activate_app');
  this.attachAppInterface = this._requester('attach_app_interface');
  this.deactivateApp = this._requester('deactivate_app');
  this.dumpState = this._requester('dump_state', dumpStateTransform);
  this.generateAgentPubKey = this._requester('generate_agent_pub_key');
  this.registerDna = this._requester('register_dna');
  this.installApp = this._requester('install_app');
  this.listDnas = this._requester('list_dnas');
  this.listCellIds = this._requester('list_cell_ids');
  this.listActiveApps = this._requester('list_active_apps');
  this.requestAgentInfo = this._requester('request_agent_info');
  this.addAgentInfo = this._requester('add_agent_info');
  this.client = client;
  this.defaultTimeout = defaultTimeout === undefined ? common.DEFAULT_TIMEOUT : defaultTimeout;
}
static connect(url, defaultTimeout) {
  return __awaiter(this, void 0, void 0, function* () {
      const wsClient = yield client.WsClient.connect(url);
      return new AdminWebsocket(wsClient, defaultTimeout);
  });
}
}
exports.AdminWebsocket = AdminWebsocket;
const dumpStateTransform = {
input: (req) => req,
output: (res) => {
  return JSON.parse(res);
}
};

});

var app$1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
if (k2 === undefined) k2 = k;
Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
if (k2 === undefined) k2 = k;
o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
if (mod && mod.__esModule) return mod;
var result = {};
if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
__setModuleDefault(result, mod);
return result;
};
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
return new (P || (P = Promise))(function (resolve, reject) {
  function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
  function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
  function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
  step((generator = generator.apply(thisArg, _arguments || [])).next());
});
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppWebsocket = void 0;
/**
* Defines AppWebsocket, an easy-to-use websocket implementation of the
* Conductor API for apps
*
*    const client = AppWebsocket.connect(
*      'ws://localhost:9000',
*      signal => console.log('got a signal:', signal)
*    )
*
*    client.callZome({...})  // TODO: show what's in here
*      .then(() => {
*        console.log('DNA successfully installed')
*      })
*      .catch(err => {
*        console.error('problem installing DNA:', err)
*      })
*/
const msgpack = __importStar(require$$0);



class AppWebsocket {
constructor(client, defaultTimeout) {
  this._requester = (tag, transformer) => common$1.requesterTransformer((req, timeout) => common.promiseTimeout(this.client.request(req), tag, timeout || this.defaultTimeout).then(common.catchError), tag, transformer);
  this.appInfo = this._requester('app_info');
  this.callZome = this._requester('zome_call_invocation', callZomeTransform);
  this.client = client;
  this.defaultTimeout = defaultTimeout === undefined ? common.DEFAULT_TIMEOUT : defaultTimeout;
}
static connect(url, defaultTimeout, signalCb) {
  return __awaiter(this, void 0, void 0, function* () {
      const wsClient = yield client.WsClient.connect(url, signalCb);
      return new AppWebsocket(wsClient, defaultTimeout);
  });
}
}
exports.AppWebsocket = AppWebsocket;
const callZomeTransform = {
input: (req) => {
  req.payload = msgpack.encode(req.payload);
  return req;
},
output: (res) => {
  return msgpack.decode(res);
}
};

});

var require$$0$1 = /*@__PURE__*/getAugmentedNamespace(admin);

var require$$1 = /*@__PURE__*/getAugmentedNamespace(app);

var lib = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
if (k2 === undefined) k2 = k;
Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
if (k2 === undefined) k2 = k;
o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require$$0$1, exports);
__exportStar(require$$1, exports);
__exportStar(types, exports);
__exportStar(admin$1, exports);
__exportStar(app$1, exports);

});

var config = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HAPP_NAME = exports.OPS_CONSOLE_API = exports.DNA_NICK = exports.APP_ID = exports.HC_CONFIG_PATH = exports.HOLO_CONDUCTOR_DEFAULT_PORT = exports.HC_ADMIN_PORT = exports.rootPath = void 0;
const path_1 = __importDefault(path__default['default']);
// @ts-ignore
exports.rootPath = path_1.default.dirname((_a = require.main) === null || _a === void 0 ? void 0 : _a.filename);
exports.HC_ADMIN_PORT = 9876;
exports.HOLO_CONDUCTOR_DEFAULT_PORT = 42233;
exports.HC_CONFIG_PATH = exports.rootPath;
exports.APP_ID = "joining-code-factory:alpha1:0001";
exports.DNA_NICK = "jcf";
exports.OPS_CONSOLE_API = "https://registration-api.holotest.net";
exports.HAPP_NAME = "Elemental%20Chat";
});

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


var isWindows = process.platform === 'win32';


// JavaScript implementation of realpath, ported from node pre-v6

var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
// Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
// is fairly slow to generate.
var callback;
if (DEBUG) {
var backtrace = new Error;
callback = debugCallback;
} else
callback = missingCallback;

return callback;

function debugCallback(err) {
if (err) {
backtrace.message = err.message;
err = backtrace;
missingCallback(err);
}
}

function missingCallback(err) {
if (err) {
if (process.throwDeprecation)
  throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
else if (!process.noDeprecation) {
  var msg = 'fs: missing callback ' + (err.stack || err.message);
  if (process.traceDeprecation)
    console.trace(msg);
  else
    console.error(msg);
}
}
}
}

function maybeCallback(cb) {
return typeof cb === 'function' ? cb : rethrow();
}

var normalize = path__default['default'].normalize;

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
if (isWindows) {
var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
var nextPartRe = /(.*?)(?:[\/]+|$)/g;
}

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
if (isWindows) {
var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
var splitRootRe = /^[\/]*/;
}

var realpathSync = function realpathSync(p, cache) {
// make p is absolute
p = path__default['default'].resolve(p);

if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
return cache[p];
}

var original = p,
seenLinks = {},
knownHard = {};

// current character position in p
var pos;
// the partial path so far, including a trailing slash if any
var current;
// the partial path without a trailing slash (except when pointing at a root)
var base;
// the partial path scanned in the previous round, with slash
var previous;

start();

function start() {
// Skip over roots
var m = splitRootRe.exec(p);
pos = m[0].length;
current = m[0];
base = m[0];
previous = '';

// On windows, check that the root exists. On unix there is no need.
if (isWindows && !knownHard[base]) {
fs__default['default'].lstatSync(base);
knownHard[base] = true;
}
}

// walk down the path, swapping out linked pathparts for their real
// values
// NB: p.length changes.
while (pos < p.length) {
// find the next part
nextPartRe.lastIndex = pos;
var result = nextPartRe.exec(p);
previous = current;
current += result[0];
base = previous + result[1];
pos = nextPartRe.lastIndex;

// continue if not a symlink
if (knownHard[base] || (cache && cache[base] === base)) {
continue;
}

var resolvedLink;
if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
// some known symbolic link.  no need to stat again.
resolvedLink = cache[base];
} else {
var stat = fs__default['default'].lstatSync(base);
if (!stat.isSymbolicLink()) {
  knownHard[base] = true;
  if (cache) cache[base] = base;
  continue;
}

// read the link if it wasn't read before
// dev/ino always return 0 on windows, so skip the check.
var linkTarget = null;
if (!isWindows) {
  var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
  if (seenLinks.hasOwnProperty(id)) {
    linkTarget = seenLinks[id];
  }
}
if (linkTarget === null) {
  fs__default['default'].statSync(base);
  linkTarget = fs__default['default'].readlinkSync(base);
}
resolvedLink = path__default['default'].resolve(previous, linkTarget);
// track this, if given a cache.
if (cache) cache[base] = resolvedLink;
if (!isWindows) seenLinks[id] = linkTarget;
}

// resolve the link, then start over
p = path__default['default'].resolve(resolvedLink, p.slice(pos));
start();
}

if (cache) cache[original] = p;

return p;
};


var realpath = function realpath(p, cache, cb) {
if (typeof cb !== 'function') {
cb = maybeCallback(cache);
cache = null;
}

// make p is absolute
p = path__default['default'].resolve(p);

if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
return process.nextTick(cb.bind(null, null, cache[p]));
}

var original = p,
seenLinks = {},
knownHard = {};

// current character position in p
var pos;
// the partial path so far, including a trailing slash if any
var current;
// the partial path without a trailing slash (except when pointing at a root)
var base;
// the partial path scanned in the previous round, with slash
var previous;

start();

function start() {
// Skip over roots
var m = splitRootRe.exec(p);
pos = m[0].length;
current = m[0];
base = m[0];
previous = '';

// On windows, check that the root exists. On unix there is no need.
if (isWindows && !knownHard[base]) {
fs__default['default'].lstat(base, function(err) {
  if (err) return cb(err);
  knownHard[base] = true;
  LOOP();
});
} else {
process.nextTick(LOOP);
}
}

// walk down the path, swapping out linked pathparts for their real
// values
function LOOP() {
// stop if scanned past end of path
if (pos >= p.length) {
if (cache) cache[original] = p;
return cb(null, p);
}

// find the next part
nextPartRe.lastIndex = pos;
var result = nextPartRe.exec(p);
previous = current;
current += result[0];
base = previous + result[1];
pos = nextPartRe.lastIndex;

// continue if not a symlink
if (knownHard[base] || (cache && cache[base] === base)) {
return process.nextTick(LOOP);
}

if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
// known symbolic link.  no need to stat again.
return gotResolvedLink(cache[base]);
}

return fs__default['default'].lstat(base, gotStat);
}

function gotStat(err, stat) {
if (err) return cb(err);

// if not a symlink, skip to the next path part
if (!stat.isSymbolicLink()) {
knownHard[base] = true;
if (cache) cache[base] = base;
return process.nextTick(LOOP);
}

// stat & read the link if not read before
// call gotTarget as soon as the link target is known
// dev/ino always return 0 on windows, so skip the check.
if (!isWindows) {
var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
if (seenLinks.hasOwnProperty(id)) {
  return gotTarget(null, seenLinks[id], base);
}
}
fs__default['default'].stat(base, function(err) {
if (err) return cb(err);

fs__default['default'].readlink(base, function(err, target) {
  if (!isWindows) seenLinks[id] = target;
  gotTarget(err, target);
});
});
}

function gotTarget(err, target, base) {
if (err) return cb(err);

var resolvedLink = path__default['default'].resolve(previous, target);
if (cache) cache[base] = resolvedLink;
gotResolvedLink(resolvedLink);
}

function gotResolvedLink(resolvedLink) {
// resolve the link, then start over
p = path__default['default'].resolve(resolvedLink, p.slice(pos));
start();
}
};

var old = {
realpathSync: realpathSync,
realpath: realpath
};

var fs_realpath = realpath$1;
realpath$1.realpath = realpath$1;
realpath$1.sync = realpathSync$1;
realpath$1.realpathSync = realpathSync$1;
realpath$1.monkeypatch = monkeypatch;
realpath$1.unmonkeypatch = unmonkeypatch;


var origRealpath = fs__default['default'].realpath;
var origRealpathSync = fs__default['default'].realpathSync;

var version = process.version;
var ok = /^v[0-5]\./.test(version);


function newError (er) {
return er && er.syscall === 'realpath' && (
er.code === 'ELOOP' ||
er.code === 'ENOMEM' ||
er.code === 'ENAMETOOLONG'
)
}

function realpath$1 (p, cache, cb) {
if (ok) {
return origRealpath(p, cache, cb)
}

if (typeof cache === 'function') {
cb = cache;
cache = null;
}
origRealpath(p, cache, function (er, result) {
if (newError(er)) {
old.realpath(p, cache, cb);
} else {
cb(er, result);
}
});
}

function realpathSync$1 (p, cache) {
if (ok) {
return origRealpathSync(p, cache)
}

try {
return origRealpathSync(p, cache)
} catch (er) {
if (newError(er)) {
return old.realpathSync(p, cache)
} else {
throw er
}
}
}

function monkeypatch () {
fs__default['default'].realpath = realpath$1;
fs__default['default'].realpathSync = realpathSync$1;
}

function unmonkeypatch () {
fs__default['default'].realpath = origRealpath;
fs__default['default'].realpathSync = origRealpathSync;
}

var concatMap = function (xs, fn) {
var res = [];
for (var i = 0; i < xs.length; i++) {
  var x = fn(xs[i], i);
  if (isArray(x)) res.push.apply(res, x);
  else res.push(x);
}
return res;
};

var isArray = Array.isArray || function (xs) {
return Object.prototype.toString.call(xs) === '[object Array]';
};

var balancedMatch = balanced;
function balanced(a, b, str) {
if (a instanceof RegExp) a = maybeMatch(a, str);
if (b instanceof RegExp) b = maybeMatch(b, str);

var r = range(a, b, str);

return r && {
start: r[0],
end: r[1],
pre: str.slice(0, r[0]),
body: str.slice(r[0] + a.length, r[1]),
post: str.slice(r[1] + b.length)
};
}

function maybeMatch(reg, str) {
var m = str.match(reg);
return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
var begs, beg, left, right, result;
var ai = str.indexOf(a);
var bi = str.indexOf(b, ai + 1);
var i = ai;

if (ai >= 0 && bi > 0) {
begs = [];
left = str.length;

while (i >= 0 && !result) {
if (i == ai) {
  begs.push(i);
  ai = str.indexOf(a, i + 1);
} else if (begs.length == 1) {
  result = [ begs.pop(), bi ];
} else {
  beg = begs.pop();
  if (beg < left) {
    left = beg;
    right = bi;
  }

  bi = str.indexOf(b, i + 1);
}

i = ai < bi && ai >= 0 ? ai : bi;
}

if (begs.length) {
result = [ left, right ];
}
}

return result;
}

var braceExpansion = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
return parseInt(str, 10) == str
? parseInt(str, 10)
: str.charCodeAt(0);
}

function escapeBraces(str) {
return str.split('\\\\').join(escSlash)
      .split('\\{').join(escOpen)
      .split('\\}').join(escClose)
      .split('\\,').join(escComma)
      .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
return str.split(escSlash).join('\\')
      .split(escOpen).join('{')
      .split(escClose).join('}')
      .split(escComma).join(',')
      .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
if (!str)
return [''];

var parts = [];
var m = balancedMatch('{', '}', str);

if (!m)
return str.split(',');

var pre = m.pre;
var body = m.body;
var post = m.post;
var p = pre.split(',');

p[p.length-1] += '{' + body + '}';
var postParts = parseCommaParts(post);
if (post.length) {
p[p.length-1] += postParts.shift();
p.push.apply(p, postParts);
}

parts.push.apply(parts, p);

return parts;
}

function expandTop(str) {
if (!str)
return [];

// I don't know why Bash 4.3 does this, but it does.
// Anything starting with {} will have the first two bytes preserved
// but *only* at the top level, so {},a}b will not expand to anything,
// but a{},b}c will be expanded to [a}c,abc].
// One could argue that this is a bug in Bash, but since the goal of
// this module is to match Bash's rules, we escape a leading {}
if (str.substr(0, 2) === '{}') {
str = '\\{\\}' + str.substr(2);
}

return expand(escapeBraces(str), true).map(unescapeBraces);
}

function embrace(str) {
return '{' + str + '}';
}
function isPadded(el) {
return /^-?0\d/.test(el);
}

function lte(i, y) {
return i <= y;
}
function gte(i, y) {
return i >= y;
}

function expand(str, isTop) {
var expansions = [];

var m = balancedMatch('{', '}', str);
if (!m || /\$$/.test(m.pre)) return [str];

var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
var isSequence = isNumericSequence || isAlphaSequence;
var isOptions = m.body.indexOf(',') >= 0;
if (!isSequence && !isOptions) {
// {a},b}
if (m.post.match(/,.*\}/)) {
str = m.pre + '{' + m.body + escClose + m.post;
return expand(str);
}
return [str];
}

var n;
if (isSequence) {
n = m.body.split(/\.\./);
} else {
n = parseCommaParts(m.body);
if (n.length === 1) {
// x{{a,b}}y ==> x{a}y x{b}y
n = expand(n[0], false).map(embrace);
if (n.length === 1) {
  var post = m.post.length
    ? expand(m.post, false)
    : [''];
  return post.map(function(p) {
    return m.pre + n[0] + p;
  });
}
}
}

// at this point, n is the parts, and we know it's not a comma set
// with a single entry.

// no need to expand pre, since it is guaranteed to be free of brace-sets
var pre = m.pre;
var post = m.post.length
? expand(m.post, false)
: [''];

var N;

if (isSequence) {
var x = numeric(n[0]);
var y = numeric(n[1]);
var width = Math.max(n[0].length, n[1].length);
var incr = n.length == 3
? Math.abs(numeric(n[2]))
: 1;
var test = lte;
var reverse = y < x;
if (reverse) {
incr *= -1;
test = gte;
}
var pad = n.some(isPadded);

N = [];

for (var i = x; test(i, y); i += incr) {
var c;
if (isAlphaSequence) {
  c = String.fromCharCode(i);
  if (c === '\\')
    c = '';
} else {
  c = String(i);
  if (pad) {
    var need = width - c.length;
    if (need > 0) {
      var z = new Array(need + 1).join('0');
      if (i < 0)
        c = '-' + z + c.slice(1);
      else
        c = z + c;
    }
  }
}
N.push(c);
}
} else {
N = concatMap(n, function(el) { return expand(el, false) });
}

for (var j = 0; j < N.length; j++) {
for (var k = 0; k < post.length; k++) {
var expansion = pre + N[j] + post[k];
if (!isTop || isSequence || expansion)
  expansions.push(expansion);
}
}

return expansions;
}

var minimatch_1 = minimatch;
minimatch.Minimatch = Minimatch;

var path = { sep: '/' };
try {
path = path__default['default'];
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {};


var plTypes = {
'!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
'?': { open: '(?:', close: ')?' },
'+': { open: '(?:', close: ')+' },
'*': { open: '(?:', close: ')*' },
'@': { open: '(?:', close: ')' }
};

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]';

// * => any number of characters
var star = qmark + '*?';

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?';

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?';

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!');

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
return s.split('').reduce(function (set, c) {
set[c] = true;
return set
}, {})
}

// normalizes slashes.
var slashSplit = /\/+/;

minimatch.filter = filter;
function filter (pattern, options) {
options = options || {};
return function (p, i, list) {
return minimatch(p, pattern, options)
}
}

function ext (a, b) {
a = a || {};
b = b || {};
var t = {};
Object.keys(b).forEach(function (k) {
t[k] = b[k];
});
Object.keys(a).forEach(function (k) {
t[k] = a[k];
});
return t
}

minimatch.defaults = function (def) {
if (!def || !Object.keys(def).length) return minimatch

var orig = minimatch;

var m = function minimatch (p, pattern, options) {
return orig.minimatch(p, pattern, ext(def, options))
};

m.Minimatch = function Minimatch (pattern, options) {
return new orig.Minimatch(pattern, ext(def, options))
};

return m
};

Minimatch.defaults = function (def) {
if (!def || !Object.keys(def).length) return Minimatch
return minimatch.defaults(def).Minimatch
};

function minimatch (p, pattern, options) {
if (typeof pattern !== 'string') {
throw new TypeError('glob pattern string required')
}

if (!options) options = {};

// shortcut: comments match nothing.
if (!options.nocomment && pattern.charAt(0) === '#') {
return false
}

// "" only matches ""
if (pattern.trim() === '') return p === ''

return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
if (!(this instanceof Minimatch)) {
return new Minimatch(pattern, options)
}

if (typeof pattern !== 'string') {
throw new TypeError('glob pattern string required')
}

if (!options) options = {};
pattern = pattern.trim();

// windows support: need to use /, not \
if (path.sep !== '/') {
pattern = pattern.split(path.sep).join('/');
}

this.options = options;
this.set = [];
this.pattern = pattern;
this.regexp = null;
this.negate = false;
this.comment = false;
this.empty = false;

// make the set of regexps etc.
this.make();
}

Minimatch.prototype.debug = function () {};

Minimatch.prototype.make = make;
function make () {
// don't do it more than once.
if (this._made) return

var pattern = this.pattern;
var options = this.options;

// empty patterns and comments match nothing.
if (!options.nocomment && pattern.charAt(0) === '#') {
this.comment = true;
return
}
if (!pattern) {
this.empty = true;
return
}

// step 1: figure out negation, etc.
this.parseNegate();

// step 2: expand braces
var set = this.globSet = this.braceExpand();

if (options.debug) this.debug = console.error;

this.debug(this.pattern, set);

// step 3: now we have a set, so turn each one into a series of path-portion
// matching patterns.
// These will be regexps, except in the case of "**", which is
// set to the GLOBSTAR object for globstar behavior,
// and will not contain any / characters
set = this.globParts = set.map(function (s) {
return s.split(slashSplit)
});

this.debug(this.pattern, set);

// glob --> regexps
set = set.map(function (s, si, set) {
return s.map(this.parse, this)
}, this);

this.debug(this.pattern, set);

// filter out everything that didn't compile properly.
set = set.filter(function (s) {
return s.indexOf(false) === -1
});

this.debug(this.pattern, set);

this.set = set;
}

Minimatch.prototype.parseNegate = parseNegate;
function parseNegate () {
var pattern = this.pattern;
var negate = false;
var options = this.options;
var negateOffset = 0;

if (options.nonegate) return

for (var i = 0, l = pattern.length
; i < l && pattern.charAt(i) === '!'
; i++) {
negate = !negate;
negateOffset++;
}

if (negateOffset) this.pattern = pattern.substr(negateOffset);
this.negate = negate;
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
return braceExpand(pattern, options)
};

Minimatch.prototype.braceExpand = braceExpand;

function braceExpand (pattern, options) {
if (!options) {
if (this instanceof Minimatch) {
options = this.options;
} else {
options = {};
}
}

pattern = typeof pattern === 'undefined'
? this.pattern : pattern;

if (typeof pattern === 'undefined') {
throw new TypeError('undefined pattern')
}

if (options.nobrace ||
!pattern.match(/\{.*\}/)) {
// shortcut. no need to expand.
return [pattern]
}

return braceExpansion(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse$3;
var SUBPARSE = {};
function parse$3 (pattern, isSub) {
if (pattern.length > 1024 * 64) {
throw new TypeError('pattern is too long')
}

var options = this.options;

// shortcuts
if (!options.noglobstar && pattern === '**') return GLOBSTAR
if (pattern === '') return ''

var re = '';
var hasMagic = !!options.nocase;
var escaping = false;
// ? => one single character
var patternListStack = [];
var negativeLists = [];
var stateChar;
var inClass = false;
var reClassStart = -1;
var classStart = -1;
// . and .. never match anything that doesn't start with .,
// even when options.dot is set.
var patternStart = pattern.charAt(0) === '.' ? '' // anything
// not (start or / followed by . or .. followed by / or end)
: options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
: '(?!\\.)';
var self = this;

function clearStateChar () {
if (stateChar) {
// we had some state-tracking character
// that wasn't consumed by this pass.
switch (stateChar) {
  case '*':
    re += star;
    hasMagic = true;
  break
  case '?':
    re += qmark;
    hasMagic = true;
  break
  default:
    re += '\\' + stateChar;
  break
}
self.debug('clearStateChar %j %j', stateChar, re);
stateChar = false;
}
}

for (var i = 0, len = pattern.length, c
; (i < len) && (c = pattern.charAt(i))
; i++) {
this.debug('%s\t%s %s %j', pattern, i, re, c);

// skip over any that are escaped.
if (escaping && reSpecials[c]) {
re += '\\' + c;
escaping = false;
continue
}

switch (c) {
case '/':
  // completely not allowed, even escaped.
  // Should already be path-split by now.
  return false

case '\\':
  clearStateChar();
  escaping = true;
continue

// the various stateChar values
// for the "extglob" stuff.
case '?':
case '*':
case '+':
case '@':
case '!':
  this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c);

  // all of those are literals inside a class, except that
  // the glob [!a] means [^a] in regexp
  if (inClass) {
    this.debug('  in class');
    if (c === '!' && i === classStart + 1) c = '^';
    re += c;
    continue
  }

  // if we already have a stateChar, then it means
  // that there was something like ** or +? in there.
  // Handle the stateChar, then proceed with this one.
  self.debug('call clearStateChar %j', stateChar);
  clearStateChar();
  stateChar = c;
  // if extglob is disabled, then +(asdf|foo) isn't a thing.
  // just clear the statechar *now*, rather than even diving into
  // the patternList stuff.
  if (options.noext) clearStateChar();
continue

case '(':
  if (inClass) {
    re += '(';
    continue
  }

  if (!stateChar) {
    re += '\\(';
    continue
  }

  patternListStack.push({
    type: stateChar,
    start: i - 1,
    reStart: re.length,
    open: plTypes[stateChar].open,
    close: plTypes[stateChar].close
  });
  // negation is (?:(?!js)[^/]*)
  re += stateChar === '!' ? '(?:(?!(?:' : '(?:';
  this.debug('plType %j %j', stateChar, re);
  stateChar = false;
continue

case ')':
  if (inClass || !patternListStack.length) {
    re += '\\)';
    continue
  }

  clearStateChar();
  hasMagic = true;
  var pl = patternListStack.pop();
  // negation is (?:(?!js)[^/]*)
  // The others are (?:<pattern>)<type>
  re += pl.close;
  if (pl.type === '!') {
    negativeLists.push(pl);
  }
  pl.reEnd = re.length;
continue

case '|':
  if (inClass || !patternListStack.length || escaping) {
    re += '\\|';
    escaping = false;
    continue
  }

  clearStateChar();
  re += '|';
continue

// these are mostly the same in regexp and glob
case '[':
  // swallow any state-tracking char before the [
  clearStateChar();

  if (inClass) {
    re += '\\' + c;
    continue
  }

  inClass = true;
  classStart = i;
  reClassStart = re.length;
  re += c;
continue

case ']':
  //  a right bracket shall lose its special
  //  meaning and represent itself in
  //  a bracket expression if it occurs
  //  first in the list.  -- POSIX.2 2.8.3.2
  if (i === classStart + 1 || !inClass) {
    re += '\\' + c;
    escaping = false;
    continue
  }

  // handle the case where we left a class open.
  // "[z-a]" is valid, equivalent to "\[z-a\]"
  if (inClass) {
    // split where the last [ was, make sure we don't have
    // an invalid re. if so, re-walk the contents of the
    // would-be class to re-translate any characters that
    // were passed through as-is
    // TODO: It would probably be faster to determine this
    // without a try/catch and a new RegExp, but it's tricky
    // to do safely.  For now, this is safe and works.
    var cs = pattern.substring(classStart + 1, i);
    try {
      RegExp('[' + cs + ']');
    } catch (er) {
      // not a valid class!
      var sp = this.parse(cs, SUBPARSE);
      re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]';
      hasMagic = hasMagic || sp[1];
      inClass = false;
      continue
    }
  }

  // finish up the class.
  hasMagic = true;
  inClass = false;
  re += c;
continue

default:
  // swallow any state char that wasn't consumed
  clearStateChar();

  if (escaping) {
    // no need
    escaping = false;
  } else if (reSpecials[c]
    && !(c === '^' && inClass)) {
    re += '\\';
  }

  re += c;

} // switch
} // for

// handle the case where we left a class open.
// "[abc" is valid, equivalent to "\[abc"
if (inClass) {
// split where the last [ was, and escape it
// this is a huge pita.  We now have to re-walk
// the contents of the would-be class to re-translate
// any characters that were passed through as-is
cs = pattern.substr(classStart + 1);
sp = this.parse(cs, SUBPARSE);
re = re.substr(0, reClassStart) + '\\[' + sp[0];
hasMagic = hasMagic || sp[1];
}

// handle the case where we had a +( thing at the *end*
// of the pattern.
// each pattern list stack adds 3 chars, and we need to go through
// and escape any | chars that were passed through as-is for the regexp.
// Go through and escape them, taking care not to double-escape any
// | chars that were already escaped.
for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
var tail = re.slice(pl.reStart + pl.open.length);
this.debug('setting tail', re, pl);
// maybe some even number of \, then maybe 1 \, followed by a |
tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
if (!$2) {
  // the | isn't already escaped, so escape it.
  $2 = '\\';
}

// need to escape all those slashes *again*, without escaping the
// one that we need for escaping the | character.  As it works out,
// escaping an even number of slashes can be done by simply repeating
// it exactly after itself.  That's why this trick works.
//
// I am sorry that you have to see this.
return $1 + $1 + $2 + '|'
});

this.debug('tail=%j\n   %s', tail, tail, pl, re);
var t = pl.type === '*' ? star
: pl.type === '?' ? qmark
: '\\' + pl.type;

hasMagic = true;
re = re.slice(0, pl.reStart) + t + '\\(' + tail;
}

// handle trailing things that only matter at the very end.
clearStateChar();
if (escaping) {
// trailing \\
re += '\\\\';
}

// only need to apply the nodot start if the re starts with
// something that could conceivably capture a dot
var addPatternStart = false;
switch (re.charAt(0)) {
case '.':
case '[':
case '(': addPatternStart = true;
}

// Hack to work around lack of negative lookbehind in JS
// A pattern like: *.!(x).!(y|z) needs to ensure that a name
// like 'a.xyz.yz' doesn't match.  So, the first negative
// lookahead, has to look ALL the way ahead, to the end of
// the pattern.
for (var n = negativeLists.length - 1; n > -1; n--) {
var nl = negativeLists[n];

var nlBefore = re.slice(0, nl.reStart);
var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
var nlAfter = re.slice(nl.reEnd);

nlLast += nlAfter;

// Handle nested stuff like *(*.js|!(*.json)), where open parens
// mean that we should *not* include the ) in the bit that is considered
// "after" the negated section.
var openParensBefore = nlBefore.split('(').length - 1;
var cleanAfter = nlAfter;
for (i = 0; i < openParensBefore; i++) {
cleanAfter = cleanAfter.replace(/\)[+*?]?/, '');
}
nlAfter = cleanAfter;

var dollar = '';
if (nlAfter === '' && isSub !== SUBPARSE) {
dollar = '$';
}
var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
re = newRe;
}

// if the re is not "" at this point, then we need to make sure
// it doesn't match against an empty path part.
// Otherwise a/* will match a/, which it should not.
if (re !== '' && hasMagic) {
re = '(?=.)' + re;
}

if (addPatternStart) {
re = patternStart + re;
}

// parsing just a piece of a larger pattern.
if (isSub === SUBPARSE) {
return [re, hasMagic]
}

// skip the regexp for non-magical patterns
// unescape anything in it, though, so that it'll be
// an exact match against a file etc.
if (!hasMagic) {
return globUnescape(pattern)
}

var flags = options.nocase ? 'i' : '';
try {
var regExp = new RegExp('^' + re + '$', flags);
} catch (er) {
// If it was an invalid regular expression, then it can't match
// anything.  This trick looks for a character after the end of
// the string, which is of course impossible, except in multi-line
// mode, but it's not a /m regex.
return new RegExp('$.')
}

regExp._glob = pattern;
regExp._src = re;

return regExp
}

minimatch.makeRe = function (pattern, options) {
return new Minimatch(pattern, options || {}).makeRe()
};

Minimatch.prototype.makeRe = makeRe;
function makeRe () {
if (this.regexp || this.regexp === false) return this.regexp

// at this point, this.set is a 2d array of partial
// pattern strings, or "**".
//
// It's better to use .match().  This function shouldn't
// be used, really, but it's pretty convenient sometimes,
// when you just want to work with a regex.
var set = this.set;

if (!set.length) {
this.regexp = false;
return this.regexp
}
var options = this.options;

var twoStar = options.noglobstar ? star
: options.dot ? twoStarDot
: twoStarNoDot;
var flags = options.nocase ? 'i' : '';

var re = set.map(function (pattern) {
return pattern.map(function (p) {
return (p === GLOBSTAR) ? twoStar
: (typeof p === 'string') ? regExpEscape(p)
: p._src
}).join('\\\/')
}).join('|');

// must match entire pattern
// ending in a * or ** will make it less strict.
re = '^(?:' + re + ')$';

// can match anything, as long as it's not this.
if (this.negate) re = '^(?!' + re + ').*$';

try {
this.regexp = new RegExp(re, flags);
} catch (ex) {
this.regexp = false;
}
return this.regexp
}

minimatch.match = function (list, pattern, options) {
options = options || {};
var mm = new Minimatch(pattern, options);
list = list.filter(function (f) {
return mm.match(f)
});
if (mm.options.nonull && !list.length) {
list.push(pattern);
}
return list
};

Minimatch.prototype.match = match;
function match (f, partial) {
this.debug('match', f, this.pattern);
// short-circuit in the case of busted things.
// comments, etc.
if (this.comment) return false
if (this.empty) return f === ''

if (f === '/' && partial) return true

var options = this.options;

// windows: need to use /, not \
if (path.sep !== '/') {
f = f.split(path.sep).join('/');
}

// treat the test path as a set of pathparts.
f = f.split(slashSplit);
this.debug(this.pattern, 'split', f);

// just ONE of the pattern sets in this.set needs to match
// in order for it to be valid.  If negating, then just one
// match means that we have failed.
// Either way, return on the first hit.

var set = this.set;
this.debug(this.pattern, 'set', set);

// Find the basename of the path by looking for the last non-empty segment
var filename;
var i;
for (i = f.length - 1; i >= 0; i--) {
filename = f[i];
if (filename) break
}

for (i = 0; i < set.length; i++) {
var pattern = set[i];
var file = f;
if (options.matchBase && pattern.length === 1) {
file = [filename];
}
var hit = this.matchOne(file, pattern, partial);
if (hit) {
if (options.flipNegate) return true
return !this.negate
}
}

// didn't get any hits.  this is success if it's a negative
// pattern, failure otherwise.
if (options.flipNegate) return false
return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
var options = this.options;

this.debug('matchOne',
{ 'this': this, file: file, pattern: pattern });

this.debug('matchOne', file.length, pattern.length);

for (var fi = 0,
pi = 0,
fl = file.length,
pl = pattern.length
; (fi < fl) && (pi < pl)
; fi++, pi++) {
this.debug('matchOne loop');
var p = pattern[pi];
var f = file[fi];

this.debug(pattern, p, f);

// should be impossible.
// some invalid regexp stuff in the set.
if (p === false) return false

if (p === GLOBSTAR) {
this.debug('GLOBSTAR', [pattern, p, f]);

// "**"
// a/**/b/**/c would match the following:
// a/b/x/y/z/c
// a/x/y/z/b/c
// a/b/x/b/x/c
// a/b/c
// To do this, take the rest of the pattern after
// the **, and see if it would match the file remainder.
// If so, return success.
// If not, the ** "swallows" a segment, and try again.
// This is recursively awful.
//
// a/**/b/**/c matching a/b/x/y/z/c
// - a matches a
// - doublestar
//   - matchOne(b/x/y/z/c, b/**/c)
//     - b matches b
//     - doublestar
//       - matchOne(x/y/z/c, c) -> no
//       - matchOne(y/z/c, c) -> no
//       - matchOne(z/c, c) -> no
//       - matchOne(c, c) yes, hit
var fr = fi;
var pr = pi + 1;
if (pr === pl) {
  this.debug('** at the end');
  // a ** at the end will just swallow the rest.
  // We have found a match.
  // however, it will not swallow /.x, unless
  // options.dot is set.
  // . and .. are *never* matched by **, for explosively
  // exponential reasons.
  for (; fi < fl; fi++) {
    if (file[fi] === '.' || file[fi] === '..' ||
      (!options.dot && file[fi].charAt(0) === '.')) return false
  }
  return true
}

// ok, let's see if we can swallow whatever we can.
while (fr < fl) {
  var swallowee = file[fr];

  this.debug('\nglobstar while', file, fr, pattern, pr, swallowee);

  // XXX remove this slice.  Just pass the start index.
  if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
    this.debug('globstar found match!', fr, fl, swallowee);
    // found a match.
    return true
  } else {
    // can't swallow "." or ".." ever.
    // can only swallow ".foo" when explicitly asked.
    if (swallowee === '.' || swallowee === '..' ||
      (!options.dot && swallowee.charAt(0) === '.')) {
      this.debug('dot detected!', file, fr, pattern, pr);
      break
    }

    // ** swallows a segment, and continue.
    this.debug('globstar swallow a segment, and continue');
    fr++;
  }
}

// no match was found.
// However, in partial mode, we can't say this is necessarily over.
// If there's more *pattern* left, then
if (partial) {
  // ran out of file
  this.debug('\n>>> no match, partial?', file, fr, pattern, pr);
  if (fr === fl) return true
}
return false
}

// something other than **
// non-magic patterns just have to match exactly
// patterns with magic have been turned into regexps.
var hit;
if (typeof p === 'string') {
if (options.nocase) {
  hit = f.toLowerCase() === p.toLowerCase();
} else {
  hit = f === p;
}
this.debug('string match', p, f, hit);
} else {
hit = f.match(p);
this.debug('pattern match', p, f, hit);
}

if (!hit) return false
}

// Note: ending in / means that we'll get a final ""
// at the end of the pattern.  This can only match a
// corresponding "" at the end of the file.
// If the file ends in /, then it can only match a
// a pattern that ends in /, unless the pattern just
// doesn't have any more for it. But, a/b/ should *not*
// match "a/b/*", even though "" matches against the
// [^/]*? pattern, except in partial mode, where it might
// simply not be reached yet.
// However, a/b/ should still satisfy a/*

// now either we fell off the end of the pattern, or we're done.
if (fi === fl && pi === pl) {
// ran out of pattern and filename at the same time.
// an exact hit!
return true
} else if (fi === fl) {
// ran out of file, but still had pattern left.
// this is ok if we're doing the match as part of
// a glob fs traversal.
return partial
} else if (pi === pl) {
// ran out of pattern, still have file left.
// this is only acceptable if we're on the very last
// empty segment of a file with a trailing slash.
// a/* should match a/b/
var emptyFileEnd = (fi === fl - 1) && (file[fi] === '');
return emptyFileEnd
}

// should be unreachable.
throw new Error('wtf?')
};

// replace stuff like \* with *
function globUnescape (s) {
return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

var inherits_browser = createCommonjsModule(function (module) {
if (typeof Object.create === 'function') {
// implementation from standard node.js 'util' module
module.exports = function inherits(ctor, superCtor) {
if (superCtor) {
ctor.super_ = superCtor;
ctor.prototype = Object.create(superCtor.prototype, {
  constructor: {
    value: ctor,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
}
};
} else {
// old school shim for old browsers
module.exports = function inherits(ctor, superCtor) {
if (superCtor) {
ctor.super_ = superCtor;
var TempCtor = function () {};
TempCtor.prototype = superCtor.prototype;
ctor.prototype = new TempCtor();
ctor.prototype.constructor = ctor;
}
};
}
});

var inherits = createCommonjsModule(function (module) {
try {
var util = require$$0__default['default'];
/* istanbul ignore next */
if (typeof util.inherits !== 'function') throw '';
module.exports = util.inherits;
} catch (e) {
/* istanbul ignore next */
module.exports = inherits_browser;
}
});

function posix(path) {
return path.charAt(0) === '/';
}

function win32(path) {
// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
var result = splitDeviceRe.exec(path);
var device = result[1] || '';
var isUnc = Boolean(device && device.charAt(1) !== ':');

// UNC paths are always absolute
return Boolean(result[2] || isUnc);
}

var pathIsAbsolute = process.platform === 'win32' ? win32 : posix;
var posix_1 = posix;
var win32_1 = win32;
pathIsAbsolute.posix = posix_1;
pathIsAbsolute.win32 = win32_1;

var alphasort_1 = alphasort;
var alphasorti_1 = alphasorti;
var setopts_1 = setopts;
var ownProp_1 = ownProp;
var makeAbs_1 = makeAbs;
var finish_1 = finish;
var mark_1 = mark;
var isIgnored_1 = isIgnored;
var childrenIgnored_1 = childrenIgnored;

function ownProp (obj, field) {
return Object.prototype.hasOwnProperty.call(obj, field)
}




var Minimatch$1 = minimatch_1.Minimatch;

function alphasorti (a, b) {
return a.toLowerCase().localeCompare(b.toLowerCase())
}

function alphasort (a, b) {
return a.localeCompare(b)
}

function setupIgnores (self, options) {
self.ignore = options.ignore || [];

if (!Array.isArray(self.ignore))
self.ignore = [self.ignore];

if (self.ignore.length) {
self.ignore = self.ignore.map(ignoreMap);
}
}

// ignore patterns are always in dot:true mode.
function ignoreMap (pattern) {
var gmatcher = null;
if (pattern.slice(-3) === '/**') {
var gpattern = pattern.replace(/(\/\*\*)+$/, '');
gmatcher = new Minimatch$1(gpattern, { dot: true });
}

return {
matcher: new Minimatch$1(pattern, { dot: true }),
gmatcher: gmatcher
}
}

function setopts (self, pattern, options) {
if (!options)
options = {};

// base-matching: just use globstar for that.
if (options.matchBase && -1 === pattern.indexOf("/")) {
if (options.noglobstar) {
throw new Error("base matching requires globstar")
}
pattern = "**/" + pattern;
}

self.silent = !!options.silent;
self.pattern = pattern;
self.strict = options.strict !== false;
self.realpath = !!options.realpath;
self.realpathCache = options.realpathCache || Object.create(null);
self.follow = !!options.follow;
self.dot = !!options.dot;
self.mark = !!options.mark;
self.nodir = !!options.nodir;
if (self.nodir)
self.mark = true;
self.sync = !!options.sync;
self.nounique = !!options.nounique;
self.nonull = !!options.nonull;
self.nosort = !!options.nosort;
self.nocase = !!options.nocase;
self.stat = !!options.stat;
self.noprocess = !!options.noprocess;
self.absolute = !!options.absolute;

self.maxLength = options.maxLength || Infinity;
self.cache = options.cache || Object.create(null);
self.statCache = options.statCache || Object.create(null);
self.symlinks = options.symlinks || Object.create(null);

setupIgnores(self, options);

self.changedCwd = false;
var cwd = process.cwd();
if (!ownProp(options, "cwd"))
self.cwd = cwd;
else {
self.cwd = path__default['default'].resolve(options.cwd);
self.changedCwd = self.cwd !== cwd;
}

self.root = options.root || path__default['default'].resolve(self.cwd, "/");
self.root = path__default['default'].resolve(self.root);
if (process.platform === "win32")
self.root = self.root.replace(/\\/g, "/");

// TODO: is an absolute `cwd` supposed to be resolved against `root`?
// e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
self.cwdAbs = pathIsAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd);
if (process.platform === "win32")
self.cwdAbs = self.cwdAbs.replace(/\\/g, "/");
self.nomount = !!options.nomount;

// disable comments and negation in Minimatch.
// Note that they are not supported in Glob itself anyway.
options.nonegate = true;
options.nocomment = true;

self.minimatch = new Minimatch$1(pattern, options);
self.options = self.minimatch.options;
}

function finish (self) {
var nou = self.nounique;
var all = nou ? [] : Object.create(null);

for (var i = 0, l = self.matches.length; i < l; i ++) {
var matches = self.matches[i];
if (!matches || Object.keys(matches).length === 0) {
if (self.nonull) {
  // do like the shell, and spit out the literal glob
  var literal = self.minimatch.globSet[i];
  if (nou)
    all.push(literal);
  else
    all[literal] = true;
}
} else {
// had matches
var m = Object.keys(matches);
if (nou)
  all.push.apply(all, m);
else
  m.forEach(function (m) {
    all[m] = true;
  });
}
}

if (!nou)
all = Object.keys(all);

if (!self.nosort)
all = all.sort(self.nocase ? alphasorti : alphasort);

// at *some* point we statted all of these
if (self.mark) {
for (var i = 0; i < all.length; i++) {
all[i] = self._mark(all[i]);
}
if (self.nodir) {
all = all.filter(function (e) {
  var notDir = !(/\/$/.test(e));
  var c = self.cache[e] || self.cache[makeAbs(self, e)];
  if (notDir && c)
    notDir = c !== 'DIR' && !Array.isArray(c);
  return notDir
});
}
}

if (self.ignore.length)
all = all.filter(function(m) {
return !isIgnored(self, m)
});

self.found = all;
}

function mark (self, p) {
var abs = makeAbs(self, p);
var c = self.cache[abs];
var m = p;
if (c) {
var isDir = c === 'DIR' || Array.isArray(c);
var slash = p.slice(-1) === '/';

if (isDir && !slash)
m += '/';
else if (!isDir && slash)
m = m.slice(0, -1);

if (m !== p) {
var mabs = makeAbs(self, m);
self.statCache[mabs] = self.statCache[abs];
self.cache[mabs] = self.cache[abs];
}
}

return m
}

// lotta situps...
function makeAbs (self, f) {
var abs = f;
if (f.charAt(0) === '/') {
abs = path__default['default'].join(self.root, f);
} else if (pathIsAbsolute(f) || f === '') {
abs = f;
} else if (self.changedCwd) {
abs = path__default['default'].resolve(self.cwd, f);
} else {
abs = path__default['default'].resolve(f);
}

if (process.platform === 'win32')
abs = abs.replace(/\\/g, '/');

return abs
}


// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
function isIgnored (self, path) {
if (!self.ignore.length)
return false

return self.ignore.some(function(item) {
return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
})
}

function childrenIgnored (self, path) {
if (!self.ignore.length)
return false

return self.ignore.some(function(item) {
return !!(item.gmatcher && item.gmatcher.match(path))
})
}

var common$2 = {
alphasort: alphasort_1,
alphasorti: alphasorti_1,
setopts: setopts_1,
ownProp: ownProp_1,
makeAbs: makeAbs_1,
finish: finish_1,
mark: mark_1,
isIgnored: isIgnored_1,
childrenIgnored: childrenIgnored_1
};

var sync = globSync;
globSync.GlobSync = GlobSync;
var setopts$1 = common$2.setopts;
var ownProp$1 = common$2.ownProp;
var childrenIgnored$1 = common$2.childrenIgnored;
var isIgnored$1 = common$2.isIgnored;

function globSync (pattern, options) {
if (typeof options === 'function' || arguments.length === 3)
throw new TypeError('callback provided to sync glob\n'+
                  'See: https://github.com/isaacs/node-glob/issues/167')

return new GlobSync(pattern, options).found
}

function GlobSync (pattern, options) {
if (!pattern)
throw new Error('must provide pattern')

if (typeof options === 'function' || arguments.length === 3)
throw new TypeError('callback provided to sync glob\n'+
                  'See: https://github.com/isaacs/node-glob/issues/167')

if (!(this instanceof GlobSync))
return new GlobSync(pattern, options)

setopts$1(this, pattern, options);

if (this.noprocess)
return this

var n = this.minimatch.set.length;
this.matches = new Array(n);
for (var i = 0; i < n; i ++) {
this._process(this.minimatch.set[i], i, false);
}
this._finish();
}

GlobSync.prototype._finish = function () {
assert__default['default'](this instanceof GlobSync);
if (this.realpath) {
var self = this;
this.matches.forEach(function (matchset, index) {
var set = self.matches[index] = Object.create(null);
for (var p in matchset) {
  try {
    p = self._makeAbs(p);
    var real = fs_realpath.realpathSync(p, self.realpathCache);
    set[real] = true;
  } catch (er) {
    if (er.syscall === 'stat')
      set[self._makeAbs(p)] = true;
    else
      throw er
  }
}
});
}
common$2.finish(this);
};


GlobSync.prototype._process = function (pattern, index, inGlobStar) {
assert__default['default'](this instanceof GlobSync);

// Get the first [n] parts of pattern that are all strings.
var n = 0;
while (typeof pattern[n] === 'string') {
n ++;
}
// now n is the index of the first one that is *not* a string.

// See if there's anything else
var prefix;
switch (n) {
// if not, then this is rather simple
case pattern.length:
this._processSimple(pattern.join('/'), index);
return

case 0:
// pattern *starts* with some non-trivial item.
// going to readdir(cwd), but not include the prefix in matches.
prefix = null;
break

default:
// pattern has some string bits in the front.
// whatever it starts with, whether that's 'absolute' like /foo/bar,
// or 'relative' like '../baz'
prefix = pattern.slice(0, n).join('/');
break
}

var remain = pattern.slice(n);

// get the list of entries.
var read;
if (prefix === null)
read = '.';
else if (pathIsAbsolute(prefix) || pathIsAbsolute(pattern.join('/'))) {
if (!prefix || !pathIsAbsolute(prefix))
prefix = '/' + prefix;
read = prefix;
} else
read = prefix;

var abs = this._makeAbs(read);

//if ignored, skip processing
if (childrenIgnored$1(this, read))
return

var isGlobStar = remain[0] === minimatch_1.GLOBSTAR;
if (isGlobStar)
this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
else
this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
};


GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
var entries = this._readdir(abs, inGlobStar);

// if the abs isn't a dir, then nothing can match!
if (!entries)
return

// It will only match dot entries if it starts with a dot, or if
// dot is set.  Stuff like @(.foo|.bar) isn't allowed.
var pn = remain[0];
var negate = !!this.minimatch.negate;
var rawGlob = pn._glob;
var dotOk = this.dot || rawGlob.charAt(0) === '.';

var matchedEntries = [];
for (var i = 0; i < entries.length; i++) {
var e = entries[i];
if (e.charAt(0) !== '.' || dotOk) {
var m;
if (negate && !prefix) {
  m = !e.match(pn);
} else {
  m = e.match(pn);
}
if (m)
  matchedEntries.push(e);
}
}

var len = matchedEntries.length;
// If there are no matched entries, then nothing matches.
if (len === 0)
return

// if this is the last remaining pattern bit, then no need for
// an additional stat *unless* the user has specified mark or
// stat explicitly.  We know they exist, since readdir returned
// them.

if (remain.length === 1 && !this.mark && !this.stat) {
if (!this.matches[index])
this.matches[index] = Object.create(null);

for (var i = 0; i < len; i ++) {
var e = matchedEntries[i];
if (prefix) {
  if (prefix.slice(-1) !== '/')
    e = prefix + '/' + e;
  else
    e = prefix + e;
}

if (e.charAt(0) === '/' && !this.nomount) {
  e = path__default['default'].join(this.root, e);
}
this._emitMatch(index, e);
}
// This was the last one, and no stats were needed
return
}

// now test all matched entries as stand-ins for that part
// of the pattern.
remain.shift();
for (var i = 0; i < len; i ++) {
var e = matchedEntries[i];
var newPattern;
if (prefix)
newPattern = [prefix, e];
else
newPattern = [e];
this._process(newPattern.concat(remain), index, inGlobStar);
}
};


GlobSync.prototype._emitMatch = function (index, e) {
if (isIgnored$1(this, e))
return

var abs = this._makeAbs(e);

if (this.mark)
e = this._mark(e);

if (this.absolute) {
e = abs;
}

if (this.matches[index][e])
return

if (this.nodir) {
var c = this.cache[abs];
if (c === 'DIR' || Array.isArray(c))
return
}

this.matches[index][e] = true;

if (this.stat)
this._stat(e);
};


GlobSync.prototype._readdirInGlobStar = function (abs) {
// follow all symlinked directories forever
// just proceed as if this is a non-globstar situation
if (this.follow)
return this._readdir(abs, false)

var entries;
var lstat;
try {
lstat = fs__default['default'].lstatSync(abs);
} catch (er) {
if (er.code === 'ENOENT') {
// lstat failed, doesn't exist
return null
}
}

var isSym = lstat && lstat.isSymbolicLink();
this.symlinks[abs] = isSym;

// If it's not a symlink or a dir, then it's definitely a regular file.
// don't bother doing a readdir in that case.
if (!isSym && lstat && !lstat.isDirectory())
this.cache[abs] = 'FILE';
else
entries = this._readdir(abs, false);

return entries
};

GlobSync.prototype._readdir = function (abs, inGlobStar) {

if (inGlobStar && !ownProp$1(this.symlinks, abs))
return this._readdirInGlobStar(abs)

if (ownProp$1(this.cache, abs)) {
var c = this.cache[abs];
if (!c || c === 'FILE')
return null

if (Array.isArray(c))
return c
}

try {
return this._readdirEntries(abs, fs__default['default'].readdirSync(abs))
} catch (er) {
this._readdirError(abs, er);
return null
}
};

GlobSync.prototype._readdirEntries = function (abs, entries) {
// if we haven't asked to stat everything, then just
// assume that everything in there exists, so we can avoid
// having to stat it a second time.
if (!this.mark && !this.stat) {
for (var i = 0; i < entries.length; i ++) {
var e = entries[i];
if (abs === '/')
  e = abs + e;
else
  e = abs + '/' + e;
this.cache[e] = true;
}
}

this.cache[abs] = entries;

// mark and cache dir-ness
return entries
};

GlobSync.prototype._readdirError = function (f, er) {
// handle errors, and cache the information
switch (er.code) {
case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
case 'ENOTDIR': // totally normal. means it *does* exist.
var abs = this._makeAbs(f);
this.cache[abs] = 'FILE';
if (abs === this.cwdAbs) {
  var error = new Error(er.code + ' invalid cwd ' + this.cwd);
  error.path = this.cwd;
  error.code = er.code;
  throw error
}
break

case 'ENOENT': // not terribly unusual
case 'ELOOP':
case 'ENAMETOOLONG':
case 'UNKNOWN':
this.cache[this._makeAbs(f)] = false;
break

default: // some unusual error.  Treat as failure.
this.cache[this._makeAbs(f)] = false;
if (this.strict)
  throw er
if (!this.silent)
  console.error('glob error', er);
break
}
};

GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

var entries = this._readdir(abs, inGlobStar);

// no entries means not a dir, so it can never have matches
// foo.txt/** doesn't match foo.txt
if (!entries)
return

// test without the globstar, and with every child both below
// and replacing the globstar.
var remainWithoutGlobStar = remain.slice(1);
var gspref = prefix ? [ prefix ] : [];
var noGlobStar = gspref.concat(remainWithoutGlobStar);

// the noGlobStar pattern exits the inGlobStar state
this._process(noGlobStar, index, false);

var len = entries.length;
var isSym = this.symlinks[abs];

// If it's a symlink, and we're in a globstar, then stop
if (isSym && inGlobStar)
return

for (var i = 0; i < len; i++) {
var e = entries[i];
if (e.charAt(0) === '.' && !this.dot)
continue

// these two cases enter the inGlobStar state
var instead = gspref.concat(entries[i], remainWithoutGlobStar);
this._process(instead, index, true);

var below = gspref.concat(entries[i], remain);
this._process(below, index, true);
}
};

GlobSync.prototype._processSimple = function (prefix, index) {
// XXX review this.  Shouldn't it be doing the mounting etc
// before doing stat?  kinda weird?
var exists = this._stat(prefix);

if (!this.matches[index])
this.matches[index] = Object.create(null);

// If it doesn't exist, then just mark the lack of results
if (!exists)
return

if (prefix && pathIsAbsolute(prefix) && !this.nomount) {
var trail = /[\/\\]$/.test(prefix);
if (prefix.charAt(0) === '/') {
prefix = path__default['default'].join(this.root, prefix);
} else {
prefix = path__default['default'].resolve(this.root, prefix);
if (trail)
  prefix += '/';
}
}

if (process.platform === 'win32')
prefix = prefix.replace(/\\/g, '/');

// Mark this as a match
this._emitMatch(index, prefix);
};

// Returns either 'DIR', 'FILE', or false
GlobSync.prototype._stat = function (f) {
var abs = this._makeAbs(f);
var needDir = f.slice(-1) === '/';

if (f.length > this.maxLength)
return false

if (!this.stat && ownProp$1(this.cache, abs)) {
var c = this.cache[abs];

if (Array.isArray(c))
c = 'DIR';

// It exists, but maybe not how we need it
if (!needDir || c === 'DIR')
return c

if (needDir && c === 'FILE')
return false

// otherwise we have to stat, because maybe c=true
// if we know it exists, but not what it is.
}
var stat = this.statCache[abs];
if (!stat) {
var lstat;
try {
lstat = fs__default['default'].lstatSync(abs);
} catch (er) {
if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
  this.statCache[abs] = false;
  return false
}
}

if (lstat && lstat.isSymbolicLink()) {
try {
  stat = fs__default['default'].statSync(abs);
} catch (er) {
  stat = lstat;
}
} else {
stat = lstat;
}
}

this.statCache[abs] = stat;

var c = true;
if (stat)
c = stat.isDirectory() ? 'DIR' : 'FILE';

this.cache[abs] = this.cache[abs] || c;

if (needDir && c === 'FILE')
return false

return c
};

GlobSync.prototype._mark = function (p) {
return common$2.mark(this, p)
};

GlobSync.prototype._makeAbs = function (f) {
return common$2.makeAbs(this, f)
};

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
var wrappy_1 = wrappy;
function wrappy (fn, cb) {
if (fn && cb) return wrappy(fn)(cb)

if (typeof fn !== 'function')
throw new TypeError('need wrapper function')

Object.keys(fn).forEach(function (k) {
wrapper[k] = fn[k];
});

return wrapper

function wrapper() {
var args = new Array(arguments.length);
for (var i = 0; i < args.length; i++) {
args[i] = arguments[i];
}
var ret = fn.apply(this, args);
var cb = args[args.length-1];
if (typeof ret === 'function' && ret !== cb) {
Object.keys(cb).forEach(function (k) {
  ret[k] = cb[k];
});
}
return ret
}
}

var once_1 = wrappy_1(once);
var strict = wrappy_1(onceStrict);

once.proto = once(function () {
Object.defineProperty(Function.prototype, 'once', {
value: function () {
return once(this)
},
configurable: true
});

Object.defineProperty(Function.prototype, 'onceStrict', {
value: function () {
return onceStrict(this)
},
configurable: true
});
});

function once (fn) {
var f = function () {
if (f.called) return f.value
f.called = true;
return f.value = fn.apply(this, arguments)
};
f.called = false;
return f
}

function onceStrict (fn) {
var f = function () {
if (f.called)
throw new Error(f.onceError)
f.called = true;
return f.value = fn.apply(this, arguments)
};
var name = fn.name || 'Function wrapped with `once`';
f.onceError = name + " shouldn't be called more than once";
f.called = false;
return f
}
once_1.strict = strict;

var reqs = Object.create(null);


var inflight_1 = wrappy_1(inflight);

function inflight (key, cb) {
if (reqs[key]) {
reqs[key].push(cb);
return null
} else {
reqs[key] = [cb];
return makeres(key)
}
}

function makeres (key) {
return once_1(function RES () {
var cbs = reqs[key];
var len = cbs.length;
var args = slice(arguments);

// XXX It's somewhat ambiguous whether a new callback added in this
// pass should be queued for later execution if something in the
// list of callbacks throws, or if it should just be discarded.
// However, it's such an edge case that it hardly matters, and either
// choice is likely as surprising as the other.
// As it happens, we do go ahead and schedule it for later execution.
try {
for (var i = 0; i < len; i++) {
  cbs[i].apply(null, args);
}
} finally {
if (cbs.length > len) {
  // added more in the interim.
  // de-zalgo, just in case, but don't call again.
  cbs.splice(0, len);
  process.nextTick(function () {
    RES.apply(null, args);
  });
} else {
  delete reqs[key];
}
}
})
}

function slice (args) {
var length = args.length;
var array = [];

for (var i = 0; i < length; i++) array[i] = args[i];
return array
}

// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

var glob_1 = glob;

var EE = EventEmitter__default['default'].EventEmitter;
var setopts$2 = common$2.setopts;
var ownProp$2 = common$2.ownProp;


var childrenIgnored$2 = common$2.childrenIgnored;
var isIgnored$2 = common$2.isIgnored;



function glob (pattern, options, cb) {
if (typeof options === 'function') cb = options, options = {};
if (!options) options = {};

if (options.sync) {
if (cb)
throw new TypeError('callback provided to sync glob')
return sync(pattern, options)
}

return new Glob(pattern, options, cb)
}

glob.sync = sync;
var GlobSync$1 = glob.GlobSync = sync.GlobSync;

// old api surface
glob.glob = glob;

function extend (origin, add) {
if (add === null || typeof add !== 'object') {
return origin
}

var keys = Object.keys(add);
var i = keys.length;
while (i--) {
origin[keys[i]] = add[keys[i]];
}
return origin
}

glob.hasMagic = function (pattern, options_) {
var options = extend({}, options_);
options.noprocess = true;

var g = new Glob(pattern, options);
var set = g.minimatch.set;

if (!pattern)
return false

if (set.length > 1)
return true

for (var j = 0; j < set[0].length; j++) {
if (typeof set[0][j] !== 'string')
return true
}

return false
};

glob.Glob = Glob;
inherits(Glob, EE);
function Glob (pattern, options, cb) {
if (typeof options === 'function') {
cb = options;
options = null;
}

if (options && options.sync) {
if (cb)
throw new TypeError('callback provided to sync glob')
return new GlobSync$1(pattern, options)
}

if (!(this instanceof Glob))
return new Glob(pattern, options, cb)

setopts$2(this, pattern, options);
this._didRealPath = false;

// process each pattern in the minimatch set
var n = this.minimatch.set.length;

// The matches are stored as {<filename>: true,...} so that
// duplicates are automagically pruned.
// Later, we do an Object.keys() on these.
// Keep them as a list so we can fill in when nonull is set.
this.matches = new Array(n);

if (typeof cb === 'function') {
cb = once_1(cb);
this.on('error', cb);
this.on('end', function (matches) {
cb(null, matches);
});
}

var self = this;
this._processing = 0;

this._emitQueue = [];
this._processQueue = [];
this.paused = false;

if (this.noprocess)
return this

if (n === 0)
return done()

var sync = true;
for (var i = 0; i < n; i ++) {
this._process(this.minimatch.set[i], i, false, done);
}
sync = false;

function done () {
--self._processing;
if (self._processing <= 0) {
if (sync) {
  process.nextTick(function () {
    self._finish();
  });
} else {
  self._finish();
}
}
}
}

Glob.prototype._finish = function () {
assert__default['default'](this instanceof Glob);
if (this.aborted)
return

if (this.realpath && !this._didRealpath)
return this._realpath()

common$2.finish(this);
this.emit('end', this.found);
};

Glob.prototype._realpath = function () {
if (this._didRealpath)
return

this._didRealpath = true;

var n = this.matches.length;
if (n === 0)
return this._finish()

var self = this;
for (var i = 0; i < this.matches.length; i++)
this._realpathSet(i, next);

function next () {
if (--n === 0)
self._finish();
}
};

Glob.prototype._realpathSet = function (index, cb) {
var matchset = this.matches[index];
if (!matchset)
return cb()

var found = Object.keys(matchset);
var self = this;
var n = found.length;

if (n === 0)
return cb()

var set = this.matches[index] = Object.create(null);
found.forEach(function (p, i) {
// If there's a problem with the stat, then it means that
// one or more of the links in the realpath couldn't be
// resolved.  just return the abs value in that case.
p = self._makeAbs(p);
fs_realpath.realpath(p, self.realpathCache, function (er, real) {
if (!er)
  set[real] = true;
else if (er.syscall === 'stat')
  set[p] = true;
else
  self.emit('error', er); // srsly wtf right here

if (--n === 0) {
  self.matches[index] = set;
  cb();
}
});
});
};

Glob.prototype._mark = function (p) {
return common$2.mark(this, p)
};

Glob.prototype._makeAbs = function (f) {
return common$2.makeAbs(this, f)
};

Glob.prototype.abort = function () {
this.aborted = true;
this.emit('abort');
};

Glob.prototype.pause = function () {
if (!this.paused) {
this.paused = true;
this.emit('pause');
}
};

Glob.prototype.resume = function () {
if (this.paused) {
this.emit('resume');
this.paused = false;
if (this._emitQueue.length) {
var eq = this._emitQueue.slice(0);
this._emitQueue.length = 0;
for (var i = 0; i < eq.length; i ++) {
  var e = eq[i];
  this._emitMatch(e[0], e[1]);
}
}
if (this._processQueue.length) {
var pq = this._processQueue.slice(0);
this._processQueue.length = 0;
for (var i = 0; i < pq.length; i ++) {
  var p = pq[i];
  this._processing--;
  this._process(p[0], p[1], p[2], p[3]);
}
}
}
};

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
assert__default['default'](this instanceof Glob);
assert__default['default'](typeof cb === 'function');

if (this.aborted)
return

this._processing++;
if (this.paused) {
this._processQueue.push([pattern, index, inGlobStar, cb]);
return
}

//console.error('PROCESS %d', this._processing, pattern)

// Get the first [n] parts of pattern that are all strings.
var n = 0;
while (typeof pattern[n] === 'string') {
n ++;
}
// now n is the index of the first one that is *not* a string.

// see if there's anything else
var prefix;
switch (n) {
// if not, then this is rather simple
case pattern.length:
this._processSimple(pattern.join('/'), index, cb);
return

case 0:
// pattern *starts* with some non-trivial item.
// going to readdir(cwd), but not include the prefix in matches.
prefix = null;
break

default:
// pattern has some string bits in the front.
// whatever it starts with, whether that's 'absolute' like /foo/bar,
// or 'relative' like '../baz'
prefix = pattern.slice(0, n).join('/');
break
}

var remain = pattern.slice(n);

// get the list of entries.
var read;
if (prefix === null)
read = '.';
else if (pathIsAbsolute(prefix) || pathIsAbsolute(pattern.join('/'))) {
if (!prefix || !pathIsAbsolute(prefix))
prefix = '/' + prefix;
read = prefix;
} else
read = prefix;

var abs = this._makeAbs(read);

//if ignored, skip _processing
if (childrenIgnored$2(this, read))
return cb()

var isGlobStar = remain[0] === minimatch_1.GLOBSTAR;
if (isGlobStar)
this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
else
this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
};

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
var self = this;
this._readdir(abs, inGlobStar, function (er, entries) {
return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
});
};

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

// if the abs isn't a dir, then nothing can match!
if (!entries)
return cb()

// It will only match dot entries if it starts with a dot, or if
// dot is set.  Stuff like @(.foo|.bar) isn't allowed.
var pn = remain[0];
var negate = !!this.minimatch.negate;
var rawGlob = pn._glob;
var dotOk = this.dot || rawGlob.charAt(0) === '.';

var matchedEntries = [];
for (var i = 0; i < entries.length; i++) {
var e = entries[i];
if (e.charAt(0) !== '.' || dotOk) {
var m;
if (negate && !prefix) {
  m = !e.match(pn);
} else {
  m = e.match(pn);
}
if (m)
  matchedEntries.push(e);
}
}

//console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

var len = matchedEntries.length;
// If there are no matched entries, then nothing matches.
if (len === 0)
return cb()

// if this is the last remaining pattern bit, then no need for
// an additional stat *unless* the user has specified mark or
// stat explicitly.  We know they exist, since readdir returned
// them.

if (remain.length === 1 && !this.mark && !this.stat) {
if (!this.matches[index])
this.matches[index] = Object.create(null);

for (var i = 0; i < len; i ++) {
var e = matchedEntries[i];
if (prefix) {
  if (prefix !== '/')
    e = prefix + '/' + e;
  else
    e = prefix + e;
}

if (e.charAt(0) === '/' && !this.nomount) {
  e = path__default['default'].join(this.root, e);
}
this._emitMatch(index, e);
}
// This was the last one, and no stats were needed
return cb()
}

// now test all matched entries as stand-ins for that part
// of the pattern.
remain.shift();
for (var i = 0; i < len; i ++) {
var e = matchedEntries[i];
if (prefix) {
if (prefix !== '/')
  e = prefix + '/' + e;
else
  e = prefix + e;
}
this._process([e].concat(remain), index, inGlobStar, cb);
}
cb();
};

Glob.prototype._emitMatch = function (index, e) {
if (this.aborted)
return

if (isIgnored$2(this, e))
return

if (this.paused) {
this._emitQueue.push([index, e]);
return
}

var abs = pathIsAbsolute(e) ? e : this._makeAbs(e);

if (this.mark)
e = this._mark(e);

if (this.absolute)
e = abs;

if (this.matches[index][e])
return

if (this.nodir) {
var c = this.cache[abs];
if (c === 'DIR' || Array.isArray(c))
return
}

this.matches[index][e] = true;

var st = this.statCache[abs];
if (st)
this.emit('stat', e, st);

this.emit('match', e);
};

Glob.prototype._readdirInGlobStar = function (abs, cb) {
if (this.aborted)
return

// follow all symlinked directories forever
// just proceed as if this is a non-globstar situation
if (this.follow)
return this._readdir(abs, false, cb)

var lstatkey = 'lstat\0' + abs;
var self = this;
var lstatcb = inflight_1(lstatkey, lstatcb_);

if (lstatcb)
fs__default['default'].lstat(abs, lstatcb);

function lstatcb_ (er, lstat) {
if (er && er.code === 'ENOENT')
return cb()

var isSym = lstat && lstat.isSymbolicLink();
self.symlinks[abs] = isSym;

// If it's not a symlink or a dir, then it's definitely a regular file.
// don't bother doing a readdir in that case.
if (!isSym && lstat && !lstat.isDirectory()) {
self.cache[abs] = 'FILE';
cb();
} else
self._readdir(abs, false, cb);
}
};

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
if (this.aborted)
return

cb = inflight_1('readdir\0'+abs+'\0'+inGlobStar, cb);
if (!cb)
return

//console.error('RD %j %j', +inGlobStar, abs)
if (inGlobStar && !ownProp$2(this.symlinks, abs))
return this._readdirInGlobStar(abs, cb)

if (ownProp$2(this.cache, abs)) {
var c = this.cache[abs];
if (!c || c === 'FILE')
return cb()

if (Array.isArray(c))
return cb(null, c)
}
fs__default['default'].readdir(abs, readdirCb(this, abs, cb));
};

function readdirCb (self, abs, cb) {
return function (er, entries) {
if (er)
self._readdirError(abs, er, cb);
else
self._readdirEntries(abs, entries, cb);
}
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
if (this.aborted)
return

// if we haven't asked to stat everything, then just
// assume that everything in there exists, so we can avoid
// having to stat it a second time.
if (!this.mark && !this.stat) {
for (var i = 0; i < entries.length; i ++) {
var e = entries[i];
if (abs === '/')
  e = abs + e;
else
  e = abs + '/' + e;
this.cache[e] = true;
}
}

this.cache[abs] = entries;
return cb(null, entries)
};

Glob.prototype._readdirError = function (f, er, cb) {
if (this.aborted)
return

// handle errors, and cache the information
switch (er.code) {
case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
case 'ENOTDIR': // totally normal. means it *does* exist.
var abs = this._makeAbs(f);
this.cache[abs] = 'FILE';
if (abs === this.cwdAbs) {
  var error = new Error(er.code + ' invalid cwd ' + this.cwd);
  error.path = this.cwd;
  error.code = er.code;
  this.emit('error', error);
  this.abort();
}
break

case 'ENOENT': // not terribly unusual
case 'ELOOP':
case 'ENAMETOOLONG':
case 'UNKNOWN':
this.cache[this._makeAbs(f)] = false;
break

default: // some unusual error.  Treat as failure.
this.cache[this._makeAbs(f)] = false;
if (this.strict) {
  this.emit('error', er);
  // If the error is handled, then we abort
  // if not, we threw out of here
  this.abort();
}
if (!this.silent)
  console.error('glob error', er);
break
}

return cb()
};

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
var self = this;
this._readdir(abs, inGlobStar, function (er, entries) {
self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
});
};


Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
//console.error('pgs2', prefix, remain[0], entries)

// no entries means not a dir, so it can never have matches
// foo.txt/** doesn't match foo.txt
if (!entries)
return cb()

// test without the globstar, and with every child both below
// and replacing the globstar.
var remainWithoutGlobStar = remain.slice(1);
var gspref = prefix ? [ prefix ] : [];
var noGlobStar = gspref.concat(remainWithoutGlobStar);

// the noGlobStar pattern exits the inGlobStar state
this._process(noGlobStar, index, false, cb);

var isSym = this.symlinks[abs];
var len = entries.length;

// If it's a symlink, and we're in a globstar, then stop
if (isSym && inGlobStar)
return cb()

for (var i = 0; i < len; i++) {
var e = entries[i];
if (e.charAt(0) === '.' && !this.dot)
continue

// these two cases enter the inGlobStar state
var instead = gspref.concat(entries[i], remainWithoutGlobStar);
this._process(instead, index, true, cb);

var below = gspref.concat(entries[i], remain);
this._process(below, index, true, cb);
}

cb();
};

Glob.prototype._processSimple = function (prefix, index, cb) {
// XXX review this.  Shouldn't it be doing the mounting etc
// before doing stat?  kinda weird?
var self = this;
this._stat(prefix, function (er, exists) {
self._processSimple2(prefix, index, er, exists, cb);
});
};
Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

//console.error('ps2', prefix, exists)

if (!this.matches[index])
this.matches[index] = Object.create(null);

// If it doesn't exist, then just mark the lack of results
if (!exists)
return cb()

if (prefix && pathIsAbsolute(prefix) && !this.nomount) {
var trail = /[\/\\]$/.test(prefix);
if (prefix.charAt(0) === '/') {
prefix = path__default['default'].join(this.root, prefix);
} else {
prefix = path__default['default'].resolve(this.root, prefix);
if (trail)
  prefix += '/';
}
}

if (process.platform === 'win32')
prefix = prefix.replace(/\\/g, '/');

// Mark this as a match
this._emitMatch(index, prefix);
cb();
};

// Returns either 'DIR', 'FILE', or false
Glob.prototype._stat = function (f, cb) {
var abs = this._makeAbs(f);
var needDir = f.slice(-1) === '/';

if (f.length > this.maxLength)
return cb()

if (!this.stat && ownProp$2(this.cache, abs)) {
var c = this.cache[abs];

if (Array.isArray(c))
c = 'DIR';

// It exists, but maybe not how we need it
if (!needDir || c === 'DIR')
return cb(null, c)

if (needDir && c === 'FILE')
return cb()

// otherwise we have to stat, because maybe c=true
// if we know it exists, but not what it is.
}
var stat = this.statCache[abs];
if (stat !== undefined) {
if (stat === false)
return cb(null, stat)
else {
var type = stat.isDirectory() ? 'DIR' : 'FILE';
if (needDir && type === 'FILE')
  return cb()
else
  return cb(null, type, stat)
}
}

var self = this;
var statcb = inflight_1('stat\0' + abs, lstatcb_);
if (statcb)
fs__default['default'].lstat(abs, statcb);

function lstatcb_ (er, lstat) {
if (lstat && lstat.isSymbolicLink()) {
// If it's a symlink, then treat it as the target, unless
// the target does not exist, then treat it as a file.
return fs__default['default'].stat(abs, function (er, stat) {
  if (er)
    self._stat2(f, abs, null, lstat, cb);
  else
    self._stat2(f, abs, er, stat, cb);
})
} else {
self._stat2(f, abs, er, lstat, cb);
}
}
};

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
this.statCache[abs] = false;
return cb()
}

var needDir = f.slice(-1) === '/';
this.statCache[abs] = stat;

if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
return cb(null, false, stat)

var c = true;
if (stat)
c = stat.isDirectory() ? 'DIR' : 'FILE';
this.cache[abs] = this.cache[abs] || c;

if (needDir && c === 'FILE')
return cb()

return cb(null, c, stat)
};

let glob$1 = undefined;
try {
glob$1 = glob_1;
} catch (_err) {
// treat glob as optional.
}

const defaultGlobOpts = {
nosort: true,
silent: true
};

// for EMFILE handling
let timeout = 0;

const isWindows$1 = (process.platform === "win32");

const defaults = options => {
const methods = [
'unlink',
'chmod',
'stat',
'lstat',
'rmdir',
'readdir'
];
methods.forEach(m => {
options[m] = options[m] || fs__default['default'][m];
m = m + 'Sync';
options[m] = options[m] || fs__default['default'][m];
});

options.maxBusyTries = options.maxBusyTries || 3;
options.emfileWait = options.emfileWait || 1000;
if (options.glob === false) {
options.disableGlob = true;
}
if (options.disableGlob !== true && glob$1 === undefined) {
throw Error('glob dependency not found, set `options.disableGlob = true` if intentional')
}
options.disableGlob = options.disableGlob || false;
options.glob = options.glob || defaultGlobOpts;
};

const rimraf = (p, options, cb) => {
if (typeof options === 'function') {
cb = options;
options = {};
}

assert__default['default'](p, 'rimraf: missing path');
assert__default['default'].equal(typeof p, 'string', 'rimraf: path should be a string');
assert__default['default'].equal(typeof cb, 'function', 'rimraf: callback function required');
assert__default['default'](options, 'rimraf: invalid options argument provided');
assert__default['default'].equal(typeof options, 'object', 'rimraf: options should be object');

defaults(options);

let busyTries = 0;
let errState = null;
let n = 0;

const next = (er) => {
errState = errState || er;
if (--n === 0)
cb(errState);
};

const afterGlob = (er, results) => {
if (er)
return cb(er)

n = results.length;
if (n === 0)
return cb()

results.forEach(p => {
const CB = (er) => {
  if (er) {
    if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") &&
        busyTries < options.maxBusyTries) {
      busyTries ++;
      // try again, with the same exact callback as this one.
      return setTimeout(() => rimraf_(p, options, CB), busyTries * 100)
    }

    // this one won't happen if graceful-fs is used.
    if (er.code === "EMFILE" && timeout < options.emfileWait) {
      return setTimeout(() => rimraf_(p, options, CB), timeout ++)
    }

    // already gone
    if (er.code === "ENOENT") er = null;
  }

  timeout = 0;
  next(er);
};
rimraf_(p, options, CB);
});
};

if (options.disableGlob || !glob$1.hasMagic(p))
return afterGlob(null, [p])

options.lstat(p, (er, stat) => {
if (!er)
return afterGlob(null, [p])

glob$1(p, options.glob, afterGlob);
});

};

// Two possible strategies.
// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
//
// Both result in an extra syscall when you guess wrong.  However, there
// are likely far more normal files in the world than directories.  This
// is based on the assumption that a the average number of files per
// directory is >= 1.
//
// If anyone ever complains about this, then I guess the strategy could
// be made configurable somehow.  But until then, YAGNI.
const rimraf_ = (p, options, cb) => {
assert__default['default'](p);
assert__default['default'](options);
assert__default['default'](typeof cb === 'function');

// sunos lets the root user unlink directories, which is... weird.
// so we have to lstat here and make sure it's not a dir.
options.lstat(p, (er, st) => {
if (er && er.code === "ENOENT")
return cb(null)

// Windows can EPERM on stat.  Life is suffering.
if (er && er.code === "EPERM" && isWindows$1)
fixWinEPERM(p, options, er, cb);

if (st && st.isDirectory())
return rmdir(p, options, er, cb)

options.unlink(p, er => {
if (er) {
  if (er.code === "ENOENT")
    return cb(null)
  if (er.code === "EPERM")
    return (isWindows$1)
      ? fixWinEPERM(p, options, er, cb)
      : rmdir(p, options, er, cb)
  if (er.code === "EISDIR")
    return rmdir(p, options, er, cb)
}
return cb(er)
});
});
};

const fixWinEPERM = (p, options, er, cb) => {
assert__default['default'](p);
assert__default['default'](options);
assert__default['default'](typeof cb === 'function');

options.chmod(p, 0o666, er2 => {
if (er2)
cb(er2.code === "ENOENT" ? null : er);
else
options.stat(p, (er3, stats) => {
  if (er3)
    cb(er3.code === "ENOENT" ? null : er);
  else if (stats.isDirectory())
    rmdir(p, options, er, cb);
  else
    options.unlink(p, cb);
});
});
};

const fixWinEPERMSync = (p, options, er) => {
assert__default['default'](p);
assert__default['default'](options);

try {
options.chmodSync(p, 0o666);
} catch (er2) {
if (er2.code === "ENOENT")
return
else
throw er
}

let stats;
try {
stats = options.statSync(p);
} catch (er3) {
if (er3.code === "ENOENT")
return
else
throw er
}

if (stats.isDirectory())
rmdirSync(p, options, er);
else
options.unlinkSync(p);
};

const rmdir = (p, options, originalEr, cb) => {
assert__default['default'](p);
assert__default['default'](options);
assert__default['default'](typeof cb === 'function');

// try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
// if we guessed wrong, and it's not a directory, then
// raise the original error.
options.rmdir(p, er => {
if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM"))
rmkids(p, options, cb);
else if (er && er.code === "ENOTDIR")
cb(originalEr);
else
cb(er);
});
};

const rmkids = (p, options, cb) => {
assert__default['default'](p);
assert__default['default'](options);
assert__default['default'](typeof cb === 'function');

options.readdir(p, (er, files) => {
if (er)
return cb(er)
let n = files.length;
if (n === 0)
return options.rmdir(p, cb)
let errState;
files.forEach(f => {
rimraf(path__default['default'].join(p, f), options, er => {
  if (errState)
    return
  if (er)
    return cb(errState = er)
  if (--n === 0)
    options.rmdir(p, cb);
});
});
});
};

// this looks simpler, and is strictly *faster*, but will
// tie up the JavaScript thread and fail on excessively
// deep directory trees.
const rimrafSync = (p, options) => {
options = options || {};
defaults(options);

assert__default['default'](p, 'rimraf: missing path');
assert__default['default'].equal(typeof p, 'string', 'rimraf: path should be a string');
assert__default['default'](options, 'rimraf: missing options');
assert__default['default'].equal(typeof options, 'object', 'rimraf: options should be object');

let results;

if (options.disableGlob || !glob$1.hasMagic(p)) {
results = [p];
} else {
try {
options.lstatSync(p);
results = [p];
} catch (er) {
results = glob$1.sync(p, options.glob);
}
}

if (!results.length)
return

for (let i = 0; i < results.length; i++) {
const p = results[i];

let st;
try {
st = options.lstatSync(p);
} catch (er) {
if (er.code === "ENOENT")
  return

// Windows can EPERM on stat.  Life is suffering.
if (er.code === "EPERM" && isWindows$1)
  fixWinEPERMSync(p, options, er);
}

try {
// sunos lets the root user unlink directories, which is... weird.
if (st && st.isDirectory())
  rmdirSync(p, options, null);
else
  options.unlinkSync(p);
} catch (er) {
if (er.code === "ENOENT")
  return
if (er.code === "EPERM")
  return isWindows$1 ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er)
if (er.code !== "EISDIR")
  throw er

rmdirSync(p, options, er);
}
}
};

const rmdirSync = (p, options, originalEr) => {
assert__default['default'](p);
assert__default['default'](options);

try {
options.rmdirSync(p);
} catch (er) {
if (er.code === "ENOENT")
return
if (er.code === "ENOTDIR")
throw originalEr
if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")
rmkidsSync(p, options);
}
};

const rmkidsSync = (p, options) => {
assert__default['default'](p);
assert__default['default'](options);
options.readdirSync(p).forEach(f => rimrafSync(path__default['default'].join(p, f), options));

// We only end up here once we got ENOTEMPTY at least once, and
// at this point, we are guaranteed to have removed all the kids.
// So, we know that it won't be ENOENT or ENOTDIR or anything else.
// try really hard to delete stuff on windows, because it has a
// PROFOUNDLY annoying habit of not closing handles promptly when
// files are deleted, resulting in spurious ENOTEMPTY errors.
const retries = isWindows$1 ? 100 : 1;
let i = 0;
do {
let threw = true;
try {
const ret = options.rmdirSync(p, options);
threw = false;
return ret
} finally {
if (++i < retries && threw)
  continue
}
} while (true)
};

var rimraf_1 = rimraf;
rimraf.sync = rimrafSync;

/*!
* Tmp
*
* Copyright (c) 2011-2017 KARASZI Istvan <github@spam.raszi.hu>
*
* MIT Licensed
*/

var tmp = createCommonjsModule(function (module) {
/*
* Module dependencies.
*/




const _c = { fs: fs__default['default'].constants, os: os__default['default'].constants };


/*
* The working inner variables.
*/
const
// the random characters to choose from
RANDOM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',

TEMPLATE_PATTERN = /XXXXXX/,

DEFAULT_TRIES = 3,

CREATE_FLAGS = ( _c.fs.O_CREAT) | ( _c.fs.O_EXCL) | ( _c.fs.O_RDWR),

// constants are off on the windows platform and will not match the actual errno codes
IS_WIN32 = os__default['default'].platform() === 'win32',
EBADF =  _c.os.errno.EBADF,
ENOENT =  _c.os.errno.ENOENT,

DIR_MODE = 0o700 /* 448 */,
FILE_MODE = 0o600 /* 384 */,

EXIT = 'exit',

// this will hold the objects need to be removed on exit
_removeObjects = [],

// API change in fs.rmdirSync leads to error when passing in a second parameter, e.g. the callback
FN_RMDIR_SYNC = fs__default['default'].rmdirSync.bind(fs__default['default']),
FN_RIMRAF_SYNC = rimraf_1.sync;

let
_gracefulCleanup = false;

/**
* Gets a temporary file name.
*
* @param {(Options|tmpNameCallback)} options options or callback
* @param {?tmpNameCallback} callback the callback function
*/
function tmpName(options, callback) {
const
args = _parseArguments(options, callback),
opts = args[0],
cb = args[1];

try {
_assertAndSanitizeOptions(opts);
} catch (err) {
return cb(err);
}

let tries = opts.tries;
(function _getUniqueName() {
try {
const name = _generateTmpName(opts);

// check whether the path exists then retry if needed
fs__default['default'].stat(name, function (err) {
  /* istanbul ignore else */
  if (!err) {
    /* istanbul ignore else */
    if (tries-- > 0) return _getUniqueName();

    return cb(new Error('Could not get a unique tmp filename, max tries reached ' + name));
  }

  cb(null, name);
});
} catch (err) {
cb(err);
}
}());
}

/**
* Synchronous version of tmpName.
*
* @param {Object} options
* @returns {string} the generated random name
* @throws {Error} if the options are invalid or could not generate a filename
*/
function tmpNameSync(options) {
const
args = _parseArguments(options),
opts = args[0];

_assertAndSanitizeOptions(opts);

let tries = opts.tries;
do {
const name = _generateTmpName(opts);
try {
fs__default['default'].statSync(name);
} catch (e) {
return name;
}
} while (tries-- > 0);

throw new Error('Could not get a unique tmp filename, max tries reached');
}

/**
* Creates and opens a temporary file.
*
* @param {(Options|null|undefined|fileCallback)} options the config options or the callback function or null or undefined
* @param {?fileCallback} callback
*/
function file(options, callback) {
const
args = _parseArguments(options, callback),
opts = args[0],
cb = args[1];

// gets a temporary filename
tmpName(opts, function _tmpNameCreated(err, name) {
/* istanbul ignore else */
if (err) return cb(err);

// create and open the file
fs__default['default'].open(name, CREATE_FLAGS, opts.mode || FILE_MODE, function _fileCreated(err, fd) {
/* istanbu ignore else */
if (err) return cb(err);

if (opts.discardDescriptor) {
  return fs__default['default'].close(fd, function _discardCallback(possibleErr) {
    // the chance of getting an error on close here is rather low and might occur in the most edgiest cases only
    return cb(possibleErr, name, undefined, _prepareTmpFileRemoveCallback(name, -1, opts, false));
  });
} else {
  // detachDescriptor passes the descriptor whereas discardDescriptor closes it, either way, we no longer care
  // about the descriptor
  const discardOrDetachDescriptor = opts.discardDescriptor || opts.detachDescriptor;
  cb(null, name, fd, _prepareTmpFileRemoveCallback(name, discardOrDetachDescriptor ? -1 : fd, opts, false));
}
});
});
}

/**
* Synchronous version of file.
*
* @param {Options} options
* @returns {FileSyncObject} object consists of name, fd and removeCallback
* @throws {Error} if cannot create a file
*/
function fileSync(options) {
const
args = _parseArguments(options),
opts = args[0];

const discardOrDetachDescriptor = opts.discardDescriptor || opts.detachDescriptor;
const name = tmpNameSync(opts);
var fd = fs__default['default'].openSync(name, CREATE_FLAGS, opts.mode || FILE_MODE);
/* istanbul ignore else */
if (opts.discardDescriptor) {
fs__default['default'].closeSync(fd);
fd = undefined;
}

return {
name: name,
fd: fd,
removeCallback: _prepareTmpFileRemoveCallback(name, discardOrDetachDescriptor ? -1 : fd, opts, true)
};
}

/**
* Creates a temporary directory.
*
* @param {(Options|dirCallback)} options the options or the callback function
* @param {?dirCallback} callback
*/
function dir(options, callback) {
const
args = _parseArguments(options, callback),
opts = args[0],
cb = args[1];

// gets a temporary filename
tmpName(opts, function _tmpNameCreated(err, name) {
/* istanbul ignore else */
if (err) return cb(err);

// create the directory
fs__default['default'].mkdir(name, opts.mode || DIR_MODE, function _dirCreated(err) {
/* istanbul ignore else */
if (err) return cb(err);

cb(null, name, _prepareTmpDirRemoveCallback(name, opts, false));
});
});
}

/**
* Synchronous version of dir.
*
* @param {Options} options
* @returns {DirSyncObject} object consists of name and removeCallback
* @throws {Error} if it cannot create a directory
*/
function dirSync(options) {
const
args = _parseArguments(options),
opts = args[0];

const name = tmpNameSync(opts);
fs__default['default'].mkdirSync(name, opts.mode || DIR_MODE);

return {
name: name,
removeCallback: _prepareTmpDirRemoveCallback(name, opts, true)
};
}

/**
* Removes files asynchronously.
*
* @param {Object} fdPath
* @param {Function} next
* @private
*/
function _removeFileAsync(fdPath, next) {
const _handler = function (err) {
if (err && !_isENOENT(err)) {
// reraise any unanticipated error
return next(err);
}
next();
};

if (0 <= fdPath[0])
fs__default['default'].close(fdPath[0], function () {
fs__default['default'].unlink(fdPath[1], _handler);
});
else fs__default['default'].unlink(fdPath[1], _handler);
}

/**
* Removes files synchronously.
*
* @param {Object} fdPath
* @private
*/
function _removeFileSync(fdPath) {
let rethrownException = null;
try {
if (0 <= fdPath[0]) fs__default['default'].closeSync(fdPath[0]);
} catch (e) {
// reraise any unanticipated error
if (!_isEBADF(e) && !_isENOENT(e)) throw e;
} finally {
try {
fs__default['default'].unlinkSync(fdPath[1]);
}
catch (e) {
// reraise any unanticipated error
if (!_isENOENT(e)) rethrownException = e;
}
}
if (rethrownException !== null) {
throw rethrownException;
}
}

/**
* Prepares the callback for removal of the temporary file.
*
* Returns either a sync callback or a async callback depending on whether
* fileSync or file was called, which is expressed by the sync parameter.
*
* @param {string} name the path of the file
* @param {number} fd file descriptor
* @param {Object} opts
* @param {boolean} sync
* @returns {fileCallback | fileCallbackSync}
* @private
*/
function _prepareTmpFileRemoveCallback(name, fd, opts, sync) {
const removeCallbackSync = _prepareRemoveCallback(_removeFileSync, [fd, name], sync);
const removeCallback = _prepareRemoveCallback(_removeFileAsync, [fd, name], sync, removeCallbackSync);

if (!opts.keep) _removeObjects.unshift(removeCallbackSync);

return sync ? removeCallbackSync : removeCallback;
}

/**
* Prepares the callback for removal of the temporary directory.
*
* Returns either a sync callback or a async callback depending on whether
* tmpFileSync or tmpFile was called, which is expressed by the sync parameter.
*
* @param {string} name
* @param {Object} opts
* @param {boolean} sync
* @returns {Function} the callback
* @private
*/
function _prepareTmpDirRemoveCallback(name, opts, sync) {
const removeFunction = opts.unsafeCleanup ? rimraf_1 : fs__default['default'].rmdir.bind(fs__default['default']);
const removeFunctionSync = opts.unsafeCleanup ? FN_RIMRAF_SYNC : FN_RMDIR_SYNC;
const removeCallbackSync = _prepareRemoveCallback(removeFunctionSync, name, sync);
const removeCallback = _prepareRemoveCallback(removeFunction, name, sync, removeCallbackSync);
if (!opts.keep) _removeObjects.unshift(removeCallbackSync);

return sync ? removeCallbackSync : removeCallback;
}

/**
* Creates a guarded function wrapping the removeFunction call.
*
* The cleanup callback is save to be called multiple times.
* Subsequent invocations will be ignored.
*
* @param {Function} removeFunction
* @param {string} fileOrDirName
* @param {boolean} sync
* @param {cleanupCallbackSync?} cleanupCallbackSync
* @returns {cleanupCallback | cleanupCallbackSync}
* @private
*/
function _prepareRemoveCallback(removeFunction, fileOrDirName, sync, cleanupCallbackSync) {
let called = false;

// if sync is true, the next parameter will be ignored
return function _cleanupCallback(next) {

/* istanbul ignore else */
if (!called) {
// remove cleanupCallback from cache
const toRemove = cleanupCallbackSync || _cleanupCallback;
const index = _removeObjects.indexOf(toRemove);
/* istanbul ignore else */
if (index >= 0) _removeObjects.splice(index, 1);

called = true;
if (sync || removeFunction === FN_RMDIR_SYNC || removeFunction === FN_RIMRAF_SYNC) {
  return removeFunction(fileOrDirName);
} else {
  return removeFunction(fileOrDirName, next || function() {});
}
}
};
}

/**
* The garbage collector.
*
* @private
*/
function _garbageCollector() {
/* istanbul ignore else */
if (!_gracefulCleanup) return;

// the function being called removes itself from _removeObjects,
// loop until _removeObjects is empty
while (_removeObjects.length) {
try {
_removeObjects[0]();
} catch (e) {
// already removed?
}
}
}

/**
* Random name generator based on crypto.
* Adapted from http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
*
* @param {number} howMany
* @returns {string} the generated random name
* @private
*/
function _randomChars(howMany) {
let
value = [],
rnd = null;

// make sure that we do not fail because we ran out of entropy
try {
rnd = crypto__default['default'].randomBytes(howMany);
} catch (e) {
rnd = crypto__default['default'].pseudoRandomBytes(howMany);
}

for (var i = 0; i < howMany; i++) {
value.push(RANDOM_CHARS[rnd[i] % RANDOM_CHARS.length]);
}

return value.join('');
}

/**
* Helper which determines whether a string s is blank, that is undefined, or empty or null.
*
* @private
* @param {string} s
* @returns {Boolean} true whether the string s is blank, false otherwise
*/
function _isBlank(s) {
return s === null || _isUndefined(s) || !s.trim();
}

/**
* Checks whether the `obj` parameter is defined or not.
*
* @param {Object} obj
* @returns {boolean} true if the object is undefined
* @private
*/
function _isUndefined(obj) {
return typeof obj === 'undefined';
}

/**
* Parses the function arguments.
*
* This function helps to have optional arguments.
*
* @param {(Options|null|undefined|Function)} options
* @param {?Function} callback
* @returns {Array} parsed arguments
* @private
*/
function _parseArguments(options, callback) {
/* istanbul ignore else */
if (typeof options === 'function') {
return [{}, options];
}

/* istanbul ignore else */
if (_isUndefined(options)) {
return [{}, callback];
}

// copy options so we do not leak the changes we make internally
const actualOptions = {};
for (const key of Object.getOwnPropertyNames(options)) {
actualOptions[key] = options[key];
}

return [actualOptions, callback];
}

/**
* Generates a new temporary name.
*
* @param {Object} opts
* @returns {string} the new random name according to opts
* @private
*/
function _generateTmpName(opts) {

const tmpDir = opts.tmpdir;

/* istanbul ignore else */
if (!_isUndefined(opts.name))
return path__default['default'].join(tmpDir, opts.dir, opts.name);

/* istanbul ignore else */
if (!_isUndefined(opts.template))
return path__default['default'].join(tmpDir, opts.dir, opts.template).replace(TEMPLATE_PATTERN, _randomChars(6));

// prefix and postfix
const name = [
opts.prefix ? opts.prefix : 'tmp',
'-',
process.pid,
'-',
_randomChars(12),
opts.postfix ? '-' + opts.postfix : ''
].join('');

return path__default['default'].join(tmpDir, opts.dir, name);
}

/**
* Asserts whether the specified options are valid, also sanitizes options and provides sane defaults for missing
* options.
*
* @param {Options} options
* @private
*/
function _assertAndSanitizeOptions(options) {

options.tmpdir = _getTmpDir(options);

const tmpDir = options.tmpdir;

/* istanbul ignore else */
if (!_isUndefined(options.name))
_assertIsRelative(options.name, 'name', tmpDir);
/* istanbul ignore else */
if (!_isUndefined(options.dir))
_assertIsRelative(options.dir, 'dir', tmpDir);
/* istanbul ignore else */
if (!_isUndefined(options.template)) {
_assertIsRelative(options.template, 'template', tmpDir);
if (!options.template.match(TEMPLATE_PATTERN))
throw new Error(`Invalid template, found "${options.template}".`);
}
/* istanbul ignore else */
if (!_isUndefined(options.tries) && isNaN(options.tries) || options.tries < 0)
throw new Error(`Invalid tries, found "${options.tries}".`);

// if a name was specified we will try once
options.tries = _isUndefined(options.name) ? options.tries || DEFAULT_TRIES : 1;
options.keep = !!options.keep;
options.detachDescriptor = !!options.detachDescriptor;
options.discardDescriptor = !!options.discardDescriptor;
options.unsafeCleanup = !!options.unsafeCleanup;

// sanitize dir, also keep (multiple) blanks if the user, purportedly sane, requests us to
options.dir = _isUndefined(options.dir) ? '' : path__default['default'].relative(tmpDir, _resolvePath(options.dir, tmpDir));
options.template = _isUndefined(options.template) ? undefined : path__default['default'].relative(tmpDir, _resolvePath(options.template, tmpDir));
// sanitize further if template is relative to options.dir
options.template = _isBlank(options.template) ? undefined : path__default['default'].relative(options.dir, options.template);

// for completeness' sake only, also keep (multiple) blanks if the user, purportedly sane, requests us to
options.name = _isUndefined(options.name) ? undefined : _sanitizeName(options.name);
options.prefix = _isUndefined(options.prefix) ? '' : options.prefix;
options.postfix = _isUndefined(options.postfix) ? '' : options.postfix;
}

/**
* Resolve the specified path name in respect to tmpDir.
*
* The specified name might include relative path components, e.g. ../
* so we need to resolve in order to be sure that is is located inside tmpDir
*
* @param name
* @param tmpDir
* @returns {string}
* @private
*/
function _resolvePath(name, tmpDir) {
const sanitizedName = _sanitizeName(name);
if (sanitizedName.startsWith(tmpDir)) {
return path__default['default'].resolve(sanitizedName);
} else {
return path__default['default'].resolve(path__default['default'].join(tmpDir, sanitizedName));
}
}

/**
* Sanitize the specified path name by removing all quote characters.
*
* @param name
* @returns {string}
* @private
*/
function _sanitizeName(name) {
if (_isBlank(name)) {
return name;
}
return name.replace(/["']/g, '');
}

/**
* Asserts whether specified name is relative to the specified tmpDir.
*
* @param {string} name
* @param {string} option
* @param {string} tmpDir
* @throws {Error}
* @private
*/
function _assertIsRelative(name, option, tmpDir) {
if (option === 'name') {
// assert that name is not absolute and does not contain a path
if (path__default['default'].isAbsolute(name))
throw new Error(`${option} option must not contain an absolute path, found "${name}".`);
// must not fail on valid .<name> or ..<name> or similar such constructs
let basename = path__default['default'].basename(name);
if (basename === '..' || basename === '.' || basename !== name)
throw new Error(`${option} option must not contain a path, found "${name}".`);
}
else { // if (option === 'dir' || option === 'template') {
// assert that dir or template are relative to tmpDir
if (path__default['default'].isAbsolute(name) && !name.startsWith(tmpDir)) {
throw new Error(`${option} option must be relative to "${tmpDir}", found "${name}".`);
}
let resolvedPath = _resolvePath(name, tmpDir);
if (!resolvedPath.startsWith(tmpDir))
throw new Error(`${option} option must be relative to "${tmpDir}", found "${resolvedPath}".`);
}
}

/**
* Helper for testing against EBADF to compensate changes made to Node 7.x under Windows.
*
* @private
*/
function _isEBADF(error) {
return _isExpectedError(error, -EBADF, 'EBADF');
}

/**
* Helper for testing against ENOENT to compensate changes made to Node 7.x under Windows.
*
* @private
*/
function _isENOENT(error) {
return _isExpectedError(error, -ENOENT, 'ENOENT');
}

/**
* Helper to determine whether the expected error code matches the actual code and errno,
* which will differ between the supported node versions.
*
* - Node >= 7.0:
*   error.code {string}
*   error.errno {number} any numerical value will be negated
*
* CAVEAT
*
* On windows, the errno for EBADF is -4083 but os.constants.errno.EBADF is different and we must assume that ENOENT
* is no different here.
*
* @param {SystemError} error
* @param {number} errno
* @param {string} code
* @private
*/
function _isExpectedError(error, errno, code) {
return IS_WIN32 ? error.code === code : error.code === code && error.errno === errno;
}

/**
* Sets the graceful cleanup.
*
* If graceful cleanup is set, tmp will remove all controlled temporary objects on process exit, otherwise the
* temporary objects will remain in place, waiting to be cleaned up on system restart or otherwise scheduled temporary
* object removals.
*/
function setGracefulCleanup() {
_gracefulCleanup = true;
}

/**
* Returns the currently configured tmp dir from os.tmpdir().
*
* @private
* @param {?Options} options
* @returns {string} the currently configured tmp dir
*/
function _getTmpDir(options) {
return path__default['default'].resolve(_sanitizeName(options && options.tmpdir || os__default['default'].tmpdir()));
}

// Install process exit listener
process.addListener(EXIT, _garbageCollector);

/**
* Configuration options.
*
* @typedef {Object} Options
* @property {?boolean} keep the temporary object (file or dir) will not be garbage collected
* @property {?number} tries the number of tries before give up the name generation
* @property (?int) mode the access mode, defaults are 0o700 for directories and 0o600 for files
* @property {?string} template the "mkstemp" like filename template
* @property {?string} name fixed name relative to tmpdir or the specified dir option
* @property {?string} dir tmp directory relative to the root tmp directory in use
* @property {?string} prefix prefix for the generated name
* @property {?string} postfix postfix for the generated name
* @property {?string} tmpdir the root tmp directory which overrides the os tmpdir
* @property {?boolean} unsafeCleanup recursively removes the created temporary directory, even when it's not empty
* @property {?boolean} detachDescriptor detaches the file descriptor, caller is responsible for closing the file, tmp will no longer try closing the file during garbage collection
* @property {?boolean} discardDescriptor discards the file descriptor (closes file, fd is -1), tmp will no longer try closing the file during garbage collection
*/

/**
* @typedef {Object} FileSyncObject
* @property {string} name the name of the file
* @property {string} fd the file descriptor or -1 if the fd has been discarded
* @property {fileCallback} removeCallback the callback function to remove the file
*/

/**
* @typedef {Object} DirSyncObject
* @property {string} name the name of the directory
* @property {fileCallback} removeCallback the callback function to remove the directory
*/

/**
* @callback tmpNameCallback
* @param {?Error} err the error object if anything goes wrong
* @param {string} name the temporary file name
*/

/**
* @callback fileCallback
* @param {?Error} err the error object if anything goes wrong
* @param {string} name the temporary file name
* @param {number} fd the file descriptor or -1 if the fd had been discarded
* @param {cleanupCallback} fn the cleanup callback function
*/

/**
* @callback fileCallbackSync
* @param {?Error} err the error object if anything goes wrong
* @param {string} name the temporary file name
* @param {number} fd the file descriptor or -1 if the fd had been discarded
* @param {cleanupCallbackSync} fn the cleanup callback function
*/

/**
* @callback dirCallback
* @param {?Error} err the error object if anything goes wrong
* @param {string} name the temporary file name
* @param {cleanupCallback} fn the cleanup callback function
*/

/**
* @callback dirCallbackSync
* @param {?Error} err the error object if anything goes wrong
* @param {string} name the temporary file name
* @param {cleanupCallbackSync} fn the cleanup callback function
*/

/**
* Removes the temporary created file or directory.
*
* @callback cleanupCallback
* @param {simpleCallback} [next] function to call whenever the tmp object needs to be removed
*/

/**
* Removes the temporary created file or directory.
*
* @callback cleanupCallbackSync
*/

/**
* Callback function for function composition.
* @see {@link https://github.com/raszi/node-tmp/issues/57|raszi/node-tmp#57}
*
* @callback simpleCallback
*/

// exporting all the needed methods

// evaluate _getTmpDir() lazily, mainly for simplifying testing but it also will
// allow users to reconfigure the temporary directory
Object.defineProperty(module.exports, 'tmpdir', {
enumerable: true,
configurable: false,
get: function () {
return _getTmpDir();
}
});

module.exports.dir = dir;
module.exports.dirSync = dirSync;

module.exports.file = file;
module.exports.fileSync = fileSync;

module.exports.tmpName = tmpName;
module.exports.tmpNameSync = tmpNameSync;

module.exports.setGracefulCleanup = setGracefulCleanup;
});

function isNothing(subject) {
return (typeof subject === 'undefined') || (subject === null);
}


function isObject(subject) {
return (typeof subject === 'object') && (subject !== null);
}


function toArray(sequence) {
if (Array.isArray(sequence)) return sequence;
else if (isNothing(sequence)) return [];

return [ sequence ];
}


function extend$1(target, source) {
var index, length, key, sourceKeys;

if (source) {
sourceKeys = Object.keys(source);

for (index = 0, length = sourceKeys.length; index < length; index += 1) {
key = sourceKeys[index];
target[key] = source[key];
}
}

return target;
}


function repeat(string, count) {
var result = '', cycle;

for (cycle = 0; cycle < count; cycle += 1) {
result += string;
}

return result;
}


function isNegativeZero(number) {
return (number === 0) && (Number.NEGATIVE_INFINITY === 1 / number);
}


var isNothing_1      = isNothing;
var isObject_1       = isObject;
var toArray_1        = toArray;
var repeat_1         = repeat;
var isNegativeZero_1 = isNegativeZero;
var extend_1         = extend$1;

var common$3 = {
isNothing: isNothing_1,
isObject: isObject_1,
toArray: toArray_1,
repeat: repeat_1,
isNegativeZero: isNegativeZero_1,
extend: extend_1
};

// YAML error class. http://stackoverflow.com/questions/8458984

function YAMLException(reason, mark) {
// Super constructor
Error.call(this);

this.name = 'YAMLException';
this.reason = reason;
this.mark = mark;
this.message = (this.reason || '(unknown reason)') + (this.mark ? ' ' + this.mark.toString() : '');

// Include stack trace in error object
if (Error.captureStackTrace) {
// Chrome and NodeJS
Error.captureStackTrace(this, this.constructor);
} else {
// FF, IE 10+ and Safari 6+. Fallback for others
this.stack = (new Error()).stack || '';
}
}


// Inherit from Error
YAMLException.prototype = Object.create(Error.prototype);
YAMLException.prototype.constructor = YAMLException;


YAMLException.prototype.toString = function toString(compact) {
var result = this.name + ': ';

result += this.reason || '(unknown reason)';

if (!compact && this.mark) {
result += ' ' + this.mark.toString();
}

return result;
};


var exception = YAMLException;

function Mark(name, buffer, position, line, column) {
this.name     = name;
this.buffer   = buffer;
this.position = position;
this.line     = line;
this.column   = column;
}


Mark.prototype.getSnippet = function getSnippet(indent, maxLength) {
var head, start, tail, end, snippet;

if (!this.buffer) return null;

indent = indent || 4;
maxLength = maxLength || 75;

head = '';
start = this.position;

while (start > 0 && '\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(start - 1)) === -1) {
start -= 1;
if (this.position - start > (maxLength / 2 - 1)) {
head = ' ... ';
start += 5;
break;
}
}

tail = '';
end = this.position;

while (end < this.buffer.length && '\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(end)) === -1) {
end += 1;
if (end - this.position > (maxLength / 2 - 1)) {
tail = ' ... ';
end -= 5;
break;
}
}

snippet = this.buffer.slice(start, end);

return common$3.repeat(' ', indent) + head + snippet + tail + '\n' +
   common$3.repeat(' ', indent + this.position - start + head.length) + '^';
};


Mark.prototype.toString = function toString(compact) {
var snippet, where = '';

if (this.name) {
where += 'in "' + this.name + '" ';
}

where += 'at line ' + (this.line + 1) + ', column ' + (this.column + 1);

if (!compact) {
snippet = this.getSnippet();

if (snippet) {
where += ':\n' + snippet;
}
}

return where;
};


var mark$1 = Mark;

var TYPE_CONSTRUCTOR_OPTIONS = [
'kind',
'resolve',
'construct',
'instanceOf',
'predicate',
'represent',
'defaultStyle',
'styleAliases'
];

var YAML_NODE_KINDS = [
'scalar',
'sequence',
'mapping'
];

function compileStyleAliases(map) {
var result = {};

if (map !== null) {
Object.keys(map).forEach(function (style) {
map[style].forEach(function (alias) {
  result[String(alias)] = style;
});
});
}

return result;
}

function Type(tag, options) {
options = options || {};

Object.keys(options).forEach(function (name) {
if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
}
});

// TODO: Add tag format check.
this.tag          = tag;
this.kind         = options['kind']         || null;
this.resolve      = options['resolve']      || function () { return true; };
this.construct    = options['construct']    || function (data) { return data; };
this.instanceOf   = options['instanceOf']   || null;
this.predicate    = options['predicate']    || null;
this.represent    = options['represent']    || null;
this.defaultStyle = options['defaultStyle'] || null;
this.styleAliases = compileStyleAliases(options['styleAliases'] || null);

if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
}
}

var type = Type;

/*eslint-disable max-len*/






function compileList(schema, name, result) {
var exclude = [];

schema.include.forEach(function (includedSchema) {
result = compileList(includedSchema, name, result);
});

schema[name].forEach(function (currentType) {
result.forEach(function (previousType, previousIndex) {
if (previousType.tag === currentType.tag && previousType.kind === currentType.kind) {
  exclude.push(previousIndex);
}
});

result.push(currentType);
});

return result.filter(function (type, index) {
return exclude.indexOf(index) === -1;
});
}


function compileMap(/* lists... */) {
var result = {
  scalar: {},
  sequence: {},
  mapping: {},
  fallback: {}
}, index, length;

function collectType(type) {
result[type.kind][type.tag] = result['fallback'][type.tag] = type;
}

for (index = 0, length = arguments.length; index < length; index += 1) {
arguments[index].forEach(collectType);
}
return result;
}


function Schema(definition) {
this.include  = definition.include  || [];
this.implicit = definition.implicit || [];
this.explicit = definition.explicit || [];

this.implicit.forEach(function (type) {
if (type.loadKind && type.loadKind !== 'scalar') {
throw new exception('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
}
});

this.compiledImplicit = compileList(this, 'implicit', []);
this.compiledExplicit = compileList(this, 'explicit', []);
this.compiledTypeMap  = compileMap(this.compiledImplicit, this.compiledExplicit);
}


Schema.DEFAULT = null;


Schema.create = function createSchema() {
var schemas, types;

switch (arguments.length) {
case 1:
schemas = Schema.DEFAULT;
types = arguments[0];
break;

case 2:
schemas = arguments[0];
types = arguments[1];
break;

default:
throw new exception('Wrong number of arguments for Schema.create function');
}

schemas = common$3.toArray(schemas);
types = common$3.toArray(types);

if (!schemas.every(function (schema) { return schema instanceof Schema; })) {
throw new exception('Specified list of super schemas (or a single Schema object) contains a non-Schema object.');
}

if (!types.every(function (type$1) { return type$1 instanceof type; })) {
throw new exception('Specified list of YAML types (or a single Type object) contains a non-Type object.');
}

return new Schema({
include: schemas,
explicit: types
});
};


var schema = Schema;

var str = new type('tag:yaml.org,2002:str', {
kind: 'scalar',
construct: function (data) { return data !== null ? data : ''; }
});

var seq = new type('tag:yaml.org,2002:seq', {
kind: 'sequence',
construct: function (data) { return data !== null ? data : []; }
});

var map = new type('tag:yaml.org,2002:map', {
kind: 'mapping',
construct: function (data) { return data !== null ? data : {}; }
});

var failsafe = new schema({
explicit: [
str,
seq,
map
]
});

function resolveYamlNull(data) {
if (data === null) return true;

var max = data.length;

return (max === 1 && data === '~') ||
   (max === 4 && (data === 'null' || data === 'Null' || data === 'NULL'));
}

function constructYamlNull() {
return null;
}

function isNull(object) {
return object === null;
}

var _null = new type('tag:yaml.org,2002:null', {
kind: 'scalar',
resolve: resolveYamlNull,
construct: constructYamlNull,
predicate: isNull,
represent: {
canonical: function () { return '~';    },
lowercase: function () { return 'null'; },
uppercase: function () { return 'NULL'; },
camelcase: function () { return 'Null'; }
},
defaultStyle: 'lowercase'
});

function resolveYamlBoolean(data) {
if (data === null) return false;

var max = data.length;

return (max === 4 && (data === 'true' || data === 'True' || data === 'TRUE')) ||
   (max === 5 && (data === 'false' || data === 'False' || data === 'FALSE'));
}

function constructYamlBoolean(data) {
return data === 'true' ||
   data === 'True' ||
   data === 'TRUE';
}

function isBoolean(object) {
return Object.prototype.toString.call(object) === '[object Boolean]';
}

var bool = new type('tag:yaml.org,2002:bool', {
kind: 'scalar',
resolve: resolveYamlBoolean,
construct: constructYamlBoolean,
predicate: isBoolean,
represent: {
lowercase: function (object) { return object ? 'true' : 'false'; },
uppercase: function (object) { return object ? 'TRUE' : 'FALSE'; },
camelcase: function (object) { return object ? 'True' : 'False'; }
},
defaultStyle: 'lowercase'
});

function isHexCode(c) {
return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) ||
   ((0x41/* A */ <= c) && (c <= 0x46/* F */)) ||
   ((0x61/* a */ <= c) && (c <= 0x66/* f */));
}

function isOctCode(c) {
return ((0x30/* 0 */ <= c) && (c <= 0x37/* 7 */));
}

function isDecCode(c) {
return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */));
}

function resolveYamlInteger(data) {
if (data === null) return false;

var max = data.length,
index = 0,
hasDigits = false,
ch;

if (!max) return false;

ch = data[index];

// sign
if (ch === '-' || ch === '+') {
ch = data[++index];
}

if (ch === '0') {
// 0
if (index + 1 === max) return true;
ch = data[++index];

// base 2, base 8, base 16

if (ch === 'b') {
// base 2
index++;

for (; index < max; index++) {
  ch = data[index];
  if (ch === '_') continue;
  if (ch !== '0' && ch !== '1') return false;
  hasDigits = true;
}
return hasDigits && ch !== '_';
}


if (ch === 'x') {
// base 16
index++;

for (; index < max; index++) {
  ch = data[index];
  if (ch === '_') continue;
  if (!isHexCode(data.charCodeAt(index))) return false;
  hasDigits = true;
}
return hasDigits && ch !== '_';
}

// base 8
for (; index < max; index++) {
ch = data[index];
if (ch === '_') continue;
if (!isOctCode(data.charCodeAt(index))) return false;
hasDigits = true;
}
return hasDigits && ch !== '_';
}

// base 10 (except 0) or base 60

// value should not start with `_`;
if (ch === '_') return false;

for (; index < max; index++) {
ch = data[index];
if (ch === '_') continue;
if (ch === ':') break;
if (!isDecCode(data.charCodeAt(index))) {
return false;
}
hasDigits = true;
}

// Should have digits and should not end with `_`
if (!hasDigits || ch === '_') return false;

// if !base60 - done;
if (ch !== ':') return true;

// base60 almost not used, no needs to optimize
return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
}

function constructYamlInteger(data) {
var value = data, sign = 1, ch, base, digits = [];

if (value.indexOf('_') !== -1) {
value = value.replace(/_/g, '');
}

ch = value[0];

if (ch === '-' || ch === '+') {
if (ch === '-') sign = -1;
value = value.slice(1);
ch = value[0];
}

if (value === '0') return 0;

if (ch === '0') {
if (value[1] === 'b') return sign * parseInt(value.slice(2), 2);
if (value[1] === 'x') return sign * parseInt(value, 16);
return sign * parseInt(value, 8);
}

if (value.indexOf(':') !== -1) {
value.split(':').forEach(function (v) {
digits.unshift(parseInt(v, 10));
});

value = 0;
base = 1;

digits.forEach(function (d) {
value += (d * base);
base *= 60;
});

return sign * value;

}

return sign * parseInt(value, 10);
}

function isInteger(object) {
return (Object.prototype.toString.call(object)) === '[object Number]' &&
   (object % 1 === 0 && !common$3.isNegativeZero(object));
}

var int = new type('tag:yaml.org,2002:int', {
kind: 'scalar',
resolve: resolveYamlInteger,
construct: constructYamlInteger,
predicate: isInteger,
represent: {
binary:      function (obj) { return obj >= 0 ? '0b' + obj.toString(2) : '-0b' + obj.toString(2).slice(1); },
octal:       function (obj) { return obj >= 0 ? '0'  + obj.toString(8) : '-0'  + obj.toString(8).slice(1); },
decimal:     function (obj) { return obj.toString(10); },
/* eslint-disable max-len */
hexadecimal: function (obj) { return obj >= 0 ? '0x' + obj.toString(16).toUpperCase() :  '-0x' + obj.toString(16).toUpperCase().slice(1); }
},
defaultStyle: 'decimal',
styleAliases: {
binary:      [ 2,  'bin' ],
octal:       [ 8,  'oct' ],
decimal:     [ 10, 'dec' ],
hexadecimal: [ 16, 'hex' ]
}
});

var YAML_FLOAT_PATTERN = new RegExp(
// 2.5e4, 2.5 and integers
'^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?' +
// .2e4, .2
// special case, seems not from spec
'|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?' +
// 20:59
'|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*' +
// .inf
'|[-+]?\\.(?:inf|Inf|INF)' +
// .nan
'|\\.(?:nan|NaN|NAN))$');

function resolveYamlFloat(data) {
if (data === null) return false;

if (!YAML_FLOAT_PATTERN.test(data) ||
// Quick hack to not allow integers end with `_`
// Probably should update regexp & check speed
data[data.length - 1] === '_') {
return false;
}

return true;
}

function constructYamlFloat(data) {
var value, sign, base, digits;

value  = data.replace(/_/g, '').toLowerCase();
sign   = value[0] === '-' ? -1 : 1;
digits = [];

if ('+-'.indexOf(value[0]) >= 0) {
value = value.slice(1);
}

if (value === '.inf') {
return (sign === 1) ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

} else if (value === '.nan') {
return NaN;

} else if (value.indexOf(':') >= 0) {
value.split(':').forEach(function (v) {
digits.unshift(parseFloat(v, 10));
});

value = 0.0;
base = 1;

digits.forEach(function (d) {
value += d * base;
base *= 60;
});

return sign * value;

}
return sign * parseFloat(value, 10);
}


var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;

function representYamlFloat(object, style) {
var res;

if (isNaN(object)) {
switch (style) {
case 'lowercase': return '.nan';
case 'uppercase': return '.NAN';
case 'camelcase': return '.NaN';
}
} else if (Number.POSITIVE_INFINITY === object) {
switch (style) {
case 'lowercase': return '.inf';
case 'uppercase': return '.INF';
case 'camelcase': return '.Inf';
}
} else if (Number.NEGATIVE_INFINITY === object) {
switch (style) {
case 'lowercase': return '-.inf';
case 'uppercase': return '-.INF';
case 'camelcase': return '-.Inf';
}
} else if (common$3.isNegativeZero(object)) {
return '-0.0';
}

res = object.toString(10);

// JS stringifier can build scientific format without dots: 5e-100,
// while YAML requres dot: 5.e-100. Fix it with simple hack

return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace('e', '.e') : res;
}

function isFloat(object) {
return (Object.prototype.toString.call(object) === '[object Number]') &&
   (object % 1 !== 0 || common$3.isNegativeZero(object));
}

var float = new type('tag:yaml.org,2002:float', {
kind: 'scalar',
resolve: resolveYamlFloat,
construct: constructYamlFloat,
predicate: isFloat,
represent: representYamlFloat,
defaultStyle: 'lowercase'
});

var json = new schema({
include: [
failsafe
],
implicit: [
_null,
bool,
int,
float
]
});

var core = new schema({
include: [
json
]
});

var YAML_DATE_REGEXP = new RegExp(
'^([0-9][0-9][0-9][0-9])'          + // [1] year
'-([0-9][0-9])'                    + // [2] month
'-([0-9][0-9])$');                   // [3] day

var YAML_TIMESTAMP_REGEXP = new RegExp(
'^([0-9][0-9][0-9][0-9])'          + // [1] year
'-([0-9][0-9]?)'                   + // [2] month
'-([0-9][0-9]?)'                   + // [3] day
'(?:[Tt]|[ \\t]+)'                 + // ...
'([0-9][0-9]?)'                    + // [4] hour
':([0-9][0-9])'                    + // [5] minute
':([0-9][0-9])'                    + // [6] second
'(?:\\.([0-9]*))?'                 + // [7] fraction
'(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + // [8] tz [9] tz_sign [10] tz_hour
'(?::([0-9][0-9]))?))?$');           // [11] tz_minute

function resolveYamlTimestamp(data) {
if (data === null) return false;
if (YAML_DATE_REGEXP.exec(data) !== null) return true;
if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
return false;
}

function constructYamlTimestamp(data) {
var match, year, month, day, hour, minute, second, fraction = 0,
delta = null, tz_hour, tz_minute, date;

match = YAML_DATE_REGEXP.exec(data);
if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);

if (match === null) throw new Error('Date resolve error');

// match: [1] year [2] month [3] day

year = +(match[1]);
month = +(match[2]) - 1; // JS month starts with 0
day = +(match[3]);

if (!match[4]) { // no hour
return new Date(Date.UTC(year, month, day));
}

// match: [4] hour [5] minute [6] second [7] fraction

hour = +(match[4]);
minute = +(match[5]);
second = +(match[6]);

if (match[7]) {
fraction = match[7].slice(0, 3);
while (fraction.length < 3) { // milli-seconds
fraction += '0';
}
fraction = +fraction;
}

// match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

if (match[9]) {
tz_hour = +(match[10]);
tz_minute = +(match[11] || 0);
delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
if (match[9] === '-') delta = -delta;
}

date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));

if (delta) date.setTime(date.getTime() - delta);

return date;
}

function representYamlTimestamp(object /*, style*/) {
return object.toISOString();
}

var timestamp = new type('tag:yaml.org,2002:timestamp', {
kind: 'scalar',
resolve: resolveYamlTimestamp,
construct: constructYamlTimestamp,
instanceOf: Date,
represent: representYamlTimestamp
});

function resolveYamlMerge(data) {
return data === '<<' || data === null;
}

var merge = new type('tag:yaml.org,2002:merge', {
kind: 'scalar',
resolve: resolveYamlMerge
});

/*eslint-disable no-bitwise*/

var NodeBuffer;

try {
// A trick for browserified version, to not include `Buffer` shim
var _require = commonjsRequire;
NodeBuffer = _require('buffer').Buffer;
} catch (__) {}




// [ 64, 65, 66 ] -> [ padding, CR, LF ]
var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';


function resolveYamlBinary(data) {
if (data === null) return false;

var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;

// Convert one by one.
for (idx = 0; idx < max; idx++) {
code = map.indexOf(data.charAt(idx));

// Skip CR/LF
if (code > 64) continue;

// Fail on illegal characters
if (code < 0) return false;

bitlen += 6;
}

// If there are any bits left, source was corrupted
return (bitlen % 8) === 0;
}

function constructYamlBinary(data) {
var idx, tailbits,
input = data.replace(/[\r\n=]/g, ''), // remove CR/LF & padding to simplify scan
max = input.length,
map = BASE64_MAP,
bits = 0,
result = [];

// Collect by 6*4 bits (3 bytes)

for (idx = 0; idx < max; idx++) {
if ((idx % 4 === 0) && idx) {
result.push((bits >> 16) & 0xFF);
result.push((bits >> 8) & 0xFF);
result.push(bits & 0xFF);
}

bits = (bits << 6) | map.indexOf(input.charAt(idx));
}

// Dump tail

tailbits = (max % 4) * 6;

if (tailbits === 0) {
result.push((bits >> 16) & 0xFF);
result.push((bits >> 8) & 0xFF);
result.push(bits & 0xFF);
} else if (tailbits === 18) {
result.push((bits >> 10) & 0xFF);
result.push((bits >> 2) & 0xFF);
} else if (tailbits === 12) {
result.push((bits >> 4) & 0xFF);
}

// Wrap into Buffer for NodeJS and leave Array for browser
if (NodeBuffer) {
// Support node 6.+ Buffer API when available
return NodeBuffer.from ? NodeBuffer.from(result) : new NodeBuffer(result);
}

return result;
}

function representYamlBinary(object /*, style*/) {
var result = '', bits = 0, idx, tail,
max = object.length,
map = BASE64_MAP;

// Convert every three bytes to 4 ASCII characters.

for (idx = 0; idx < max; idx++) {
if ((idx % 3 === 0) && idx) {
result += map[(bits >> 18) & 0x3F];
result += map[(bits >> 12) & 0x3F];
result += map[(bits >> 6) & 0x3F];
result += map[bits & 0x3F];
}

bits = (bits << 8) + object[idx];
}

// Dump tail

tail = max % 3;

if (tail === 0) {
result += map[(bits >> 18) & 0x3F];
result += map[(bits >> 12) & 0x3F];
result += map[(bits >> 6) & 0x3F];
result += map[bits & 0x3F];
} else if (tail === 2) {
result += map[(bits >> 10) & 0x3F];
result += map[(bits >> 4) & 0x3F];
result += map[(bits << 2) & 0x3F];
result += map[64];
} else if (tail === 1) {
result += map[(bits >> 2) & 0x3F];
result += map[(bits << 4) & 0x3F];
result += map[64];
result += map[64];
}

return result;
}

function isBinary(object) {
return NodeBuffer && NodeBuffer.isBuffer(object);
}

var binary = new type('tag:yaml.org,2002:binary', {
kind: 'scalar',
resolve: resolveYamlBinary,
construct: constructYamlBinary,
predicate: isBinary,
represent: representYamlBinary
});

var _hasOwnProperty = Object.prototype.hasOwnProperty;
var _toString       = Object.prototype.toString;

function resolveYamlOmap(data) {
if (data === null) return true;

var objectKeys = [], index, length, pair, pairKey, pairHasKey,
object = data;

for (index = 0, length = object.length; index < length; index += 1) {
pair = object[index];
pairHasKey = false;

if (_toString.call(pair) !== '[object Object]') return false;

for (pairKey in pair) {
if (_hasOwnProperty.call(pair, pairKey)) {
  if (!pairHasKey) pairHasKey = true;
  else return false;
}
}

if (!pairHasKey) return false;

if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
else return false;
}

return true;
}

function constructYamlOmap(data) {
return data !== null ? data : [];
}

var omap = new type('tag:yaml.org,2002:omap', {
kind: 'sequence',
resolve: resolveYamlOmap,
construct: constructYamlOmap
});

var _toString$1 = Object.prototype.toString;

function resolveYamlPairs(data) {
if (data === null) return true;

var index, length, pair, keys, result,
object = data;

result = new Array(object.length);

for (index = 0, length = object.length; index < length; index += 1) {
pair = object[index];

if (_toString$1.call(pair) !== '[object Object]') return false;

keys = Object.keys(pair);

if (keys.length !== 1) return false;

result[index] = [ keys[0], pair[keys[0]] ];
}

return true;
}

function constructYamlPairs(data) {
if (data === null) return [];

var index, length, pair, keys, result,
object = data;

result = new Array(object.length);

for (index = 0, length = object.length; index < length; index += 1) {
pair = object[index];

keys = Object.keys(pair);

result[index] = [ keys[0], pair[keys[0]] ];
}

return result;
}

var pairs = new type('tag:yaml.org,2002:pairs', {
kind: 'sequence',
resolve: resolveYamlPairs,
construct: constructYamlPairs
});

var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;

function resolveYamlSet(data) {
if (data === null) return true;

var key, object = data;

for (key in object) {
if (_hasOwnProperty$1.call(object, key)) {
if (object[key] !== null) return false;
}
}

return true;
}

function constructYamlSet(data) {
return data !== null ? data : {};
}

var set = new type('tag:yaml.org,2002:set', {
kind: 'mapping',
resolve: resolveYamlSet,
construct: constructYamlSet
});

var default_safe = new schema({
include: [
core
],
implicit: [
timestamp,
merge
],
explicit: [
binary,
omap,
pairs,
set
]
});

function resolveJavascriptUndefined() {
return true;
}

function constructJavascriptUndefined() {
/*eslint-disable no-undefined*/
return undefined;
}

function representJavascriptUndefined() {
return '';
}

function isUndefined(object) {
return typeof object === 'undefined';
}

var _undefined = new type('tag:yaml.org,2002:js/undefined', {
kind: 'scalar',
resolve: resolveJavascriptUndefined,
construct: constructJavascriptUndefined,
predicate: isUndefined,
represent: representJavascriptUndefined
});

function resolveJavascriptRegExp(data) {
if (data === null) return false;
if (data.length === 0) return false;

var regexp = data,
tail   = /\/([gim]*)$/.exec(data),
modifiers = '';

// if regexp starts with '/' it can have modifiers and must be properly closed
// `/foo/gim` - modifiers tail can be maximum 3 chars
if (regexp[0] === '/') {
if (tail) modifiers = tail[1];

if (modifiers.length > 3) return false;
// if expression starts with /, is should be properly terminated
if (regexp[regexp.length - modifiers.length - 1] !== '/') return false;
}

return true;
}

function constructJavascriptRegExp(data) {
var regexp = data,
tail   = /\/([gim]*)$/.exec(data),
modifiers = '';

// `/foo/gim` - tail can be maximum 4 chars
if (regexp[0] === '/') {
if (tail) modifiers = tail[1];
regexp = regexp.slice(1, regexp.length - modifiers.length - 1);
}

return new RegExp(regexp, modifiers);
}

function representJavascriptRegExp(object /*, style*/) {
var result = '/' + object.source + '/';

if (object.global) result += 'g';
if (object.multiline) result += 'm';
if (object.ignoreCase) result += 'i';

return result;
}

function isRegExp(object) {
return Object.prototype.toString.call(object) === '[object RegExp]';
}

var regexp = new type('tag:yaml.org,2002:js/regexp', {
kind: 'scalar',
resolve: resolveJavascriptRegExp,
construct: constructJavascriptRegExp,
predicate: isRegExp,
represent: representJavascriptRegExp
});

var esprima;

// Browserified version does not have esprima
//
// 1. For node.js just require module as deps
// 2. For browser try to require mudule via external AMD system.
//    If not found - try to fallback to window.esprima. If not
//    found too - then fail to parse.
//
try {
// workaround to exclude package from browserify list.
var _require$1 = commonjsRequire;
esprima = _require$1('esprima');
} catch (_) {
/* eslint-disable no-redeclare */
/* global window */
if (typeof window !== 'undefined') esprima = window.esprima;
}



function resolveJavascriptFunction(data) {
if (data === null) return false;

try {
var source = '(' + data + ')',
  ast    = esprima.parse(source, { range: true });

if (ast.type                    !== 'Program'             ||
  ast.body.length             !== 1                     ||
  ast.body[0].type            !== 'ExpressionStatement' ||
  (ast.body[0].expression.type !== 'ArrowFunctionExpression' &&
    ast.body[0].expression.type !== 'FunctionExpression')) {
return false;
}

return true;
} catch (err) {
return false;
}
}

function constructJavascriptFunction(data) {
/*jslint evil:true*/

var source = '(' + data + ')',
ast    = esprima.parse(source, { range: true }),
params = [],
body;

if (ast.type                    !== 'Program'             ||
ast.body.length             !== 1                     ||
ast.body[0].type            !== 'ExpressionStatement' ||
(ast.body[0].expression.type !== 'ArrowFunctionExpression' &&
  ast.body[0].expression.type !== 'FunctionExpression')) {
throw new Error('Failed to resolve function');
}

ast.body[0].expression.params.forEach(function (param) {
params.push(param.name);
});

body = ast.body[0].expression.body.range;

// Esprima's ranges include the first '{' and the last '}' characters on
// function expressions. So cut them out.
if (ast.body[0].expression.body.type === 'BlockStatement') {
/*eslint-disable no-new-func*/
return new Function(params, source.slice(body[0] + 1, body[1] - 1));
}
// ES6 arrow functions can omit the BlockStatement. In that case, just return
// the body.
/*eslint-disable no-new-func*/
return new Function(params, 'return ' + source.slice(body[0], body[1]));
}

function representJavascriptFunction(object /*, style*/) {
return object.toString();
}

function isFunction(object) {
return Object.prototype.toString.call(object) === '[object Function]';
}

var _function = new type('tag:yaml.org,2002:js/function', {
kind: 'scalar',
resolve: resolveJavascriptFunction,
construct: constructJavascriptFunction,
predicate: isFunction,
represent: representJavascriptFunction
});

var default_full = schema.DEFAULT = new schema({
include: [
default_safe
],
explicit: [
_undefined,
regexp,
_function
]
});

/*eslint-disable max-len,no-use-before-define*/








var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;


var CONTEXT_FLOW_IN   = 1;
var CONTEXT_FLOW_OUT  = 2;
var CONTEXT_BLOCK_IN  = 3;
var CONTEXT_BLOCK_OUT = 4;


var CHOMPING_CLIP  = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP  = 3;


var PATTERN_NON_PRINTABLE         = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS       = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE            = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI               = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;


function _class(obj) { return Object.prototype.toString.call(obj); }

function is_EOL(c) {
return (c === 0x0A/* LF */) || (c === 0x0D/* CR */);
}

function is_WHITE_SPACE(c) {
return (c === 0x09/* Tab */) || (c === 0x20/* Space */);
}

function is_WS_OR_EOL(c) {
return (c === 0x09/* Tab */) ||
   (c === 0x20/* Space */) ||
   (c === 0x0A/* LF */) ||
   (c === 0x0D/* CR */);
}

function is_FLOW_INDICATOR(c) {
return c === 0x2C/* , */ ||
   c === 0x5B/* [ */ ||
   c === 0x5D/* ] */ ||
   c === 0x7B/* { */ ||
   c === 0x7D/* } */;
}

function fromHexCode(c) {
var lc;

if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
return c - 0x30;
}

/*eslint-disable no-bitwise*/
lc = c | 0x20;

if ((0x61/* a */ <= lc) && (lc <= 0x66/* f */)) {
return lc - 0x61 + 10;
}

return -1;
}

function escapedHexLen(c) {
if (c === 0x78/* x */) { return 2; }
if (c === 0x75/* u */) { return 4; }
if (c === 0x55/* U */) { return 8; }
return 0;
}

function fromDecimalCode(c) {
if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
return c - 0x30;
}

return -1;
}

function simpleEscapeSequence(c) {
/* eslint-disable indent */
return (c === 0x30/* 0 */) ? '\x00' :
  (c === 0x61/* a */) ? '\x07' :
  (c === 0x62/* b */) ? '\x08' :
  (c === 0x74/* t */) ? '\x09' :
  (c === 0x09/* Tab */) ? '\x09' :
  (c === 0x6E/* n */) ? '\x0A' :
  (c === 0x76/* v */) ? '\x0B' :
  (c === 0x66/* f */) ? '\x0C' :
  (c === 0x72/* r */) ? '\x0D' :
  (c === 0x65/* e */) ? '\x1B' :
  (c === 0x20/* Space */) ? ' ' :
  (c === 0x22/* " */) ? '\x22' :
  (c === 0x2F/* / */) ? '/' :
  (c === 0x5C/* \ */) ? '\x5C' :
  (c === 0x4E/* N */) ? '\x85' :
  (c === 0x5F/* _ */) ? '\xA0' :
  (c === 0x4C/* L */) ? '\u2028' :
  (c === 0x50/* P */) ? '\u2029' : '';
}

function charFromCodepoint(c) {
if (c <= 0xFFFF) {
return String.fromCharCode(c);
}
// Encode UTF-16 surrogate pair
// https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
return String.fromCharCode(
((c - 0x010000) >> 10) + 0xD800,
((c - 0x010000) & 0x03FF) + 0xDC00
);
}

var simpleEscapeCheck = new Array(256); // integer, for fast access
var simpleEscapeMap = new Array(256);
for (var i = 0; i < 256; i++) {
simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
simpleEscapeMap[i] = simpleEscapeSequence(i);
}


function State(input, options) {
this.input = input;

this.filename  = options['filename']  || null;
this.schema    = options['schema']    || default_full;
this.onWarning = options['onWarning'] || null;
this.legacy    = options['legacy']    || false;
this.json      = options['json']      || false;
this.listener  = options['listener']  || null;

this.implicitTypes = this.schema.compiledImplicit;
this.typeMap       = this.schema.compiledTypeMap;

this.length     = input.length;
this.position   = 0;
this.line       = 0;
this.lineStart  = 0;
this.lineIndent = 0;

this.documents = [];

/*
this.version;
this.checkLineBreaks;
this.tagMap;
this.anchorMap;
this.tag;
this.anchor;
this.kind;
this.result;*/

}


function generateError(state, message) {
return new exception(
message,
new mark$1(state.filename, state.input, state.position, state.line, (state.position - state.lineStart)));
}

function throwError(state, message) {
throw generateError(state, message);
}

function throwWarning(state, message) {
if (state.onWarning) {
state.onWarning.call(null, generateError(state, message));
}
}


var directiveHandlers = {

YAML: function handleYamlDirective(state, name, args) {

var match, major, minor;

if (state.version !== null) {
throwError(state, 'duplication of %YAML directive');
}

if (args.length !== 1) {
throwError(state, 'YAML directive accepts exactly one argument');
}

match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);

if (match === null) {
throwError(state, 'ill-formed argument of the YAML directive');
}

major = parseInt(match[1], 10);
minor = parseInt(match[2], 10);

if (major !== 1) {
throwError(state, 'unacceptable YAML version of the document');
}

state.version = args[0];
state.checkLineBreaks = (minor < 2);

if (minor !== 1 && minor !== 2) {
throwWarning(state, 'unsupported YAML version of the document');
}
},

TAG: function handleTagDirective(state, name, args) {

var handle, prefix;

if (args.length !== 2) {
throwError(state, 'TAG directive accepts exactly two arguments');
}

handle = args[0];
prefix = args[1];

if (!PATTERN_TAG_HANDLE.test(handle)) {
throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
}

if (_hasOwnProperty$2.call(state.tagMap, handle)) {
throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
}

if (!PATTERN_TAG_URI.test(prefix)) {
throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
}

state.tagMap[handle] = prefix;
}
};


function captureSegment(state, start, end, checkJson) {
var _position, _length, _character, _result;

if (start < end) {
_result = state.input.slice(start, end);

if (checkJson) {
for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
  _character = _result.charCodeAt(_position);
  if (!(_character === 0x09 ||
        (0x20 <= _character && _character <= 0x10FFFF))) {
    throwError(state, 'expected valid JSON character');
  }
}
} else if (PATTERN_NON_PRINTABLE.test(_result)) {
throwError(state, 'the stream contains non-printable characters');
}

state.result += _result;
}
}

function mergeMappings(state, destination, source, overridableKeys) {
var sourceKeys, key, index, quantity;

if (!common$3.isObject(source)) {
throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
}

sourceKeys = Object.keys(source);

for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
key = sourceKeys[index];

if (!_hasOwnProperty$2.call(destination, key)) {
destination[key] = source[key];
overridableKeys[key] = true;
}
}
}

function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startPos) {
var index, quantity;

// The output is a plain object here, so keys can only be strings.
// We need to convert keyNode to a string, but doing so can hang the process
// (deeply nested arrays that explode exponentially using aliases).
if (Array.isArray(keyNode)) {
keyNode = Array.prototype.slice.call(keyNode);

for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
if (Array.isArray(keyNode[index])) {
  throwError(state, 'nested arrays are not supported inside keys');
}

if (typeof keyNode === 'object' && _class(keyNode[index]) === '[object Object]') {
  keyNode[index] = '[object Object]';
}
}
}

// Avoid code execution in load() via toString property
// (still use its own toString for arrays, timestamps,
// and whatever user schema extensions happen to have @@toStringTag)
if (typeof keyNode === 'object' && _class(keyNode) === '[object Object]') {
keyNode = '[object Object]';
}


keyNode = String(keyNode);

if (_result === null) {
_result = {};
}

if (keyTag === 'tag:yaml.org,2002:merge') {
if (Array.isArray(valueNode)) {
for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
  mergeMappings(state, _result, valueNode[index], overridableKeys);
}
} else {
mergeMappings(state, _result, valueNode, overridableKeys);
}
} else {
if (!state.json &&
  !_hasOwnProperty$2.call(overridableKeys, keyNode) &&
  _hasOwnProperty$2.call(_result, keyNode)) {
state.line = startLine || state.line;
state.position = startPos || state.position;
throwError(state, 'duplicated mapping key');
}
_result[keyNode] = valueNode;
delete overridableKeys[keyNode];
}

return _result;
}

function readLineBreak(state) {
var ch;

ch = state.input.charCodeAt(state.position);

if (ch === 0x0A/* LF */) {
state.position++;
} else if (ch === 0x0D/* CR */) {
state.position++;
if (state.input.charCodeAt(state.position) === 0x0A/* LF */) {
state.position++;
}
} else {
throwError(state, 'a line break is expected');
}

state.line += 1;
state.lineStart = state.position;
}

function skipSeparationSpace(state, allowComments, checkIndent) {
var lineBreaks = 0,
ch = state.input.charCodeAt(state.position);

while (ch !== 0) {
while (is_WHITE_SPACE(ch)) {
ch = state.input.charCodeAt(++state.position);
}

if (allowComments && ch === 0x23/* # */) {
do {
  ch = state.input.charCodeAt(++state.position);
} while (ch !== 0x0A/* LF */ && ch !== 0x0D/* CR */ && ch !== 0);
}

if (is_EOL(ch)) {
readLineBreak(state);

ch = state.input.charCodeAt(state.position);
lineBreaks++;
state.lineIndent = 0;

while (ch === 0x20/* Space */) {
  state.lineIndent++;
  ch = state.input.charCodeAt(++state.position);
}
} else {
break;
}
}

if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
throwWarning(state, 'deficient indentation');
}

return lineBreaks;
}

function testDocumentSeparator(state) {
var _position = state.position,
ch;

ch = state.input.charCodeAt(_position);

// Condition state.position === state.lineStart is tested
// in parent on each call, for efficiency. No needs to test here again.
if ((ch === 0x2D/* - */ || ch === 0x2E/* . */) &&
ch === state.input.charCodeAt(_position + 1) &&
ch === state.input.charCodeAt(_position + 2)) {

_position += 3;

ch = state.input.charCodeAt(_position);

if (ch === 0 || is_WS_OR_EOL(ch)) {
return true;
}
}

return false;
}

function writeFoldedLines(state, count) {
if (count === 1) {
state.result += ' ';
} else if (count > 1) {
state.result += common$3.repeat('\n', count - 1);
}
}


function readPlainScalar(state, nodeIndent, withinFlowCollection) {
var preceding,
following,
captureStart,
captureEnd,
hasPendingContent,
_line,
_lineStart,
_lineIndent,
_kind = state.kind,
_result = state.result,
ch;

ch = state.input.charCodeAt(state.position);

if (is_WS_OR_EOL(ch)      ||
is_FLOW_INDICATOR(ch) ||
ch === 0x23/* # */    ||
ch === 0x26/* & */    ||
ch === 0x2A/* * */    ||
ch === 0x21/* ! */    ||
ch === 0x7C/* | */    ||
ch === 0x3E/* > */    ||
ch === 0x27/* ' */    ||
ch === 0x22/* " */    ||
ch === 0x25/* % */    ||
ch === 0x40/* @ */    ||
ch === 0x60/* ` */) {
return false;
}

if (ch === 0x3F/* ? */ || ch === 0x2D/* - */) {
following = state.input.charCodeAt(state.position + 1);

if (is_WS_OR_EOL(following) ||
  withinFlowCollection && is_FLOW_INDICATOR(following)) {
return false;
}
}

state.kind = 'scalar';
state.result = '';
captureStart = captureEnd = state.position;
hasPendingContent = false;

while (ch !== 0) {
if (ch === 0x3A/* : */) {
following = state.input.charCodeAt(state.position + 1);

if (is_WS_OR_EOL(following) ||
    withinFlowCollection && is_FLOW_INDICATOR(following)) {
  break;
}

} else if (ch === 0x23/* # */) {
preceding = state.input.charCodeAt(state.position - 1);

if (is_WS_OR_EOL(preceding)) {
  break;
}

} else if ((state.position === state.lineStart && testDocumentSeparator(state)) ||
         withinFlowCollection && is_FLOW_INDICATOR(ch)) {
break;

} else if (is_EOL(ch)) {
_line = state.line;
_lineStart = state.lineStart;
_lineIndent = state.lineIndent;
skipSeparationSpace(state, false, -1);

if (state.lineIndent >= nodeIndent) {
  hasPendingContent = true;
  ch = state.input.charCodeAt(state.position);
  continue;
} else {
  state.position = captureEnd;
  state.line = _line;
  state.lineStart = _lineStart;
  state.lineIndent = _lineIndent;
  break;
}
}

if (hasPendingContent) {
captureSegment(state, captureStart, captureEnd, false);
writeFoldedLines(state, state.line - _line);
captureStart = captureEnd = state.position;
hasPendingContent = false;
}

if (!is_WHITE_SPACE(ch)) {
captureEnd = state.position + 1;
}

ch = state.input.charCodeAt(++state.position);
}

captureSegment(state, captureStart, captureEnd, false);

if (state.result) {
return true;
}

state.kind = _kind;
state.result = _result;
return false;
}

function readSingleQuotedScalar(state, nodeIndent) {
var ch,
captureStart, captureEnd;

ch = state.input.charCodeAt(state.position);

if (ch !== 0x27/* ' */) {
return false;
}

state.kind = 'scalar';
state.result = '';
state.position++;
captureStart = captureEnd = state.position;

while ((ch = state.input.charCodeAt(state.position)) !== 0) {
if (ch === 0x27/* ' */) {
captureSegment(state, captureStart, state.position, true);
ch = state.input.charCodeAt(++state.position);

if (ch === 0x27/* ' */) {
  captureStart = state.position;
  state.position++;
  captureEnd = state.position;
} else {
  return true;
}

} else if (is_EOL(ch)) {
captureSegment(state, captureStart, captureEnd, true);
writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
captureStart = captureEnd = state.position;

} else if (state.position === state.lineStart && testDocumentSeparator(state)) {
throwError(state, 'unexpected end of the document within a single quoted scalar');

} else {
state.position++;
captureEnd = state.position;
}
}

throwError(state, 'unexpected end of the stream within a single quoted scalar');
}

function readDoubleQuotedScalar(state, nodeIndent) {
var captureStart,
captureEnd,
hexLength,
hexResult,
tmp,
ch;

ch = state.input.charCodeAt(state.position);

if (ch !== 0x22/* " */) {
return false;
}

state.kind = 'scalar';
state.result = '';
state.position++;
captureStart = captureEnd = state.position;

while ((ch = state.input.charCodeAt(state.position)) !== 0) {
if (ch === 0x22/* " */) {
captureSegment(state, captureStart, state.position, true);
state.position++;
return true;

} else if (ch === 0x5C/* \ */) {
captureSegment(state, captureStart, state.position, true);
ch = state.input.charCodeAt(++state.position);

if (is_EOL(ch)) {
  skipSeparationSpace(state, false, nodeIndent);

  // TODO: rework to inline fn with no type cast?
} else if (ch < 256 && simpleEscapeCheck[ch]) {
  state.result += simpleEscapeMap[ch];
  state.position++;

} else if ((tmp = escapedHexLen(ch)) > 0) {
  hexLength = tmp;
  hexResult = 0;

  for (; hexLength > 0; hexLength--) {
    ch = state.input.charCodeAt(++state.position);

    if ((tmp = fromHexCode(ch)) >= 0) {
      hexResult = (hexResult << 4) + tmp;

    } else {
      throwError(state, 'expected hexadecimal character');
    }
  }

  state.result += charFromCodepoint(hexResult);

  state.position++;

} else {
  throwError(state, 'unknown escape sequence');
}

captureStart = captureEnd = state.position;

} else if (is_EOL(ch)) {
captureSegment(state, captureStart, captureEnd, true);
writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
captureStart = captureEnd = state.position;

} else if (state.position === state.lineStart && testDocumentSeparator(state)) {
throwError(state, 'unexpected end of the document within a double quoted scalar');

} else {
state.position++;
captureEnd = state.position;
}
}

throwError(state, 'unexpected end of the stream within a double quoted scalar');
}

function readFlowCollection(state, nodeIndent) {
var readNext = true,
_line,
_tag     = state.tag,
_result,
_anchor  = state.anchor,
following,
terminator,
isPair,
isExplicitPair,
isMapping,
overridableKeys = {},
keyNode,
keyTag,
valueNode,
ch;

ch = state.input.charCodeAt(state.position);

if (ch === 0x5B/* [ */) {
terminator = 0x5D;/* ] */
isMapping = false;
_result = [];
} else if (ch === 0x7B/* { */) {
terminator = 0x7D;/* } */
isMapping = true;
_result = {};
} else {
return false;
}

if (state.anchor !== null) {
state.anchorMap[state.anchor] = _result;
}

ch = state.input.charCodeAt(++state.position);

while (ch !== 0) {
skipSeparationSpace(state, true, nodeIndent);

ch = state.input.charCodeAt(state.position);

if (ch === terminator) {
state.position++;
state.tag = _tag;
state.anchor = _anchor;
state.kind = isMapping ? 'mapping' : 'sequence';
state.result = _result;
return true;
} else if (!readNext) {
throwError(state, 'missed comma between flow collection entries');
}

keyTag = keyNode = valueNode = null;
isPair = isExplicitPair = false;

if (ch === 0x3F/* ? */) {
following = state.input.charCodeAt(state.position + 1);

if (is_WS_OR_EOL(following)) {
  isPair = isExplicitPair = true;
  state.position++;
  skipSeparationSpace(state, true, nodeIndent);
}
}

_line = state.line;
composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
keyTag = state.tag;
keyNode = state.result;
skipSeparationSpace(state, true, nodeIndent);

ch = state.input.charCodeAt(state.position);

if ((isExplicitPair || state.line === _line) && ch === 0x3A/* : */) {
isPair = true;
ch = state.input.charCodeAt(++state.position);
skipSeparationSpace(state, true, nodeIndent);
composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
valueNode = state.result;
}

if (isMapping) {
storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode);
} else if (isPair) {
_result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode));
} else {
_result.push(keyNode);
}

skipSeparationSpace(state, true, nodeIndent);

ch = state.input.charCodeAt(state.position);

if (ch === 0x2C/* , */) {
readNext = true;
ch = state.input.charCodeAt(++state.position);
} else {
readNext = false;
}
}

throwError(state, 'unexpected end of the stream within a flow collection');
}

function readBlockScalar(state, nodeIndent) {
var captureStart,
folding,
chomping       = CHOMPING_CLIP,
didReadContent = false,
detectedIndent = false,
textIndent     = nodeIndent,
emptyLines     = 0,
atMoreIndented = false,
tmp,
ch;

ch = state.input.charCodeAt(state.position);

if (ch === 0x7C/* | */) {
folding = false;
} else if (ch === 0x3E/* > */) {
folding = true;
} else {
return false;
}

state.kind = 'scalar';
state.result = '';

while (ch !== 0) {
ch = state.input.charCodeAt(++state.position);

if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
if (CHOMPING_CLIP === chomping) {
  chomping = (ch === 0x2B/* + */) ? CHOMPING_KEEP : CHOMPING_STRIP;
} else {
  throwError(state, 'repeat of a chomping mode identifier');
}

} else if ((tmp = fromDecimalCode(ch)) >= 0) {
if (tmp === 0) {
  throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
} else if (!detectedIndent) {
  textIndent = nodeIndent + tmp - 1;
  detectedIndent = true;
} else {
  throwError(state, 'repeat of an indentation width identifier');
}

} else {
break;
}
}

if (is_WHITE_SPACE(ch)) {
do { ch = state.input.charCodeAt(++state.position); }
while (is_WHITE_SPACE(ch));

if (ch === 0x23/* # */) {
do { ch = state.input.charCodeAt(++state.position); }
while (!is_EOL(ch) && (ch !== 0));
}
}

while (ch !== 0) {
readLineBreak(state);
state.lineIndent = 0;

ch = state.input.charCodeAt(state.position);

while ((!detectedIndent || state.lineIndent < textIndent) &&
     (ch === 0x20/* Space */)) {
state.lineIndent++;
ch = state.input.charCodeAt(++state.position);
}

if (!detectedIndent && state.lineIndent > textIndent) {
textIndent = state.lineIndent;
}

if (is_EOL(ch)) {
emptyLines++;
continue;
}

// End of the scalar.
if (state.lineIndent < textIndent) {

// Perform the chomping.
if (chomping === CHOMPING_KEEP) {
  state.result += common$3.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
} else if (chomping === CHOMPING_CLIP) {
  if (didReadContent) { // i.e. only if the scalar is not empty.
    state.result += '\n';
  }
}

// Break this `while` cycle and go to the funciton's epilogue.
break;
}

// Folded style: use fancy rules to handle line breaks.
if (folding) {

// Lines starting with white space characters (more-indented lines) are not folded.
if (is_WHITE_SPACE(ch)) {
  atMoreIndented = true;
  // except for the first content line (cf. Example 8.1)
  state.result += common$3.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

// End of more-indented block.
} else if (atMoreIndented) {
  atMoreIndented = false;
  state.result += common$3.repeat('\n', emptyLines + 1);

// Just one line break - perceive as the same line.
} else if (emptyLines === 0) {
  if (didReadContent) { // i.e. only if we have already read some scalar content.
    state.result += ' ';
  }

// Several line breaks - perceive as different lines.
} else {
  state.result += common$3.repeat('\n', emptyLines);
}

// Literal style: just add exact number of line breaks between content lines.
} else {
// Keep all line breaks except the header line break.
state.result += common$3.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
}

didReadContent = true;
detectedIndent = true;
emptyLines = 0;
captureStart = state.position;

while (!is_EOL(ch) && (ch !== 0)) {
ch = state.input.charCodeAt(++state.position);
}

captureSegment(state, captureStart, state.position, false);
}

return true;
}

function readBlockSequence(state, nodeIndent) {
var _line,
_tag      = state.tag,
_anchor   = state.anchor,
_result   = [],
following,
detected  = false,
ch;

if (state.anchor !== null) {
state.anchorMap[state.anchor] = _result;
}

ch = state.input.charCodeAt(state.position);

while (ch !== 0) {

if (ch !== 0x2D/* - */) {
break;
}

following = state.input.charCodeAt(state.position + 1);

if (!is_WS_OR_EOL(following)) {
break;
}

detected = true;
state.position++;

if (skipSeparationSpace(state, true, -1)) {
if (state.lineIndent <= nodeIndent) {
  _result.push(null);
  ch = state.input.charCodeAt(state.position);
  continue;
}
}

_line = state.line;
composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
_result.push(state.result);
skipSeparationSpace(state, true, -1);

ch = state.input.charCodeAt(state.position);

if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
throwError(state, 'bad indentation of a sequence entry');
} else if (state.lineIndent < nodeIndent) {
break;
}
}

if (detected) {
state.tag = _tag;
state.anchor = _anchor;
state.kind = 'sequence';
state.result = _result;
return true;
}
return false;
}

function readBlockMapping(state, nodeIndent, flowIndent) {
var following,
allowCompact,
_line,
_pos,
_tag          = state.tag,
_anchor       = state.anchor,
_result       = {},
overridableKeys = {},
keyTag        = null,
keyNode       = null,
valueNode     = null,
atExplicitKey = false,
detected      = false,
ch;

if (state.anchor !== null) {
state.anchorMap[state.anchor] = _result;
}

ch = state.input.charCodeAt(state.position);

while (ch !== 0) {
following = state.input.charCodeAt(state.position + 1);
_line = state.line; // Save the current line.
_pos = state.position;

//
// Explicit notation case. There are two separate blocks:
// first for the key (denoted by "?") and second for the value (denoted by ":")
//
if ((ch === 0x3F/* ? */ || ch === 0x3A/* : */) && is_WS_OR_EOL(following)) {

if (ch === 0x3F/* ? */) {
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
    keyTag = keyNode = valueNode = null;
  }

  detected = true;
  atExplicitKey = true;
  allowCompact = true;

} else if (atExplicitKey) {
  // i.e. 0x3A/* : */ === character after the explicit key.
  atExplicitKey = false;
  allowCompact = true;

} else {
  throwError(state, 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line');
}

state.position += 1;
ch = following;

//
// Implicit notation case. Flow-style node as the key first, then ":", and the value.
//
} else if (composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {

if (state.line === _line) {
  ch = state.input.charCodeAt(state.position);

  while (is_WHITE_SPACE(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (ch === 0x3A/* : */) {
    ch = state.input.charCodeAt(++state.position);

    if (!is_WS_OR_EOL(ch)) {
      throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
    }

    if (atExplicitKey) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
      keyTag = keyNode = valueNode = null;
    }

    detected = true;
    atExplicitKey = false;
    allowCompact = false;
    keyTag = state.tag;
    keyNode = state.result;

  } else if (detected) {
    throwError(state, 'can not read an implicit mapping pair; a colon is missed');

  } else {
    state.tag = _tag;
    state.anchor = _anchor;
    return true; // Keep the result of `composeNode`.
  }

} else if (detected) {
  throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');

} else {
  state.tag = _tag;
  state.anchor = _anchor;
  return true; // Keep the result of `composeNode`.
}

} else {
break; // Reading is done. Go to the epilogue.
}

//
// Common reading code for both explicit and implicit notations.
//
if (state.line === _line || state.lineIndent > nodeIndent) {
if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
  if (atExplicitKey) {
    keyNode = state.result;
  } else {
    valueNode = state.result;
  }
}

if (!atExplicitKey) {
  storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _pos);
  keyTag = keyNode = valueNode = null;
}

skipSeparationSpace(state, true, -1);
ch = state.input.charCodeAt(state.position);
}

if (state.lineIndent > nodeIndent && (ch !== 0)) {
throwError(state, 'bad indentation of a mapping entry');
} else if (state.lineIndent < nodeIndent) {
break;
}
}

//
// Epilogue.
//

// Special case: last mapping's node contains only the key in explicit notation.
if (atExplicitKey) {
storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
}

// Expose the resulting mapping.
if (detected) {
state.tag = _tag;
state.anchor = _anchor;
state.kind = 'mapping';
state.result = _result;
}

return detected;
}

function readTagProperty(state) {
var _position,
isVerbatim = false,
isNamed    = false,
tagHandle,
tagName,
ch;

ch = state.input.charCodeAt(state.position);

if (ch !== 0x21/* ! */) return false;

if (state.tag !== null) {
throwError(state, 'duplication of a tag property');
}

ch = state.input.charCodeAt(++state.position);

if (ch === 0x3C/* < */) {
isVerbatim = true;
ch = state.input.charCodeAt(++state.position);

} else if (ch === 0x21/* ! */) {
isNamed = true;
tagHandle = '!!';
ch = state.input.charCodeAt(++state.position);

} else {
tagHandle = '!';
}

_position = state.position;

if (isVerbatim) {
do { ch = state.input.charCodeAt(++state.position); }
while (ch !== 0 && ch !== 0x3E/* > */);

if (state.position < state.length) {
tagName = state.input.slice(_position, state.position);
ch = state.input.charCodeAt(++state.position);
} else {
throwError(state, 'unexpected end of the stream within a verbatim tag');
}
} else {
while (ch !== 0 && !is_WS_OR_EOL(ch)) {

if (ch === 0x21/* ! */) {
  if (!isNamed) {
    tagHandle = state.input.slice(_position - 1, state.position + 1);

    if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
      throwError(state, 'named tag handle cannot contain such characters');
    }

    isNamed = true;
    _position = state.position + 1;
  } else {
    throwError(state, 'tag suffix cannot contain exclamation marks');
  }
}

ch = state.input.charCodeAt(++state.position);
}

tagName = state.input.slice(_position, state.position);

if (PATTERN_FLOW_INDICATORS.test(tagName)) {
throwError(state, 'tag suffix cannot contain flow indicator characters');
}
}

if (tagName && !PATTERN_TAG_URI.test(tagName)) {
throwError(state, 'tag name cannot contain such characters: ' + tagName);
}

if (isVerbatim) {
state.tag = tagName;

} else if (_hasOwnProperty$2.call(state.tagMap, tagHandle)) {
state.tag = state.tagMap[tagHandle] + tagName;

} else if (tagHandle === '!') {
state.tag = '!' + tagName;

} else if (tagHandle === '!!') {
state.tag = 'tag:yaml.org,2002:' + tagName;

} else {
throwError(state, 'undeclared tag handle "' + tagHandle + '"');
}

return true;
}

function readAnchorProperty(state) {
var _position,
ch;

ch = state.input.charCodeAt(state.position);

if (ch !== 0x26/* & */) return false;

if (state.anchor !== null) {
throwError(state, 'duplication of an anchor property');
}

ch = state.input.charCodeAt(++state.position);
_position = state.position;

while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
ch = state.input.charCodeAt(++state.position);
}

if (state.position === _position) {
throwError(state, 'name of an anchor node must contain at least one character');
}

state.anchor = state.input.slice(_position, state.position);
return true;
}

function readAlias(state) {
var _position, alias,
ch;

ch = state.input.charCodeAt(state.position);

if (ch !== 0x2A/* * */) return false;

ch = state.input.charCodeAt(++state.position);
_position = state.position;

while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
ch = state.input.charCodeAt(++state.position);
}

if (state.position === _position) {
throwError(state, 'name of an alias node must contain at least one character');
}

alias = state.input.slice(_position, state.position);

if (!_hasOwnProperty$2.call(state.anchorMap, alias)) {
throwError(state, 'unidentified alias "' + alias + '"');
}

state.result = state.anchorMap[alias];
skipSeparationSpace(state, true, -1);
return true;
}

function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
var allowBlockStyles,
allowBlockScalars,
allowBlockCollections,
indentStatus = 1, // 1: this>parent, 0: this=parent, -1: this<parent
atNewLine  = false,
hasContent = false,
typeIndex,
typeQuantity,
type,
flowIndent,
blockIndent;

if (state.listener !== null) {
state.listener('open', state);
}

state.tag    = null;
state.anchor = null;
state.kind   = null;
state.result = null;

allowBlockStyles = allowBlockScalars = allowBlockCollections =
CONTEXT_BLOCK_OUT === nodeContext ||
CONTEXT_BLOCK_IN  === nodeContext;

if (allowToSeek) {
if (skipSeparationSpace(state, true, -1)) {
atNewLine = true;

if (state.lineIndent > parentIndent) {
  indentStatus = 1;
} else if (state.lineIndent === parentIndent) {
  indentStatus = 0;
} else if (state.lineIndent < parentIndent) {
  indentStatus = -1;
}
}
}

if (indentStatus === 1) {
while (readTagProperty(state) || readAnchorProperty(state)) {
if (skipSeparationSpace(state, true, -1)) {
  atNewLine = true;
  allowBlockCollections = allowBlockStyles;

  if (state.lineIndent > parentIndent) {
    indentStatus = 1;
  } else if (state.lineIndent === parentIndent) {
    indentStatus = 0;
  } else if (state.lineIndent < parentIndent) {
    indentStatus = -1;
  }
} else {
  allowBlockCollections = false;
}
}
}

if (allowBlockCollections) {
allowBlockCollections = atNewLine || allowCompact;
}

if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
flowIndent = parentIndent;
} else {
flowIndent = parentIndent + 1;
}

blockIndent = state.position - state.lineStart;

if (indentStatus === 1) {
if (allowBlockCollections &&
    (readBlockSequence(state, blockIndent) ||
     readBlockMapping(state, blockIndent, flowIndent)) ||
    readFlowCollection(state, flowIndent)) {
  hasContent = true;
} else {
  if ((allowBlockScalars && readBlockScalar(state, flowIndent)) ||
      readSingleQuotedScalar(state, flowIndent) ||
      readDoubleQuotedScalar(state, flowIndent)) {
    hasContent = true;

  } else if (readAlias(state)) {
    hasContent = true;

    if (state.tag !== null || state.anchor !== null) {
      throwError(state, 'alias node should not have any properties');
    }

  } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
    hasContent = true;

    if (state.tag === null) {
      state.tag = '?';
    }
  }

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = state.result;
  }
}
} else if (indentStatus === 0) {
// Special case: block sequences are allowed to have same indentation level as the parent.
// http://www.yaml.org/spec/1.2/spec.html#id2799784
hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
}
}

if (state.tag !== null && state.tag !== '!') {
if (state.tag === '?') {
// Implicit resolving is not allowed for non-scalar types, and '?'
// non-specific tag is only automatically assigned to plain scalars.
//
// We only need to check kind conformity in case user explicitly assigns '?'
// tag, for example like this: "!<?> [0]"
//
if (state.result !== null && state.kind !== 'scalar') {
  throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
}

for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
  type = state.implicitTypes[typeIndex];

  if (type.resolve(state.result)) { // `state.result` updated in resolver if matched
    state.result = type.construct(state.result);
    state.tag = type.tag;
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }
    break;
  }
}
} else if (_hasOwnProperty$2.call(state.typeMap[state.kind || 'fallback'], state.tag)) {
type = state.typeMap[state.kind || 'fallback'][state.tag];

if (state.result !== null && type.kind !== state.kind) {
  throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
}

if (!type.resolve(state.result)) { // `state.result` updated in resolver if matched
  throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
} else {
  state.result = type.construct(state.result);
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = state.result;
  }
}
} else {
throwError(state, 'unknown tag !<' + state.tag + '>');
}
}

if (state.listener !== null) {
state.listener('close', state);
}
return state.tag !== null ||  state.anchor !== null || hasContent;
}

function readDocument(state) {
var documentStart = state.position,
_position,
directiveName,
directiveArgs,
hasDirectives = false,
ch;

state.version = null;
state.checkLineBreaks = state.legacy;
state.tagMap = {};
state.anchorMap = {};

while ((ch = state.input.charCodeAt(state.position)) !== 0) {
skipSeparationSpace(state, true, -1);

ch = state.input.charCodeAt(state.position);

if (state.lineIndent > 0 || ch !== 0x25/* % */) {
break;
}

hasDirectives = true;
ch = state.input.charCodeAt(++state.position);
_position = state.position;

while (ch !== 0 && !is_WS_OR_EOL(ch)) {
ch = state.input.charCodeAt(++state.position);
}

directiveName = state.input.slice(_position, state.position);
directiveArgs = [];

if (directiveName.length < 1) {
throwError(state, 'directive name must not be less than one character in length');
}

while (ch !== 0) {
while (is_WHITE_SPACE(ch)) {
  ch = state.input.charCodeAt(++state.position);
}

if (ch === 0x23/* # */) {
  do { ch = state.input.charCodeAt(++state.position); }
  while (ch !== 0 && !is_EOL(ch));
  break;
}

if (is_EOL(ch)) break;

_position = state.position;

while (ch !== 0 && !is_WS_OR_EOL(ch)) {
  ch = state.input.charCodeAt(++state.position);
}

directiveArgs.push(state.input.slice(_position, state.position));
}

if (ch !== 0) readLineBreak(state);

if (_hasOwnProperty$2.call(directiveHandlers, directiveName)) {
directiveHandlers[directiveName](state, directiveName, directiveArgs);
} else {
throwWarning(state, 'unknown document directive "' + directiveName + '"');
}
}

skipSeparationSpace(state, true, -1);

if (state.lineIndent === 0 &&
state.input.charCodeAt(state.position)     === 0x2D/* - */ &&
state.input.charCodeAt(state.position + 1) === 0x2D/* - */ &&
state.input.charCodeAt(state.position + 2) === 0x2D/* - */) {
state.position += 3;
skipSeparationSpace(state, true, -1);

} else if (hasDirectives) {
throwError(state, 'directives end mark is expected');
}

composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
skipSeparationSpace(state, true, -1);

if (state.checkLineBreaks &&
PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
throwWarning(state, 'non-ASCII line breaks are interpreted as content');
}

state.documents.push(state.result);

if (state.position === state.lineStart && testDocumentSeparator(state)) {

if (state.input.charCodeAt(state.position) === 0x2E/* . */) {
state.position += 3;
skipSeparationSpace(state, true, -1);
}
return;
}

if (state.position < (state.length - 1)) {
throwError(state, 'end of the stream or a document separator is expected');
} else {
return;
}
}


function loadDocuments(input, options) {
input = String(input);
options = options || {};

if (input.length !== 0) {

// Add tailing `\n` if not exists
if (input.charCodeAt(input.length - 1) !== 0x0A/* LF */ &&
  input.charCodeAt(input.length - 1) !== 0x0D/* CR */) {
input += '\n';
}

// Strip BOM
if (input.charCodeAt(0) === 0xFEFF) {
input = input.slice(1);
}
}

var state = new State(input, options);

var nullpos = input.indexOf('\0');

if (nullpos !== -1) {
state.position = nullpos;
throwError(state, 'null byte is not allowed in input');
}

// Use 0 as string terminator. That significantly simplifies bounds check.
state.input += '\0';

while (state.input.charCodeAt(state.position) === 0x20/* Space */) {
state.lineIndent += 1;
state.position += 1;
}

while (state.position < (state.length - 1)) {
readDocument(state);
}

return state.documents;
}


function loadAll(input, iterator, options) {
if (iterator !== null && typeof iterator === 'object' && typeof options === 'undefined') {
options = iterator;
iterator = null;
}

var documents = loadDocuments(input, options);

if (typeof iterator !== 'function') {
return documents;
}

for (var index = 0, length = documents.length; index < length; index += 1) {
iterator(documents[index]);
}
}


function load$1(input, options) {
var documents = loadDocuments(input, options);

if (documents.length === 0) {
/*eslint-disable no-undefined*/
return undefined;
} else if (documents.length === 1) {
return documents[0];
}
throw new exception('expected a single document in the stream, but found more');
}


function safeLoadAll(input, iterator, options) {
if (typeof iterator === 'object' && iterator !== null && typeof options === 'undefined') {
options = iterator;
iterator = null;
}

return loadAll(input, iterator, common$3.extend({ schema: default_safe }, options));
}


function safeLoad(input, options) {
return load$1(input, common$3.extend({ schema: default_safe }, options));
}


var loadAll_1     = loadAll;
var load_1        = load$1;
var safeLoadAll_1 = safeLoadAll;
var safeLoad_1    = safeLoad;

var loader = {
loadAll: loadAll_1,
load: load_1,
safeLoadAll: safeLoadAll_1,
safeLoad: safeLoad_1
};

/*eslint-disable no-use-before-define*/






var _toString$2       = Object.prototype.toString;
var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;

var CHAR_TAB                  = 0x09; /* Tab */
var CHAR_LINE_FEED            = 0x0A; /* LF */
var CHAR_CARRIAGE_RETURN      = 0x0D; /* CR */
var CHAR_SPACE                = 0x20; /* Space */
var CHAR_EXCLAMATION          = 0x21; /* ! */
var CHAR_DOUBLE_QUOTE         = 0x22; /* " */
var CHAR_SHARP                = 0x23; /* # */
var CHAR_PERCENT              = 0x25; /* % */
var CHAR_AMPERSAND            = 0x26; /* & */
var CHAR_SINGLE_QUOTE         = 0x27; /* ' */
var CHAR_ASTERISK             = 0x2A; /* * */
var CHAR_COMMA                = 0x2C; /* , */
var CHAR_MINUS                = 0x2D; /* - */
var CHAR_COLON                = 0x3A; /* : */
var CHAR_EQUALS               = 0x3D; /* = */
var CHAR_GREATER_THAN         = 0x3E; /* > */
var CHAR_QUESTION             = 0x3F; /* ? */
var CHAR_COMMERCIAL_AT        = 0x40; /* @ */
var CHAR_LEFT_SQUARE_BRACKET  = 0x5B; /* [ */
var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
var CHAR_GRAVE_ACCENT         = 0x60; /* ` */
var CHAR_LEFT_CURLY_BRACKET   = 0x7B; /* { */
var CHAR_VERTICAL_LINE        = 0x7C; /* | */
var CHAR_RIGHT_CURLY_BRACKET  = 0x7D; /* } */

var ESCAPE_SEQUENCES = {};

ESCAPE_SEQUENCES[0x00]   = '\\0';
ESCAPE_SEQUENCES[0x07]   = '\\a';
ESCAPE_SEQUENCES[0x08]   = '\\b';
ESCAPE_SEQUENCES[0x09]   = '\\t';
ESCAPE_SEQUENCES[0x0A]   = '\\n';
ESCAPE_SEQUENCES[0x0B]   = '\\v';
ESCAPE_SEQUENCES[0x0C]   = '\\f';
ESCAPE_SEQUENCES[0x0D]   = '\\r';
ESCAPE_SEQUENCES[0x1B]   = '\\e';
ESCAPE_SEQUENCES[0x22]   = '\\"';
ESCAPE_SEQUENCES[0x5C]   = '\\\\';
ESCAPE_SEQUENCES[0x85]   = '\\N';
ESCAPE_SEQUENCES[0xA0]   = '\\_';
ESCAPE_SEQUENCES[0x2028] = '\\L';
ESCAPE_SEQUENCES[0x2029] = '\\P';

var DEPRECATED_BOOLEANS_SYNTAX = [
'y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON',
'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'
];

function compileStyleMap(schema, map) {
var result, keys, index, length, tag, style, type;

if (map === null) return {};

result = {};
keys = Object.keys(map);

for (index = 0, length = keys.length; index < length; index += 1) {
tag = keys[index];
style = String(map[tag]);

if (tag.slice(0, 2) === '!!') {
tag = 'tag:yaml.org,2002:' + tag.slice(2);
}
type = schema.compiledTypeMap['fallback'][tag];

if (type && _hasOwnProperty$3.call(type.styleAliases, style)) {
style = type.styleAliases[style];
}

result[tag] = style;
}

return result;
}

function encodeHex(character) {
var string, handle, length;

string = character.toString(16).toUpperCase();

if (character <= 0xFF) {
handle = 'x';
length = 2;
} else if (character <= 0xFFFF) {
handle = 'u';
length = 4;
} else if (character <= 0xFFFFFFFF) {
handle = 'U';
length = 8;
} else {
throw new exception('code point within a string may not be greater than 0xFFFFFFFF');
}

return '\\' + handle + common$3.repeat('0', length - string.length) + string;
}

function State$1(options) {
this.schema        = options['schema'] || default_full;
this.indent        = Math.max(1, (options['indent'] || 2));
this.noArrayIndent = options['noArrayIndent'] || false;
this.skipInvalid   = options['skipInvalid'] || false;
this.flowLevel     = (common$3.isNothing(options['flowLevel']) ? -1 : options['flowLevel']);
this.styleMap      = compileStyleMap(this.schema, options['styles'] || null);
this.sortKeys      = options['sortKeys'] || false;
this.lineWidth     = options['lineWidth'] || 80;
this.noRefs        = options['noRefs'] || false;
this.noCompatMode  = options['noCompatMode'] || false;
this.condenseFlow  = options['condenseFlow'] || false;

this.implicitTypes = this.schema.compiledImplicit;
this.explicitTypes = this.schema.compiledExplicit;

this.tag = null;
this.result = '';

this.duplicates = [];
this.usedDuplicates = null;
}

// Indents every line in a string. Empty lines (\n only) are not indented.
function indentString(string, spaces) {
var ind = common$3.repeat(' ', spaces),
position = 0,
next = -1,
result = '',
line,
length = string.length;

while (position < length) {
next = string.indexOf('\n', position);
if (next === -1) {
line = string.slice(position);
position = length;
} else {
line = string.slice(position, next + 1);
position = next + 1;
}

if (line.length && line !== '\n') result += ind;

result += line;
}

return result;
}

function generateNextLine(state, level) {
return '\n' + common$3.repeat(' ', state.indent * level);
}

function testImplicitResolving(state, str) {
var index, length, type;

for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
type = state.implicitTypes[index];

if (type.resolve(str)) {
return true;
}
}

return false;
}

// [33] s-white ::= s-space | s-tab
function isWhitespace(c) {
return c === CHAR_SPACE || c === CHAR_TAB;
}

// Returns true if the character can be printed without escaping.
// From YAML 1.2: "any allowed characters known to be non-printable
// should also be escaped. [However,] This isn’t mandatory"
// Derived from nb-char - \t - #x85 - #xA0 - #x2028 - #x2029.
function isPrintable(c) {
return  (0x00020 <= c && c <= 0x00007E)
|| ((0x000A1 <= c && c <= 0x00D7FF) && c !== 0x2028 && c !== 0x2029)
|| ((0x0E000 <= c && c <= 0x00FFFD) && c !== 0xFEFF /* BOM */)
||  (0x10000 <= c && c <= 0x10FFFF);
}

// [34] ns-char ::= nb-char - s-white
// [27] nb-char ::= c-printable - b-char - c-byte-order-mark
// [26] b-char  ::= b-line-feed | b-carriage-return
// [24] b-line-feed       ::=     #xA    /* LF */
// [25] b-carriage-return ::=     #xD    /* CR */
// [3]  c-byte-order-mark ::=     #xFEFF
function isNsChar(c) {
return isPrintable(c) && !isWhitespace(c)
// byte-order-mark
&& c !== 0xFEFF
// b-char
&& c !== CHAR_CARRIAGE_RETURN
&& c !== CHAR_LINE_FEED;
}

// Simplified test for values allowed after the first character in plain style.
function isPlainSafe(c, prev) {
// Uses a subset of nb-char - c-flow-indicator - ":" - "#"
// where nb-char ::= c-printable - b-char - c-byte-order-mark.
return isPrintable(c) && c !== 0xFEFF
// - c-flow-indicator
&& c !== CHAR_COMMA
&& c !== CHAR_LEFT_SQUARE_BRACKET
&& c !== CHAR_RIGHT_SQUARE_BRACKET
&& c !== CHAR_LEFT_CURLY_BRACKET
&& c !== CHAR_RIGHT_CURLY_BRACKET
// - ":" - "#"
// /* An ns-char preceding */ "#"
&& c !== CHAR_COLON
&& ((c !== CHAR_SHARP) || (prev && isNsChar(prev)));
}

// Simplified test for values allowed as the first character in plain style.
function isPlainSafeFirst(c) {
// Uses a subset of ns-char - c-indicator
// where ns-char = nb-char - s-white.
return isPrintable(c) && c !== 0xFEFF
&& !isWhitespace(c) // - s-white
// - (c-indicator ::=
// “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
&& c !== CHAR_MINUS
&& c !== CHAR_QUESTION
&& c !== CHAR_COLON
&& c !== CHAR_COMMA
&& c !== CHAR_LEFT_SQUARE_BRACKET
&& c !== CHAR_RIGHT_SQUARE_BRACKET
&& c !== CHAR_LEFT_CURLY_BRACKET
&& c !== CHAR_RIGHT_CURLY_BRACKET
// | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
&& c !== CHAR_SHARP
&& c !== CHAR_AMPERSAND
&& c !== CHAR_ASTERISK
&& c !== CHAR_EXCLAMATION
&& c !== CHAR_VERTICAL_LINE
&& c !== CHAR_EQUALS
&& c !== CHAR_GREATER_THAN
&& c !== CHAR_SINGLE_QUOTE
&& c !== CHAR_DOUBLE_QUOTE
// | “%” | “@” | “`”)
&& c !== CHAR_PERCENT
&& c !== CHAR_COMMERCIAL_AT
&& c !== CHAR_GRAVE_ACCENT;
}

// Determines whether block indentation indicator is required.
function needIndentIndicator(string) {
var leadingSpaceRe = /^\n* /;
return leadingSpaceRe.test(string);
}

var STYLE_PLAIN   = 1,
STYLE_SINGLE  = 2,
STYLE_LITERAL = 3,
STYLE_FOLDED  = 4,
STYLE_DOUBLE  = 5;

// Determines which scalar styles are possible and returns the preferred style.
// lineWidth = -1 => no limit.
// Pre-conditions: str.length > 0.
// Post-conditions:
//    STYLE_PLAIN or STYLE_SINGLE => no \n are in the string.
//    STYLE_LITERAL => no lines are suitable for folding (or lineWidth is -1).
//    STYLE_FOLDED => a line > lineWidth and can be folded (and lineWidth != -1).
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType) {
var i;
var char, prev_char;
var hasLineBreak = false;
var hasFoldableLine = false; // only checked if shouldTrackWidth
var shouldTrackWidth = lineWidth !== -1;
var previousLineBreak = -1; // count the first line correctly
var plain = isPlainSafeFirst(string.charCodeAt(0))
    && !isWhitespace(string.charCodeAt(string.length - 1));

if (singleLineOnly) {
// Case: no block styles.
// Check for disallowed characters to rule out plain and single.
for (i = 0; i < string.length; i++) {
char = string.charCodeAt(i);
if (!isPrintable(char)) {
  return STYLE_DOUBLE;
}
prev_char = i > 0 ? string.charCodeAt(i - 1) : null;
plain = plain && isPlainSafe(char, prev_char);
}
} else {
// Case: block styles permitted.
for (i = 0; i < string.length; i++) {
char = string.charCodeAt(i);
if (char === CHAR_LINE_FEED) {
  hasLineBreak = true;
  // Check if any line can be folded.
  if (shouldTrackWidth) {
    hasFoldableLine = hasFoldableLine ||
      // Foldable line = too long, and not more-indented.
      (i - previousLineBreak - 1 > lineWidth &&
       string[previousLineBreak + 1] !== ' ');
    previousLineBreak = i;
  }
} else if (!isPrintable(char)) {
  return STYLE_DOUBLE;
}
prev_char = i > 0 ? string.charCodeAt(i - 1) : null;
plain = plain && isPlainSafe(char, prev_char);
}
// in case the end is missing a \n
hasFoldableLine = hasFoldableLine || (shouldTrackWidth &&
(i - previousLineBreak - 1 > lineWidth &&
 string[previousLineBreak + 1] !== ' '));
}
// Although every style can represent \n without escaping, prefer block styles
// for multiline, since they're more readable and they don't add empty lines.
// Also prefer folding a super-long line.
if (!hasLineBreak && !hasFoldableLine) {
// Strings interpretable as another type have to be quoted;
// e.g. the string 'true' vs. the boolean true.
return plain && !testAmbiguousType(string)
? STYLE_PLAIN : STYLE_SINGLE;
}
// Edge case: block indentation indicator can only have one digit.
if (indentPerLevel > 9 && needIndentIndicator(string)) {
return STYLE_DOUBLE;
}
// At this point we know block styles are valid.
// Prefer literal style unless we want to fold.
return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
}

// Note: line breaking/folding is implemented for only the folded style.
// NB. We drop the last trailing newline (if any) of a returned block scalar
//  since the dumper adds its own newline. This always works:
//    • No ending newline => unaffected; already using strip "-" chomping.
//    • Ending newline    => removed then restored.
//  Importantly, this keeps the "+" chomp indicator from gaining an extra line.
function writeScalar(state, string, level, iskey) {
state.dump = (function () {
if (string.length === 0) {
return "''";
}
if (!state.noCompatMode &&
  DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1) {
return "'" + string + "'";
}

var indent = state.indent * Math.max(1, level); // no 0-indent scalars
// As indentation gets deeper, let the width decrease monotonically
// to the lower bound min(state.lineWidth, 40).
// Note that this implies
//  state.lineWidth ≤ 40 + state.indent: width is fixed at the lower bound.
//  state.lineWidth > 40 + state.indent: width decreases until the lower bound.
// This behaves better than a constant minimum width which disallows narrower options,
// or an indent threshold which causes the width to suddenly increase.
var lineWidth = state.lineWidth === -1
? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);

// Without knowing if keys are implicit/explicit, assume implicit for safety.
var singleLineOnly = iskey
// No block styles in flow mode.
|| (state.flowLevel > -1 && level >= state.flowLevel);
function testAmbiguity(string) {
return testImplicitResolving(state, string);
}

switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity)) {
case STYLE_PLAIN:
  return string;
case STYLE_SINGLE:
  return "'" + string.replace(/'/g, "''") + "'";
case STYLE_LITERAL:
  return '|' + blockHeader(string, state.indent)
    + dropEndingNewline(indentString(string, indent));
case STYLE_FOLDED:
  return '>' + blockHeader(string, state.indent)
    + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
case STYLE_DOUBLE:
  return '"' + escapeString(string) + '"';
default:
  throw new exception('impossible error: invalid scalar style');
}
}());
}

// Pre-conditions: string is valid for a block scalar, 1 <= indentPerLevel <= 9.
function blockHeader(string, indentPerLevel) {
var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : '';

// note the special case: the string '\n' counts as a "trailing" empty line.
var clip =          string[string.length - 1] === '\n';
var keep = clip && (string[string.length - 2] === '\n' || string === '\n');
var chomp = keep ? '+' : (clip ? '' : '-');

return indentIndicator + chomp + '\n';
}

// (See the note for writeScalar.)
function dropEndingNewline(string) {
return string[string.length - 1] === '\n' ? string.slice(0, -1) : string;
}

// Note: a long line without a suitable break point will exceed the width limit.
// Pre-conditions: every char in str isPrintable, str.length > 0, width > 0.
function foldString(string, width) {
// In folded style, $k$ consecutive newlines output as $k+1$ newlines—
// unless they're before or after a more-indented line, or at the very
// beginning or end, in which case $k$ maps to $k$.
// Therefore, parse each chunk as newline(s) followed by a content line.
var lineRe = /(\n+)([^\n]*)/g;

// first line (possibly an empty line)
var result = (function () {
var nextLF = string.indexOf('\n');
nextLF = nextLF !== -1 ? nextLF : string.length;
lineRe.lastIndex = nextLF;
return foldLine(string.slice(0, nextLF), width);
}());
// If we haven't reached the first content line yet, don't add an extra \n.
var prevMoreIndented = string[0] === '\n' || string[0] === ' ';
var moreIndented;

// rest of the lines
var match;
while ((match = lineRe.exec(string))) {
var prefix = match[1], line = match[2];
moreIndented = (line[0] === ' ');
result += prefix
+ (!prevMoreIndented && !moreIndented && line !== ''
  ? '\n' : '')
+ foldLine(line, width);
prevMoreIndented = moreIndented;
}

return result;
}

// Greedy line breaking.
// Picks the longest line under the limit each time,
// otherwise settles for the shortest line over the limit.
// NB. More-indented lines *cannot* be folded, as that would add an extra \n.
function foldLine(line, width) {
if (line === '' || line[0] === ' ') return line;

// Since a more-indented line adds a \n, breaks can't be followed by a space.
var breakRe = / [^ ]/g; // note: the match index will always be <= length-2.
var match;
// start is an inclusive index. end, curr, and next are exclusive.
var start = 0, end, curr = 0, next = 0;
var result = '';

// Invariants: 0 <= start <= length-1.
//   0 <= curr <= next <= max(0, length-2). curr - start <= width.
// Inside the loop:
//   A match implies length >= 2, so curr and next are <= length-2.
while ((match = breakRe.exec(line))) {
next = match.index;
// maintain invariant: curr - start <= width
if (next - start > width) {
end = (curr > start) ? curr : next; // derive end <= length-2
result += '\n' + line.slice(start, end);
// skip the space that was output as \n
start = end + 1;                    // derive start <= length-1
}
curr = next;
}

// By the invariants, start <= length-1, so there is something left over.
// It is either the whole string or a part starting from non-whitespace.
result += '\n';
// Insert a break if the remainder is too long and there is a break available.
if (line.length - start > width && curr > start) {
result += line.slice(start, curr) + '\n' + line.slice(curr + 1);
} else {
result += line.slice(start);
}

return result.slice(1); // drop extra \n joiner
}

// Escapes a double-quoted string.
function escapeString(string) {
var result = '';
var char, nextChar;
var escapeSeq;

for (var i = 0; i < string.length; i++) {
char = string.charCodeAt(i);
// Check for surrogate pairs (reference Unicode 3.0 section "3.7 Surrogates").
if (char >= 0xD800 && char <= 0xDBFF/* high surrogate */) {
nextChar = string.charCodeAt(i + 1);
if (nextChar >= 0xDC00 && nextChar <= 0xDFFF/* low surrogate */) {
  // Combine the surrogate pair and store it escaped.
  result += encodeHex((char - 0xD800) * 0x400 + nextChar - 0xDC00 + 0x10000);
  // Advance index one extra since we already used that char here.
  i++; continue;
}
}
escapeSeq = ESCAPE_SEQUENCES[char];
result += !escapeSeq && isPrintable(char)
? string[i]
: escapeSeq || encodeHex(char);
}

return result;
}

function writeFlowSequence(state, level, object) {
var _result = '',
_tag    = state.tag,
index,
length;

for (index = 0, length = object.length; index < length; index += 1) {
// Write only valid elements.
if (writeNode(state, level, object[index], false, false)) {
if (index !== 0) _result += ',' + (!state.condenseFlow ? ' ' : '');
_result += state.dump;
}
}

state.tag = _tag;
state.dump = '[' + _result + ']';
}

function writeBlockSequence(state, level, object, compact) {
var _result = '',
_tag    = state.tag,
index,
length;

for (index = 0, length = object.length; index < length; index += 1) {
// Write only valid elements.
if (writeNode(state, level + 1, object[index], true, true)) {
if (!compact || index !== 0) {
  _result += generateNextLine(state, level);
}

if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
  _result += '-';
} else {
  _result += '- ';
}

_result += state.dump;
}
}

state.tag = _tag;
state.dump = _result || '[]'; // Empty sequence if no valid values.
}

function writeFlowMapping(state, level, object) {
var _result       = '',
_tag          = state.tag,
objectKeyList = Object.keys(object),
index,
length,
objectKey,
objectValue,
pairBuffer;

for (index = 0, length = objectKeyList.length; index < length; index += 1) {

pairBuffer = '';
if (index !== 0) pairBuffer += ', ';

if (state.condenseFlow) pairBuffer += '"';

objectKey = objectKeyList[index];
objectValue = object[objectKey];

if (!writeNode(state, level, objectKey, false, false)) {
continue; // Skip this pair because of invalid key;
}

if (state.dump.length > 1024) pairBuffer += '? ';

pairBuffer += state.dump + (state.condenseFlow ? '"' : '') + ':' + (state.condenseFlow ? '' : ' ');

if (!writeNode(state, level, objectValue, false, false)) {
continue; // Skip this pair because of invalid value.
}

pairBuffer += state.dump;

// Both key and value are valid.
_result += pairBuffer;
}

state.tag = _tag;
state.dump = '{' + _result + '}';
}

function writeBlockMapping(state, level, object, compact) {
var _result       = '',
_tag          = state.tag,
objectKeyList = Object.keys(object),
index,
length,
objectKey,
objectValue,
explicitPair,
pairBuffer;

// Allow sorting keys so that the output file is deterministic
if (state.sortKeys === true) {
// Default sorting
objectKeyList.sort();
} else if (typeof state.sortKeys === 'function') {
// Custom sort function
objectKeyList.sort(state.sortKeys);
} else if (state.sortKeys) {
// Something is wrong
throw new exception('sortKeys must be a boolean or a function');
}

for (index = 0, length = objectKeyList.length; index < length; index += 1) {
pairBuffer = '';

if (!compact || index !== 0) {
pairBuffer += generateNextLine(state, level);
}

objectKey = objectKeyList[index];
objectValue = object[objectKey];

if (!writeNode(state, level + 1, objectKey, true, true, true)) {
continue; // Skip this pair because of invalid key.
}

explicitPair = (state.tag !== null && state.tag !== '?') ||
             (state.dump && state.dump.length > 1024);

if (explicitPair) {
if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
  pairBuffer += '?';
} else {
  pairBuffer += '? ';
}
}

pairBuffer += state.dump;

if (explicitPair) {
pairBuffer += generateNextLine(state, level);
}

if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
continue; // Skip this pair because of invalid value.
}

if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
pairBuffer += ':';
} else {
pairBuffer += ': ';
}

pairBuffer += state.dump;

// Both key and value are valid.
_result += pairBuffer;
}

state.tag = _tag;
state.dump = _result || '{}'; // Empty mapping if no valid pairs.
}

function detectType(state, object, explicit) {
var _result, typeList, index, length, type, style;

typeList = explicit ? state.explicitTypes : state.implicitTypes;

for (index = 0, length = typeList.length; index < length; index += 1) {
type = typeList[index];

if ((type.instanceOf  || type.predicate) &&
  (!type.instanceOf || ((typeof object === 'object') && (object instanceof type.instanceOf))) &&
  (!type.predicate  || type.predicate(object))) {

state.tag = explicit ? type.tag : '?';

if (type.represent) {
  style = state.styleMap[type.tag] || type.defaultStyle;

  if (_toString$2.call(type.represent) === '[object Function]') {
    _result = type.represent(object, style);
  } else if (_hasOwnProperty$3.call(type.represent, style)) {
    _result = type.represent[style](object, style);
  } else {
    throw new exception('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
  }

  state.dump = _result;
}

return true;
}
}

return false;
}

// Serializes `object` and writes it to global `result`.
// Returns true on success, or false on invalid object.
//
function writeNode(state, level, object, block, compact, iskey) {
state.tag = null;
state.dump = object;

if (!detectType(state, object, false)) {
detectType(state, object, true);
}

var type = _toString$2.call(state.dump);

if (block) {
block = (state.flowLevel < 0 || state.flowLevel > level);
}

var objectOrArray = type === '[object Object]' || type === '[object Array]',
duplicateIndex,
duplicate;

if (objectOrArray) {
duplicateIndex = state.duplicates.indexOf(object);
duplicate = duplicateIndex !== -1;
}

if ((state.tag !== null && state.tag !== '?') || duplicate || (state.indent !== 2 && level > 0)) {
compact = false;
}

if (duplicate && state.usedDuplicates[duplicateIndex]) {
state.dump = '*ref_' + duplicateIndex;
} else {
if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
state.usedDuplicates[duplicateIndex] = true;
}
if (type === '[object Object]') {
if (block && (Object.keys(state.dump).length !== 0)) {
  writeBlockMapping(state, level, state.dump, compact);
  if (duplicate) {
    state.dump = '&ref_' + duplicateIndex + state.dump;
  }
} else {
  writeFlowMapping(state, level, state.dump);
  if (duplicate) {
    state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
  }
}
} else if (type === '[object Array]') {
var arrayLevel = (state.noArrayIndent && (level > 0)) ? level - 1 : level;
if (block && (state.dump.length !== 0)) {
  writeBlockSequence(state, arrayLevel, state.dump, compact);
  if (duplicate) {
    state.dump = '&ref_' + duplicateIndex + state.dump;
  }
} else {
  writeFlowSequence(state, arrayLevel, state.dump);
  if (duplicate) {
    state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
  }
}
} else if (type === '[object String]') {
if (state.tag !== '?') {
  writeScalar(state, state.dump, level, iskey);
}
} else {
if (state.skipInvalid) return false;
throw new exception('unacceptable kind of an object to dump ' + type);
}

if (state.tag !== null && state.tag !== '?') {
state.dump = '!<' + state.tag + '> ' + state.dump;
}
}

return true;
}

function getDuplicateReferences(object, state) {
var objects = [],
duplicatesIndexes = [],
index,
length;

inspectNode(object, objects, duplicatesIndexes);

for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
state.duplicates.push(objects[duplicatesIndexes[index]]);
}
state.usedDuplicates = new Array(length);
}

function inspectNode(object, objects, duplicatesIndexes) {
var objectKeyList,
index,
length;

if (object !== null && typeof object === 'object') {
index = objects.indexOf(object);
if (index !== -1) {
if (duplicatesIndexes.indexOf(index) === -1) {
  duplicatesIndexes.push(index);
}
} else {
objects.push(object);

if (Array.isArray(object)) {
  for (index = 0, length = object.length; index < length; index += 1) {
    inspectNode(object[index], objects, duplicatesIndexes);
  }
} else {
  objectKeyList = Object.keys(object);

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
  }
}
}
}
}

function dump(input, options) {
options = options || {};

var state = new State$1(options);

if (!state.noRefs) getDuplicateReferences(input, state);

if (writeNode(state, 0, input, true, true)) return state.dump + '\n';

return '';
}

function safeDump(input, options) {
return dump(input, common$3.extend({ schema: default_safe }, options));
}

var dump_1     = dump;
var safeDump_1 = safeDump;

var dumper = {
dump: dump_1,
safeDump: safeDump_1
};

function deprecated(name) {
return function () {
throw new Error('Function ' + name + ' is deprecated and cannot be used.');
};
}


var Type$1                = type;
var Schema$1              = schema;
var FAILSAFE_SCHEMA     = failsafe;
var JSON_SCHEMA         = json;
var CORE_SCHEMA         = core;
var DEFAULT_SAFE_SCHEMA = default_safe;
var DEFAULT_FULL_SCHEMA = default_full;
var load$2                = loader.load;
var loadAll$1             = loader.loadAll;
var safeLoad$1            = loader.safeLoad;
var safeLoadAll$1         = loader.safeLoadAll;
var dump$1                = dumper.dump;
var safeDump$1            = dumper.safeDump;
var YAMLException$1       = exception;

// Deprecated schema names from JS-YAML 2.0.x
var MINIMAL_SCHEMA = failsafe;
var SAFE_SCHEMA    = default_safe;
var DEFAULT_SCHEMA = default_full;

// Deprecated functions from JS-YAML 1.x.x
var scan           = deprecated('scan');
var parse$4          = deprecated('parse');
var compose        = deprecated('compose');
var addConstructor = deprecated('addConstructor');

var jsYaml = {
Type: Type$1,
Schema: Schema$1,
FAILSAFE_SCHEMA: FAILSAFE_SCHEMA,
JSON_SCHEMA: JSON_SCHEMA,
CORE_SCHEMA: CORE_SCHEMA,
DEFAULT_SAFE_SCHEMA: DEFAULT_SAFE_SCHEMA,
DEFAULT_FULL_SCHEMA: DEFAULT_FULL_SCHEMA,
load: load$2,
loadAll: loadAll$1,
safeLoad: safeLoad$1,
safeLoadAll: safeLoadAll$1,
dump: dump$1,
safeDump: safeDump$1,
YAMLException: YAMLException$1,
MINIMAL_SCHEMA: MINIMAL_SCHEMA,
SAFE_SCHEMA: SAFE_SCHEMA,
DEFAULT_SCHEMA: DEFAULT_SCHEMA,
scan: scan,
parse: parse$4,
compose: compose,
addConstructor: addConstructor
};

var jsYaml$1 = jsYaml;

var colorName = {
"aliceblue": [240, 248, 255],
"antiquewhite": [250, 235, 215],
"aqua": [0, 255, 255],
"aquamarine": [127, 255, 212],
"azure": [240, 255, 255],
"beige": [245, 245, 220],
"bisque": [255, 228, 196],
"black": [0, 0, 0],
"blanchedalmond": [255, 235, 205],
"blue": [0, 0, 255],
"blueviolet": [138, 43, 226],
"brown": [165, 42, 42],
"burlywood": [222, 184, 135],
"cadetblue": [95, 158, 160],
"chartreuse": [127, 255, 0],
"chocolate": [210, 105, 30],
"coral": [255, 127, 80],
"cornflowerblue": [100, 149, 237],
"cornsilk": [255, 248, 220],
"crimson": [220, 20, 60],
"cyan": [0, 255, 255],
"darkblue": [0, 0, 139],
"darkcyan": [0, 139, 139],
"darkgoldenrod": [184, 134, 11],
"darkgray": [169, 169, 169],
"darkgreen": [0, 100, 0],
"darkgrey": [169, 169, 169],
"darkkhaki": [189, 183, 107],
"darkmagenta": [139, 0, 139],
"darkolivegreen": [85, 107, 47],
"darkorange": [255, 140, 0],
"darkorchid": [153, 50, 204],
"darkred": [139, 0, 0],
"darksalmon": [233, 150, 122],
"darkseagreen": [143, 188, 143],
"darkslateblue": [72, 61, 139],
"darkslategray": [47, 79, 79],
"darkslategrey": [47, 79, 79],
"darkturquoise": [0, 206, 209],
"darkviolet": [148, 0, 211],
"deeppink": [255, 20, 147],
"deepskyblue": [0, 191, 255],
"dimgray": [105, 105, 105],
"dimgrey": [105, 105, 105],
"dodgerblue": [30, 144, 255],
"firebrick": [178, 34, 34],
"floralwhite": [255, 250, 240],
"forestgreen": [34, 139, 34],
"fuchsia": [255, 0, 255],
"gainsboro": [220, 220, 220],
"ghostwhite": [248, 248, 255],
"gold": [255, 215, 0],
"goldenrod": [218, 165, 32],
"gray": [128, 128, 128],
"green": [0, 128, 0],
"greenyellow": [173, 255, 47],
"grey": [128, 128, 128],
"honeydew": [240, 255, 240],
"hotpink": [255, 105, 180],
"indianred": [205, 92, 92],
"indigo": [75, 0, 130],
"ivory": [255, 255, 240],
"khaki": [240, 230, 140],
"lavender": [230, 230, 250],
"lavenderblush": [255, 240, 245],
"lawngreen": [124, 252, 0],
"lemonchiffon": [255, 250, 205],
"lightblue": [173, 216, 230],
"lightcoral": [240, 128, 128],
"lightcyan": [224, 255, 255],
"lightgoldenrodyellow": [250, 250, 210],
"lightgray": [211, 211, 211],
"lightgreen": [144, 238, 144],
"lightgrey": [211, 211, 211],
"lightpink": [255, 182, 193],
"lightsalmon": [255, 160, 122],
"lightseagreen": [32, 178, 170],
"lightskyblue": [135, 206, 250],
"lightslategray": [119, 136, 153],
"lightslategrey": [119, 136, 153],
"lightsteelblue": [176, 196, 222],
"lightyellow": [255, 255, 224],
"lime": [0, 255, 0],
"limegreen": [50, 205, 50],
"linen": [250, 240, 230],
"magenta": [255, 0, 255],
"maroon": [128, 0, 0],
"mediumaquamarine": [102, 205, 170],
"mediumblue": [0, 0, 205],
"mediumorchid": [186, 85, 211],
"mediumpurple": [147, 112, 219],
"mediumseagreen": [60, 179, 113],
"mediumslateblue": [123, 104, 238],
"mediumspringgreen": [0, 250, 154],
"mediumturquoise": [72, 209, 204],
"mediumvioletred": [199, 21, 133],
"midnightblue": [25, 25, 112],
"mintcream": [245, 255, 250],
"mistyrose": [255, 228, 225],
"moccasin": [255, 228, 181],
"navajowhite": [255, 222, 173],
"navy": [0, 0, 128],
"oldlace": [253, 245, 230],
"olive": [128, 128, 0],
"olivedrab": [107, 142, 35],
"orange": [255, 165, 0],
"orangered": [255, 69, 0],
"orchid": [218, 112, 214],
"palegoldenrod": [238, 232, 170],
"palegreen": [152, 251, 152],
"paleturquoise": [175, 238, 238],
"palevioletred": [219, 112, 147],
"papayawhip": [255, 239, 213],
"peachpuff": [255, 218, 185],
"peru": [205, 133, 63],
"pink": [255, 192, 203],
"plum": [221, 160, 221],
"powderblue": [176, 224, 230],
"purple": [128, 0, 128],
"rebeccapurple": [102, 51, 153],
"red": [255, 0, 0],
"rosybrown": [188, 143, 143],
"royalblue": [65, 105, 225],
"saddlebrown": [139, 69, 19],
"salmon": [250, 128, 114],
"sandybrown": [244, 164, 96],
"seagreen": [46, 139, 87],
"seashell": [255, 245, 238],
"sienna": [160, 82, 45],
"silver": [192, 192, 192],
"skyblue": [135, 206, 235],
"slateblue": [106, 90, 205],
"slategray": [112, 128, 144],
"slategrey": [112, 128, 144],
"snow": [255, 250, 250],
"springgreen": [0, 255, 127],
"steelblue": [70, 130, 180],
"tan": [210, 180, 140],
"teal": [0, 128, 128],
"thistle": [216, 191, 216],
"tomato": [255, 99, 71],
"turquoise": [64, 224, 208],
"violet": [238, 130, 238],
"wheat": [245, 222, 179],
"white": [255, 255, 255],
"whitesmoke": [245, 245, 245],
"yellow": [255, 255, 0],
"yellowgreen": [154, 205, 50]
};

/* MIT license */

/* eslint-disable no-mixed-operators */


// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

const reverseKeywords = {};
for (const key of Object.keys(colorName)) {
reverseKeywords[colorName[key]] = key;
}

const convert = {
rgb: {channels: 3, labels: 'rgb'},
hsl: {channels: 3, labels: 'hsl'},
hsv: {channels: 3, labels: 'hsv'},
hwb: {channels: 3, labels: 'hwb'},
cmyk: {channels: 4, labels: 'cmyk'},
xyz: {channels: 3, labels: 'xyz'},
lab: {channels: 3, labels: 'lab'},
lch: {channels: 3, labels: 'lch'},
hex: {channels: 1, labels: ['hex']},
keyword: {channels: 1, labels: ['keyword']},
ansi16: {channels: 1, labels: ['ansi16']},
ansi256: {channels: 1, labels: ['ansi256']},
hcg: {channels: 3, labels: ['h', 'c', 'g']},
apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
gray: {channels: 1, labels: ['gray']}
};

var conversions = convert;

// Hide .channels and .labels properties
for (const model of Object.keys(convert)) {
if (!('channels' in convert[model])) {
throw new Error('missing channels property: ' + model);
}

if (!('labels' in convert[model])) {
throw new Error('missing channel labels property: ' + model);
}

if (convert[model].labels.length !== convert[model].channels) {
throw new Error('channel and label counts mismatch: ' + model);
}

const {channels, labels} = convert[model];
delete convert[model].channels;
delete convert[model].labels;
Object.defineProperty(convert[model], 'channels', {value: channels});
Object.defineProperty(convert[model], 'labels', {value: labels});
}

convert.rgb.hsl = function (rgb) {
const r = rgb[0] / 255;
const g = rgb[1] / 255;
const b = rgb[2] / 255;
const min = Math.min(r, g, b);
const max = Math.max(r, g, b);
const delta = max - min;
let h;
let s;

if (max === min) {
h = 0;
} else if (r === max) {
h = (g - b) / delta;
} else if (g === max) {
h = 2 + (b - r) / delta;
} else if (b === max) {
h = 4 + (r - g) / delta;
}

h = Math.min(h * 60, 360);

if (h < 0) {
h += 360;
}

const l = (min + max) / 2;

if (max === min) {
s = 0;
} else if (l <= 0.5) {
s = delta / (max + min);
} else {
s = delta / (2 - max - min);
}

return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
let rdif;
let gdif;
let bdif;
let h;
let s;

const r = rgb[0] / 255;
const g = rgb[1] / 255;
const b = rgb[2] / 255;
const v = Math.max(r, g, b);
const diff = v - Math.min(r, g, b);
const diffc = function (c) {
return (v - c) / 6 / diff + 1 / 2;
};

if (diff === 0) {
h = 0;
s = 0;
} else {
s = diff / v;
rdif = diffc(r);
gdif = diffc(g);
bdif = diffc(b);

if (r === v) {
h = bdif - gdif;
} else if (g === v) {
h = (1 / 3) + rdif - bdif;
} else if (b === v) {
h = (2 / 3) + gdif - rdif;
}

if (h < 0) {
h += 1;
} else if (h > 1) {
h -= 1;
}
}

return [
h * 360,
s * 100,
v * 100
];
};

convert.rgb.hwb = function (rgb) {
const r = rgb[0];
const g = rgb[1];
let b = rgb[2];
const h = convert.rgb.hsl(rgb)[0];
const w = 1 / 255 * Math.min(r, Math.min(g, b));

b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
const r = rgb[0] / 255;
const g = rgb[1] / 255;
const b = rgb[2] / 255;

const k = Math.min(1 - r, 1 - g, 1 - b);
const c = (1 - r - k) / (1 - k) || 0;
const m = (1 - g - k) / (1 - k) || 0;
const y = (1 - b - k) / (1 - k) || 0;

return [c * 100, m * 100, y * 100, k * 100];
};

function comparativeDistance(x, y) {
/*
See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
*/
return (
((x[0] - y[0]) ** 2) +
((x[1] - y[1]) ** 2) +
((x[2] - y[2]) ** 2)
);
}

convert.rgb.keyword = function (rgb) {
const reversed = reverseKeywords[rgb];
if (reversed) {
return reversed;
}

let currentClosestDistance = Infinity;
let currentClosestKeyword;

for (const keyword of Object.keys(colorName)) {
const value = colorName[keyword];

// Compute comparative distance
const distance = comparativeDistance(rgb, value);

// Check if its less, if so set as closest
if (distance < currentClosestDistance) {
currentClosestDistance = distance;
currentClosestKeyword = keyword;
}
}

return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
return colorName[keyword];
};

convert.rgb.xyz = function (rgb) {
let r = rgb[0] / 255;
let g = rgb[1] / 255;
let b = rgb[2] / 255;

// Assume sRGB
r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
const xyz = convert.rgb.xyz(rgb);
let x = xyz[0];
let y = xyz[1];
let z = xyz[2];

x /= 95.047;
y /= 100;
z /= 108.883;

x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

const l = (116 * y) - 16;
const a = 500 * (x - y);
const b = 200 * (y - z);

return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
const h = hsl[0] / 360;
const s = hsl[1] / 100;
const l = hsl[2] / 100;
let t2;
let t3;
let val;

if (s === 0) {
val = l * 255;
return [val, val, val];
}

if (l < 0.5) {
t2 = l * (1 + s);
} else {
t2 = l + s - l * s;
}

const t1 = 2 * l - t2;

const rgb = [0, 0, 0];
for (let i = 0; i < 3; i++) {
t3 = h + 1 / 3 * -(i - 1);
if (t3 < 0) {
t3++;
}

if (t3 > 1) {
t3--;
}

if (6 * t3 < 1) {
val = t1 + (t2 - t1) * 6 * t3;
} else if (2 * t3 < 1) {
val = t2;
} else if (3 * t3 < 2) {
val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
} else {
val = t1;
}

rgb[i] = val * 255;
}

return rgb;
};

convert.hsl.hsv = function (hsl) {
const h = hsl[0];
let s = hsl[1] / 100;
let l = hsl[2] / 100;
let smin = s;
const lmin = Math.max(l, 0.01);

l *= 2;
s *= (l <= 1) ? l : 2 - l;
smin *= lmin <= 1 ? lmin : 2 - lmin;
const v = (l + s) / 2;
const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
const h = hsv[0] / 60;
const s = hsv[1] / 100;
let v = hsv[2] / 100;
const hi = Math.floor(h) % 6;

const f = h - Math.floor(h);
const p = 255 * v * (1 - s);
const q = 255 * v * (1 - (s * f));
const t = 255 * v * (1 - (s * (1 - f)));
v *= 255;

switch (hi) {
case 0:
return [v, t, p];
case 1:
return [q, v, p];
case 2:
return [p, v, t];
case 3:
return [p, q, v];
case 4:
return [t, p, v];
case 5:
return [v, p, q];
}
};

convert.hsv.hsl = function (hsv) {
const h = hsv[0];
const s = hsv[1] / 100;
const v = hsv[2] / 100;
const vmin = Math.max(v, 0.01);
let sl;
let l;

l = (2 - s) * v;
const lmin = (2 - s) * vmin;
sl = s * vmin;
sl /= (lmin <= 1) ? lmin : 2 - lmin;
sl = sl || 0;
l /= 2;

return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
const h = hwb[0] / 360;
let wh = hwb[1] / 100;
let bl = hwb[2] / 100;
const ratio = wh + bl;
let f;

// Wh + bl cant be > 1
if (ratio > 1) {
wh /= ratio;
bl /= ratio;
}

const i = Math.floor(6 * h);
const v = 1 - bl;
f = 6 * h - i;

if ((i & 0x01) !== 0) {
f = 1 - f;
}

const n = wh + f * (v - wh); // Linear interpolation

let r;
let g;
let b;
/* eslint-disable max-statements-per-line,no-multi-spaces */
switch (i) {
default:
case 6:
case 0: r = v;  g = n;  b = wh; break;
case 1: r = n;  g = v;  b = wh; break;
case 2: r = wh; g = v;  b = n; break;
case 3: r = wh; g = n;  b = v; break;
case 4: r = n;  g = wh; b = v; break;
case 5: r = v;  g = wh; b = n; break;
}
/* eslint-enable max-statements-per-line,no-multi-spaces */

return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
const c = cmyk[0] / 100;
const m = cmyk[1] / 100;
const y = cmyk[2] / 100;
const k = cmyk[3] / 100;

const r = 1 - Math.min(1, c * (1 - k) + k);
const g = 1 - Math.min(1, m * (1 - k) + k);
const b = 1 - Math.min(1, y * (1 - k) + k);

return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
const x = xyz[0] / 100;
const y = xyz[1] / 100;
const z = xyz[2] / 100;
let r;
let g;
let b;

r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

// Assume sRGB
r = r > 0.0031308
? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
: r * 12.92;

g = g > 0.0031308
? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
: g * 12.92;

b = b > 0.0031308
? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
: b * 12.92;

r = Math.min(Math.max(0, r), 1);
g = Math.min(Math.max(0, g), 1);
b = Math.min(Math.max(0, b), 1);

return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
let x = xyz[0];
let y = xyz[1];
let z = xyz[2];

x /= 95.047;
y /= 100;
z /= 108.883;

x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

const l = (116 * y) - 16;
const a = 500 * (x - y);
const b = 200 * (y - z);

return [l, a, b];
};

convert.lab.xyz = function (lab) {
const l = lab[0];
const a = lab[1];
const b = lab[2];
let x;
let y;
let z;

y = (l + 16) / 116;
x = a / 500 + y;
z = y - b / 200;

const y2 = y ** 3;
const x2 = x ** 3;
const z2 = z ** 3;
y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

x *= 95.047;
y *= 100;
z *= 108.883;

return [x, y, z];
};

convert.lab.lch = function (lab) {
const l = lab[0];
const a = lab[1];
const b = lab[2];
let h;

const hr = Math.atan2(b, a);
h = hr * 360 / 2 / Math.PI;

if (h < 0) {
h += 360;
}

const c = Math.sqrt(a * a + b * b);

return [l, c, h];
};

convert.lch.lab = function (lch) {
const l = lch[0];
const c = lch[1];
const h = lch[2];

const hr = h / 360 * 2 * Math.PI;
const a = c * Math.cos(hr);
const b = c * Math.sin(hr);

return [l, a, b];
};

convert.rgb.ansi16 = function (args, saturation = null) {
const [r, g, b] = args;
let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

value = Math.round(value / 50);

if (value === 0) {
return 30;
}

let ansi = 30
+ ((Math.round(b / 255) << 2)
| (Math.round(g / 255) << 1)
| Math.round(r / 255));

if (value === 2) {
ansi += 60;
}

return ansi;
};

convert.hsv.ansi16 = function (args) {
// Optimization here; we already know the value and don't need to get
// it converted for us.
return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
const r = args[0];
const g = args[1];
const b = args[2];

// We use the extended greyscale palette here, with the exception of
// black and white. normal palette only has 4 greyscale shades.
if (r === g && g === b) {
if (r < 8) {
return 16;
}

if (r > 248) {
return 231;
}

return Math.round(((r - 8) / 247) * 24) + 232;
}

const ansi = 16
+ (36 * Math.round(r / 255 * 5))
+ (6 * Math.round(g / 255 * 5))
+ Math.round(b / 255 * 5);

return ansi;
};

convert.ansi16.rgb = function (args) {
let color = args % 10;

// Handle greyscale
if (color === 0 || color === 7) {
if (args > 50) {
color += 3.5;
}

color = color / 10.5 * 255;

return [color, color, color];
}

const mult = (~~(args > 50) + 1) * 0.5;
const r = ((color & 1) * mult) * 255;
const g = (((color >> 1) & 1) * mult) * 255;
const b = (((color >> 2) & 1) * mult) * 255;

return [r, g, b];
};

convert.ansi256.rgb = function (args) {
// Handle greyscale
if (args >= 232) {
const c = (args - 232) * 10 + 8;
return [c, c, c];
}

args -= 16;

let rem;
const r = Math.floor(args / 36) / 5 * 255;
const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
const b = (rem % 6) / 5 * 255;

return [r, g, b];
};

convert.rgb.hex = function (args) {
const integer = ((Math.round(args[0]) & 0xFF) << 16)
+ ((Math.round(args[1]) & 0xFF) << 8)
+ (Math.round(args[2]) & 0xFF);

const string = integer.toString(16).toUpperCase();
return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
if (!match) {
return [0, 0, 0];
}

let colorString = match[0];

if (match[0].length === 3) {
colorString = colorString.split('').map(char => {
return char + char;
}).join('');
}

const integer = parseInt(colorString, 16);
const r = (integer >> 16) & 0xFF;
const g = (integer >> 8) & 0xFF;
const b = integer & 0xFF;

return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
const r = rgb[0] / 255;
const g = rgb[1] / 255;
const b = rgb[2] / 255;
const max = Math.max(Math.max(r, g), b);
const min = Math.min(Math.min(r, g), b);
const chroma = (max - min);
let grayscale;
let hue;

if (chroma < 1) {
grayscale = min / (1 - chroma);
} else {
grayscale = 0;
}

if (chroma <= 0) {
hue = 0;
} else
if (max === r) {
hue = ((g - b) / chroma) % 6;
} else
if (max === g) {
hue = 2 + (b - r) / chroma;
} else {
hue = 4 + (r - g) / chroma;
}

hue /= 6;
hue %= 1;

return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
const s = hsl[1] / 100;
const l = hsl[2] / 100;

const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));

let f = 0;
if (c < 1.0) {
f = (l - 0.5 * c) / (1.0 - c);
}

return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
const s = hsv[1] / 100;
const v = hsv[2] / 100;

const c = s * v;
let f = 0;

if (c < 1.0) {
f = (v - c) / (1 - c);
}

return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
const h = hcg[0] / 360;
const c = hcg[1] / 100;
const g = hcg[2] / 100;

if (c === 0.0) {
return [g * 255, g * 255, g * 255];
}

const pure = [0, 0, 0];
const hi = (h % 1) * 6;
const v = hi % 1;
const w = 1 - v;
let mg = 0;

/* eslint-disable max-statements-per-line */
switch (Math.floor(hi)) {
case 0:
pure[0] = 1; pure[1] = v; pure[2] = 0; break;
case 1:
pure[0] = w; pure[1] = 1; pure[2] = 0; break;
case 2:
pure[0] = 0; pure[1] = 1; pure[2] = v; break;
case 3:
pure[0] = 0; pure[1] = w; pure[2] = 1; break;
case 4:
pure[0] = v; pure[1] = 0; pure[2] = 1; break;
default:
pure[0] = 1; pure[1] = 0; pure[2] = w;
}
/* eslint-enable max-statements-per-line */

mg = (1.0 - c) * g;

return [
(c * pure[0] + mg) * 255,
(c * pure[1] + mg) * 255,
(c * pure[2] + mg) * 255
];
};

convert.hcg.hsv = function (hcg) {
const c = hcg[1] / 100;
const g = hcg[2] / 100;

const v = c + g * (1.0 - c);
let f = 0;

if (v > 0.0) {
f = c / v;
}

return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
const c = hcg[1] / 100;
const g = hcg[2] / 100;

const l = g * (1.0 - c) + 0.5 * c;
let s = 0;

if (l > 0.0 && l < 0.5) {
s = c / (2 * l);
} else
if (l >= 0.5 && l < 1.0) {
s = c / (2 * (1 - l));
}

return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
const c = hcg[1] / 100;
const g = hcg[2] / 100;
const v = c + g * (1.0 - c);
return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
const w = hwb[1] / 100;
const b = hwb[2] / 100;
const v = 1 - b;
const c = v - w;
let g = 0;

if (c < 1) {
g = (v - c) / (1 - c);
}

return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = function (args) {
return [0, 0, args[0]];
};

convert.gray.hsv = convert.gray.hsl;

convert.gray.hwb = function (gray) {
return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
const val = Math.round(gray[0] / 100 * 255) & 0xFF;
const integer = (val << 16) + (val << 8) + val;

const string = integer.toString(16).toUpperCase();
return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
return [val / 255 * 100];
};

/*
This function routes a model to all other models.

all functions that are routed have a property `.conversion` attached
to the returned synthetic function. This property is an array
of strings, each with the steps in between the 'from' and 'to'
color models (inclusive).

conversions that are not possible simply are not included.
*/

function buildGraph() {
const graph = {};
// https://jsperf.com/object-keys-vs-for-in-with-closure/3
const models = Object.keys(conversions);

for (let len = models.length, i = 0; i < len; i++) {
graph[models[i]] = {
// http://jsperf.com/1-vs-infinity
// micro-opt, but this is simple.
distance: -1,
parent: null
};
}

return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
const graph = buildGraph();
const queue = [fromModel]; // Unshift -> queue -> pop

graph[fromModel].distance = 0;

while (queue.length) {
const current = queue.pop();
const adjacents = Object.keys(conversions[current]);

for (let len = adjacents.length, i = 0; i < len; i++) {
const adjacent = adjacents[i];
const node = graph[adjacent];

if (node.distance === -1) {
  node.distance = graph[current].distance + 1;
  node.parent = current;
  queue.unshift(adjacent);
}
}
}

return graph;
}

function link(from, to) {
return function (args) {
return to(from(args));
};
}

function wrapConversion(toModel, graph) {
const path = [graph[toModel].parent, toModel];
let fn = conversions[graph[toModel].parent][toModel];

let cur = graph[toModel].parent;
while (graph[cur].parent) {
path.unshift(graph[cur].parent);
fn = link(conversions[graph[cur].parent][cur], fn);
cur = graph[cur].parent;
}

fn.conversion = path;
return fn;
}

var route = function (fromModel) {
const graph = deriveBFS(fromModel);
const conversion = {};

const models = Object.keys(graph);
for (let len = models.length, i = 0; i < len; i++) {
const toModel = models[i];
const node = graph[toModel];

if (node.parent === null) {
// No possible conversion, or this node is the source model.
continue;
}

conversion[toModel] = wrapConversion(toModel, graph);
}

return conversion;
};

const convert$1 = {};

const models = Object.keys(conversions);

function wrapRaw(fn) {
const wrappedFn = function (...args) {
const arg0 = args[0];
if (arg0 === undefined || arg0 === null) {
return arg0;
}

if (arg0.length > 1) {
args = arg0;
}

return fn(args);
};

// Preserve .conversion property if there is one
if ('conversion' in fn) {
wrappedFn.conversion = fn.conversion;
}

return wrappedFn;
}

function wrapRounded(fn) {
const wrappedFn = function (...args) {
const arg0 = args[0];

if (arg0 === undefined || arg0 === null) {
return arg0;
}

if (arg0.length > 1) {
args = arg0;
}

const result = fn(args);

// We're assuming the result is an array here.
// see notice in conversions.js; don't use box types
// in conversion functions.
if (typeof result === 'object') {
for (let len = result.length, i = 0; i < len; i++) {
  result[i] = Math.round(result[i]);
}
}

return result;
};

// Preserve .conversion property if there is one
if ('conversion' in fn) {
wrappedFn.conversion = fn.conversion;
}

return wrappedFn;
}

models.forEach(fromModel => {
convert$1[fromModel] = {};

Object.defineProperty(convert$1[fromModel], 'channels', {value: conversions[fromModel].channels});
Object.defineProperty(convert$1[fromModel], 'labels', {value: conversions[fromModel].labels});

const routes = route(fromModel);
const routeModels = Object.keys(routes);

routeModels.forEach(toModel => {
const fn = routes[toModel];

convert$1[fromModel][toModel] = wrapRounded(fn);
convert$1[fromModel][toModel].raw = wrapRaw(fn);
});
});

var colorConvert = convert$1;

var ansiStyles = createCommonjsModule(function (module) {

const wrapAnsi16 = (fn, offset) => (...args) => {
const code = fn(...args);
return `\u001B[${code + offset}m`;
};

const wrapAnsi256 = (fn, offset) => (...args) => {
const code = fn(...args);
return `\u001B[${38 + offset};5;${code}m`;
};

const wrapAnsi16m = (fn, offset) => (...args) => {
const rgb = fn(...args);
return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};

const ansi2ansi = n => n;
const rgb2rgb = (r, g, b) => [r, g, b];

const setLazyProperty = (object, property, get) => {
Object.defineProperty(object, property, {
get: () => {
const value = get();

Object.defineProperty(object, property, {
  value,
  enumerable: true,
  configurable: true
});

return value;
},
enumerable: true,
configurable: true
});
};

/** @type {typeof import('color-convert')} */
let colorConvert$1;
const makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
if (colorConvert$1 === undefined) {
colorConvert$1 = colorConvert;
}

const offset = isBackground ? 10 : 0;
const styles = {};

for (const [sourceSpace, suite] of Object.entries(colorConvert$1)) {
const name = sourceSpace === 'ansi16' ? 'ansi' : sourceSpace;
if (sourceSpace === targetSpace) {
styles[name] = wrap(identity, offset);
} else if (typeof suite === 'object') {
styles[name] = wrap(suite[targetSpace], offset);
}
}

return styles;
};

function assembleStyles() {
const codes = new Map();
const styles = {
modifier: {
reset: [0, 0],
// 21 isn't widely supported and 22 does the same thing
bold: [1, 22],
dim: [2, 22],
italic: [3, 23],
underline: [4, 24],
inverse: [7, 27],
hidden: [8, 28],
strikethrough: [9, 29]
},
color: {
black: [30, 39],
red: [31, 39],
green: [32, 39],
yellow: [33, 39],
blue: [34, 39],
magenta: [35, 39],
cyan: [36, 39],
white: [37, 39],

// Bright color
blackBright: [90, 39],
redBright: [91, 39],
greenBright: [92, 39],
yellowBright: [93, 39],
blueBright: [94, 39],
magentaBright: [95, 39],
cyanBright: [96, 39],
whiteBright: [97, 39]
},
bgColor: {
bgBlack: [40, 49],
bgRed: [41, 49],
bgGreen: [42, 49],
bgYellow: [43, 49],
bgBlue: [44, 49],
bgMagenta: [45, 49],
bgCyan: [46, 49],
bgWhite: [47, 49],

// Bright color
bgBlackBright: [100, 49],
bgRedBright: [101, 49],
bgGreenBright: [102, 49],
bgYellowBright: [103, 49],
bgBlueBright: [104, 49],
bgMagentaBright: [105, 49],
bgCyanBright: [106, 49],
bgWhiteBright: [107, 49]
}
};

// Alias bright black as gray (and grey)
styles.color.gray = styles.color.blackBright;
styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
styles.color.grey = styles.color.blackBright;
styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

for (const [groupName, group] of Object.entries(styles)) {
for (const [styleName, style] of Object.entries(group)) {
styles[styleName] = {
  open: `\u001B[${style[0]}m`,
  close: `\u001B[${style[1]}m`
};

group[styleName] = styles[styleName];

codes.set(style[0], style[1]);
}

Object.defineProperty(styles, groupName, {
value: group,
enumerable: false
});
}

Object.defineProperty(styles, 'codes', {
value: codes,
enumerable: false
});

styles.color.close = '\u001B[39m';
styles.bgColor.close = '\u001B[49m';

setLazyProperty(styles.color, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, false));
setLazyProperty(styles.color, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, false));
setLazyProperty(styles.color, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, false));
setLazyProperty(styles.bgColor, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, true));
setLazyProperty(styles.bgColor, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, true));
setLazyProperty(styles.bgColor, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, true));

return styles;
}

// Make the export immutable
Object.defineProperty(module, 'exports', {
enumerable: true,
get: assembleStyles
});
});

var hasFlag = (flag, argv = process.argv) => {
const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
const position = argv.indexOf(prefix + flag);
const terminatorPosition = argv.indexOf('--');
return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};

const {env} = process;

let forceColor;
if (hasFlag('no-color') ||
hasFlag('no-colors') ||
hasFlag('color=false') ||
hasFlag('color=never')) {
forceColor = 0;
} else if (hasFlag('color') ||
hasFlag('colors') ||
hasFlag('color=true') ||
hasFlag('color=always')) {
forceColor = 1;
}

if ('FORCE_COLOR' in env) {
if (env.FORCE_COLOR === 'true') {
forceColor = 1;
} else if (env.FORCE_COLOR === 'false') {
forceColor = 0;
} else {
forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
}
}

function translateLevel(level) {
if (level === 0) {
return false;
}

return {
level,
hasBasic: true,
has256: level >= 2,
has16m: level >= 3
};
}

function supportsColor(haveStream, streamIsTTY) {
if (forceColor === 0) {
return 0;
}

if (hasFlag('color=16m') ||
hasFlag('color=full') ||
hasFlag('color=truecolor')) {
return 3;
}

if (hasFlag('color=256')) {
return 2;
}

if (haveStream && !streamIsTTY && forceColor === undefined) {
return 0;
}

const min = forceColor || 0;

if (env.TERM === 'dumb') {
return min;
}

if (process.platform === 'win32') {
// Windows 10 build 10586 is the first Windows release that supports 256 colors.
// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
const osRelease = os__default['default'].release().split('.');
if (
Number(osRelease[0]) >= 10 &&
Number(osRelease[2]) >= 10586
) {
return Number(osRelease[2]) >= 14931 ? 3 : 2;
}

return 1;
}

if ('CI' in env) {
if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
return 1;
}

return min;
}

if ('TEAMCITY_VERSION' in env) {
return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
}

if (env.COLORTERM === 'truecolor') {
return 3;
}

if ('TERM_PROGRAM' in env) {
const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

switch (env.TERM_PROGRAM) {
case 'iTerm.app':
  return version >= 3 ? 3 : 2;
case 'Apple_Terminal':
  return 2;
// No default
}
}

if (/-256(color)?$/i.test(env.TERM)) {
return 2;
}

if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
return 1;
}

if ('COLORTERM' in env) {
return 1;
}

return min;
}

function getSupportLevel(stream) {
const level = supportsColor(stream, stream && stream.isTTY);
return translateLevel(level);
}

var supportsColor_1 = {
supportsColor: getSupportLevel,
stdout: translateLevel(supportsColor(true, tty__default['default'].isatty(1))),
stderr: translateLevel(supportsColor(true, tty__default['default'].isatty(2)))
};

const stringReplaceAll = (string, substring, replacer) => {
let index = string.indexOf(substring);
if (index === -1) {
return string;
}

const substringLength = substring.length;
let endIndex = 0;
let returnValue = '';
do {
returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
endIndex = index + substringLength;
index = string.indexOf(substring, endIndex);
} while (index !== -1);

returnValue += string.substr(endIndex);
return returnValue;
};

const stringEncaseCRLFWithFirstIndex = (string, prefix, postfix, index) => {
let endIndex = 0;
let returnValue = '';
do {
const gotCR = string[index - 1] === '\r';
returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? '\r\n' : '\n') + postfix;
endIndex = index + 1;
index = string.indexOf('\n', endIndex);
} while (index !== -1);

returnValue += string.substr(endIndex);
return returnValue;
};

var util = {
stringReplaceAll,
stringEncaseCRLFWithFirstIndex
};

const TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
const ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;

const ESCAPES = new Map([
['n', '\n'],
['r', '\r'],
['t', '\t'],
['b', '\b'],
['f', '\f'],
['v', '\v'],
['0', '\0'],
['\\', '\\'],
['e', '\u001B'],
['a', '\u0007']
]);

function unescape(c) {
const u = c[0] === 'u';
const bracket = c[1] === '{';

if ((u && !bracket && c.length === 5) || (c[0] === 'x' && c.length === 3)) {
return String.fromCharCode(parseInt(c.slice(1), 16));
}

if (u && bracket) {
return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
}

return ESCAPES.get(c) || c;
}

function parseArguments(name, arguments_) {
const results = [];
const chunks = arguments_.trim().split(/\s*,\s*/g);
let matches;

for (const chunk of chunks) {
const number = Number(chunk);
if (!Number.isNaN(number)) {
results.push(number);
} else if ((matches = chunk.match(STRING_REGEX))) {
results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character) => escape ? unescape(escape) : character));
} else {
throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
}
}

return results;
}

function parseStyle(style) {
STYLE_REGEX.lastIndex = 0;

const results = [];
let matches;

while ((matches = STYLE_REGEX.exec(style)) !== null) {
const name = matches[1];

if (matches[2]) {
const args = parseArguments(name, matches[2]);
results.push([name].concat(args));
} else {
results.push([name]);
}
}

return results;
}

function buildStyle(chalk, styles) {
const enabled = {};

for (const layer of styles) {
for (const style of layer.styles) {
enabled[style[0]] = layer.inverse ? null : style.slice(1);
}
}

let current = chalk;
for (const [styleName, styles] of Object.entries(enabled)) {
if (!Array.isArray(styles)) {
continue;
}

if (!(styleName in current)) {
throw new Error(`Unknown Chalk style: ${styleName}`);
}

current = styles.length > 0 ? current[styleName](...styles) : current[styleName];
}

return current;
}

var templates = (chalk, temporary) => {
const styles = [];
const chunks = [];
let chunk = [];

// eslint-disable-next-line max-params
temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
if (escapeCharacter) {
chunk.push(unescape(escapeCharacter));
} else if (style) {
const string = chunk.join('');
chunk = [];
chunks.push(styles.length === 0 ? string : buildStyle(chalk, styles)(string));
styles.push({inverse, styles: parseStyle(style)});
} else if (close) {
if (styles.length === 0) {
  throw new Error('Found extraneous } in Chalk template literal');
}

chunks.push(buildStyle(chalk, styles)(chunk.join('')));
chunk = [];
styles.pop();
} else {
chunk.push(character);
}
});

chunks.push(chunk.join(''));

if (styles.length > 0) {
const errMessage = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? '' : 's'} (\`}\`)`;
throw new Error(errMessage);
}

return chunks.join('');
};

const {stdout: stdoutColor, stderr: stderrColor} = supportsColor_1;
const {
stringReplaceAll: stringReplaceAll$1,
stringEncaseCRLFWithFirstIndex: stringEncaseCRLFWithFirstIndex$1
} = util;

const {isArray: isArray$1} = Array;

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = [
'ansi',
'ansi',
'ansi256',
'ansi16m'
];

const styles = Object.create(null);

const applyOptions = (object, options = {}) => {
if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
throw new Error('The `level` option should be an integer from 0 to 3');
}

// Detect level if not set manually
const colorLevel = stdoutColor ? stdoutColor.level : 0;
object.level = options.level === undefined ? colorLevel : options.level;
};

class ChalkClass {
constructor(options) {
// eslint-disable-next-line no-constructor-return
return chalkFactory(options);
}
}

const chalkFactory = options => {
const chalk = {};
applyOptions(chalk, options);

chalk.template = (...arguments_) => chalkTag(chalk.template, ...arguments_);

Object.setPrototypeOf(chalk, Chalk.prototype);
Object.setPrototypeOf(chalk.template, chalk);

chalk.template.constructor = () => {
throw new Error('`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.');
};

chalk.template.Instance = ChalkClass;

return chalk.template;
};

function Chalk(options) {
return chalkFactory(options);
}

for (const [styleName, style] of Object.entries(ansiStyles)) {
styles[styleName] = {
get() {
const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
Object.defineProperty(this, styleName, {value: builder});
return builder;
}
};
}

styles.visible = {
get() {
const builder = createBuilder(this, this._styler, true);
Object.defineProperty(this, 'visible', {value: builder});
return builder;
}
};

const usedModels = ['rgb', 'hex', 'keyword', 'hsl', 'hsv', 'hwb', 'ansi', 'ansi256'];

for (const model of usedModels) {
styles[model] = {
get() {
const {level} = this;
return function (...arguments_) {
  const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
  return createBuilder(this, styler, this._isEmpty);
};
}
};
}

for (const model of usedModels) {
const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
styles[bgModel] = {
get() {
const {level} = this;
return function (...arguments_) {
  const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
  return createBuilder(this, styler, this._isEmpty);
};
}
};
}

const proto = Object.defineProperties(() => {}, {
...styles,
level: {
enumerable: true,
get() {
return this._generator.level;
},
set(level) {
this._generator.level = level;
}
}
});

const createStyler = (open, close, parent) => {
let openAll;
let closeAll;
if (parent === undefined) {
openAll = open;
closeAll = close;
} else {
openAll = parent.openAll + open;
closeAll = close + parent.closeAll;
}

return {
open,
close,
openAll,
closeAll,
parent
};
};

const createBuilder = (self, _styler, _isEmpty) => {
const builder = (...arguments_) => {
if (isArray$1(arguments_[0]) && isArray$1(arguments_[0].raw)) {
// Called as a template literal, for example: chalk.red`2 + 3 = {bold ${2+3}}`
return applyStyle(builder, chalkTag(builder, ...arguments_));
}

// Single argument is hot path, implicit coercion is faster than anything
// eslint-disable-next-line no-implicit-coercion
return applyStyle(builder, (arguments_.length === 1) ? ('' + arguments_[0]) : arguments_.join(' '));
};

// We alter the prototype because we must return a function, but there is
// no way to create a function with a different prototype
Object.setPrototypeOf(builder, proto);

builder._generator = self;
builder._styler = _styler;
builder._isEmpty = _isEmpty;

return builder;
};

const applyStyle = (self, string) => {
if (self.level <= 0 || !string) {
return self._isEmpty ? '' : string;
}

let styler = self._styler;

if (styler === undefined) {
return string;
}

const {openAll, closeAll} = styler;
if (string.indexOf('\u001B') !== -1) {
while (styler !== undefined) {
// Replace any instances already present with a re-opening code
// otherwise only the part of the string until said closing code
// will be colored, and the rest will simply be 'plain'.
string = stringReplaceAll$1(string, styler.close, styler.open);

styler = styler.parent;
}
}

// We can move both next actions out of loop, because remaining actions in loop won't have
// any/visible effect on parts we add here. Close the styling before a linebreak and reopen
// after next line to fix a bleed issue on macOS: https://github.com/chalk/chalk/pull/92
const lfIndex = string.indexOf('\n');
if (lfIndex !== -1) {
string = stringEncaseCRLFWithFirstIndex$1(string, closeAll, openAll, lfIndex);
}

return openAll + string + closeAll;
};

let template;
const chalkTag = (chalk, ...strings) => {
const [firstString] = strings;

if (!isArray$1(firstString) || !isArray$1(firstString.raw)) {
// If chalk() was called by itself or with a string,
// return the string itself as a string.
return strings.join(' ');
}

const arguments_ = strings.slice(1);
const parts = [firstString.raw[0]];

for (let i = 1; i < firstString.length; i++) {
parts.push(
String(arguments_[i - 1]).replace(/[{}\\]/g, '\\$&'),
String(firstString.raw[i])
);
}

if (template === undefined) {
template = templates;
}

return template(chalk, parts.join(''));
};

Object.defineProperties(Chalk.prototype, styles);

const chalk = Chalk(); // eslint-disable-line new-cap
chalk.supportsColor = stdoutColor;
chalk.stderr = Chalk({level: stderrColor ? stderrColor.level : 0}); // eslint-disable-line new-cap
chalk.stderr.supportsColor = stderrColor;

var source = chalk;

var startConductor_1 = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
return new (P || (P = Promise))(function (resolve, reject) {
  function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
  function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
  function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
  step((generator = generator.apply(thisArg, _arguments || [])).next());
});
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startConductor = exports.execHolochain = exports.sleep = void 0;

const path_1 = __importDefault(path__default['default']);
const fs_1 = __importDefault(fs__default['default']);

const tmp_1 = __importDefault(tmp);
const child_process_1 = __importDefault(require$$3__default['default']);


function createTmpDirIfNecessary(dirName) {
if (!dirName) {
  const dbDirectory = tmp_1.default.dirSync({});
  dirName = dbDirectory.name;
}
return dirName;
}
const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));
exports.sleep = sleep;
function createConfigFile(adminPort, dirName, proxyUrl) {
const configFileName = `${dirName}/config.yaml`;
if (fs_1.default.existsSync(configFileName)) {
  try {
      const doc = jsYaml$1.safeLoad(fs_1.default.readFileSync(configFileName, "utf8"));
      adminPort = doc.admin_interfaces[0].driver.port;
      console.log(source.bold.blue(`Using admin port ${adminPort} from config`));
  }
  catch (e) {
      console.error(e);
  }
  return [configFileName, false, adminPort];
}
const configFileContents = `
---
environment_path: ${dirName}
use_dangerous_test_keystore: false
signing_service_uri: ~
encryption_service_uri: ~
decryption_service_uri: ~
dpki: ~
keystore_path: "${dirName}/keystore"
passphrase_service: ~
admin_interfaces:
- driver:
  type: websocket
  port: ${adminPort}
`;
fs_1.default.writeFileSync(configFileName, configFileContents);
return [configFileName, true, adminPort];
}
function execHolochain(adminPort, runPath) {
return __awaiter(this, void 0, void 0, function* () {
  const dirName = createTmpDirIfNecessary(runPath);
  const [configFilePath, configCreated, realAdminPort] = createConfigFile(adminPort, dirName);
  const lair = child_process_1.default.spawn("lair-keystore", [], {
      stdio: "inherit",
      env: Object.assign(Object.assign({}, process.env), { LAIR_DIR: `${dirName}/keystore` }),
  });
  yield exports.sleep(500);
  console.log(source.bold.blue("Using config file at path: ", configFilePath));
  const holochain = child_process_1.default.spawn("holochain", ["-c", configFilePath], {
      stdio: "inherit",
      env: Object.assign(Object.assign({}, process.env), { RUST_LOG: process.env.RUST_LOG ? process.env.RUST_LOG : "info" }),
  });
  process.on("exit", function () {
      return __awaiter(this, void 0, void 0, function* () {
          holochain.kill();
          lair.kill();
          fs_1.default.unlinkSync(`${dirName}/keystore/pid`);
          process.exit();
      });
  });
  yield exports.sleep(3000);
  return [configCreated, realAdminPort];
});
}
exports.execHolochain = execHolochain;
function agentKey(adminWebsocket) {
return __awaiter(this, void 0, void 0, function* () {
  const agentKeyFile = path_1.default.join(config.rootPath, 'pubKey.hex');
  if (fs_1.default.existsSync(agentKeyFile)) {
      return Buffer.from(fs_1.default.readFileSync(agentKeyFile).toString(), 'hex');
  }
  else {
      const agent_key = yield adminWebsocket.generateAgentPubKey();
      fs_1.default.writeFileSync(agentKeyFile, agent_key.toString('hex'));
      return agent_key;
  }
});
}
function startConductor() {
return new Promise((resolve, reject) => {
  execHolochain(config.HC_ADMIN_PORT, config.HC_CONFIG_PATH).then((result) => __awaiter(this, void 0, void 0, function* () {
      var _a, _b;
      try {
          // 1. Connect admin websocket
          const adminPort = result[1];
          const adminWebsocket = yield lib.AdminWebsocket.connect(`ws://localhost:${adminPort}`);
          console.debug("Holochain admin interface connected on port", adminPort);
          // 2. Install app
          const activeApps = yield adminWebsocket.listActiveApps();
          console.log("Active apps:", activeApps);
          if (!activeApps.includes(config.APP_ID)) {
              try {
                  const agent_key = yield agentKey(adminWebsocket);
                  console.log(JSON.stringify(agent_key));
                  console.log("Registering DNA:");
                  const dnaHash = yield adminWebsocket.registerDna({ source: { path: path_1.default.join(config.rootPath, '../../dna', 'joining-code-factory.dna.gz') } });
                  console.log("DNA registered");
                  console.log("Installing app");
                  yield adminWebsocket.installApp({
                      agent_key,
                      installed_app_id: config.APP_ID,
                      dnas: [{
                              nick: config.DNA_NICK,
                              hash: dnaHash,
                          }],
                  });
                  console.log("App installed");
              }
              catch (e) {
                  if (!((_b = (_a = e.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.includes('AppAlreadyInstalled'))) {
                      reject(e);
                  }
              }
              try {
                  adminWebsocket.activateApp({ installed_app_id: config.APP_ID });
              }
              catch (e) {
              }
          }
          let appPort = adminPort + 1;
          try {
              const { port } = yield adminWebsocket.attachAppInterface({ port: appPort });
              appPort = port;
          }
          catch (e) {
          }
          const appWebsocket = yield lib.AppWebsocket.connect(`ws://localhost:${appPort}`);
          console.debug("Holochain app interface connected on port", appPort);
          resolve(appWebsocket);
      }
      catch (e) {
          console.error("Error intializing Holochain conductor:", e);
          reject(e);
      }
  }));
});
}
exports.startConductor = startConductor;
function ensureConductor() {
return __awaiter(this, void 0, void 0, function* () {
  let appWebsocket;
  try {
      appWebsocket = yield lib.AppWebsocket.connect(`ws://localhost:${config.HOLO_CONDUCTOR_DEFAULT_PORT}`);
      console.debug("Holochain app interface connected on Holo default port", config.HOLO_CONDUCTOR_DEFAULT_PORT);
  }
  catch (e) {
      console.debug("No conductor found on Holo default port", config.HOLO_CONDUCTOR_DEFAULT_PORT, "- spawning our own conductor...");
      appWebsocket = yield startConductor();
      console.debug("Conductor spawned");
  }
  return appWebsocket;
});
}
exports.default = ensureConductor;
});

var zomeCall = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
return new (P || (P = Promise))(function (resolve, reject) {
  function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
  function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
  function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
  step((generator = generator.apply(thisArg, _arguments || [])).next());
});
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubkey = void 0;

const fakeCapSecret = () => Buffer.from(Array(64).fill('aa').join(''), 'hex');
function call(websocket, fn_name, payload) {
return __awaiter(this, void 0, void 0, function* () {
  const infoResult = yield websocket.appInfo({ installed_app_id: config.APP_ID });
  const { cell_data } = infoResult;
  const cell = cell_data[0]; //cell_data.find(cell => cell[1] === DNA_NICK)
  // @ts-ignore
  const cell_id = cell[0];
  const [_dnaHash, provenance] = cell_id;
  const zomeCallRequest = {
      cap: fakeCapSecret(),
      cell_id,
      zome_name: "code-generator",
      fn_name,
      provenance: provenance,
      payload
  };
  return websocket.callZome(zomeCallRequest);
});
}
exports.default = call;
function pubkey(websocket) {
return __awaiter(this, void 0, void 0, function* () {
  const infoResult = yield websocket.appInfo({ installed_app_id: config.APP_ID });
  const { cell_data } = infoResult;
  const cell = cell_data[0]; //cell_data.find(cell => cell[1] === DNA_NICK)
  // @ts-ignore
  const cell_id = cell[0];
  const [_dnaHash, provenance] = cell_id;
  return provenance;
});
}
exports.pubkey = pubkey;
});

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream__default['default'].Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
constructor() {
this[TYPE] = '';

const blobParts = arguments[0];
const options = arguments[1];

const buffers = [];
let size = 0;

if (blobParts) {
const a = blobParts;
const length = Number(a.length);
for (let i = 0; i < length; i++) {
  const element = a[i];
  let buffer;
  if (element instanceof Buffer) {
    buffer = element;
  } else if (ArrayBuffer.isView(element)) {
    buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
  } else if (element instanceof ArrayBuffer) {
    buffer = Buffer.from(element);
  } else if (element instanceof Blob) {
    buffer = element[BUFFER];
  } else {
    buffer = Buffer.from(typeof element === 'string' ? element : String(element));
  }
  size += buffer.length;
  buffers.push(buffer);
}
}

this[BUFFER] = Buffer.concat(buffers);

let type = options && options.type !== undefined && String(options.type).toLowerCase();
if (type && !/[^\u0020-\u007E]/.test(type)) {
this[TYPE] = type;
}
}
get size() {
return this[BUFFER].length;
}
get type() {
return this[TYPE];
}
text() {
return Promise.resolve(this[BUFFER].toString());
}
arrayBuffer() {
const buf = this[BUFFER];
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
return Promise.resolve(ab);
}
stream() {
const readable = new Readable();
readable._read = function () {};
readable.push(this[BUFFER]);
readable.push(null);
return readable;
}
toString() {
return '[object Blob]';
}
slice() {
const size = this.size;

const start = arguments[0];
const end = arguments[1];
let relativeStart, relativeEnd;
if (start === undefined) {
relativeStart = 0;
} else if (start < 0) {
relativeStart = Math.max(size + start, 0);
} else {
relativeStart = Math.min(start, size);
}
if (end === undefined) {
relativeEnd = size;
} else if (end < 0) {
relativeEnd = Math.max(size + end, 0);
} else {
relativeEnd = Math.min(end, size);
}
const span = Math.max(relativeEnd - relativeStart, 0);

const buffer = this[BUFFER];
const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
const blob = new Blob([], { type: arguments[2] });
blob[BUFFER] = slicedBuffer;
return blob;
}
}

Object.defineProperties(Blob.prototype, {
size: { enumerable: true },
type: { enumerable: true },
slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
value: 'Blob',
writable: false,
enumerable: false,
configurable: true
});

/**
* fetch-error.js
*
* FetchError interface for operational errors
*/

/**
* Create FetchError instance
*
* @param   String      message      Error message for human
* @param   String      type         Error type for machine
* @param   String      systemError  For Node.js system error
* @return  FetchError
*/
function FetchError(message, type, systemError) {
Error.call(this, message);

this.message = message;
this.type = type;

// when err.type is `system`, err.code contains system error code
if (systemError) {
this.code = this.errno = systemError.code;
}

// hide custom error implementation details from end-users
Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert$2;
try {
convert$2 = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream__default['default'].PassThrough;

/**
* Body mixin
*
* Ref: https://fetch.spec.whatwg.org/#body
*
* @param   Stream  body  Readable stream
* @param   Object  opts  Response options
* @return  Void
*/
function Body(body) {
var _this = this;

var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
_ref$size = _ref.size;

let size = _ref$size === undefined ? 0 : _ref$size;
var _ref$timeout = _ref.timeout;
let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

if (body == null) {
// body is undefined or null
body = null;
} else if (isURLSearchParams(body)) {
// body is a URLSearchParams
body = Buffer.from(body.toString());
} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
// body is ArrayBuffer
body = Buffer.from(body);
} else if (ArrayBuffer.isView(body)) {
// body is ArrayBufferView
body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
} else if (body instanceof Stream__default['default']) ; else {
// none of the above
// coerce to string then buffer
body = Buffer.from(String(body));
}
this[INTERNALS] = {
body,
disturbed: false,
error: null
};
this.size = size;
this.timeout = timeout;

if (body instanceof Stream__default['default']) {
body.on('error', function (err) {
const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
_this[INTERNALS].error = error;
});
}
}

Body.prototype = {
get body() {
return this[INTERNALS].body;
},

get bodyUsed() {
return this[INTERNALS].disturbed;
},

/**
* Decode response as ArrayBuffer
*
* @return  Promise
*/
arrayBuffer() {
return consumeBody.call(this).then(function (buf) {
return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
});
},

/**
* Return raw response as Blob
*
* @return Promise
*/
blob() {
let ct = this.headers && this.headers.get('content-type') || '';
return consumeBody.call(this).then(function (buf) {
return Object.assign(
// Prevent copying
new Blob([], {
  type: ct.toLowerCase()
}), {
  [BUFFER]: buf
});
});
},

/**
* Decode response as json
*
* @return  Promise
*/
json() {
var _this2 = this;

return consumeBody.call(this).then(function (buffer) {
try {
  return JSON.parse(buffer.toString());
} catch (err) {
  return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
}
});
},

/**
* Decode response as text
*
* @return  Promise
*/
text() {
return consumeBody.call(this).then(function (buffer) {
return buffer.toString();
});
},

/**
* Decode response as buffer (non-spec api)
*
* @return  Promise
*/
buffer() {
return consumeBody.call(this);
},

/**
* Decode response as text, while automatically detecting the encoding and
* trying to decode to UTF-8 (non-spec api)
*
* @return  Promise
*/
textConverted() {
var _this3 = this;

return consumeBody.call(this).then(function (buffer) {
return convertBody(buffer, _this3.headers);
});
}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
body: { enumerable: true },
bodyUsed: { enumerable: true },
arrayBuffer: { enumerable: true },
blob: { enumerable: true },
json: { enumerable: true },
text: { enumerable: true }
});

Body.mixIn = function (proto) {
for (const name of Object.getOwnPropertyNames(Body.prototype)) {
// istanbul ignore else: future proof
if (!(name in proto)) {
const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
Object.defineProperty(proto, name, desc);
}
}
};

/**
* Consume and convert an entire Body to a Buffer.
*
* Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
*
* @return  Promise
*/
function consumeBody() {
var _this4 = this;

if (this[INTERNALS].disturbed) {
return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
}

this[INTERNALS].disturbed = true;

if (this[INTERNALS].error) {
return Body.Promise.reject(this[INTERNALS].error);
}

let body = this.body;

// body is null
if (body === null) {
return Body.Promise.resolve(Buffer.alloc(0));
}

// body is blob
if (isBlob(body)) {
body = body.stream();
}

// body is buffer
if (Buffer.isBuffer(body)) {
return Body.Promise.resolve(body);
}

// istanbul ignore if: should never happen
if (!(body instanceof Stream__default['default'])) {
return Body.Promise.resolve(Buffer.alloc(0));
}

// body is stream
// get ready to actually consume the body
let accum = [];
let accumBytes = 0;
let abort = false;

return new Body.Promise(function (resolve, reject) {
let resTimeout;

// allow timeout on slow response body
if (_this4.timeout) {
resTimeout = setTimeout(function () {
  abort = true;
  reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
}, _this4.timeout);
}

// handle stream errors
body.on('error', function (err) {
if (err.name === 'AbortError') {
  // if the request was aborted, reject with this Error
  abort = true;
  reject(err);
} else {
  // other errors, such as incorrect content-encoding
  reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
}
});

body.on('data', function (chunk) {
if (abort || chunk === null) {
  return;
}

if (_this4.size && accumBytes + chunk.length > _this4.size) {
  abort = true;
  reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
  return;
}

accumBytes += chunk.length;
accum.push(chunk);
});

body.on('end', function () {
if (abort) {
  return;
}

clearTimeout(resTimeout);

try {
  resolve(Buffer.concat(accum, accumBytes));
} catch (err) {
  // handle streams that have accumulated too much data (issue #414)
  reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
}
});
});
}

/**
* Detect buffer encoding and convert to target encoding
* ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
*
* @param   Buffer  buffer    Incoming buffer
* @param   String  encoding  Target encoding
* @return  String
*/
function convertBody(buffer, headers) {
if (typeof convert$2 !== 'function') {
throw new Error('The package `encoding` must be installed to use the textConverted() function');
}

const ct = headers.get('content-type');
let charset = 'utf-8';
let res, str;

// header
if (ct) {
res = /charset=([^;]*)/i.exec(ct);
}

// no charset in content type, peek at response body for at most 1024 bytes
str = buffer.slice(0, 1024).toString();

// html5
if (!res && str) {
res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
}

// html4
if (!res && str) {
res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
if (!res) {
res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
if (res) {
  res.pop(); // drop last quote
}
}

if (res) {
res = /charset=(.*)/i.exec(res.pop());
}
}

// xml
if (!res && str) {
res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
}

// found charset
if (res) {
charset = res.pop();

// prevent decode issues when sites use incorrect encoding
// ref: https://hsivonen.fi/encoding-menu/
if (charset === 'gb2312' || charset === 'gbk') {
charset = 'gb18030';
}
}

// turn raw buffers into a single utf-8 buffer
return convert$2(buffer, 'UTF-8', charset).toString();
}

/**
* Detect a URLSearchParams object
* ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
*
* @param   Object  obj     Object to detect by type or brand
* @return  String
*/
function isURLSearchParams(obj) {
// Duck-typing as a necessary condition.
if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
return false;
}

// Brand-checking and more duck-typing as optional condition.
return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
* Check if `obj` is a W3C `Blob` object (which `File` inherits from)
* @param  {*} obj
* @return {boolean}
*/
function isBlob(obj) {
return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
* Clone body given Res/Req instance
*
* @param   Mixed  instance  Response or Request instance
* @return  Mixed
*/
function clone(instance) {
let p1, p2;
let body = instance.body;

// don't allow cloning a used body
if (instance.bodyUsed) {
throw new Error('cannot clone body after it is used');
}

// check that body is a stream and not form-data object
// note: we can't clone the form-data object without having it as a dependency
if (body instanceof Stream__default['default'] && typeof body.getBoundary !== 'function') {
// tee instance body
p1 = new PassThrough();
p2 = new PassThrough();
body.pipe(p1);
body.pipe(p2);
// set instance body to teed body and return the other teed body
instance[INTERNALS].body = p1;
body = p2;
}

return body;
}

/**
* Performs the operation "extract a `Content-Type` value from |object|" as
* specified in the specification:
* https://fetch.spec.whatwg.org/#concept-bodyinit-extract
*
* This function assumes that instance.body is present.
*
* @param   Mixed  instance  Any options.body input
*/
function extractContentType(body) {
if (body === null) {
// body is null
return null;
} else if (typeof body === 'string') {
// body is string
return 'text/plain;charset=UTF-8';
} else if (isURLSearchParams(body)) {
// body is a URLSearchParams
return 'application/x-www-form-urlencoded;charset=UTF-8';
} else if (isBlob(body)) {
// body is blob
return body.type || null;
} else if (Buffer.isBuffer(body)) {
// body is buffer
return null;
} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
// body is ArrayBuffer
return null;
} else if (ArrayBuffer.isView(body)) {
// body is ArrayBufferView
return null;
} else if (typeof body.getBoundary === 'function') {
// detect form data input from form-data module
return `multipart/form-data;boundary=${body.getBoundary()}`;
} else if (body instanceof Stream__default['default']) {
// body is stream
// can't really do much about this
return null;
} else {
// Body constructor defaults other things to string
return 'text/plain;charset=UTF-8';
}
}

/**
* The Fetch Standard treats this as if "total bytes" is a property on the body.
* For us, we have to explicitly get it with a function.
*
* ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
*
* @param   Body    instance   Instance of Body
* @return  Number?            Number of bytes, or null if not possible
*/
function getTotalBytes(instance) {
const body = instance.body;


if (body === null) {
// body is null
return 0;
} else if (isBlob(body)) {
return body.size;
} else if (Buffer.isBuffer(body)) {
// body is buffer
return body.length;
} else if (body && typeof body.getLengthSync === 'function') {
// detect form data input from form-data module
if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
body.hasKnownLength && body.hasKnownLength()) {
// 2.x
return body.getLengthSync();
}
return null;
} else {
// body is stream
return null;
}
}

/**
* Write a Body to a Node.js WritableStream (e.g. http.Request) object.
*
* @param   Body    instance   Instance of Body
* @return  Void
*/
function writeToStream(dest, instance) {
const body = instance.body;


if (body === null) {
// body is null
dest.end();
} else if (isBlob(body)) {
body.stream().pipe(dest);
} else if (Buffer.isBuffer(body)) {
// body is buffer
dest.write(body);
dest.end();
} else {
// body is stream
body.pipe(dest);
}
}

// expose Promise
Body.Promise = global.Promise;

/**
* headers.js
*
* Headers class offers convenient helpers
*/

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
name = `${name}`;
if (invalidTokenRegex.test(name) || name === '') {
throw new TypeError(`${name} is not a legal HTTP header name`);
}
}

function validateValue(value) {
value = `${value}`;
if (invalidHeaderCharRegex.test(value)) {
throw new TypeError(`${value} is not a legal HTTP header value`);
}
}

/**
* Find the key in the map object given a header name.
*
* Returns undefined if not found.
*
* @param   String  name  Header name
* @return  String|Undefined
*/
function find(map, name) {
name = name.toLowerCase();
for (const key in map) {
if (key.toLowerCase() === name) {
return key;
}
}
return undefined;
}

const MAP = Symbol('map');
class Headers {
/**
* Headers class
*
* @param   Object  headers  Response headers
* @return  Void
*/
constructor() {
let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

this[MAP] = Object.create(null);

if (init instanceof Headers) {
const rawHeaders = init.raw();
const headerNames = Object.keys(rawHeaders);

for (const headerName of headerNames) {
  for (const value of rawHeaders[headerName]) {
    this.append(headerName, value);
  }
}

return;
}

// We don't worry about converting prop to ByteString here as append()
// will handle it.
if (init == null) ; else if (typeof init === 'object') {
const method = init[Symbol.iterator];
if (method != null) {
  if (typeof method !== 'function') {
    throw new TypeError('Header pairs must be iterable');
  }

  // sequence<sequence<ByteString>>
  // Note: per spec we have to first exhaust the lists then process them
  const pairs = [];
  for (const pair of init) {
    if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
      throw new TypeError('Each header pair must be iterable');
    }
    pairs.push(Array.from(pair));
  }

  for (const pair of pairs) {
    if (pair.length !== 2) {
      throw new TypeError('Each header pair must be a name/value tuple');
    }
    this.append(pair[0], pair[1]);
  }
} else {
  // record<ByteString, ByteString>
  for (const key of Object.keys(init)) {
    const value = init[key];
    this.append(key, value);
  }
}
} else {
throw new TypeError('Provided initializer must be an object');
}
}

/**
* Return combined header value given name
*
* @param   String  name  Header name
* @return  Mixed
*/
get(name) {
name = `${name}`;
validateName(name);
const key = find(this[MAP], name);
if (key === undefined) {
return null;
}

return this[MAP][key].join(', ');
}

/**
* Iterate over all headers
*
* @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
* @param   Boolean   thisArg   `this` context for callback function
* @return  Void
*/
forEach(callback) {
let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

let pairs = getHeaders(this);
let i = 0;
while (i < pairs.length) {
var _pairs$i = pairs[i];
const name = _pairs$i[0],
      value = _pairs$i[1];

callback.call(thisArg, value, name, this);
pairs = getHeaders(this);
i++;
}
}

/**
* Overwrite header values given name
*
* @param   String  name   Header name
* @param   String  value  Header value
* @return  Void
*/
set(name, value) {
name = `${name}`;
value = `${value}`;
validateName(name);
validateValue(value);
const key = find(this[MAP], name);
this[MAP][key !== undefined ? key : name] = [value];
}

/**
* Append a value onto existing header
*
* @param   String  name   Header name
* @param   String  value  Header value
* @return  Void
*/
append(name, value) {
name = `${name}`;
value = `${value}`;
validateName(name);
validateValue(value);
const key = find(this[MAP], name);
if (key !== undefined) {
this[MAP][key].push(value);
} else {
this[MAP][name] = [value];
}
}

/**
* Check for header name existence
*
* @param   String   name  Header name
* @return  Boolean
*/
has(name) {
name = `${name}`;
validateName(name);
return find(this[MAP], name) !== undefined;
}

/**
* Delete all header values given name
*
* @param   String  name  Header name
* @return  Void
*/
delete(name) {
name = `${name}`;
validateName(name);
const key = find(this[MAP], name);
if (key !== undefined) {
delete this[MAP][key];
}
}

/**
* Return raw headers (non-spec api)
*
* @return  Object
*/
raw() {
return this[MAP];
}

/**
* Get an iterator on keys.
*
* @return  Iterator
*/
keys() {
return createHeadersIterator(this, 'key');
}

/**
* Get an iterator on values.
*
* @return  Iterator
*/
values() {
return createHeadersIterator(this, 'value');
}

/**
* Get an iterator on entries.
*
* This is the default iterator of the Headers object.
*
* @return  Iterator
*/
[Symbol.iterator]() {
return createHeadersIterator(this, 'key+value');
}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
value: 'Headers',
writable: false,
enumerable: false,
configurable: true
});

Object.defineProperties(Headers.prototype, {
get: { enumerable: true },
forEach: { enumerable: true },
set: { enumerable: true },
append: { enumerable: true },
has: { enumerable: true },
delete: { enumerable: true },
keys: { enumerable: true },
values: { enumerable: true },
entries: { enumerable: true }
});

function getHeaders(headers) {
let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

const keys = Object.keys(headers[MAP]).sort();
return keys.map(kind === 'key' ? function (k) {
return k.toLowerCase();
} : kind === 'value' ? function (k) {
return headers[MAP][k].join(', ');
} : function (k) {
return [k.toLowerCase(), headers[MAP][k].join(', ')];
});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
const iterator = Object.create(HeadersIteratorPrototype);
iterator[INTERNAL] = {
target,
kind,
index: 0
};
return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
next() {
// istanbul ignore if
if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
throw new TypeError('Value of `this` is not a HeadersIterator');
}

var _INTERNAL = this[INTERNAL];
const target = _INTERNAL.target,
    kind = _INTERNAL.kind,
    index = _INTERNAL.index;

const values = getHeaders(target, kind);
const len = values.length;
if (index >= len) {
return {
  value: undefined,
  done: true
};
}

this[INTERNAL].index = index + 1;

return {
value: values[index],
done: false
};
}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
value: 'HeadersIterator',
writable: false,
enumerable: false,
configurable: true
});

/**
* Export the Headers object in a form that Node.js can consume.
*
* @param   Headers  headers
* @return  Object
*/
function exportNodeCompatibleHeaders(headers) {
const obj = Object.assign({ __proto__: null }, headers[MAP]);

// http.request() only supports string as Host header. This hack makes
// specifying custom Host header possible.
const hostHeaderKey = find(headers[MAP], 'Host');
if (hostHeaderKey !== undefined) {
obj[hostHeaderKey] = obj[hostHeaderKey][0];
}

return obj;
}

/**
* Create a Headers object from an object of headers, ignoring those that do
* not conform to HTTP grammar productions.
*
* @param   Object  obj  Object of headers
* @return  Headers
*/
function createHeadersLenient(obj) {
const headers = new Headers();
for (const name of Object.keys(obj)) {
if (invalidTokenRegex.test(name)) {
continue;
}
if (Array.isArray(obj[name])) {
for (const val of obj[name]) {
  if (invalidHeaderCharRegex.test(val)) {
    continue;
  }
  if (headers[MAP][name] === undefined) {
    headers[MAP][name] = [val];
  } else {
    headers[MAP][name].push(val);
  }
}
} else if (!invalidHeaderCharRegex.test(obj[name])) {
headers[MAP][name] = [obj[name]];
}
}
return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES$1 = http__default['default'].STATUS_CODES;

/**
* Response class
*
* @param   Stream  body  Readable stream
* @param   Object  opts  Response options
* @return  Void
*/
class Response {
constructor() {
let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

Body.call(this, body, opts);

const status = opts.status || 200;
const headers = new Headers(opts.headers);

if (body != null && !headers.has('Content-Type')) {
const contentType = extractContentType(body);
if (contentType) {
  headers.append('Content-Type', contentType);
}
}

this[INTERNALS$1] = {
url: opts.url,
status,
statusText: opts.statusText || STATUS_CODES$1[status],
headers,
counter: opts.counter
};
}

get url() {
return this[INTERNALS$1].url || '';
}

get status() {
return this[INTERNALS$1].status;
}

/**
* Convenience property representing if the request ended normally
*/
get ok() {
return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
}

get redirected() {
return this[INTERNALS$1].counter > 0;
}

get statusText() {
return this[INTERNALS$1].statusText;
}

get headers() {
return this[INTERNALS$1].headers;
}

/**
* Clone this response
*
* @return  Response
*/
clone() {
return new Response(clone(this), {
url: this.url,
status: this.status,
statusText: this.statusText,
headers: this.headers,
ok: this.ok,
redirected: this.redirected
});
}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
url: { enumerable: true },
status: { enumerable: true },
ok: { enumerable: true },
redirected: { enumerable: true },
statusText: { enumerable: true },
headers: { enumerable: true },
clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
value: 'Response',
writable: false,
enumerable: false,
configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url__default['default'].parse;
const format_url = Url__default['default'].format;

const streamDestructionSupported = 'destroy' in Stream__default['default'].Readable.prototype;

/**
* Check if a value is an instance of Request.
*
* @param   Mixed   input
* @return  Boolean
*/
function isRequest(input) {
return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
* Request class
*
* @param   Mixed   input  Url or Request instance
* @param   Object  init   Custom options
* @return  Void
*/
class Request {
constructor(input) {
let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

let parsedURL;

// normalize input
if (!isRequest(input)) {
if (input && input.href) {
  // in order to support Node.js' Url objects; though WHATWG's URL objects
  // will fall into this branch also (since their `toString()` will return
  // `href` property anyway)
  parsedURL = parse_url(input.href);
} else {
  // coerce input to a string before attempting to parse
  parsedURL = parse_url(`${input}`);
}
input = {};
} else {
parsedURL = parse_url(input.url);
}

let method = init.method || input.method || 'GET';
method = method.toUpperCase();

if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
throw new TypeError('Request with GET/HEAD method cannot have body');
}

let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

Body.call(this, inputBody, {
timeout: init.timeout || input.timeout || 0,
size: init.size || input.size || 0
});

const headers = new Headers(init.headers || input.headers || {});

if (inputBody != null && !headers.has('Content-Type')) {
const contentType = extractContentType(inputBody);
if (contentType) {
  headers.append('Content-Type', contentType);
}
}

let signal = isRequest(input) ? input.signal : null;
if ('signal' in init) signal = init.signal;

if (signal != null && !isAbortSignal(signal)) {
throw new TypeError('Expected signal to be an instanceof AbortSignal');
}

this[INTERNALS$2] = {
method,
redirect: init.redirect || input.redirect || 'follow',
headers,
parsedURL,
signal
};

// node-fetch-only options
this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
this.counter = init.counter || input.counter || 0;
this.agent = init.agent || input.agent;
}

get method() {
return this[INTERNALS$2].method;
}

get url() {
return format_url(this[INTERNALS$2].parsedURL);
}

get headers() {
return this[INTERNALS$2].headers;
}

get redirect() {
return this[INTERNALS$2].redirect;
}

get signal() {
return this[INTERNALS$2].signal;
}

/**
* Clone this request
*
* @return  Request
*/
clone() {
return new Request(this);
}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
value: 'Request',
writable: false,
enumerable: false,
configurable: true
});

Object.defineProperties(Request.prototype, {
method: { enumerable: true },
url: { enumerable: true },
headers: { enumerable: true },
redirect: { enumerable: true },
clone: { enumerable: true },
signal: { enumerable: true }
});

/**
* Convert a Request to Node.js http request options.
*
* @param   Request  A Request instance
* @return  Object   The options object to be passed to http.request
*/
function getNodeRequestOptions(request) {
const parsedURL = request[INTERNALS$2].parsedURL;
const headers = new Headers(request[INTERNALS$2].headers);

// fetch step 1.3
if (!headers.has('Accept')) {
headers.set('Accept', '*/*');
}

// Basic fetch
if (!parsedURL.protocol || !parsedURL.hostname) {
throw new TypeError('Only absolute URLs are supported');
}

if (!/^https?:$/.test(parsedURL.protocol)) {
throw new TypeError('Only HTTP(S) protocols are supported');
}

if (request.signal && request.body instanceof Stream__default['default'].Readable && !streamDestructionSupported) {
throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
}

// HTTP-network-or-cache fetch steps 2.4-2.7
let contentLengthValue = null;
if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
contentLengthValue = '0';
}
if (request.body != null) {
const totalBytes = getTotalBytes(request);
if (typeof totalBytes === 'number') {
contentLengthValue = String(totalBytes);
}
}
if (contentLengthValue) {
headers.set('Content-Length', contentLengthValue);
}

// HTTP-network-or-cache fetch step 2.11
if (!headers.has('User-Agent')) {
headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
}

// HTTP-network-or-cache fetch step 2.15
if (request.compress && !headers.has('Accept-Encoding')) {
headers.set('Accept-Encoding', 'gzip,deflate');
}

let agent = request.agent;
if (typeof agent === 'function') {
agent = agent(parsedURL);
}

if (!headers.has('Connection') && !agent) {
headers.set('Connection', 'close');
}

// HTTP-network fetch step 4.2
// chunked encoding is handled by Node.js

return Object.assign({}, parsedURL, {
method: request.method,
headers: exportNodeCompatibleHeaders(headers),
agent
});
}

/**
* abort-error.js
*
* AbortError interface for cancelled requests
*/

/**
* Create AbortError instance
*
* @param   String      message      Error message for human
* @return  AbortError
*/
function AbortError(message) {
Error.call(this, message);

this.type = 'aborted';
this.message = message;

// hide custom error implementation details from end-users
Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream__default['default'].PassThrough;
const resolve_url = Url__default['default'].resolve;

/**
* Fetch function
*
* @param   Mixed    url   Absolute url or Request instance
* @param   Object   opts  Fetch options
* @return  Promise
*/
function fetch(url, opts) {

// allow custom promise
if (!fetch.Promise) {
throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
}

Body.Promise = fetch.Promise;

// wrap http.request into fetch
return new fetch.Promise(function (resolve, reject) {
// build request object
const request = new Request(url, opts);
const options = getNodeRequestOptions(request);

const send = (options.protocol === 'https:' ? https__default['default'] : http__default['default']).request;
const signal = request.signal;

let response = null;

const abort = function abort() {
let error = new AbortError('The user aborted a request.');
reject(error);
if (request.body && request.body instanceof Stream__default['default'].Readable) {
  request.body.destroy(error);
}
if (!response || !response.body) return;
response.body.emit('error', error);
};

if (signal && signal.aborted) {
abort();
return;
}

const abortAndFinalize = function abortAndFinalize() {
abort();
finalize();
};

// send request
const req = send(options);
let reqTimeout;

if (signal) {
signal.addEventListener('abort', abortAndFinalize);
}

function finalize() {
req.abort();
if (signal) signal.removeEventListener('abort', abortAndFinalize);
clearTimeout(reqTimeout);
}

if (request.timeout) {
req.once('socket', function (socket) {
  reqTimeout = setTimeout(function () {
    reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
    finalize();
  }, request.timeout);
});
}

req.on('error', function (err) {
reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
finalize();
});

req.on('response', function (res) {
clearTimeout(reqTimeout);

const headers = createHeadersLenient(res.headers);

// HTTP fetch step 5
if (fetch.isRedirect(res.statusCode)) {
  // HTTP fetch step 5.2
  const location = headers.get('Location');

  // HTTP fetch step 5.3
  const locationURL = location === null ? null : resolve_url(request.url, location);

  // HTTP fetch step 5.5
  switch (request.redirect) {
    case 'error':
      reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
      finalize();
      return;
    case 'manual':
      // node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
      if (locationURL !== null) {
        // handle corrupted header
        try {
          headers.set('Location', locationURL);
        } catch (err) {
          // istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
          reject(err);
        }
      }
      break;
    case 'follow':
      // HTTP-redirect fetch step 2
      if (locationURL === null) {
        break;
      }

      // HTTP-redirect fetch step 5
      if (request.counter >= request.follow) {
        reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
        finalize();
        return;
      }

      // HTTP-redirect fetch step 6 (counter increment)
      // Create a new Request object.
      const requestOpts = {
        headers: new Headers(request.headers),
        follow: request.follow,
        counter: request.counter + 1,
        agent: request.agent,
        compress: request.compress,
        method: request.method,
        body: request.body,
        signal: request.signal,
        timeout: request.timeout,
        size: request.size
      };

      // HTTP-redirect fetch step 9
      if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
        reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
        finalize();
        return;
      }

      // HTTP-redirect fetch step 11
      if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
        requestOpts.method = 'GET';
        requestOpts.body = undefined;
        requestOpts.headers.delete('content-length');
      }

      // HTTP-redirect fetch step 15
      resolve(fetch(new Request(locationURL, requestOpts)));
      finalize();
      return;
  }
}

// prepare response
res.once('end', function () {
  if (signal) signal.removeEventListener('abort', abortAndFinalize);
});
let body = res.pipe(new PassThrough$1());

const response_options = {
  url: request.url,
  status: res.statusCode,
  statusText: res.statusMessage,
  headers: headers,
  size: request.size,
  timeout: request.timeout,
  counter: request.counter
};

// HTTP-network fetch step 12.1.1.3
const codings = headers.get('Content-Encoding');

// HTTP-network fetch step 12.1.1.4: handle content codings

// in following scenarios we ignore compression support
// 1. compression support is disabled
// 2. HEAD request
// 3. no Content-Encoding header
// 4. no content response (204)
// 5. content not modified response (304)
if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
  response = new Response(body, response_options);
  resolve(response);
  return;
}

// For Node v6+
// Be less strict when decoding compressed responses, since sometimes
// servers send slightly invalid responses that are still accepted
// by common browsers.
// Always using Z_SYNC_FLUSH is what cURL does.
const zlibOptions = {
  flush: zlib__default['default'].Z_SYNC_FLUSH,
  finishFlush: zlib__default['default'].Z_SYNC_FLUSH
};

// for gzip
if (codings == 'gzip' || codings == 'x-gzip') {
  body = body.pipe(zlib__default['default'].createGunzip(zlibOptions));
  response = new Response(body, response_options);
  resolve(response);
  return;
}

// for deflate
if (codings == 'deflate' || codings == 'x-deflate') {
  // handle the infamous raw deflate response from old servers
  // a hack for old IIS and Apache servers
  const raw = res.pipe(new PassThrough$1());
  raw.once('data', function (chunk) {
    // see http://stackoverflow.com/questions/37519828
    if ((chunk[0] & 0x0F) === 0x08) {
      body = body.pipe(zlib__default['default'].createInflate());
    } else {
      body = body.pipe(zlib__default['default'].createInflateRaw());
    }
    response = new Response(body, response_options);
    resolve(response);
  });
  return;
}

// for br
if (codings == 'br' && typeof zlib__default['default'].createBrotliDecompress === 'function') {
  body = body.pipe(zlib__default['default'].createBrotliDecompress());
  response = new Response(body, response_options);
  resolve(response);
  return;
}

// otherwise, use response as-is
response = new Response(body, response_options);
resolve(response);
});

writeToStream(req, request);
});
}
/**
* Redirect code matching
*
* @param   Number   code  Status code
* @return  Boolean
*/
fetch.isRedirect = function (code) {
return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

var lib$1 = /*#__PURE__*/Object.freeze({
__proto__: null,
'default': fetch,
Headers: Headers,
Request: Request,
Response: Response,
FetchError: FetchError
});

function wasm_key_manager_bg(imports){return _loadWasmModule(0, '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EiACKQP9A3wiEyACKQP9A3wiFEIz/SACQf0FakEIaikDACACQf0EakEIaikDAHwgFiAaVP18IAJB/QVqQQhqKQMAfCASIBZU/XwgAkH9A2pBCGopAwB8IBMgElT9fCACQf0DakEIaikDAHwgFCATVP18Qg39/XwiFkIz/SACQf0EakEIaikDACACQf0DakEIaikDAHwgCiAYVP18IAJB/QVqQQhqKQMAfCAHIApU/XwgAkH9BWpBCGopAwB8IAwgB1T9fCACQf0DakEIaikDAHwgECAMVP18IBYgEFT9fEIN/f18IgpC/f39/f39/QP9NwP9JCACIAIpA/0DIhMgAikD/QZ8IgcgAikD/QR8IgwgAikD/QR8IhAgAikD/QV8IhIgCkIz/SACQf0EakEIaikDACACQf0DakEIaikDAHwgDyAZVP18IAJB/QRqQQhqKQMAfCAGIA9U/XwgAkH9BWpBCGopAwB8IA0gBlT9fCACQf0FakEIaikDAHwgCSANVP18IAogCVT9fEIN/f18Ig9C/f39/f39/QP9NwP9JCACIAIpA/0GIhkgAikD/QV8IgYgAikD/QN8Ig0gAikD/QR8IgkgAikD/QR8IgogD0Iz/SACQf0DakEIaikDACACQf0GakEIaikDAHwgByATVP18IAJB/QRqQQhqKQMAfCAMIAdU/XwgAkH9BGpBCGopAwB8IBAgDFT9fCACQf0FakEIaikDAHwgEiAQVP18IA8gElT9fEIN/f18Ig9C/f39/f39/QP9NwP9JCACIA9CM/0gAkH9BmpBCGopAwAgAkH9BWpBCGopAwB8IAYgGVT9fCACQf0DakEIaikDAHwgDSAGVP18IAJB/QRqQQhqKQMAfCAJIA1U/XwgAkH9BGpBCGopAwB8IAogCVT9fCAPIApU/XxCDf39QhN+IBRC/f39/f39/QP9fCIPQv39/f39/f0D/TcD/SQgAiAPQjP9IBZC/f39/f39/QP9fDcD/SQgAkH9JGogAkH9JGpBMhAfIAJBEGogAikD/SQiD0IAIARCABBwIAJB/QBqIAIpA/0kIgZCACAVQgAQcCACQf0BaiACKQP9JCINQgAgDkIAEHAgAkH9AmogAikD/SQiCUIAIAhCABBwIAJB/QJqIAIpA/0kIgpCACADQgAQcCACIA9CACADQgAQcCACQf0AaiAGQgAg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fCARIBtU/XwgA0H9B2pBCGopAwB8IAwgEVT9fCADQf0HakEIaikDAHwgHCAMVP18IANB/QZqQQhqKQMAfCAdIBxU/XwgHiAdVP18Qg39/XwiEUL9/f39/f39A/03A/0dIAMgAykD/QgiFyADKQP9CHwiDCADKQP9B3wiHCADKQP9B3wiHSADKQP9BnwiHyARQjP9IANB/QhqQQhqKQMAIANB/QlqQQhqKQMAfCAUIBZU/XwgA0H9B2pBCGopAwB8IAkgFFT9fCADQf0HakEIaikDAHwgCyAJVP18IANB/QZqQQhqKQMAfCAOIAtU/XwgESAOVP18Qg39/XwiFEL9/f39/f39A/03A/0dIAMgAykD/QgiFiADKQP9CHwiCSADKQP9B3wiCyADKQP9BnwiDiADKQP9BnwiESAUQjP9IANB/QhqQQhqKQMAIANB/QhqQQhqKQMAfCAMIBdU/XwgA0H9B2pBCGopAwB8IBwgDFT9fCADQf0HakEIaikDAHwgHSAcVP18IANB/QZqQQhqKQMAfCAfIB1U/XwgFCAfVP18Qg39/XwiFEL9/f39/f39A/03A/0dIAMgFEIz/SADQf0IakEIaikDACADQf0IakEIaikDAHwgCSAWVP18IANB/QdqQQhqKQMAfCALIAlU/XwgA0H9BmpBCGopAwB8IA4gC1T9fCADQf0GakEIaikDAHwgESAOVP18IBQgEVT9fEIN/f1CE34gFUL9/f39/f39A/18IhRC/f39/f39/QP9NwP9HSADIBRCM/0gHkL9/f39/f39A/18NwP9HSADQf0caiADQf0dahAxIANB/R1qIAEQMUEAIQFBASECA0AgA0H9HWogAWotAAAgA0H9HGogAWotAABzIgRBACAEa3JBf3NB/QFxQQd2EP0BIAJxIQIgAUEBaiIBQSBHDQALIAIQ/QEhBSADQv39/f39/f0/IA99IglCM/1C/f39/f39/T8gEn0iD0L9/f39/f39A/18IhQ3A/0dIANC/f39/f39/T8gCH0iC0Iz/SAJQv39/f39/f0D/XwiCTcD/R0gA0L9/f39/f39PyAKfSISQjP9IAtC/f39/f39/QP9fCILNwP9HSADIBJC/f39/f39/QP9Qv39/f39/f0/IA19IghCM/18IhI3A/0dIAMgD0Iz/UITfiAIQv39/f39/f0D/XwiDzcD/R0gA0H9HGogA0H9HWoQMSADQf0daiADQf0dahAxQQAhAUEBIQIDQCADQf0daiABai0AACADQf0caiABai0AAHMiBEEAIARrckF/c0H9AXFBB3YQ/QEgAnEhAiABQQFqIgFBIEcNAAsgA0H9BWogFEIAQv2f/YD9/QBCABBwIANB/QZqIA9CAEL9/f399DVCABBwIANB/QRqIAlCAEL91jX6/QBCABBwIANB/QNqIBJCAEL9/f39/f0DQgAQcCADQf0EaiALQgBC/f39tf39GUIAEHAgA0H9BWogFEIAQv39/f39/f0HQgAQcCADQf0GaiAPQgBC/f39/f39A0IAEHAgA0H9BGogCUIAQv2f/YD9/QBCABBwIANB/QNqIBJCAEL9/f21/f0ZQgAQcCADQf0EaiALQgBC/dY1+v0AQgAQcCADQf0FaiAUQgBC/dY1+v0AQgAQcCADQf0FaiAPQgBC/f39/f39/QNCABBwIANB/QRqIAlCAEL9/f21/f0ZQgAQcCADQf0DaiASQgBC/f39/fQ1QgAQcCADQf0EaiALQgBC/f39/f39A0IAEHAgA0H9BWogFEIAQv39/bX9/RlCABBwIANB/QVqIA9CAEL9/f39sv0DQgAQcCADQf0EaiAJQgBC/f39/f39A0IAEHAgA0H9A2ogEkIAQv39/f39/f0DQgAQcCADQf0DaiALQgBC/f39/fQ1QgAQcCADQf0FaiAUQgBC/f39/f39A0IAEHAgA0H9BWogD0IAQv39/f39/f0BQgAQcCADQf0EaiAJQgBC/f39/fQ1QgAQcCADQf0DaiASQgBC/f39/bL9A0IAEHAgA0H9A2ogC0IAQv39/f39/f0DQgAQcCADQf0FakEIaikDACEXIANB/QZqQQhqKQMAIRUgAykD/QUhDSADKQP9BiEUIANB/QRqQQhqKQMAIRYgAykD/QQhDiADQf0DakEIaikDACEbIAMpA/0DIREgA0H9BGpBCGopAwAhICADKQP9BCEMIANB/QVqQQhqKQMAISQgA0H9BmpBCGopAwAhISADKQP9BSEcIAMpA/0GIQkgA0H9BGpBCGopAwAhIiADKQP9BCEdIANB/QNqQQhqKQMAISMgAykD/QMhHiADQf0EakEIaikDACEqIAMpA/0EIR8gAykD/QUhEiADKQP9BSELIAMpA/0EIQ8gAykD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IAJBCGpB/QBqICRC/f39/f39/T8gKn18IixC/f39/f39/QP9ICVC/f39/f39/T8gK318Ii1CM/18Ii43AwAgAkEIakH9AGogLUL9/f39/f39A/0gI0L9/f39/f39PyApfXwiL0Iz/XwiLTcDACACQQhqQThqIC9C/f39/f39/QP9ICJC/f39/f39/T8gKH18IjBCM/18Ii83AwAgAkEIakEwaiAwQv39/f39/f0D/SAmQv39/f39/f0/ICd9fCIxQjP9fCIwNwMAIAJBCGpB/QBqIBIpAwA3AwAgAkEIakH9AGogESkDADcDACACQQhqQf0AaiAQKQMANwMAIAJBCGpB/QBqIA8pAwA3AwAgAiAsQjP9QhN+IDFC/f39/f39/QP9fCIsNwMwIAIgKiAkfCIkNwMoIAIgKyAlfCIlNwMgIAIgKSAjfCIjNwMYIAIgKCAifCIiNwMQIAIgJyAmfCImNwMIIAIgAikD/Qw3A1ggAkEIakH9AWogAkH9C2pBIGoiEykDADcDACACQQhqQf0BaiACQf0LakEYaiIUKQMANwMAIAJBCGpB/QFqIAJB/QtqQRBqIhUpAwA3AwAgAkEIakH9AWogAkH9C2pBCGoiFikDADcDACACQQhqQf0BaiAuNwMAIAJBCGpB/QFqIC03AwAgAkEIakH9AWogLzcDACACQQhqQf0BaiAwNwMAIAJBCGpB/QFqICw3AwAgAkEIakH9AWogJDcDACACQQhqQf0BaiAlNwMAIAJBCGpB/QFqICM3AwAgAkEIakH9AWogIjcDACACIAIpA/0LNwP9ASACICY3A/0BIAJBCGpB/QJqIA8pAwA3AwAgAkEIakH9AmogECkDADcDACACQQhqQf0CaiARKQMANwMAIAJBCGpB/QFqIBIpAwA3AwAgAkEIakH9AWogAikD/Qw3AwAgAkEIakH9AmogEykDADcDACACQQhqQf0CaiAUKQMANwMAIAJBCGpB/QJqIBUpAwA3AwAgAkEIakH9AmogFikDADcDACACQQhqQf0CaiACKQP9CzcDACACQf0DaiAuNwMAIAJB/QNqIC03AwAgAkH9A2ogLzcDACACQf0CaiAwNwMAIAJB/QJqICw3AwAgAkH9AmogJDcDACACQf0CaiAlNwMAIAJB/QJqICM3AwAgAkH9AmogIjcDACACICY3A/0CIAJB/QNqIA8pAwA3AwAgAkH9A2ogECkDADcDACACQf0DaiARKQMANwMAIAJB/QNqIBIpAwA3AwAgAkH9A2ogAikD/Qw3AwAgAkH9A2ogEykDADcDACACQf0DaiAUKQMANwMAIAJB/QNqIBUpAwA3AwAgAkH9A2ogFikDADcDACACQf0DaiACKQP9CzcDACACQf0EaiAuNwMAIAJB/QRqIC03AwAgAkH9BGogLzcDACACQf0EaiAwNwMAIAJB/QRqICw3AwAgAkH9BGogJDcDACACQf0EaiAlNwMAIAJB/QNqICM3AwAgAkH9A2ogIjcDACACICY3A/0DIAJB/QRqIA8pAwA3AwAgAkH9BGogECkDADcDACACQf0EaiARKQMANwMAIAJB/QRqIBIpAwA3AwAgAkH9BGogAikD/Qw3AwAgAkH9BWogEykDADcDACACQf0EaiAUKQMANwMAIAJB/QRqIBUpAwA3AwAgAkH9BGogFikDADcDACACQf0EaiACKQP9CzcDACACQf0FaiAuNwMAIAJB/QVqIC03AwAgAkH9BWogLzcDACACQf0FaiAwNwMAIAJB/QVqICw3AwAgAkH9BWogJDcDACACQf0FaiAlNwMAIAJB/QVqICM3AwAgAkH9BWogIjcDACACICY3A/0FIAJB/QVqIA8pAwA3AwAgAkH9BWogECkDADcDACACQf0FaiARKQMANwMAIAJB/QVqIBIpAwA3AwAgAkH9BWogAikD/Qw3AwAgAkH9BmogEykDADcDACACQf0GaiAUKQMANwMAIAJB/QZqIBUpAwA3AwAgAkH9BmogFikDADcDACACQf0GaiACKQP9CzcDACACQf0GaiAuNwMAIAJB/QZqIC03AwAgAkH9BmogLzcDACACQf0GaiAwNwMAIAJB/QZqICw3AwAgAkH9BmogJDcDACACQf0GaiAlNwMAIAJB/QZqICM3AwAgAkH9BmogIjcDACACICY3A/0GIAJB/QdqIA8pAwA3AwAgAkH9B2ogECkDADcDACACQf0HaiARKQMANwMAIAJB/QdqIBIpAwA3AwAgAkH9BmogAikD/Qw3AwAgAkH9B2ogEykDADcDACACQf0HaiAUKQMANwMAIAJB/QdqIBUpAwA3AwAgAkH9B2ogFikDADcDACACQf0HaiACKQP9CzcDACACQf0IaiAuNwMAIAJB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QRh0QRx1aiIEOgAAIAVBAWoiBUE/Rw0ACyADQThqIANB/QVqQThqKQMANwMAIANBMGogA0H9BWpBMGopAwA3AwAgA0EoaiADQf0FakEoaiIHKQMANwMAIANBIGogA0H9BWpBIGopAwA3AwAgA0EYaiADQf0FakEYaikDADcDACADQRBqIANB/QVqQRBqKQMANwMAIANBCGogA0H9BWpBCGopAwA3AwAgAyADKQP9BTcDACADQf0AakEgakIANwMAIANB/QBqQRhqQgA3AwAgA0H9AGpBEGpCADcDACADQf0AakEIakIANwMAIANB/QBqQf0AakIANwMAIANB/QFqQgA3AwAgA0H9AGpBOGpCADcDACADQf0AakEwakIANwMAIANCADcDQCADQgE3A2ggA0IBNwP9AUEAIQggA0H9AWpBAEH9ABD9ARogA0H9A2pB/QBqIQQgA0H9A2pB/QBqIQYgA0H9A2pBKGohAiADQf0FakH9AGohCSADQf0FakH9AGohCiADQf0AakH9AGohCyADQf0AakEoaiEMAkADQCAIIgVBP0sNASAFQQFqIQggBUEBcUUNACADQf0BaiABIAVBAXZB/QdsaiADIAVqLQAAECcgA0H9BWogA0H9AGogA0H9AWoQJCADQf0DaiADQf0FaiAKEBcgA0H9BmogByAJEBcgA0H9B2ogCSAKEBcgA0H9BGogA0H9BWogBxAXIAJBIGogA0H9BmpBIGopAwA3AwAgAkEYaiADQf0GakEYaikDADcDACACQRBqIANB/QZqQRBqKQMANwMAIAJBCGogA0H9BmpBCGopAwA3AwAgAiADKQP9BjcDACAGIAMpA/0HNwMAIAZBCGogA0H9B2pBCGopAwA3AwAgBkEQaiADQf0HakEQaikDADcDACAGQRhqIANB/QdqQRhqKQMANwMAIAZBIGogA0H9B2pBIGopAwA3AwAgBEEgaiADQf0EakEgaikDADcDACAEQRhqIANB/QRqQRhqKQMANwMAIARBEGogA0H9BGpBEGopAwA3AwAgBEEIaiADQf0EakEIaikDADcDACAEIAMpA/0ENwMAIANB/QBqIANB/QNqQf0BEP0BGgwACwsgA0H9BGpBIGoiDSADQf0AakEgaikDADcDACADQf0EakEYaiIOIANB/QBqQRhqKQMANwMAIANB/QRqQRBqIg8gA0H9AGpBEGopAwA3AwAgA0H9BGpBCGoiECADQf0AakEIaikDADcDACADQf0EakEwaiAMQQhqKQMANwMAIANB/QRqQThqIAxBEGopAwA3AwAgA0H9BGpB/QBqIAxBGGopAwA3AwAgA0H9BGpB/QBqIAxBIGopAwA3AwAgAyADKQNANwP9BCADIAwpAwA3A/0EIANB/QRqQf0AaiALQSBqKQMANwMAIANB/QRqQf0AaiALQRhqKQMANwMAIANB/QRqQf0AaiALQRBqKQMANwMAIANB/QRqQf0AaiALQQhqKQMANwMAIAMgCykDADcD/QQgA0H9BWogA0H9BGoQKCADQf0DaiADQf0FakH9ARD9ARogA0H9BWogA0H9A2ogA0H9A2pB/QBqIgQQFyADQf0HaiADQf0DakEoaiICIANB/QNqQf0AaiIGEBcgA0H9AWogBiAEEBcgA0H9BWpB/QBqIgUgA0H9B2pBIGoiCykDADcDACADQf0FakH9AGoiCCADQf0HakEYaiIMKQMANwMAIANB/QVqQThqIgcgA0H9B2pBEGoiESkDADcDACADQf0FakEwaiIJIANB/QdqQQhqIhIpAwA3AwAgA0H9BWpB/QBqIgogA0H9AWpBCGoiEykDADcDACADQf0FakH9AGoiFCADQf0BakEQaiIVKQMANwMAIANB/QVqQf0AaiIWIANB/QFqQRhqIhcpAwA3AwAgA0H9BWpB/QBqIhggA0H9AWpBIGoiGSkDADcDACADIAMpA/0HNwP9BSADIAMpA/0BNwP9BSADQf0EaiADQf0FakH9ABD9ARogA0H9BWogA0H9BGoQKCADQf0DaiADQf0FakH9ARD9ARogA0H9BWogA0H9A2ogBBAXIANB/QdqIAIgBhAXIANB/QFqIAYgBBAXIAUgCykDADcDACAIIAwpAwA3AwAgByARKQMANwMAIAkgEikDADcDACAKIBMpAwA3AwAgFCAVKQMANwMAIBYgFykDADcDACAYIBkpAwA3AwAgAyADKQP9BzcD/QUgAyADKQP9ATcD/QUgA0H9BGogA0H9BWpB/QAQ/QEaIANB/QVqIANB/QRqECggA0H9A2ogA0H9BWpB/QEQ/QEaIANB/QVqIANB/QNqIAQQFyADQf0HaiACIAYQFyADQf0BaiAGIAQQFyAFIAspAwA3AwAgCCAMKQMANwMAIAcgESkDADcDACAJIBIpAwA3AwAgCiATKQMANwMAIBQgFSkDADcDACAWIBcpAwA3AwAgGCAZKQMANwMAIAMgAykD/Qc3A/0FIAMgAykD/QE3A/0FIANB/QRqIANB/QVqQf0AEP0BGiADQf0FaiADQf0EahAoIANB/QFqIANB/QVqIANB/QVqQf0AaiIHEBcgA0H9BmogA0H9BWpBKGoiCSADQf0FakH9AGoiChAXIANB/QZqIAogBxAXIANB/QdqIANB/QVqIAkQFyADQf0BakH9AGogA0H9BmpBIGopAwA3AwAgA0H9AWpB/QBqIANB/QZqQRhqKQMANwMAIANB/QFqQThqIANB/QZqQRBqKQMANwMAIANB/QFqQTBqIANB/QZqQQhqKQMANwMAIANB/QFqQf0AaiADQf0GakEIaiITKQMANwMAIANB/QFqQf0AaiADQf0GakEQaiIUKQMANwMAIANB/QFqQf0AaiADQf0GakEYaiIVKQMANwMAIANB/QFqQf0AaiADQf0GakEgaiIWKQMANwMAIAMgAykD/QY3A/0CIAMgAykD/QY3A/0CIANB/QJqIAspAwA3AwAgA0H9AmogDCkDADcDACADQf0CaiARKQMANwMAIANB/QJqIBIpAwA3AwAgAyADKQP9BzcD/QIgA0H9AGogA0H9AWpB/QEQ/QEaQQAhCAJAA0AgCCIFQT9LDQEgBUEBaiEIIAVBAXENACADQf0BaiABIAVBAXZB/QdsaiADIAVqLQAAECcgA0H9BWogA0H9AGogA0H9AWoQJCADQf0DaiADQf0FaiAHEBcgA0H9BmogCSAKEBcgA0H9B2ogCiAHEBcgA0H9BGogA0H9BWogCRAXIAJBIGogFikDADcDACACQRhqIBUpAwA3AwAgAkEQaiAUKQMANwMAIAJBCGogEykDADcDACACIAMpA/0GNwMAIAYgAykD/Qc3AwAgBkEIaiASKQMANwMAIAZBEGogESkDADcDACAGQRhqIAwpAwA3AwAgBkEgaiALKQMANwMAIARBIGogDSkDADcDACAEQRhqIA4pAwA3AwAgBEEQaiAPKQMANwMAIARBCGogECkDADcDACAEIAMpA/0ENwMAIANB/QBqIANB/QNqQf0BEP0BGgwACwsgACADQf0AakH9ARD9ARogA0H9B2okAAv9FAIB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QQgQ/QEiEEUNCAsgC0EANgJwIAsgDjYCbCALIBA2AmggC0H9CWogC0H9AWpB/QgQ/QEaIAtB/QBqIA4gC0H9CWoQTSALQRBqIAsoAnA2AgAgCyALKQNoNwMIIAsgDDYCGCALIA02AhQgAC0AECEOIAAtABEhECAAKAIAIQ8gACgCDCERIAtBIGpBAEH9ABD9ARogC0H9AWpB/QAQbyALIA02Av0JIAtB/QFqIAtB/QlqQQQQTiALIAI2Av0JIAtB/QFqIAtB/QlqQQQQTiALIBE2Av0JIAtB/QFqIAtB/QlqQQQQTiALIA82Av0JIAtB/QFqIAtB/QlqQQQQTiALIBA2Av0JIAtB/QFqIAtB/QlqQQQQTiALIA42Av0JIAtB/QFqIAtB/QlqQQQQTiALIAQ2Av0JIAtB/QFqIAtB/QlqQQQQTiALQf0BaiADIAQQTiALIAY2Av0JIAtB/QFqIAtB/QlqQQQQTiALQf0BaiAFIAYQTiALIAg2Av0JIAtB/QFqIAtB/QlqQQQQTiALQf0BaiAHIAgQTiALIAo2Av0JIAtB/QFqIAtB/QlqQQQQTiALQf0BaiAJIAoQTiALQf0JaiALQf0BakH9ARD9ARogC0H9AGogC0H9CWoQSCALKAL9ASIGQf0ATw0FIAZB/QBHDQYgC0EgakE4aiALQf0AakE4aikDADcDACALQSBqQTBqIAtB/QBqQTBqKQMANwMAIAtBIGpBKGogC0H9AGpBKGopAwA3AwAgC0EgakEgaiALQf0AakEgaikDADcDACALQSBqQRhqIAtB/QBqQRhqKQMANwMAIAtBIGpBEGogC0H9AGpBEGopAwA3AwAgC0EgakEIaiALQf0AakEIaikDADcDACALIAspA2g3AyAgC0H9AWogC0EgakH9ABD9ARoCQCANRQ0AIA1Bf2ohCiALQf0JaiEOIAtB/QlqIQggDCEEQQAhBgJAA0AgDiAGNgIAIAhBADYCACALQf0JakE4aiALQf0BakE4aikAADcDACALQf0JakEwaiALQf0BakEwaikAADcDACALQf0JakEoaiALQf0BakEoaikAADcDACALQf0JakEgaiALQf0BakEgaikAADcDACALQf0JakEYaiALQf0BakEYaikAADcDACALQf0JakEQaiALQf0BakEQaikAADcDACALQf0JakEIaiAL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ACj9/f39/f39/TcDACAEIAExADdCOP0gATEANkIw/SABMQA1Qij9IAExADRCIP0gATEAM0IY/SABMQAyQhD9IAExADFCCP0gBCkDACABMQAw/f39/f39/f0iCjcDACADIAExAD9COP0gATEAPkIw/SABMQA9Qij9IAExADxCIP0gATEAO0IY/SABMQA6QhD9IAExADlCCP0gAykDACABMQA4/f39/f39/f0iCzcDACAJKQMAIQwgCCkDACENIAcpAwAhDiAGKQMAIQ8gBSkDACEQIAIgAikDCCIRQv39/f39/f0H/TcDSCACIAtCFP03A/0BIAIgC0Ig/UL9/f39/f39B/0gCkIg/f03A/0BIAIgCkIU/UL9/f39/f39B/0gEEIs/f03A/0BIAIgD0IE/UL9/f39/f39B/03A3AgAiAPQjD9Qv39/f39/f0H/SAOQhD9/TcDaCACIA5CJP1C/f39/f39/Qf9IA1CHP39NwNgIAIgDUIY/UL9/f39/f39B/0gDEIo/f03A1ggAiAMQgz9Qv39/f39/f0H/SARQjT9/TcDUCACIBBCCP1C/f39/f39/Qf9IA9COP39NwN4IAJB/QFqIAJB/QBqQf39/QAQFCACIAJB/QFqQSBqIgEpAwA3A2ggAiACQf0BakEYaiIFKQMANwNgIAIgAkH9AWpBEGoiBikDADcDWCACIAJB/QFqQQhqIgcpAwA3A1AgAiACKQP9ATcDSCACQf0BaiACQf0AakH9/f0AEBQgAiABKQMANwP9ASACIAUpAwA3A/0BIAIgBikDADcD/QEgAiAHKQMANwN4IAIgAikD/QE3A3AgACACKQP9ASACKQP9ASACKQP9ASACKQN4IAIpA3AgAikDSHwiD0I0/XwgAikDUHwiCkI0/XwgAikDWHwiC0I0/XwgAikDYHwiDEI0/XwgAikDaHxC/f39/f39/Qf9IAxC/f39/f39/Qf9IAtC/f39/f39/Qf9IApC/f39/f39/Qf9IA9C/f39/f39/Qf9Qv0o/Zz9fnwiCkI//XxC/f2x/f39eXwiC0I//XxC/ax/fCIMQj/9fCINQj/9fEL9/f39/f18fCIOQj/9Ig9C/f39/f0B/SAKQv39/f39/f0H/XwiCkL9/f39/f39B/03AwAgACAPQv31/f39/Qb9IAtC/f39/f39/Qf9fCAKQjT9fCIK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QAJAIARFDQAgAEEEaiAFNgIAQQEhBAwBCyAGQRtqIAopAwA3AAAgBkEjaiALKQMANwAAIAZBK2ogDCkDADcAACAGQTNqIA0pAwA3AAAgBkE4aiAPKQAANwAAIAYgBi8BcDsBACAGIAc2AA8gBiAINgALIAYgDjYAByAGIAU2AAMgBiAGKQNANwATIAYgCS0AADoAAiAGQf0AaiABIAIgAyAGEP0BIAAgBigCeEEERjoAAUEAIQQLIAAgBDoAACAGQf0CaiQAC/0IAgF/D34jAEH9AWsiAyQAIAMgASkDACIEIAEpAygiBXw3AwAgAyABKQMgIgYgAUH9AGopAwAiB3w3AyAgAyABKQMYIgggAUH9AGopAwAiCXw3AxggAyABKQMQIgogAUE4aikDACILfDcDECADIAEpAwgiDCABQTBqKQMAIg18NwMIIAMgB0L9/f39/f39PyAGfXwiBkL9/f39/f39A/0gCUL9/f39/f39PyAIfXwiB0Iz/Xw3A0ggAyAHQv39/f39/f0D/SALQv39/f39/f0/IAp9fCIHQjP9fDcDQCADIAdC/f39/f39/QP9IA1C/f39/f39/T8gDH18IgdCM/18NwM4IAMgB0L9/f39/f39A/0gBUL9/f39/f39PyAEfXwiBEIz/Xw3AzAgAyAGQjP9QhN+IARC/f39/f39/QP9fDcDKCADQf0AaiADIAIQFyADQf0AaiADQShqIAJBKGoQFyADQf0BaiABQf0AaiACQf0AahAXIANB/QFqIAFB/QBqIAJB/QBqEBcgACADKQNwIgRC/f39/f39/T98IAMpA/0BIgV9IgZC/f39/f39/QP9IAMpA2giB0L9/f39/f39P3wgAykD/QEiCH0iCUIz/Xw3AyAgACAJQv39/f39/f0D/SADKQNgIglC/f39/f39/T98IAMpA/0BIgp9IgtCM/18NwMYIAAgC0L9/f39/f39A/0gAykDWCILQv39/f39/f0/fCADKQP9ASIMfSINQjP9fDcDECAAIA1C/f39/f39/QP9IAMpA1AiDUL9/f39/f39P3wgAykDeCIOfSIPQjP9fDcDCCAAIAZCM/1CE34gD0L9/f39/f39A/18NwMAIAMpA/0BIQYgAykD/QEhDyADKQP9ASEQIAMpA/0BIREgAykD/QEhEiAAQf0AaiAFIAR8NwMAIABB/QBqIAggB3w3AwAgAEE4aiAKIAl8NwMAIABBMGogDCALfDcDACAAIA4gDXw3AyggAEH9AGogAykD/QEiBCASQgH9IgV8NwMAIABB/QBqIAMpA/0BIgcgEUIB/SIIfDcDACAAQf0AaiADKQP9ASIJIBBCAf0iCnw3AwAgAEH9AGogAykD/QEiCyAPQgH9Igx8NwMAIAAgAykD/QEiDSAGQgH9IgZ8NwNQIABB/QFqIAVC/f39/f39/T98IAR9IgRC/f39/f39/QP9IAhC/f39/f39/T98IAd9IgVCM/18NwMAIABB/QFqIAVC/f39/f39/QP9IApC/f39/f39/T98IAl9IgVCM/18NwMAIABB/QFqIAVC/f39/f39/QP9IAxC/f39/f39/T98IAt9IgVCM/18NwMAIABB/QFqIAVC/f39/f39/QP9IAZC/f39/f39/T98IA19IgVCM/18NwMAIAAgBEIz/UITfiAFQv39/f39/f0D/Xw3A3ggA0H9AWokAAv9CAIBfw9+IwBB/QFrIgMkACADIAEpAwAiBCABKQMoIgV8NwMAIAMgASkDICIGIAFB/QBqKQMAIgd8NwMgIAMgASkDGCIIIAFB/QBqKQMAIgl8NwMYIAMgASkDECIKIAFBOGopAwAiC3w3AxAgAyABKQMIIgwgAUEwaikDACINfDcDCCADIAdC/f39/f39/T8gBn18IgZC/f39/f39/QP9IAlC/f39/f39/T8gCH18IgdCM/18NwNIIAMgB0L9/f39/f39A/0gC0L9/f39/f39PyAKfXwiB0Iz/Xw3A0AgAyAHQv39/f39/f0D/SANQv39/f39/f0/IAx9fCIHQjP9fDcDOCADIAdC/f39/f39/QP9IAVC/f39/f39/T8gBH18IgRCM/18NwMwIAMgBkIz/UITfiAEQv39/f39/f0D/Xw3AyggA0H9AGogAyACQShqEBcgA0H9AGogA0EoaiACEBcgA0H9AWogAUH9AGogAkH9AGoQFyADQf0BaiABQf0AaiACQf0AahAXIAAgAykDcCIEQv39/f39/f0/fCADKQP9ASIFfSIGQv39/f39/f0D/SADKQNoIgdC/f39/f39/T98IAMpA/0BIgh9IglCM/18NwMgIAAgCUL9/f39/f39A/0gAykDYCIJQv39/f39/f0/fCADKQP9ASIKfSILQjP9fDcDGCAAIAtC/f39/f39/QP9IAMpA1giC0L9/f39/f39P3wgAykD/QEiDH0iDUIz/Xw3AxAgACANQv39/f39/f0D/SADKQNQIg1C/f39/f39/T98IAMpA3giDn0iD0Iz/Xw3AwggACAGQjP9QhN+IA9C/f39/f39/QP9fDcDACADKQP9ASEGIAMpA/0BIQ8gAykD/QEhECADKQP9ASERIAMpA/0BIRIgAEH9AGogBSAEfDcDACAAQf0AaiAIIAd8NwMAIABBOGogCiAJfDcDACAAQTBqIAwgC3w3AwAgACAOIA18NwMoIABB/QFqIAMpA/0BIgQgEkIB/SIFfDcDACAAQf0BaiADKQP9ASIHIBFCAf0iCHw3AwAgAEH9AWogAykD/QEiCSAQQgH9Igp8NwMAIABB/QFqIAMpA/0BIgsgD0IB/SIMfDcDACAAIAMpA/0BIg0gBkIB/SIGfDcDeCAAQf0AaiAFQv39/f39/f0/fCAEfSIEQv39/f39/f0D/SAIQv39/f39/f0/fCAHfSIFQjP9fDcDACAAQf0AaiAFQv39/f39/f0D/SAKQv39/f39/f0/fCAJfSIFQjP9fDcDACAAQf0AaiAFQv39/f39/f0D/SAMQv39/f39/f0/fCALfSIFQjP9fDcDACAAQf0AaiAFQv39/f39/f0D/SAGQv39/f39/f0/fCANfSIFQjP9fDcDACAAIARCM/1CE34gBUL9/f39/f39A/18NwNQIANB/QFqJAAL/QgCAX8PfiMAQf0BayIDJAAgAyABKQMAIgQgASkDKCIFfDcDCCADIAEpAyAiBiABQf0AaikDACIHfDcDKCADIAEpAxgiCCABQf0AaikDACIJfDcDICADIAEpAxAiCiABQThqKQMAIgt8NwMYIAMgASkDCCIMIAFBMGopAwAiDXw3AxAgAyAHQv39/f39/f0/IAZ9fCIGQv39/f39/f0D/SAJQv39/f39/f0/IAh9fCIHQjP9fDcDUCADIAdC/f39/f39/QP9IAtC/f39/f39/T8gCn18IgdCM/18NwNIIAMgB0L9/f39/f39A/0gDUL9/f39/f39PyAMfXwiB0Iz/Xw3A0AgAyAHQv39/f39/f0D/SAFQv39/f39/f0/IAR9fCIEQjP9fDcDOCADIAZCM/1CE34gBEL9/f39/f39A/18NwMwIANB/QBqIANBCGogAhAXIANB/QFqIANBMGogAkEoahAXIANB/QFqIAFB/QBqIAJB/QBqEBcgACADKQN4IgRC/f39/f39/T98IAMpA/0BIgV9IgZC/f39/f39/QP9IAMpA3AiB0L9/f39/f39P3wgAykD/QEiCH0iCUIz/Xw3AyAgACAJQv39/f39/f0D/SADKQNoIglC/f39/f39/T98IAMpA/0BIgp9IgtCM/18NwMYIAAgC0L9/f39/f39A/0gAykDYCILQv39/f39/f0/fCADKQP9ASIMfSINQjP9fDcDECAAIA1C/f39/f39/QP9IAMpA1giDUL9/f39/f39P3wgAykD/QEiDn0iD0Iz/Xw3AwggACAGQjP9QhN+IA9C/f39/f39/QP9fDcDACABQf0AaikDACEGIAFB/QBqKQMAIQ8gAUH9AGopAwAhECABQf0AaikDACERIAEpA1AhEiAAQf0AaiAFIAR8NwMAIABB/QBqIAggB3w3AwAgAEE4aiAKIAl8NwMAIABBMGogDCALfDcDACAAIA4gDXw3AyggAEH9AGogAykD/QEiBCARQgH9IgV8NwMAIABB/QBqIAMpA/0BIgcgEEIB/SIIfDcDACAAQf0AaiADKQP9ASIJIA9CAf0iCnw3AwAgAEH9AGogAykD/QEiCyAGQgH9IgZ8NwMAIAAgAykD/QEiDCASQgH9Ig18NwNQIABB/QFqIAVC/f39/f39/T98IAR9IgRC/f39/f39/QP9IAhC/f39/f39/T98IAd9IgVCM/18NwMAIABB/QFqIAVC/f39/f39/QP9IApC/f39/f39/T98IAl9IgVCM/18NwMAIABB/QFqIAVC/f39/f39/QP9IAZC/f39/f39/T98IAt9IgVCM/18NwMAIABB/QFqIAVC/f39/f39/QP9IA1C/f39/f39/T98IAx9IgVCM/18NwMAIAAgBEIz/UITfiAFQv39/f39/f0D/Xw3A3ggA0H9AWokAAv9CAIBfw9+IwBB/QFrIgMkACADIAEpAwAiBCABKQMoIgV8NwMIIAMgASkDICIGIAFB/QBqKQMAIgd8NwMoIAMgASkDGCIIIAFB/QBqKQMAIgl8NwMgIAMgASkDECIKIAFBOGopAwAiC3w3AxggAyABKQMIIgwgAUEwaikDACINfDcDECADIAdC/f39/f39/T8gBn18IgZC/f39/f39/QP9IAlC/f39/f39/T8gCH18IgdCM/18NwNQIAMgB0L9/f39/f39A/0gC0L9/f39/f39PyAKfXwiB0Iz/Xw3A0ggAyAHQv39/f39/f0D/SANQv39/f39/f0/IAx9fCIHQjP9fDcDQCADIAdC/f39/f39/QP9IAVC/f39/f39/T8gBH18IgRCM/18NwM4IAMgBkIz/UITfiAEQv39/f39/f0D/Xw3AzAgA0H9AGogA0EIaiACQShqEBcgA0H9AWogA0EwaiACEBcgA0H9AWogAUH9AGogAkH9AGoQFyAAIAMpA3giBEL9/f39/f39P3wgAykD/QEiBX0iBkL9/f39/f39A/0gAykDcCIHQv39/f39/f0/fCADKQP9ASIIfSIJQjP9fDcDICAAIAlC/f39/f39/QP9IAMpA2giCUL9/f39/f39P3wgAykD/QEiCn0iC0Iz/Xw3AxggACALQv39/f39/f0D/SADKQNgIgtC/f39/f39/T98IAMpA/0BIgx9Ig1CM/18NwMQIAAgDUL9/f39/f39A/0gAykDWCINQv39/f39/f0/fCADKQP9ASIOfSIPQjP9fDcDCCAAIAZCM/1CE34gD0L9/f39/f39A/18NwMAIAFB/QBqKQMAIQYgAUH9AGopAwAhDyABQf0AaikDACEQIAFB/QBqKQMAIREgASkDUCESIABB/QBqIAUgBHw3AwAgAEH9AGogCCAHfDcDACAAQThqIAogCXw3AwAgAEEwaiAMIAt8NwMAIAAgDiANfDcDKCAAQf0BaiADKQP9ASIEIBFCAf0iBXw3AwAgAEH9AWogAykD/QEiByAQQgH9Igh8NwMAIABB/QFqIAMpA/0BIgkgD0IB/SIKfDcDACAAQf0BaiADKQP9ASILIAZCAf0iBnw3AwAgACADKQP9ASIMIBJCAf0iDXw3A3ggAEH9AGogBUL9/f39/f39P3wgBH0iBEL9/f39/f39A/0gCEL9/f39/f39P3wgB30iBUIz/Xw3AwAgAEH9AGogBUL9/f39/f39A/0gCkL9/f39/f39P3wgCX0iBUIz/Xw3AwAgAEH9AGogBUL9/f39/f39A/0gBkL9/f39/f39P3wgC30iBUIz/Xw3AwAgAEH9AGogBUL9/f39/f39A/0gDUL9/f39/f39P3wgDH0iBUIz/Xw3AwAgACAEQjP9QhN+IAVC/f39/f39/QP9fDcDUCADQf0BaiQAC/0HAgF/CH4jAEH9AGsiAiQAIAEQDiAAIAEpAxAiA0I4/SADQij9Qv39/f39/f39AP39IANCGP1C/f39/f39P/0gA0II/UL9/f39/R/9/f0gA0II/UL9/f39D/0gA0IY/UL9/f0H/f0gA0Io/UL9/QP9IANCOP39/f0iBDcAACAAQQhqIAFBGGopAwAiA0I4/SADQij9Qv39/f39/f39AP39IANCGP1C/f39/f39P/0gA0II/UL9/f39/R/9/f0gA0II/UL9/f39D/0gA0IY/UL9/f0H/f0gA0Io/UL9/QP9IANCOP39/f0iBTcAACAAQRBqIAFBIGopAwAiA0I4/SADQij9Qv39/f39/f39AP39IANCGP1C/f39/f39P/0gA0II/UL9/f39/R/9/f0gA0II/UL9/f39D/0gA0IY/UL9/f0H/f0gA0Io/UL9/QP9IANCOP39/f0iBjcAACAAQRhqIAFBKGopAwAiA0I4/SADQij9Qv39/f39/f39AP39IANCGP1C/f39/f39P/0gA0II/UL9/f39/R/9/f0gA0II/UL9/f39D/0gA0IY/UL9/f0H/f0gA0Io/UL9/QP9IANCOP39/f0iBzcAACAAQSBqIAFBMGopAwAiA0I4/SADQij9Qv39/f39/f39AP39IANCGP1C/f39/f39P/0gA0II/UL9/f39/R/9/f0gA0II/UL9/f39D/0gA0IY/UL9/f0H/f0gA0Io/UL9/QP9IANCOP39/f0iCDcAACAAQShqIAFBOGopAwAiA0I4/SADQij9Qv39/f39/f39AP39IANCGP1C/f39/f39P/0gA0II/UL9/f39/R/9/f0gA0II/UL9/f39D/0gA0IY/UL9/f0H/f0gA0Io/UL9/QP9IANCOP39/f0iCTcAACAAQTBqIAFB/QBqKQMAIgNCOP0gA0Io/UL9/f39/f39/QD9/SADQhj9Qv39/f39/T/9IANCCP1C/f39/f0f/f39IANCCP1C/f39/Q/9IANCGP1C/f39B/39IANCKP1C/f0D/SADQjj9/f39Igo3AAAgAEE4aiABQf0AaikDACIDQjj9IANCKP1C/f39/f39/f0A/f0gA0IY/UL9/f39/f0//SADQgj9Qv39/f39H/39/SADQgj9Qv39/f0P/SADQhj9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ACAFQgA3A/0CIAVB/QJqIAVB/QEQ/QEaIAVB/QJqIAVB/QJqECYgBUH9AmogBUH9AmoQ/QEgBUH9AmogBUH9AmogARD9ASAFQf0CaiAFQf0CaiAFQf0BahASIABBGGogBUH9AWpBGGopAwA3AAAgAEEQaiAFQf0BakEQaikDADcAACAAQQhqIAVB/QFqQQhqKQMANwAAIAAgBSkD/QE3AAAgACAFKQD9AjcAICAAQShqIAwpAAA3AAAgAEEwaiALKQAANwAAIABBOGogCikAADcAACAFQf0EaiQAC/0DARp+IAExABIhAiABMQARIQMgATEAECEEIAExAA8hBSABMQANIQYgATEADiEHIAExAB8hCCABMQAeIQkgATEAHSEKIAExABwhCyABMQAbIQwgATEAGiENIAExAAwhDiABMQALIQ8gATEACiEQIAExAAkhESABMQAHIRIgATEACCETIAExABkhFCABMQAYIRUgATEAFyEWIAExABYhFyABMQATIRggATEAFCEZIAExABUhGiAAIAExAAFCCP0gATEAAP0gATEAAkIQ/f0gATEAA0IY/f0gATEABEIg/f0gATEABUIo/f0gATEABiIbQjD9/UL9/f39/f39A/03AwAgACAYIBlCCP39IBpCEP39IBdCGP39IBZCIP39IBVCKP39IBRCMP39QgH9Qv39/f39/f0D/TcDGCAAIBsgEkII/f0gE0IQ/f0gEUIY/f0gEEIg/f0gD0Io/f0gDkIw/f1CA/1C/f39/f39/QP9NwMIIAAgFSAUQgj9/SANQhD9/SAMQhj9/SALQiD9/SAKQij9/SAJQjD9/SAIQjj9/UIM/UL9/f39/f39A/03AyAgACAOIAZCCP39IAdCEP39IAVCGP39IARCIP39IANCKP39IAJCMP39IBhCOP39Qgb9Qv39/f39/f0D/TcDEAv9AwEafiABMQAHIQIgATEADyEDIAExAA4hBCABMQANIQUgATEADCEGIAExAAshByABMQAIIQggATEACSEJIAExAAohCiABMQAXIQsgATEAFiEMIAExABUhDSABMQAUIQ4gATEAEyEPIAExABAhECABMQARIREgATEAEiESIAExAB8hEyABMQAeIRQgATEAHSEVIAExABwhFiABMQAbIRcgATEAGCEYIAExABkhGSABMQAaIRogACABMQAGQjD9IAExAAVCKP0gATEABEIg/SABMQADQhj9IAExAAJCEP0gATEAAUII/SABMQAA/f39/f39IhtC/f39/f39/Qf9NwMAIAAgE0I4/SAUQjD9IBVCKP0gFkIg/SAXQhj9IBpCEP0gGCAZQgj9/SIT/f39/f39QhD9NwMgIAAgE0Ik/SALQjj9IAxCMP0gDUIo/SAOQiD9IA9CGP0gEkIQ/SAQIBFCCP39/f0iC/39/f1CHP39NwMYIAAgC0IY/UL9/f39/f39B/0gA0I4/SAEQjD9IAVCKP0gBkIg/SAHQhj9IApCEP0gCCAJQgj9/f39/SID/f39Qij9/TcDECAAIANCDP1C/f39/f39/Qf9IAJCOP0gG/1CNP39NwMIC/0EAQV/IwBB/QVrIgMkAAJAAkACQAJAQQAoAv39REEDRw0AIAJBIEcNAQwCCyADQQE6AP0BIAMgA0H9AWo2Av0DQf39/QBBACADQf0DakEB/QAQPiACQSBGDQELIANB/QNqQv39/f39BDcDACADQUD9ADYC/QMgA0ECNgL9AyADQf0DahBQIQJBASEBDAELIANBMGpBAmogAUECai0AADoAACADIAEvAAA7ATAgAyABKQATNwP9AyADIAFBGGopAAA3AP0DIAEoAA8hBCABKAALIQUgASgAByEGIAEoAAMhAkEAIQELIANBLGpBAmoiByADQTBqQQJqLQAAOgAAIAMgAy8BMDsBLCADIAMpA/0DNwP9ASADIAMpAP0DNwD9AQJAAkAgAUUNACAAIAI2AgRBASEBDAELIANBIGoiASADKQD9ATcAACADIAMvASw7AQggAyAENgAXIAMgBTYAEyADIAY2AA8gAyACNgALIAMgAykD/QE3ABsgAyAHLQAAOgAKIANBMGogA0EIahA/IANB/QNqIANBMGpB/QEQ/QEaIANB/QVqIAEpAwA3AwAgA0H9BWogA0EYaikDADcDACADQf0FaiADQQhqQQhqKQMANwMAIAMgAykDCDcD/QUgA0H9AWogA0H9A2pB/QEQ/QEaIABBCGogA0H9AWpB/QEQ/QEaQQAhAQsgACABNgIAIANB/QVqJAAL/QQBBX4gACABKQMoNwMoIABBMGogAUEwaikDADcDACAAQThqIAFBOGopAwA3AwAgAEH9AGogAUH9AGopAwA3AwAgAEH9AGogAUH9AGopAwA3AwAgAEL9/f39/f39PyABKQMgfSICQv39/f39/f0D/UL9/f39/f39PyABKQMYfSIDQjP9fDcDICAAIANC/f39/f39/QP9Qv39/f39/f0/IAEpAxB9IgNCM/18NwMYIAAgA0L9/f39/f39A/1C/f39/f39/T8gASkDCH0iA0Iz/Xw3AxAgACADQv39/f39/f0D/UL9/f39/f39PyABKQMAfSIDQjP9fDcDCCAAIAJCM/1CE34gA0L9/f39/f39A/18NwMAIAFB/QFqKQMAIQIgAUH9AWopAwAhAyABQf0BaikDACEEIAFB/QFqKQMAIQUgASkDeCEGIABB/QBqIAFB/QBqKQMANwMAIABB/QBqIAFB/QBqKQMANwMAIABB/QBqIAFB/QBqKQMANwMAIABB/QBqIAFB/QBqKQMANwMAIAAgASkDUDcDUCAAQf0BakL9/f39/f39PyAEfSIEQv39/f39/f0D/UL9/f39/f39PyAFfSIFQjP9fDcDACAAQf0BaiAFQv39/f39/f0D/UL9/f39/f39PyADfSIDQjP9fDcDACAAQf0BaiADQv39/f39/f0D/UL9/f39/f39PyACfSICQjP9fDcDACAAQf0BaiACQv39/f39/f0D/UL9/f39/f39PyAGfSICQjP9fDcDACAAIARCM/1CE34gAkL9/f39/f39A/18NwN4C/0DAQR/IwBB/QBrIgEkACAAKAIAIgIoAgAhAyACQQFBAyAALQAEGzYCACABIANBA3EiADYCDAJAIABBAkcNAAJAAkACQAJAAkAgA0F8cSIARQ0AA0AgACgCBCECIAAoAgAhAyAAQQA2AgAgA0UNAiAAQQE6AAggASADNgIQIANBGGoiAygCACEAIANBAjYCAAJAIABFDQACQCAAQQFGDQAgAEECRg0BDAULIAEoAhAiAEEcaiIDKAIAIgQtAAANBSAEQQE6AAACQAJAQQAoAv39REEBRw0AQQAoAv39RCEEDAELQQAhBEEAQgE3A/39RAtBACAENgL9/UQgAEEgai0AAA0GIAMoAgBBADoAAAsgASgCECIAIAAoAgAiAEF/ajYCAAJAIABBAUcNACABQRBqEHYLIAIhACACDQALCyABQf0AaiQADwtB/f39ABD9AQALQf39/QBBHEH9/f0AEP0BAAtB/f39AEEgQf39/QAQ/QEACyAA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ajYCGCACQQhqQf39/QAQ/QEAC2QBAn8jAEEgayICJAAgAUEcaigCACEDIAEoAhghASACQQhqQRBqIABBEGopAgA3AwAgAkEIakEIaiAAQQhqKQIANwMAIAIgACkCADcDCCABIAMgAkEIahAbIQAgAkEgaiQAIAALZAECfyMAQSBrIgIkACAAQRxqKAIAIQMgACgCGCEAIAJBCGpBEGogAUEQaikCADcDACACQQhqQQhqIAFBCGopAgA3AwAgAiABKQIANwMIIAAgAyACQQhqEBshASACQSBqJAAgAQtpAQJ/IwBBEGsiAiQAIAAoAgAiACgCCCEDIAAoAgAhACACIAEQ/QECQCADRQ0AA0AgAiAANgIMIAIgAkEMakH9/f0AEP0BGiAAQQFqIQAgA0F/aiIDDQALCyACEP0BIQAgAkEQaiQAIAALYwEBfyMAQSBrIgIkACACIAAoAgA2AgQgAkEIakEQaiABQRBqKQIANwMAIAJBCGpBCGogAUEIaikCADcDACACIAEpAgA3AwggAkEEakH9/f0AIAJBCGoQGyEBIAJBIGokACABC2MBAX8jAEEgayICJAAgAiAAKAIANgIEIAJBCGpBEGogAUEQaikCADcDACACQQhqQQhqIAFBCGopAgA3AwAgAiABKQIANwMIIAJBBGpB/f39ACACQQhqEBshASACQSBqJAAgAQtxAQF/IwBBMGsiASQAIAFBLzYCBCABQfv9ADYCACABQSxqQf0ANgIAIAFBHGpBAjYCACABIAA2AiggAUE/NgIkIAFCAjcCDCABQf39/QA2AgggASABNgIgIAEgAUEgajYCGCABQQhqQf39ABD9AQALYwEBfyMAQSBrIgIkACACIAAoAgA2AgQgAkEIakEQaiABQRBqKQIANwMAIAJBCGpBCGogAUEIaikCADcDACACIAEpAgA3AwggAkEEakH9/f0AIAJBCGoQGyEBIAJBIGokACABC2MBAX8jAEEgayICJAAgAiAAKAIANgIEIAJBCGpBEGogAUEQaikCADcDACACQQhqQQhqIAFBCGopAgA3AwAgAiABKQIANwMIIAJBBGpB/f39ACACQQhqEBshASACQSBqJAAgAQtgAQF/IwBBIGsiAiQAIAIgADYCBCACQQhqQRBqIAFBEGopAgA3AwAgAkEIakEIaiABQQhqKQIANwMAIAIgASkCADcDCCACQQRqQf39/QAgAkEIahAbIQEgAkEgaiQAIAELbAECfyABKAIAIQIgAUEANgIAAkACQAJAIAJFDQAgASgCBCEDQQhBBBD9ASIBRQ0CIAEgAzYCBCABIAI2AgBBP/0AIQIMAQtBASEBQf39ACECCyAAIAI2AgQgACABNgIADwtBCEEEEP0BAAtpAgF/A34jAEEwayIBJAAgACkCCCECIAApAhAhAyAAKQIAIQQgAUEUakEANgIAIAEgBDcDGCABQf39/QA2AhAgAUIBNwIEIAEgAUEYajYCACABIAM3AyggASACNwMgIAEgAUEgahD9AQALagECfyABKAIAIQIgAUEANgIAAkACQCACRQ0AIAEoAgQhA0EIQQQQ/QEiAUUNASABIAM2AgQgASACNgIAIABB/f0ANgIEIAAgATYCAA8LIABB/f39ADYCBCAAQQE2AgAPC0EIQQQQ/QEAC2oBAn8gASgCACECIAFBADYCAAJAAkAgAkUNACABKAIEIQNBCEEEEP0BIgFFDQEgASADNgIEIAEgAjYCACAAQf39/QA2AgQgACABNgIADwsgAEEQ/QA2AgQgAEEBNgIADwtBCEEEEP0BAAtjAQF/IwBBMGsiAiQAIAJBIGogASgCACABKAIEIAEoAgggASgCDBD9ASACQRRqIAJBKGopAwA3AgAgAiAANgIIIAJB/f39ADYCBCACQf39/QA2AgAgAiACKQMgNwIMIAIQfAALYAEBfyMAQTBrIgIkACACIAE2AgwgAiAANgIIIAJBJGpBATYCACACQf0ANgIsIAJCATcCFCACQf39/QA2AhAgAiACQQhqNgIoIAIgAkEoajYCICACQRBqQf39/QAQ/QEAC1kBAX8jAEEQayICJAAgAiABQf39/QBBCBD9ASACIAA2AgwgAiACQQxqQf39/QAQRBogAiAAQQRqNgIMIAIgAkEMakH9/f0AEEQaIAIQayEAIAJBEGokACAAC1IBAX8jAEEgayICJAAgAkEUakEBNgIAIAJBPTYCHCACIAA2AhggAkIBNwIEIAJB/f39ADYCACACIAJBGGo2AhAgASACEP0BIQEgAkEgaiQAIAELVQEBfwJAAkACQCABQf39/QBGDQBBASEEIAAoAhggASAAQRxqKAIAKAIQEQYADQELIAJFDQEgACgCGCACIAMgAEEcaigCACgCDBEIACEECyAEDwtBAAtKACAAIAEpAAA3AAAgAEEXaiABQRdqKQAANwAAIABBEGogAUEQaikAADcAACAAQQhqIAFBCGopAAA3AAAgACABLQAfQf0AcToAHwtEAQF/IwBB/QFrIgMkACADQTBqIAEQNiADQf0AaiACEDYgA0EIaiADQTBqIANB/QBqEA0gACADQQhqEEIgA0H9AWokAAtEAQN/AkACQCACRQ0AQQAhAwNAIAAgA2otAAAiBCABIANqLQAAIgVHDQIgA0EBaiIDIAJJDQALQQAPC0EADwsgBCAFawtLAQN/IABCADcAACAAQRhqIgFCADcAACAAQRBqIgJCADcAACAAQQhqIgNCADcAACABQgA3AAAgAkIANwAAIANCADcAACAAQgA3AAALSwIBfwF+IwBBIGsiAiQAIAEpAgAhAyACQRRqIAEpAgg3AgAgAiADNwIMIAIgADYCCCACQf39/QA2AgQgAkH9/f0ANgIAIAIQ/QEACzwAIAAgASkAADcAACAAQRhqIAFBGGopAAA3AAAgAEEQaiABQRBqKQAANwAAIABBCGogAUEIaikAADcAAAswAAJAIABBfEsNAAJAIABFDQAgACAAQX1JQQJ0EP0BIgBFDQEgAA8LQQQPCxD9AQALNgEBfwJAIAJFDQAgACEDA0AgAyABLQAAOgAAIANBAWohAyABQQFqIQEgAkF/aiICDQALCyAACzQAIAAoAgAhAAJAIAEQ/QFFDQAgACABEGkPCwJAIAEQ/QFFDQAgACABEGoPCyAAIAEQ/QELOAEBfwJAQf39/QAgAyACEDIiBEUNACAEIAAgAyABIAEgA0sbEP0BGkH9/f0AIAAgASACEGQLIAQLNAAgACgCACEAAkAgARD9AUUNACAAIAEQaQ8LAkAgARD9AUUNACAAIAEQag8LIAAgARD9AQs0ACAAKAIAIQACQCABEP0BRQ0AIAAgARBnDwsCQCABEP0BRQ0AIAAgARBoDwsgACABEP0BCzQAIAAoAgAhAAJAIAEQ/QFFDQAgACABEGkPCwJAIAEQ/QFFDQAgACABEGoPCyAAIAEQ/QELOAEBfyAAIAAoAgQiAiABIAIbNgIEAkACQCACRQ0AIAIgAUcNAQsPC0E8/QBBNkH9/f0AEP0BAAs0ACAAIAEoAhggAiADIAFBHGooAgAoAgwRCAA6AAggACABNgIAIAAgA0U6AAkgAEEANgIECzUBAX8gACgCACIALQAAIQIgAEEAOgAAAkAgAkEBcUUNAEEBQf39/QAQcQ8LQf39/QAQ/QEACzUBAX8gACgCACIALQAAIQIgAEEAOgAAAkAgAkEBcUUNAEEBQf39/QAQcQ8LQf39/QAQ/QEACzABAX8gACgCACIAIAIQbSAAIAAoAggiAyACajYCCCADIAAoAgBqIAEgAhD9ARpBAAs1AQF/IAEoAhhB/f39AEEBIAFBHGooAgAoAgwRCAAhAiAAQQA6AAUgACACOgAEIAAgATYCAAssAQF/AkAgAkUNACAAIQMDQCADIAE6AAAgA0EBaiEDIAJBf2oiAg0ACwsgAAssAQF/IwBBEGsiAyQAIAMgATYCDCADIAA2AgggA0EIakEM/QBBACACEFQACywBAX8jAEEQayIDJAAgAyABNgIMIAMgADYCCCADQQhqQf39/QBBACACEFQACyYBAX8jAEEwayICJAAgAkEIaiABEBkgACACQQhqEEIgAkEwaiQACywBAX8jAEEQayIDJAAgAyABNgIMIAMgADYCCCADQQhqQT/9AEEAIAIQVAALLwACQCAALQAERQ0AQQEPCyAAKAIAIgAoAhhB/f39AEEBIABBHGooAgAoAgwRCAALJwAgAEIANwAAIABBGGpCADcAACAAQRBqQgA3AAAgAEEIakIANwAACygAAkAgAEUNACAAIAIgAyAEIAUgASgCDBEMAA8LQf39/QBBMBD9AQALIwACQCABQXxLDQAgACABQQQgAhD9ASIBRQ0AIAEPCxD9AQALJwEBfwJAIAAoAgQiAUUNACAAQQhqKAIAIgBFDQAgASAAQQEQ/QELCyUBAX8jAEEQayICJAAgAiABNgIMIAIgADYCCCACQQhqEP0CGgALJgACQCAARQ0AIAAgAiADIAQgASgCDBEWAA8LQf39/QBBMBD9AQALJgACQCAARQ0AIAAgAiADIAQgASgCDBEKAA8LQf39/QBBMBD9AQALJgACQCAARQ0AIAAgAiADIAQgASgCDBEJAA8LQf39/QBBMBD9AQALJgACQCAARQ0AIAAgAiADIAQgASgCDBEJAA8LQf39/QBBMBD9AQALJgACQCAARQ0AIAAgAiADIAQgASgCDBEKAA8LQf39/QBBMBD9AQALJgACQCAARQ0AIAAgAiADIAQgASgCDBEJAA8LQf39/QBBMBD9AQALJgACQCAARQ0AIAAgAiADIAQgASgCDBEXAA8LQf39/QBBMBD9AQALJAACQCAARQ0AIAAgAiADIAEoAgwRBwAPC0H9/f0AQTAQ/QEACyIAAkAgAEUNACAAIAIgASgCDBEGAA8LQf39/QBBMBD9AQALKgEBfyAAQf39AEH9/f0AIAEoAgAiAhs2AgQgACABQf39/QAgAhs2AgALKgEBfyAAQf39/QBBEP0AIAEoAgAiAhs2AgQgACABQRD9ACACGzYCAAsqAQF/IABBP/0AQf39ACABKAIAIgIbNgIEIAAgAUH9/f0AIAIbNgIACyYBAX8gACgCACIBKAIAIAEoAgQgACgCBCgCACAAKAIIKAIAEB0ACxwAIAAgASkCADcCACAAQQhqIAFBCGooAgA2AgALHgAgACAENgIMIAAgAzYCCCAAIAI2AgQgACABNgIACx0BAX8CQCAAKAIEIgFFDQAgACgCACABQQEQ/QELCxsBAX8gACABQQAoAv39RCICQf0AIAIbEQUAAAscACABKAIYQf39/QBBCyABQRxqKAIAKAIMEQgACxwAIAEoAhhB/f39AEEOIAFBHGooAgAoAgwRCAALHAAgASgCGEH9/f0AQQUgAUEcaigCACgCDBEIAAsWAAJAIABFDQAgAA8LQf39/QAQ/QEACxYAAkAgAEUNACAADwtB/f39ABD9AQALFAEBfyAAIAEgAiADEP0BIQQgBA8LEwACQCABRQ0AIAAgAUEEEP0BCwsVAQF/IwBBEGsiASAAOgAPIAEtAA8LFQAgASAAKAIAIgAoAgAgACgCBBAgCw8AIAAoAgAgASACEGFBAAsRACAAKAIAIAAoAgQgARD9AQsQAQF/IAAgARD9ASECIAIPCxEAIAAoAgAgACgCBCABEP0BCw8AIAAoAgAgASACEGNBAAsRACAAKAIAIAAoAgQgARD9AQsOACAAIAEgAiADIAQQUgsRACAAKAIAIAAoAgQgARD9AQsRACAAKAIAIAAoAgQgARD9AQsQACABIAAoAgAgACgCBBAgCw0AIAAtAABBEHFBBHYLDQAgAC0AAEEgcUEFdgsPAEH9/f0AIAAgASACEGQLDAAgACABIAIQ/QEPCwwAIAAgASACIAMQEQsSAEH9/f0AQR1B/f39ABD9AQALDQAgADUCAEEBIAEQRgsNACAAMQAAQQEgARBGCwwAIAAgASACEEUgAAsNACAAKAIAIAEgAhAwCw0AIAA1AgBBASABEEYLDQAgACkDAEEBIAEQRgsLACAAKAIAIAEQVgsMACAAKAIAIAEQ/QELDQBB/f39ACAAIAEQMgsLACAAKAIAIAEQPAsNAEH9/f0AQRsQ/QEACw4AQf39/QBB/QAQ/QEACwkAIAAgARAFAAsKACAAIAIgARATCw0AQf39/QBBGSABEBoLDAEBfyACIAIQ/QEACwoAIAAgARD9AQALDAAgACABKQIANwIACwsAIAAoAgAgARBVCwoAIAIgACABECALCAAgACABEAELBwAgABAGAAsHACAAEHwACwsAQf39/QAQ/QEACwcAIABBDGoLBgAgARAqCwYAIAEQKgsGACABECoLBgAQ/QEACwYAEP0CAAsHACAAKAIICwcAIAAoAggLBwAgACgCDAsEACABCwQAQQALBQBB/QQLBABBAQsNAEL9/cH9/f39AAsMAEL9hf39/f0RCw0AQv39wf39/f0ACwwAQv2F/f39/RELBAAgAAsEACAACwwAQv2F/f39/RELDQBC/f39Sv39/f0ACw0AQv39wf39/f0ACwwAQv39kP39/f0uCwMAAAsDAAALDABC/f2Q/f39/S4LAgALAgALAgALAgALAgALAgALAgALAgALAgALAgALAgALAgALAgALAgALAgALAgALAgALAgALC/39/f0AAwBB/f39AAv9/QRUcmllZCB0byBzaHJpbmsgdG8gYSBsYXJnZXIgY2FwYWNpdHlzcmMvbGliYWxsb2MvcmF3X3ZlYy5ycwAAABAAJAAAACQAEAAXAAAAQAIAAAkAAABQdWJsaWNLZXlTZWNyZXRLZXlTaWduYXR1cmUAbwAQAAAAAABhIERpc3BsYXkgaW1wbGVtZW50YXRpb24gcmV0dXJuZWQgYW4gZXJyb3IgdW5leHBlY3RlZGx5AAMAAAAAAAAAAQAAAAQAAAAFAAAABgAAAAcAAAAEAAAABAAAAAgAAAAJAAAAY2FsbGVkIGBPcHRpb246OnVud3JhcCgpYCBvbiBhIGBOb25lYCB2YWx1ZXNyYy9saWJjb3JlL29wdGlvbi5yc/0AEAArAAAABwEQABUAAAB2AQAAFQAAAAoAAAAEAAAABAAAAAsAAAAMAAAADQAAAGhvbG8gY2hhcGVyb25lIHdlYiB1c2VyIGVkMjU1MTkga2V5IHYxc3JjL2xpYmNvcmUvc2xpY2UvbW9kLnJzYXNzZXJ0aW9uIGZhaWxlZDogYChsZWZ0ID09IHJpZ2h0KWAKICBsZWZ0OiBgYCwKIHJpZ2h0OiBgYDogAAD9ARAALQAAAP0BEAAMAAAA/QEQAAMAAABkZXN0aW5hdGlvbiBhbmQgc291cmNlIHNsaWNlcyBoYXZlIGRpZmZlcmVudCBsZW5ndGhz/QEQADQAAAByARAAGAAAAD4IAAAJAAAAOiAAACwCEAAAAAAALAIQAAIAAABzcmMvbGliY29yZS9yZXN1bHQucnMAAABAAhAAFQAAABsEAAAFAAAAEgAAAAAAAAABAAAAEwAAABQAAAAVAAAAFgAAAAAAAAABAAAAEwAAABQAAAAVAAAAFwAAAAQAAAAEAAAAGAAAABkAAAAaAAAAY2xvc3VyZSBpbnZva2VkIHJlY3Vyc2l2ZWx5IG9yIGRlc3Ryb3llZCBhbHJlYWR5VHJpZWQgdG8gc2hyaW5rIHRvIGEgbGFyZ2VyIGNhcGFjaXR5c3JjL2xpYmFsbG9jL3Jhd192ZWMucnMA/QIQACQAAAAEAxAAFwAAAEACAAAJAAAAAAAAAAAAAAAAAAAAYXR0ZW1wdCB0byBjYWxjdWxhdGUgdGhlIHJlbWFpbmRlciB3aXRoIGEgZGl2aXNvciBvZiB6ZXJvTWVtb3J5IHBhcmFtZXRlciBtdXN0IGJlID49ICBLaUIuAAB5AxAAHAAAAP0DEAAFAAAA/QMQAAAAAABTcGVjaWZpZWQgc2l6ZSBvZiBibG9jayBtYXRyaXggd2FzIHRvbyBzbWFsbC5UaGUgbnVtYmVyIG9mIGxhbmVzIG11c3QgYmUgYmV0d2VlbiBvbmUgYW5kIDJeMjQgLSAxLkFyZ29uMiByZXF1aXJlcyBvbmUgb3IgbW9yZSBwYXNzZXMgdG8gYmUgcnVuLgAAAAAAAAAAAAAAAAAvaG9tZS96by1lbC8uY2FyZ28vZ2l0L2NoZWNrb3V0cy9hcmdvbjJtaW4tMDg5NTY4YWEzMzYyY2IwMi82NTYyNzMwL3NyYy9hcmdvbjIucnMAAAAAAAAAAAAAAAAAAABhdHRlbXB0IHRvIGRpdmlkZSBieSB6ZXJvAAAA/QQQABkAAABQBBAAUQAAAP0AAAAaAAAAL2hvbWUvem8tZWwvLmNhcmdvL2dpdC9jaGVja291dHMvYXJnb24ybWluLTA4OTU2OGFhMzM2MmNiMDIvNjU2MjczMC9zcmMvYXJnb24yLnJzAAAA/QQQAFEAAAD9AAAACQAAAGFzc2VydGlvbiBmYWlsZWQ6IDQgPD0gb3V0LmxlbigpICYmIG91dC5sZW4oKSA8PSAweGZmZmZmZmZmAP0EEABRAAAA/QAAAAkAAABhc3NlcnRpb24gZmFpbGVkOiA4IDw9IHMubGVuKCkgJiYgcy5sZW4oKSA8PSAweGZmZmZmZmZmAP0EEABRAAAA/QAAAAkAAABhc3NlcnRpb24gZmFpbGVkOiBrLmxlbigpIDw9IDMyAEADEAA5AAAAUAQQAFEAAAD9AQAAJgAAAEADEAA5AAAAUAQQAFEAAAD9AQAADgAAAEADEAA5AAAAUAQQAFEAAAD9AQAAHAAAAFAEEABRAAAABQIAABwAAAAoAAAACAAAAAQAAAApAAAAKgAAACgAAAAIAAAABAAAACsAAAAsAAAAAAAAAAEAAAAtAAAAc3JjL2xpYmNvcmUvc2xpY2UvbW9kLnJzZGVzdGluYXRpb24gYW5kIHNvdXJjZSBzbGljZXMgaGF2ZSBkaWZmZXJlbnQgbGVuZ3Roc/0GEAA0AAAA/QYQABgAAAD9BwAACQAAAC9ob21lL3pvLWVsLy5jYXJnby9naXQvY2hlY2tvdXRzL2FyZ29uMm1pbi0wODk1NjhhYTMzNjJjYjAyLzY1NjI3MzAvc3JjL2Jsb2NrLnJz/QYQAFAAAAD9AAAACQAAAGFzc2VydGlvbiBmYWlsZWQ6IHdyICE9IHJkMCAmJiB3ciAhPSByZDEvaG9tZS96by1lbC8uY2FyZ28vcmVnaXN0cnkvc3JjL2dpdGh1Yi5jb20tMWVjYzYyOTlkYjllYzgyMy9ibGFrZTItcmZjLTAuMi4xOC9zcmMvYmxha2UyYi5yc3QHEABcAAAAJQAAAAEAAABhc3NlcnRpb24gZmFpbGVkOiBubiA+PSAxICYmIG5uIDw9IDY0ICYmIGtrIDw9IDY0aGFzaCBkYXRhIGxlbmd0aCBvdmVyZmxvdwAALgAAAAgAAAAEAAAALwAAADAAAAAuAAAACAAAAAQA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/RsRAAAAAAA4HBEAAgAAAHNyYy9saWJjb3JlL3Jlc3VsdC5ycwAAAEwcEQAVAAAAGwQAAAUAAABjYWxsZWQgYFJlc3VsdDo6dW53cmFwKClgIG9uIGFuIGBFcnJgIHZhbHVlc3JjL2xpYmFsbG9jL3Jhd192ZWMucnNUcmllZCB0byBzaHJpbmsgdG8gYSBsYXJnZXIgY2FwYWNpdHkAAP0cEQAkAAAA/RwRABcAAABAAgAACQAAAEUAAAAEAAAABAAAAEMAAABzcmMvbGlic3RkL3RocmVhZC9tb2QucnMEHREAGAAAAP0DAAATAAAAaW5jb25zaXN0ZW50IHBhcmsgc3RhdGUAAgAAAHBhcmsgc3RhdGUgY2hhbmdlZCB1bmV4cGVjdGVkbHkASB0RAB8AAAAEHREAGAAAAP0DAAANAAAABB0RABgAAAAiBAAAEQAAAGZhaWxlZCB0byBnZW5lcmF0ZSB1bmlxdWUgdGhyZWFkIElEOiBiaXRzcGFjZSBleGhhdXN0ZWR0aHJlYWQgbmFtZSBtYXkgbm90IGNvbnRhaW4gaW50ZXJpb3IgbnVsbCBieXRlcwAABB0RABgAAAD9BAAAEgAAAGluY29uc2lzdGVudCBzdGF0ZSBpbiB1bnBhcmtzcmMvbGlic3RkL3N5bmMvY29uZHZhci5ycwAAJB4RABoAAABIAgAAEgAAAGF0dGVtcHRlZCB0byB1c2UgYSBjb25kaXRpb24gdmFyaWFibGUgd2l0aCB0d28gbXV0ZXhlc3NyYy9saWJzdGQvc3luYy9vbmNlLnJzAAAA/R4RABcAAAD9AQAAFQAAAGFzc2VydGlvbiBmYWlsZWQ6IHN0YXRlICYgU1RBVEVfTUFTSyA9PSBSVU5OSU5HAP0eEQAXAAAAbwEAABUAAABPbmNlIGluc3RhbmNlIGhhcyBwcmV2aW91c2x5IGJlZW4gcG9pc29uZWQAAP0eEQAXAAAA/QEAAAkAAABQb2lzb25FcnJvciB7IGlubmVyOiAuLiB9c3JjL2xpYnN0ZC9wYW5pY2tpbmcucnNFHxEAFwAAAGAAAAAJAAAAY2Fubm90IG1vZGlmeSB0aGUgcGFuaWMgaG9vayBmcm9tIGEgcGFuaWNraW5nIHRocmVhZEwAAAAQAAAABAAAAE0AAABOAAAATwAAAAwAAAAEAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAP39/f39/f0AAAAAAAAAAAD9BwAAAAAA/f39AAABAAAAAAAAAAAAAAD9/f09AAAAAAIAAAD9/f0HAAAAAAAAAAAAAP39AQAAAAAAAP0PIP0qEQBKAAAACC0RAAACAAAILxEANwAAAAABAgMEBQYHCAkICgsMDQ4PEBESExQCFRYXGBkaGxwdHh8gAgICAgICAgICAiECAgICAgICAgICAgICAiIjJCUmAicCKAICAikqKwIsLS4vMAICMQICAjICAgICAgICAjMCAjQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjUCNgI3AgICAgICAgI4AjkCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjo7PAICAgI9AgI+P0BBQkNERUYCAgJHAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkgCAgICAgICAgICAkkCAgICAjsCAAECAgICAwICAgIEAgUGAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkVycm9yAEH9/f0AC/0IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQf39/QALCAEAAAAAAAAAAP39/f0ABG5hbWUB/f39/QD9AgAaX193YmluZGdlbl9vYmplY3RfZHJvcF9yZWYBGl9fd2JnX25ld19iNTIzZDgzZTkzMmFlNmVlAhpfX3diZ19uZXdfNTljYjc0ZTQyMzc1OGVkZQMcX193Ymdfc3RhY2tfNTU4YmE1OTE3YjQ2NmVkZAQcX193YmdfZXJyb3JfNGJiNmMyYTk3NDA3MTI5YQUQX193YmluZGdlbl90aHJvdwYSX193YmluZGdlbl9yZXRocm93B3pjdXJ2ZTI1NTE5X2RhbGVrOjpmaWVsZDo6PGltcGwgY3VydmUyNTUxOV9kYWxlazo6YmFja2VuZDo6c2VyaWFsOjp1NjQ6OmZpZWxkOjpGaWVsZEVsZW1lbnQ1MT46OnBvdzIyNTAxOjpoZWQ0YmE1Y2JlZjU3YzdmNgh+Y3VydmUyNTUxOV9kYWxlazo6ZmllbGQ6OjxpbXBsIGN1cnZlMjU1MTlfZGFsZWs6OmJhY2tlbmQ6OnNlcmlhbDo6dTY0OjpmaWVsZDo6RmllbGRFbGVtZW50NTE+OjpzcXJ0X3JhdGlvX2k6OmhhNDUwYTEwYmI4YTM5YWY2CT5zaGEyOjpzaGE1MTJfdXRpbHM6OnNoYTUxMl9kaWdlc3RfYmxvY2tfdTY0OjpoODk5OTA1N2M3Y2U1NzA0ZAo4YXJnb24ybWluOjphcmdvbjI6OkFyZ29uMjo6ZmlsbF9zbGljZTo6aDIyM2VkMmIwNTZkMDY3ZDALOWJsYWtlMl9yZmM6OmJsYWtlMmI6OkJsYWtlMmI6OmNvbXByZXNzOjpoMGM5MDFjOGY3YzM3NTBhYQwrYXJnb24ybWluOjphcmdvbjI6OmdfdHdvOjpoNzc0MDFiZTEzNjAwM2QwOA1QY3VydmUyNTUxOV9kYWxlazo6YmFja2VuZDo6c2VyaWFsOjp1NjQ6OnNjYWxhcjo6U2NhbGFyNTI6Om11bDo6aDRmN2I4NDQ3OTYwYTEyOTgOMnNoYTI6OnNoYTUxMjo6RW5naW5lNTEyOjpmaW5pc2g6Omg5ODgyNWY5ODgwYjdlZmZmD/0BPGN1cnZlMjU1MTlfZGFsZWs6OndpbmRvdzo6TmFmTG9va3VwVGFibGU1PGN1cnZlMjU1MTlfZGFsZWs6OmJhY2tlbmQ6OnNlcmlhbDo6Y3VydmVfbW9kZWxzOjpQcm9qZWN0aXZlTmllbHNQb2ludD4gYXMgY29yZTo6Y29udmVydDo6RnJvbTwmY3VydmUyNTUxOV9kYWxlazo6ZWR3YXJkczo6RWR3YXJkc1BvaW50Pj46OmZyb206Omg5MTMzMGZiY2U0OTc3YWNmEDFzaGEyOjpzaGE1MTI6OkVuZ2luZTUxMjo6aW5wdXQ6OmhjNzBmY2FkNTJkY2VlMDVkEVpjdXJ2ZTI1NTE5X2RhbGVrOjpiYWNrZW5kOjpzZXJpYWw6OnNjYWxhcl9tdWw6OnZhcnRpbWVfZG91YmxlX2Jhc2U6Om11bDo6aGJkZGVlN2NlYzJiMjIwNjYSdzwmY3VydmUyNTUxOV9kYWxlazo6c2NhbGFyOjpTY2FsYXIgYXMgY29yZTo6b3BzOjphcml0aDo6QWRkPCZjdXJ2ZTI1NTE5X2RhbGVrOjpzY2FsYXI6OlNjYWxhcj4+OjphZGQ6Omg0YWJmZmVlYjgyYzA2MGI4E/0BPCZjdXJ2ZTI1NTE5X2RhbGVrOjplZHdhcmRzOjpFZHdhcmRzQmFzZXBvaW50VGFibGUgYXMgY29yZTo6b3BzOjphcml0aDo6TXVsPCZjdXJ2ZTI1NTE5X2RhbGVrOjpzY2FsYXI6OlNjYWxhcj4+OjptdWw6OmhlZDJkMGZiMDU3ZDU0MzUyFFtjdXJ2ZTI1NTE5X2RhbGVrOjpiYWNrZW5kOjpzZXJpYWw6OnU2NDo6c2NhbGFyOjpTY2FsYXI1Mjo6bW9udGdvbWVyeV9tdWw6OmhjOTgzOTU4MTFkOGRhNzk3FTJhcmdvbjJtaW46OmFyZ29uMjo6QXJnb24yOjpoYXNoOjpoMjk5Mzc3MjBiYzQwZWZmMRZ4Y3VydmUyNTUxOV9kYWxlazo6ZmllbGQ6OjxpbXBsIGN1cnZlMjU1MTlfZGFsZWs6OmJhY2tlbmQ6OnNlcmlhbDo6dTY0OjpmaWVsZDo6RmllbGRFbGVtZW50NTE+OjppbnZlcnQ6Omg0OTAwZjkyZjllZGQ5NjcyF/0BPCZjdXJ2ZTI1NTE5X2RhbGVrOjpiYWNrZW5kOjpzZXJpYWw6OnU2NDo6ZmllbGQ6OkZpZWxkRWxlbWVudDUxIGFzIGNvcmU6Om9wczo6YXJpdGg6Ok11bDwmY3VydmUyNTUxOV9kYWxlazo6YmFja2VuZDo6c2VyaWFsOjp1NjQ6OmZpZWxkOjpGaWVsZEVsZW1lbnQ1MT4+OjptdWw6OmhiNTExN2E0YWUwMDhiNmVkGFR3YXNtX2tleV9tYW5hZ2VyOjprZXlfbWFuYWdlcjo6S2V5TWFuYWdlcjo6dmVyaWZ5X3dpdGhfcHVibGljX2tleTo6aGRhYTc2ZDAxZmQ5NTI2NTUZXGN1cnZlMjU1MTlfZGFsZWs6OmJhY2tlbmQ6OnNlcmlhbDo6dTY0OjpzY2FsYXI6OlNjYWxhcjUyOjpmcm9tX2J5dGVzX3dpZGU6OmgyNmZmYjVlNzcyMDA1NWQyGjE8c3RyIGFzIGNvcmU6OmZtdDo6RGVidWc+OjpmbXQ6Omg0MmRkM2I3YjdiOGI5MDJhGyNjb3JlOjpmbXQ6OndyaXRlOjpoOGNhMzg3OGQ4OWE1NTE3OBwtYXJnb24ybWluOjphcmdvbjI6OmhfcHJpbWU6OmgxZGE5MmFmMzljNTQyZTViHS5jb3JlOjpzdHI6OnNsaWNlX2Vycm9yX2ZhaWw6Omg1YjlhYTBiNGQ5NGU5YmNkHkxjdXJ2ZTI1NTE5X2RhbGVrOjplZHdhcmRzOjpDb21wcmVzc2VkRWR3YXJkc1k6OmRlY29tcHJlc3M6OmhjNGI5NzRiNmNmMjhmZDY0H1djdXJ2ZTI1NTE5X2RhbGVrOjpiYWNrZW5kOjpzZXJpYWw6OnU2NDo6ZmllbGQ6OkZpZWxkRWxlbWVudDUxOjpwb3cyazo6aGJlMmFmYzIwNWVmMDg3OWIgLGNvcmU6OmZtdDo6Rm9ybWF0dGVyOjpwYWQ6OmhiY2JkMDk4Mzk3ZWUwYjlmIUR3YXNtX2tleV9tYW5hZ2VyOjprZXlfbWFuYWdlcjo6S2V5TWFuYWdlcjo6dmVyaWZ5OjpoMjY5Yjg2NDNjMmM2NGJjYSL9AWN1cnZlMjU1MTlfZGFsZWs6OmJhY2tlbmQ6OnNlcmlhbDo6Y3VydmVfbW9kZWxzOjo8aW1wbCBjb3JlOjpvcHM6OmFyaXRoOjpBZGQ8JmN1cnZlMjU1MTlfZGFsZWs6OmJhY2tlbmQ6OnNlcmlhbDo6Y3VydmVfbW9kZWxzOjpQcm9qZWN0aXZlTmllbHNQb2ludD4gZm9yICZjdXJ2ZTI1NTE5X2RhbGVrOjplZHdhcmRzOjpFZHdhcmRzUG9pbnQ+OjphZGQ6OmgxYzg2ZjhjYTAwYjJmMzY4I/0BY3VydmUyNTUxOV9kYWxlazo6YmFja2VuZDo6c2VyaWFsOjpjdXJ2ZV9tb2RlbHM6OjxpbXBsIGNvcmU6Om9wczo6YXJpdGg6OlN1YjwmY3VydmUyNTUxOV9kYWxlazo6YmFja2VuZDo6c2VyaWFsOjpjdXJ2ZV9tb2RlbHM6OlByb2plY3RpdmVOaWVsc1BvaW50PiBmb3IgJmN1cnZlMjU1MTlfZGFsZWs6OmVkd2FyZHM6OkVkd2FyZHNQb2ludD46OnN1Yjo6aDZlMDMyNDIwZmU0MWY4Yjkk/QFjdXJ2ZTI1NTE5X2RhbGVrOjpiYWNrZW5kOjpzZXJpYWw6OmN1cnZlX21vZGVsczo6PGltcGwgY29yZTo6b3BzOjphcml0aDo6QWRkPCZjdXJ2ZTI1NTE5X2RhbGVrOjpiYWNrZW5kOjpzZXJpYWw6OmN1cnZlX21vZGVsczo6QWZmaW5lTmllbHNQb2ludD4gZm9yICZjdXJ2ZTI1NTE5X2RhbGVrOjplZHdhcmRzOjpFZHdhcmRzUG9pbnQ+OjphZGQ6Omg4NzVkNTljMGI4NjRmM2JhJf0BY3VydmUyNTUxOV9kYWxlazo6YmFja2VuZDo6c2VyaWFsOjpjdXJ2ZV9tb2RlbHM6OjxpbXBsIGNvcmU6Om9wczo6YXJpdGg6OlN1YjwmY3VydmUyNTUxOV9kYWxlazo6YmFja2VuZDo6c2VyaWFsOjpjdXJ2ZV9tb2RlbHM6OkFmZmluZU5pZWxzUG9pbnQ+IGZvciAmY3VydmUyNTUxOV9kYWxlazo6ZWR3YXJkczo6RWR3YXJkc1BvaW50Pjo6c3ViOjpoZjI4ZTEyY2I3ZDIzNzZiZiZOPHNoYTI6OnNoYTUxMjo6U2hhNTEyIGFzIGRpZ2VzdDo6Rml4ZWRPdXRwdXQ+OjpmaXhlZF9yZXN1bHQ6Omg0YTgwOWJiYjVjZDM4NzQ2J0NjdXJ2ZTI1NTE5X2RhbGVrOjp3aW5kb3c6Okxvb2t1cFRhYmxlPFQ+OjpzZWxlY3Q6OmhlNDdkZjdjMTY1ZGRjZGNhKFtjdXJ2ZTI1NTE5X2RhbGVrOjpiYWNrZW5kOjpzZXJpYWw6OmN1cnZlX21vZGVsczo6UHJvamVjdGl2ZVBvaW50Ojpkb3VibGU6OmhiZjcxNzE5MDc3NWZjZmYyKTVjb3JlOjpmbXQ6OkZvcm1hdHRlcjo6cGFkX2ludGVncmFsOjpoYTM4YmVjNTVmMWQyMzIxNyoxY29uc29sZV9lcnJvcl9wYW5pY19ob29rOjpob29rOjpoMzY0ODhjN2ZkYzMwODFiNysuY29yZTo6c2xpY2U6Om1lbWNocjo6bWVtY2hyOjpoZmIzNWU3MDQ4YzdjZmFhZCwPa2V5bWFuYWdlcl9zaWduLTI8Y2hhciBhcyBjb3JlOjpmbXQ6OkRlYnVnPjo6Zm10OjpoMDNhMmVjM2JiYjZhOGJkMi4td2VlX2FsbG9jOjphbGxvY19maXJzdF9maXQ6Omg0YzlhMTYzMzljNDk5ZmVkLzhlZDI1NTE5X2RhbGVrOjplZDI1NTE5OjpLZXlwYWlyOjpzaWduOjpoYTM4YTk2Njk2MTVlNWZjNDBTPGNvcmU6OmZtdDo6YnVpbGRlcnM6OlBhZEFkYXB0ZXIgYXMgY29yZTo6Zm10OjpXcml0ZT46OndyaXRlX3N0cjo6aDkxNjIxODBhYTk5N2M3NmUxWmN1cnZlMjU1MTlfZGFsZWs6OmJhY2tlbmQ6OnNlcmlhbDo6dTY0OjpmaWVsZDo6RmllbGRFbGVtZW50NTE6OnRvX2J5dGVzOjpoNWQzZjNkNWE0MGE1NTIyYjJLPHdlZV9hbGxvYzo6V2VlQWxsb2MgYXMgY29yZTo6YWxsb2M6Okdsb2JhbEFsbG9jPjo6YWxsb2M6Omg0ZDBmMzlkMTI2ODMwYjAxMyRzdGQ6OnRocmVhZDo6cGFyazo6aDJhYjUxZTVjNDNhMjY5MWM0QWVkMjU1MTlfZGFsZWs6OnNlY3JldDo6RXhwYW5kZWRTZWNyZXRLZXk6OnNpZ246OmgzNmFhNjU1MGNiZDRkYTdjNVxjdXJ2ZTI1NTE5X2RhbGVrOjpiYWNrZW5kOjpzZXJpYWw6OnU2NDo6ZmllbGQ6OkZpZWxkRWxlbWVudDUxOjpmcm9tX2J5dGVzOjpoMWI5YTYzNmRmM2E1Yjg3YjZXY3VydmUyNTUxOV9kYWxlazo6YmFja2VuZDo6c2VyaWFsOjp1NjQ6OnNjYWxhcjo6U2NhbGFyNTI6OmZyb21fYnl0ZXM6OmgzMTU3ZDc4ODMxY2M2YTM3N0F3YXNtX2tleV9tYW5hZ2VyOjprZXlfbWFuYWdlcjo6S2V5TWFuYWdlcjo6bmV3OjpoNzliMGJkN2ZmZjNjMGMwMzhaPGN1cnZlMjU1MTlfZGFsZWs6OmVkd2FyZHM6OkVkd2FyZHNQb2ludCBhcyBjb3JlOjpvcHM6OmFyaXRoOjpOZWc+OjpuZWc6Omg4NmE3NzFlZDk5MmZiODE2OUs8c3RkOjpzeW5jOjpvbmNlOjpGaW5pc2ggYXMgY29yZTo6b3BzOjpkcm9wOjpEcm9wPjo6ZHJvcDo6aDI5NGRmMWZmNzJjNDllMjY6OzwmbXV0IFcgYXMgY29yZTo6Zm10OjpXcml0ZT46OndyaXRlX2NoYXI6Omg2YjFjMGJkMzI5MDA4ZTllOzs8Jm11dCBXIGFzIGNvcmU6OmZtdDo6V3JpdGU+Ojp3cml0ZV9jaGFyOjpoNDZiMTA5NzU5ODA1Y2I3YzxGPGNvcmU6OnBhbmljOjpQYW5pY0luZm8gYXMgY29yZTo6Zm10OjpEaXNwbGF5Pjo6Zm10OjpoODgwMzdhNjc4NjYzMzliZj1Ad2FzbV9rZXlfbWFuYWdlcjo6c2VlZF9mcm9tOjpkZXJpdmVfc2VlZF9mcm9tOjpoYzVjZmExYzdiZjg0ZjM3YT40c3RkOjpzeW5jOjpvbmNlOjpPbmNlOjpjYWxsX2lubmVyOjpoYzRlOTIwZDZkMjllZmE1Yz91PGVkMjU1MTlfZGFsZWs6OnB1YmxpYzo6UHVibGljS2V5IGFzIGNvcmU6OmNvbnZlcnQ6OkZyb208JmVkMjU1MTlfZGFsZWs6OnNlY3JldDo6U2VjcmV0S2V5Pj46OmZyb206OmhhZmEzMjQ4M2MwN2Q4N2VkQCtzdGQ6OnRocmVhZDo6VGhyZWFkOjpuZXc6Omg0Zjc3NDc4YWU2ODAzODg2QTJjb3JlOjp1bmljb2RlOjpwcmludGFibGU6OmNoZWNrOjpoYTM5YmM0OWJmOTMwNTQ0MUJyY3VydmUyNTUxOV9kYWxlazo6c2NhbGFyOjo8aW1wbCBjdXJ2ZTI1NTE5X2RhbGVrOjpiYWNrZW5kOjpzZXJpYWw6OnU2NDo6c2NhbGFyOjpTY2FsYXI1Mj46OnBhY2s6OmhkZTZkMzFhNTZkMTljMTUwQzs8Jm11dCBXIGFzIGNvcmU6OmZtdDo6V3JpdGU+Ojp3cml0ZV9jaGFyOjpoZDY1ZTk5MDA1MWFjMjBlYkQ5Y29yZTo6Zm10OjpidWlsZGVyczo6RGVidWdUdXBsZTo6ZmllbGQ6Omg0NTZjODQ5ZjMzNGE5MDc4RTljb3JlOjpmbXQ6OmJ1aWxkZXJzOjpEZWJ1Z0lubmVyOjplbnRyeTo6aGMyNzM5MGI3ODI1ZGMxNmZGL2NvcmU6OmZtdDo6bnVtOjppbXA6OmZtdF91NjQ6Omg3NTUyMjEyZGY0YmRkNzg5R1Q8ZWQyNTUxOV9kYWxlazo6ZXJyb3JzOjpJbnRlcm5hbEVycm9yIGFzIGNvcmU6OmZtdDo6RGlzcGxheT46OmZtdDo6aGE5MDBiM2QxNDIxNjk3YWZIOWJsYWtlMl9yZmM6OmJsYWtlMmI6OkJsYWtlMmI6OmZpbmFsaXplOjpoYjE1NzE3MmZmYWIxNDIwYkkUa2V5bWFuYWdlcl9wdWJsaWNLZXlKSWNvcmU6OmZtdDo6bnVtOjo8aW1wbCBjb3JlOjpmbXQ6OkRlYnVnIGZvciB1c2l6ZT46OmZtdDo6aDE2NmE1NDYwOTM4NTk5NzZLOHdhc21fa2V5X21hbmFnZXI6OnV0aWw6OmludG9fanNfZXJyb3I6Omg5MTQ3OWVjYmEwZTVhZjJhTEF3ZWVfYWxsb2M6OldlZUFsbG9jOjpkZWFsbG9jX2ltcGw6Ont7Y2xvc3VyZX19OjpoN2RlOWNkYzE1OTA4NTNlNk0yYWxsb2M6OnZlYzo6VmVjPFQ+OjpleHRlbmRfd2l0aDo6aGViMGJiMzlhMWVmODExNGFON2JsYWtlMl9yZmM6OmJsYWtlMmI6OkJsYWtlMmI6OnVwZGF0ZTo6aDkyMzI1MjU2ZWYzMjc4ZTFPaDxzdGQ6OnBhbmlja2luZzo6Y29udGludWVfcGFuaWNfZm10OjpQYW5pY1BheWxvYWQgYXMgY29yZTo6cGFuaWM6OkJveE1lVXA+Ojpib3hfbWVfdXA6OmhiNDIwYjRmNTJlYmZiNDJjUDh3YXNtX2tleV9tYW5hZ2VyOjp1dGlsOjppbnRvX2pzX2Vycm9yOjpoYzE0YTMxOWU4YzkzM2YxYVE9Y29yZTo6dW5pY29kZTo6Ym9vbF90cmllOjpCb29sVHJpZTo6bG9va3VwOjpoMDIzMGZmYWU1MDZhYWRmZFI7ZWQyNTUxOV9kYWxlazo6cHVibGljOjpQdWJsaWNLZXk6OnZlcmlmeTo6aDlkZGVmYWMzOThmZDY3NzVTP3N0ZDo6ZmZpOjpjX3N0cjo6Q1N0cmluZzo6ZnJvbV92ZWNfdW5jaGVja2VkOjpoZjQzZjc5OWEyOWIyZTg3ZlQ3c3RkOjpwYW5pY2tpbmc6OnJ1c3RfcGFuaWNfd2l0aF9ob29rOjpoYjc3MjYzZTc3NDhjN2MwNlUvY29yZTo6Zm10OjpXcml0ZTo6d3JpdGVfY2hhcjo6aDRkZTgzMmY5YmRmMmE3OGRWSzxhcmdvbjJtaW46OmFyZ29uMjo6UGFyYW1FcnIgYXMgY29yZTo6Zm10OjpEaXNwbGF5Pjo6Zm10OjpoNGM4NTU3MmNmYmUzNzEzMlcOZGVyaXZlU2VlZEZyb21YTnN0ZDo6c3lzX2NvbW1vbjo6dGhyZWFkX2luZm86OlRocmVhZEluZm86OndpdGg6Ont7Y2xvc3VyZX19OjpoMDc4ZTMxMjgzNzVkOTFmM1kxYXJnb24ybWluOjphcmdvbjI6OkFyZ29uMjo6bmV3OjpoZDc2MjVlN2U0OTNmNjkyNlp0PHdlZV9hbGxvYzo6c2l6ZV9jbGFzc2VzOjpTaXplQ2xhc3NBbGxvY1BvbGljeSBhcyB3ZWVfYWxsb2M6OkFsbG9jUG9saWN5Pjo6bmV3X2NlbGxfZm9yX2ZyZWVfbGlzdDo6aGQ2NDkyNjA0NzM4NDBkODdbTDxzaGEyOjpzaGE1MTI6OlNoYTUxMiBhcyBjb3JlOjpkZWZhdWx0OjpEZWZhdWx0Pjo6ZGVmYXVsdDo6aDFiZGM1YzVmYWEyOWY2MDdcO2NvcmU6OnNsaWNlOjo8aW1wbCBbVF0+Ojpjb3B5X2Zyb21fc2xpY2U6Omg1MDJhOGRkYTZmYTZkZTJkXTtjb3JlOjpzbGljZTo6PGltcGwgW1RdPjo6Y29weV9mcm9tX3NsaWNlOjpoNjdhZGUwNDBkMWJkMmIyOV5iPHN0ZDo6cGFuaWNraW5nOjpjb250aW51ZV9wYW5pY19mbXQ6OlBhbmljUGF5bG9hZCBhcyBjb3JlOjpwYW5pYzo6Qm94TWVVcD46OmdldDo6aGEwMzZiMDMzYWRhYmVkYThfN2FyZ29uMm1pbjo6YmxvY2s6Ok1hdHJpeDo6eG9yX2NvbHVtbjo6aGUxYWU5NmQzZDJkMzRiOTBgRGN1cnZlMjU1MTlfZGFsZWs6OmVkd2FyZHM6OkVkd2FyZHNQb2ludDo6Y29tcHJlc3M6Omg0MzU1NGJmY2IyZGRlZGY4YThhbGxvYzo6dmVjOjpWZWM8VD46OmV4dGVuZF9mcm9tX3NsaWNlOjpoNWYyMDY5MjNjYjk0YjIyZWI/d2FzbV9iaW5kZ2VuOjpjb252ZXJ0OjpjbG9zdXJlczo6aW52b2tlM19tdXQ6Omg3NjAyYWE2ZDVmZmU1NWFjYzhhbGxvYzo6dmVjOjpWZWM8VD46OmV4dGVuZF9mcm9tX3NsaWNlOjpoNzhlMzYzOGY3YTNkMTkwYWRNPHdlZV9hbGxvYzo6V2VlQWxsb2MgYXMgY29yZTo6YWxsb2M6Okdsb2JhbEFsbG9jPjo6ZGVhbGxvYzo6aDk5OGY0OTMzOWYyYzZmNzJlEWtleW1hbmFnZXJfdmVyaWZ5Zg5rZXltYW5hZ2VyX25ld2dJY29yZTo6Zm10OjpudW06OjxpbXBsIGNvcmU6OmZtdDo6TG93ZXJIZXggZm9yIGk4Pjo6Zm10OjpoNWZhNTExMjJmNjZmNGVjZmhJY29yZTo6Zm10OjpudW06OjxpbXBsIGNvcmU6OmZtdDo6VXBwZXJIZXggZm9yIGk4Pjo6Zm10OjpoZDM2ZDJmMTNlNDI5MmRkMWlKY29yZTo6Zm10OjpudW06OjxpbXBsIGNvcmU6OmZtdDo6TG93ZXJIZXggZm9yIGkzMj46OmZtdDo6aGFjYmQ4ODljODlkMmVmZWJqSmNvcmU6OmZtdDo6bnVtOjo8aW1wbCBjb3JlOjpmbXQ6OlVwcGVySGV4IGZvciBpMzI+OjpmbXQ6OmhlZjljYjQwMzg2YzNhOWZmazpjb3JlOjpmbXQ6OmJ1aWxkZXJzOjpEZWJ1Z1R1cGxlOjpmaW5pc2g6Omg5MWUyMTljMDU4NWI1Y2VhbDdhbGxvYzo6cmF3X3ZlYzo6UmF3VmVjPFQsQT46OnJlc2VydmU6Omg3Y2M0M2MxODk3MGY5MzY1bS5hbGxvYzo6dmVjOjpWZWM8VD46OnJlc2VydmU6OmhjMGZhMzIxMmMxMGU0ODM3bh5rZXltYW5hZ2VyX3ZlcmlmeVdpdGhQdWJsaWNLZXlvNGJsYWtlMl9yZmM6OmJsYWtlMmI6OkJsYWtlMmI6Om5ldzo6aDYyOTE4M2U0NGFlNzdlMTFwCF9fbXVsdGkzcStzdGQ6OnBhbmlja2luZzo6c2V0X2hvb2s6OmhhMGU1MmE2ZGQ3MDMyMDM2cko8Y29yZTo6b3BzOjpyYW5nZTo6UmFuZ2U8SWR4PiBhcyBjb3JlOjpmbXQ6OkRlYnVnPjo6Zm10OjpoZjY1MjU5ODE5YmY5MzIwNHNiPHdlZV9hbGxvYzo6TGFyZ2VBbGxvY1BvbGljeSBhcyB3ZWVfYWxsb2M6OkFsbG9jUG9saWN5Pjo6bmV3X2NlbGxfZm9yX2ZyZWVfbGlzdDo6aDIzYWViMTIyNzk2ZTdmN2Z0LmNvcmU6OnJlc3VsdDo6dW53cmFwX2ZhaWxlZDo6aGQ5MGFiOTVjODU0MzFmZDN1B21lbW1vdmV2MWFsbG9jOjpzeW5jOjpBcmM8VD46OmRyb3Bfc2xvdzo6aDc2MjQ0MzU3YmQ2ZDhjYmN3FV9fd2JnX2tleW1hbmFnZXJfZnJlZXguY29yZTo6cmVzdWx0Ojp1bndyYXBfZmFpbGVkOjpoZWZjN2U3NGVjZTkwYzRkNXkuY29yZTo6cmVzdWx0Ojp1bndyYXBfZmFpbGVkOjpoNDI3MTQ2ZTYwZTkxYzgzMHouY29yZTo6cmVzdWx0Ojp1bndyYXBfZmFpbGVkOjpoODBjZmQ0NWJkODkxOTlkOXsuY29yZTo6cmVzdWx0Ojp1bndyYXBfZmFpbGVkOjpoZjRjMDJiNDNkNzdkMWZlN3w1c3RkOjpwYW5pY2tpbmc6OmNvbnRpbnVlX3BhbmljX2ZtdDo6aDY5MjM5YjMxZTk4MmQ5ZjJ9MjwmVCBhcyBjb3JlOjpmbXQ6OkRpc3BsYXk+OjpmbXQ6OmhjOTViYjRhYmExODBlNWU0fjRjb3JlOjpzbGljZTo6c2xpY2VfaW5kZXhfbGVuX2ZhaWw6Omg4ZjRkYTc4OGUwMDRmOWY1fzZjb3JlOjpwYW5pY2tpbmc6OnBhbmljX2JvdW5kc19jaGVjazo6aDE3OTk4YjBkZTI2OWM4MWT9ATZjb3JlOjpzbGljZTo6c2xpY2VfaW5kZXhfb3JkZXJfZmFpbDo6aGNkMDI3NDIxODJiYmEzZTj9AUQ8Y29yZTo6Zm10OjpBcmd1bWVudHMgYXMgY29yZTo6Zm10OjpEaXNwbGF5Pjo6Zm10OjpoYjA2NGQwYTQ5ZWRkMjg5N/0BMmNvcmU6OmZtdDo6Rm9ybWF0dGVyOjp3cml0ZV9mbXQ6OmhlZmVmZDlhYTE5NWQ5MGQ5/QEwPCZUIGFzIGNvcmU6OmZtdDo6RGVidWc+OjpmbXQ6OmgzNjIyMzc0NzMyZjFhNjJl/QE6PCZtdXQgVyBhcyBjb3JlOjpmbXQ6OldyaXRlPjo6d3JpdGVfZm10OjpoMDVlNjAwYzJhMzJjMjJlYv0BOjwmbXV0IFcgYXMgY29yZTo6Zm10OjpXcml0ZT46OndyaXRlX2ZtdDo6aDIwZjg5ZDI1ZWQxMGRhYjP9AS5jb3JlOjpyZXN1bHQ6OnVud3JhcF9mYWlsZWQ6OmhlNGE0YzBiNTk4YTM0NWIy/QE6PCZtdXQgVyBhcyBjb3JlOjpmbXQ6OldyaXRlPjo6d3JpdGVfZm10OjpoYzRmNzBiZjNlMmIwMDQwYf0BOjwmbXV0IFcgYXMgY29yZTo6Zm10OjpXcml0ZT46OndyaXRlX2ZtdDo6aDU0MWRhOGNkMTY5MDgxYmX9AS5jb3JlOjpmbXQ6OldyaXRlOjp3cml0ZV9mbXQ6OmhjMGU5NmZkNTYzZDE4YzBi/QFkPHN0ZDo6cGFuaWNraW5nOjpiZWdpbl9wYW5pYzo6UGFuaWNQYXlsb2FkPEE+IGFzIGNvcmU6OnBhbmljOjpCb3hNZVVwPjo6Ym94X21lX3VwOjpoZDg4ODJiZGZkNzBhMjM0Yf0BKWNvcmU6OnBhbmlja2luZzo6cGFuaWM6Omg0NzcyMmRlOWM2NTlkM2Y0/QFkPHN0ZDo6cGFuaWNraW5nOjpiZWdpbl9wYW5pYzo6UGFuaWNQYXlsb2FkPEE+IGFzIGNvcmU6OnBhbmljOjpCb3hNZVVwPjo6Ym94X21lX3VwOjpoMGIwODUwYjE3NGNiZmY3ZP0BZDxzdGQ6OnBhbmlja2luZzo6YmVnaW5fcGFuaWM6OlBhbmljUGF5bG9hZDxBPiBhcyBjb3JlOjpwYW5pYzo6Qm94TWVVcD46OmJveF9tZV91cDo6aDEwYzkwMWU2N2JmODNjZTT9ATJzdGQ6OnBhbmlja2luZzo6YmVnaW5fcGFuaWNfZm10OjpoY2RmZDQxNzc3YzU1Y2Q2Mv0BLmNvcmU6Om9wdGlvbjo6ZXhwZWN0X2ZhaWxlZDo6aGZlYmUyMGViYjYyMDk4YWT9AUc8c3RkOjpmZmk6OmNfc3RyOjpOdWxFcnJvciBhcyBjb3JlOjpmbXQ6OkRlYnVnPjo6Zm10OjpoMTRlY2IzNWE5ZTFhODdmMf0BVTxlZDI1NTE5X2RhbGVrOjplcnJvcnM6OlNpZ25hdHVyZUVycm9yIGFzIGNvcmU6OmZtdDo6RGlzcGxheT46OmZtdDo6aDIyMzQ2YzJlYTNlM2MzYjX9AUNjb3JlOjpmbXQ6OkZvcm1hdHRlcjo6cGFkX2ludGVncmFsOjp3cml0ZV9wcmVmaXg6OmhhZTFmZjA5NGYzNDFlYWY2/QE+Y3VydmUyNTUxOV9kYWxlazo6c2NhbGFyOjpTY2FsYXI6OmZyb21fYml0czo6aDA5MDYwYjUxYWI2OTFiYzX9AXc8JmN1cnZlMjU1MTlfZGFsZWs6OnNjYWxhcjo6U2NhbGFyIGFzIGNvcmU6Om9wczo6YXJpdGg6Ok11bDwmY3VydmUyNTUxOV9kYWxlazo6c2NhbGFyOjpTY2FsYXI+Pjo6bXVsOjpoYzBiMzhmZWQ2ODFhNTIzZP0BBm1lbWNtcP0BVDxlZDI1NTE5X2RhbGVrOjpzZWNyZXQ6OlNlY3JldEtleSBhcyBjb3JlOjpvcHM6OmRyb3A6OkRyb3A+Ojpkcm9wOjpoYWFhMzNiOWQ0Yjg2MDZjMP0BLWNvcmU6OnBhbmlja2luZzo6cGFuaWNfZm10OjpoY2Q4NjhiNmVmMDdmNWI3Nv0BSmN1cnZlMjU1MTlfZGFsZWs6OmVkd2FyZHM6OkNvbXByZXNzZWRFZHdhcmRzWTo6dG9fYnl0ZXM6OmgxODkyMGYxNDY4NTgzODBj/QERX193YmluZGdlbl9tYWxsb2P9AQZtZW1jcHn9ATA8JlQgYXMgY29yZTo6Zm10OjpEZWJ1Zz46OmZtdDo6aDY5ZjAxMGJlYmIyMWU1ZjH9AQxfX3JnX3JlYWxsb2P9ATA8JlQgYXMgY29yZTo6Zm10OjpEZWJ1Zz46OmZtdDo6aDZmNmRiMzIzNDE5ZjFjOTP9ATA8JlQgYXMgY29yZTo6Zm10OjpEZWJ1Zz46OmZtdDo6aDk1ODI1YzFmNzQ1NzczNjf9ATA8JlQgYXMgY29yZTo6Zm10OjpEZWJ1Zz46OmZtdDo6aGViMzVjNTQ4Yzc1NzNkMzH9ATZzdGQ6OnN5bmM6OmNvbmR2YXI6OkNvbmR2YXI6OnZlcmlmeTo6aGY1YTRmNTEzNGZkN2IwNjb9ATRjb3JlOjpmbXQ6OkZvcm1hdHRlcjo6ZGVidWdfdHVwbGU6OmhmODlhOWFlYmQ2NmY5YTEx/QFAc3RkOjpzeW5jOjpvbmNlOjpPbmNlOjpjYWxsX29uY2U6Ont7Y2xvc3VyZX19OjpoZDYxZDdiM2E5YzQzZDM5N/0BSGNvcmU6Om9wczo6ZnVuY3Rpb246OkZuT25jZTo6Y2FsbF9vbmNle3t2dGFibGUuc2hpbX19OjpoMzNjMmJiNzAwYjczZmY1Zf0BOjwmbXV0IFcgYXMgY29yZTo6Zm10OjpXcml0ZT46OndyaXRlX3N0cjo6aDgyYmI4ZmFkNjNkMWNiZGT9ATNjb3JlOjpmbXQ6OkZvcm1hdHRlcjo6ZGVidWdfbGlzdDo6aDgzNmJkNzMzMTFmOGJhNWP9AQZtZW1zZXT9AS5zdGQ6OnBhbmlja2luZzo6YmVnaW5fcGFuaWM6Omg2YTE2MWI1NjBmZGVmN2Nh/QEuc3RkOjpwYW5pY2tpbmc6OmJlZ2luX3BhbmljOjpoY2E2NDc4ODFhYWRmMmNkM/0BTmN1cnZlMjU1MTlfZGFsZWs6OnNjYWxhcjo6U2NhbGFyOjpmcm9tX2J5dGVzX21vZF9vcmRlcl93aWRlOjpoYjFjYjkzYzkxYWI1ZTNjYv0BLnN0ZDo6cGFuaWNraW5nOjpiZWdpbl9wYW5pYzo6aDU4NWExZGFhM2Q3MGM5ZTT9ATljb3JlOjpmbXQ6OmJ1aWxkZXJzOjpEZWJ1Z0xpc3Q6OmZpbmlzaDo6aGVmZTAzOTg1NTUwNjljNTL9AVg8Y3VydmUyNTUxOV9kYWxlazo6c2NhbGFyOjpTY2FsYXIgYXMgY29yZTo6ZGVmYXVsdDo6RGVmYXVsdD46OmRlZmF1bHQ6Omg4NGNjZmYxNmE5MzM2Y2Nj/QE/d2FzbV9iaW5kZ2VuOjpjb252ZXJ0OjpjbG9zdXJlczo6aW52b2tlNF9tdXQ6OmgwODRlMmEzNGQ5ZjI4ZTY1/QESX193YmluZGdlbl9yZWFsbG9j/QEwY29yZTo6cHRyOjpyZWFsX2Ryb3BfaW5fcGxhY2U6OmgyZGU4MmYyN2Y5NTAzNjMy/QEKcnVzdF9wYW5pY/0BP3dhc21fYmluZGdlbjo6Y29udmVydDo6Y2xvc3VyZXM6Omludm9rZTNfbXV0OjpoMGFkZDM0ZDNjNjhkMTAwMP0BP3dhc21fYmluZGdlbjo6Y29udmVydDo6Y2xvc3VyZXM6Omludm9rZTNfbXV0OjpoMTcxNWRmY2VhZGE3OTI4Zf0BP3dhc21fYmluZGdlbjo6Y29udmVydDo6Y2xvc3VyZXM6Omludm9rZTNfbXV0OjpoMTdmNzYwZGYyNDgzZWYwZf0BP3dhc21fYmluZGdlbjo6Y29udmVydDo6Y2xvc3VyZXM6Omludm9rZTNfbXV0OjpoMWM5NDcxMDBjZjZhZWQ4OP0BP3dhc21fYmluZGdlbjo6Y29udmVydDo6Y2xvc3VyZXM6Omludm9rZTNfbXV0OjpoNTNiNDM3OGFhYTkwZjM0Yv0BP3dhc21fYmluZGdlbjo6Y29udmVydDo6Y2xvc3VyZXM6Omludm9rZTNfbXV0OjpoNzA0MWYxYzc5YmQ4ZDNmMf0BP3dhc21fYmluZGdlbjo6Y29udmVydDo6Y2xvc3VyZXM6Omludm9rZTNfbXV0OjpoYzMyNTQ5MTM2ZTE3MjFjOP0BP3dhc21fYmluZGdlbjo6Y29udmVydDo6Y2xvc3VyZXM6Omludm9rZTJfbXV0OjpoMTcwZGFiYmRmNGMwNDQ3Yv0BP3dhc21fYmluZGdlbjo6Y29udmVydDo6Y2xvc3VyZXM6Omludm9rZTFfbXV0OjpoY2Q5Nzg3MTU5M2IwYzFkZP0BXjxzdGQ6OnBhbmlja2luZzo6YmVnaW5fcGFuaWM6OlBhbmljUGF5bG9hZDxBPiBhcyBjb3JlOjpwYW5pYzo6Qm94TWVVcD46OmdldDo6aGM2YmY2M2M5YzFkYTc3Y2L9AV48c3RkOjpwYW5pY2tpbmc6OmJlZ2luX3BhbmljOjpQYW5pY1BheWxvYWQ8QT4gYXMgY29yZTo6cGFuaWM6OkJveE1lVXA+OjpnZXQ6Omg3YzU4NjI1ZjljYjIyMjJk/QFePHN0ZDo6cGFuaWNraW5nOjpiZWdpbl9wYW5pYzo6UGFuaWNQYXlsb2FkPEE+IGFzIGNvcmU6OnBhbmljOjpCb3hNZVVwPjo6Z2V0OjpoYzM3OTM5OTdlMjAwMzlmOP0B/QFjb3JlOjpzdHI6OnRyYWl0czo6PGltcGwgY29yZTo6c2xpY2U6OlNsaWNlSW5kZXg8c3RyPiBmb3IgY29yZTo6b3BzOjpyYW5nZTo6UmFuZ2U8dXNpemU+Pjo6aW5kZXg6Ont7Y2xvc3VyZX19OjpoNzc1NTRiMmVmMTEyZGNmMv0BcWFsbG9jOjpzdHJpbmc6OjxpbXBsIGNvcmU6OmNvbnZlcnQ6OkZyb208YWxsb2M6OnN0cmluZzo6U3RyaW5nPiBmb3IgYWxsb2M6OnZlYzo6VmVjPHU4Pj46OmZyb206OmgyZGY1ZDkyODk5M2M0YTlm/QE+Y29yZTo6cGFuaWM6OkxvY2F0aW9uOjppbnRlcm5hbF9jb25zdHJ1Y3Rvcjo6aDE1NDkxZTFhMmFmMTRmMzH9ATBjb3JlOjpwdHI6OnJlYWxfZHJvcF9pbl9wbGFjZTo6aDE2MzI5MGM2NzVjYjg4MTP9AQhydXN0X29vbf0BRTxjb3JlOjpjZWxsOjpCb3Jyb3dFcnJvciBhcyBjb3JlOjpmbXQ6OkRlYnVnPjo6Zm10OjpoMTdjNDEzMWExOTU5Y2I1MP0BSDxjb3JlOjpjZWxsOjpCb3Jyb3dNdXRFcnJvciBhcyBjb3JlOjpmbXQ6OkRlYnVnPjo6Zm10OjpoMDMxYzliOGE5YWEzNjhlYv0BPjxjb3JlOjpmbXQ6OkVycm9yIGFzIGNvcmU6OmZtdDo6RGVidWc+OjpmbXQ6OmgwZGIxYzNmN2YyZjMyN2Y4/QEyY29yZTo6b3B0aW9uOjpPcHRpb248VD46OnVud3JhcDo6aGE2M2QwMmEzOWQ2OTFmMGL9ATJjb3JlOjpvcHRpb246Ok9wdGlvbjxUPjo6dW53cmFwOjpoZDgyN2UyMzM3YjA4YmJhM/0BDl9fcnVzdF9yZWFsbG9j/QEPX193YmluZGdlbl9mcmVl/QEkc3VidGxlOjpibGFja19ib3g6OmhlZGIwZTllODVmN2E2MDhi/QEyPCZUIGFzIGNvcmU6OmZtdDo6RGlzcGxheT46OmZtdDo6aGVhNDc5MzU1NzlkN2I3YmX9ATo8Jm11dCBXIGFzIGNvcmU6OmZtdDo6V3JpdGU+Ojp3cml0ZV9zdHI6OmhjNzU1NzFjODU0MWMzMDcw/QEyPCZUIGFzIGNvcmU6OmZtdDo6RGlzcGxheT46OmZtdDo6aDc1NTU2NjY1NDM0MmRkYWb9AQxfX3J1c3RfYWxsb2P9ATI8JlQgYXMgY29yZTo6Zm10OjpEaXNwbGF5Pjo6Zm10OjpoN2YxMWM4ZDEwZDMyZjRkNf0BOjwmbXV0IFcgYXMgY29yZTo6Zm10OjpXcml0ZT46OndyaXRlX3N0cjo6aDdmODExYWU1OGFjZTZlM2L9ATI8JlQgYXMgY29yZTo6Zm10OjpEaXNwbGF5Pjo6Zm10OjpoMjIwMTg1ZmVkZWFmODBhN/0BOmVkMjU1MTlfZGFsZWs6OmVkMjU1MTk6OktleXBhaXI6OnZlcmlmeTo6aGNkMjUwNDE3MDEzNmE2YmH9ATI8JlQgYXMgY29yZTo6Zm10OjpEaXNwbGF5Pjo6Zm10OjpoYzVjZjI2MTY1MTIwNTljNf0BMjwmVCBhcyBjb3JlOjpmbXQ6OkRpc3BsYXk+OjpmbXQ6Omg4YWQ2MDYyZjViZDVlOWMy/QEyPCZUIGFzIGNvcmU6OmZtdDo6RGlzcGxheT46OmZtdDo6aGIxY2IxNmEyMDJlN2U4NDn9AThjb3JlOjpmbXQ6OkZvcm1hdHRlcjo6ZGVidWdfbG93ZXJfaGV4OjpoM2QyZGRkNDExZjE1MDhhZP0BOGNvcmU6OmZtdDo6Rm9ybWF0dGVyOjpkZWJ1Z191cHBlcl9oZXg6Omg0NmFkYWU5ZmU5YWE4YWNh/QEMX19yZ19kZWFsbG9j/QEOX19ydXN0X2RlYWxsb2P9AV9jdXJ2ZTI1NTE5X2RhbGVrOjplZHdhcmRzOjpFZHdhcmRzUG9pbnQ6OnZhcnRpbWVfZG91YmxlX3NjYWxhcl9tdWxfYmFzZXBvaW50OjpoMGRlYWQ4NzNlYjlkNDNiYf0BOXN0ZDo6c3lzOjp3YXNtOjpjb25kdmFyOjpDb25kdmFyOjp3YWl0OjpoNTQzMTI1MTkzZTZmOTliY/0BTmNvcmU6OmZtdDo6bnVtOjppbXA6OjxpbXBsIGNvcmU6OmZtdDo6RGlzcGxheSBmb3IgdTMyPjo6Zm10OjpoYmUyM2Y0YjNhYTg5OTdkZf0BTWNvcmU6OmZtdDo6bnVtOjppbXA6OjxpbXBsIGNvcmU6OmZtdDo6RGlzcGxheSBmb3IgdTg+OjpmbXQ6OmgxN2Y3YmM1OWRjNzVkYzY1/QE3Y29yZTo6Zm10OjpidWlsZGVyczo6RGVidWdTZXQ6OmVudHJ5OjpoZjMxNWE2MWU1MDJiOWNhM/0BOjwmbXV0IFcgYXMgY29yZTo6Zm10OjpXcml0ZT46OndyaXRlX3N0cjo6aDBkMmVmODVhMjNhNmViNTL9ATRjb3JlOjpmbXQ6OkFyZ3VtZW50VjE6OnNob3dfdXNpemU6Omg5YjhhYzU5ODQ4NDhjMWQ3/QFOY29yZTo6Zm10OjpudW06OmltcDo6PGltcGwgY29yZTo6Zm10OjpEaXNwbGF5IGZvciB1NjQ+OjpmbXQ6Omg5YTU1ZDAxMGIyYzVlODBk/QEyPCZUIGFzIGNvcmU6OmZtdDo6RGlzcGxheT46OmZtdDo6aDQwZWM1YjYzY2RhZjIwNDH9ATI8JlQgYXMgY29yZTo6Zm10OjpEaXNwbGF5Pjo6Zm10OjpoNzZkYmIxMzVkYzQ4MzBhOf0BCl9fcmdfYWxsb2P9ATI8JlQgYXMgY29yZTo6Zm10OjpEaXNwbGF5Pjo6Zm10OjpoYjgzNzczZmFkYmE1NjQ4Yf0BMXdhc21fYmluZGdlbjo6X19ydDo6dGhyb3dfbnVsbDo6aGEzMWE3MTg1MGExYWQwNDD9ATJ3YXNtX2JpbmRnZW46Ol9fcnQ6OmJvcnJvd19mYWlsOjpoM2E1MjNiMTJlYTZmMGZmMP0BKndhc21fYmluZGdlbjo6dGhyb3dfc3RyOjpoMDZkODFiZjljNGE3MzIwZv0B/QFjdXJ2ZTI1NTE5X2RhbGVrOjplZHdhcmRzOjo8aW1wbCBjb3JlOjpvcHM6OmFyaXRoOjpNdWw8JmN1cnZlMjU1MTlfZGFsZWs6OmVkd2FyZHM6OkVkd2FyZHNCYXNlcG9pbnRUYWJsZT4gZm9yICZjdXJ2ZTI1NTE5X2RhbGVrOjpzY2FsYXI6OlNjYWxhcj46Om11bDo6aGFmNjdkNDQzMTQ5ZTVhZmX9AVU8c3RkOjpzeXNfY29tbW9uOjpwb2lzb246OlBvaXNvbkVycm9yPFQ+IGFzIGNvcmU6OmZtdDo6RGVidWc+OjpmbXQ6Omg5NWZhYzMyMTNhYzIyYmI0/QE6c3RkOjpzeXNfY29tbW9uOjpjb25kdmFyOjpDb25kdmFyOjp3YWl0OjpoMzkyNWU5NTVhNDU2YWMyMf0BM2FsbG9jOjphbGxvYzo6aGFuZGxlX2FsbG9jX2Vycm9yOjpoN2MyOGNmZjhiOWJmNTNkNv0BLmNvcmU6OnBhbmljOjpMb2NhdGlvbjo6ZmlsZTo6aGI0NTk1NjViMTljZjMzMjf9ATs8Jm11dCBXIGFzIGNvcmU6OmZtdDo6V3JpdGU+Ojp3cml0ZV9jaGFyOjpoZDBkZWQzYTIzNDRjZmQzOP0BMzxzdHIgYXMgY29yZTo6Zm10OjpEaXNwbGF5Pjo6Zm10OjpoZGYyOGI0ZTIxOTVkNGYxMP0BJWpzX3N5czo6RXJyb3I6Om5ldzo6aDA3YjZkMTIzNDg2OTY0ZTf9ASp3YXNtX2JpbmRnZW46OnRocm93X3ZhbDo6aDUxYzkzNWM3NDI4Mzk4NWL9ARFydXN0X2JlZ2luX3Vud2luZP0BNGFsbG9jOjpyYXdfdmVjOjpjYXBhY2l0eV9vdmVyZmxvdzo6aGM3ZDMxNTlkMjc4MzI0OTf9ATNjb3JlOjpwYW5pYzo6UGFuaWNJbmZvOjpsb2NhdGlvbjo6aDA2Njc0MDJkMGM4OTRhMmP9ATBjb3JlOjpvcHM6OmZ1bmN0aW9uOjpGbjo6Y2FsbDo6aDNiNDdlOTA3NmE2ZjljYzb9ATdjb3JlOjpvcHM6OmZ1bmN0aW9uOjpGbk11dDo6Y2FsbF9tdXQ6OmgzOTdlYzBhOGE2MmE4YjMw/QFIY29yZTo6b3BzOjpmdW5jdGlvbjo6Rm5PbmNlOjpjYWxsX29uY2V7e3Z0YWJsZS5zaGltfX06OmhhNDAwNmI4MDhhNDIzNmQ3/QFIYWxsb2M6OnJhd192ZWM6OlJhd1ZlYzxULEE+OjphbGxvY2F0ZV9pbjo6e3tjbG9zdXJlfX06Omg2NDFlYmU0NGQ0ZmM0YzQz/QE1d2FzbV9iaW5kZ2VuOjpfX3J0OjptYWxsb2NfZmFpbHVyZTo6aDQ5NzU5YzFjM2QxMGQzYjD9ATJjb3JlOjpwYW5pYzo6UGFuaWNJbmZvOjptZXNzYWdlOjpoZjNkMTAxYjY3ZDI1MDlmNf0BLmNvcmU6OnBhbmljOjpMb2NhdGlvbjo6bGluZTo6aDRiMWM1MWM4OWMwNDdhMzf9ATBjb3JlOjpwYW5pYzo6TG9jYXRpb246OmNvbHVtbjo6aDhhMjA5NDI5NjZiN2I3MGP9AWs8d2VlX2FsbG9jOjpzaXplX2NsYXNzZXM6OlNpemVDbGFzc0FsbG9jUG9saWN5IGFzIHdlZV9hbGxvYzo6QWxsb2NQb2xpY3k+OjptaW5fY2VsbF9zaXplOjpoYzI0MjNkMWQyN2QwZWY5OP0Bfjx3ZWVfYWxsb2M6OnNpemVfY2xhc3Nlczo6U2l6ZUNsYXNzQWxsb2NQb2xpY3kgYXMgd2VlX2FsbG9jOjpBbGxvY1BvbGljeT46OnNob3VsZF9tZXJnZV9hZGphY2VudF9mcmVlX2NlbGxzOjpoZTI5ZDc3MGYzNmM5N2E5Mf0BWTx3ZWVfYWxsb2M6OkxhcmdlQWxsb2NQb2xpY3kgYXMgd2VlX2FsbG9jOjpBbGxvY1BvbGljeT46Om1pbl9jZWxsX3NpemU6Omg2NzEwMTcxMjc0ZjljNGVl/QFsPHdlZV9hbGxvYzo6TGFyZ2VBbGxvY1BvbGljeSBhcyB3ZWVfYWxsb2M6OkFsbG9jUG9saWN5Pjo6c2hvdWxkX21lcmdlX2FkamFjZW50X2ZyZWVfY2VsbHM6Omg1MzRmYWQ1MjAyM2NmM2Fi/QIxPFQgYXMgY29yZTo6YW55OjpBbnk+Ojp0eXBlX2lkOjpoNDE2OWI4MDM2YTkzMjQyY/0CMTxUIGFzIGNvcmU6OmFueTo6QW55Pjo6dHlwZV9pZDo6aGRkYTNhZTkzZmNmNzg4ZWT9AjE8VCBhcyBjb3JlOjphbnk6OkFueT46OnR5cGVfaWQ6OmgxOTM3ZDliZWE1Y2Q3Mzhj/QIxPFQgYXMgY29yZTo6YW55OjpBbnk+Ojp0eXBlX2lkOjpoODY3OWRiNzEwMjJjZmNjNf0CPWN1cnZlMjU1MTlfZGFsZWs6OnNjYWxhcjo6U2NhbGFyOjphc19ieXRlczo6aGRmNjgzMzcyNTg1NWExMWP9AkpjdXJ2ZTI1NTE5X2RhbGVrOjplZHdhcmRzOjpDb21wcmVzc2VkRWR3YXJkc1k6OmFzX2J5dGVzOjpoYzMxZWUxNzEwMjMzMmY5Yv0CMTxUIGFzIGNvcmU6OmFueTo6QW55Pjo6dHlwZV9pZDo6aDI4Nzc0M2ZiZWQ1NjI2ODH9AjE8VCBhcyBjb3JlOjphbnk6OkFueT46OnR5cGVfaWQ6Omg1ZjcyZTFkMWUyNjYwZTZi/QIxPFQgYXMgY29yZTo6YW55OjpBbnk+Ojp0eXBlX2lkOjpoNmUyYzQ0YWE5YjViZjE4NP0CMTxUIGFzIGNvcmU6OmFueTo6QW55Pjo6dHlwZV9pZDo6aGZkMzViMTlkNDEwZDk5MjH9AiZzdGQ6OnByb2Nlc3M6OmFib3J0OjpoYmFmYzEwZWQ4ZmZhNWU5Zv0CEl9fcnVzdF9zdGFydF9wYW5pY/0CMTxUIGFzIGNvcmU6OmFueTo6QW55Pjo6dHlwZV9pZDo6aGM1NGRkZWJkODVjYTE4ODL9AjBjb3JlOjpwdHI6OnJlYWxfZHJvcF9pbl9wbGFjZTo6aDE1M2FkMGJmNWFmNmM4YTL9AjBjb3JlOjpwdHI6OnJlYWxfZHJvcF9pbl9wbGFjZTo6aDMyNzU3NmQ5NmZkNjY3ODb9AjBjb3JlOjpwdHI6OnJlYWxfZHJvcF9pbl9wbGFjZTo6aGViN2JiZGJhNTJiY2NjNjL9AjBjb3JlOjpwdHI6OnJlYWxfZHJvcF9pbl9wbGFjZTo6aDYwMWY5OGUwZmM5MjljMjX9AjBjb3JlOjpwdHI6OnJlYWxfZHJvcF9pbl9wbGFjZTo6aDA0ZDM3NTM1NmIzMDQzZGb9AjBjb3JlOjpwdHI6OnJlYWxfZHJvcF9pbl9wbGFjZTo6aDYwMWY5OGUwZmM5MjljMjX9AjBjb3JlOjpwdHI6OnJlYWxfZHJvcF9pbl9wbGFjZTo6aDEwM2FiNDkyMzU5YTYwMzj9AjBjb3JlOjpwdHI6OnJlYWxfZHJvcF9pbl9wbGFjZTo6aGVjMTViMjEwMjIxMzUxYzn9AjBjb3JlOjpwdHI6OnJlYWxfZHJvcF9pbl9wbGFjZTo6aDFlYzNiMDA1YmMzNGQxZjj9AjBjb3JlOjpwdHI6OnJlYWxfZHJvcF9pbl9wbGFjZTo6aDQwYzYzZWI3NDhiNjQwNzL9AjBjb3JlOjpwdHI6OnJlYWxfZHJvcF9pbl9wbGFjZTo6aGI3OWJkMDIxMWVmM2M2MDj9AjBjb3JlOjpwdHI6OnJlYWxfZHJvcF9pbl9wbGFjZTo6aDIwMGNkY2Y3ODYwMGUxNDP9AjBjb3JlOjpwdHI6OnJlYWxfZHJvcF9pbl9wbGFjZTo6aDMxZjMxYTNlZDU5YTk4ZDL9AlY8c3RkOjpzeXNfY29tbW9uOjp0aHJlYWRfbG9jYWw6OktleSBhcyBjb3JlOjpvcHM6OmRyb3A6OkRyb3A+Ojpkcm9wOjpoODFmN2JkNTkzYWQyZWFiY/0CN3N0ZDo6YWxsb2M6OmRlZmF1bHRfYWxsb2NfZXJyb3JfaG9vazo6aDQ0ZGE0ODBkNWYyYWVlZmb9AjBjb3JlOjpwdHI6OnJlYWxfZHJvcF9pbl9wbGFjZTo6aDAyM2Y0YjExMzZmYjczMmP9AjBjb3JlOjpwdHI6OnJlYWxfZHJvcF9pbl9wbGFjZTo6aGNmODI4NDc3ODkyMzliNTD9Akk8Y29yZTo6ZmZpOjpWYUxpc3RJbXBsIGFzIGNvcmU6Om9wczo6ZHJvcDo6RHJvcD46OmRyb3A6OmgzNDYyNzUyOGQyOTIwOTA2AP39/f0ACXByb2R1Y2VycwIIbGFuZ3VhZ2UBBFJ1c3QEMjAxOAxwcm9jZXNzZWQtYnkDBXJ1c3RjJTEuMzguMC1uaWdodGx5ICg2OTY1NmZhNGMgMjAxOS0wNy0xMykGd2FscnVzBjAuMTIuMAx3YXNtLWJpbmRnZW4SMC4yLjUzIChjN2MxNjlhZTcp', imports)}

var wasm = /*#__PURE__*/Object.freeze({
__proto__: null,
'default': wasm_key_manager_bg
});

let cachegetUint8Memory = null;
function getUint8Memory() {
if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== undefined) {
  cachegetUint8Memory = new Uint8Array(undefined);
}
return cachegetUint8Memory;
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm(arg) {
const ptr = undefined(arg.length * 1);
getUint8Memory().set(arg, ptr / 1);
WASM_VECTOR_LEN = arg.length;
return ptr;
}

let cachegetInt32Memory = null;
function getInt32Memory() {
if (cachegetInt32Memory === null || cachegetInt32Memory.buffer !== undefined) {
  cachegetInt32Memory = new Int32Array(undefined);
}
return cachegetInt32Memory;
}

function getArrayU8FromWasm(ptr, len) {
return getUint8Memory().subarray(ptr / 1, ptr / 1 + len);
}

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
? function (arg, view) {
return cachedTextEncoder.encodeInto(arg, view);
}
: function (arg, view) {
const buf = cachedTextEncoder.encode(arg);
view.set(buf);
return {
  read: arg.length,
  written: buf.length
};
});

function passStringToWasm(arg) {

let len = arg.length;
let ptr = undefined(len);

const mem = getUint8Memory();

let offset = 0;

for (; offset < len; offset++) {
  const code = arg.charCodeAt(offset);
  if (code > 0x7F) break;
  mem[ptr + offset] = code;
}

if (offset !== len) {
  if (offset !== 0) {
      arg = arg.slice(offset);
  }
  ptr = undefined(ptr, len, len = offset + arg.length * 3);
  const view = getUint8Memory().subarray(ptr + offset, ptr + len);
  const ret = encodeString(arg, view);

  offset += ret.written;
}

WASM_VECTOR_LEN = offset;
return ptr;
}
/**
* @description Derive seed from HHA hApp ID bytes, email, and password
*
* @example
* const hha_id = new Uint8Array([
*     66, 123, 133, 136, 133,   6, 247, 116,
*      4,  59,  43, 206, 131, 168, 123,  44,
*     54,  52,   3,  53, 134,  75, 137,  43,
*     63,  26, 216, 191,  67, 117,  38, 142
* ]);
*
* deriveSeedFrom( hha_id, \'example@holo.host\', \'password\' ); // Uint8Array [ ... ]
* @param {Uint8Array} hha_id
* @param {string} email
* @param {string} password
* @returns {Uint8Array}
*/
function deriveSeedFrom(hha_id, email, password) {
const retptr = 8;
const ret = undefined(retptr, passArray8ToWasm(hha_id), WASM_VECTOR_LEN, passStringToWasm(email), WASM_VECTOR_LEN, passStringToWasm(password), WASM_VECTOR_LEN);
const memi32 = getInt32Memory();
const v0 = getArrayU8FromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
undefined(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
return v0;
}

const heap = new Array(32);

heap.fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
if (idx < 36) return;
heap[idx] = heap_next;
heap_next = idx;
}

function takeObject(idx) {
const ret = getObject(idx);
dropObject(idx);
return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm(ptr, len) {
return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
if (heap_next === heap.length) heap.push(heap.length + 1);
const idx = heap_next;
heap_next = heap[idx];

heap[idx] = obj;
return idx;
}
/**
*/
class KeyManager {

static __wrap(ptr) {
  const obj = Object.create(KeyManager.prototype);
  obj.ptr = ptr;

  return obj;
}

free() {
  const ptr = this.ptr;
  this.ptr = 0;

  undefined(ptr);
}
/**
* @description Create an Ed25519 key manager out of seed
* @see deriveSeedFrom
* @example
* const hha_id = new crypto.subtle.digest( \"SHA-256\", new Uint8Array( [] ));
* const seed = deriveSeedFrom( hha_id, \"example@holo.host\", \"password\" );
*
* new KeyManager( seed );
* @param {Uint8Array} seed
* @returns {KeyManager}
*/
constructor(seed) {
  const ret = undefined(passArray8ToWasm(seed), WASM_VECTOR_LEN);
  return KeyManager.__wrap(ret);
}
/**
* @description Get public key bytes
*
* @example
* const keys = new KeyManager( seed );
*
* keys.publicKey() // Uint8Array [ ... ]
* @returns {Uint8Array}
*/
publicKey() {
  const retptr = 8;
  const ret = undefined(retptr, this.ptr);
  const memi32 = getInt32Memory();
  const v0 = getArrayU8FromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
  undefined(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
  return v0;
}
/**
* @description Sign message and return signature bytes
*
* @example
* const keys = new KeyManager( seed );
* const message = new Uint8Array( [0xca, 0xfe] );
*
* keys.sign( message ); // Uint8Array [ ... ]
* @param {Uint8Array} message
* @returns {Uint8Array}
*/
sign(message) {
  const retptr = 8;
  const ret = undefined(retptr, this.ptr, passArray8ToWasm(message), WASM_VECTOR_LEN);
  const memi32 = getInt32Memory();
  const v0 = getArrayU8FromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
  undefined(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
  return v0;
}
/**
* @description Verify signed message against manager\'s public key
*
* @example
* const keys = new KeyManager( seed );
* const message = new Uint8Array( [0xca, 0xfe] );
* const signature = keys.sign( message );
*
* keys.verify( message, signature ) === true;
* @param {Uint8Array} message
* @param {Uint8Array} signature_bytes
* @returns {boolean}
*/
verify(message, signature_bytes) {
  const ret = undefined(this.ptr, passArray8ToWasm(message), WASM_VECTOR_LEN, passArray8ToWasm(signature_bytes), WASM_VECTOR_LEN);
  return ret !== 0;
}
/**
* @description Verify signed message with provided public key
* @param {Uint8Array} message
* @param {Uint8Array} signature_bytes
* @param {Uint8Array} public_key_bytes
* @returns {boolean}
*/
static verifyWithPublicKey(message, signature_bytes, public_key_bytes) {
  const ret = undefined(passArray8ToWasm(message), WASM_VECTOR_LEN, passArray8ToWasm(signature_bytes), WASM_VECTOR_LEN, passArray8ToWasm(public_key_bytes), WASM_VECTOR_LEN);
  return ret !== 0;
}
}

const __wbindgen_object_drop_ref = function(arg0) {
takeObject(arg0);
};

const __wbg_new_b523d83e932ae6ee = function(arg0, arg1) {
const ret = new Error(getStringFromWasm(arg0, arg1));
return addHeapObject(ret);
};

const __wbg_new_59cb74e423758ede = function() {
const ret = new Error();
return addHeapObject(ret);
};

const __wbg_stack_558ba5917b466edd = function(arg0, arg1) {
const ret = getObject(arg1).stack;
const ret0 = passStringToWasm(ret);
const ret1 = WASM_VECTOR_LEN;
getInt32Memory()[arg0 / 4 + 0] = ret0;
getInt32Memory()[arg0 / 4 + 1] = ret1;
};

const __wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
const v0 = getStringFromWasm(arg0, arg1).slice();
undefined(arg0, arg1 * 1);
console.error(v0);
};

const __wbindgen_throw = function(arg0, arg1) {
throw new Error(getStringFromWasm(arg0, arg1));
};

const __wbindgen_rethrow = function(arg0) {
throw takeObject(arg0);
};

var wasm_key_manager = /*#__PURE__*/Object.freeze({
__proto__: null,
deriveSeedFrom: deriveSeedFrom,
KeyManager: KeyManager,
__wbindgen_object_drop_ref: __wbindgen_object_drop_ref,
__wbg_new_b523d83e932ae6ee: __wbg_new_b523d83e932ae6ee,
__wbg_new_59cb74e423758ede: __wbg_new_59cb74e423758ede,
__wbg_stack_558ba5917b466edd: __wbg_stack_558ba5917b466edd,
__wbg_error_4bb6c2a97407129a: __wbg_error_4bb6c2a97407129a,
__wbindgen_throw: __wbindgen_throw,
__wbindgen_rethrow: __wbindgen_rethrow
});

var ERROR_MSG_INPUT = 'Input must be an string, Buffer or Uint8Array';

// For convenience, let people hash a string, not just a Uint8Array
function normalizeInput (input) {
var ret;
if (input instanceof Uint8Array) {
ret = input;
} else if (input instanceof Buffer) {
ret = new Uint8Array(input);
} else if (typeof (input) === 'string') {
ret = new Uint8Array(Buffer.from(input, 'utf8'));
} else {
throw new Error(ERROR_MSG_INPUT)
}
return ret
}

// Converts a Uint8Array to a hexadecimal string
// For example, toHex([255, 0, 255]) returns "ff00ff"
function toHex (bytes) {
return Array.prototype.map.call(bytes, function (n) {
return (n < 16 ? '0' : '') + n.toString(16)
}).join('')
}

// Converts any value in [0...2^32-1] to an 8-character hex string
function uint32ToHex (val) {
return (0x100000000 + val).toString(16).substring(1)
}

// For debugging: prints out hash state in the same format as the RFC
// sample computation exactly, so that you can diff
function debugPrint (label, arr, size) {
var msg = '\n' + label + ' = ';
for (var i = 0; i < arr.length; i += 2) {
if (size === 32) {
msg += uint32ToHex(arr[i]).toUpperCase();
msg += ' ';
msg += uint32ToHex(arr[i + 1]).toUpperCase();
} else if (size === 64) {
msg += uint32ToHex(arr[i + 1]).toUpperCase();
msg += uint32ToHex(arr[i]).toUpperCase();
} else throw new Error('Invalid size ' + size)
if (i % 6 === 4) {
msg += '\n' + new Array(label.length + 4).join(' ');
} else if (i < arr.length - 2) {
msg += ' ';
}
}
console.log(msg);
}

// For performance testing: generates N bytes of input, hashes M times
// Measures and prints MB/second hash performance each time
function testSpeed (hashFn, N, M) {
var startMs = new Date().getTime();

var input = new Uint8Array(N);
for (var i = 0; i < N; i++) {
input[i] = i % 256;
}
var genMs = new Date().getTime();
console.log('Generated random input in ' + (genMs - startMs) + 'ms');
startMs = genMs;

for (i = 0; i < M; i++) {
var hashHex = hashFn(input);
var hashMs = new Date().getTime();
var ms = hashMs - startMs;
startMs = hashMs;
console.log('Hashed in ' + ms + 'ms: ' + hashHex.substring(0, 20) + '...');
console.log(Math.round(N / (1 << 20) / (ms / 1000) * 100) / 100 + ' MB PER SECOND');
}
}

var util$1 = {
normalizeInput: normalizeInput,
toHex: toHex,
debugPrint: debugPrint,
testSpeed: testSpeed
};

// Blake2B in pure Javascript
// Adapted from the reference implementation in RFC7693
// Ported to Javascript by DC - https://github.com/dcposch



// 64-bit unsigned addition
// Sets v[a,a+1] += v[b,b+1]
// v should be a Uint32Array
function ADD64AA (v, a, b) {
var o0 = v[a] + v[b];
var o1 = v[a + 1] + v[b + 1];
if (o0 >= 0x100000000) {
o1++;
}
v[a] = o0;
v[a + 1] = o1;
}

// 64-bit unsigned addition
// Sets v[a,a+1] += b
// b0 is the low 32 bits of b, b1 represents the high 32 bits
function ADD64AC (v, a, b0, b1) {
var o0 = v[a] + b0;
if (b0 < 0) {
o0 += 0x100000000;
}
var o1 = v[a + 1] + b1;
if (o0 >= 0x100000000) {
o1++;
}
v[a] = o0;
v[a + 1] = o1;
}

// Little-endian byte access
function B2B_GET32 (arr, i) {
return (arr[i] ^
(arr[i + 1] << 8) ^
(arr[i + 2] << 16) ^
(arr[i + 3] << 24))
}

// G Mixing function
// The ROTRs are inlined for speed
function B2B_G (a, b, c, d, ix, iy) {
var x0 = m[ix];
var x1 = m[ix + 1];
var y0 = m[iy];
var y1 = m[iy + 1];

ADD64AA(v, a, b); // v[a,a+1] += v[b,b+1] ... in JS we must store a uint64 as two uint32s
ADD64AC(v, a, x0, x1); // v[a, a+1] += x ... x0 is the low 32 bits of x, x1 is the high 32 bits

// v[d,d+1] = (v[d,d+1] xor v[a,a+1]) rotated to the right by 32 bits
var xor0 = v[d] ^ v[a];
var xor1 = v[d + 1] ^ v[a + 1];
v[d] = xor1;
v[d + 1] = xor0;

ADD64AA(v, c, d);

// v[b,b+1] = (v[b,b+1] xor v[c,c+1]) rotated right by 24 bits
xor0 = v[b] ^ v[c];
xor1 = v[b + 1] ^ v[c + 1];
v[b] = (xor0 >>> 24) ^ (xor1 << 8);
v[b + 1] = (xor1 >>> 24) ^ (xor0 << 8);

ADD64AA(v, a, b);
ADD64AC(v, a, y0, y1);

// v[d,d+1] = (v[d,d+1] xor v[a,a+1]) rotated right by 16 bits
xor0 = v[d] ^ v[a];
xor1 = v[d + 1] ^ v[a + 1];
v[d] = (xor0 >>> 16) ^ (xor1 << 16);
v[d + 1] = (xor1 >>> 16) ^ (xor0 << 16);

ADD64AA(v, c, d);

// v[b,b+1] = (v[b,b+1] xor v[c,c+1]) rotated right by 63 bits
xor0 = v[b] ^ v[c];
xor1 = v[b + 1] ^ v[c + 1];
v[b] = (xor1 >>> 31) ^ (xor0 << 1);
v[b + 1] = (xor0 >>> 31) ^ (xor1 << 1);
}

// Initialization Vector
var BLAKE2B_IV32 = new Uint32Array([
0xF3BCC908, 0x6A09E667, 0x84CAA73B, 0xBB67AE85,
0xFE94F82B, 0x3C6EF372, 0x5F1D36F1, 0xA54FF53A,
0xADE682D1, 0x510E527F, 0x2B3E6C1F, 0x9B05688C,
0xFB41BD6B, 0x1F83D9AB, 0x137E2179, 0x5BE0CD19
]);

var SIGMA8 = [
0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3,
11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4,
7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8,
9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13,
2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9,
12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11,
13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10,
6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5,
10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0,
0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3
];

// These are offsets into a uint64 buffer.
// Multiply them all by 2 to make them offsets into a uint32 buffer,
// because this is Javascript and we don't have uint64s
var SIGMA82 = new Uint8Array(SIGMA8.map(function (x) { return x * 2 }));

// Compression function. 'last' flag indicates last block.
// Note we're representing 16 uint64s as 32 uint32s
var v = new Uint32Array(32);
var m = new Uint32Array(32);
function blake2bCompress (ctx, last) {
var i = 0;

// init work variables
for (i = 0; i < 16; i++) {
v[i] = ctx.h[i];
v[i + 16] = BLAKE2B_IV32[i];
}

// low 64 bits of offset
v[24] = v[24] ^ ctx.t;
v[25] = v[25] ^ (ctx.t / 0x100000000);
// high 64 bits not supported, offset may not be higher than 2**53-1

// last block flag set ?
if (last) {
v[28] = ~v[28];
v[29] = ~v[29];
}

// get little-endian words
for (i = 0; i < 32; i++) {
m[i] = B2B_GET32(ctx.b, 4 * i);
}

// twelve rounds of mixing
// uncomment the DebugPrint calls to log the computation
// and match the RFC sample documentation
// util.debugPrint('          m[16]', m, 64)
for (i = 0; i < 12; i++) {
// util.debugPrint('   (i=' + (i < 10 ? ' ' : '') + i + ') v[16]', v, 64)
B2B_G(0, 8, 16, 24, SIGMA82[i * 16 + 0], SIGMA82[i * 16 + 1]);
B2B_G(2, 10, 18, 26, SIGMA82[i * 16 + 2], SIGMA82[i * 16 + 3]);
B2B_G(4, 12, 20, 28, SIGMA82[i * 16 + 4], SIGMA82[i * 16 + 5]);
B2B_G(6, 14, 22, 30, SIGMA82[i * 16 + 6], SIGMA82[i * 16 + 7]);
B2B_G(0, 10, 20, 30, SIGMA82[i * 16 + 8], SIGMA82[i * 16 + 9]);
B2B_G(2, 12, 22, 24, SIGMA82[i * 16 + 10], SIGMA82[i * 16 + 11]);
B2B_G(4, 14, 16, 26, SIGMA82[i * 16 + 12], SIGMA82[i * 16 + 13]);
B2B_G(6, 8, 18, 28, SIGMA82[i * 16 + 14], SIGMA82[i * 16 + 15]);
}
// util.debugPrint('   (i=12) v[16]', v, 64)

for (i = 0; i < 16; i++) {
ctx.h[i] = ctx.h[i] ^ v[i] ^ v[i + 16];
}
// util.debugPrint('h[8]', ctx.h, 64)
}

// Creates a BLAKE2b hashing context
// Requires an output length between 1 and 64 bytes
// Takes an optional Uint8Array key
function blake2bInit (outlen, key) {
if (outlen === 0 || outlen > 64) {
throw new Error('Illegal output length, expected 0 < length <= 64')
}
if (key && key.length > 64) {
throw new Error('Illegal key, expected Uint8Array with 0 < length <= 64')
}

// state, 'param block'
var ctx = {
b: new Uint8Array(128),
h: new Uint32Array(16),
t: 0, // input count
c: 0, // pointer within buffer
outlen: outlen // output length in bytes
};

// initialize hash state
for (var i = 0; i < 16; i++) {
ctx.h[i] = BLAKE2B_IV32[i];
}
var keylen = key ? key.length : 0;
ctx.h[0] ^= 0x01010000 ^ (keylen << 8) ^ outlen;

// key the hash, if applicable
if (key) {
blake2bUpdate(ctx, key);
// at the end
ctx.c = 128;
}

return ctx
}

// Updates a BLAKE2b streaming hash
// Requires hash context and Uint8Array (byte array)
function blake2bUpdate (ctx, input) {
for (var i = 0; i < input.length; i++) {
if (ctx.c === 128) { // buffer full ?
ctx.t += ctx.c; // add counters
blake2bCompress(ctx, false); // compress (not last)
ctx.c = 0; // counter to zero
}
ctx.b[ctx.c++] = input[i];
}
}

// Completes a BLAKE2b streaming hash
// Returns a Uint8Array containing the message digest
function blake2bFinal (ctx) {
ctx.t += ctx.c; // mark last block offset

while (ctx.c < 128) { // fill up with zeros
ctx.b[ctx.c++] = 0;
}
blake2bCompress(ctx, true); // final block flag = 1

// little endian convert and store
var out = new Uint8Array(ctx.outlen);
for (var i = 0; i < ctx.outlen; i++) {
out[i] = ctx.h[i >> 2] >> (8 * (i & 3));
}
return out
}

// Computes the BLAKE2B hash of a string or byte array, and returns a Uint8Array
//
// Returns a n-byte Uint8Array
//
// Parameters:
// - input - the input bytes, as a string, Buffer or Uint8Array
// - key - optional key Uint8Array, up to 64 bytes
// - outlen - optional output length in bytes, default 64
function blake2b (input, key, outlen) {
// preprocess inputs
outlen = outlen || 64;
input = util$1.normalizeInput(input);

// do the math
var ctx = blake2bInit(outlen, key);
blake2bUpdate(ctx, input);
return blake2bFinal(ctx)
}

// Computes the BLAKE2B hash of a string or byte array
//
// Returns an n-byte hash in hex, all lowercase
//
// Parameters:
// - input - the input bytes, as a string, Buffer, or Uint8Array
// - key - optional key Uint8Array, up to 64 bytes
// - outlen - optional output length in bytes, default 64
function blake2bHex (input, key, outlen) {
var output = blake2b(input, key, outlen);
return util$1.toHex(output)
}

var blake2b_1 = {
blake2b: blake2b,
blake2bHex: blake2bHex,
blake2bInit: blake2bInit,
blake2bUpdate: blake2bUpdate,
blake2bFinal: blake2bFinal
};

// BLAKE2s hash function in pure Javascript
// Adapted from the reference implementation in RFC7693
// Ported to Javascript by DC - https://github.com/dcposch



// Little-endian byte access.
// Expects a Uint8Array and an index
// Returns the little-endian uint32 at v[i..i+3]
function B2S_GET32 (v, i) {
return v[i] ^ (v[i + 1] << 8) ^ (v[i + 2] << 16) ^ (v[i + 3] << 24)
}

// Mixing function G.
function B2S_G (a, b, c, d, x, y) {
v$1[a] = v$1[a] + v$1[b] + x;
v$1[d] = ROTR32(v$1[d] ^ v$1[a], 16);
v$1[c] = v$1[c] + v$1[d];
v$1[b] = ROTR32(v$1[b] ^ v$1[c], 12);
v$1[a] = v$1[a] + v$1[b] + y;
v$1[d] = ROTR32(v$1[d] ^ v$1[a], 8);
v$1[c] = v$1[c] + v$1[d];
v$1[b] = ROTR32(v$1[b] ^ v$1[c], 7);
}

// 32-bit right rotation
// x should be a uint32
// y must be between 1 and 31, inclusive
function ROTR32 (x, y) {
return (x >>> y) ^ (x << (32 - y))
}

// Initialization Vector.
var BLAKE2S_IV = new Uint32Array([
0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19]);

var SIGMA = new Uint8Array([
0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3,
11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4,
7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8,
9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13,
2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9,
12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11,
13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10,
6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5,
10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0]);

// Compression function. "last" flag indicates last block
var v$1 = new Uint32Array(16);
var m$1 = new Uint32Array(16);
function blake2sCompress (ctx, last) {
var i = 0;
for (i = 0; i < 8; i++) { // init work variables
v$1[i] = ctx.h[i];
v$1[i + 8] = BLAKE2S_IV[i];
}

v$1[12] ^= ctx.t; // low 32 bits of offset
v$1[13] ^= (ctx.t / 0x100000000); // high 32 bits
if (last) { // last block flag set ?
v$1[14] = ~v$1[14];
}

for (i = 0; i < 16; i++) { // get little-endian words
m$1[i] = B2S_GET32(ctx.b, 4 * i);
}

// ten rounds of mixing
// uncomment the DebugPrint calls to log the computation
// and match the RFC sample documentation
// util.debugPrint('          m[16]', m, 32)
for (i = 0; i < 10; i++) {
// util.debugPrint('   (i=' + i + ')  v[16]', v, 32)
B2S_G(0, 4, 8, 12, m$1[SIGMA[i * 16 + 0]], m$1[SIGMA[i * 16 + 1]]);
B2S_G(1, 5, 9, 13, m$1[SIGMA[i * 16 + 2]], m$1[SIGMA[i * 16 + 3]]);
B2S_G(2, 6, 10, 14, m$1[SIGMA[i * 16 + 4]], m$1[SIGMA[i * 16 + 5]]);
B2S_G(3, 7, 11, 15, m$1[SIGMA[i * 16 + 6]], m$1[SIGMA[i * 16 + 7]]);
B2S_G(0, 5, 10, 15, m$1[SIGMA[i * 16 + 8]], m$1[SIGMA[i * 16 + 9]]);
B2S_G(1, 6, 11, 12, m$1[SIGMA[i * 16 + 10]], m$1[SIGMA[i * 16 + 11]]);
B2S_G(2, 7, 8, 13, m$1[SIGMA[i * 16 + 12]], m$1[SIGMA[i * 16 + 13]]);
B2S_G(3, 4, 9, 14, m$1[SIGMA[i * 16 + 14]], m$1[SIGMA[i * 16 + 15]]);
}
// util.debugPrint('   (i=10) v[16]', v, 32)

for (i = 0; i < 8; i++) {
ctx.h[i] ^= v$1[i] ^ v$1[i + 8];
}
// util.debugPrint('h[8]', ctx.h, 32)
}

// Creates a BLAKE2s hashing context
// Requires an output length between 1 and 32 bytes
// Takes an optional Uint8Array key
function blake2sInit (outlen, key) {
if (!(outlen > 0 && outlen <= 32)) {
throw new Error('Incorrect output length, should be in [1, 32]')
}
var keylen = key ? key.length : 0;
if (key && !(keylen > 0 && keylen <= 32)) {
throw new Error('Incorrect key length, should be in [1, 32]')
}

var ctx = {
h: new Uint32Array(BLAKE2S_IV), // hash state
b: new Uint32Array(64), // input block
c: 0, // pointer within block
t: 0, // input count
outlen: outlen // output length in bytes
};
ctx.h[0] ^= 0x01010000 ^ (keylen << 8) ^ outlen;

if (keylen > 0) {
blake2sUpdate(ctx, key);
ctx.c = 64; // at the end
}

return ctx
}

// Updates a BLAKE2s streaming hash
// Requires hash context and Uint8Array (byte array)
function blake2sUpdate (ctx, input) {
for (var i = 0; i < input.length; i++) {
if (ctx.c === 64) { // buffer full ?
ctx.t += ctx.c; // add counters
blake2sCompress(ctx, false); // compress (not last)
ctx.c = 0; // counter to zero
}
ctx.b[ctx.c++] = input[i];
}
}

// Completes a BLAKE2s streaming hash
// Returns a Uint8Array containing the message digest
function blake2sFinal (ctx) {
ctx.t += ctx.c; // mark last block offset
while (ctx.c < 64) { // fill up with zeros
ctx.b[ctx.c++] = 0;
}
blake2sCompress(ctx, true); // final block flag = 1

// little endian convert and store
var out = new Uint8Array(ctx.outlen);
for (var i = 0; i < ctx.outlen; i++) {
out[i] = (ctx.h[i >> 2] >> (8 * (i & 3))) & 0xFF;
}
return out
}

// Computes the BLAKE2S hash of a string or byte array, and returns a Uint8Array
//
// Returns a n-byte Uint8Array
//
// Parameters:
// - input - the input bytes, as a string, Buffer, or Uint8Array
// - key - optional key Uint8Array, up to 32 bytes
// - outlen - optional output length in bytes, default 64
function blake2s (input, key, outlen) {
// preprocess inputs
outlen = outlen || 32;
input = util$1.normalizeInput(input);

// do the math
var ctx = blake2sInit(outlen, key);
blake2sUpdate(ctx, input);
return blake2sFinal(ctx)
}

// Computes the BLAKE2S hash of a string or byte array
//
// Returns an n-byte hash in hex, all lowercase
//
// Parameters:
// - input - the input bytes, as a string, Buffer, or Uint8Array
// - key - optional key Uint8Array, up to 32 bytes
// - outlen - optional output length in bytes, default 64
function blake2sHex (input, key, outlen) {
var output = blake2s(input, key, outlen);
return util$1.toHex(output)
}

var blake2s_1 = {
blake2s: blake2s,
blake2sHex: blake2sHex,
blake2sInit: blake2sInit,
blake2sUpdate: blake2sUpdate,
blake2sFinal: blake2sFinal
};

var blakejs = {
blake2b: blake2b_1.blake2b,
blake2bHex: blake2b_1.blake2bHex,
blake2bInit: blake2b_1.blake2bInit,
blake2bUpdate: blake2b_1.blake2bUpdate,
blake2bFinal: blake2b_1.blake2bFinal,
blake2s: blake2s_1.blake2s,
blake2sHex: blake2s_1.blake2sHex,
blake2sInit: blake2s_1.blake2sInit,
blake2sUpdate: blake2s_1.blake2sUpdate,
blake2sFinal: blake2s_1.blake2sFinal
};

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */

var safeBuffer = createCommonjsModule(function (module, exports) {
/* eslint-disable node/no-deprecated-api */

var Buffer = buffer__default['default'].Buffer;

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
for (var key in src) {
dst[key] = src[key];
}
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
module.exports = buffer__default['default'];
} else {
// Copy properties from require('buffer')
copyProps(buffer__default['default'], exports);
exports.Buffer = SafeBuffer;
}

function SafeBuffer (arg, encodingOrOffset, length) {
return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.prototype = Object.create(Buffer.prototype);

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer);

SafeBuffer.from = function (arg, encodingOrOffset, length) {
if (typeof arg === 'number') {
throw new TypeError('Argument must not be a number')
}
return Buffer(arg, encodingOrOffset, length)
};

SafeBuffer.alloc = function (size, fill, encoding) {
if (typeof size !== 'number') {
throw new TypeError('Argument must be a number')
}
var buf = Buffer(size);
if (fill !== undefined) {
if (typeof encoding === 'string') {
buf.fill(fill, encoding);
} else {
buf.fill(fill);
}
} else {
buf.fill(0);
}
return buf
};

SafeBuffer.allocUnsafe = function (size) {
if (typeof size !== 'number') {
throw new TypeError('Argument must be a number')
}
return Buffer(size)
};

SafeBuffer.allocUnsafeSlow = function (size) {
if (typeof size !== 'number') {
throw new TypeError('Argument must be a number')
}
return buffer__default['default'].SlowBuffer(size)
};
});

// base-x encoding / decoding
// Copyright (c) 2018 base-x contributors
// Copyright (c) 2014-2018 The Bitcoin Core developers (base58.cpp)
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
// @ts-ignore
var _Buffer = safeBuffer.Buffer;
function base (ALPHABET) {
if (ALPHABET.length >= 255) { throw new TypeError('Alphabet too long') }
var BASE_MAP = new Uint8Array(256);
for (var j = 0; j < BASE_MAP.length; j++) {
BASE_MAP[j] = 255;
}
for (var i = 0; i < ALPHABET.length; i++) {
var x = ALPHABET.charAt(i);
var xc = x.charCodeAt(0);
if (BASE_MAP[xc] !== 255) { throw new TypeError(x + ' is ambiguous') }
BASE_MAP[xc] = i;
}
var BASE = ALPHABET.length;
var LEADER = ALPHABET.charAt(0);
var FACTOR = Math.log(BASE) / Math.log(256); // log(BASE) / log(256), rounded up
var iFACTOR = Math.log(256) / Math.log(BASE); // log(256) / log(BASE), rounded up
function encode (source) {
if (Array.isArray(source) || source instanceof Uint8Array) { source = _Buffer.from(source); }
if (!_Buffer.isBuffer(source)) { throw new TypeError('Expected Buffer') }
if (source.length === 0) { return '' }
  // Skip & count leading zeroes.
var zeroes = 0;
var length = 0;
var pbegin = 0;
var pend = source.length;
while (pbegin !== pend && source[pbegin] === 0) {
pbegin++;
zeroes++;
}
  // Allocate enough space in big-endian base58 representation.
var size = ((pend - pbegin) * iFACTOR + 1) >>> 0;
var b58 = new Uint8Array(size);
  // Process the bytes.
while (pbegin !== pend) {
var carry = source[pbegin];
      // Apply "b58 = b58 * 256 + ch".
var i = 0;
for (var it1 = size - 1; (carry !== 0 || i < length) && (it1 !== -1); it1--, i++) {
  carry += (256 * b58[it1]) >>> 0;
  b58[it1] = (carry % BASE) >>> 0;
  carry = (carry / BASE) >>> 0;
}
if (carry !== 0) { throw new Error('Non-zero carry') }
length = i;
pbegin++;
}
  // Skip leading zeroes in base58 result.
var it2 = size - length;
while (it2 !== size && b58[it2] === 0) {
it2++;
}
  // Translate the result into a string.
var str = LEADER.repeat(zeroes);
for (; it2 < size; ++it2) { str += ALPHABET.charAt(b58[it2]); }
return str
}
function decodeUnsafe (source) {
if (typeof source !== 'string') { throw new TypeError('Expected String') }
if (source.length === 0) { return _Buffer.alloc(0) }
var psz = 0;
  // Skip leading spaces.
if (source[psz] === ' ') { return }
  // Skip and count leading '1's.
var zeroes = 0;
var length = 0;
while (source[psz] === LEADER) {
zeroes++;
psz++;
}
  // Allocate enough space in big-endian base256 representation.
var size = (((source.length - psz) * FACTOR) + 1) >>> 0; // log(58) / log(256), rounded up.
var b256 = new Uint8Array(size);
  // Process the characters.
while (source[psz]) {
      // Decode character
var carry = BASE_MAP[source.charCodeAt(psz)];
      // Invalid character
if (carry === 255) { return }
var i = 0;
for (var it3 = size - 1; (carry !== 0 || i < length) && (it3 !== -1); it3--, i++) {
  carry += (BASE * b256[it3]) >>> 0;
  b256[it3] = (carry % 256) >>> 0;
  carry = (carry / 256) >>> 0;
}
if (carry !== 0) { throw new Error('Non-zero carry') }
length = i;
psz++;
}
  // Skip trailing spaces.
if (source[psz] === ' ') { return }
  // Skip leading zeroes in b256.
var it4 = size - length;
while (it4 !== size && b256[it4] === 0) {
it4++;
}
var vch = _Buffer.allocUnsafe(zeroes + (size - it4));
vch.fill(0x00, 0, zeroes);
var j = zeroes;
while (it4 !== size) {
vch[j++] = b256[it4++];
}
return vch
}
function decode (string) {
var buffer = decodeUnsafe(string);
if (buffer) { return buffer }
throw new Error('Non-base' + BASE + ' character')
}
return {
encode: encode,
decodeUnsafe: decodeUnsafe,
decode: decode
}
}
var src = base;

var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

var bs58 = src(ALPHABET);

/* eslint quote-props: off */

var names = Object.freeze({
'identity':   0x0,
'sha1':       0x11,
'sha2-256':   0x12,
'sha2-512':   0x13,
'dbl-sha2-256': 0x56,
'sha3-224':   0x17,
'sha3-256':   0x16,
'sha3-384':   0x15,
'sha3-512':   0x14,
'shake-128':  0x18,
'shake-256':  0x19,
'keccak-224': 0x1A,
'keccak-256': 0x1B,
'keccak-384': 0x1C,
'keccak-512': 0x1D,
'murmur3-128': 0x22,
'murmur3-32':  0x23,
'blake2b-8':   0xb201,
'blake2b-16':  0xb202,
'blake2b-24':  0xb203,
'blake2b-32':  0xb204,
'blake2b-40':  0xb205,
'blake2b-48':  0xb206,
'blake2b-56':  0xb207,
'blake2b-64':  0xb208,
'blake2b-72':  0xb209,
'blake2b-80':  0xb20a,
'blake2b-88':  0xb20b,
'blake2b-96':  0xb20c,
'blake2b-104': 0xb20d,
'blake2b-112': 0xb20e,
'blake2b-120': 0xb20f,
'blake2b-128': 0xb210,
'blake2b-136': 0xb211,
'blake2b-144': 0xb212,
'blake2b-152': 0xb213,
'blake2b-160': 0xb214,
'blake2b-168': 0xb215,
'blake2b-176': 0xb216,
'blake2b-184': 0xb217,
'blake2b-192': 0xb218,
'blake2b-200': 0xb219,
'blake2b-208': 0xb21a,
'blake2b-216': 0xb21b,
'blake2b-224': 0xb21c,
'blake2b-232': 0xb21d,
'blake2b-240': 0xb21e,
'blake2b-248': 0xb21f,
'blake2b-256': 0xb220,
'blake2b-264': 0xb221,
'blake2b-272': 0xb222,
'blake2b-280': 0xb223,
'blake2b-288': 0xb224,
'blake2b-296': 0xb225,
'blake2b-304': 0xb226,
'blake2b-312': 0xb227,
'blake2b-320': 0xb228,
'blake2b-328': 0xb229,
'blake2b-336': 0xb22a,
'blake2b-344': 0xb22b,
'blake2b-352': 0xb22c,
'blake2b-360': 0xb22d,
'blake2b-368': 0xb22e,
'blake2b-376': 0xb22f,
'blake2b-384': 0xb230,
'blake2b-392': 0xb231,
'blake2b-400': 0xb232,
'blake2b-408': 0xb233,
'blake2b-416': 0xb234,
'blake2b-424': 0xb235,
'blake2b-432': 0xb236,
'blake2b-440': 0xb237,
'blake2b-448': 0xb238,
'blake2b-456': 0xb239,
'blake2b-464': 0xb23a,
'blake2b-472': 0xb23b,
'blake2b-480': 0xb23c,
'blake2b-488': 0xb23d,
'blake2b-496': 0xb23e,
'blake2b-504': 0xb23f,
'blake2b-512': 0xb240,
'blake2s-8':   0xb241,
'blake2s-16':  0xb242,
'blake2s-24':  0xb243,
'blake2s-32':  0xb244,
'blake2s-40':  0xb245,
'blake2s-48':  0xb246,
'blake2s-56':  0xb247,
'blake2s-64':  0xb248,
'blake2s-72':  0xb249,
'blake2s-80':  0xb24a,
'blake2s-88':  0xb24b,
'blake2s-96':  0xb24c,
'blake2s-104': 0xb24d,
'blake2s-112': 0xb24e,
'blake2s-120': 0xb24f,
'blake2s-128': 0xb250,
'blake2s-136': 0xb251,
'blake2s-144': 0xb252,
'blake2s-152': 0xb253,
'blake2s-160': 0xb254,
'blake2s-168': 0xb255,
'blake2s-176': 0xb256,
'blake2s-184': 0xb257,
'blake2s-192': 0xb258,
'blake2s-200': 0xb259,
'blake2s-208': 0xb25a,
'blake2s-216': 0xb25b,
'blake2s-224': 0xb25c,
'blake2s-232': 0xb25d,
'blake2s-240': 0xb25e,
'blake2s-248': 0xb25f,
'blake2s-256': 0xb260,
'Skein256-8': 0xb301,
'Skein256-16': 0xb302,
'Skein256-24': 0xb303,
'Skein256-32': 0xb304,
'Skein256-40': 0xb305,
'Skein256-48': 0xb306,
'Skein256-56': 0xb307,
'Skein256-64': 0xb308,
'Skein256-72': 0xb309,
'Skein256-80': 0xb30a,
'Skein256-88': 0xb30b,
'Skein256-96': 0xb30c,
'Skein256-104': 0xb30d,
'Skein256-112': 0xb30e,
'Skein256-120': 0xb30f,
'Skein256-128': 0xb310,
'Skein256-136': 0xb311,
'Skein256-144': 0xb312,
'Skein256-152': 0xb313,
'Skein256-160': 0xb314,
'Skein256-168': 0xb315,
'Skein256-176': 0xb316,
'Skein256-184': 0xb317,
'Skein256-192': 0xb318,
'Skein256-200': 0xb319,
'Skein256-208': 0xb31a,
'Skein256-216': 0xb31b,
'Skein256-224': 0xb31c,
'Skein256-232': 0xb31d,
'Skein256-240': 0xb31e,
'Skein256-248': 0xb31f,
'Skein256-256': 0xb320,
'Skein512-8': 0xb321,
'Skein512-16': 0xb322,
'Skein512-24': 0xb323,
'Skein512-32': 0xb324,
'Skein512-40': 0xb325,
'Skein512-48': 0xb326,
'Skein512-56': 0xb327,
'Skein512-64': 0xb328,
'Skein512-72': 0xb329,
'Skein512-80': 0xb32a,
'Skein512-88': 0xb32b,
'Skein512-96': 0xb32c,
'Skein512-104': 0xb32d,
'Skein512-112': 0xb32e,
'Skein512-120': 0xb32f,
'Skein512-128': 0xb330,
'Skein512-136': 0xb331,
'Skein512-144': 0xb332,
'Skein512-152': 0xb333,
'Skein512-160': 0xb334,
'Skein512-168': 0xb335,
'Skein512-176': 0xb336,
'Skein512-184': 0xb337,
'Skein512-192': 0xb338,
'Skein512-200': 0xb339,
'Skein512-208': 0xb33a,
'Skein512-216': 0xb33b,
'Skein512-224': 0xb33c,
'Skein512-232': 0xb33d,
'Skein512-240': 0xb33e,
'Skein512-248': 0xb33f,
'Skein512-256': 0xb340,
'Skein512-264': 0xb341,
'Skein512-272': 0xb342,
'Skein512-280': 0xb343,
'Skein512-288': 0xb344,
'Skein512-296': 0xb345,
'Skein512-304': 0xb346,
'Skein512-312': 0xb347,
'Skein512-320': 0xb348,
'Skein512-328': 0xb349,
'Skein512-336': 0xb34a,
'Skein512-344': 0xb34b,
'Skein512-352': 0xb34c,
'Skein512-360': 0xb34d,
'Skein512-368': 0xb34e,
'Skein512-376': 0xb34f,
'Skein512-384': 0xb350,
'Skein512-392': 0xb351,
'Skein512-400': 0xb352,
'Skein512-408': 0xb353,
'Skein512-416': 0xb354,
'Skein512-424': 0xb355,
'Skein512-432': 0xb356,
'Skein512-440': 0xb357,
'Skein512-448': 0xb358,
'Skein512-456': 0xb359,
'Skein512-464': 0xb35a,
'Skein512-472': 0xb35b,
'Skein512-480': 0xb35c,
'Skein512-488': 0xb35d,
'Skein512-496': 0xb35e,
'Skein512-504': 0xb35f,
'Skein512-512': 0xb360,
'Skein1024-8': 0xb361,
'Skein1024-16': 0xb362,
'Skein1024-24': 0xb363,
'Skein1024-32': 0xb364,
'Skein1024-40': 0xb365,
'Skein1024-48': 0xb366,
'Skein1024-56': 0xb367,
'Skein1024-64': 0xb368,
'Skein1024-72': 0xb369,
'Skein1024-80': 0xb36a,
'Skein1024-88': 0xb36b,
'Skein1024-96': 0xb36c,
'Skein1024-104': 0xb36d,
'Skein1024-112': 0xb36e,
'Skein1024-120': 0xb36f,
'Skein1024-128': 0xb370,
'Skein1024-136': 0xb371,
'Skein1024-144': 0xb372,
'Skein1024-152': 0xb373,
'Skein1024-160': 0xb374,
'Skein1024-168': 0xb375,
'Skein1024-176': 0xb376,
'Skein1024-184': 0xb377,
'Skein1024-192': 0xb378,
'Skein1024-200': 0xb379,
'Skein1024-208': 0xb37a,
'Skein1024-216': 0xb37b,
'Skein1024-224': 0xb37c,
'Skein1024-232': 0xb37d,
'Skein1024-240': 0xb37e,
'Skein1024-248': 0xb37f,
'Skein1024-256': 0xb380,
'Skein1024-264': 0xb381,
'Skein1024-272': 0xb382,
'Skein1024-280': 0xb383,
'Skein1024-288': 0xb384,
'Skein1024-296': 0xb385,
'Skein1024-304': 0xb386,
'Skein1024-312': 0xb387,
'Skein1024-320': 0xb388,
'Skein1024-328': 0xb389,
'Skein1024-336': 0xb38a,
'Skein1024-344': 0xb38b,
'Skein1024-352': 0xb38c,
'Skein1024-360': 0xb38d,
'Skein1024-368': 0xb38e,
'Skein1024-376': 0xb38f,
'Skein1024-384': 0xb390,
'Skein1024-392': 0xb391,
'Skein1024-400': 0xb392,
'Skein1024-408': 0xb393,
'Skein1024-416': 0xb394,
'Skein1024-424': 0xb395,
'Skein1024-432': 0xb396,
'Skein1024-440': 0xb397,
'Skein1024-448': 0xb398,
'Skein1024-456': 0xb399,
'Skein1024-464': 0xb39a,
'Skein1024-472': 0xb39b,
'Skein1024-480': 0xb39c,
'Skein1024-488': 0xb39d,
'Skein1024-496': 0xb39e,
'Skein1024-504': 0xb39f,
'Skein1024-512': 0xb3a0,
'Skein1024-520': 0xb3a1,
'Skein1024-528': 0xb3a2,
'Skein1024-536': 0xb3a3,
'Skein1024-544': 0xb3a4,
'Skein1024-552': 0xb3a5,
'Skein1024-560': 0xb3a6,
'Skein1024-568': 0xb3a7,
'Skein1024-576': 0xb3a8,
'Skein1024-584': 0xb3a9,
'Skein1024-592': 0xb3aa,
'Skein1024-600': 0xb3ab,
'Skein1024-608': 0xb3ac,
'Skein1024-616': 0xb3ad,
'Skein1024-624': 0xb3ae,
'Skein1024-632': 0xb3af,
'Skein1024-640': 0xb3b0,
'Skein1024-648': 0xb3b1,
'Skein1024-656': 0xb3b2,
'Skein1024-664': 0xb3b3,
'Skein1024-672': 0xb3b4,
'Skein1024-680': 0xb3b5,
'Skein1024-688': 0xb3b6,
'Skein1024-696': 0xb3b7,
'Skein1024-704': 0xb3b8,
'Skein1024-712': 0xb3b9,
'Skein1024-720': 0xb3ba,
'Skein1024-728': 0xb3bb,
'Skein1024-736': 0xb3bc,
'Skein1024-744': 0xb3bd,
'Skein1024-752': 0xb3be,
'Skein1024-760': 0xb3bf,
'Skein1024-768': 0xb3c0,
'Skein1024-776': 0xb3c1,
'Skein1024-784': 0xb3c2,
'Skein1024-792': 0xb3c3,
'Skein1024-800': 0xb3c4,
'Skein1024-808': 0xb3c5,
'Skein1024-816': 0xb3c6,
'Skein1024-824': 0xb3c7,
'Skein1024-832': 0xb3c8,
'Skein1024-840': 0xb3c9,
'Skein1024-848': 0xb3ca,
'Skein1024-856': 0xb3cb,
'Skein1024-864': 0xb3cc,
'Skein1024-872': 0xb3cd,
'Skein1024-880': 0xb3ce,
'Skein1024-888': 0xb3cf,
'Skein1024-896': 0xb3d0,
'Skein1024-904': 0xb3d1,
'Skein1024-912': 0xb3d2,
'Skein1024-920': 0xb3d3,
'Skein1024-928': 0xb3d4,
'Skein1024-936': 0xb3d5,
'Skein1024-944': 0xb3d6,
'Skein1024-952': 0xb3d7,
'Skein1024-960': 0xb3d8,
'Skein1024-968': 0xb3d9,
'Skein1024-976': 0xb3da,
'Skein1024-984': 0xb3db,
'Skein1024-992': 0xb3dc,
'Skein1024-1000': 0xb3dd,
'Skein1024-1008': 0xb3de,
'Skein1024-1016': 0xb3df,
'Skein1024-1024': 0xb3e0
});

var codes = Object.freeze({
0x0: 'identity',

// sha family
0x11: 'sha1',
0x12: 'sha2-256',
0x13: 'sha2-512',
0x56: 'dbl-sha2-256',
0x17: 'sha3-224',
0x16: 'sha3-256',
0x15: 'sha3-384',
0x14: 'sha3-512',
0x18: 'shake-128',
0x19: 'shake-256',
0x1A: 'keccak-224',
0x1B: 'keccak-256',
0x1C: 'keccak-384',
0x1D: 'keccak-512',

0x22: 'murmur3-128',
0x23: 'murmur3-32',

// blake2
0xb201: 'blake2b-8',
0xb202: 'blake2b-16',
0xb203: 'blake2b-24',
0xb204: 'blake2b-32',
0xb205: 'blake2b-40',
0xb206: 'blake2b-48',
0xb207: 'blake2b-56',
0xb208: 'blake2b-64',
0xb209: 'blake2b-72',
0xb20a: 'blake2b-80',
0xb20b: 'blake2b-88',
0xb20c: 'blake2b-96',
0xb20d: 'blake2b-104',
0xb20e: 'blake2b-112',
0xb20f: 'blake2b-120',
0xb210: 'blake2b-128',
0xb211: 'blake2b-136',
0xb212: 'blake2b-144',
0xb213: 'blake2b-152',
0xb214: 'blake2b-160',
0xb215: 'blake2b-168',
0xb216: 'blake2b-176',
0xb217: 'blake2b-184',
0xb218: 'blake2b-192',
0xb219: 'blake2b-200',
0xb21a: 'blake2b-208',
0xb21b: 'blake2b-216',
0xb21c: 'blake2b-224',
0xb21d: 'blake2b-232',
0xb21e: 'blake2b-240',
0xb21f: 'blake2b-248',
0xb220: 'blake2b-256',
0xb221: 'blake2b-264',
0xb222: 'blake2b-272',
0xb223: 'blake2b-280',
0xb224: 'blake2b-288',
0xb225: 'blake2b-296',
0xb226: 'blake2b-304',
0xb227: 'blake2b-312',
0xb228: 'blake2b-320',
0xb229: 'blake2b-328',
0xb22a: 'blake2b-336',
0xb22b: 'blake2b-344',
0xb22c: 'blake2b-352',
0xb22d: 'blake2b-360',
0xb22e: 'blake2b-368',
0xb22f: 'blake2b-376',
0xb230: 'blake2b-384',
0xb231: 'blake2b-392',
0xb232: 'blake2b-400',
0xb233: 'blake2b-408',
0xb234: 'blake2b-416',
0xb235: 'blake2b-424',
0xb236: 'blake2b-432',
0xb237: 'blake2b-440',
0xb238: 'blake2b-448',
0xb239: 'blake2b-456',
0xb23a: 'blake2b-464',
0xb23b: 'blake2b-472',
0xb23c: 'blake2b-480',
0xb23d: 'blake2b-488',
0xb23e: 'blake2b-496',
0xb23f: 'blake2b-504',
0xb240: 'blake2b-512',
0xb241: 'blake2s-8',
0xb242: 'blake2s-16',
0xb243: 'blake2s-24',
0xb244: 'blake2s-32',
0xb245: 'blake2s-40',
0xb246: 'blake2s-48',
0xb247: 'blake2s-56',
0xb248: 'blake2s-64',
0xb249: 'blake2s-72',
0xb24a: 'blake2s-80',
0xb24b: 'blake2s-88',
0xb24c: 'blake2s-96',
0xb24d: 'blake2s-104',
0xb24e: 'blake2s-112',
0xb24f: 'blake2s-120',
0xb250: 'blake2s-128',
0xb251: 'blake2s-136',
0xb252: 'blake2s-144',
0xb253: 'blake2s-152',
0xb254: 'blake2s-160',
0xb255: 'blake2s-168',
0xb256: 'blake2s-176',
0xb257: 'blake2s-184',
0xb258: 'blake2s-192',
0xb259: 'blake2s-200',
0xb25a: 'blake2s-208',
0xb25b: 'blake2s-216',
0xb25c: 'blake2s-224',
0xb25d: 'blake2s-232',
0xb25e: 'blake2s-240',
0xb25f: 'blake2s-248',
0xb260: 'blake2s-256',

// skein
0xb301: 'Skein256-8',
0xb302: 'Skein256-16',
0xb303: 'Skein256-24',
0xb304: 'Skein256-32',
0xb305: 'Skein256-40',
0xb306: 'Skein256-48',
0xb307: 'Skein256-56',
0xb308: 'Skein256-64',
0xb309: 'Skein256-72',
0xb30a: 'Skein256-80',
0xb30b: 'Skein256-88',
0xb30c: 'Skein256-96',
0xb30d: 'Skein256-104',
0xb30e: 'Skein256-112',
0xb30f: 'Skein256-120',
0xb310: 'Skein256-128',
0xb311: 'Skein256-136',
0xb312: 'Skein256-144',
0xb313: 'Skein256-152',
0xb314: 'Skein256-160',
0xb315: 'Skein256-168',
0xb316: 'Skein256-176',
0xb317: 'Skein256-184',
0xb318: 'Skein256-192',
0xb319: 'Skein256-200',
0xb31a: 'Skein256-208',
0xb31b: 'Skein256-216',
0xb31c: 'Skein256-224',
0xb31d: 'Skein256-232',
0xb31e: 'Skein256-240',
0xb31f: 'Skein256-248',
0xb320: 'Skein256-256',
0xb321: 'Skein512-8',
0xb322: 'Skein512-16',
0xb323: 'Skein512-24',
0xb324: 'Skein512-32',
0xb325: 'Skein512-40',
0xb326: 'Skein512-48',
0xb327: 'Skein512-56',
0xb328: 'Skein512-64',
0xb329: 'Skein512-72',
0xb32a: 'Skein512-80',
0xb32b: 'Skein512-88',
0xb32c: 'Skein512-96',
0xb32d: 'Skein512-104',
0xb32e: 'Skein512-112',
0xb32f: 'Skein512-120',
0xb330: 'Skein512-128',
0xb331: 'Skein512-136',
0xb332: 'Skein512-144',
0xb333: 'Skein512-152',
0xb334: 'Skein512-160',
0xb335: 'Skein512-168',
0xb336: 'Skein512-176',
0xb337: 'Skein512-184',
0xb338: 'Skein512-192',
0xb339: 'Skein512-200',
0xb33a: 'Skein512-208',
0xb33b: 'Skein512-216',
0xb33c: 'Skein512-224',
0xb33d: 'Skein512-232',
0xb33e: 'Skein512-240',
0xb33f: 'Skein512-248',
0xb340: 'Skein512-256',
0xb341: 'Skein512-264',
0xb342: 'Skein512-272',
0xb343: 'Skein512-280',
0xb344: 'Skein512-288',
0xb345: 'Skein512-296',
0xb346: 'Skein512-304',
0xb347: 'Skein512-312',
0xb348: 'Skein512-320',
0xb349: 'Skein512-328',
0xb34a: 'Skein512-336',
0xb34b: 'Skein512-344',
0xb34c: 'Skein512-352',
0xb34d: 'Skein512-360',
0xb34e: 'Skein512-368',
0xb34f: 'Skein512-376',
0xb350: 'Skein512-384',
0xb351: 'Skein512-392',
0xb352: 'Skein512-400',
0xb353: 'Skein512-408',
0xb354: 'Skein512-416',
0xb355: 'Skein512-424',
0xb356: 'Skein512-432',
0xb357: 'Skein512-440',
0xb358: 'Skein512-448',
0xb359: 'Skein512-456',
0xb35a: 'Skein512-464',
0xb35b: 'Skein512-472',
0xb35c: 'Skein512-480',
0xb35d: 'Skein512-488',
0xb35e: 'Skein512-496',
0xb35f: 'Skein512-504',
0xb360: 'Skein512-512',
0xb361: 'Skein1024-8',
0xb362: 'Skein1024-16',
0xb363: 'Skein1024-24',
0xb364: 'Skein1024-32',
0xb365: 'Skein1024-40',
0xb366: 'Skein1024-48',
0xb367: 'Skein1024-56',
0xb368: 'Skein1024-64',
0xb369: 'Skein1024-72',
0xb36a: 'Skein1024-80',
0xb36b: 'Skein1024-88',
0xb36c: 'Skein1024-96',
0xb36d: 'Skein1024-104',
0xb36e: 'Skein1024-112',
0xb36f: 'Skein1024-120',
0xb370: 'Skein1024-128',
0xb371: 'Skein1024-136',
0xb372: 'Skein1024-144',
0xb373: 'Skein1024-152',
0xb374: 'Skein1024-160',
0xb375: 'Skein1024-168',
0xb376: 'Skein1024-176',
0xb377: 'Skein1024-184',
0xb378: 'Skein1024-192',
0xb379: 'Skein1024-200',
0xb37a: 'Skein1024-208',
0xb37b: 'Skein1024-216',
0xb37c: 'Skein1024-224',
0xb37d: 'Skein1024-232',
0xb37e: 'Skein1024-240',
0xb37f: 'Skein1024-248',
0xb380: 'Skein1024-256',
0xb381: 'Skein1024-264',
0xb382: 'Skein1024-272',
0xb383: 'Skein1024-280',
0xb384: 'Skein1024-288',
0xb385: 'Skein1024-296',
0xb386: 'Skein1024-304',
0xb387: 'Skein1024-312',
0xb388: 'Skein1024-320',
0xb389: 'Skein1024-328',
0xb38a: 'Skein1024-336',
0xb38b: 'Skein1024-344',
0xb38c: 'Skein1024-352',
0xb38d: 'Skein1024-360',
0xb38e: 'Skein1024-368',
0xb38f: 'Skein1024-376',
0xb390: 'Skein1024-384',
0xb391: 'Skein1024-392',
0xb392: 'Skein1024-400',
0xb393: 'Skein1024-408',
0xb394: 'Skein1024-416',
0xb395: 'Skein1024-424',
0xb396: 'Skein1024-432',
0xb397: 'Skein1024-440',
0xb398: 'Skein1024-448',
0xb399: 'Skein1024-456',
0xb39a: 'Skein1024-464',
0xb39b: 'Skein1024-472',
0xb39c: 'Skein1024-480',
0xb39d: 'Skein1024-488',
0xb39e: 'Skein1024-496',
0xb39f: 'Skein1024-504',
0xb3a0: 'Skein1024-512',
0xb3a1: 'Skein1024-520',
0xb3a2: 'Skein1024-528',
0xb3a3: 'Skein1024-536',
0xb3a4: 'Skein1024-544',
0xb3a5: 'Skein1024-552',
0xb3a6: 'Skein1024-560',
0xb3a7: 'Skein1024-568',
0xb3a8: 'Skein1024-576',
0xb3a9: 'Skein1024-584',
0xb3aa: 'Skein1024-592',
0xb3ab: 'Skein1024-600',
0xb3ac: 'Skein1024-608',
0xb3ad: 'Skein1024-616',
0xb3ae: 'Skein1024-624',
0xb3af: 'Skein1024-632',
0xb3b0: 'Skein1024-640',
0xb3b1: 'Skein1024-648',
0xb3b2: 'Skein1024-656',
0xb3b3: 'Skein1024-664',
0xb3b4: 'Skein1024-672',
0xb3b5: 'Skein1024-680',
0xb3b6: 'Skein1024-688',
0xb3b7: 'Skein1024-696',
0xb3b8: 'Skein1024-704',
0xb3b9: 'Skein1024-712',
0xb3ba: 'Skein1024-720',
0xb3bb: 'Skein1024-728',
0xb3bc: 'Skein1024-736',
0xb3bd: 'Skein1024-744',
0xb3be: 'Skein1024-752',
0xb3bf: 'Skein1024-760',
0xb3c0: 'Skein1024-768',
0xb3c1: 'Skein1024-776',
0xb3c2: 'Skein1024-784',
0xb3c3: 'Skein1024-792',
0xb3c4: 'Skein1024-800',
0xb3c5: 'Skein1024-808',
0xb3c6: 'Skein1024-816',
0xb3c7: 'Skein1024-824',
0xb3c8: 'Skein1024-832',
0xb3c9: 'Skein1024-840',
0xb3ca: 'Skein1024-848',
0xb3cb: 'Skein1024-856',
0xb3cc: 'Skein1024-864',
0xb3cd: 'Skein1024-872',
0xb3ce: 'Skein1024-880',
0xb3cf: 'Skein1024-888',
0xb3d0: 'Skein1024-896',
0xb3d1: 'Skein1024-904',
0xb3d2: 'Skein1024-912',
0xb3d3: 'Skein1024-920',
0xb3d4: 'Skein1024-928',
0xb3d5: 'Skein1024-936',
0xb3d6: 'Skein1024-944',
0xb3d7: 'Skein1024-952',
0xb3d8: 'Skein1024-960',
0xb3d9: 'Skein1024-968',
0xb3da: 'Skein1024-976',
0xb3db: 'Skein1024-984',
0xb3dc: 'Skein1024-992',
0xb3dd: 'Skein1024-1000',
0xb3de: 'Skein1024-1008',
0xb3df: 'Skein1024-1016',
0xb3e0: 'Skein1024-1024'
});

var defaultLengths = Object.freeze({
0x11: 20,
0x12: 32,
0x13: 64,
0x56: 32,
0x17: 28,
0x16: 32,
0x15: 48,
0x14: 64,
0x18: 32,
0x19: 64,
0x1A: 28,
0x1B: 32,
0x1C: 48,
0x1D: 64,
0x22: 32,

0xb201: 0x01,
0xb202: 0x02,
0xb203: 0x03,
0xb204: 0x04,
0xb205: 0x05,
0xb206: 0x06,
0xb207: 0x07,
0xb208: 0x08,
0xb209: 0x09,
0xb20a: 0x0a,
0xb20b: 0x0b,
0xb20c: 0x0c,
0xb20d: 0x0d,
0xb20e: 0x0e,
0xb20f: 0x0f,
0xb210: 0x10,
0xb211: 0x11,
0xb212: 0x12,
0xb213: 0x13,
0xb214: 0x14,
0xb215: 0x15,
0xb216: 0x16,
0xb217: 0x17,
0xb218: 0x18,
0xb219: 0x19,
0xb21a: 0x1a,
0xb21b: 0x1b,
0xb21c: 0x1c,
0xb21d: 0x1d,
0xb21e: 0x1e,
0xb21f: 0x1f,
0xb220: 0x20,
0xb221: 0x21,
0xb222: 0x22,
0xb223: 0x23,
0xb224: 0x24,
0xb225: 0x25,
0xb226: 0x26,
0xb227: 0x27,
0xb228: 0x28,
0xb229: 0x29,
0xb22a: 0x2a,
0xb22b: 0x2b,
0xb22c: 0x2c,
0xb22d: 0x2d,
0xb22e: 0x2e,
0xb22f: 0x2f,
0xb230: 0x30,
0xb231: 0x31,
0xb232: 0x32,
0xb233: 0x33,
0xb234: 0x34,
0xb235: 0x35,
0xb236: 0x36,
0xb237: 0x37,
0xb238: 0x38,
0xb239: 0x39,
0xb23a: 0x3a,
0xb23b: 0x3b,
0xb23c: 0x3c,
0xb23d: 0x3d,
0xb23e: 0x3e,
0xb23f: 0x3f,
0xb240: 0x40,
0xb241: 0x01,
0xb242: 0x02,
0xb243: 0x03,
0xb244: 0x04,
0xb245: 0x05,
0xb246: 0x06,
0xb247: 0x07,
0xb248: 0x08,
0xb249: 0x09,
0xb24a: 0x0a,
0xb24b: 0x0b,
0xb24c: 0x0c,
0xb24d: 0x0d,
0xb24e: 0x0e,
0xb24f: 0x0f,
0xb250: 0x10,
0xb251: 0x11,
0xb252: 0x12,
0xb253: 0x13,
0xb254: 0x14,
0xb255: 0x15,
0xb256: 0x16,
0xb257: 0x17,
0xb258: 0x18,
0xb259: 0x19,
0xb25a: 0x1a,
0xb25b: 0x1b,
0xb25c: 0x1c,
0xb25d: 0x1d,
0xb25e: 0x1e,
0xb25f: 0x1f,
0xb260: 0x20,
0xb301: 0x01,
0xb302: 0x02,
0xb303: 0x03,
0xb304: 0x04,
0xb305: 0x05,
0xb306: 0x06,
0xb307: 0x07,
0xb308: 0x08,
0xb309: 0x09,
0xb30a: 0x0a,
0xb30b: 0x0b,
0xb30c: 0x0c,
0xb30d: 0x0d,
0xb30e: 0x0e,
0xb30f: 0x0f,
0xb310: 0x10,
0xb311: 0x11,
0xb312: 0x12,
0xb313: 0x13,
0xb314: 0x14,
0xb315: 0x15,
0xb316: 0x16,
0xb317: 0x17,
0xb318: 0x18,
0xb319: 0x19,
0xb31a: 0x1a,
0xb31b: 0x1b,
0xb31c: 0x1c,
0xb31d: 0x1d,
0xb31e: 0x1e,
0xb31f: 0x1f,
0xb320: 0x20,
0xb321: 0x01,
0xb322: 0x02,
0xb323: 0x03,
0xb324: 0x04,
0xb325: 0x05,
0xb326: 0x06,
0xb327: 0x07,
0xb328: 0x08,
0xb329: 0x09,
0xb32a: 0x0a,
0xb32b: 0x0b,
0xb32c: 0x0c,
0xb32d: 0x0d,
0xb32e: 0x0e,
0xb32f: 0x0f,
0xb330: 0x10,
0xb331: 0x11,
0xb332: 0x12,
0xb333: 0x13,
0xb334: 0x14,
0xb335: 0x15,
0xb336: 0x16,
0xb337: 0x17,
0xb338: 0x18,
0xb339: 0x19,
0xb33a: 0x1a,
0xb33b: 0x1b,
0xb33c: 0x1c,
0xb33d: 0x1d,
0xb33e: 0x1e,
0xb33f: 0x1f,
0xb340: 0x20,
0xb341: 0x21,
0xb342: 0x22,
0xb343: 0x23,
0xb344: 0x24,
0xb345: 0x25,
0xb346: 0x26,
0xb347: 0x27,
0xb348: 0x28,
0xb349: 0x29,
0xb34a: 0x2a,
0xb34b: 0x2b,
0xb34c: 0x2c,
0xb34d: 0x2d,
0xb34e: 0x2e,
0xb34f: 0x2f,
0xb350: 0x30,
0xb351: 0x31,
0xb352: 0x32,
0xb353: 0x33,
0xb354: 0x34,
0xb355: 0x35,
0xb356: 0x36,
0xb357: 0x37,
0xb358: 0x38,
0xb359: 0x39,
0xb35a: 0x3a,
0xb35b: 0x3b,
0xb35c: 0x3c,
0xb35d: 0x3d,
0xb35e: 0x3e,
0xb35f: 0x3f,
0xb360: 0x40,
0xb361: 0x01,
0xb362: 0x02,
0xb363: 0x03,
0xb364: 0x04,
0xb365: 0x05,
0xb366: 0x06,
0xb367: 0x07,
0xb368: 0x08,
0xb369: 0x09,
0xb36a: 0x0a,
0xb36b: 0x0b,
0xb36c: 0x0c,
0xb36d: 0x0d,
0xb36e: 0x0e,
0xb36f: 0x0f,
0xb370: 0x10,
0xb371: 0x11,
0xb372: 0x12,
0xb373: 0x13,
0xb374: 0x14,
0xb375: 0x15,
0xb376: 0x16,
0xb377: 0x17,
0xb378: 0x18,
0xb379: 0x19,
0xb37a: 0x1a,
0xb37b: 0x1b,
0xb37c: 0x1c,
0xb37d: 0x1d,
0xb37e: 0x1e,
0xb37f: 0x1f,
0xb380: 0x20,
0xb381: 0x21,
0xb382: 0x22,
0xb383: 0x23,
0xb384: 0x24,
0xb385: 0x25,
0xb386: 0x26,
0xb387: 0x27,
0xb388: 0x28,
0xb389: 0x29,
0xb38a: 0x2a,
0xb38b: 0x2b,
0xb38c: 0x2c,
0xb38d: 0x2d,
0xb38e: 0x2e,
0xb38f: 0x2f,
0xb390: 0x30,
0xb391: 0x31,
0xb392: 0x32,
0xb393: 0x33,
0xb394: 0x34,
0xb395: 0x35,
0xb396: 0x36,
0xb397: 0x37,
0xb398: 0x38,
0xb399: 0x39,
0xb39a: 0x3a,
0xb39b: 0x3b,
0xb39c: 0x3c,
0xb39d: 0x3d,
0xb39e: 0x3e,
0xb39f: 0x3f,
0xb3a0: 0x40,
0xb3a1: 0x41,
0xb3a2: 0x42,
0xb3a3: 0x43,
0xb3a4: 0x44,
0xb3a5: 0x45,
0xb3a6: 0x46,
0xb3a7: 0x47,
0xb3a8: 0x48,
0xb3a9: 0x49,
0xb3aa: 0x4a,
0xb3ab: 0x4b,
0xb3ac: 0x4c,
0xb3ad: 0x4d,
0xb3ae: 0x4e,
0xb3af: 0x4f,
0xb3b0: 0x50,
0xb3b1: 0x51,
0xb3b2: 0x52,
0xb3b3: 0x53,
0xb3b4: 0x54,
0xb3b5: 0x55,
0xb3b6: 0x56,
0xb3b7: 0x57,
0xb3b8: 0x58,
0xb3b9: 0x59,
0xb3ba: 0x5a,
0xb3bb: 0x5b,
0xb3bc: 0x5c,
0xb3bd: 0x5d,
0xb3be: 0x5e,
0xb3bf: 0x5f,
0xb3c0: 0x60,
0xb3c1: 0x61,
0xb3c2: 0x62,
0xb3c3: 0x63,
0xb3c4: 0x64,
0xb3c5: 0x65,
0xb3c6: 0x66,
0xb3c7: 0x67,
0xb3c8: 0x68,
0xb3c9: 0x69,
0xb3ca: 0x6a,
0xb3cb: 0x6b,
0xb3cc: 0x6c,
0xb3cd: 0x6d,
0xb3ce: 0x6e,
0xb3cf: 0x6f,
0xb3d0: 0x70,
0xb3d1: 0x71,
0xb3d2: 0x72,
0xb3d3: 0x73,
0xb3d4: 0x74,
0xb3d5: 0x75,
0xb3d6: 0x76,
0xb3d7: 0x77,
0xb3d8: 0x78,
0xb3d9: 0x79,
0xb3da: 0x7a,
0xb3db: 0x7b,
0xb3dc: 0x7c,
0xb3dd: 0x7d,
0xb3de: 0x7e,
0xb3df: 0x7f,
0xb3e0: 0x80
});

var constants$1 = {
names: names,
codes: codes,
defaultLengths: defaultLengths
};

var encode_1 = encode$1;

var MSB = 0x80
, REST = 0x7F
, MSBALL = ~REST
, INT = Math.pow(2, 31);

function encode$1(num, out, offset) {
out = out || [];
offset = offset || 0;
var oldOffset = offset;

while(num >= INT) {
out[offset++] = (num & 0xFF) | MSB;
num /= 128;
}
while(num & MSBALL) {
out[offset++] = (num & 0xFF) | MSB;
num >>>= 7;
}
out[offset] = num | 0;

encode$1.bytes = offset - oldOffset + 1;

return out
}

var decode$1 = read;

var MSB$1 = 0x80
, REST$1 = 0x7F;

function read(buf, offset) {
var res    = 0
, offset = offset || 0
, shift  = 0
, counter = offset
, b
, l = buf.length;

do {
if (counter >= l) {
read.bytes = 0;
throw new RangeError('Could not decode varint')
}
b = buf[counter++];
res += shift < 28
? (b & REST$1) << shift
: (b & REST$1) * Math.pow(2, shift);
shift += 7;
} while (b >= MSB$1)

read.bytes = counter - offset;

return res
}

var N1 = Math.pow(2,  7);
var N2 = Math.pow(2, 14);
var N3 = Math.pow(2, 21);
var N4 = Math.pow(2, 28);
var N5 = Math.pow(2, 35);
var N6 = Math.pow(2, 42);
var N7 = Math.pow(2, 49);
var N8 = Math.pow(2, 56);
var N9 = Math.pow(2, 63);

var length = function (value) {
return (
value < N1 ? 1
: value < N2 ? 2
: value < N3 ? 3
: value < N4 ? 4
: value < N5 ? 5
: value < N6 ? 6
: value < N7 ? 7
: value < N8 ? 8
: value < N9 ? 9
:              10
)
};

var varint = {
encode: encode_1
, decode: decode$1
, encodingLength: length
};

/**
* Multihash implementation in JavaScript.
*
* @module multihash
*/

var src$1 = createCommonjsModule(function (module, exports) {





exports.names = constants$1.names;
exports.codes = constants$1.codes;
exports.defaultLengths = constants$1.defaultLengths;



/**
* Convert the given multihash to a hex encoded string.
*
* @param {Buffer} hash
* @returns {string}
*/
exports.toHexString = function toHexString (hash) {
if (!Buffer.isBuffer(hash)) {
throw new Error('must be passed a buffer')
}

return hash.toString('hex')
};

/**
* Convert the given hex encoded string to a multihash.
*
* @param {string} hash
* @returns {Buffer}
*/
exports.fromHexString = function fromHexString (hash) {
return Buffer.from(hash, 'hex')
};

/**
* Convert the given multihash to a base58 encoded string.
*
* @param {Buffer} hash
* @returns {string}
*/
exports.toB58String = function toB58String (hash) {
if (!Buffer.isBuffer(hash)) {
throw new Error('must be passed a buffer')
}

return bs58.encode(hash)
};

/**
* Convert the given base58 encoded string to a multihash.
*
* @param {string|Buffer} hash
* @returns {Buffer}
*/
exports.fromB58String = function fromB58String (hash) {
let encoded = hash;
if (Buffer.isBuffer(hash)) {
encoded = hash.toString();
}

return Buffer.from(bs58.decode(encoded))
};

/**
* Decode a hash from the given multihash.
*
* @param {Buffer} buf
* @returns {{code: number, name: string, length: number, digest: Buffer}} result
*/
exports.decode = function decode (buf) {
if (!(Buffer.isBuffer(buf))) {
throw new Error('multihash must be a Buffer')
}

if (buf.length < 3) {
throw new Error('multihash too short. must be > 3 bytes.')
}

const code = varint.decode(buf);
if (!exports.isValidCode(code)) {
throw new Error(`multihash unknown function code: 0x${code.toString(16)}`)
}
buf = buf.slice(varint.decode.bytes);

const len = varint.decode(buf);
if (len < 1) {
throw new Error(`multihash invalid length: 0x${len.toString(16)}`)
}
buf = buf.slice(varint.decode.bytes);

if (buf.length !== len) {
throw new Error(`multihash length inconsistent: 0x${buf.toString('hex')}`)
}

return {
code: code,
name: constants$1.codes[code],
length: len,
digest: buf
}
};

/**
*  Encode a hash digest along with the specified function code.
*
* > **Note:** the length is derived from the length of the digest itself.
*
* @param {Buffer} digest
* @param {string|number} code
* @param {number} [length]
* @returns {Buffer}
*/
exports.encode = function encode (digest, code, length) {
if (!digest || code === undefined) {
throw new Error('multihash encode requires at least two args: digest, code')
}

// ensure it's a hashfunction code.
const hashfn = exports.coerceCode(code);

if (!(Buffer.isBuffer(digest))) {
throw new Error('digest should be a Buffer')
}

if (length == null) {
length = digest.length;
}

if (length && digest.length !== length) {
throw new Error('digest length should be equal to specified length.')
}

return Buffer.concat([
Buffer.from(varint.encode(hashfn)),
Buffer.from(varint.encode(length)),
digest
])
};

/**
* Converts a hash function name into the matching code.
* If passed a number it will return the number if it's a valid code.
* @param {string|number} name
* @returns {number}
*/
exports.coerceCode = function coerceCode (name) {
let code = name;

if (typeof name === 'string') {
if (constants$1.names[name] === undefined) {
throw new Error(`Unrecognized hash function named: ${name}`)
}
code = constants$1.names[name];
}

if (typeof code !== 'number') {
throw new Error(`Hash function code should be a number. Got: ${code}`)
}

if (constants$1.codes[code] === undefined && !exports.isAppCode(code)) {
throw new Error(`Unrecognized function code: ${code}`)
}

return code
};

/**
* Checks wether a code is part of the app range
*
* @param {number} code
* @returns {boolean}
*/
exports.isAppCode = function appCode (code) {
return code > 0 && code < 0x10
};

/**
* Checks whether a multihash code is valid.
*
* @param {number} code
* @returns {boolean}
*/
exports.isValidCode = function validCode (code) {
if (exports.isAppCode(code)) {
return true
}

if (constants$1.codes[code]) {
return true
}

return false
};

/**
* Check if the given buffer is a valid multihash. Throws an error if it is not valid.
*
* @param {Buffer} multihash
* @returns {undefined}
* @throws {Error}
*/
function validate (multihash) {
exports.decode(multihash); // throws if bad.
}
exports.validate = validate;

/**
* Returns a prefix from a valid multihash. Throws an error if it is not valid.
*
* @param {Buffer} multihash
* @returns {undefined}
* @throws {Error}
*/
exports.prefix = function prefix (multihash) {
validate(multihash);

return multihash.slice(0, 2)
};
});

var at, // The index of the current character
ch, // The current character
escapee = {
  '"':  '"',
  '\\': '\\',
  '/':  '/',
  b:    '\b',
  f:    '\f',
  n:    '\n',
  r:    '\r',
  t:    '\t'
},
text,

error$1 = function (m) {
  // Call error when something is wrong.
  throw {
      name:    'SyntaxError',
      message: m,
      at:      at,
      text:    text
  };
},

next = function (c) {
  // If a c parameter is provided, verify that it matches the current character.
  if (c && c !== ch) {
      error$1("Expected '" + c + "' instead of '" + ch + "'");
  }
  
  // Get the next character. When there are no more characters,
  // return the empty string.
  
  ch = text.charAt(at);
  at += 1;
  return ch;
},

number = function () {
  // Parse a number value.
  var number,
      string = '';
  
  if (ch === '-') {
      string = '-';
      next('-');
  }
  while (ch >= '0' && ch <= '9') {
      string += ch;
      next();
  }
  if (ch === '.') {
      string += '.';
      while (next() && ch >= '0' && ch <= '9') {
          string += ch;
      }
  }
  if (ch === 'e' || ch === 'E') {
      string += ch;
      next();
      if (ch === '-' || ch === '+') {
          string += ch;
          next();
      }
      while (ch >= '0' && ch <= '9') {
          string += ch;
          next();
      }
  }
  number = +string;
  if (!isFinite(number)) {
      error$1("Bad number");
  } else {
      return number;
  }
},

string = function () {
  // Parse a string value.
  var hex,
      i,
      string = '',
      uffff;
  
  // When parsing for string values, we must look for " and \ characters.
  if (ch === '"') {
      while (next()) {
          if (ch === '"') {
              next();
              return string;
          } else if (ch === '\\') {
              next();
              if (ch === 'u') {
                  uffff = 0;
                  for (i = 0; i < 4; i += 1) {
                      hex = parseInt(next(), 16);
                      if (!isFinite(hex)) {
                          break;
                      }
                      uffff = uffff * 16 + hex;
                  }
                  string += String.fromCharCode(uffff);
              } else if (typeof escapee[ch] === 'string') {
                  string += escapee[ch];
              } else {
                  break;
              }
          } else {
              string += ch;
          }
      }
  }
  error$1("Bad string");
},

white = function () {

// Skip whitespace.

  while (ch && ch <= ' ') {
      next();
  }
},

word = function () {

// true, false, or null.

  switch (ch) {
  case 't':
      next('t');
      next('r');
      next('u');
      next('e');
      return true;
  case 'f':
      next('f');
      next('a');
      next('l');
      next('s');
      next('e');
      return false;
  case 'n':
      next('n');
      next('u');
      next('l');
      next('l');
      return null;
  }
  error$1("Unexpected '" + ch + "'");
},

value,  // Place holder for the value function.

array = function () {

// Parse an array value.

  var array = [];

  if (ch === '[') {
      next('[');
      white();
      if (ch === ']') {
          next(']');
          return array;   // empty array
      }
      while (ch) {
          array.push(value());
          white();
          if (ch === ']') {
              next(']');
              return array;
          }
          next(',');
          white();
      }
  }
  error$1("Bad array");
},

object = function () {

// Parse an object value.

  var key,
      object = {};

  if (ch === '{') {
      next('{');
      white();
      if (ch === '}') {
          next('}');
          return object;   // empty object
      }
      while (ch) {
          key = string();
          white();
          next(':');
          if (Object.hasOwnProperty.call(object, key)) {
              error$1('Duplicate key "' + key + '"');
          }
          object[key] = value();
          white();
          if (ch === '}') {
              next('}');
              return object;
          }
          next(',');
          white();
      }
  }
  error$1("Bad object");
};

value = function () {

// Parse a JSON value. It could be an object, an array, a string, a number,
// or a word.

white();
switch (ch) {
case '{':
  return object();
case '[':
  return array();
case '"':
  return string();
case '-':
  return number();
default:
  return ch >= '0' && ch <= '9' ? number() : word();
}
};

// Return the json_parse function. It will have access to all of the above
// functions and variables.

var parse$5 = function (source, reviver) {
var result;

text = source;
at = 0;
ch = ' ';
result = value();
white();
if (ch) {
  error$1("Syntax error");
}

// If there is a reviver function, we recursively walk the new structure,
// passing each name/value pair to the reviver function for possible
// transformation, starting with a temporary root object that holds the result
// in an empty key. If there is not a reviver function, we simply return the
// result.

return typeof reviver === 'function' ? (function walk(holder, key) {
  var k, v, value = holder[key];
  if (value && typeof value === 'object') {
      for (k in value) {
          if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = walk(value, k);
              if (v !== undefined) {
                  value[k] = v;
              } else {
                  delete value[k];
              }
          }
      }
  }
  return reviver.call(holder, key, value);
}({'': result}, '')) : result;
};

var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
gap,
indent,
meta = {    // table of character substitutions
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\f': '\\f',
  '\r': '\\r',
  '"' : '\\"',
  '\\': '\\\\'
},
rep;

function quote(string) {
// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

escapable.lastIndex = 0;
return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
  var c = meta[a];
  return typeof c === 'string' ? c :
      '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
}) + '"' : '"' + string + '"';
}

function str$1(key, holder) {
// Produce a string from holder[key].
var i,          // The loop counter.
  k,          // The member key.
  v,          // The member value.
  length,
  mind = gap,
  partial,
  value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.
if (value && typeof value === 'object' &&
      typeof value.toJSON === 'function') {
  value = value.toJSON(key);
}

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.
if (typeof rep === 'function') {
  value = rep.call(holder, key, value);
}

// What happens next depends on the value's type.
switch (typeof value) {
  case 'string':
      return quote(value);
  
  case 'number':
      // JSON numbers must be finite. Encode non-finite numbers as null.
      return isFinite(value) ? String(value) : 'null';
  
  case 'boolean':
  case 'null':
      // If the value is a boolean or null, convert it to a string. Note:
      // typeof null does not produce 'null'. The case is included here in
      // the remote chance that this gets fixed someday.
      return String(value);
      
  case 'object':
      if (!value) return 'null';
      gap += indent;
      partial = [];
      
      // Array.isArray
      if (Object.prototype.toString.apply(value) === '[object Array]') {
          length = value.length;
          for (i = 0; i < length; i += 1) {
              partial[i] = str$1(i, value) || 'null';
          }
          
          // Join all of the elements together, separated with commas, and
          // wrap them in brackets.
          v = partial.length === 0 ? '[]' : gap ?
              '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
              '[' + partial.join(',') + ']';
          gap = mind;
          return v;
      }
      
      // If the replacer is an array, use it to select the members to be
      // stringified.
      if (rep && typeof rep === 'object') {
          length = rep.length;
          for (i = 0; i < length; i += 1) {
              k = rep[i];
              if (typeof k === 'string') {
                  v = str$1(k, value);
                  if (v) {
                      partial.push(quote(k) + (gap ? ': ' : ':') + v);
                  }
              }
          }
      }
      else {
          // Otherwise, iterate through all of the keys in the object.
          for (k in value) {
              if (Object.prototype.hasOwnProperty.call(value, k)) {
                  v = str$1(k, value);
                  if (v) {
                      partial.push(quote(k) + (gap ? ': ' : ':') + v);
                  }
              }
          }
      }
      
  // Join all of the member texts together, separated with commas,
  // and wrap them in braces.

  v = partial.length === 0 ? '{}' : gap ?
      '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
      '{' + partial.join(',') + '}';
  gap = mind;
  return v;
}
}

var stringify = function (value, replacer, space) {
var i;
gap = '';
indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.
if (typeof space === 'number') {
  for (i = 0; i < space; i += 1) {
      indent += ' ';
  }
}
// If the space parameter is a string, it will be used as the indent string.
else if (typeof space === 'string') {
  indent = space;
}

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.
rep = replacer;
if (replacer && typeof replacer !== 'function'
&& (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
  throw new Error('JSON.stringify');
}

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.
return str$1('', {'': value});
};

var parse$6 = parse$5;
var stringify$1 = stringify;

var jsonify = {
parse: parse$6,
stringify: stringify$1
};

var json$1 = typeof JSON !== 'undefined' ? JSON : jsonify;

var jsonStableStringify = function (obj, opts) {
if (!opts) opts = {};
if (typeof opts === 'function') opts = { cmp: opts };
var space = opts.space || '';
if (typeof space === 'number') space = Array(space+1).join(' ');
var cycles = (typeof opts.cycles === 'boolean') ? opts.cycles : false;
var replacer = opts.replacer || function(key, value) { return value; };

var cmp = opts.cmp && (function (f) {
  return function (node) {
      return function (a, b) {
          var aobj = { key: a, value: node[a] };
          var bobj = { key: b, value: node[b] };
          return f(aobj, bobj);
      };
  };
})(opts.cmp);

var seen = [];
return (function stringify (parent, key, node, level) {
  var indent = space ? ('\n' + new Array(level + 1).join(space)) : '';
  var colonSeparator = space ? ': ' : ':';

  if (node && node.toJSON && typeof node.toJSON === 'function') {
      node = node.toJSON();
  }

  node = replacer.call(parent, key, node);

  if (node === undefined) {
      return;
  }
  if (typeof node !== 'object' || node === null) {
      return json$1.stringify(node);
  }
  if (isArray$2(node)) {
      var out = [];
      for (var i = 0; i < node.length; i++) {
          var item = stringify(node, i, node[i], level+1) || json$1.stringify(null);
          out.push(indent + space + item);
      }
      return '[' + out.join(',') + indent + ']';
  }
  else {
      if (seen.indexOf(node) !== -1) {
          if (cycles) return json$1.stringify('__cycle__');
          throw new TypeError('Converting circular structure to JSON');
      }
      else seen.push(node);

      var keys = objectKeys(node).sort(cmp && cmp(node));
      var out = [];
      for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var value = stringify(node, key, node[key], level+1);

          if(!value) continue;

          var keyValue = json$1.stringify(key)
              + colonSeparator
              + value;
          out.push(indent + space + keyValue);
      }
      seen.splice(seen.indexOf(node), 1);
      return '{' + out.join(',') + indent + '}';
  }
})({ '': obj }, '', obj, 0);
};

var isArray$2 = Array.isArray || function (x) {
return {}.toString.call(x) === '[object Array]';
};

var objectKeys = Object.keys || function (obj) {
var has = Object.prototype.hasOwnProperty || function () { return true };
var keys = [];
for (var key in obj) {
  if (has.call(obj, key)) keys.push(key);
}
return keys;
};

var require$$0$2 = /*@__PURE__*/getAugmentedNamespace(wasm_key_manager);

const {
KeyManager: KeyManager$1,
deriveSeedFrom: deriveSeedFrom$1
} = require$$0$2;



const base36 = src("0123456789abcdefghijklmnopqrstuvwxyz");

const HHT = Object.freeze({
AGENT: "agent",
HEADER: "header",
ENTRY: "entry",
DNA: "dna",
});

const HOLO_HASH_AGENT_PREFIX = Buffer.from(new Uint8Array([0x84, 0x20, 0x24]).buffer);
const HOLO_HASH_HEADER_PREFIX = Buffer.from(new Uint8Array([0x84, 0x29, 0x24]).buffer);
const HOLO_HASH_ENTRY_PREFIX = Buffer.from(new Uint8Array([0x84, 0x21, 0x24]).buffer);
const HOLO_HASH_DNA_PREFIX = Buffer.from(new Uint8Array([0x84, 0x2d, 0x24]).buffer);

const getHoloHashPrefix = holoHashType => {
let holoHashPrefix;
switch (holoHashType) {
case HHT.AGENT:
holoHashPrefix = HOLO_HASH_AGENT_PREFIX;
break;
case HHT.HEADER:
holoHashPrefix = HOLO_HASH_HEADER_PREFIX;
break;
case HHT.ENTRY:
holoHashPrefix = HOLO_HASH_ENTRY_PREFIX;
break;
case HHT.DNA:
holoHashPrefix = HOLO_HASH_DNA_PREFIX;
break;
default:
throw new Error("Received unsupported HoloHash Type in Codec.Digest : ", holoHashType);
}
return holoHashPrefix;
};

function check_length(buf, expectedLength) {
if (Buffer.byteLength(buf) !== expectedLength)
throw new Error(`Unexpected buffer length of ${Buffer.byteLength(buf)}.  Buffer should be ${expectedLength} bytes.`);
return buf;
}

function convert_b64_to_holohash_b64(rawBase64) {
let holoHashbase64 = '';
const len = rawBase64.length;
for (let i = 0; i < len; i++) {
let char = rawBase64[i];
if (char === '/') {
char = '_';
} else if (char === '+') {
char = '-';
}
holoHashbase64 += char;
}
return holoHashbase64;
}

// Generate holohash 4 byte (or u32) dht "location" - used for checksum and dht sharding
function calc_dht_bytes(data) {
const digest = blakejs.blake2b(data, null, 16);
const dht_part = Buffer.from([digest[0], digest[1], digest[2], digest[3]]);

for (let i of [4, 8, 12]) {
dht_part[0] ^= digest[i];
dht_part[1] ^= digest[i + 1];
dht_part[2] ^= digest[i + 2];
dht_part[3] ^= digest[i + 3];
}

return dht_part;
}

const Codec = {
"AgentId": {
decode: (base64) => Codec.HoloHash.decode(base64),
encode: (buf) => Codec.HoloHash.encode("agent", Buffer.from(buf)),
decodeToHoloHash: (base64) => {
const buf = Buffer.from(base64.slice(1), "base64");
check_length(Buffer.from(buf), 39);
return buf;
},
},
"Base36": {
decode: (str) => base36.decode(str),
encode: (buf) => base36.encode(Buffer.from(buf)),
},
"HoloHash": {
holoHashFromBuffer: (holoHashType, buf) => {
const holoHashPrefix = getHoloHashPrefix(holoHashType);
check_length(Buffer.from(buf), 32);
return Buffer.concat([
  holoHashPrefix,
  buf,
  calc_dht_bytes(buf)
]);
},
encode: (holoHashType, buf) => {
if (typeof holoHashType !== 'string') {
  throw new Error('First argument must be a string declaring the type of HoloHash to be encoded. Accepted HoloHash types are: header, entry, dna, and agent.')
}
if (Buffer.byteLength(buf) === 39) {
  const compareBuf = Buffer.alloc(3);
  buf.copy(compareBuf, 0, 0, 3);
  const holoHashPrefix = getHoloHashPrefix(holoHashType.toLowerCase());
  if (Buffer.compare(compareBuf, holoHashPrefix) === 0) {
    // encoding from holohash buffer
    return "u" + convert_b64_to_holohash_b64(Buffer.from(buf).toString("base64"));
  } else {
    throw new Error(`Unexpected buffer length of ${Buffer.byteLength(buf)}.  Buffer should be 32 bytes.`);
  }
}
// encoding from raw buffer
const rawBase64 = Codec.HoloHash.holoHashFromBuffer(holoHashType.toLowerCase(), Buffer.from(buf)).toString("base64");
return "u" + convert_b64_to_holohash_b64(rawBase64);
},
decode: (base64) => {
const buf = Buffer.from(base64.slice(1), "base64").slice(3, -4);
check_length(Buffer.from(buf), 32);
return buf;
},
},
"Signature": {
decode: (base64) => Buffer.from(base64, "base64"),
encode: (buf) => Buffer.from(buf).toString("base64"),
},
"Digest": {
decode: (base64) => src$1.decode(Buffer.from(base64, "base64")).digest,
encode: (data) => {
let buf = data;
if (!Buffer.isBuffer(data)) {
  buf = Buffer.from(typeof data === "string" ? data : jsonStableStringify(data));
}
return Buffer.from(src$1.encode(buf, "sha2-256")).toString("base64");
},
},
};

var src$2 = {
KeyManager: KeyManager$1,
deriveSeedFrom: deriveSeedFrom$1,
Codec,
HHT,
};

var unpack = createCommonjsModule(function (module, exports) {
let decoder;
try {
decoder = new TextDecoder();
} catch(error) {}
let src;
let srcEnd;
let position = 0;
const EMPTY_ARRAY = [];
let strings = EMPTY_ARRAY;
let stringPosition = 0;
let currentUnpackr = {};
let currentStructures;
let srcString;
let srcStringStart = 0;
let srcStringEnd = 0;
let referenceMap;
let currentExtensions = [];
let dataView;
let defaultOptions = {
useRecords: false,
mapsAsObjects: true
};
class C1Type {}
const C1 = new C1Type();
C1.name = 'MessagePack 0xC1';

class Unpackr {
constructor(options) {
if (options) {
if (options.useRecords === false && options.mapsAsObjects === undefined)
  options.mapsAsObjects = true;
if (options.getStructures && !options.structures)
  (options.structures = []).uninitialized = true; // this is what we use to denote an uninitialized structures
}
Object.assign(this, options);
}
unpack(source, end, continueReading) {
if (src) {
// re-entrant execution, save the state and restore it after we do this unpack
return saveState(() => {
  clearSource();
  return this ? this.unpack(source, end, continueReading) : Unpackr.prototype.unpack.call(defaultOptions, source, end, continueReading)
})
}
srcEnd = end > -1 ? end : source.length;
position = 0;
stringPosition = 0;
srcStringEnd = 0;
srcString = null;
strings = EMPTY_ARRAY;
src = source;
// this provides cached access to the data view for a buffer if it is getting reused, which is a recommend
// technique for getting data from a database where it can be copied into an existing buffer instead of creating
// new ones
dataView = source.dataView || (source.dataView = new DataView(source.buffer, source.byteOffset, source.byteLength));
if (this) {
currentUnpackr = this;
if (this.structures) {
  currentStructures = this.structures;
  try {
    return read()
  } finally {
    if (position >= srcEnd || !continueReading) {
      // finished reading this source, cleanup references
      currentStructures = null;
      src = null;
      if (referenceMap)
        referenceMap = null;
    }
  }
} else if (!currentStructures || currentStructures.length > 0) {
  currentStructures = [];
}
} else {
currentUnpackr = defaultOptions;
if (!currentStructures || currentStructures.length > 0)
  currentStructures = [];
}
try {
return read()
} finally {
if (position >= srcEnd || !continueReading) {
  src = null;
  if (referenceMap)
    referenceMap = null;
}
}
}
unpackMultiple(source, forEach) {
try {
let unpackr = this;
let size = source.length;
let value = this ? this.unpack(source, size, true) : defaultUnpackr.unpack(source, size, true);
let values;
if (forEach) {
  forEach(value);
  while(position < size) {
    if (forEach(read()) === false) {
      return
    }
  }
}
else {
  values = [ value ];
  while(position < size) {
    values.push(read());
  }
  return values
}
} finally {
clearSource();
}
}
decode(source, end) {
return this.unpack(source, end)
}
}
exports.Decoder = exports.Unpackr = Unpackr;
exports.read = read;
exports.getPosition = () => {
return position
};

function read() {
let token = src[position++];
if (token < 0xa0) {
if (token < 0x80) {
if (token < 0x40)
  return token
else {
  let structure = currentStructures[token & 0x3f];
  if (structure) {
    if (!structure.read)
      structure.read = createStructureReader(structure);
    return structure.read()
  } else if (currentUnpackr.getStructures) {
    let updatedStructures = saveState(() => {
      // save the state in case getStructures modifies our buffer
      src = null;
      return currentUnpackr.getStructures()
    });
    if (currentStructures === true)
      currentUnpackr.structures = currentStructures = updatedStructures;
    else
      currentStructures.splice.apply(currentStructures, [0, updatedStructures.length].concat(updatedStructures));
    structure = currentStructures[token & 0x3f];
    if (structure) {
      if (!structure.read)
        structure.read = createStructureReader(structure);
      return structure.read()
    } else
      return token
  } else
    return token
}
} else if (token < 0x90) {
// map
token -= 0x80;
if (currentUnpackr.mapsAsObjects) {
  let object = {};
  for (let i = 0; i < token; i++) {
    object[readKey()] = read();
  }
  return object
} else {
  let map = new Map();
  for (let i = 0; i < token; i++) {
    map.set(read(), read());
  }
  return map
}
} else {
token -= 0x90;
let array = new Array(token);
for (let i = 0; i < token; i++) {
  array[i] = read();
}
return array
}
} else if (token < 0xc0) {
// fixstr
let length = token - 0xa0;
if (srcStringEnd >= position) {
return srcString.slice(position - srcStringStart, (position += length) - srcStringStart)
}
if (srcStringEnd == 0 && srcEnd < 140) {
// for small blocks, avoiding the overhead of the extract call is helpful
let string = length < 16 ? shortStringInJS(length) : longStringInJS(length);
if (string != null)
  return string
}
return readFixedString(length)
} else {
let value;
switch (token) {
case 0xc0: return null
case 0xc1: return C1; // "never-used", return special object to denote that
case 0xc2: return false
case 0xc3: return true
case 0xc4:
  // bin 8
  return readBin(src[position++])
case 0xc5:
  // bin 16
  value = dataView.getUint16(position);
  position += 2;
  return readBin(value)
case 0xc6:
  // bin 32
  value = dataView.getUint32(position);
  position += 4;
  return readBin(value)
case 0xc7:
  // ext 8
  return readExt(src[position++])
case 0xc8:
  // ext 16
  value = dataView.getUint16(position);
  position += 2;
  return readExt(value)
case 0xc9:
  // ext 32
  value = dataView.getUint32(position);
  position += 4;
  return readExt(value)
case 0xca:
  value = dataView.getFloat32(position);
  if (currentUnpackr.useFloat32 > 2) {
    // this does rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
    let multiplier = mult10[((src[position] & 0x7f) << 1) | (src[position + 1] >> 7)];
    position += 4;
    return ((multiplier * value + (value > 0 ? 0.5 : -0.5)) >> 0) / multiplier
  }
  position += 4;
  return value
case 0xcb:
  value = dataView.getFloat64(position);
  position += 8;
  return value
// uint handlers
case 0xcc:
  return src[position++]
case 0xcd:
  value = dataView.getUint16(position);
  position += 2;
  return value
case 0xce:
  value = dataView.getUint32(position);
  position += 4;
  return value
case 0xcf:
  if (currentUnpackr.uint64AsNumber)
    return src[position++] * 0x100000000000000 + src[position++] * 0x1000000000000 + src[position++] * 0x10000000000 + src[position++] * 0x100000000 +
      src[position++] * 0x1000000 + (src[position++] << 16) + (src[position++] << 8) + src[position++]
  value = dataView.getBigUint64(position);
  position += 8;
  return value

// int handlers
case 0xd0:
  return dataView.getInt8(position++)
case 0xd1:
  value = dataView.getInt16(position);
  position += 2;
  return value
case 0xd2:
  value = dataView.getInt32(position);
  position += 4;
  return value
case 0xd3:
  value = dataView.getBigInt64(position);
  position += 8;
  return value

case 0xd4:
  // fixext 1
  value = src[position++];
  if (value == 0x72) {
    return recordDefinition(src[position++])
  } else {
    if (currentExtensions[value])
      return currentExtensions[value](src.subarray(position, ++position))
    else
      throw new Error('Unknown extension ' + value)
  }
case 0xd5:
  // fixext 2
  return readExt(2)
case 0xd6:
  // fixext 4
  return readExt(4)
case 0xd7:
  // fixext 8
  return readExt(8)
case 0xd8:
  // fixext 16
  return readExt(16)
case 0xd9:
// str 8
  value = src[position++];
  if (srcStringEnd >= position) {
    return srcString.slice(position - srcStringStart, (position += value) - srcStringStart)
  }
  return readString8(value)
case 0xda:
// str 16
  value = dataView.getUint16(position);
  position += 2;
  if (srcStringEnd >= position) {
    return srcString.slice(position - srcStringStart, (position += value) - srcStringStart)
  }
  return readString16(value)
case 0xdb:
// str 32
  value = dataView.getUint32(position);
  position += 4;
  if (srcStringEnd >= position) {
    return srcString.slice(position - srcStringStart, (position += value) - srcStringStart)
  }
  return readString32(value)
case 0xdc:
// array 16
  value = dataView.getUint16(position);
  position += 2;
  return readArray(value)
case 0xdd:
// array 32
  value = dataView.getUint32(position);
  position += 4;
  return readArray(value)
case 0xde:
// map 16
  value = dataView.getUint16(position);
  position += 2;
  return readMap(value)
case 0xdf:
// map 32
  value = dataView.getUint32(position);
  position += 4;
  return readMap(value)
default: // negative int
  if (token >= 0xe0)
    return token - 0x100
  if (token === undefined) {
    let error = new Error('Unexpected end of MessagePack data');
    error.incomplete = true;
    throw error
  }
  throw new Error('Unknown MessagePack token ' + token)

}
}
}
const validName = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
function createStructureReader(structure) {
function readObject() {
// This initial function is quick to instantiate, but runs slower. After several iterations pay the cost to build the faster function
if (readObject.count++ > 2) {
this.read = (new Function('r', 'return function(){return {' + structure.map(key => validName.test(key) ? key + ':r()' : ('[' + JSON.stringify(key) + ']:r()')).join(',') + '}}'))(read);
return this.read()
}
let object = {};
for (let i = 0, l = structure.length; i < l; i++) {
let key = structure[i];
object[key] = read();
}
return object
}
readObject.count = 0;
return readObject
}

let readFixedString = readStringJS;
let readString8 = readStringJS;
let readString16 = readStringJS;
let readString32 = readStringJS;

exports.setExtractor = (extractStrings) => {
readFixedString = readString(1);
readString8 = readString(2);
readString16 = readString(3);
readString32 = readString(5);
function readString(headerLength) {
return function readString(length) {
let string = strings[stringPosition++];
if (string == null) {
  let extraction = extractStrings(position - headerLength, srcEnd, src);
  if (typeof extraction == 'string') {
    string = extraction;
    strings = EMPTY_ARRAY;
  } else {
    strings = extraction;
    stringPosition = 1;
    srcStringEnd = 1; // even if a utf-8 string was decoded, must indicate we are in the midst of extracted strings and can't skip strings
    string = strings[0];
    if (string === undefined)
      throw new Error('Unexpected end of buffer')
  }
}
let srcStringLength = string.length;
if (srcStringLength <= length) {
  position += length;
  return string
}
srcString = string;
srcStringStart = position;
srcStringEnd = position + srcStringLength;
position += length;
return string.slice(0, length) // we know we just want the beginning
}
}
};
function readStringJS(length) {
let result;
if (length < 16) {
if (result = shortStringInJS(length))
return result
}
if (length > 64 && decoder)
return decoder.decode(src.subarray(position, position += length))
const end = position + length;
const units = [];
result = '';
while (position < end) {
const byte1 = src[position++];
if ((byte1 & 0x80) === 0) {
// 1 byte
units.push(byte1);
} else if ((byte1 & 0xe0) === 0xc0) {
// 2 bytes
const byte2 = src[position++] & 0x3f;
units.push(((byte1 & 0x1f) << 6) | byte2);
} else if ((byte1 & 0xf0) === 0xe0) {
// 3 bytes
const byte2 = src[position++] & 0x3f;
const byte3 = src[position++] & 0x3f;
units.push(((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3);
} else if ((byte1 & 0xf8) === 0xf0) {
// 4 bytes
const byte2 = src[position++] & 0x3f;
const byte3 = src[position++] & 0x3f;
const byte4 = src[position++] & 0x3f;
let unit = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
if (unit > 0xffff) {
  unit -= 0x10000;
  units.push(((unit >>> 10) & 0x3ff) | 0xd800);
  unit = 0xdc00 | (unit & 0x3ff);
}
units.push(unit);
} else {
units.push(byte1);
}

if (units.length >= 0x1000) {
result += fromCharCode.apply(String, units);
units.length = 0;
}
}

if (units.length > 0) {
result += fromCharCode.apply(String, units);
}

return result
}

function readArray(length) {
let array = new Array(length);
for (let i = 0; i < length; i++) {
array[i] = read();
}
return array
}

function readMap(length) {
if (currentUnpackr.mapsAsObjects) {
let object = {};
for (let i = 0; i < length; i++) {
object[readKey()] = read();
}
return object
} else {
let map = new Map();
for (let i = 0; i < length; i++) {
map.set(read(), read());
}
return map
}
}

let fromCharCode = String.fromCharCode;
function longStringInJS(length) {
let start = position;
let bytes = new Array(length);
for (let i = 0; i < length; i++) {
const byte = src[position++];
if ((byte & 0x80) > 0) {
position = start;
    return
  }
  bytes[i] = byte;
}
return fromCharCode.apply(String, bytes)
}
function shortStringInJS(length) {
if (length < 4) {
if (length < 2) {
if (length === 0)
  return ''
else {
  let a = src[position++];
  if ((a & 0x80) > 1) {
    position -= 1;
    return
  }
  return fromCharCode(a)
}
} else {
let a = src[position++];
let b = src[position++];
if ((a & 0x80) > 0 || (b & 0x80) > 0) {
  position -= 2;
  return
}
if (length < 3)
  return fromCharCode(a, b)
let c = src[position++];
if ((c & 0x80) > 0) {
  position -= 3;
  return
}
return fromCharCode(a, b, c)
}
} else {
let a = src[position++];
let b = src[position++];
let c = src[position++];
let d = src[position++];
if ((a & 0x80) > 0 || (b & 0x80) > 0 || (c & 0x80) > 0 || (d & 0x80) > 0) {
position -= 4;
return
}
if (length < 6) {
if (length === 4)
  return fromCharCode(a, b, c, d)
else {
  let e = src[position++];
  if ((e & 0x80) > 0) {
    position -= 5;
    return
  }
  return fromCharCode(a, b, c, d, e)
}
} else if (length < 8) {
let e = src[position++];
let f = src[position++];
if ((e & 0x80) > 0 || (f & 0x80) > 0) {
  position -= 6;
  return
}
if (length < 7)
  return fromCharCode(a, b, c, d, e, f)
let g = src[position++];
if ((g & 0x80) > 0) {
  position -= 7;
  return
}
return fromCharCode(a, b, c, d, e, f, g)
} else {
let e = src[position++];
let f = src[position++];
let g = src[position++];
let h = src[position++];
if ((e & 0x80) > 0 || (f & 0x80) > 0 || (g & 0x80) > 0 || (h & 0x80) > 0) {
  position -= 8;
  return
}
if (length < 10) {
  if (length === 8)
    return fromCharCode(a, b, c, d, e, f, g, h)
  else {
    let i = src[position++];
    if ((i & 0x80) > 0) {
      position -= 9;
      return
    }
    return fromCharCode(a, b, c, d, e, f, g, h, i)
  }
} else if (length < 12) {
  let i = src[position++];
  let j = src[position++];
  if ((i & 0x80) > 0 || (j & 0x80) > 0) {
    position -= 10;
    return
  }
  if (length < 11)
    return fromCharCode(a, b, c, d, e, f, g, h, i, j)
  let k = src[position++];
  if ((k & 0x80) > 0) {
    position -= 11;
    return
  }
  return fromCharCode(a, b, c, d, e, f, g, h, i, j, k)
} else {
  let i = src[position++];
  let j = src[position++];
  let k = src[position++];
  let l = src[position++];
  if ((i & 0x80) > 0 || (j & 0x80) > 0 || (k & 0x80) > 0 || (l & 0x80) > 0) {
    position -= 12;
    return
  }
  if (length < 14) {
    if (length === 12)
      return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l)
    else {
      let m = src[position++];
      if ((m & 0x80) > 0) {
        position -= 13;
        return
      }
      return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m)
    }
  } else {
    let m = src[position++];
    let n = src[position++];
    if ((m & 0x80) > 0 || (n & 0x80) > 0) {
      position -= 14;
      return
    }
    if (length < 15)
      return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
    let o = src[position++];
    if ((o & 0x80) > 0) {
      position -= 15;
      return
    }
    return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
  }
}
}
}
}

function readBin(length) {
return currentUnpackr.copyBuffers ?
// specifically use the copying slice (not the node one)
Uint8Array.prototype.slice.call(src, position, position += length) :
src.subarray(position, position += length)
}
function readExt(length) {
let type = src[position++];
if (currentExtensions[type]) {
return currentExtensions[type](src.subarray(position, position += length))
}
else
throw new Error('Unknown extension type ' + type)
}

let keyCache = new Array(4096);
function readKey() {
let length = src[position++];
if (length >= 0xa0 && length < 0xc0) {
// fixstr, potentially use key cache
length = length - 0xa0;
if (srcStringEnd >= position) // if it has been extracted, must use it (and faster anyway)
return srcString.slice(position - srcStringStart, (position += length) - srcStringStart)
else if (!(srcStringEnd == 0 && srcEnd < 180))
return readFixedString(length)
} else { // not cacheable, go back and do a standard read
position--;
return read()
}
let key = ((length << 5) ^ (length > 1 ? dataView.getUint16(position) : length > 0 ? src[position] : 0)) & 0xfff;
let entry = keyCache[key];
let checkPosition = position;
let end = position + length - 3;
let chunk;
let i = 0;
if (entry && entry.bytes == length) {
while (checkPosition < end) {
chunk = dataView.getUint32(checkPosition);
if (chunk != entry[i++]) {
  checkPosition = 0x70000000;
  break
}
checkPosition += 4;
}
end += 3;
while (checkPosition < end) {
chunk = src[checkPosition++];
if (chunk != entry[i++]) {
  checkPosition = 0x70000000;
  break
}
}
if (checkPosition === end) {
position = checkPosition;
return entry.string
}
end -= 3;
checkPosition = position;
}
entry = [];
keyCache[key] = entry;
entry.bytes = length;
while (checkPosition < end) {
chunk = dataView.getUint32(checkPosition);
entry.push(chunk);
checkPosition += 4;
}
end += 3;
while (checkPosition < end) {
chunk = src[checkPosition++];
entry.push(chunk);
}
// for small blocks, avoiding the overhead of the extract call is helpful
let string = length < 16 ? shortStringInJS(length) : longStringInJS(length);
if (string != null)
return entry.string = string
return entry.string = readFixedString(length)
}

// the registration of the record definition extension (as "r")
const recordDefinition = (id) => {
let structure = currentStructures[id & 0x3f] = read();
structure.read = createStructureReader(structure);
return structure.read()
};
let glbl = typeof window == 'object' ? window : commonjsGlobal;
currentExtensions[0] = (data) => {}; // notepack defines extension 0 to mean undefined, so use that as the default here

currentExtensions[0x65] = () => {
let data = read();
return (glbl[data[0]] || Error)(data[1])
};

currentExtensions[0x69] = (data) => {
// id extension (for structured clones)
let id = dataView.getUint32(position - 4);
if (!referenceMap)
referenceMap = new Map();
let token = src[position];
let target;
// TODO: handle Maps, Sets, and other types that can cycle; this is complicated, because you potentially need to read
// ahead past references to record structure definitions
if (token >= 0x90 && token < 0xa0 || token == 0xdc || token == 0xdd)
target = [];
else
target = {};

let refEntry = { target }; // a placeholder object
referenceMap.set(id, refEntry);
let targetProperties = read(); // read the next value as the target object to id
if (refEntry.used) // there is a cycle, so we have to assign properties to original target
return Object.assign(target, targetProperties)
refEntry.target = targetProperties; // the placeholder wasn't used, replace with the deserialized one
return targetProperties // no cycle, can just use the returned read object
};

currentExtensions[0x70] = (data) => {
// pointer extension (for structured clones)
let id = dataView.getUint32(position - 4);
let refEntry = referenceMap.get(id);
refEntry.used = true;
return refEntry.target
};

currentExtensions[0x73] = () => new Set(read());

const typedArrays = ['Int8','Uint8','Uint8Clamped','Int16','Uint16','Int32','Uint32','Float32','Float64','BigInt64','BigUint64'].map(type => type + 'Array');

currentExtensions[0x74] = (data) => {
let typeCode = data[0];
let typedArrayName = typedArrays[typeCode];
if (!typedArrayName)
throw new Error('Could not find typed array for code ' + typeCode)
// we have to always slice/copy here to get a new ArrayBuffer that is word/byte aligned
return new glbl[typedArrayName](Uint8Array.prototype.slice.call(data, 1).buffer)
};
currentExtensions[0x78] = () => {
let data = read();
return new RegExp(data[0], data[1])
};

currentExtensions[0xff] = (data) => {
// 32-bit date extension
if (data.length == 4)
return new Date((data[0] * 0x1000000 + (data[1] << 16) + (data[2] << 8) + data[3]) * 1000)
else if (data.length == 8)
return new Date(
((data[0] << 22) + (data[1] << 14) + (data[2] << 6) + (data[3] >> 2)) / 1000000 +
((data[3] & 0x3) * 0x100000000 + data[4] * 0x1000000 + (data[5] << 16) + (data[6] << 8) + data[7]) * 1000)
else if (data.length == 12)// TODO: Implement support for negative
return new Date(
((data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3]) / 1000000 +
(((data[4] & 0x80) ? -0x1000000000000 : 0) + data[6] * 0x10000000000 + data[7] * 0x100000000 + data[8] * 0x1000000 + (data[9] << 16) + (data[10] << 8) + data[11]) * 1000)
else
throw new Error('Invalid timestamp length')
}; // notepack defines extension 0 to mean undefined, so use that as the default here
// registration of bulk record definition?
// currentExtensions[0x52] = () =>

function saveState(callback) {
let savedSrcEnd = srcEnd;
let savedPosition = position;
let savedStringPosition = stringPosition;
let savedSrcStringStart = srcStringStart;
let savedSrcStringEnd = srcStringEnd;
let savedSrcString = srcString;
let savedStrings = strings;
let savedReferenceMap = referenceMap;
// TODO: We may need to revisit this if we do more external calls to user code (since it could be slow)
let savedSrc = new Uint8Array(src.slice(0, srcEnd)); // we copy the data in case it changes while external data is processed
let savedStructures = currentStructures;
let savedPackr = currentUnpackr;
let value = callback();
srcEnd = savedSrcEnd;
position = savedPosition;
stringPosition = savedStringPosition;
srcStringStart = savedSrcStringStart;
srcStringEnd = savedSrcStringEnd;
srcString = savedSrcString;
strings = savedStrings;
referenceMap = savedReferenceMap;
src = savedSrc;
currentStructures = savedStructures;
currentUnpackr = savedPackr;
dataView = new DataView(src.buffer, src.byteOffset, src.byteLength);
return value
}
exports.clearSource = clearSource;
function clearSource() {
src = null;
referenceMap = null;
currentStructures = null;
}

exports.addExtension = function(extension) {
currentExtensions[extension.type] = extension.unpack;
};

let mult10 = new Array(147); // this is a table matching binary exponents to the multiplier to determine significant digit rounding
for (let i = 0; i < 256; i++) {
mult10[i] = +('1e' + Math.floor(45.15 - i * 0.30103));
}
exports.mult10 = mult10;
exports.typedArrays = typedArrays;
exports.useRecords = false;
exports.mapsAsObjects = true;
exports.C1 = C1;
exports.C1Type = C1Type;
let defaultUnpackr = new Unpackr({ useRecords: false });
exports.unpack = defaultUnpackr.unpack;
exports.unpackMultiple = defaultUnpackr.unpackMultiple;
exports.decode = defaultUnpackr.unpack;
exports.FLOAT32_OPTIONS = {
NEVER: 0,
ALWAYS: 1,
DECIMAL_ROUND: 3,
DECIMAL_FIT: 4
};
});

const { Unpackr, Decoder: Decoder$1, unpack: unpack$1, unpackMultiple, decode: decode$2, addExtension, C1, mult10, typedArrays, C1Type, FLOAT32_OPTIONS } = unpack;

var unpack$2 = /*#__PURE__*/Object.freeze({
__proto__: null,
Unpackr: Unpackr,
Decoder: Decoder$1,
unpack: unpack$1,
unpackMultiple: unpackMultiple,
decode: decode$2,
addExtension: addExtension,
C1: C1,
mult10: mult10,
typedArrays: typedArrays,
C1Type: C1Type,
FLOAT32_OPTIONS: FLOAT32_OPTIONS
});

var require$$1$1 = /*@__PURE__*/getAugmentedNamespace(unpack$2);

var pack = createCommonjsModule(function (module, exports) {

let Unpackr = require$$1$1.Unpackr;
let mult10 = require$$1$1.mult10;
let C1Type = require$$1$1.C1Type;
const typedArrays = require$$1$1.typedArrays;
let textEncoder;
try {
textEncoder = new TextEncoder();
} catch (error) {}
let extensions, extensionClasses;
const hasNodeBuffer = typeof Buffer !== 'undefined';
const ByteArrayAllocate = hasNodeBuffer ? Buffer.allocUnsafeSlow : Uint8Array;
const ByteArray = hasNodeBuffer ? Buffer : Uint8Array;
const MAX_BUFFER_SIZE = hasNodeBuffer ? 0x100000000 : 0x7fd00000;
let target;
let targetView;
let position = 0;
let safeEnd;
const RECORD_SYMBOL = Symbol('record-id');
class Packr extends Unpackr {
constructor(options) {
super(options);
this.offset = 0;
let start;
let sharedStructures;
let hasSharedUpdate;
let structures;
let referenceMap;
let lastSharedStructuresLength = 0;
let encodeUtf8 = ByteArray.prototype.utf8Write ? function(string, position, maxBytes) {
return target.utf8Write(string, position, maxBytes)
} : (textEncoder && textEncoder.encodeInto) ?
function(string, position) {
  return textEncoder.encodeInto(string, target.subarray(position)).written
} : false;

let packr = this;
let maxSharedStructures = 32;
let isSequential = options && options.sequential;
if (isSequential) {
maxSharedStructures = 0;
this.structures = [];
}
let recordIdsToRemove = [];
let transitionsCount = 0;
let serializationsSinceTransitionRebuild = 0;
if (this.structures && this.structures.length > maxSharedStructures) {
throw new Error('Too many shared structures')
}

this.pack = this.encode = function(value) {
if (!target) {
  target = new ByteArrayAllocate(8192);
  targetView = new DataView(target.buffer, 0, 8192);
  position = 0;
}
safeEnd = target.length - 10;
if (safeEnd - position < 0x800) {
  // don't start too close to the end, 
  target = new ByteArrayAllocate(target.length);
  targetView = new DataView(target.buffer, 0, target.length);
  safeEnd = target.length - 10;
  position = 0;
}
start = position;
referenceMap = packr.structuredClone ? new Map() : null;
sharedStructures = packr.structures;
if (sharedStructures) {
  if (sharedStructures.uninitialized)
    packr.structures = sharedStructures = packr.getStructures();
  let sharedStructuresLength = sharedStructures.length;
  if (sharedStructuresLength >  maxSharedStructures && !isSequential)
    sharedStructuresLength = maxSharedStructures;
  if (!sharedStructures.transitions) {
    // rebuild our structure transitions
    sharedStructures.transitions = Object.create(null);
    for (let i = 0; i < sharedStructuresLength; i++) {
      let keys = sharedStructures[i];
      if (!keys)
        continue
      let nextTransition, transition = sharedStructures.transitions;
      for (let i =0, l = keys.length; i < l; i++) {
        let key = keys[i];
        nextTransition = transition[key];
        if (!nextTransition) {
          nextTransition = transition[key] = Object.create(null);
        }
        transition = nextTransition;
      }
      transition[RECORD_SYMBOL] = i + 0x40;
    }
    lastSharedStructuresLength = sharedStructures.length;
  }
  if (!isSequential)
    sharedStructures.nextId = sharedStructuresLength + 0x40;
}
if (hasSharedUpdate)
  hasSharedUpdate = false;
structures = sharedStructures || [];
try {
  pack(value);
  packr.offset = position; // update the offset so next serialization doesn't write over our buffer, but can continue writing to same buffer sequentially
  if (referenceMap && referenceMap.idsToInsert) {
    position += referenceMap.idsToInsert.length * 6;
    if (position > safeEnd)
      makeRoom(position);
    packr.offset = position;
    let serialized = insertIds(target.subarray(start, position), referenceMap.idsToInsert);
    referenceMap = null;
    return serialized
  }
  return target.subarray(start, position) // position can change if we call pack again in saveStructures, so we get the buffer now
} finally {
  if (sharedStructures) {
    if (serializationsSinceTransitionRebuild < 10)
      serializationsSinceTransitionRebuild++;
    if (transitionsCount > 10000) {
      // force a rebuild occasionally after a lot of transitions so it can get cleaned up
      sharedStructures.transitions = null;
      serializationsSinceTransitionRebuild = 0;
      transitionsCount = 0;
      if (recordIdsToRemove.length > 0)
        recordIdsToRemove = [];
    } else if (recordIdsToRemove.length > 0 && !isSequential) {
      for (let i = 0, l = recordIdsToRemove.length; i < l; i++) {
        recordIdsToRemove[i][RECORD_SYMBOL] = 0;
      }
      recordIdsToRemove = [];
    }
    if (hasSharedUpdate && packr.saveStructures) {
      if (packr.structures.length > maxSharedStructures) {
        packr.structures = packr.structures.slice(0, maxSharedStructures);
      }

      if (packr.saveStructures(packr.structures, lastSharedStructuresLength) === false) {
        // get updated structures and try again if the update failed
        packr.structures = packr.getStructures() || [];
        return packr.pack(value)
      }
      lastSharedStructuresLength = packr.structures.length;
    }
  }
}
};
const pack = (value) => {
if (position > safeEnd)
  target = makeRoom(position);

var type = typeof value;
var length;
if (type === 'string') {
  let strLength = value.length;
  let headerSize;
  // first we estimate the header size, so we can write to the correct location
  if (strLength < 0x20) {
    headerSize = 1;
  } else if (strLength < 0x100) {
    headerSize = 2;
  } else if (strLength < 0x10000) {
    headerSize = 3;
  } else {
    headerSize = 5;
  }
  let maxBytes = strLength * 3;
  if (position + maxBytes > safeEnd)
    target = makeRoom(position + maxBytes);

  if (strLength < 0x40 || !encodeUtf8) {
    let i, c1, c2, strPosition = position + headerSize;
    for (i = 0; i < strLength; i++) {
      c1 = value.charCodeAt(i);
      if (c1 < 0x80) {
        target[strPosition++] = c1;
      } else if (c1 < 0x800) {
        target[strPosition++] = c1 >> 6 | 0xc0;
        target[strPosition++] = c1 & 0x3f | 0x80;
      } else if (
        (c1 & 0xfc00) === 0xd800 &&
        ((c2 = value.charCodeAt(i + 1)) & 0xfc00) === 0xdc00
      ) {
        c1 = 0x10000 + ((c1 & 0x03ff) << 10) + (c2 & 0x03ff);
        i++;
        target[strPosition++] = c1 >> 18 | 0xf0;
        target[strPosition++] = c1 >> 12 & 0x3f | 0x80;
        target[strPosition++] = c1 >> 6 & 0x3f | 0x80;
        target[strPosition++] = c1 & 0x3f | 0x80;
      } else {
        target[strPosition++] = c1 >> 12 | 0xe0;
        target[strPosition++] = c1 >> 6 & 0x3f | 0x80;
        target[strPosition++] = c1 & 0x3f | 0x80;
      }
    }
    length = strPosition - position - headerSize;
  } else {
    length = encodeUtf8(value, position + headerSize, maxBytes);
  }

  if (length < 0x20) {
    target[position++] = 0xa0 | length;
  } else if (length < 0x100) {
    if (headerSize < 2) {
      target.copyWithin(position + 2, position + 1, position + 1 + length);
    }
    target[position++] = 0xd9;
    target[position++] = length;
  } else if (length < 0x10000) {
    if (headerSize < 3) {
      target.copyWithin(position + 3, position + 2, position + 2 + length);
    }
    target[position++] = 0xda;
    target[position++] = length >> 8;
    target[position++] = length & 0xff;
  } else {
    if (headerSize < 5) {
      target.copyWithin(position + 5, position + 3, position + 3 + length);
    }
    target[position++] = 0xdb;
    targetView.setUint32(position, length);
    position += 4;
  }
  position += length;
} else if (type === 'number') {
  if (value >>> 0 === value) {// positive integer, 32-bit or less
    // positive uint
    if (value < 0x40) {
      target[position++] = value;
    } else if (value < 0x100) {
      target[position++] = 0xcc;
      target[position++] = value;
    } else if (value < 0x10000) {
      target[position++] = 0xcd;
      target[position++] = value >> 8;
      target[position++] = value & 0xff;
    } else {
      target[position++] = 0xce;
      targetView.setUint32(position, value);
      position += 4;
    }
  } else if (value >> 0 === value) { // negative integer
    if (value >= -0x20) {
      target[position++] = 0x100 + value;
    } else if (value >= -0x80) {
      target[position++] = 0xd0;
      target[position++] = value + 0x100;
    } else if (value >= -0x8000) {
      target[position++] = 0xd1;
      targetView.setInt16(position, value);
      position += 2;
    } else {
      target[position++] = 0xd2;
      targetView.setInt32(position, value);
      position += 4;
    }
  } else {
    let useFloat32;
    if ((useFloat32 = this.useFloat32) > 0 && value < 0x100000000 && value >= -0x80000000) {
      target[position++] = 0xca;
      targetView.setFloat32(position, value);
      let xShifted;
      if (useFloat32 < 4 ||
        // this checks for  rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
          ((xShifted = value * mult10[((target[position] & 0x7f) << 1) | (target[position + 1] >> 7)]) >> 0) === xShifted) {
        position += 4;
        return
      } else
        position--; // move back into position for writing a double
    }
    target[position++] = 0xcb;
    targetView.setFloat64(position, value);
    position += 8;
  }
} else if (type === 'object') {
  if (!value)
    target[position++] = 0xc0;
  else {
    if (referenceMap) {
      let referee = referenceMap.get(value);
      if (referee) {
        if (!referee.id) {
          let idsToInsert = referenceMap.idsToInsert || (referenceMap.idsToInsert = []);
          referee.id = idsToInsert.push(referee);
        }
        target[position++] = 0xd6; // fixext 4
        target[position++] = 0x70; // "p" for pointer
        targetView.setUint32(position, referee.id);
        position += 4;
        return
      } else 
        referenceMap.set(value, { offset: position - start });
    }
    let constructor = value.constructor;
    if (constructor === Object) {
      writeObject(value, true);
    } else if (constructor === Array) {
      length = value.length;
      if (length < 0x10) {
        target[position++] = 0x90 | length;
      } else if (length < 0x10000) {
        target[position++] = 0xdc;
        target[position++] = length >> 8;
        target[position++] = length & 0xff;
      } else {
        target[position++] = 0xdd;
        targetView.setUint32(position, length);
        position += 4;
      }
      for (let i = 0; i < length; i++) {
        pack(value[i]);
      }
    } else if (constructor === Map) {
      length = value.size;
      if (length < 0x10) {
        target[position++] = 0x80 | length;
      } else if (length < 0x10000) {
        target[position++] = 0xde;
        target[position++] = length >> 8;
        target[position++] = length & 0xff;
      } else {
        target[position++] = 0xdf;
        targetView.setUint32(position, length);
        position += 4;
      }
      for (let [ key, entryValue ] of value) {
        pack(key);
        pack(entryValue);
      }
    } else {	
      for (let i = 0, l = extensions.length; i < l; i++) {
        let extensionClass = extensionClasses[i];
        if (value instanceof extensionClass) {
          let extension = extensions[i];
          let currentTarget = target;
          let currentTargetView = targetView;
          let currentPosition = position;
          target = null;
          let result;
          try {
            result = extension.pack.call(this, value, (size) => {
              // restore target and use it
              target = currentTarget;
              currentTarget = null;
              position += size;
              if (position > safeEnd)
                makeRoom(position);
              return {
                target, targetView, position: position - size
              }
            }, pack);
          } finally {
            // restore current target information (unless already restored)
            if (currentTarget) {
              target = currentTarget;
              targetView = currentTargetView;
              position = currentPosition;
              safeEnd = target.length - 10;
            }
          }
          if (result) {
            position = writeExtensionData(result, target, position, extension.type);
          }
          return
        }
      }
      // no extension found, write as object
      writeObject(value, !value.hasOwnProperty); // if it doesn't have hasOwnProperty, don't do hasOwnProperty checks
    }
  }
} else if (type === 'boolean') {
  target[position++] = value ? 0xc3 : 0xc2;
} else if (type === 'bigint') {
  if (value < (BigInt(1)<<BigInt(63)) && value >= -(BigInt(1)<<BigInt(63))) {
    // use a signed int as long as it fits
    target[position++] = 0xd3;
    targetView.setBigInt64(position, value);
  } else if (value < (BigInt(1)<<BigInt(64)) && value > 0) {
    // if we can fit an unsigned int, use that
    target[position++] = 0xcf;
    targetView.setBigUint64(position, value);
  } else {
    // overflow
    if (this.largeBigIntToFloat) {
      target[position++] = 0xcb;
      targetView.setFloat64(position, Number(value));
    } else {
      throw new RangeError(value + ' was too large to fit in MessagePack 64-bit integer format, set largeBigIntToFloat to convert to float-64')
    }
  }
  position += 8;
} else if (type === 'undefined') {
  //target[position++] = 0xc1 // this is the "never-used" byte
  target[position++] = 0xd4; // a number of implementations use fixext1 with type 0, data 0 to denote undefined, so we follow suite
  target[position++] = 0;
  target[position++] = 0;
} else {
  throw new Error('Unknown type ' + type)
}
};

const writeObject = this.useRecords === false ? this.variableMapSize ? (object) => {
// this method is slightly slower, but generates "preferred serialization" (optimally small for smaller objects)
let keys = Object.keys(object);
let length = keys.length;
if (length < 0x10) {
  target[position++] = 0x80 | length;
} else if (length < 0x10000) {
  target[position++] = 0xde;
  target[position++] = length >> 8;
  target[position++] = length & 0xff;
} else {
  target[position++] = 0xdf;
  targetView.setUint32(position, length);
  position += 4;
}
let key;
for (let i = 0; i < length; i++) {
  pack(key = keys[i]);
  pack(object[key]);
}
} :
(object, safePrototype) => {
target[position++] = 0xde; // always using map 16, so we can preallocate and set the length afterwards
let objectOffset = position - start;
position += 2;
let size = 0;
for (let key in object) {
  if (safePrototype || object.hasOwnProperty(key)) {
    pack(key);
    pack(object[key]);
    size++;
  }
}
target[objectOffset++ + start] = size >> 8;
target[objectOffset + start] = size & 0xff;
} :

/*	sharedStructures ?  // For highly stable structures, using for-in can a little bit faster
(object, safePrototype) => {
let nextTransition, transition = structures.transitions || (structures.transitions = Object.create(null))
let objectOffset = position++ - start
let wroteKeys
for (let key in object) {
  if (safePrototype || object.hasOwnProperty(key)) {
    nextTransition = transition[key]
    if (!nextTransition) {
      nextTransition = transition[key] = Object.create(null)
      nextTransition.__keys__ = (transition.__keys__ || []).concat([key])
      /*let keys = Object.keys(object)
      if 
      let size = 0
      let startBranch = transition.__keys__ ? transition.__keys__.length : 0
      for (let i = 0, l = keys.length; i++) {
        let key = keys[i]
        size += key.length << 2
        if (i >= startBranch) {
          nextTransition = nextTransition[key] = Object.create(null)
          nextTransition.__keys__ = keys.slice(0, i + 1)
        }
      }
      makeRoom(position + size)
      nextTransition = transition[key]
      target.copy(target, )
      objectOffset
    }
    transition = nextTransition
    pack(object[key])
  }
}
let id = transition.id
if (!id) {
  id = transition.id = structures.push(transition.__keys__) + 63
  if (sharedStructures.onUpdate)
    sharedStructures.onUpdate(id, transition.__keys__)
}
target[objectOffset + start] = id
}*/
(object) => {
let keys = Object.keys(object);
let nextTransition, transition = structures.transitions || (structures.transitions = Object.create(null));
let newTransitions = 0;
for (let i =0, l = keys.length; i < l; i++) {
  let key = keys[i];
  nextTransition = transition[key];
  if (!nextTransition) {
    nextTransition = transition[key] = Object.create(null);
    newTransitions++;
  }
  transition = nextTransition;
}
let recordId = transition[RECORD_SYMBOL];
if (recordId) {
  target[position++] = recordId;
} else {
  recordId = structures.nextId++;
  if (!recordId) {
    recordId = 0x40;
    structures.nextId = 0x41;
  }
  if (recordId >= 0x80) {// cycle back around
    structures.nextId = (recordId = maxSharedStructures + 0x40) + 1;
  }
  transition[RECORD_SYMBOL] = recordId;
  structures[0x3f & recordId] = keys;
  if (sharedStructures && sharedStructures.length <= maxSharedStructures) {
    target[position++] = recordId;
    hasSharedUpdate = true;
  } else {
    target[position++] = 0xd4; // fixext 1
    target[position++] = 0x72; // "r" record defintion extension type
    target[position++] = recordId;
    if (newTransitions)
      transitionsCount += serializationsSinceTransitionRebuild * newTransitions;
    // record the removal of the id, we can maintain our shared structure
    if (recordIdsToRemove.length >= 0x40 - maxSharedStructures)
      recordIdsToRemove.shift()[RECORD_SYMBOL] = 0; // we are cycling back through, and have to remove old ones
    recordIdsToRemove.push(transition);
    pack(keys);
  }
}
// now write the values
for (let i =0, l = keys.length; i < l; i++)
  pack(object[keys[i]]);
};
const makeRoom = (end) => {
let newSize;
if (end > 0x1000000) {
  // special handling for really large buffers
  if ((end - start) > MAX_BUFFER_SIZE)
    throw new Error('Packed buffer would be larger than maximum buffer size')
  newSize = Math.min(MAX_BUFFER_SIZE,
    Math.round(Math.max((end - start) * (end > 0x4000000 ? 1.25 : 2), 0x1000000) / 0x1000) * 0x1000);
} else // faster handling for smaller buffers
  newSize = ((Math.max((end - start) << 2, target.length - 1) >> 12) + 1) << 12;
let newBuffer = new ByteArrayAllocate(newSize);
targetView = new DataView(newBuffer.buffer, 0, newSize);
if (target.copy)
  target.copy(newBuffer, 0, start, end);
else
  newBuffer.set(target.slice(start, end));
position -= start;
start = 0;
safeEnd = newBuffer.length - 10;
return target = newBuffer
};
}
useBuffer(buffer) {
// this means we are finished using our own buffer and we can write over it safely
target = buffer;
targetView = new DataView(target.buffer, target.byteOffset, target.byteLength);
position = 0;
}
}
exports.Packr = Packr;

extensionClasses = [ Date, Set, Error, RegExp, ArrayBuffer, Object.getPrototypeOf(Uint8Array.prototype).constructor /*TypedArray*/, C1Type ];
extensions = [{
pack(date, allocateForWrite) {
let seconds = date.getTime() / 1000;
if ((this.useTimestamp32 || date.getMilliseconds() === 0) && seconds >= 0 && seconds < 0x100000000) {
// Timestamp 32
let { target, targetView, position} = allocateForWrite(6);
target[position++] = 0xd6;
target[position++] = 0xff;
targetView.setUint32(position, seconds);
} else if (seconds > 0 && seconds < 0x400000000) {
// Timestamp 64
let { target, targetView, position} = allocateForWrite(10);
target[position++] = 0xd7;
target[position++] = 0xff;
targetView.setUint32(position, date.getMilliseconds() * 4000000 + ((seconds / 1000 / 0x100000000) >> 0));
targetView.setUint32(position + 4, seconds);
} else {
// Timestamp 96
let { target, targetView, position} = allocateForWrite(15);
target[position++] = 0xc7;
target[position++] = 12;
target[position++] = 0xff;
targetView.setUint32(position, date.getMilliseconds() * 1000000);
targetView.setBigInt64(position + 4, BigInt(Math.floor(seconds)));
}
}
}, {
pack(set, allocateForWrite, pack) {
let array = Array.from(set);
if (this.structuredClone) {
let { target, position} = allocateForWrite(3);
target[position++] = 0xd4;
target[position++] = 0x73; // 's' for Set
target[position++] = 0;
}
pack(array);
}
}, {
pack(error, allocateForWrite, pack) {
if (this.structuredClone) {
let { target, position} = allocateForWrite(3);
target[position++] = 0xd4;
target[position++] = 0x65; // 'e' for error
target[position++] = 0;
}
pack([ error.name, error.message ]);
}
}, {
pack(regex, allocateForWrite, pack) {
if (this.structuredClone) {
let { target, position} = allocateForWrite(3);
target[position++] = 0xd4;
target[position++] = 0x78; // 'x' for regeXp
target[position++] = 0;
}
pack([ regex.source, regex.flags ]);
}
}, {
pack(arrayBuffer, allocateForWrite) {
if (this.structuredClone)
writeExtBuffer(arrayBuffer, 0x10, allocateForWrite);
else
writeBuffer(hasNodeBuffer ? Buffer.from(arrayBuffer) : new Uint8Array(arrayBuffer), allocateForWrite);
}
}, {
pack(typedArray, allocateForWrite) {
let constructor = typedArray.constructor;
if (constructor !== ByteArray && this.structuredClone)
writeExtBuffer(typedArray, typedArrays.indexOf(constructor.name), allocateForWrite);
else
writeBuffer(typedArray, allocateForWrite);
}
}, {
pack(c1, allocateForWrite) { // specific 0xC1 object
let { target, position} = allocateForWrite(1);
target[position] = 0xc1;
}
}];

function writeExtBuffer(typedArray, type, allocateForWrite, encode) {
let length = typedArray.byteLength;
if (length + 1 < 0x100) {
var { target, position } = allocateForWrite(4 + length);
target[position++] = 0xc7;
target[position++] = length + 1;
} else if (length + 1 < 0x10000) {
var { target, position } = allocateForWrite(5 + length);
target[position++] = 0xc8;
target[position++] = (length + 1) >> 8;
target[position++] = (length + 1) & 0xff;
} else {
var { target, position, targetView } = allocateForWrite(7 + length);
target[position++] = 0xc9;
targetView.setUint32(position, length + 1); // plus one for the type byte
position += 4;
}
target[position++] = 0x74; // "t" for typed array
target[position++] = type;
target.set(new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength), position);
}
function writeBuffer(buffer, allocateForWrite) {
let length = buffer.byteLength;
var target, position;
if (length < 0x100) {
var { target, position } = allocateForWrite(length + 2);
target[position++] = 0xc4;
target[position++] = length;
} else if (length < 0x10000) {
var { target, position } = allocateForWrite(length + 3);
target[position++] = 0xc5;
target[position++] = length >> 8;
target[position++] = length & 0xff;
} else {
var { target, position, targetView } = allocateForWrite(length + 5);
target[position++] = 0xc6;
targetView.setUint32(position, length);
position += 4;
}
target.set(buffer, position);
}

function writeExtensionData(result, target, position, type) {
let length = result.length;
switch (length) {
case 1:
target[position++] = 0xd4;
break
case 2:
target[position++] = 0xd5;
break
case 4:
target[position++] = 0xd6;
break
case 8:
target[position++] = 0xd7;
break
case 16:
target[position++] = 0xd8;
break
default:
if (length < 0x100) {
  target[position++] = 0xc7;
  target[position++] = length;
} else if (length < 0x10000) {
  target[position++] = 0xc8;
  target[position++] = length >> 8;
  target[position++] = length & 0xff;
} else {
  target[position++] = 0xc9;
  target[position++] = length >> 24;
  target[position++] = (length >> 16) & 0xff;
  target[position++] = (length >> 8) & 0xff;
  target[position++] = length & 0xff;
}
}
target[position++] = type;
target.set(result, position);
position += length;
return position
}

function insertIds(serialized, idsToInsert) {
// insert the ids that need to be referenced for structured clones
let nextId;
let distanceToMove = idsToInsert.length * 6;
let lastEnd = serialized.length - distanceToMove;
idsToInsert.sort((a, b) => a.offset > b.offset ? 1 : -1);
while (nextId = idsToInsert.pop()) {
let offset = nextId.offset;
let id = nextId.id;
serialized.copyWithin(offset + distanceToMove, offset, lastEnd);
distanceToMove -= 6;
let position = offset + distanceToMove;
serialized[position++] = 0xd6;
serialized[position++] = 0x69; // 'i'
serialized[position++] = id >> 24;
serialized[position++] = (id >> 16) & 0xff;
serialized[position++] = (id >> 8) & 0xff;
serialized[position++] = id & 0xff;
lastEnd = offset;
}
return serialized
}

exports.addExtension = function(extension) {
if (extension.Class) {
if (!extension.pack)
throw new Error('Extension has no pack function')
extensionClasses.unshift(extension.Class);
extensions.unshift(extension);
}
require$$1$1.addExtension(extension);
};

let defaultPackr = new Packr({ useRecords: false });
exports.pack = defaultPackr.pack;
exports.encode = defaultPackr.pack;
Object.assign(exports, exports.FLOAT32_OPTIONS = require$$1$1.FLOAT32_OPTIONS);
});

const { Packr, Encoder: Encoder$1, pack: pack$1, encode: encode$2, addExtension: addExtension$1, FLOAT32_OPTIONS: FLOAT32_OPTIONS$1 } = pack;

var pack$2 = /*#__PURE__*/Object.freeze({
__proto__: null,
Packr: Packr,
Encoder: Encoder$1,
pack: pack$1,
encode: encode$2,
addExtension: addExtension$1,
FLOAT32_OPTIONS: FLOAT32_OPTIONS$1
});

var require$$0$3 = /*@__PURE__*/getAugmentedNamespace(pack$2);

var browser = createCommonjsModule(function (module, exports) {
exports.Packr = require$$0$3.Packr;
exports.Encoder = exports.Packr;
exports.Unpackr = require$$1$1.Unpackr;
exports.Decoder = exports.Unpackr;
exports.addExtension = require$$0$3.addExtension;
let packr = new exports.Packr({ useRecords: false });
exports.unpack = packr.unpack;
exports.unpackMultiple = packr.unpackMultiple;
exports.pack = packr.pack;
exports.decode = packr.unpack;
exports.encode = packr.pack;
exports.FLOAT32_OPTIONS = require$$1$1.FLOAT32_OPTIONS;
Object.assign(exports, {
ALWAYS:1,
DECIMAL_ROUND: 3,
DECIMAL_FIT: 4
});
});

var node_fetch_2 = /*@__PURE__*/getAugmentedNamespace(lib$1);

var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
if (k2 === undefined) k2 = k;
Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
if (k2 === undefined) k2 = k;
o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
if (mod && mod.__esModule) return mod;
var result = {};
if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
__setModuleDefault(result, mod);
return result;
};
var __awaiter$2 = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
return new (P || (P = Promise))(function (resolve, reject) {
  function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
  function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
  function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
  step((generator = generator.apply(thisArg, _arguments || [])).next());
});
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
return (mod && mod.__esModule) ? mod : { "default": mod };
};


const startConductor_1$1 = __importDefault(startConductor_1);

const zomeCall_1 = __importStar(zomeCall);
const node_fetch_1 = __importDefault(node_fetch_2);


const msgpackr_1 = __importDefault(browser);
process.env.PATH = `${config.rootPath}:${process.env.PATH}`;
startConductor_1$1.default().then((websocket) => __awaiter$2(void 0, void 0, void 0, function* () {
try {
  let signingPubKey = yield zomeCall_1.pubkey(websocket);
  let holoCodedPubKey = src$2.Codec.AgentId.encode(signingPubKey);
  console.log("Signing with PubKey`:", holoCodedPubKey);
}
catch (e) {
  console.error("Error trying to retrieve public key from conductor:", e);
}
try {
  const FETCH_URL = config.OPS_CONSOLE_API + '/newrecords/' + config.HAPP_NAME;
  const fetch_result = yield node_fetch_1.default(FETCH_URL);
  const body = yield fetch_result.json();
  //const body = testFixture
  console.log("Response from Ops Console API:", body);
  const cert_requests = body.records;
  // @ts-ignore
  const cert_results = [];
  console.log("Got", cert_requests.length, "certificate requests from Ops Console API");
  for (let i = 0; i < cert_requests.length; i++) {
      console.log("Processing request", i);
      const request = cert_requests[i];
      let proofPayload = {};
      // @ts-ignore
      proofPayload.record_locator = request.email;
      // @ts-ignore
      proofPayload.role = request.role;
      const result = yield zomeCall_1.default(websocket, "make_proof", proofPayload);
      if (result.error) {
          console.error("========================");
          console.error("ERROR from Holochain:");
          console.error("========================");
          console.error(result);
      }
      else {
          console.log("========================");
          console.log("Got certificate from Holochain");
          console.log("========================");
          //const json = JSON.stringify(result)
          const msgPack = msgpackr_1.default.pack(result);
          const base64 = Buffer.from(msgPack).toString('base64');
          console.log("++++++++++++++++++++++++");
          console.log("msgpack:", msgPack.toString());
          console.log("++++++++++++++++++++++++");
          console.log("BASE64:", base64);
          console.log("++++++++++++++++++++++++");
          cert_results.push({
              id: request.id,
              certificate: base64,
          });
      }
  }
  const PUT_URL = config.OPS_CONSOLE_API + '/update';
  const putPayload = {
      records: cert_results
  };
  console.log("Posting results back to Ops Console:", putPayload);
  let headers = new node_fetch_2.Headers();
  headers.append("Content-Type", "application/json");
  yield node_fetch_1.default(PUT_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(putPayload),
      redirect: 'follow'
  });
}
catch (e) {
  console.error(e);
}
console.log("Done! Exiting...");
process_1__default['default'].exit(0);
}));

var src$3 = /*#__PURE__*/Object.defineProperty({

}, '__esModule', {value: true});

module.exports = src$3;
//# sourceMappingURL=bundle.js.map
