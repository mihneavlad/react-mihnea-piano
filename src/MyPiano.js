import React from "react";
import { Piano } from "react-piano";

const DEFAULT_NOTE_DURATION = 0.5;

class MyPiano extends React.Component {
  static defaultProps = {
    soundRecording: false
  };

  state = {
    noteDuration: DEFAULT_NOTE_DURATION
  };

  playPiano = note => {
    this.setState({
      soundRecording: false
    });
  };

  stopPlayingPiano = note => {
    this.setState({
      soundRecording: true,
      noteDuration: DEFAULT_NOTE_DURATION
    });
  };

  render() {
    const {
      playNote,
      stopNote,
      // recording,
      // setRecording,
      ...pianoProps
    } = this.props;

    return (
      <div>
        <Piano
          playNote={this.props.playNote}
          stopNote={this.props.stopNote}
          onPlayNoteInput={this.onPlayNoteInput}
          onStopNoteInput={this.onStopNoteInput}
          // activeNotes={activeNotes}
          {...pianoProps}
        />
      </div>
    );
  }
}

export default MyPiano;
