import {useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Frame,mono,pop,progress} from './shared';
export const Title=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const t=f/fps;
 return <Frame number="00" chapter="30 SECOND LESSON">
 {[1,1,2,3,5,8,13,21,34,55,89,144].map((n,i)=><div key={i} style={{position:'absolute',left:100+(i*163)%1720,top:180+(i*219)%730-28*t,fontFamily:mono,fontSize:45+(i%3)*27,color:[C.cyan,C.pink,C.green][i%3],opacity:.09+.035*Math.sin(t+i),rotate:`${i%2?10:-12}deg`}}>{n}</div>)}
 {[0,.35,.7].map((d,i)=><div key={i} style={{position:'absolute',left:960,top:515,width:360,height:360,margin:-180,border:`2px solid ${i===1?C.pink:C.cyan}`,borderRadius:'50%',scale:.7+2.7*progress(t,d,d+2.1),opacity:.26*(1-progress(t,d,d+2.1))}}/>)}
 <div style={{position:'absolute',top:267,width:'100%',textAlign:'center',scale:pop(f,fps,.12)}}><div style={{fontFamily:mono,fontSize:27,letterSpacing:9,color:C.cyan,marginBottom:34}}>DYNAMIC PROGRAMMING</div><div style={{fontSize:164,fontWeight:900,letterSpacing:-8,lineHeight:1.1}}>动态规划</div><div style={{fontSize:66,fontWeight:700,color:C.yellow,marginTop:22}}>· 30秒入门 ·</div></div>
 <div style={{position:'absolute',top:748,width:'100%',textAlign:'center',fontSize:35,color:C.muted,opacity:progress(t,.8,1.2)}}>把算过的答案，留给下一步。</div>
 <div style={{position:'absolute',top:850,width:'100%',textAlign:'center',fontFamily:mono,fontSize:27,letterSpacing:8,color:C.green,opacity:progress(t,1.5,1.8)}}>1　1　2　3　5　8　13　21</div>
 </Frame>;
};
