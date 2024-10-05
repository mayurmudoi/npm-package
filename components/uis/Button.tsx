import React, {Component, ReactElement, ReactNode} from 'react';
import {
	ActivityIndicator,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

const styles = StyleSheet.create({
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

interface ButtonProps {
	children?: ReactNode;
	isLoading?: boolean;
	isDisabled?: boolean;
	onPress?: () => void;
	style?: any;
	disabledStyle?: any;
	textStyle?: any;
	imgLeftSrc?: any;
	imgLeftStyle?: any;
	indicatorColor?: string;
	activeOpacity?: number;
}

interface ButtonState {
	// Define state type here if needed, currently we don't have any state to track
}

class Button extends Component<ButtonProps, ButtonState> {
	// Provide default props if they are not passed from parent
	static defaultProps: Partial<ButtonProps> = {
		isLoading: false,
		isDisabled: false,
		style: styles.btn,
		textStyle: styles.txt,
		imgLeftStyle: styles.imgLeft,
		indicatorColor: 'white',
		activeOpacity: 0.5,
	};

	constructor(props: ButtonProps) {
		super(props);
		this.state = {}; // If you plan to use state later, you can add properties here
	}

	render(): ReactElement {
		const {
			isDisabled,
			isLoading,
			style,
			textStyle,
			children,
			onPress,
			imgLeftSrc,
			imgLeftStyle,
			activeOpacity,
			indicatorColor,
			disabledStyle,
		} = this.props;

		if (isDisabled) {
			return (
				<View style={disabledStyle || styles.btnDisabled}>
					<Text style={textStyle}>{children}</Text>
				</View>
			);
		}

		if (isLoading) {
			return (
				<View style={style}>
					<ActivityIndicator size="small" color={indicatorColor}/>
				</View>
			);
		}

		return (
			<TouchableOpacity activeOpacity={activeOpacity} onPress={onPress}>
				<View style={style}>
					{imgLeftSrc && <Image style={imgLeftStyle} source={imgLeftSrc}/>}
					<Text style={textStyle}>{children}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

export default Button;
