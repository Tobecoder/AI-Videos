import {useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Frame,Heading,mono,progress} from './shared';
type Node={n:number;x:number;y:number;depth:number;parent?:number};
const nodes:Node[]=[];
const grow=(n:number,x:number,depth:number,span:number,parent?:number)=>{const index=nodes.length;nodes.push({n,x,y:355+depth*116,depth,parent});if(n>1){grow(n-1,x-span,depth+1,span/2,index);grow(n-2,x+span,depth+1,span/2,index);}};
grow(5,960,0,400);
export const Recursion=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const t=f/fps;
 return <Frame number="02" chapter="暴力递归">
 <Heading eyebrow="先试试：递归">同一个问题，反复计算。</Heading>
 <div style={{position:'absolute',left:110,top:264,fontSize:38,fontFamily:mono}}><span style={{color:C.yellow}}>f(n)</span> = <span style={{color:C.cyan}}>f(n−1)</span> + <span style={{color:C.pink}}>f(n−2)</span></div>
 <svg width="1920" height="1080" style={{position:'absolute'}}>{nodes.map((n,i)=>{
 const show=progress(t,.25+n.depth*.42,.55+n.depth*.42);const p=n.parent===undefined?null:nodes[n.parent];const duplicate=(n.n===3||n.n===2)&&t>2.55;const color=duplicate?C.green:n.depth===0?C.yellow:'#687e9d';
 return <g key={i}>{p&&<path d={`M ${p.x} ${p.y+30} C ${p.x} ${p.y+70}, ${n.x} ${n.y-70}, ${n.x} ${n.y-30}`} stroke={C.line} strokeWidth="3" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1-show}/>} {duplicate&&<rect x={n.x-58} y={n.y-37} width="116" height="74" rx="25" fill="none" stroke={color} strokeWidth="3" opacity={.28+.24*Math.sin(t*10)}/>}<g opacity={show} style={{translate:`0px ${(1-show)*-20}px`}}><rect x={n.x-49} y={n.y-29} width="98" height="58" rx="18" fill={duplicate?'#19352e':'#111c2c'} stroke={color} strokeWidth="2"/><text x={n.x} y={n.y+11} textAnchor="middle" fontFamily={mono} fontSize="30" fill={duplicate?C.green:C.ink}>f({n.n})</text></g></g>;
 })}</svg>
 <div style={{position:'absolute',right:120,top:272,fontFamily:mono,fontSize:42,color:C.pink,opacity:progress(t,3.25,3.55)}}>O(2ⁿ)</div>
 <div style={{position:'absolute',left:110,bottom:112,fontSize:35,opacity:progress(t,2.45,2.75)}}><span style={{color:C.green}}>f(3)、f(2) 又算了一遍</span><span style={{color:C.muted}}>　→　规模越大，重复越多。</span></div>
 </Frame>;
};
