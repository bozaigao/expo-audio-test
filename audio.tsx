import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AudioScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const player = useAudioPlayer(require('./assets/bell-ringing-05.wav'));
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

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        音频播放测试
      </ThemedText>
      
      <ThemedView style={styles.infoContainer}>
        <ThemedText type="subtitle">音频信息</ThemedText>
        <ThemedText>状态: {isLoaded ? (isPlaying ? '播放中' : '已暂停') : '未加载'}</ThemedText>
        <ThemedText>时长: {formatTime(duration)}</ThemedText>
        <ThemedText>当前位置: {formatTime(position)}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.controlsContainer}>
        <ThemedText type="subtitle" style={styles.controlsTitle}>
          播放控制
        </ThemedText>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint }]}
            onPress={playAudio}
          >
            <IconSymbol name="play.fill" size={24} color="white" />
            <ThemedText style={styles.buttonText}>播放</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint }]}
            onPress={pauseAudio}
            disabled={!isLoaded}
          >
            <IconSymbol name="pause.fill" size={24} color="white" />
            <ThemedText style={styles.buttonText}>暂停</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint }]}
            onPress={stopAudio}
            disabled={!isLoaded}
          >
            <IconSymbol name="stop.fill" size={24} color="white" />
            <ThemedText style={styles.buttonText}>停止</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      <ThemedView style={styles.seekContainer}>
        <ThemedText type="subtitle">快速跳转</ThemedText>
        <View style={styles.seekButtons}>
          <TouchableOpacity
            style={[styles.seekButton, { backgroundColor: colors.tint }]}
            onPress={() => seekAudio(0)}
            disabled={!isLoaded}
          >
            <ThemedText style={styles.seekButtonText}>开始</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.seekButton, { backgroundColor: colors.tint }]}
            onPress={() => seekAudio(duration * 0.25)}
            disabled={!isLoaded}
          >
            <ThemedText style={styles.seekButtonText}>25%</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.seekButton, { backgroundColor: colors.tint }]}
            onPress={() => seekAudio(duration * 0.5)}
            disabled={!isLoaded}
          >
            <ThemedText style={styles.seekButtonText}>50%</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.seekButton, { backgroundColor: colors.tint }]}
            onPress={() => seekAudio(duration * 0.75)}
            disabled={!isLoaded}
          >
            <ThemedText style={styles.seekButtonText}>75%</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      <ThemedView style={styles.noteContainer}>
        <ThemedText type="subtitle">说明</ThemedText>
        <ThemedText style={styles.noteText}>
          这个测试页面使用了一个在线的音频文件。在实际应用中，你可以：
        </ThemedText>
        <ThemedText style={styles.noteText}>
          • 使用本地音频文件 (require('./audio.mp3'))
        </ThemedText>
        <ThemedText style={styles.noteText}>
          • 从网络加载音频文件
        </ThemedText>
        <ThemedText style={styles.noteText}>
          • 录制音频并播放
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  infoContainer: {
    gap: 8,
    marginBottom: 30,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  controlsContainer: {
    gap: 15,
    marginBottom: 30,
  },
  controlsTitle: {
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 8,
    minWidth: 80,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  seekContainer: {
    gap: 15,
    marginBottom: 30,
  },
  seekButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  seekButton: {
    padding: 10,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  seekButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  noteContainer: {
    gap: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 