# Changelog

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