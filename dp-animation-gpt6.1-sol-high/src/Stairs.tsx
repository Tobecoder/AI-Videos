import {useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Frame,Heading,clamp,mono,pop,progress} from './shared';
export const jumpStarts=[1.25,2.1,3.0,3.8];
const route=[0,1,3,4,5];
export const Stairs=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const t=f/fps;
 let step=0;let x=405;let y=801;let squash=0;
 for(let j=0;j<4;j++){
  if(t<jumpStarts[j])break;
  const p=clamp((t-jumpStarts[j])/.53);const a=route[j];const b=route[j+1];
  x=405+((1-p)*a+p*b)*225;y=801-((1-p)*a+p*b)*84-170*Math.sin(Math.PI*p);step=j+1;
  const land=t-jumpStarts[j]-.53;squash=land>=0?.26*Math.exp(-land*13)*Math.cos(land*29):-.1*Math.sin(p*Math.PI);
 }
 return <Frame number="01" chapter="爬楼梯问题">
 <Heading eyebrow="从一个问题开始" sub="每次走 1 或 2 阶，到终点有多少种走法？">爬楼梯，有几种走法？</Heading>
 <div style={{position:'absolute',left:120,top:466,fontSize:25,color:C.muted}}>一种走法</div>
 <div style={{position:'absolute',left:120,top:518,display:'flex',gap:16,fontFamily:mono,fontSize:33}}>{['+1','+2','+1','+1'].map((s,i)=><span key={i} style={{color:i<step?C.yellow:C.muted,opacity:i<step?1:.35}}>{s}</span>)}</div>
 <svg width="1920" height="1080" style={{position:'absolute'}}>
 <path d="M 320 844 H 1640" stroke={C.line} strokeWidth="2"/>
 {[1,2,3,4,5].map(n=>{const rise=pop(f,fps,.12+n*.12);const top=844-n*84;const sx=405+n*225-100;return <g key={n} style={{translate:`0px ${(1-rise)*180}px`,opacity:clamp(rise)}}><rect x={sx} y={top} width="210" height={n*84} rx="12" fill="#142538" stroke="#344d61" strokeWidth="2"/><path d={`M ${sx+12} ${top} H ${sx+198}`} stroke={n===5?C.yellow:C.cyan} strokeWidth="5"/><text x={sx+105} y={top+50} textAnchor="middle" fill={C.muted} fontFamily={mono} fontSize="27">{n}</text></g>;})}
 <ellipse cx={x} cy={844-route[step]*84-5} rx={33*(1+squash)} ry="7" fill={C.yellow} opacity=".2"/>
 <ellipse cx={x} cy={y+43*squash} rx={43*(1+squash)} ry={43*(1-squash)} fill={C.yellow}/><ellipse cx={x-12} cy={y-15+43*squash} rx="10" ry="7" fill="#fff8df" opacity=".7"/>
 {jumpStarts.map((s,j)=>{const p=progress(t,s,s+.85);return t>=s&&t<s+.85?<g key={j} opacity={1-p}><text x={405+route[j+1]*225} y={844-route[j+1]*84-160-65*p} fill={C.green} textAnchor="middle" fontSize="46" fontFamily={mono}>{j===1?'+2':'+1'}</text></g>:null;})}
 <path d="M 1570 325 V 410 M 1570 325 l 67 18 l -67 20" stroke={C.green} fill={`${C.green}22`} strokeWidth="4" opacity={progress(t,.8,1.1)}/>
 </svg>
 <div style={{position:'absolute',left:108,bottom:114,fontSize:36,color:t>4.5?C.yellow:C.muted}}>{t>4.5?'关键：最后一步，从哪里来？':'+1、+2、+1、+1，只是其中一种。'}</div>
 </Frame>;
};
