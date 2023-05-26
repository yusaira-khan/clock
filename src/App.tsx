import React, {
  ReactNode
} from 'react';
import logo from './logo.svg';
import './App.css';
type Children = { children?: ReactNode };
type AngleProp = { angle?: number };

function App() {
  return (
    <div className="App">
      <Clock></Clock>
    </div>

  );
}

const sideSize=800;
const center = sideSize/2;
const outerRadius = 300;
const innerRadius = 225;
const ringDistance = outerRadius - innerRadius
const fontSize = ringDistance *16/25;
const fontWidth = fontSize/4;
const fontOffset = ((ringDistance - fontSize)/2)
const borderWidth = 10
const sin30 = 0.5
const cos30 = 0.86602540378
const dsin30 = sin30 * innerRadius;
const dcos30 = cos30 * innerRadius
function SVG(p:Children){
  return <svg xmlns="http://www.w3.org/2000/svg" width={sideSize} height={sideSize} version="1.1">{p.children}</svg>
}

function Circle(){
  return <>
    <circle cx={center} cy={center} r={outerRadius} stroke="black" strokeWidth={borderWidth} fill="none" />
    <circle cx={center} cy={center} r={innerRadius} stroke="gray" strokeWidth={borderWidth/2} fill="none" />
  </>
}

function Clock(){
  return <SVG>
    <Grid/>
    <Grid angle={30}/>
    <Grid angle={60}/>
    <Circle/>
    <CirclePath/>
  </SVG>
}
function Grid(p:AngleProp){
  const path =`M0,${center} h${sideSize} M${center},0 v${sideSize}`
  const transformOpt={transform:""}
  if ( p.angle ) {
    transformOpt["transform"]=`rotate(${p.angle},${center},${center})`
  }
  return <path
      d={path}
      fill="none"
      strokeWidth={borderWidth}
      stroke="pink" {...transformOpt} />
}

function Hour12(){
  const x = center;
  const y =center-innerRadius;
  return <text x={x} y={y} fontSize={fontSize} alignmentBaseline="baseline" textAnchor="middle">12</text>
}



function Hour6(){
  const x = center;
  const y =center+innerRadius;
  return <text x={x} y={y} fontSize={fontSize}  alignmentBaseline="hanging" textAnchor="middle">6</text>
}

function Hour3(){
  const x = center+innerRadius;
  const y =center+fontSize/2+3;
  return <text x={x} y={y} fontSize={fontSize} alignmentBaseline="text-after-edge" textAnchor="start">3</text>
}


function Hour9(){
  const x = center-innerRadius;
  const y =center+fontSize/2+3;
  return <text x={x} y={y} fontSize={fontSize} alignmentBaseline="text-after-edge" textAnchor="end">9</text>
}

function Hour1(){
  const x = center+dsin30;
  const y =center-dcos30;
  return <text x={x} y={y} fontSize={fontSize}  alignmentBaseline="baseline" textAnchor="start">1</text>
}
function Hour2(){
  const x = center+dcos30;
  const y =center-dsin30;
  return <text x={x} y={y} fontSize={fontSize}  alignmentBaseline="baseline" textAnchor="start">2</text>
}
function Hour5(){
  const x = center+dsin30;
  const y =center+dcos30;
  return <text x={x} y={y} fontSize={fontSize}  alignmentBaseline="hanging" textAnchor="start">5</text>
}
function Hour4(){
  const x = center+dcos30;
  const y =center+dsin30;
  return <text x={x} y={y} fontSize={fontSize}  alignmentBaseline="hanging" textAnchor="start">4</text>
}


function Hour11(){
  const x = center-dsin30;
  const y =center-dcos30;
  return <text x={x} y={y} fontSize={fontSize}  alignmentBaseline="baseline" textAnchor="end">11</text>
}
function Hour10(){
  const x = center-dcos30;
  const y =center-dsin30;
  return <text x={x} y={y} fontSize={fontSize}  alignmentBaseline="baseline" textAnchor="end">10</text>
}
function Hour7(){
  const x = center-dsin30;
  const y =center+dcos30;
  return <text x={x} y={y} fontSize={fontSize}  alignmentBaseline="hanging" textAnchor="end">7</text>
}
function Hour8(){
  const x = center-dcos30;
  const y =center+dsin30;
  return <text x={x} y={y} fontSize={fontSize}  alignmentBaseline="hanging" textAnchor="end">8</text>
}


function CirclePath(){

  return <>
    <Hour12/>
    <Hour1/>
    <Hour2/>
    <Hour3/>
    <Hour4/>
    <Hour5/>
    <Hour6/>
    <Hour7/>
    <Hour8/>
    <Hour9/>
    <Hour10/>
    <Hour11/>
  </>
}
export default App;
