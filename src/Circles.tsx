import {
    outline
} from "./Colors";
import React
    from "react";

export function calculateAngle(maxNum: number, current: number) {
    return (current % maxNum) * (360.0 / maxNum)
}

export function calculateFractionalAngle(maxWhole: number, currentWhole: number, maxFraction: number, currentFraction: number) {
    return (currentWhole % maxWhole + currentFraction / maxFraction) * (360.0 / maxWhole)
}

type CircleProps = {
    radius: number,
    color: string,
    border?: number,
    mask?: string
    center:number
}

export function Circle({
                           radius,
                           color,
                           border = outline.strokeWidth,
                           mask = "", center
                       }: CircleProps) {
    const borderOpt = {
        strokeWidth: border,
        stroke: outline.stroke
    }
    return <circle
        cx={center}
        cy={center}
        r={radius}
        fill={color}
        {...(border > 0 ? borderOpt : {})}
        mask={mask}
    />
}

type RingProps = {
    innerRadius: number,
    outerRadius: number,
    color: string
    center:number
}

export function Ring(p: RingProps) {
    function MaskedRing({
                            innerRadius,
                            outerRadius,
                            color,
        center
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
                    radius={outerRadius} center={center} {...opaque}/>
                <Circle
                    radius={innerRadius}  center={center} {...seeThrough}/>
            </mask>
            <Circle
                radius={outerRadius}
                center={center}
                color={color}
                border={outline.strokeWidth}
                mask="url(#rimMask)"/>
            <Circle
                center={center}
                radius={innerRadius}
                border={outline.strokeWidth / 2}
                color="none"/>
        </g>
    }

    function PathRing({
                          innerRadius,
                          outerRadius,
                          color,
        center
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
type GridsProps={
    center:number
    size:number
}

function Grids(p:GridsProps){
    type AngleProp = { angle?: number };
    function Grid({angle=0}:AngleProp){
        const path =`M0,${p.center} h${p.size} M${p.center},0 v${p.size}`
        const transform={transform:""}
        if ( angle ) {
            transform["transform"]=`rotate(${angle},${p.center},${p.center})`
        }
        return <path
            d={path}
            fill="none"
            strokeWidth={2}
            stroke="pink" {...transform} />
    }
    return <g>
        <Grid angle={0}/>
        <Grid angle={30}/>
        <Grid angle={60}/>
    </g>

}
