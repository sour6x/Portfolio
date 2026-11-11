import React, {useEffect, useMemo, useRef, useState} from 'react';
import './roots.css';

const clamp = n => Math.max(0, Math.min(1, n));
const point = (x,y) => ({x,y});
function route(points, start, end, kind='branch') {
 const segments=points.slice(1).map((p,i)=>Math.hypot(p.x-points[i].x,p.y-points[i].y));
 return {points,segments,length:segments.reduce((a,b)=>a+b,0),start,end,kind,
  d:points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')};
}
function along(path,progress) {
 let distance=path.length*clamp(progress);
 for(let i=0;i<path.segments.length;i++) {
  if(distance<=path.segments[i]||i===path.segments.length-1) {
   const fraction=path.segments[i]?distance/path.segments[i]:0,a=path.points[i],b=path.points[i+1];
   return point(a.x+(b.x-a.x)*fraction,a.y+(b.y-a.y)*fraction);
  }
  distance-=path.segments[i];
 }
 return path.points[0];
}
function makeRoots(width,height) {
 if(!width||!height)return [];
 const small=width<700, spacing=small?330:360, edge=small?18:28;
 const spine=[point(width*.07,0),point(width*.07,85)];
 let previous=spine[1];
 for(let y=310,i=0;y<height;y+=spacing,i++) {
  const x=width*(.5+Math.sin(i*1.8)*.1), bend=Math.abs(x-previous.x);
  const next=point(x,Math.max(y,previous.y+bend+36));
   if(next.y>=height){spine.push(point(previous.x,height));previous=spine.at(-1);break;}
  spine.push(point(previous.x,next.y-bend),next);previous=next;
 }
 if(previous.y<height)spine.push(point(previous.x,height));
 const trunk=route(spine,0,height,'trunk'),paths=[trunk];
 // Forks share real junctions with the trunk; each fork seeds a smaller root.
 for(let i=3;i<spine.length-1;i+=2) {
  const source=spine[i], band=(i-3)/2;
  if(source.y>=height-130)continue;
  for(const direction of [-1,1]) {
   const target=direction<0?edge+(band%3)*width*.035:width-edge-(band%3)*width*.035;
   const dx=Math.abs(target-source.x), diagonal=Math.min(dx*.52,small?90:140);
   const finish=Math.min(height,source.y+diagonal+(small?100:155));
   const points=[source,point(source.x+direction*diagonal,source.y+diagonal),point(target,source.y+diagonal),point(target,finish)];
   const branch=route(points,source.y,finish,'branch');paths.push(branch);
   const split=along(branch,.55), twigTarget=Math.max(edge,Math.min(width-edge,split.x-direction*width*(small?.17:.14)));
   const twigDiagonal=Math.min(Math.abs(twigTarget-split.x),small?55:85);
   const twigEnd=Math.min(height,split.y+twigDiagonal+90);
   if(twigEnd>split.y+20)paths.push(route([split,point(split.x-direction*twigDiagonal,split.y+twigDiagonal),point(twigTarget,split.y+twigDiagonal),point(twigTarget,twigEnd)],source.y+(finish-source.y)*.55,finish+110,'twig'));
  }
 }
 return paths;
}

export default function ScrollCircuit(){
 const svg=useRef(null), nodes=useRef([]),[layout,setLayout]=useState({width:0,height:0,masks:[]});
 const roots=useMemo(()=>makeRoots(layout.width,layout.height),[layout.width,layout.height]);
 useEffect(()=>{
  const host=svg.current.parentElement;let frame=0;
  const measure=()=>{frame=0;const bounds=host.getBoundingClientRect();
   const selectors='.name-heading,.intro,.hero-detail,.hero-actions,.location,.scroll-cue,.discipline-strip,h2,.education,.experience,.toolkit,.credentials,.project-image,.project-category,.project-info h3,.subtitle,.description,.tags,.repo-link,.project-status,.project-note,.projects-header>p,.all-repos,.contact-top p,.email,.socials,.contact-orb';
   const masks=[...host.querySelectorAll(selectors)].map(element=>{const r=element.getBoundingClientRect();return {x:r.left-bounds.left-9,y:r.top-bounds.top-7,width:r.width+18,height:r.height+14};}).filter(r=>r.width>18&&r.height>14);
   setLayout({width:bounds.width,height:bounds.height,masks});
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure)};
  const observer=new ResizeObserver(schedule);observer.observe(host);
  host.querySelectorAll('section,.project-image').forEach(e=>observer.observe(e));
  window.addEventListener('resize',schedule);document.fonts?.ready.then(schedule);measure();
  host.addEventListener('transitionend',schedule);
  return()=>{observer.disconnect();host.removeEventListener('transitionend',schedule);window.removeEventListener('resize',schedule);cancelAnimationFrame(frame)};
 },[]);
 useEffect(()=>{
  if(!roots.length)return;
  nodes.current.forEach(node=>{if(node)delete node.group.dataset.growth});
  let frame=0;const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const paint=()=>{frame=0;const host=svg.current?.parentElement;if(!host)return;
   const bounds=host.getBoundingClientRect(),front=Math.min(layout.height,Math.max(0,window.innerHeight*.7-bounds.top));
   document.documentElement.style.setProperty('--page-progress',clamp(window.scrollY/Math.max(1,document.documentElement.scrollHeight-window.innerHeight)));
   roots.forEach((path,i)=>{
    const node=nodes.current[i];if(!node)return;
    // The trunk uses Y interpolation, keeping its tip next to the reader.
    let progress=clamp((front-path.start)/Math.max(1,path.end-path.start));
    if(path.kind==='trunk') {
     let walked=0;for(let n=0;n<path.segments.length;n++) {
      const a=path.points[n],b=path.points[n+1];
      if(front>=b.y){walked+=path.segments[n];continue;}
      walked+=path.segments[n]*clamp((front-a.y)/Math.max(1,b.y-a.y));break;
     }progress=clamp(walked/path.length);
    }
    // Reduced motion retains direct scroll feedback, without moving sparks or glow.
    const value=progress.toFixed(4);if(node.group.dataset.growth===value)return;
    node.group.dataset.growth=value;node.charge.style.strokeDashoffset=String(1-progress);
    node.group.style.setProperty('--root-lit',progress>0?'1':'0');
    const p=along(path,progress);node.tip.setAttribute('cx',p.x);node.tip.setAttribute('cy',p.y);
    node.tip.style.opacity=!preference.matches&&progress>0&&progress<1?'1':'0';
   });
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(paint)};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);preference.addEventListener('change',schedule);paint();
  return()=>{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);preference.removeEventListener('change',schedule);cancelAnimationFrame(frame)};
 },[roots,layout.height]);
 return <svg ref={svg} className="root-circuit" viewBox={`0 0 ${layout.width||1} ${layout.height||1}`} aria-hidden="true" focusable="false">
  <defs><mask id="root-reading-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={layout.width} height={layout.height}><rect width={layout.width} height={layout.height} fill="white"/>{layout.masks.map((r,i)=><rect key={i} {...r} rx="10" fill="black"/>)}</mask></defs>
  <g mask="url(#root-reading-mask)">{roots.map((path,i)=><g key={i} className={`root-line root-${path.kind}`} ref={group=>{if(group)nodes.current[i]={group,charge:group.querySelector('.root-charge'),tip:group.querySelector('.root-tip')};}}>
   <path className="root-bed" d={path.d}/><path className="root-charge" d={path.d} pathLength="1"/>
   <circle className="root-junction" cx={path.points[0].x} cy={path.points[0].y} r={path.kind==='twig'?3:5}/>
   <circle className="root-terminal" cx={path.points.at(-1).x} cy={path.points.at(-1).y} r="3"/>
   <circle className="root-tip" r={path.kind==='trunk'?4:3}/>
  </g>)}</g>
 </svg>;
}
