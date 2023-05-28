import React, {
  useEffect,
  useState
} from 'react';
import './App.css';

function App() {
  return <div className="App"> <Clock/> </div>
}

const sideSize=800;
const center = 400;
const outerRadius = 300;
const textRadius = 265;
const fontSize = 42;
const borderWidth = 10
const sin30 = 0.5
const cos30 = 0.86602540378
const dsin30 = sin30 * textRadius;
const dcos30 = cos30 * textRadius
function calculateAngle(maxNum:number,current:number){
  return (current%maxNum)*(360.0/maxNum)
}

function calculateFractionalAngle(maxWhole:number,currentWhole:number,maxFraction:number,currentFraction:number){
  return  (currentWhole%maxWhole + currentFraction*1.0/maxFraction)*(360.0/maxWhole)
}



function Clock(){
  return <svg xmlns="http://www.w3.org/2000/svg" width={sideSize} height={sideSize} version="1.1">
    <Face/>
    <Hands/>
    <Rims/>
  </svg>
}

function Hands(){
  // const currentTime = new Date("July 21, 1983 09:15:45");
  const [currentTime, setTime]= useState(new Date())

  const hourHandSize= outerRadius*0.7
  const hourHandWidth= 10
  const arcRadius = hourHandWidth/2
  const secondHandSize= textRadius
  const secondHandWidth= 4
  const minuteHandSize= (hourHandSize+secondHandSize*2)/3
  const minuteHandWidth= (hourHandWidth+secondHandWidth)/2
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
  }, [currentTime]);



  function hourAngle() {
    // return calculateAngle(12, currentTime.getHours())
    return calculateFractionalAngle(12, currentTime.getHours(), 60,currentTime.getMinutes())
  }

  function minuteAngle() {
    //return calculateAngle(60, currentTime.getMinutes())
    return calculateFractionalAngle(60, currentTime.getMinutes(), 60,currentTime.getSeconds())
  }

  function secondAngle() {
    return calculateAngle(60, currentTime.getSeconds())
  }




  type HandProp = {angleFunction: (()=>number), handSize: number, handWidth: number, }
  function Hand({angleFunction,handSize,handWidth}:HandProp){
    const transformOpt={transform:`rotate(${angleFunction()},${center},${center})`}
    const verticalMovement = handSize-arcRadius*2
    return <g stroke="black"
              {...transformOpt}
              strokeWidth={1} fill="purple" fillOpacity="80%">
      <path d={
        `M ${center},${center} 
         h ${-handWidth/2} 
         v ${-(verticalMovement)} 
         c ${0} ${-arcRadius*2} , ${handWidth} ${-arcRadius*2}, ${handWidth} 0  
         v ${verticalMovement} 
         z`
      }/>
    </g>
  }
  function SecondHand(){
    return <Hand
        angleFunction={secondAngle}
        handSize={secondHandSize}
        handWidth={secondHandWidth}
        />
     }

  function MinuteHand(){
    return <Hand
        angleFunction={minuteAngle}
        handSize={minuteHandSize}
        handWidth={minuteHandWidth}
        />
    }
  function HourHand(){
    const transformOpt={transform:`rotate(${0},${center},${center})`}

    return <Hand
        angleFunction={hourAngle}
        handSize={hourHandSize}
        handWidth={hourHandWidth}
        />
  }

  return <g>
    <HourHand/>
    <MinuteHand/>
    <SecondHand/>
  </g>
}




function Face(){
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

  type HourProp = { hour: number};
  function Hour(p:HourProp){
    const key = "rhour_"+p.hour
    const coords = hourCoords[p.hour]
    const transform = {transform:`rotate(${calculateAngle(12, p.hour)},${center},${center})`}
    const antiTransform = {transform:`rotate(${-calculateAngle(12, p.hour)},${coords.x},${coords.y})`}
    return <g key={key}
    >
      <text
            fontSize={fontSize}
            fontFamily="DIN Condensed"
            alignmentBaseline="mathematical"
            textAnchor="middle"
            style={{lineHeight:1}}
            {...coords}
            >
          {p.hour}
    </text></g>
  }

  function Hours(){
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
  function Minutes(){
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
    <Minutes/>
    <Hours/>
  </g>
}


function Rims(){
  type CircleProps={radius:number,color:string,border?:number,mask?:string}
  function Circle({radius,color,border=1,mask=""}:CircleProps){
    const borderOpt = {strokeWidth:border, stroke:"black"}
    return <circle cx={center}
                   cy={center}
                   r={radius}
                   fill={color}
                   {...(border>0? borderOpt:{})}
                   mask={mask}
                    />
  }

  function MaskedRing({radius,color, border=borderWidth}:CircleProps){
 return <g>
   <mask id="rimMask">
     <Circle radius={radius+border} color="white" border={0}/>
     <Circle radius={radius} color="black" border={0}/>
   </mask>
   <Circle radius={radius+border} color={color} border={4} mask="url(#rimMask)"/>
   <Circle radius={radius} border={2} color="none"/>
 </g>

  }

  function Rim(){
    // return <Circle radius={outerRadius} color="none" border={borderWidth}/>
    return <MaskedRing radius={outerRadius} color="#444"/>
  }


  function Center(){
    return <Circle radius={borderWidth} color="gold"/>
  }
  return <g>
    <Rim/>
    <Center/>
  </g>
}
function Grids(){
  type AngleProp = { angle?: number };
function Grid(p:AngleProp){
  const path =`M0,${center} h${sideSize} M${center},0 v${sideSize}`
  const transformOpt={transform:""}
  if ( p.angle ) {
    transformOpt["transform"]=`rotate(${p.angle},${center},${center})`
  }
  return <path
      d={path}
      fill="none"
      strokeWidth={2}
      stroke="pink" {...transformOpt} />
}
  return <g>
    <Grid angle={0}/>
    <Grid angle={30}/>
    <Grid angle={60}/>
  </g>

}
export default App;
