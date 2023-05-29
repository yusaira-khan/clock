import {useTime} from "./Clock";
import {
    Synth,
    MetalSynth,
    MembraneSynth,
    FMSynth,
    PluckSynth,
    DuoSynth
} from "tone";
import {
    useEffect,
    useRef
} from "react";
function  ToneTest(){
    const time = useTime(1)
    return <div>{time.toTimeString()}</div>
}

function useSynth( ): MetalSynth {
    const synth = useRef<MetalSynth>(new MetalSynth(
        {harmonicity: 60,
            resonance: 200,
            modulationIndex: 10,
            envelope: {
                decay: 1.4,
            },
            volume: -15} ).toDestination()) ;

    return synth.current;
}



function SynthTest() {
    const synth = useSynth();
    const handleClick = () => synth.triggerAttackRelease("C3","1n");

    return (
        <div>
            <button onClick={handleClick}>
                do
            </button>
        </div>
    );
}
