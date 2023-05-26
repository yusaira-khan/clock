import React, {
  ReactNode
} from 'react';
import logo from './logo.svg';
import './App.css';
type Children = { children?: ReactNode };
type AngleProp = { angle?: number };
type HourProp = { hour: number,key?:number|string };

function App() {
  return (
    <div className="App">
      <Clock></Clock>
    </div>

  );
}

const sideSize=800;
const center = 400;
const outerRadius = 300;
const textRadius = 270;
const innerRadius = 240;
const fontSize = 48;
const borderWidth = 10
const sin30 = 0.5
const cos30 = 0.86602540378
const dsin30 = sin30 * textRadius;
const dcos30 = cos30 * textRadius
function SVG(p:Children){
  return <svg xmlns="http://www.w3.org/2000/svg" width={sideSize} height={sideSize} version="1.1">{p.children}</svg>
}

function Circle(){
  return <>
    <circle cx={center} cy={center} r={outerRadius} stroke="black" strokeWidth={borderWidth} fill="none" />
    <circle cx={center} cy={center} r={innerRadius} stroke="gray" strokeWidth={borderWidth/2} fill="none" />
    <circle cx={center} cy={center} r={textRadius} stroke="gray" strokeWidth={borderWidth/2} fill="none" />
  </>
}

function Clock(){
  return <SVG>
    <Grid/>
    <Grid angle={30}/>
    <Grid angle={60}/>
    <Circle/>
    <ClockNumbers/>
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

const hourCoords=[
  {x:0,y:0}, //0
  {x:center+dsin30,y:center-dcos30} , //1
  {x:center+dcos30,y:center-dsin30} , //2
  {x:center+textRadius,y:center} , //3
  {x:center+dcos30,y:center+dsin30} , //4
  {x:center+dsin30,y:center+dcos30} , //5
  {x:center,y:center+textRadius} , //6
  {x:center-dsin30,y:center+dcos30} , //7
  {x:center-dcos30,y:center+dsin30} , //8
  {x:center-textRadius,y:center} , //9
  {x:center-dcos30,y:center-dsin30} , //10
  {x:center-dsin30,y:center-dcos30} , //11
  {x:center,y:center-textRadius} , //12
]
function Hour(p:HourProp){
  const key = "hour_"+(p.key ?? p.hour)

  return (
  <text
      key={key}
      fontSize={fontSize}
      alignmentBaseline="central"
      textAnchor="middle"
      {...hourCoords[p.hour]}>
    {p.hour}
  </text>
  )
}



function ClockNumbers(){
  return <>
    {Array(12).fill('').map(
        (_,ind)=><Hour hour={ind+1}/>)}
  </>
}
export default App;
