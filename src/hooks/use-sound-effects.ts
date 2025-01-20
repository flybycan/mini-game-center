import { useCallback } from 'react';

const AUDIO_FILES = {
  pop: new Audio('/sounds/pop.mp3'),
  special: new Audio('/sounds/special.mp3'),
  gameOver: new Audio('/sounds/game-over.mp3')
};

// 预加载音频文件
Object.values(AUDIO_FILES).forEach(audio => {
  audio.load();
});

export const useSoundEffects = () => {
  const playSound = useCallback((type: keyof typeof AUDIO_FILES) => {
    const audio = AUDIO_FILES[type];
    audio.currentTime = 0;
    audio.play().catch(() => {
      // 忽略用户未进行交互时的自动播放错误
    });
  }, []);

  return { playSound };
};