import React from "react";
import ReactDOM from "react-dom";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import "react-piano/dist/styles.css";

import DimensionsProvider from "./DimensionsProvider";
import SoundfontProvider from "./SoundfontProvider";
import "./index.css";

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = "https://d1pzp51pvbm36p.cloudfront.net";

const noteRange = {
  first: MidiNumbers.fromNote("c1"),
  last: MidiNumbers.fromNote("g3")
};

const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.HOME_ROW
});

const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const recording = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      recording.push(event.data);

      console.log(event.data);
    });

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const recordingBlob = new Blob(recording);
          const audioUrl = URL.createObjectURL(recordingBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          resolve({ recordingBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
  });

class App extends React.Component {
  state = {
    recorder: {},
    recording: false,
    playing: false
  };

  startRecording = async () => {
    const recorder = await recordAudio();
    recorder.start();
    this.setState({
      recorder: recorder,
      recording: true
    });
  };

  stopRecording = async () => {
    const audio = await this.state.recorder.stop();

    this.setState({
      recorder: audio,
      recording: false
    });
  };

  playRecording = () => {
    this.state.recorder.play();
  };

  render() {
    return (
      <div>
        <h1>react-piano demos</h1>

        <div className="mt-5">
          <p>
            Responsive piano which resizes to container's width. Try resizing
            the window!
          </p>
          <button
            id="record"
            onClick={this.startRecording}
            disabled={this.state.recording}
          >
            Start recording...
          </button>
          <button
            id="stop"
            onClick={this.stopRecording}
            disabled={!this.state.recording}
          >
            Stop recording...
          </button>
          <button
            id="play"
            onClick={this.playRecording}
            disabled={this.state.recording}
          >
            Play recording...
          </button>
          <ResponsivePiano />
        </div>
      </div>
    );
  }
}

function ResponsivePiano(props) {
  return (
    <DimensionsProvider>
      {({ containerWidth, containerHeight }) => (
        <SoundfontProvider
          // instrumentName="acoustic_grand_piano"
          audioContext={audioContext}
          hostname={soundfontHostname}
          render={({ isLoading, playNote, stopNote }) => (
            <Piano
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
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
