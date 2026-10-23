// 无头冒烟测试：模拟 canvas / DOM，按时序逐帧调用 render，捕获运行期异常
const fs = require('fs');
const html = fs.readFileSync('dp-30s.html', 'utf8');
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1] + '\nglobalThis.__render = render; globalThis.__ev = EVENTS; globalThis.__tree = TREE;';

let calls = 0;
function mkCtx() {
  const grad = { addColorStop() {} };
  const c = new Proxy({
    canvas: { width: 1280, height: 720 },
    measureText: s => ({ width: String(s).length * 12 }),
    createLinearGradient: () => grad,
    createRadialGradient: () => grad,
    createPattern: () => grad,
    getImageData: () => ({ data: [] }),
    setTransform() {}, save() {}, restore() {}
  }, {
    get(t, k) {
      if (k in t) return t[k];
      // 任何未定义的方法都当作绘图指令
      return function () { calls++; };
    },
    set(t, k, v) { t[k] = v; return true; }
  });
  return c;
}

const stubEl = () => ({
  addEventListener() {}, style: {}, classList: { add() {}, remove() {} },
  textContent: '', getBoundingClientRect: () => ({ left: 0, top: 0, width: 400, height: 5 })
});

const ctxMock = mkCtx();
global.document = { getElementById: () => stubEl() };
global.cv = null;
global.window = { devicePixelRatio: 2, addEventListener() {}, AudioContext: undefined };
global.requestAnimationFrame = () => 0;
global.performance = { now: () => 0 };

// 用 wrapper 提供 cv 变量
const wrapper = `
(function(){
  const __cv = { width:0, height:0, getContext: () => __CTX, addEventListener(){}, style:{} };
  globalThis.__CTX = __CTX;
  __cv.getContext = () => __CTX;
  const document = globalThis.document;
  const window = globalThis.window;
  const requestAnimationFrame = globalThis.requestAnimationFrame;
  const performance = globalThis.performance;
  const __origGet = document.getElementById;
  document.getElementById = (id) => id === 'cv' ? __cv : __origGet(id);
  ${code.replace(/const cv = document\.getElementById\('cv'\);/, 'const cv = __cv;')}
})();
`;

global.__CTX = ctxMock;
try {
  eval(wrapper);
} catch (e) {
  console.error('BOOT ERROR:', e && e.stack || e);
  process.exit(1);
}

console.log('EVENTS:', global.__ev.length, '| TREE nodes:', global.__tree.nodes.length,
            '| TREE edges:', global.__tree.edges.length);

let frames = 0, errs = 0;
for (let t = 0; t <= 30.0001; t += 1 / 30) {
  try { global.__render(Math.min(t, 30)); frames++; }
  catch (e) {
    errs++;
    if (errs <= 5) console.error('RENDER ERROR @' + t.toFixed(2) + 's ->', e.message);
  }
}
console.log('FRAMES:', frames, 'ERRORS:', errs, 'DRAWCALLS:', calls);

// 关键时间点抽查
[0, 1.8, 3.4, 4.2, 5.6, 8.4, 9.6, 11.9, 13.2, 14.3, 15.6, 17.8, 20.4, 22.9, 24.9, 26.2, 28.9, 29.8]
  .forEach(t => {
    try { global.__render(t); } catch (e) { console.error('KEYFRAME FAIL @' + t, e.message); errs++; }
  });
console.log(errs === 0 ? 'ALL KEYFRAMES OK' : 'KEYFRAME ERRORS: ' + errs);
