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
const textRadius = 265;
const innerRadius = 240;
const fontSize = 42;
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
  </>
}

function Clock(){
  return <SVG>

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
  {x:center+dsin30,y:center-dcos30+5} , //1
  {x:center+dcos30,y:center-dsin30} , //2
  {x:center+textRadius,y:center} , //3
  {x:center+dcos30,y:center+dsin30} , //4
  {x:center+dsin30,y:center+dcos30} , //5
  {x:center,y:center+textRadius} , //6
  {x:center-dsin30,y:center+dcos30} , //7
  {x:center-dcos30,y:center+dsin30} , //8
  {x:center-textRadius,y:center} , //9
  {x:center-dcos30,y:center-dsin30} , //10
  {x:center-dsin30,y:center-dcos30+5} , //11
  {x:center,y:center-textRadius} , //12
]

const hourAngles=[
  {a:0}, //0
  {a:-5}, //1
  {a:-10}, //2
  {a:0}, //3
  {a:10}, //4
  {a:5}, //5
  {a:0}, //6
  {a:-5}, //7
  {a:-10}, //8
  {a:0}, //9
  {a:10}, //10
  {a:5}, //11
  {a:0}, //12
]

function RotatedHour(p:HourProp){
  const key = "rhour_"+(p.key ?? p.hour)
  const coordsIndex = p.hour
  const coords = hourCoords[coordsIndex]
  const transformOpt={transform:`rotate(${hourAngles[coordsIndex].a},${coords.x},${coords.y})`}
  return (
      <text
          key={key}
          fontSize={fontSize}
          fontFamily="DIN Condensed"
          alignmentBaseline="central"
          textAnchor="middle"
          style={{lineHeight:1}}
          {...transformOpt}
          {...coords}>
        {p.hour}
      </text>)
}


function ClockNumbers(){
  return <>
    {
      Array(12).fill('').map(
        (_,ind)=> {
          const h = ind + 1
          return <RotatedHour
              hour={h}/>
        }
      )}
  </>
}
export default App;
