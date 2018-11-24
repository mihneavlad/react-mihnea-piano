import React from "react";
import ReactDOM from "react-dom";
import { Piano, MidiNumbers } from "react-piano";
import "react-piano/dist/styles.css";

import DimensionsProvider from "./DimensionsProvider";
import SoundfontProvider from "./SoundfontProvider";
import MyPiano from "./MyPiano";
import "./index.css";

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = "https://d1pzp51pvbm36p.cloudfront.net";

const noteRange = {
  first: MidiNumbers.fromNote("c1"),
  last: MidiNumbers.fromNote("g3")
};

// const recordAudio = () =>
//   new Promise(async resolve => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const mediaRecorder = new MediaRecorder(stream);
//     const recording = [];
//
//     mediaRecorder.addEventListener("dataavailable", event => {
//       recording.push(event.data);
//
//       console.log(event.data);
//     });
//
//     const start = () => mediaRecorder.start();
//
//     const stop = () =>
//       new Promise(resolve => {
//         mediaRecorder.addEventListener("stop", () => {
//           const recordingBlob = new Blob(recording);
//           const audioUrl = URL.createObjectURL(recordingBlob);
//           const audio = new Audio(audioUrl);
//           const play = () => audio.play();
//           resolve({ recordingBlob, audioUrl, play });
//         });
//
//         mediaRecorder.stop();
//       });
//
//     resolve({ start, stop });
//   });

// Setting initial state, setting states for the various scenarios, start recording, stop recording, play recording.

class App extends React.Component {
  state = {
    recorder: {},
    player: {},
    recording: false,
    playing: false
  };

  // startRecording = async () => {
  //   const recorder = await recordAudio();
  //   recorder.start();
  //   this.setState({
  //     recorder: recorder,
  //     recording: true
  //   });
  // };
  //
  // stopRecording = async () => {
  //   const audio = await this.state.recorder.stop();
  //
  //   this.setState({
  //     player: audio,
  //     recording: false
  //   });
  // };
  //
  // playRecording = () => {
  //   if (this.state.player.play) {
  //     this.state.player.play();
  //   }
  // };

  render(props) {
    return (
      <div>
        <DimensionsProvider>
          {({ containerWidth, containerHeight }) => (
            <SoundfontProvider
              // instrumentName="acoustic_grand_piano"
              audioContext={audioContext}
              hostname={soundfontHostname}
              render={({ isLoading, playNote, stopNote }) => (
                <MyPiano
                  noteRange={noteRange}
                  width={containerWidth}
                  playNote={playNote}
                  stopNote={stopNote}
                  disabled={isLoading}
                  {...props}
                />
              )}
            />
          )}
        </DimensionsProvider>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
