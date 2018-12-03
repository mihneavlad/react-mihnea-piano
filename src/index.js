import React from "react";
import ReactDOM from "react-dom";
import { Piano, MidiNumbers } from "react-piano";
import "react-piano/dist/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, ButtonGroup } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";

import DimensionsProvider from "./DimensionsProvider";
import MihneaPiano from "./MihneaPiano";
import "./index.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlayCircle,
  faStopCircle,
  faDotCircle,
  faKey
} from "@fortawesome/free-solid-svg-icons";

library.add(faPlayCircle, faKey);

// Taken from: https://developer.mozilla.org/en-US/docs/Web/API/AudioContext

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

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
    recording: false,
    playing: false,
    currentTime: 0,
    currentEvents: []
  };

  constructor(props) {
    super(props);

    this.scheduledEvents = [];
  }

  getRecordingEndTime = () => {
    if (this.state.events.length === 0) {
      return 0;
    }
    return Math.max(
      ...this.state.events.map(event => event.time + event.duration)
    );
  };

  setRecording = value => {
    this.setState({
      recording: Object.assign({}, this.state, value)
    });
  };

  onClickPlay = () => {
    this.setRecording({
      mode: "PLAYING"
    });
    const startAndEndTimes = _.uniq(
      _.flatMap(this.state.events, event => [
        event.time,
        event.time + event.duration
      ])
    );
    startAndEndTimes.forEach(time => {
      this.scheduledEvents.push(
        setTimeout(() => {
          const currentEvents = this.state.events.filter(event => {
            return event.time <= time && event.time + event.duration > time;
          });
          this.setRecording({
            currentEvents
          });
        }, time * 1000)
      );
    });
    // Stop at the end
    setTimeout(() => {
      this.onClickStop();
    }, this.getRecordingEndTime() * 1000);
  };

  onClickStop = () => {
    this.scheduledEvents.forEach(scheduledEvent => {
      clearTimeout(scheduledEvent);
    });
    this.setRecording({
      currentEvents: []
    });
  };

  onClickClear = () => {
    this.onClickStop();
    this.setRecording({
      events: [],
      currentEvents: [],
      currentTime: 0
    });
  };

  //
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

  render() {
    return (
      <div>
        <h1 className="text-center mt-5">React Piano App by Mihnea</h1>

        <div className="mt-5 text-center">
          <ResponsivePiano />
        </div>
        <div className="mt-5">
          <strong>Recorded notes</strong>
          <div>{JSON.stringify(this.state.events)}</div>
        </div>
      </div>
      //   // <ButtonGroup className="d-flex justify-content-around">
      //   //   <Button
      //   //     className="mt-5"
      //   //     id="record"
      //   //     onClick={this.startRecording}
      //   //     disabled={this.state.recording}
      //   //   >
      //   //     <span className="far fa-icons fa-6x glyphicon">
      //   //       <FontAwesomeIcon icon={faDotCircle} />
      //   //     </span>
      //   //   </Button>
      //   //   <Button
      //   //     className="mt-5"
      //   //     id="stop"
      //   //     onClick={this.stopRecording}
      //   //     disabled={!this.state.recording}
      //   //   >
      //   //     <span className="far fa-icons fa-6x glyphicon">
      //   //       <FontAwesomeIcon icon={faStopCircle} />
      //   //     </span>
      //   //   </Button>
      //   //   <Button
      //   //     className="mt-5"
      //   //     id="play"
      //   //     onClick={this.playRecording}
      //   //     disabled={
      //   //       this.state.recording ||
      //   //       this.state.playing ||
      //   //       !this.state.player.play
      //   //     }
      //   //   >
      //   //     <span className="far fa-icons fa-6x glyphicon">
      //   //       <FontAwesomeIcon icon={faPlayCircle} />
      //   //     </span>
      //   //   </Button>
      //   // </ButtonGroup>
      // </div>
      // </div>
    );
  }
}

function ResponsivePiano(props) {
  return (
    <DimensionsProvider>
      {({ containerWidth, containerHeight }) => (
        <MihneaPiano
          instrumentName="acoustic_grand_piano"
          audioContext={audioContext}
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
