/**
 * Synthesizes all 13 `zh-CN-YunxiNeural` voiceover clips + WordBoundary timestamps
 * into `audio/*.mp3` and embeds Base64 Data-URIs into `voiceover-data.js` for offline `file://` playback.
 */
const tls = require('tls');
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const CHROMIUM_FULL_VERSION = '134.0.3124.85';
const CHROMIUM_MAJOR = '134';
const WIN_EPOCH = 11644473600;

function fetchServerUnixTime() {
  return new Promise((resolve) => {
    const req = https.get(
      `https://api.msedgeservices.com/tts/cognitiveservices/voices/list?Ocp-Apim-Subscription-Key=${TRUSTED_CLIENT_TOKEN}`,
      (res) => {
        res.resume();
        const dateHdr = res.headers && res.headers.date;
        if (dateHdr) {
          resolve(Math.floor(Date.parse(dateHdr) / 1000));
        } else {
          resolve(Math.floor(Date.now() / 1000));
        }
      }
    );
    req.on('error', () => resolve(Math.floor(Date.now() / 1000)));
  });
}

function generateSecMsGec(unixSeconds) {
  let ticks = unixSeconds + WIN_EPOCH;
  ticks -= ticks % 300;
  const strToHash = (BigInt(ticks) * 10000000n).toString() + TRUSTED_CLIENT_TOKEN;
  return crypto.createHash('sha256').update(strToHash, 'ascii').digest('hex').toUpperCase();
}

function encodeWsTextFrame(str) {
  const payload = Buffer.from(str, 'utf8');
  const mask = crypto.randomBytes(4);
  let header;
  if (payload.length < 126) {
    header = Buffer.alloc(2);
    header[0] = 0x81;
    header[1] = 0x80 | payload.length;
  } else if (payload.length < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 0x80 | 126;
    header.writeUInt16BE(payload.length, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 0x80 | 127;
    header.writeBigUInt64BE(BigInt(payload.length), 2);
  }
  const masked = Buffer.alloc(payload.length);
  for (let i = 0; i < payload.length; i++) {
    masked[i] = payload[i] ^ mask[i % 4];
  }
  return Buffer.concat([header, mask, masked]);
}

function synthesizeYunxi(text, serverUnix, rate = '+6%', pitch = '-2Hz') {
  return new Promise((resolve, reject) => {
    const connId = crypto.randomUUID().replace(/-/g, '');
    const reqId = crypto.randomUUID().replace(/-/g, '');
    const muid = crypto.randomBytes(16).toString('hex').toUpperCase();
    const secMsGec = generateSecMsGec(serverUnix);
    const wsKey = crypto.randomBytes(16).toString('base64');

    const reqPath = `/tts/cognitiveservices/websocket/v1?Ocp-Apim-Subscription-Key=${TRUSTED_CLIENT_TOKEN}&Sec-MS-GEC=${secMsGec}&Sec-MS-GEC-Version=1-${CHROMIUM_FULL_VERSION}&ConnectionId=${connId}`;

    const socket = tls.connect(443, 'api.msedgeservices.com', {
      servername: 'api.msedgeservices.com'
    }, () => {
      const handshake = [
        `GET ${reqPath} HTTP/1.1`,
        'Host: api.msedgeservices.com',
        'Pragma: no-cache',
        'Cache-Control: no-cache',
        'Origin: chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
        `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROMIUM_MAJOR}.0.0.0 Safari/537.36 Edg/${CHROMIUM_MAJOR}.0.0.0`,
        'Accept-Encoding: gzip, deflate, br, zstd',
        'Accept-Language: en-US,en;q=0.9',
        `Cookie: muid=${muid};`,
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Key: ${wsKey}`,
        'Sec-WebSocket-Version: 13',
        '',
        ''
      ].join('\r\n');
      socket.write(handshake);
    });

    let upgraded = false;
    let buf = Buffer.alloc(0);
    const audioChunks = [];
    const wordBoundaries = [];

    function sendSynthesisRequests() {
      const ts = new Date().toISOString();
      const configMsg =
        `X-Timestamp:${ts}\r\n` +
        'Content-Type:application/json; charset=utf-8\r\n' +
        'Path:speech.config\r\n\r\n' +
        JSON.stringify({
          context: {
            synthesis: {
              audio: {
                metadataoptions: { sentenceBoundaryEnabled: 'false', wordBoundaryEnabled: 'true' },
                outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
              }
            }
          }
        });

      const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      const ssml =
        `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='zh-CN'>` +
        `<voice name='zh-CN-YunxiNeural'>` +
        `<prosody pitch='${pitch}' rate='${rate}' volume='+0%'>${escaped}</prosody>` +
        `</voice></speak>`;

      const ssmlMsg =
        `X-RequestId:${reqId}\r\n` +
        'Content-Type:application/ssml+xml\r\n' +
        `X-Timestamp:${ts}Z\r\n` +
        'Path:ssml\r\n\r\n' +
        ssml;

      socket.write(encodeWsTextFrame(configMsg));
      socket.write(encodeWsTextFrame(ssmlMsg));
    }

    socket.on('data', (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      if (!upgraded) {
        const idx = buf.indexOf('\r\n\r\n');
        if (idx === -1) return;
        const head = buf.slice(0, idx).toString('utf8');
        if (!head.includes('101')) {
          socket.destroy();
          return reject(new Error('WS Upgrade failed: ' + head.split('\r\n')[0]));
        }
        upgraded = true;
        buf = buf.slice(idx + 4);
        sendSynthesisRequests();
      }

      while (buf.length >= 2) {
        const b0 = buf[0];
        const b1 = buf[1];
        const opcode = b0 & 0x0f;
        const masked = (b1 & 0x80) !== 0;
        let len = b1 & 0x7f;
        let offset = 2;

        if (len === 126) {
          if (buf.length < 4) return;
          len = buf.readUInt16BE(2);
          offset = 4;
        } else if (len === 127) {
          if (buf.length < 10) return;
          len = Number(buf.readBigUInt64BE(2));
          offset = 10;
        }
        if (masked) offset += 4;
        if (buf.length < offset + len) return;

        const payload = buf.slice(offset, offset + len);
        buf = buf.slice(offset + len);

        if (opcode === 0x01) {
          const txt = payload.toString('utf8');
          if (txt.includes('Path:audio.metadata')) {
            const bodyIdx = txt.indexOf('\r\n\r\n');
            if (bodyIdx !== -1) {
              try {
                const meta = JSON.parse(txt.slice(bodyIdx + 4));
                (meta.Metadata || []).forEach((m) => {
                  if (m.Type === 'WordBoundary' && m.Data) {
                    wordBoundaries.push({
                      offsetSec: +(m.Data.Offset / 10000000).toFixed(3),
                      durSec: +(m.Data.Duration / 10000000).toFixed(3),
                      text: m.Data.text ? m.Data.text.Text : ''
                    });
                  }
                });
              } catch (e) {}
            }
          } else if (txt.includes('Path:turn.end')) {
            socket.end();
            const mp3 = Buffer.concat(audioChunks);
            const estDur = +(mp3.length / 6000).toFixed(3);
            return resolve({ mp3, estDur, wordBoundaries });
          }
        } else if (opcode === 0x02) {
          if (payload.length >= 2) {
            const hlen = payload.readUInt16BE(0);
            const headStr = payload.slice(2, 2 + hlen).toString('utf8');
            if (headStr.includes('Path:audio')) {
              audioChunks.push(payload.slice(2 + hlen));
            }
          }
        } else if (opcode === 0x08) {
          socket.end();
          return resolve({ mp3: Buffer.concat(audioChunks), estDur: 0, wordBoundaries });
        }
      }
    });

    socket.on('error', reject);
  });
}

(async () => {
  const rootDir = path.resolve(__dirname, '..');
  const outDir = path.join(rootDir, 'audio');
  const packPath = path.join(rootDir, 'voiceover-data.js');
  fs.mkdirSync(outDir, { recursive: true });

  const lines = [
    { id: 's01', text: 'AI，到底改变了什么？', rate: '+2%' },
    { id: 's02', text: '它改变了设计——熬几个通宵打磨的草图与光影，现在一句话，就能铺开十种视觉可能。', rate: '+8%' },
    { id: 's03', text: '它改变了编程——死磕半天的报错和底层代码，现在几秒钟，就能跑通上线。', rate: '+8%' },
    { id: 's04', text: '它改变了剪辑——曾经逐帧对齐的抠像、字幕与卡点，现在一眨眼，凌乱素材就能自动成片。', rate: '+8%' },
    { id: 's05', text: '还有翻译、配乐、写作、科研……曾经苦练几年的技术围墙，一夜之间，被推平到了地面。', rate: '+8%' },
    { id: 's06', text: '于是，我们很容易产生一种错觉：一秒能生成万物，就以为自己无所不能。', rate: '+8%', pitch: '-1Hz' },
    { id: 's07', text: '可看看四周：精致却千篇一律的海报，丝滑却毫无灵魂的快剪，跑得通却没人需要的产品……', rate: '+4%', pitch: '-3Hz' },
    { id: 's08', text: '因为 AI 改变的只是怎么做，它从来改变不了做什么——AI，改变不了想法。', rate: '+2%', pitch: '-2Hz' },
    { id: 's09', text: '它能穷举一万种配色、卡准每一个鼓点，却不知道哪一抹颜色、哪一秒留白，能击中人心底的柔软。', rate: '+2%', pitch: '-2Hz' },
    { id: 's10', text: '它有过去所有标准答案的平均值，唯独没有你的偏爱、你的痛感，和那句“如果这样呢？”', rate: '+2%', pitch: '-2Hz' },
    { id: 's11', text: '当做出来越来越廉价，一个真正的好想法，才变得前所未有地昂贵。', rate: '+0%', pitch: '-2Hz' },
    { id: 's12', text: '别把工具的全能，误当成自己的全能。AI 是最强的引擎，但握住方向盘的人，是你。', rate: '+2%', pitch: '-2Hz' },
    { id: 's13', text: '去创造，只有你想得到的东西吧。', rate: '-2%', pitch: '-2Hz' }
  ];

  let existing = {};
  if (fs.existsSync(packPath)) {
    const raw = fs.readFileSync(packPath, 'utf8');
    const eqIdx = raw.indexOf('=');
    if (eqIdx !== -1) {
      try {
        existing = JSON.parse(raw.slice(eqIdx + 1).trim().replace(/;$/, ''));
      } catch (e) {}
    }
  }

  const serverUnix = await fetchServerUnixTime();
  const manifest = Object.assign({}, existing);
  for (const item of lines) {
    if (manifest[item.id] && manifest[item.id].text === item.text) {
      console.log(`[${item.id}] cached (${manifest[item.id].duration}s)`);
      continue;
    }
    const res = await synthesizeYunxi(item.text, serverUnix, item.rate, item.pitch || '-2Hz');
    fs.writeFileSync(path.join(outDir, `${item.id}-yunxi.mp3`), res.mp3);
    manifest[item.id] = {
      text: item.text,
      duration: res.estDur,
      words: res.wordBoundaries,
      dataUri: 'data:audio/mp3;base64,' + res.mp3.toString('base64')
    };
  }

  const jsOut =
    '/**\n' +
    ' * Offline Neural TTS Voiceover Pack (Microsoft zh-CN-YunxiNeural · 云希男声)\n' +
    ' * Embedded as Base64 Data-URIs for zero-CORS offline file:// Web Audio playback\n' +
    ' */\n' +
    'window.VOICEOVER_PACK = ' + JSON.stringify(manifest, null, 2) + ';\n';

  fs.writeFileSync(packPath, jsOut, 'utf8');
  console.log('VOICEOVER_PACK_WRITTEN_SUCCESSFULLY');
})();
