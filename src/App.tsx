import React, {
  ReactNode
} from 'react';
import logo from './logo.svg';
import './App.css';
type Children = { children?: ReactNode };
type AngleProp = { angle?: number };
type HourProp = { hour: number,key?:number|string };

function App() {
  return <div className="App"> <Clock/> </div>
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

function Clock(){
  return <svg xmlns="http://www.w3.org/2000/svg" width={sideSize} height={sideSize} version="1.1">
    <Face/>
    <Hands/>
    <Circle/>
  </svg>
}

function Hands(){
  function HourHand(){
    const length=100
    const points = {x1:center,x2:center, y1: center, y2: center-length }
    const transformOpt={transform:`rotate(${30},${center},${center})`}

    return <line stroke="red" {...transformOpt} strokeWidth={10} {...points} strokeLinecap="round"/>
  }

  function MinuteHand(){
    const length=200
    const points = {x1:center,x2:center, y1: center, y2: center-length }
    const transformOpt={transform:`rotate(${45},${center},${center})`}

    return <line stroke="green" {...transformOpt} strokeWidth={7} {...points} strokeLinecap="round"/>
  }
  function SecondHand(){
    const length=innerRadius
    const points = {x1:center,x2:center, y1: center, y2: center-length }
    const transformOpt={transform:`rotate(${60},${center},${center})`}

    return <line stroke="blue" {...transformOpt} strokeWidth={4} {...points} strokeLinecap="round"/>
  }
function Center(){
  return <circle cx={center} cy={center} r={5} stroke="black" strokeWidth={borderWidth} fill="none" />
}
  return <g>
    <HourHand/>
    <MinuteHand/>
    <SecondHand/>
    <Center/>
  </g>
    
}




function Face(){
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

  function Hour(p:HourProp){
    const key = "rhour_"+(p.key ?? p.hour)
    const coordsIndex = p.hour
    const coords = hourCoords[coordsIndex]
    return <text
            key={key}
            fontSize={fontSize}
            fontFamily="DIN Condensed"
            alignmentBaseline="central"
            textAnchor="middle"
            style={{lineHeight:1}}
            {...coords}>
          {p.hour}
        </text>
  }

  function ClockHours(){
    return <g id="hours">
      {
        Array(12).fill('').map(
            (_,ind)=> {
              const h = ind + 1
              return <Hour hour={h}/>
            }
        )}
    </g>
  }
  function ClockMinutes(){
    return <g id="minutes">
      {
        Array(60).fill(0).map(
            (val,ind)=> {
              const key = "minute_"+ind
              const coords = {x:center,y:center-outerRadius}
              const width =3
              const length =10
              const points = {x1:coords.x,x2:coords.x, y1: coords.y, y2:coords.y+length }
              const angle = ind*6
              const transformOpt={transform:`rotate(${angle},${center},${center})`}
              return <line
                      key={key}
                      stroke="black"
                      {...transformOpt}
                      strokeWidth={width}
                      strokeLinecap="round"
                      {...points}/>
            }
        )}
    </g>
  }

  return <g id="face">
    <ClockHours/>
    <ClockMinutes/>
  </g>
}


function Circle(){
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
  return <circle cx={center} cy={center} r={outerRadius} stroke="black" strokeWidth={borderWidth} fill="none" />
}
export default App;
