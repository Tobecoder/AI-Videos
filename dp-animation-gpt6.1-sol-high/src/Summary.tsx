import {useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Frame,Heading,mono,pop,progress} from './shared';
export const Summary=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const t=f/fps;
 return <Frame number="04" chapter="记住这三步"><Heading eyebrow="DYNAMIC PROGRAMMING" sub="先定义，再递推，从初始值一路填过去。">DP，三步走。</Heading>
 {[
 {n:'01',title:'定义状态',line:'dp[i] 是什么？',body:'到第 i 阶的走法数',color:C.cyan},
 {n:'02',title:'状态转移',line:'答案从哪里来？',body:'dp[i−1] + dp[i−2]',color:C.pink},
 {n:'03',title:'初始值 + 填表',line:'从已知，推到未知。',body:'1 → 1 → 2 → 3 → …',color:C.yellow},
 ].map((card,j)=><div key={j} style={{position:'absolute',left:108+j*582,top:435,width:542,height:365,background:'#121f30',border:`2px solid ${card.color}80`,borderRadius:28,padding:36,boxSizing:'border-box',scale:pop(f,fps,.25+j*.65),translate:`0px ${(1-pop(f,fps,.25+j*.65))*100}px`}}><div style={{fontFamily:mono,fontSize:39,color:card.color}}>{card.n}<span style={{float:'right',fontSize:37}}>↗</span></div><div style={{fontSize:j===2?43:49,fontWeight:800,marginTop:38,whiteSpace:'nowrap'}}>{card.title}</div><div style={{fontSize:30,color:C.muted,marginTop:23}}>{card.line}</div><div style={{fontFamily:j>0?mono:undefined,fontSize:27,color:card.color,marginTop:25}}>{j===1?<><span style={{color:C.cyan}}>dp[i−1]</span><span style={{color:C.muted}}> + </span><span style={{color:C.pink}}>dp[i−2]</span></>:card.body}</div></div>)}
 <div style={{position:'absolute',top:866,width:'100%',textAlign:'center',fontSize:42,color:C.green,opacity:progress(t,2.55,2.9)}}>把重复计算，变成答案复用。</div></Frame>;
};

