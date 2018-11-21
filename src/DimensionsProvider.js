import React from "react";
import Dimensions from "react-dimensions";

class DimensionsProvider extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div>
        {this.props.children({
          containerWidth: this.props.containerWidth,
          containerHeight: this.props.containerHeight
        })}
      </div>
    );
  }
}

export default Dimensions()(DimensionsProvider);
