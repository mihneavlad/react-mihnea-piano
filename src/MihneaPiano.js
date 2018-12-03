import React from "react";
import PropTypes from "prop-types";
import Soundfont from "soundfont-player";
import { Piano, MidiNumbers } from "react-piano";

const noteRange = {
  first: MidiNumbers.fromNote("c3"),
  last: MidiNumbers.fromNote("f4")
};

class MihneaPiano extends React.Component {
  static propTypes = {
    instrumentName: PropTypes.string.isRequired,
    // hostname: PropTypes.string.isRequired,
    format: PropTypes.oneOf(["mp3"]),
    soundfont: PropTypes.oneOf(["MusyngKite"]),
    audioContext: PropTypes.instanceOf(window.AudioContext),
    render: PropTypes.func
  };

  static defaultProps = {
    format: "mp3",
    soundfont: "MusyngKite",
    instrumentName: "acoustic_grand_piano"
  };

  constructor(props) {
    super(props);
    this.state = {
      activeAudioNodes: {},
      instrument: this.instrumentName
    };
  }

  componentDidMount() {
    this.loadInstrument(this.props.instrumentName);
    console.log(this.props.instrumentName);
  }

  loadInstrument = instrumentName => {
    this.setState({
      instrument: null
    });
    Soundfont.instrument(this.props.audioContext, "acoustic_grand_piano", {
      format: this.props.format,
      soundfont: this.props.soundfont
    }).then(instrument => {
      this.setState({
        instrument
      });
      console.log(instrument);
    });
  };

  // REQUIRED BY DANIGB SOUNDFONT PLAYER
  // resume() deprecated?BaseAudioContext

  playNote = midiNumber => {
    this.props.audioContext.resume().then(() => {
      const audioNode = this.state.instrument.play(midiNumber);
      this.setState({
        activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
          [midiNumber]: audioNode
        })
      });
    });
  };

  // REQUIRED BY DANIGB SOUNDFONT PLAYER
  // resume() deprecated?BaseAudioContext
  stopNote = midiNumber => {
    this.props.audioContext.resume().then(() => {
      if (!this.state.activeAudioNodes[midiNumber]) {
        return;
      }
      const audioNode = this.state.activeAudioNodes[midiNumber];
      audioNode.stop();
      this.setState({
        activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
          [midiNumber]: null
        })
      });
    });
  };

  // recordNotes = (midiNumbers, duration) => {
  //   const newEvents = midiNumbers.map(midiNumber => {
  //     return {
  //       midiNumber,
  //       time: this.props.currentTime,
  //       duration: duration
  //     };
  //   });
  //   this.props.setRecording({
  //     events: this.props.events.concat(newEvents),
  //     currentTime: this.props.currentTime + duration
  //   });
  // };

  // onPlayNoteInput = midiNumber => {
  //   this.setState({
  //     notesRecorded: false
  //   });
  // };
  //
  // onStopNoteInput = (midiNumber, { prevActiveNotes }) => {
  //   if (this.state.notesRecorded === false) {
  //     this.recordNotes(prevActiveNotes, this.state.noteDuration);
  //     this.setState({
  //       notesRecorded: true
  //       // noteDuration: DEFAULT_NOTE_DURATION
  //     });
  //   }
  // };

  render() {
    // const {
    //   playNote,
    //   stopNote,
    //   recording,
    //   setRecording,
    //   ...pianoProps
    // } = this.props;
    // const { situation, currentEvents } = this.props;
    // console.log(currentEvents);
    // const activeNotes =
    //   situation === "play"
    //     ? currentEvents.map(event => event.midiNumber)
    //     : null;

    return (
      <div>
        <Piano
          playNote={this.playNote}
          stopNote={this.stopNote}
          noteRange={noteRange}
          width={500}
          // onPlayNoteInput={this.onPlayNoteInput}
          // onStopNoteInput={this.onStopNoteInput}
          // activeNotes={activeNotes}
          // {...pianoProps}
        />
      </div>
    );
  }
}

export default MihneaPiano;
