import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const dir=fileURLToPath(new URL('./public/',import.meta.url));
const rate=48000;const seconds=30;const samples=new Float64Array(rate*seconds*2);
const events=[];
function tone(at,freq,duration=.22,gain=.17,pan=0,end=freq){
 events.push({kind:'tone',at,freq,end,duration});
 for(let j=0;j<duration*rate;j++){
  const t=j/rate;const p=t/duration;const attack=Math.min(1,t/.008);const env=attack*Math.exp(-p*5)*(1-p);
  const phase=2*Math.PI*(freq*t+(end-freq)*t*t/(2*duration));
  const v=(Math.sin(phase)+.24*Math.sin(phase*2)+.1*Math.sin(phase*3))*env*gain;
  const k=(Math.round(at*rate)+j)*2;if(k>=samples.length)break;
  samples[k]+=v*Math.sqrt((1-pan)/2);samples[k+1]+=v*Math.sqrt((1+pan)/2);
 }
}
function whoosh(at){
 events.push({kind:'whoosh',at});let seed=137;
 for(let j=0;j<rate*.26;j++){
  const p=j/(rate*.26);seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  const v=((seed/4294967296)*2-1)*Math.sin(Math.PI*p)**2*.055;
  const k=(Math.round(at*rate)+j)*2;if(k>=samples.length)break;samples[k]+=v*(1-p);samples[k+1]+=v*p;
 }
}
tone(.12,420,.26,.21,0,760);tone(.48,1046,.28,.08,-.25);tone(.83,1318,.25,.06,.25);
for(const at of [3.5,9,14.5,24])whoosh(at);
for(let i=1;i<=5;i++)tone(3.5+.12+i*.12,210+i*40,.13,.09,(i-3)*.2);
for(const [i,s]of [1.25,2.1,3,3.8].entries()){
 tone(3.5+s,330+i*65,.23,.13,-.35+i*.2,690+i*65);
 tone(3.5+s+.53,145+i*30,.17,.18,-.35+i*.2,90+i*20);
}
for(let d=0;d<5;d++)tone(9+.25+d*.42,500-d*45,.14,.11,0);
for(const s of [2.55,3.15,3.75]){tone(9+s,740,.17,.085,-.4);tone(9+s+.08,740,.17,.085,.4);}
const times=[.65,1.5,2.7,3.9,5,5.95,6.75,7.4];const notes=[523.25,587.33,659.25,783.99,880,1046.5,1174.66,1318.51];
times.forEach((s,i)=>tone(14.5+s,notes[i],i===7?.75:.32,.21,-.7+i*.2));
for(const f of [523.25,659.25,783.99,1046.5])tone(21.9,f,1.1,.065,0);
for(const [i,s]of [.25,.9,1.55].entries())tone(24+s,[659.25,783.99,1046.5][i],.3,.19,(i-1)*.5);
for(const f of [261.63,392,523.25,659.25])tone(26.65,f,1.1,.065,0);
const peak=Math.max(...[0]);let max=peak;for(const v of samples)max=Math.max(max,Math.abs(v));
const gain=max>.85?.85/max:1;const wav=Buffer.alloc(44+samples.length*2);
wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(2,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*4,28);wav.writeUInt16LE(4,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples.length*2,40);
samples.forEach((v,i)=>wav.writeInt16LE(Math.round(v*gain*32767),44+i*2));
await mkdir(dir,{recursive:true});await writeFile(new URL('./public/sfx.wav',import.meta.url),wav);
await writeFile(new URL('./public/sfx-events.json',import.meta.url),JSON.stringify({rate,channels:2,seconds,peak:max*gain,events},null,2)+'\n');
console.log(`Generated ${seconds}s stereo WAV, ${events.length} events, peak ${(max*gain).toFixed(3)}`);
