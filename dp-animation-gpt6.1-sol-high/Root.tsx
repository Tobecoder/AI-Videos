import {Audio} from '@remotion/media';
import {AbsoluteFill,Composition,Folder,Sequence,staticFile,useVideoConfig} from 'remotion';
import {Title} from './src/Title';
import {Stairs} from './src/Stairs';
import {Recursion} from './src/Recursion';
import {Table} from './src/Table';
import {Summary} from './src/Summary';
export const DP30=()=>{
 const {fps}=useVideoConfig();
 return <AbsoluteFill>
 <Sequence name="标题 · 波纹与斐波那契" from={0} durationInFrames={3.5*fps} premountFor={fps}><Title/></Sequence>
 <Sequence name="问题 · 小球爬楼梯" from={3.5*fps} durationInFrames={5.5*fps} premountFor={fps}><Stairs/></Sequence>
 <Sequence name="暴力递归 · 重复子问题" from={9*fps} durationInFrames={5.5*fps} premountFor={fps}><Recursion/></Sequence>
 <Sequence name="动态规划 · 逐格填表" from={14.5*fps} durationInFrames={9.5*fps} premountFor={fps}><Table/></Sequence>
 <Sequence name="总结 · DP 三步走" from={24*fps} durationInFrames={6*fps} premountFor={fps}><Summary/></Sequence>
 <Audio src={staticFile('sfx.wav')} premountFor={fps} volume={.82}/>
 </AbsoluteFill>;
};
export const Root=()=> <>
 <Composition id="DP-30s" component={DP30} width={1920} height={1080} fps={60} durationInFrames={1800}/>
 <Folder name="Scenes">
 <Composition id="DP30-Title" component={Title} width={1920} height={1080} fps={60} durationInFrames={210}/>
 <Composition id="DP30-Stairs" component={Stairs} width={1920} height={1080} fps={60} durationInFrames={330}/>
 <Composition id="DP30-Recursion" component={Recursion} width={1920} height={1080} fps={60} durationInFrames={330}/>
 <Composition id="DP30-Table" component={Table} width={1920} height={1080} fps={60} durationInFrames={570}/>
 <Composition id="DP30-Summary" component={Summary} width={1920} height={1080} fps={60} durationInFrames={360}/>
 </Folder>
 </>;


