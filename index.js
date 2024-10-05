"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_audio_recorder_player_1 = __importStar(require("react-native-audio-recorder-player"));
const react_native_1 = require("react-native");
const react_1 = __importStar(require("react"));
const Button_1 = __importDefault(require("./components/uis/Button"));
const rn_fetch_blob_1 = __importDefault(require("rn-fetch-blob"));
const styles = react_native_1.StyleSheet.create({
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
        marginVertical: 12
    },
    recordBtnWrapper: {
        flexDirection: 'row',
    },
    viewPlayer: {
        alignSelf: 'stretch',
        alignItems: 'center',
        gap: 12
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
        flexDirection: 'row'
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
        textAlign: 'center'
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
        marginTop: 32
    }
});
const screenWidth = react_native_1.Dimensions.get('screen').width;
class Page extends react_1.Component {
    constructor(props) {
        super(props);
        this.dirs = rn_fetch_blob_1.default.fs.dirs;
        this.path = react_native_1.Platform.select({
            ios: undefined,
            android: undefined,
        });
        this.onStatusPress = (e) => {
            const touchX = e.nativeEvent.locationX;
            console.log(`touchX: ${touchX}`);
            const playWidth = (this.state.currentPositionSec / this.state.currentDurationSec) *
                (screenWidth - 56);
            console.log(`currentPlayWidth: ${playWidth}`);
            const currentPosition = Math.round(this.state.currentPositionSec);
            if (playWidth && playWidth < touchX) {
                const addSecs = Math.round(currentPosition + 1000);
                this.audioRecorderPlayer.seekToPlayer(addSecs);
                console.log(`addSecs: ${addSecs}`);
            }
            else {
                const subSecs = Math.round(currentPosition - 1000);
                this.audioRecorderPlayer.seekToPlayer(subSecs);
                console.log(`subSecs: ${subSecs}`);
            }
        };
        this.onStartRecord = () => __awaiter(this, void 0, void 0, function* () {
            if (react_native_1.Platform.OS === 'android') {
                try {
                    const grants = yield react_native_1.PermissionsAndroid.requestMultiple([
                        react_native_1.PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        react_native_1.PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        react_native_1.PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    ]);
                    console.log('write external stroage', grants);
                    if (grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                        react_native_1.PermissionsAndroid.RESULTS.GRANTED &&
                        grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                            react_native_1.PermissionsAndroid.RESULTS.GRANTED &&
                        grants['android.permission.RECORD_AUDIO'] ===
                            react_native_1.PermissionsAndroid.RESULTS.GRANTED) {
                        console.log('permissions granted');
                    }
                    else {
                        console.log('All required permissions not granted');
                        return;
                    }
                }
                catch (err) {
                    console.warn(err);
                    return;
                }
            }
            const audioSet = {
                AudioEncoderAndroid: react_native_audio_recorder_player_1.AudioEncoderAndroidType.AAC,
                AudioSourceAndroid: react_native_audio_recorder_player_1.AudioSourceAndroidType.MIC,
                AVEncoderAudioQualityKeyIOS: react_native_audio_recorder_player_1.AVEncoderAudioQualityIOSType.high,
                AVNumberOfChannelsKeyIOS: 2,
                AVFormatIDKeyIOS: react_native_audio_recorder_player_1.AVEncodingOption.aac,
                OutputFormatAndroid: react_native_audio_recorder_player_1.OutputFormatAndroidType.AAC_ADTS,
            };
            console.log('audioSet', audioSet);
            const uri = yield this.audioRecorderPlayer.startRecorder(this.path, audioSet);
            this.audioRecorderPlayer.addRecordBackListener((e) => {
                // console.log('record-back', e);
                this.setState({
                    recordSecs: e.currentPosition,
                    recordTime: this.audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
                });
            });
            console.log(`uri: ${uri}`);
        });
        this.onPauseRecord = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const r = yield this.audioRecorderPlayer.pauseRecorder();
                console.log(r);
            }
            catch (err) {
                console.log('pauseRecord', err);
            }
        });
        this.onResumeRecord = () => __awaiter(this, void 0, void 0, function* () {
            yield this.audioRecorderPlayer.resumeRecorder();
        });
        this.onStopRecord = () => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.audioRecorderPlayer.stopRecorder();
            this.audioRecorderPlayer.removeRecordBackListener();
            this.setState({
                recordSecs: 0,
            });
            console.log(result);
        });
        this.onStartPlay = () => __awaiter(this, void 0, void 0, function* () {
            console.log('onStartPlay', this.path);
            try {
                const msg = yield this.audioRecorderPlayer.startPlayer(this.path);
                //? Default path
                // const msg = await this.audioRecorderPlayer.startPlayer();
                const volume = yield this.audioRecorderPlayer.setVolume(1.0);
                console.log(`path: ${msg}`, `volume: ${volume}`);
                this.audioRecorderPlayer.addPlayBackListener((e) => {
                    console.log('playBackListener', e);
                    this.setState({
                        currentPositionSec: e.currentPosition,
                        currentDurationSec: e.duration,
                        playTime: this.audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
                        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
                    });
                });
            }
            catch (err) {
                console.log('startPlayer error', err);
            }
        });
        this.onPausePlay = () => __awaiter(this, void 0, void 0, function* () {
            yield this.audioRecorderPlayer.pausePlayer();
        });
        this.onResumePlay = () => __awaiter(this, void 0, void 0, function* () {
            yield this.audioRecorderPlayer.resumePlayer();
        });
        this.onStopPlay = () => __awaiter(this, void 0, void 0, function* () {
            console.log('onStopPlay');
            this.audioRecorderPlayer.stopPlayer();
            this.audioRecorderPlayer.removePlayBackListener();
        });
        this.state = {
            isLoggingIn: false,
            recordSecs: 0,
            recordTime: '00:00:00',
            currentPositionSec: 0,
            currentDurationSec: 0,
            playTime: '00:00:00',
            duration: '00:00:00',
        };
        this.audioRecorderPlayer = new react_native_audio_recorder_player_1.default();
        this.audioRecorderPlayer.setSubscriptionDuration(0.1);
    }
    render() {
        let playWidth = (this.state.currentPositionSec / this.state.currentDurationSec) *
            (screenWidth - 56);
        if (!playWidth) {
            playWidth = 0;
        }
        return (<react_native_1.SafeAreaView style={styles.container}>
				<react_native_1.Text style={styles.titleTxt}>Audio Recorder Player</react_native_1.Text>
				<react_native_1.View style={styles.recordContainer}>
					<react_native_1.Text style={styles.txtRecordCounter}>{this.state.recordTime}</react_native_1.Text>
					<react_native_1.View style={styles.viewRecorder}>
						<react_native_1.View style={styles.recordBtnWrapper}>
							<Button_1.default style={styles.btn} onPress={this.onStartRecord} textStyle={styles.txt}>
								Record
							</Button_1.default>
							<Button_1.default style={[
                styles.btn,
                {
                    marginLeft: 12,
                },
            ]} onPress={this.onPauseRecord} textStyle={styles.txt}>
								Pause
							</Button_1.default>
							<Button_1.default style={[
                styles.btn,
                {
                    marginLeft: 12,
                },
            ]} onPress={this.onResumeRecord} textStyle={styles.txt}>
								Resume
							</Button_1.default>
							<Button_1.default style={[styles.btn, { marginLeft: 12 }]} onPress={this.onStopRecord} textStyle={styles.txt}>
								Stop
							</Button_1.default>
						</react_native_1.View>
					</react_native_1.View>
				</react_native_1.View>
				<react_native_1.View style={styles.recordContainer}>
					<react_native_1.View style={styles.viewPlayer}>
						{/*<TouchableOpacity*/}
						{/*	style={styles.viewBarWrapper}*/}
						{/*	onPress={this.onStatusPress}>*/}
						{/*	<View style={styles.viewBar}>*/}
						{/*		<View style={[styles.viewBarPlay, {width: playWidth}]}/>*/}
						{/*	</View>*/}
						{/*</TouchableOpacity>*/}
						<react_native_1.Text style={styles.txtCounter}>
							{this.state.playTime} / {this.state.duration}
						</react_native_1.Text>
						<react_native_1.View style={styles.playBtnWrapper}>
							<Button_1.default style={styles.btn} onPress={this.onStartPlay} textStyle={styles.txt}>
								Play
							</Button_1.default>
							<Button_1.default style={[
                styles.btn,
                {
                    marginLeft: 12,
                },
            ]} onPress={this.onPausePlay} textStyle={styles.txt}>
								Pause
							</Button_1.default>
							<Button_1.default style={[
                styles.btn,
                {
                    marginLeft: 12,
                },
            ]} onPress={this.onResumePlay} textStyle={styles.txt}>
								Resume
							</Button_1.default>
							<Button_1.default style={[
                styles.btn,
                {
                    marginLeft: 12,
                },
            ]} onPress={this.onStopPlay} textStyle={styles.txt}>
								Stop
							</Button_1.default>
						</react_native_1.View>
					</react_native_1.View>
				</react_native_1.View>
			</react_native_1.SafeAreaView>);
    }
}
exports.default = Page;
