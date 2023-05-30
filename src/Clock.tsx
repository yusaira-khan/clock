import React, {
    useEffect,
    useState
} from "react";

export function useTime(delay:number){
    const [currentTime, setTime]= useState(new Date())

    useEffect(
    () => {
            const intervalId =
                setInterval(
                () => { setTime(new Date()); },
                    delay*1000);
            return () => clearInterval(intervalId);// clear interval on re-render to avoid memory leaks
           },
     [currentTime,delay]);
    return currentTime
}

function useDummyTime(_:number){
    return new Date("2023-01-01T00:05:10");
}

export default function Clock(){
    return <svg xmlns="http://www.w3.org/2000/svg" width={sideSize} height={sideSize} version="1.1">
        <Face/>
        <Hands/>
        <Rims/>
    </svg>
}

const sideSize=800;
const center = sideSize/2;
const outerRadius = center*3/4;
const fontSize = 60;
const textRadius = outerRadius-fontSize;
const borderWidth = 10
const nicePurple="#9d499d"
const niceGray="#444"
const niceYellow="#ffd700"
const defaultBlack = "#000"

function calculateAngle(maxNum:number,current:number){
    return (current%maxNum)*(360.0/maxNum)
}

function calculateFractionalAngle(maxWhole:number,currentWhole:number,maxFraction:number,currentFraction:number){
    return  (currentWhole%maxWhole + currentFraction*1.0/maxFraction)*(360.0/maxWhole)
}

function Hands(){
    const hourLength= outerRadius*0.6
    const hourWidth= 10
    const secondLength= textRadius
    const secondWidth= 4
    const minuteLength= (hourLength+secondLength)/2
    const minuteWidth= (hourWidth+secondWidth)/2

    type HandProp = {angle: (()=>number), length: number, width: number,color?:string }
    function Hand({angle,length,width, color=nicePurple}:HandProp){
        const arcRadius = hourWidth
        const adjustedLength = length-arcRadius
        return <path
            d={
                `   M ${center},${center}
                    h ${-width/2}
                    v ${-(adjustedLength)}
                    c   ${0} ${-arcRadius},
                        ${width} ${-arcRadius},
                        ${width} 0
                    v ${adjustedLength}
                    z
                `
            }
            transform={`rotate(${angle()},${center},${center})`}
            stroke={defaultBlack} strokeWidth="1"
            fill={color}
        />
    }

    function SecondHand(){
        const currentTime = useTime(1)
        return <Hand
            angle={()=>calculateAngle(60, currentTime.getSeconds())}
            length={secondLength}
            width={secondWidth}
        />
    }

    function MinuteHand(){
        const currentTime = useTime(15)
        return <Hand
            angle={()=>calculateFractionalAngle( 60, currentTime.getMinutes(), 60,currentTime.getSeconds())}
            length={minuteLength}
            width={minuteWidth}
        />
    }

    function HourHand(){
        const currentTime = useTime(60)
        return <Hand
            angle={()=>calculateFractionalAngle( 12, currentTime.getHours(), 60, currentTime.getMinutes())}
            length={hourLength}
            width={hourWidth}
        />
    }

    return <g>
        <HourHand/>
        <MinuteHand/>
        <SecondHand/>
    </g>
}

function Face(){
    const sin30 = 0.5
    const cos30 = 0.86602540378
    const dsin30 = sin30 * textRadius;
    const dcos30 = cos30 * textRadius
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
        const coords = hourCoords[p.hour]
        const transform = {transform:`rotate(${calculateAngle(12, p.hour)},${center},${center})`}
        const antiTransform = {transform:`rotate(${-calculateAngle(12, p.hour)},${coords.x},${coords.y})`}
        return <g key={"rhour_"+p.hour} >
            <text
                fontSize={fontSize}
                fontFamily="DIN Condensed"
                alignmentBaseline="mathematical"
                textAnchor="middle"
                {...coords}
            >
            {p.hour}
            </text>
        </g>
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

    type MinuteProp = { minute: number, color: string, width:number};
    function Minute({minute, color, width}:MinuteProp){
        const length =(outerRadius-textRadius)*0.4
        const adjustedLength = length- width/2
        const coords = {x:center,y:center-outerRadius}
        const angle = minute*6
        const transformOpt={transform:`rotate(${angle},${center},${center})`}
        return <path
            key={"minute_"+minute}
            {...transformOpt}
            fill={color}
            stroke={defaultBlack} strokeWidth={1}
            d={`
            M ${coords.x},${coords.y}
            h ${-width/2}
            v ${adjustedLength}
            a   ${width/2} ${width/2},  
                0 1 0,
                ${width} 0
            v ${-adjustedLength}
            z
            `}
            />

    }
    function Minutes(){
        return <g id="minutes">
            {
                Array(60).fill(0).map(
                    (val,ind)=> {
                        const isSpecial=(ind%5===0)
                        const width = isSpecial?6:4
                        const color = isSpecial? niceYellow:nicePurple
                        return <Minute minute={ind} color={color} width={width}/>
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
    function MaskedRing({radius,color, border=borderWidth}:CircleProps){
        const opaque= {color:"white", border:0}
        const seeThrough= {color:"black", border:0}
        return <g>
            <mask id="rimMask">
                <Circle radius={radius+border} {...opaque}/>
                <Circle radius={radius} {...seeThrough}/>
            </mask>
            <Circle radius={radius+border} color={color} border={4} mask="url(#rimMask)"/>
            <Circle radius={radius} border={2} color="none"/>
        </g>
    }

    function Rim(){
        // return <Circle radius={outerRadius} color="none" border={borderWidth}/>
        return <MaskedRing radius={outerRadius} color={nicePurple}/>
    }

    function Center(){
        return <Circle radius={borderWidth} color={niceYellow}/>
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

type CircleProps={radius:number,color:string,border?:number,mask?:string}
function Circle({radius,color,border=1,mask=""}:CircleProps){
    const borderOpt = {strokeWidth:border, stroke:defaultBlack}
    return <circle cx={center}
                   cy={center}
                   r={radius}
                   fill={color}
                   {...(border>0? borderOpt:{})}
                   mask={mask}
    />
}
