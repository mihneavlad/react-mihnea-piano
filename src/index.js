import React from "react";
import ReactDOM from "react-dom";
import { Piano, MidiNumbers } from "react-piano";
import "react-piano/dist/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, ButtonGroup } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DimensionsProvider from "./DimensionsProvider";
import SoundfontProvider from "./SoundfontProvider";
import "./index.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlayCircle,
  faStopCircle,
  faDotCircle,
  faKey
} from "@fortawesome/free-solid-svg-icons";

library.add(faPlayCircle, faKey);

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = "https://d1pzp51pvbm36p.cloudfront.net";

const noteRange = {
  first: MidiNumbers.fromNote("c1"),
  last: MidiNumbers.fromNote("g3")
};

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

// Setting initial state, setting states for the various scenarios, start recording, stop recording, play recording.

class App extends React.Component {
  state = {
    recorder: {},
    player: {},
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
      player: audio,
      recording: false
    });
  };

  playRecording = () => {
    if (this.state.player.play) {
      this.state.player.play();
    }
  };

  render() {
    return (
      <div>
        <h1 className="text-center mt-5">React Piano App by Mihnea</h1>

        <div className="mt-5 text-center">
          <p>
            This is a piano app based on the react-piano package and the
            MediaStream Recording API !
          </p>
          <ResponsivePiano />
          <ButtonGroup className="d-flex justify-content-around">
            <Button
              className="mt-5"
              id="record"
              onClick={this.startRecording}
              disabled={this.state.recording}
            >
              <span className="far fa-icons fa-6x glyphicon">
                <FontAwesomeIcon icon={faDotCircle} />
              </span>
            </Button>
            <Button
              className="mt-5"
              id="stop"
              onClick={this.stopRecording}
              disabled={!this.state.recording}
            >
              <span className="far fa-icons fa-6x glyphicon">
                <FontAwesomeIcon icon={faStopCircle} />
              </span>
            </Button>
            <Button
              className="mt-5"
              id="play"
              onClick={this.playRecording}
              disabled={
                this.state.recording ||
                this.state.playing ||
                !this.state.player.play
              }
            >
              <span className="far fa-icons fa-6x glyphicon">
                <FontAwesomeIcon icon={faPlayCircle} />
              </span>
            </Button>
          </ButtonGroup>
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
