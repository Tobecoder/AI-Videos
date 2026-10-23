import {useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Frame,Heading,Legend,mono,pop,progress} from './shared';
export const values=[1,1,2,3,5,8,13,21];
export const fillTimes=[.65,1.5,2.7,3.9,5,5.95,6.75,7.4];
const cx=(i:number)=>218+i*212;
export const Table=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const t=f/fps;
 const active=fillTimes.reduce((a,v,i)=>t>=v?i:a,-1);const i=Math.max(2,active);const final=t>=8.35;const age=t-(fillTimes[active]??0);
 return <Frame number="03" chapter="DP 填表">
 <Heading eyebrow="换个思路：每个答案，只算一次" sub="dp[i]：到第 i 阶的走法数">存下来，接着算。</Heading><Legend/>
 <div style={{position:'absolute',top:344,width:'100%',textAlign:'center',fontFamily:mono,fontSize:55}}><span style={{color:C.yellow}}>dp[i]</span> = <span style={{color:C.cyan}}>dp[i−1]</span> + <span style={{color:C.pink}}>dp[i−2]</span></div>
 <svg width="1920" height="1080" style={{position:'absolute'}}><defs><marker id="cyan-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={C.cyan}/></marker><marker id="pink-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={C.pink}/></marker></defs>
 {active>=2&&!final&&<g><path d={`M ${cx(i-2)} 557 C ${cx(i-2)} 429, ${cx(i)} 429, ${cx(i)} 557`} fill="none" stroke={C.pink} strokeWidth="5" markerEnd="url(#pink-arrow)" pathLength="1" strokeDasharray="1" strokeDashoffset={1-progress(age,0,.25)}/><path d={`M ${cx(i-1)} 735 C ${cx(i-1)} 820, ${cx(i)} 820, ${cx(i)} 739`} fill="none" stroke={C.cyan} strokeWidth="5" markerEnd="url(#cyan-arrow)" pathLength="1" strokeDasharray="1" strokeDashoffset={1-progress(age,0,.25)}/></g>}
 {values.map((v,j)=>{const filled=j<=active;const current=j===active;const col=final?C.green:current?C.yellow:j===active-1?C.cyan:j===active-2?C.pink:C.line;return <g key={j}><rect x={cx(j)-88} y="563" width="176" height="156" rx="24" fill={current?'#393322':filled?'#142532':'#10192a'} stroke={col} strokeWidth={current?4:2}/><text x={cx(j)} y="700" fill={current?C.yellow:C.muted} fontFamily={mono} fontSize="26" textAnchor="middle">{`dp[${j}]`}</text>{filled&&<g style={{transformOrigin:`${cx(j)}px 641px`,scale:pop(f,fps,fillTimes[j])}}><text x={cx(j)} y="663" textAnchor="middle" fill={col===C.line?C.ink:col} fontFamily={mono} fontWeight="700" fontSize="70">{v}</text></g>}{!filled&&<text x={cx(j)} y="661" textAnchor="middle" fill="#35425b" fontFamily={mono} fontSize="42">·</text>}</g>;})}</svg>
 <div style={{position:'absolute',top:833,width:'100%',textAlign:'center',fontFamily:mono,fontSize:54}}>{active<2?<span style={{color:C.yellow,fontSize:39}}>{active<0?'先确定初始值':active===0?'dp[0] = 1（不走，也算一种）':'dp[0] = 1，dp[1] = 1'}</span>:<><span style={{color:C.cyan}}>{values[i-1]}</span><span style={{color:C.muted}}> + </span><span style={{color:C.pink}}>{values[i-2]}</span><span style={{color:C.muted}}> = </span><span style={{color:C.yellow}}>{values[i]}</span></>}</div>
 <div style={{position:'absolute',top:930,width:'100%',textAlign:'center',fontSize:30,color:final?C.green:C.muted}}>{final?'7 阶楼梯 = 21 种走法　·　时间复杂度 O(n)':'从左到右，把前两格的答案相加。'}</div>
 </Frame>;
};


