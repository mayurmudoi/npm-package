"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const react_1 = require("react");
// import NativeButton from 'apsl-react-native-button';
const styles = react_native_1.StyleSheet.create({
    btn: {
        backgroundColor: 'transparent',
        alignSelf: 'center',
        borderRadius: 4,
        borderWidth: 2,
        width: 320,
        height: 52,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnDisabled: {
        backgroundColor: 'rgb(243,243,243)',
        alignSelf: 'center',
        borderRadius: 4,
        borderWidth: 2,
        width: 320,
        height: 52,
        borderColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    txt: {
        fontSize: 14,
        color: 'white',
    },
    imgLeft: {
        width: 24,
        height: 24,
        position: 'absolute',
        left: 16,
    },
});
class Button extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        if (this.props.isDisabled) {
            return (<react_native_1.View style={this.props.disabledStyle}>
            <react_native_1.Text style={this.props.textStyle}>{this.props.children}</react_native_1.Text>
          </react_native_1.View>);
        }
        if (this.props.isLoading) {
            return (<react_native_1.View style={this.props.style}>
            <react_native_1.ActivityIndicator size="small" color={this.props.indicatorColor}/>
          </react_native_1.View>);
        }
        return (<react_native_1.TouchableOpacity activeOpacity={this.props.activeOpacity} onPress={this.props.onPress}>
          <react_native_1.View style={this.props.style}>
            {this.props.imgLeftSrc ? (<react_native_1.Image style={this.props.imgLeftStyle} source={this.props.imgLeftSrc}/>) : null}
            <react_native_1.Text style={this.props.textStyle}>{this.props.children}</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.TouchableOpacity>);
    }
}
Button.defaultProps = {
    isLoading: false,
    isDisabled: false,
    style: styles.btn,
    textStyle: styles.txt,
    imgLeftStyle: styles.imgLeft,
    indicatorColor: 'white',
    activeOpacity: 0.5,
};
exports.default = Button;
