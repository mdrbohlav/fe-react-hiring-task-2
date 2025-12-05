import { useState, useEffect, useRef } from 'react';

export interface HTMLMediaProps {
  autoPlay?: boolean | undefined;
  controls?: boolean | undefined;
  controlsList?: string | undefined;
  crossOrigin?: 'anonymous' | 'use-credentials' | '' | undefined;
  loop?: boolean | undefined;
  mediaGroup?: string | undefined;
  muted?: boolean | undefined;
  playsInline?: boolean | undefined;
  preload?: string | undefined;
  src: string;
}

export interface HTMLMediaState {
  buffered: any[];
  duration: number;
  paused: boolean;
  muted: boolean;
  time: number;
  volume: number;
  playing: boolean;
}

export interface HTMLMediaControls {
  play: () => Promise<void> | void;
  pause: () => void;
  mute: () => void;
  unmute: () => void;
  volume: (volume: number) => void;
  seek: (time: number) => void;
}

const parseTimeRanges = (ranges: TimeRanges) => {
  const result: { start: number; end: number }[] = [];

  for (let i = 0; i < ranges.length; i++) {
    result.push({
      start: ranges.start(i),
      end: ranges.end(i),
    });
  }

  return result;
};

export const useAudio = (props: HTMLMediaProps) => {
  const [state, setState] = useState<HTMLMediaState>({
    buffered: [],
    time: 0,
    duration: 0,
    paused: true,
    muted: false,
    volume: 1,
    playing: false,
  });
  const ref = useRef<HTMLAudioElement>(null);
  const lockPlay = useRef(false);

  const controls: HTMLMediaControls = {
    play: () => {
      const el = ref.current;

      if (!el) return;
      if (lockPlay.current) return;

      const promise = el.play();
      const isPromise = typeof promise === 'object';

      if (isPromise) {
        lockPlay.current = true;

        const resetLock = () => {
          lockPlay.current = false;
        };

        promise.then(resetLock, resetLock);
      }

      return promise;
    },
    pause: () => {
      const el = ref.current;

      if (el && !lockPlay.current) {
        return el.pause();
      }
    },
    seek: (time) => {
      const el = ref.current;

      if (!el || state.duration === undefined) return;

      time = Math.min(state.duration, Math.max(0, time));
      el.currentTime = time;
    },
    volume: (volume) => {
      const el = ref.current;

      if (!el) return;

      volume = Math.min(1, Math.max(0, volume));
      el.volume = volume;

      setState((prev) => ({ ...prev, volume }));
    },
    mute: () => {
      const el = ref.current;

      if (!el) return;

      el.muted = true;
    },
    unmute: () => {
      const el = ref.current;

      if (!el) return;

      el.muted = false;
    },
  };

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    setState((prev) => ({
      ...prev,
      volume: el.volume,
      muted: el.muted,
      paused: el.paused,
    }));

    if (props.autoPlay && el.paused) {
      controls.play();
    }
  }, [props.src]);

  useEffect(() => {
    const element = new Audio();

    for (const prop of Object.keys(props) as (keyof HTMLMediaProps)[]) {
      element[prop] = props[prop];
    }

    const onPlay = () => setState((prev) => ({ ...prev, paused: false }));
    const onPlaying = () => setState((prev) => ({ ...prev, playing: true }));
    const onWaiting = () => setState((prev) => ({ ...prev, playing: false }));
    const onPause = () => setState((prev) => ({ ...prev, paused: true, playing: false }));
    const onVolumeChange = () => {
      const el = ref.current;

      if (!el) return;

      setState((prev) => ({
        ...prev,
        muted: el.muted,
        volume: el.volume,
      }));
    };
    const onDurationChange = () => {
      const el = ref.current;

      if (!el) return;

      const { duration, buffered } = el;

      setState((prev) => ({
        ...prev,
        duration,
        buffered: parseTimeRanges(buffered),
      }));
    };
    const onTimeUpdate = () => {
      const el = ref.current;

      if (!el) return;

      setState((prev) => ({ ...prev, time: el.currentTime }));
    };
    const onProgress = () => {
      const el = ref.current;

      if (!el) return;

      setState((prev) => ({ ...prev, buffered: parseTimeRanges(el.buffered) }));
    };

    element.addEventListener('play', onPlay);
    element.addEventListener('playing', onPlaying);
    element.addEventListener('waiting', onWaiting);
    element.addEventListener('pause', onPause);
    element.addEventListener('volumechange', onVolumeChange);
    element.addEventListener('durationchange', onDurationChange);
    element.addEventListener('timeupdate', onTimeUpdate);
    element.addEventListener('progress', onProgress);

    ref.current = element;

    return () => {
      element.removeEventListener('play', onPlay);
      element.removeEventListener('playing', onPlaying);
      element.removeEventListener('waiting', onWaiting);
      element.removeEventListener('pause', onPause);
      element.removeEventListener('volumechange', onVolumeChange);
      element.removeEventListener('durationchange', onDurationChange);
      element.removeEventListener('timeupdate', onTimeUpdate);
      element.removeEventListener('progress', onProgress);
    };
  }, []);

  return [state, controls, ref] as const;
};
