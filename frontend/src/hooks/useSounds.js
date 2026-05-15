import { useCallback } from 'react';
import { useGame } from '../context/GameContext';
import * as sounds from '../utils/sounds';

/**
 * Hook that wraps all sound effects with the settings check.
 * When sound is disabled in settings, all calls are no-ops.
 */
export function useSounds() {
  const { settings } = useGame();

  const play = useCallback((soundFn) => {
    if (settings?.soundEnabled) {
      try { soundFn(); } catch (e) { /* Silently fail if audio context blocked */ }
    }
  }, [settings?.soundEnabled]);

  return {
    correct:      () => play(sounds.playCorrect),
    wrong:        () => play(sounds.playWrong),
    tick:         () => play(sounds.playTick),
    criticalTick: () => play(sounds.playCriticalTick),
    powerUp:      () => play(sounds.playPowerUp),
    victory:      () => play(sounds.playVictory),
    defeat:       () => play(sounds.playDefeat),
    draw:         () => play(sounds.playDraw),
    click:        () => play(sounds.playClick),
    whoosh:       () => play(sounds.playWhoosh),
    timeout:      () => play(sounds.playTimeout),
    submit:       () => play(sounds.playSubmit),
  };
}
