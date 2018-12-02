import React from "react";
import PropTypes from "prop-types";
import Soundfont from "soundfont-player";

class mihneaPiano extends React.Component {
  static propTypes = {
    instrumentName: PropTypes.string.isRequired,
    hostname: PropTypes.string.isRequired,
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
    });
  };

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

  render() {
    return this.props.render({
      isLoading: !this.state.instrument,
      playNote: this.playNote,
      stopNote: this.stopNote,
      stopAllNotes: this.stopAllNotes
    });
  }
}

export default mihneaPiano;
