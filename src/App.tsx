import './App.css';
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
function App() {

  return <div className="App"> <ToneTest/><SynthTest/> </div>
}

function  ToneTest(){
  const time = useTime(1)
  return <div>{time.toTimeString()}</div>
}

function useSynth( ): MetalSynth {
  const synth = useRef<MetalSynth>(new MetalSynth(
      {harmonicity: 12,
      resonance: 800,
      modulationIndex: 20,
      envelope: {
    decay: 0.4,
  },
  volume: -15} ).toDestination()) ;

  return synth.current;
}



function SynthTest() {
  const synth = useSynth();
  const handleClick = () => synth.triggerAttackRelease("C4","1n");

  return (
      <div>
        <button onClick={handleClick}>
          do
        </button>
      </div>
  );
}


export default App;
