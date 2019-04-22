import React from 'react'
import ReactDraggableResizable from 'react-draggable-resizable'
 
class Drag extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            width: 0,
            height: 0,
            left: 0,
            right: 0
        }
    }
 
    onDrag(left, top) {
        this.setState({
            left,
            top
        })
    }
 
    onResize(left, top, width, height) {
        this.setState({
            left, 
            top,
            width,
            height
        })
    }
 
    render() {
        const { left, top, width, height } = this.state
        let cusstyle = {
            width: '100%',
            height: '100%',
            maxHeight: '100%',
            maxWidth: '100%',
            background: 'transparent',
            outline: 'none',
            color: '#000',
            padding: '5px',
            margin: '0px',
            resize: 'none',
            overflow: 'hidden',
            fontSize:'100%',
            position:'relative',
            cursor: 'move',
        }
        return (
            <ReactDraggableResizable
                w={200}
                h={200}
                dragging={this.onDrag.bind(this)}
                resizing={this.onResize.bind(this)}
                parent={true}
                resizestop={(left, top, width, height) => {console.log(`left: ${left}, top: ${top}, width: ${width}, height: ${height}`)}}
            >
                <div>
                    <div>left: {left}</div>
                    <div>top: {top}</div>
                    <div>width: {width}</div>
                    <div>height: {height}</div>
                </div>
                <textarea className="form-control" style={cusstyle}></textarea>
                <div className="resizer"
                ></div>
            </ReactDraggableResizable>
        )
    }
}
 
export default Drag