import AudioRecorderPlayer, {
	AVEncoderAudioQualityIOSType,
	AVEncodingOption,
	AudioEncoderAndroidType,
	AudioSourceAndroidType,
	OutputFormatAndroidType,
  } from 'react-native-audio-recorder-player';
  import type { AudioSet, PlayBackType, RecordBackType } from 'react-native-audio-recorder-player';
  import {
	Dimensions,
	PermissionsAndroid,
	Platform,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Alert,
  } from 'react-native';
  import React, { Component } from 'react';
  import Button from './components/uis/Button';
  import RNFetchBlob from 'rn-fetch-blob';
  import type { ReactElement } from 'react';
  
  // Default styles provided by the component
  const defaultStyles = StyleSheet.create({
	container: {
	  flex: 1,
	  flexDirection: 'column',
	  alignItems: 'center',
	},
	titleTxt: {
	  marginTop: 100,
	  color: 'black',
	  fontSize: 28,
	},
	viewRecorder: {
	  width: '100%',
	  alignItems: 'center',
	  marginVertical: 12,
	},
	recordBtnWrapper: {
	  flexDirection: 'row',
	},
	viewPlayer: {
	  alignSelf: 'stretch',
	  alignItems: 'center',
	  gap: 12,
	},
	viewBarWrapper: {
	  marginTop: 28,
	  marginHorizontal: 28,
	  alignSelf: 'stretch',
	},
	viewBar: {
	  backgroundColor: '#ccc',
	  height: 4,
	  alignSelf: 'stretch',
	},
	viewBarPlay: {
	  backgroundColor: 'black',
	  height: 4,
	  width: 0,
	},
	playStatusTxt: {
	  marginTop: 8,
	  color: '#ccc',
	},
	playBtnWrapper: {
	  flexDirection: 'row',
	},
	btn: {
	  borderColor: 'black',
	  borderWidth: 1,
	},
	txt: {
	  color: 'black',
	  fontSize: 14,
	  marginHorizontal: 8,
	  marginVertical: 4,
	},
	txtRecordCounter: {
	  color: 'black',
	  fontSize: 20,
	  fontWeight: '200',
	  fontFamily: 'Helvetica Neue',
	  letterSpacing: 3,
	  textAlign: 'center',
	},
	txtCounter: {
	  color: 'black',
	  fontSize: 20,
	  fontWeight: '200',
	  fontFamily: 'Helvetica Neue',
	  letterSpacing: 3,
	},
	recordContainer: {
	  height: '16%',
	  backgroundColor: '#5ea6ef',
	  alignSelf: 'center',
	  justifyContent: 'center',
	  width: '80%',
	  borderRadius: 16,
	  marginTop: 32,
	},
  });
  
  // Define props for custom styles
  interface Props {
	customStyles?: { [key: string]: any }; // Users can provide custom styles
  }
  
  interface State {
	isLoggingIn: boolean;
	recordSecs: number;
	recordTime: string;
	currentPositionSec: number;
	currentDurationSec: number;
	playTime: string;
	duration: string;
  }
  
  const screenWidth = Dimensions.get('screen').width;
  
  class Page extends Component<Props, State> {
	private dirs = RNFetchBlob.fs.dirs;
	private path = Platform.select({
	  ios: undefined,
	  android: `${this.dirs.MusicDir}/test.mp4`,
	});
  
	private audioRecorderPlayer: AudioRecorderPlayer;
  
	constructor(props: Props) {
	  super(props);
	  this.state = {
		isLoggingIn: false,
		recordSecs: 0,
		recordTime: '00:00:00',
		currentPositionSec: 0,
		currentDurationSec: 0,
		playTime: '00:00:00',
		duration: '00:00:00',
	  };
  
	  this.audioRecorderPlayer = new AudioRecorderPlayer();
	  this.audioRecorderPlayer.setSubscriptionDuration(0.1);
	}
  
	componentWillUnmount() {
	  this.audioRecorderPlayer.removeRecordBackListener();
	  this.audioRecorderPlayer.removePlayBackListener();
	}
  
	public render(): ReactElement {
	  const { customStyles } = this.props;
  
	  // Merge custom styles with default styles
	  const mergedStyles = {
		...defaultStyles,
		...customStyles,
	  };
  
	  let playWidth = (this.state.currentPositionSec / this.state.currentDurationSec) * (screenWidth - 56);
	  if (!playWidth) {
		playWidth = 0;
	  }
  
	  return (
		<SafeAreaView style={mergedStyles.container}>
		  <Text style={mergedStyles.titleTxt}>Audio Recorder Player</Text>
		  <View style={mergedStyles.recordContainer}>
			<Text style={mergedStyles.txtRecordCounter}>{this.state.recordTime}</Text>
			<View style={mergedStyles.viewRecorder}>
			  <View style={mergedStyles.recordBtnWrapper}>
				<Button style={mergedStyles.btn} onPress={this.onStartRecord} textStyle={mergedStyles.txt}>
				  Record
				</Button>
				<Button style={[mergedStyles.btn, { marginLeft: 12 }]} onPress={this.onPauseRecord} textStyle={mergedStyles.txt}>
				  Pause
				</Button>
				<Button style={[mergedStyles.btn, { marginLeft: 12 }]} onPress={this.onResumeRecord} textStyle={mergedStyles.txt}>
				  Resume
				</Button>
				<Button style={[mergedStyles.btn, { marginLeft: 12 }]} onPress={this.onStopRecord} textStyle={mergedStyles.txt}>
				  Stop
				</Button>
			  </View>
			</View>
		  </View>
		  <View style={mergedStyles.recordContainer}>
			<View style={mergedStyles.viewPlayer}>
			  <Text style={mergedStyles.txtCounter}>
				{this.state.playTime} / {this.state.duration}
			  </Text>
			  <View style={mergedStyles.playBtnWrapper}>
				<Button style={mergedStyles.btn} onPress={this.onStartPlay} textStyle={mergedStyles.txt}>
				  Play
				</Button>
				<Button style={[mergedStyles.btn, { marginLeft: 12 }]} onPress={this.onPausePlay} textStyle={mergedStyles.txt}>
				  Pause
				</Button>
				<Button style={[mergedStyles.btn, { marginLeft: 12 }]} onPress={this.onResumePlay} textStyle={mergedStyles.txt}>
				  Resume
				</Button>
				<Button style={[mergedStyles.btn, { marginLeft: 12 }]} onPress={this.onStopPlay} textStyle={mergedStyles.txt}>
				  Stop
				</Button>
			  </View>
			</View>
		  </View>
		</SafeAreaView>
	  );
	}
  
	private onStartRecord = async (): Promise<void> => {
	  if (Platform.OS === 'android') {
		try {
		  const grants = await PermissionsAndroid.requestMultiple([
			PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
			PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
			PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
		  ]);
  
		  if (
			grants['android.permission.WRITE_EXTERNAL_STORAGE'] !== PermissionsAndroid.RESULTS.GRANTED ||
			grants['android.permission.READ_EXTERNAL_STORAGE'] !== PermissionsAndroid.RESULTS.GRANTED ||
			grants['android.permission.RECORD_AUDIO'] !== PermissionsAndroid.RESULTS.GRANTED
		  ) {
			Alert.alert("Permissions Denied", "Recording requires access to the microphone and storage.");
			return;
		  }
		} catch (err) {
		  console.warn(err);
		  return;
		}
	  }
  
	  const audioSet: AudioSet = {
		AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
		AudioSourceAndroid: AudioSourceAndroidType.MIC,
		AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
		AVNumberOfChannelsKeyIOS: 2,
		AVFormatIDKeyIOS: AVEncodingOption.aac,
		OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
	  };
  
	  try {
		const uri = await this.audioRecorderPlayer.startRecorder(this.path || undefined, audioSet);
		this.audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
		  this.setState({
			recordSecs: e.currentPosition,
			recordTime: this.audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
		  });
		});
		console.log(`Recording started: ${uri}`);
	  } catch (err) {
		console.error('Error starting recorder', err);
	  }
	};
  
	private onPauseRecord = async (): Promise<void> => {
	  try {
		const result = await this.audioRecorderPlayer.pauseRecorder();
		console.log('Recording paused: ', result);
	  } catch (err) {
		console.error('Error pausing recorder', err);
	  }
	};
  
	private onResumeRecord = async (): Promise<void> => {
	  try {
		const result = await this.audioRecorderPlayer.resumeRecorder();
		console.log('Recording resumed: ', result);
	  } catch (err) {
		console.error('Error resuming recorder', err);
	  }
	};
  
	private onStopRecord = async (): Promise<void> => {
	  try {
		const result = await this.audioRecorderPlayer.stopRecorder();
		this.audioRecorderPlayer.removeRecordBackListener();
		this.setState({
		  recordSecs: 0,
		});
		console.log('Recording stopped: ', result);
	  } catch (err) {
		console.error('Error stopping recorder', err);
	  }
	};
  
	private onStartPlay = async (): Promise<void> => {
	  try {
		const msg = await this.audioRecorderPlayer.startPlayer(this.path);
		const volume = await this.audioRecorderPlayer.setVolume(1.0);
		console.log(`Playing started: ${msg}, Volume: ${volume}`);
  
		this.audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
		  this.setState({
			currentPositionSec: e.currentPosition,
			currentDurationSec: e.duration,
			playTime: this.audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
			duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
		  });
		});
	  } catch (err) {
		console.error('Error starting player', err);
	  }
	};
  
	private onPausePlay = async (): Promise<void> => {
	  try {
		await this.audioRecorderPlayer.pausePlayer();
		console.log('Playback paused');
	  } catch (err) {
		console.error('Error pausing player', err);
	  }
	};
  
	private onResumePlay = async (): Promise<void> => {
	  try {
		await this.audioRecorderPlayer.resumePlayer();
		console.log('Playback resumed');
	  } catch (err) {
		console.error('Error resuming player', err);
	  }
	};
  
	private onStopPlay = async (): Promise<void> => {
	  try {
		await this.audioRecorderPlayer.stopPlayer();
		this.audioRecorderPlayer.removePlayBackListener();
		console.log('Playback stopped');
	  } catch (err) {
		console.error('Error stopping player', err);
	  }
	};
  }
  
  export default Page;
  