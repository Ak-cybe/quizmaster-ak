import { useCallback, useRef } from "react";

type SoundType = "correct" | "incorrect" | "celebration" | "tick" | "click";

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    gain: number = 0.3,
    delay: number = 0
  ) => {
    const ctx = getAudioContext();
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    
    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + duration);
  }, [getAudioContext]);

  const playCorrect = useCallback(() => {
    // Happy ascending arpeggio
    playTone(523.25, 0.15, "sine", 0.25, 0);      // C5
    playTone(659.25, 0.15, "sine", 0.25, 0.1);    // E5
    playTone(783.99, 0.2, "sine", 0.3, 0.2);      // G5
    playTone(1046.50, 0.3, "sine", 0.25, 0.3);    // C6
  }, [playTone]);

  const playIncorrect = useCallback(() => {
    // Descending minor sound
    playTone(400, 0.15, "sawtooth", 0.15, 0);
    playTone(350, 0.15, "sawtooth", 0.12, 0.12);
    playTone(300, 0.25, "sawtooth", 0.1, 0.24);
  }, [playTone]);

  const playCelebration = useCallback(() => {
    // Fanfare celebration
    const notes = [
      { freq: 523.25, time: 0 },      // C5
      { freq: 523.25, time: 0.1 },    // C5
      { freq: 659.25, time: 0.2 },    // E5
      { freq: 783.99, time: 0.3 },    // G5
      { freq: 1046.50, time: 0.45 },  // C6
      { freq: 1318.51, time: 0.6 },   // E6
      { freq: 1567.98, time: 0.8 },   // G6
    ];
    
    notes.forEach(({ freq, time }) => {
      playTone(freq, 0.2, "sine", 0.2, time);
    });

    // Add some sparkle
    setTimeout(() => {
      playTone(2093, 0.1, "sine", 0.1, 0);
      playTone(2349, 0.1, "sine", 0.1, 0.05);
      playTone(2637, 0.15, "sine", 0.12, 0.1);
    }, 900);
  }, [playTone]);

  const playTick = useCallback(() => {
    playTone(800, 0.05, "sine", 0.1, 0);
  }, [playTone]);

  const playClick = useCallback(() => {
    playTone(600, 0.08, "triangle", 0.15, 0);
  }, [playTone]);

  const play = useCallback((sound: SoundType) => {
    switch (sound) {
      case "correct":
        playCorrect();
        break;
      case "incorrect":
        playIncorrect();
        break;
      case "celebration":
        playCelebration();
        break;
      case "tick":
        playTick();
        break;
      case "click":
        playClick();
        break;
    }
  }, [playCorrect, playIncorrect, playCelebration, playTick, playClick]);

  return { play, playCorrect, playIncorrect, playCelebration, playTick, playClick };
}
