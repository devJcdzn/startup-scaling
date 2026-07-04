"use client";

import { useCallback, useRef } from "react";

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioContext) {
      audioContext = new AudioContext();
    }
    return audioContext;
  } catch {
    return null;
  }
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  endFrequency?: number
) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  if (endFrequency !== undefined) {
    oscillator.frequency.linearRampToValueAtTime(
      endFrequency,
      ctx.currentTime + duration
    );
  }

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

export function useSound() {
  const playClick = useCallback(() => {
    playTone(800, 0.05);
  }, []);

  const playSuccess = useCallback(() => {
    playTone(440, 0.2, "sine", 880);
  }, []);

  const playError = useCallback(() => {
    playTone(200, 0.3, "sawtooth");
  }, []);

  return { playClick, playSuccess, playError };
}
