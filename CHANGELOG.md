# Changelog

## [1.0.2] - 2025-03-09

### Features

- Added multiplayer support to Snake Game with two-player mode
- Added AI opponent mode to Snake Game for single-player challenge
- Enhanced game over screen with detailed score information and play again option
- Implemented player-specific controls (arrow keys for Player 1, WASD for Player 2)
- Added visual distinction between player snakes with different colors

### Enhancements

- Improved snake movement mechanics for smoother gameplay
- Added collision detection between multiple snakes
- Optimized food generation to avoid spawning on snake bodies
- Enhanced game speed calculation based on score progression

### Bug Fixes

- Fixed collision detection issues in multiplayer mode
- Resolved keyboard control conflicts in two-player mode
- Fixed score tracking and high score updates in multiplayer games

## [1.0.1] - 2025-02-05

### Enhancements

- Optimized route language parameter format by moving language identifier to the end of the route path
- Improved language switching logic in navigation component for a smoother language switching experience
- Enhanced game page language switching functionality to ensure correct display of game content in current language

### Bug Fixes

- Fixed route navigation issues during language switching
- Fixed language parameter inconsistency in game pages
- Fixed language state update issues in navigation component

### Technical Improvements

- Unified route language parameter format using `/:lang` as a consistent language identifier suffix
- Optimized language switching state management to reduce unnecessary component re-renders
- Improved route navigation logic to ensure language parameter consistency