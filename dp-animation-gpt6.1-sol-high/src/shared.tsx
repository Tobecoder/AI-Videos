import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
export const C = {bg:'#090e1c',ink:'#f1f5ff',muted:'#94a3be',cyan:'#56e5e0',pink:'#ff83b7',yellow:'#ffe18a',green:'#a3efaa',line:'#27344e'};
export const font='"Microsoft YaHei", "PingFang SC", sans-serif';
export const mono='"Cascadia Code", Consolas, monospace';
export const clamp=(x:number)=>Math.min(1,Math.max(0,x));
export const progress=(t:number,start:number,end:number)=>clamp((t-start)/(end-start));
export const pop=(frame:number,fps:number,delay=0)=>spring({frame:frame-delay*fps,fps,config:{damping:14,stiffness:180,mass:.7}});
export const Frame:React.FC<{children:React.ReactNode;chapter?:string;number?:string}>=({children,chapter,number})=>{
 const frame=useCurrentFrame();const {fps,durationInFrames}=useVideoConfig();
 return <AbsoluteFill style={{background:C.bg,color:C.ink,fontFamily:font,overflow:'hidden'}}>
 <AbsoluteFill style={{background:'radial-gradient(ellipse at 78% 20%, #18333e70, transparent 53%), radial-gradient(ellipse at 10% 95%, #3d214c50, transparent 45%)'}}/>
 <AbsoluteFill style={{opacity:.2,backgroundImage:'radial-gradient(#56647d 1px, transparent 1px)',backgroundSize:'32px 32px'}}/>
 <div style={{position:'absolute',left:96,right:96,top:57,display:'flex',justifyContent:'space-between',color:C.muted,fontSize:22,letterSpacing:3}}><span>ALGORITHM / 动态规划</span><span>{number} {chapter}</span></div>
 <AbsoluteFill style={{opacity:interpolate(frame,[0,.16*fps,durationInFrames-.12*fps,durationInFrames-1],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>{children}</AbsoluteFill>
 <div style={{position:'absolute',left:96,right:96,bottom:52,height:2,background:C.line}}/>
 </AbsoluteFill>;
};
export const Heading:React.FC<{eyebrow:string;children:React.ReactNode;sub?:string}>=({eyebrow,children,sub})=><div style={{position:'absolute',left:108,top:136}}><div style={{fontSize:24,letterSpacing:5,color:C.green,marginBottom:16}}>{eyebrow}</div><div style={{fontSize:76,lineHeight:1.2,fontWeight:800,letterSpacing:-2}}>{children}</div>{sub&&<div style={{fontSize:32,marginTop:20,color:C.muted}}>{sub}</div>}</div>;
export const Legend=()=> <div style={{position:'absolute',right:110,top:168,display:'flex',gap:30,fontFamily:mono,fontSize:24}}><span style={{color:C.cyan}}>● i−1</span><span style={{color:C.pink}}>● i−2</span><span style={{color:C.yellow}}>● 当前 i</span></div>;
