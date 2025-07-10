/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, Alert} from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

import TestConsole from './TestConsole';

import _updateConfig from './update.json';
import {PushyProvider, Pushy, usePushy} from 'react-native-update';
const {appKey} = _updateConfig.ios;

function App() {
  const {
    client,
    checkUpdate,
    downloadUpdate,
    switchVersionLater,
    switchVersion,
    updateInfo,
    packageVersion,
    currentHash,
    progress: {received, total} = {},
  } = usePushy();
  const [useDefaultAlert, setUseDefaultAlert] = useState(false);
  const [showTestConsole, setShowTestConsole] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [showUpdateSnackbar, setShowUpdateSnackbar] = useState(false);
  
  // 音频播放相关状态
  const player = useAudioPlayer(require('@/assets/bell-ringing-05.wav'));
  const playerStatus = useAudioPlayerStatus(player);
  const isPlaying = playerStatus?.playing || false;
  const isLoaded = playerStatus?.isLoaded || false;
  const duration = playerStatus?.duration || 0;
  const position = playerStatus?.currentTime || 0;

  // 播放音频
  const playAudio = async () => {
    try {
      await player.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('错误', '无法播放音频');
    }
  };

  // 暂停音频
  const pauseAudio = async () => {
    try {
      await player.pause();
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  };

  // 停止音频
  const stopAudio = async () => {
    try {
      await player.pause();
      await player.seekTo(0);
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  // 设置音频位置
  const seekAudio = async (seekPosition: number) => {
    try {
      await player.seekTo(seekPosition);
    } catch (error) {
      console.error('Error seeking audio:', error);
    }
  };

  // 格式化时间
  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  // if (updateInfo) {
  //   updateInfo!.name = 'name';
  //   updateInfo!.update = true;
  // }
  const snackbarVisible =
    !useDefaultAlert && showUpdateSnackbar && updateInfo?.update;

  if (showTestConsole) {
    return (
      <TestConsole visible={true} onClose={() => setShowTestConsole(false)} />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>欢迎使用Pushy热更新服务</Text>
      {/* <Text style={styles.welcome}>😁hdiffFromAPP更新成功！！！</Text> */}
      
      {/* 音频播放控制区域 */}
      <View style={styles.audioSection}>
        <Text style={styles.sectionTitle}>音频播放测试</Text>
        
        <View style={styles.audioInfo}>
          <Text>状态: {isLoaded ? (isPlaying ? '播放中' : '已暂停') : '未加载'}</Text>
          <Text>时长: {formatTime(duration)}</Text>
          <Text>当前位置: {formatTime(position)}</Text>
        </View>

        <View style={styles.audioControls}>
          <TouchableOpacity
            style={[styles.audioButton, { backgroundColor: '#007AFF' }]}
            onPress={playAudio}
          >
            <Text style={styles.audioButtonText}>播放</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.audioButton, { backgroundColor: '#007AFF' }]}
            onPress={pauseAudio}
            disabled={!isLoaded}
          >
            <Text style={styles.audioButtonText}>暂停</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.audioButton, { backgroundColor: '#007AFF' }]}
            onPress={stopAudio}
            disabled={!isLoaded}
          >
            <Text style={styles.audioButtonText}>停止</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.seekControls}>
          <TouchableOpacity
            style={[styles.seekButton, { backgroundColor: '#007AFF' }]}
            onPress={() => seekAudio(0)}
            disabled={!isLoaded}
          >
            <Text style={styles.seekButtonText}>开始</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.seekButton, { backgroundColor: '#007AFF' }]}
            onPress={() => seekAudio(duration * 0.25)}
            disabled={!isLoaded}
          >
            <Text style={styles.seekButtonText}>25%</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.seekButton, { backgroundColor: '#007AFF' }]}
            onPress={() => seekAudio(duration * 0.5)}
            disabled={!isLoaded}
          >
            <Text style={styles.seekButtonText}>50%</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.seekButton, { backgroundColor: '#007AFF' }]}
            onPress={() => seekAudio(duration * 0.75)}
            disabled={!isLoaded}
          >
            <Text style={styles.seekButtonText}>75%</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 原有的热更新功能 */}
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            client?.setOptions({
              updateStrategy: !useDefaultAlert ? null : 'alwaysAlert',
            });
            setShowUpdateSnackbar(useDefaultAlert);
            setUseDefaultAlert(!useDefaultAlert);
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderWidth: 1,
              borderColor: '#999',
              backgroundColor: useDefaultAlert ? 'blue' : 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {useDefaultAlert && <Text style={{color: 'white'}}>✓</Text>}
          </View>
          <Text style={{marginLeft: 8}}>
            {' '}
            {useDefaultAlert ? '当前使用' : '当前不使用'}默认的alert更新提示
          </Text>
        </TouchableOpacity>
      </View>
      <Image
        resizeMode={'contain'}
        source={require('@/assets/shezhi.png')}
        style={styles.image}
      />
      <Text style={styles.instructions}>
        这是版本一 {'\n'}
        当前原生包版本号: {packageVersion}
        {'\n'}
        当前热更新版本Hash: {currentHash || '(空)'}
        {'\n'}
      </Text>
      <Text>
        下载进度：{received} / {total}
      </Text>
      <TouchableOpacity
        onPress={() => {
          checkUpdate();
          setShowUpdateSnackbar(true);
        }}>
        <Text style={styles.instructions}>点击这里检查更新</Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="testcase"
        style={{marginTop: 15}}
        onPress={() => {
          setShowTestConsole(true);
        }}>
        <Text style={styles.instructions}>
          react-native-update版本：{client?.version}
        </Text>
      </TouchableOpacity>
      {snackbarVisible && (
        <View style={styles.overlay}>
          <View
            style={{
              width: '100%',
              backgroundColor: '#333',
              padding: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white'}}>
              有新版本({updateInfo.name})可用，是否更新？
            </Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => setShowUpdateSnackbar(false)}
                style={{marginRight: 10}}>
                <Text style={{color: 'white'}}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setShowUpdateSnackbar(false);
                  await downloadUpdate();
                  setShowUpdateBanner(true);
                }}>
                <Text style={{color: '#2196F3'}}>更新</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {showUpdateBanner && (
        <View style={styles.overlay}>
          <View
            style={{
              width: '100%',
              backgroundColor: '#fff',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>更新已完成，是否立即重启？</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  switchVersionLater();
                  setShowUpdateBanner(false);
                }}
                style={{marginRight: 20}}>
                <Text style={{color: '#2196F3'}}>下次再说</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={switchVersion}>
                <Text style={{color: '#2196F3'}}>立即重启</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  image: {},
  // 音频播放相关样式
  audioSection: {
    width: '90%',
    marginVertical: 20,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  audioInfo: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 5,
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  audioButton: {
    padding: 10,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  audioButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  seekControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  seekButton: {
    padding: 8,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  seekButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
});

const pushyClient = new Pushy({
  appKey,
  debug: true,
});

export default function Root() {
  return (
    <PushyProvider client={pushyClient}>
      <App />
    </PushyProvider>
  );
}
