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
        <Decorations/>
    </svg>
}

const sideSize=800;
const center = sideSize/2;
const outerRadius = center*3/4;
const fontSize = 60;
const textRadius = outerRadius-fontSize;
const rimWidth = 10
const basePurple="#9d499d"
const blueConstrastYellow="rgb(66,89,255)"
const darkBlue="#3e4a9b"
const nicePurple=basePurple
const greenConstrast ="#50ae50"
const brightGreen ="#57d957"
const niceGray="#444"
const lightGray="#666"
const baseYellow="#ffd700"
const niceYellow= baseYellow
const defaultBlack = "#000"
const outline= {strokeWidth: 2,stroke:niceGray}

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
            {...outline}
            fill={color}
            fillOpacity={"80%"}
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

    return <g id="hands">
        <HourHand/>
        <MinuteHand/>
        <SecondHand/>
    </g>
}


function Face(){
    type HourDisplayProps = {hour: number};
    function HourTextDisplay(p:HourDisplayProps){
        const plainFont={
            fontFamily:"DIN Condensed",
            fill:niceGray
        }
        const colorFont={
            fontFamily: "Gill Sans",
            fontWeight: "bold",
                ...outline,
            fill:(p.hour%3==0)?nicePurple: lightGray,
            strokeLineJoin:"round"
        }
        const coords = {x:center,y:center-textRadius}
        const angle=calculateAngle(12, p.hour)
        const transform = {transform:`rotate(${angle},${center},${center}),rotate(${-angle},${coords.x},${coords.y})`}
        return <g key={"hour_"+p.hour} {...transform}>
            <text
                fontSize={fontSize}
                alignmentBaseline="mathematical"
                textAnchor="middle"
                {...coords}
                {...colorFont}
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
                        return <HourTextDisplay hour={h}/>
                    }
                )}
        </g>
    }

    type MinuteDisplayProps = { minute: number, color: string, width:number};
    function MinuteStrokeDisplay({minute, color, width}:MinuteDisplayProps){
        const length =(outerRadius-textRadius)*0.4
        const adjustedLength = length- width/2
        const coords = {x:center,y:center-outerRadius}
        const transform={transform:`rotate(${minute*6},${center},${center})`}
        return <path
            key={"minute_"+minute}
            {...transform}
            fill={color}
            {...outline}
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
                        return <MinuteStrokeDisplay minute={ind} color={color} width={width}/>
                    }
                )}
        </g>
    }

    return <g id="face">
        <Minutes/>
        <Hours/>
    </g>
}


function Decorations(){
    function Rim(){
        return <Ring outerRadius={outerRadius+rimWidth} innerRadius={outerRadius} color={nicePurple}/>
    }
    function Center(){
        return <Circle radius={rimWidth} color={niceYellow}/>
    }
    return <g id="decoration">
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
function Circle({radius,color,border=outline.strokeWidth,mask=""}:CircleProps){
    const borderOpt = {strokeWidth:border, stroke:outline.stroke}
    return <circle cx={center}
                   cy={center}
                   r={radius}
                   fill={color}
                   {...(border>0? borderOpt:{})}
                   mask={mask}
    />
}

type RingProps={innerRadius:number,outerRadius:number,color:string}
function Ring(p:RingProps) {
    function MaskedRing({
                            innerRadius,
                            outerRadius,
                            color
                        }: RingProps) {
        const opaque = {
            color: "white",
            border: 0
        }
        const seeThrough = {
            color: "black",
            border: 0
        }
        return <g>
            <mask
                id="rimMask">
                <Circle
                    radius={outerRadius} {...opaque}/>
                <Circle
                    radius={innerRadius} {...seeThrough}/>
            </mask>
            <Circle
                radius={outerRadius}
                color={color}
                border={outline.strokeWidth}
                mask="url(#rimMask)"/>
            <Circle
                radius={innerRadius}
                border={outline.strokeWidth/2}
                color="none"/>
        </g>
    }

    function PathRing({
                          innerRadius,
                          outerRadius,
                          color
                      }: RingProps) {
        return <path
            d={`
            M  ${center} ${center - outerRadius}
            a   ${outerRadius} ${outerRadius}
                0 0 0
                0 ${outerRadius * 2}
            a   ${outerRadius} ${outerRadius}
                0 0 0
                0 ${-outerRadius * 2}
            M   ${center} ${center - innerRadius}
            a   ${innerRadius} ${innerRadius}
                0 0 1
                0 ${innerRadius * 2}
            a   ${innerRadius} ${innerRadius}
                0 0 1
                0 ${-innerRadius * 2}
            `}
            fill={color}
            {...outline}
        />
    }
    return PathRing(p)
}
