import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {getCompositions,openBrowser,renderStill} from '@remotion/renderer';
const episode=path.dirname(fileURLToPath(import.meta.url));const root=path.resolve(episode,'../..');
const output=path.join(root,'.verification/dp-30s');await mkdir(output,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(episode,'index.tsx'),publicDir:path.join(episode,'public'),outDir:path.join(output,'bundle')});
const browser=await openBrowser('chrome',{browserExecutable:process.env.REMOTION_BROWSER_EXECUTABLE||path.join(root,'.verification/browser/chrome-headless-shell.exe')});
try{
 const compositions=await getCompositions(serveUrl,{puppeteerInstance:browser,port:3364});
 const composition=compositions.find(c=>c.id==='DP-30s');assert.ok(composition);assert.equal(composition.durationInFrames,1800);assert.equal(composition.fps,60);
 const audio=await readFile(path.join(episode,'public/sfx.wav'));assert.equal(audio.readUInt32LE(24),48000);assert.equal(audio.readUInt16LE(22),2);assert.equal(audio.readUInt32LE(40)/192000,30);
 const frames=[60,360,507,770,1040,1170,1335,1635,1740];
 for(const frame of frames){await renderStill({serveUrl,composition,frame,puppeteerInstance:browser,port:3364,output:path.join(output,`frame-${frame}.png`),imageFormat:'png'});console.log(`Frame ${frame} OK`);}
 await writeFile(path.join(output,'report.json'),JSON.stringify({composition:composition.id,width:composition.width,height:composition.height,fps:composition.fps,durationInFrames:composition.durationInFrames,frames,audio:{seconds:30,rate:48000,channels:2}},null,2));
}finally{await browser.close({silent:true});}
