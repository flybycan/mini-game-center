import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.about': 'About',
      
      // Game titles
      'game.memory.title': 'Memory Game',
      'game.sliding.title': 'Sliding Puzzle',
      'game.dice.title': 'Dice Roll',
      'game.whack.title': 'Whack-a-Mole',
      'game.snake.title': 'Snake Game',
      'game.bubble.title': 'Bubble Pop',
      'game.tetris.title': 'Mini Tetris',
      'game.reaction.title': 'Reaction Time',
      'game.match3.title': 'Match Three',
      'game.quiz.title': 'Quick Quiz',
      'game.color.title': 'Color Match',
      'game.typing.title': 'Typing Speed',
      
      // Game descriptions
      'game.memory.desc': 'Test your memory by matching pairs of cards',
      'game.sliding.desc': 'Arrange the numbers in order by sliding tiles',
      'game.dice.desc': 'Roll the dice and test your luck',
      'game.whack.desc': 'Test your reflexes by catching the moles',
      'game.snake.desc': 'Classic snake game with modern twist',
      'game.bubble.desc': 'Pop colorful bubbles in this relaxing game',
      'game.tetris.desc': 'Classic block-stacking puzzle game',
      'game.reaction.desc': 'Test your reaction speed',
      'game.match3.desc': 'Match similar items in rows or columns',
      'game.quiz.desc': 'Test your knowledge with quick questions',
      'game.color.desc': 'Quickly determine if the colors match',
      'game.typing.desc': 'Test your typing speed',
      
      // Common buttons and labels
      'common.start': 'Start Game',
      'common.reset': 'Reset',
      'common.pause': 'Pause',
      'common.resume': 'Resume',
      'common.score': 'Score',
      'common.highScore': 'High Score',
      'common.gameOver': 'Game Over',
      'common.newGame': 'New Game',
      'common.back': 'Back',
      'common.language': 'Language'
    }
  },
  zh: {
    translation: {
      // 导航
      'nav.home': '首页',
      'nav.about': '关于',
      
      // 游戏标题
      'game.memory.title': '记忆游戏',
      'game.sliding.title': '滑块拼图',
      'game.dice.title': '掷骰子',
      'game.whack.title': '打地鼠',
      'game.snake.title': '贪吃蛇',
      'game.bubble.title': '泡泡消除',
      'game.tetris.title': '俄罗斯方块',
      'game.reaction.title': '反应速度',
      'game.match3.title': '三消游戏',
      'game.quiz.title': '快速问答',
      'game.color.title': '颜色匹配',
      'game.typing.title': '打字速度',
      
      // 游戏描述
      'game.memory.desc': '通过匹配卡片对来测试你的记忆力',
      'game.sliding.desc': '通过滑动方块来按顺序排列数字',
      'game.dice.desc': '掷骰子来测试你的运气',
      'game.whack.desc': '通过抓住地鼠来测试你的反应能力',
      'game.snake.desc': '经典贪吃蛇游戏的现代版本',
      'game.bubble.desc': '在这个轻松的游戏中消除彩色泡泡',
      'game.tetris.desc': '经典的方块堆叠益智游戏',
      'game.reaction.desc': '测试你的反应速度',
      'game.match3.desc': '在行或列中匹配相似的物品',
      'game.quiz.desc': '通过快速问答测试你的知识',
      'game.color.desc': '快速判断颜色是否匹配',
      'game.typing.desc': '测试你的打字速度',
      
      // 通用按钮和标签
      'common.start': '开始游戏',
      'common.reset': '重置',
      'common.pause': '暂停',
      'common.resume': '继续',
      'common.score': '得分',
      'common.highScore': '最高分',
      'common.gameOver': '游戏结束',
      'common.newGame': '新游戏',
      'common.back': '返回',
      'common.language': '语言'
    }
  }
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;