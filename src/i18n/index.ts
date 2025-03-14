import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.title': 'Portfolio',
      
      // Home
      'home.title': 'Mini Game Center',
      'home.description': 'A collection of fun and engaging mini games to enjoy in your browser',
      
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
      'game.2048.title': '2048 Game',
      
      // Game descriptions
      'game.memory.desc': 'Test your memory by matching pairs of cards',
      'game.sliding.desc': 'Arrange the numbers in order by sliding tiles',
      'game.dice.desc': 'Roll the dice and test your luck',
      'game.dice.earned': 'You earned {{points}} points!',
      'game.dice.allSame': 'All same numbers! You earned {{points}} points!',
      'game.dice.sequence': 'Nice sequence! Bonus {{bonus}} points, total {{points}} points!',
      'game.dice.ofAKind': '{{count}} of a kind! You earned {{points}} points!',
      'game.dice.diceCount': '{{count}} Dice',
      'game.dice.rolling': 'Rolling...',
      'game.dice.rollButton': 'Roll the dice',
      'game.dice.currentScore': 'Current Score',
      'game.dice.totalRolls': 'Total Rolls',
      'game.whack.desc': 'Test your reflexes by catching the moles',
      'game.whack.inProgress': 'Game in progress...',
      'game.whack.time': 'Time',
      'game.snake.desc': 'Classic snake game with modern twist',
      'game.snake.score': 'Score',
      'game.snake.highScore': 'High Score',
      'game.snake.speed': 'Speed',
      'game.snake.controls': 'Controls',
      'game.snake.startGame': 'Start Game',
      'game.snake.resetGame': 'Reset',
      'game.snake.gameOver': 'Game Over!',
      'game.snake.newRecord': 'New Record!',
      'game.snake.pause': 'Pause',
      'game.snake.resume': 'Resume',
      'game.snake.singlePlayer': 'Single Player',
      'game.snake.twoPlayers': 'Two Players',
      'game.snake.vsAI': 'VS AI',
      'game.snake.player1': 'Player 1',
      'game.snake.player2': 'Player 2',
      'game.snake.ai': 'AI',
      'game.snake.finalScore': 'Final Score',
      'game.snake.playAgain': 'Play Again',
      'game.snake.player1Lost': 'Player 1 lost!',
      'game.snake.player2Lost': 'Player 2 lost!',
      'game.bubble.desc': 'Pop colorful bubbles in this relaxing game',
      'game.tetris.desc': 'Classic block-stacking puzzle game',
      'game.reaction.desc': 'Test your reaction speed',
      'game.reaction.tooEarly': 'Too early!',
      'game.reaction.waitForGreen': 'Wait for the green color before clicking!',
      'game.reaction.newRecord': 'New Best Time!',
      'game.reaction.recordDesc': '{{time}}ms - You\'ve set a new record!',
      'game.reaction.wait': 'Wait...',
      'game.reaction.clickNow': 'Click now!',
      'game.reaction.tryAgain': '{{time}}ms - Click to try again',
      'game.reaction.clickToStart': 'Click to start',
      'game.reaction.bestTime': 'Best Time: {{time}}ms',
      'game.match3.desc': 'Match similar items in rows or columns',
      'game.match3.score': 'Score',
      'game.match3.newGame': 'New Game',
      'game.match3.invalidMove': 'Invalid Move',
      'game.match3.tryMatch': 'Try to match three or more items of the same color',
      'game.quiz.desc': 'Test your knowledge with quick questions',
      'game.quiz.instruction': 'Test your knowledge with quick questions! You have 15 seconds per question.',
      'game.quiz.startGame': 'Start Game',
      'game.quiz.playAgain': 'Play Again',
      'game.quiz.gameOver': 'Game Over',
      'game.quiz.finalScore': 'Final Score: {{score}}/{{total}}',
      'game.quiz.correct': 'Correct!',
      'game.quiz.point': '+1 Point',
      'game.quiz.question': 'Question {{current}}/{{total}}',
      'game.quiz.score': 'Score',
      'game.quiz.timeLeft': 'Time Left',
      'game.quiz.q1.question': 'What is the capital of France?',
      'game.quiz.q1.options.0': 'London',
      'game.quiz.q1.options.1': 'Berlin',
      'game.quiz.q1.options.2': 'Paris',
      'game.quiz.q1.options.3': 'Madrid',
      'game.quiz.q2.question': 'Which planet is known as the Red Planet?',
      'game.quiz.q2.options.0': 'Venus',
      'game.quiz.q2.options.1': 'Mars',
      'game.quiz.q2.options.2': 'Jupiter',
      'game.quiz.q2.options.3': 'Saturn',
      'game.quiz.q3.question': 'What is the largest mammal in the world?',
      'game.quiz.q3.options.0': 'African Elephant',
      'game.quiz.q3.options.1': 'Blue Whale',
      'game.quiz.q3.options.2': 'Giraffe',
      'game.quiz.q3.options.3': 'Polar Bear',
      'game.quiz.q4.question': 'Who painted the Mona Lisa?',
      'game.quiz.q4.options.0': 'Van Gogh',
      'game.quiz.q4.options.1': 'Da Vinci',
      'game.quiz.q4.options.2': 'Picasso',
      'game.quiz.q4.options.3': 'Rembrandt',
      'game.quiz.q5.question': 'What is the chemical symbol for gold?',
      'game.quiz.q5.options.0': 'Ag',
      'game.quiz.q5.options.1': 'Fe',
      'game.quiz.q5.options.2': 'Au',
      'game.quiz.q5.options.3': 'Cu',
      'game.color.desc': 'Quickly determine if the colors match',
      'game.typing.desc': 'Test your typing speed',
      'game.typing.instruction': 'Type the word shown below as quickly as possible',
      'game.typing.playGame': 'Start Typing',
      'game.typing.timeLeft': 'Time Left: {{time}}s',
      'game.typing.currentScore': 'Words: {{score}}',
      'game.typing.topScore': 'Best: {{score}} words',
      'game.typing.enterWord': 'Type here...',
      'game.typing.right': 'Correct!',
      'game.typing.newRecord': 'New Record!',
      'game.typing.highScore': 'You typed {{score}} words!',
      'game.2048.desc': 'Merge tiles to reach 2048 in this addictive puzzle game',

      // About Page
      'about.title': 'About Mini Game Center',
      'about.description': 'Your destination for free online mini-games that bring fun and challenge to your daily breaks!',
      
      'about.mission.title': 'Our Mission',
      'about.mission.description': 'Mini Game Center is dedicated to providing a collection of free, engaging, and easy-to-play games that anyone can enjoy. Whether you have 5 minutes or an hour, our games are designed to offer instant entertainment while helping you develop various skills like memory, reflexes, and problem-solving abilities.',
      
      'about.features.instantPlay.title': 'Instant Play',
      'about.features.instantPlay.description': 'No downloads or installations required - play directly in your browser',
      'about.features.freeForever.title': 'Free Forever',
      'about.features.freeForever.description': 'All our games are completely free to play with no hidden costs',
      'about.features.familyFriendly.title': 'Family Friendly',
      'about.features.familyFriendly.description': 'Safe and enjoyable games suitable for players of all ages',
      'about.features.growingCollection.title': 'Growing Collection',
      'about.features.growingCollection.description': 'New games added regularly to keep the fun fresh and exciting',
      
      'about.games.title': 'Our Games',
      'about.games.brainTraining.title': 'Brain Training',
      'about.games.brainTraining.memory': 'Memory Game - Test and improve your memory',
      'about.games.brainTraining.quiz': 'Quick Quiz - Challenge your knowledge',
      'about.games.brainTraining.match3': 'Match Three - Exercise pattern recognition',
      'about.games.reflexes.title': 'Reflexes & Skills',
      'about.games.reflexes.whackamole': 'Whack-a-Mole - Train your reflexes',
      'about.games.reflexes.reaction': 'Reaction Time - Test your speed',
      'about.games.reflexes.typing': 'Typing Speed - Improve your typing',
      
      'about.contact.title': 'Get in Touch',
      'about.contact.description': 'Have suggestions for new games? Found a bug? We\'d love to hear from you!',
      'about.contact.button': 'Contact Us',
      
      // Tetris Game specific
      'game.tetris.score': 'Score',
      'game.tetris.pause': 'Pause',
      'game.tetris.resume': 'Resume',
      'game.tetris.newGame': 'New Game',
      'game.tetris.gameOver': 'Game Over!',
      'game.tetris.finalScore': 'Final Score: {{score}}',
      'game.tetris.playAgain': 'Play Again',
      'game.tetris.paused': 'Paused',
      'game.tetris.rotate': 'Rotate',
      'game.tetris.drop': 'Drop',
      'game.tetris.linesCleared': 'Lines Cleared!',
      'game.tetris.clearedLines': 'You cleared {{lines}} lines! +{{points}} points',
      
      // 2048 Game specific
      'game.2048.score': 'Score',
      'game.2048.bestScore': 'Best Score',
      'game.2048.restart': 'Restart Game',
      'game.2048.useArrows': 'Use Arrows',
      'game.2048.gameOver': 'Game Over!',
      'game.2048.newRecord': 'New Record!',
      
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
      'common.language': 'Language',
      // Color Match Game specific
      'game.color.instruction': 'Match the color name with its displayed color',
      'game.color.time': 'Time',
      'game.color.matching': 'Matching',
      'game.color.mismatch': 'Not Matching',
      'game.color.correct': 'Correct!',
      'game.color.incorrect': 'Incorrect!',
      'game.color.combo': 'Combo x{{combo}}!',
      'game.color.timeBonus': 'Time Bonus!',
      'game.color.timeBonusDesc': '+{{seconds}} seconds',
      'game.color.finalScore': 'Final Score: {{score}}',
      'game.color.maxCombo': 'Max Combo: x{{combo}}',
      'game.color.colors.red': 'Red',
      'game.color.colors.blue': 'Blue',
      'game.color.colors.green': 'Green',
      'game.color.colors.yellow': 'Yellow',
      'game.color.colors.purple': 'Purple',
      'game.color.colors.orange': 'Orange',
      'game.color.colors.pink': 'Pink',
      'game.color.colors.cyan': 'Cyan',
      

    }
  },
  zh: {
    translation: {
      // 导航
      'nav.home': '首页',
      'nav.about': '关于',
      'nav.title': '作品集',
      
      // 首页
      'home.title': '迷你游戏中心',
      'home.description': '一个有趣且引人入胜的迷你游戏集合，让您在浏览器中尽情享受',
      
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
      'game.2048.title': '2048游戏',
      
      // 游戏描述
      'game.memory.desc': '通过匹配卡片对来测试你的记忆力',
      'game.sliding.desc': '通过滑动方块来按顺序排列数字',
      'game.dice.desc': '掷骰子来测试你的运气',
      'game.dice.earned': '你获得了 {{points}} 分！',
      'game.dice.allSame': '全部相同！你获得了 {{points}} 分！',
      'game.dice.sequence': '漂亮的顺子！额外奖励 {{bonus}} 分，总共 {{points}} 分！',
      'game.dice.ofAKind': '{{count}} 个相同！你获得了 {{points}} 分！',
      'game.dice.diceCount': '{{count}} 个骰子',
      'game.dice.rolling': '正在掷骰子...',
      'game.dice.rollButton': '掷骰子',
      'game.dice.currentScore': '当前得分',
      'game.dice.totalRolls': '总投掷次数',
      'game.whack.desc': '通过抓住地鼠来测试你的反应能力',
      'game.whack.inProgress': '游戏进行中...',
      'game.whack.time': '时间',
      'game.snake.desc': '经典贪吃蛇游戏的现代版本',
      'game.snake.score': '得分',
      'game.snake.highScore': '最高分',
      'game.snake.speed': '速度',
      'game.snake.controls': '控制',
      'game.snake.startGame': '开始游戏',
      'game.snake.resetGame': '重置',
      'game.snake.gameOver': '游戏结束！',
      'game.snake.newRecord': '新纪录！',
      'game.snake.pause': '暂停',
      'game.snake.resume': '继续',
      'game.snake.singlePlayer': '单人模式',
      'game.snake.twoPlayers': '双人模式',
      'game.snake.vsAI': '对战AI',
      'game.snake.player1': '玩家1',
      'game.snake.player2': '玩家2',
      'game.snake.ai': '人工智能',
      'game.snake.finalScore': '最终得分',
      'game.snake.playAgain': '再玩一次',
      'game.snake.player1Lost': '玩家1失败！',
      'game.snake.player2Lost': '玩家2失败！',
      'game.bubble.desc': '在这个轻松的游戏中消除彩色泡泡',
      'game.tetris.desc': '经典的方块堆叠益智游戏',
      'game.reaction.desc': '测试你的反应速度',
      'game.reaction.tooEarly': '太早了！',
      'game.reaction.waitForGreen': '请等待绿色出现后再点击！',
      'game.reaction.newRecord': '新纪录！',
      'game.reaction.recordDesc': '{{time}}毫秒 - 你创造了新纪录！',
      'game.reaction.wait': '等待...',
      'game.reaction.clickNow': '立即点击！',
      'game.reaction.tryAgain': '{{time}}毫秒 - 点击重试',
      'game.reaction.clickToStart': '点击开始',
      'game.reaction.bestTime': '最佳时间：{{time}}毫秒',
      'game.match3.desc': '在行或列中匹配相似的物品',
      'game.match3.score': '得分',
      'game.match3.newGame': '新游戏',
      'game.match3.invalidMove': '无效移动',
      'game.match3.tryMatch': '尝试匹配三个或更多相同颜色的物品',
      'game.quiz.desc': '通过快速问答测试你的知识',
      'game.quiz.instruction': '测试你的知识！每个问题有15秒的答题时间。',
      'game.quiz.startGame': '开始游戏',
      'game.quiz.playAgain': '再玩一次',
      'game.quiz.gameOver': '游戏结束',
      'game.quiz.finalScore': '最终得分：{{score}}/{{total}}',
      'game.quiz.correct': '回答正确！',
      'game.quiz.point': '+1分',
      'game.quiz.question': '问题 {{current}}/{{total}}',
      'game.quiz.score': '得分',
      'game.quiz.timeLeft': '剩余时间',
      'game.quiz.q1.question': '法国的首都是什么？',
      'game.quiz.q1.options.0': '伦敦',
      'game.quiz.q1.options.1': '柏林',
      'game.quiz.q1.options.2': '巴黎',
      'game.quiz.q1.options.3': '马德里',
      'game.quiz.q2.question': '哪个行星被称为红色星球？',
      'game.quiz.q2.options.0': '金星',
      'game.quiz.q2.options.1': '火星',
      'game.quiz.q2.options.2': '木星',
      'game.quiz.q2.options.3': '土星',
      'game.quiz.q3.question': '世界上最大的哺乳动物是什么？',
      'game.quiz.q3.options.0': '非洲象',
      'game.quiz.q3.options.1': '蓝鲸',
      'game.quiz.q3.options.2': '长颈鹿',
      'game.quiz.q3.options.3': '北极熊',
      'game.quiz.q4.question': '谁画了蒙娜丽莎？',
      'game.quiz.q4.options.0': '梵高',
      'game.quiz.q4.options.1': '达芬奇',
      'game.quiz.q4.options.2': '毕加索',
      'game.quiz.q4.options.3': '伦勃朗',
      'game.quiz.q5.question': '金的化学符号是什么？',
      'game.quiz.q5.options.0': 'Ag',
      'game.quiz.q5.options.1': 'Fe',
      'game.quiz.q5.options.2': 'Au',
      'game.quiz.q5.options.3': 'Cu',
      'game.color.desc': '快速判断颜色是否匹配',
      'game.typing.desc': '测试你的打字速度',
      'game.typing.instruction': '尽快输入下方显示的单词',
      'game.typing.playGame': '开始打字',
      'game.typing.timeLeft': '剩余时间：{{time}}秒',
      'game.typing.currentScore': '单词数：{{score}}',
      'game.typing.topScore': '最佳：{{score}}个单词',
      'game.typing.enterWord': '在此输入...',
      'game.typing.right': '正确！',
      'game.typing.newRecord': '新纪录！',
      'game.typing.highScore': '你输入了{{score}}个单词！',
      'game.2048.desc': '在这个令人上瘾的益智游戏中合并方块以达到2048',

      // 关于页面
      'about.title': '关于迷你游戏中心',
      'about.description': '您的免费在线迷你游戏目的地，为您的日常休息时间带来乐趣和挑战！',
      
      'about.mission.title': '我们的使命',
      'about.mission.description': '迷你游戏中心致力于提供一系列免费、有趣且易于上手的游戏，让每个人都能享受。无论您有5分钟还是一小时的时间，我们的游戏都能为您提供即时娱乐，同时帮助您提升记忆力、反应能力和解决问题的能力。',
      
      'about.features.instantPlay.title': '即刻游戏',
      'about.features.instantPlay.description': '无需下载安装 - 直接在浏览器中畅玩',
      'about.features.freeForever.title': '永久免费',
      'about.features.freeForever.description': '所有游戏完全免费，绝无隐藏费用',
      'about.features.familyFriendly.title': '全家欢乐',
      'about.features.familyFriendly.description': '安全有趣的游戏，适合所有年龄段的玩家',
      'about.features.growingCollection.title': '持续更新',
      'about.features.growingCollection.description': '定期添加新游戏，保持新鲜感和趣味性',
      
      'about.games.title': '我们的游戏',
      'about.games.brainTraining.title': '大脑训练',
      'about.games.brainTraining.memory': '记忆游戏 - 测试并提升您的记忆力',
      'about.games.brainTraining.quiz': '快速问答 - 挑战您的知识储备',
      'about.games.brainTraining.match3': '三消游戏 - 锻炼模式识别能力',
      'about.games.reflexes.title': '反应与技能',
      'about.games.reflexes.whackamole': '打地鼠 - 训练您的反应能力',
      'about.games.reflexes.reaction': '反应时间 - 测试您的速度',
      'about.games.reflexes.typing': '打字速度 - 提升您的打字技能',
      
      'about.contact.title': '联系我们',
      'about.contact.description': '有新游戏建议？发现了bug？我们很乐意听取您的意见！',
      'about.contact.button': '联系我们',
      
      // 俄罗斯方块游戏专用
      'game.tetris.score': '得分',
      'game.tetris.pause': '暂停',
      'game.tetris.resume': '继续',
      'game.tetris.newGame': '新游戏',
      'game.tetris.gameOver': '游戏结束！',
      'game.tetris.finalScore': '最终得分：{{score}}',
      'game.tetris.playAgain': '再玩一次',
      'game.tetris.paused': '已暂停',
      'game.tetris.rotate': '旋转',
      'game.tetris.drop': '下落',
      'game.tetris.linesCleared': '消除行数！',
      'game.tetris.clearedLines': '你消除了 {{lines}} 行！+{{points}} 分',
      
      // 2048游戏专用
      'game.2048.score': '得分',
      'game.2048.bestScore': '最高分',
      'game.2048.restart': '重新开始',
      'game.2048.useArrows': '使用方向键',
      'game.2048.gameOver': '游戏结束！',
      'game.2048.newRecord': '新纪录！',
      
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
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;