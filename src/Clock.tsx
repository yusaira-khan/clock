import React, {
    useEffect,
    useState
} from "react";
import {
    fontSize,
    lightGray,
    niceGray,
    nicePurple,
    niceYellow,
    outline
} from "./Colors";
import {
    calculateAngle,
    calculateFractionalAngle,
    Circle,
    Ring
} from "./Circles";

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
    const sideSize=800;
    const center = sideSize/2;
    const outerRadius = center*3/4;
    const textRadius = outerRadius-fontSize;
    const rimWidth = 10

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


    function Decorations() {
        function Rim() {
            return <Ring
                outerRadius={outerRadius + rimWidth}
                innerRadius={outerRadius}
                color={nicePurple}
                center={center}/>
        }

        function Center() {
            return <Circle
                radius={rimWidth}
                color={niceYellow}
                center={center}/>
        }

        return <g
            id="decoration">
            <Rim/>
            <Center/>
        </g>
    }
    return <svg xmlns="http://www.w3.org/2000/svg" width={sideSize} height={sideSize} version="1.1">
        <Face/>
        <Hands/>
        <Decorations/>
    </svg>
}
