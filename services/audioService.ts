import { Emotion } from '../types';

interface SoundMap {
  [key: string]: string; // key: sound name, value: file path
}

const BGM_PLAYLIST: string[] = [
  '/Dance in the Moonlight.mp3',
  '/Dancing in the moonlight(ending).mp3',
];

const SFX_TRACKS: SoundMap = {
  click: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_89c6395e37.mp3',
  message: 'https://cdn.pixabay.com/download/audio/2022/11/19/audio_b859942a3a.mp3',
  openPanel: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_32345607e1.mp3',
  closePanel: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_32345607e1.mp3',
};

const AMBIANCE_TRACKS: SoundMap = {
    lab: 'https://cdn.pixabay.com/download/audio/2023/04/10/audio_845c48b0a9.mp3',
    ruin: 'https://cdn.pixabay.com/download/audio/2022/09/21/audio_18215d2a83.mp3',
    valley: 'https://cdn.pixabay.com/download/audio/2022/11/21/audio_a210759052.mp3',
    mountain: 'https://cdn.pixabay.com/download/audio/2023/07/11/audio_248464f1e5.mp3',
    clouds: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_a73788559a.mp3',
    castle: 'https://cdn.pixabay.com/download/audio/2023/10/05/audio_2e25f82d1c.mp3',
};

class AudioService {
  private bgm: HTMLAudioElement | null = null;
  private ambiance: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;
  
  private currentBgmKey: string | null = null;
  private currentAmbianceKey: string | null = null;

  private bgmFadeInterval: { id: ReturnType<typeof setInterval> | null } = { id: null };
  private ambianceFadeInterval: { id: ReturnType<typeof setInterval> | null } = { id: null };

  constructor() {
    if (typeof Audio !== 'undefined') {
      this.bgm = new Audio();
      this.bgm.volume = 0;
      this.bgm.loop = true;
      this.bgm.crossOrigin = "anonymous";

      this.ambiance = new Audio();
      this.ambiance.loop = true;
      this.ambiance.volume = 0;
      this.ambiance.crossOrigin = "anonymous";
    }
  }

  initialize() {
    if (this.isInitialized || !this.bgm || !this.ambiance) return;
    // Play and immediately pause to "unlock" the audio elements for autoplay on some browsers/OS
    this.bgm.play().then(() => this.bgm?.pause()).catch(() => {});
    this.ambiance.play().then(() => this.ambiance?.pause()).catch(() => {});
    this.isInitialized = true;
    console.log('Audio Service Initialized by user interaction.');
  }

  playBgm(trackKey: string) {
    if (!this.isInitialized || !this.bgm || !trackKey) {
        return;
    }

    const newTrackSrc = trackKey === 'ending' ? BGM_PLAYLIST[1] : BGM_PLAYLIST[0];
    
    // Check if the source needs to be changed.
    const currentSrc = this.bgm.src.substring(this.bgm.src.lastIndexOf('/'));
    const newSrcBasename = newTrackSrc.substring(newTrackSrc.lastIndexOf('/'));
    
    if (this.currentBgmKey === trackKey && currentSrc === newSrcBasename && !this.bgm.paused) {
        return; // The correct music is already playing
    }
    
    this.currentBgmKey = trackKey; // Set key immediately

    this.fadeOut(this.bgm, this.bgmFadeInterval).then(() => {
        if (this.currentBgmKey !== trackKey) return; 

        this.bgm!.src = newTrackSrc;
        this.bgm!.load();
        if (!this.isMuted) {
            this.fadeIn(this.bgm!, this.bgmFadeInterval, 0.5);
        }
    });
  }
  
  stopBgm() {
    if (!this.bgm) return;
    this.currentBgmKey = null;
    this.fadeOut(this.bgm, this.bgmFadeInterval);
  }

  playAmbiance(trackKey: string) {
    if (!this.isInitialized || this.currentAmbianceKey === trackKey || !this.ambiance) {
      return;
    }

    const trackSrc = AMBIANCE_TRACKS[trackKey];
    if (!trackSrc) {
        this.stopAmbiance();
        return;
    };
    
    this.currentAmbianceKey = trackKey;
    
    this.fadeOut(this.ambiance, this.ambianceFadeInterval).then(() => {
        if (this.currentAmbianceKey !== trackKey) return;
        this.ambiance!.src = trackSrc;
        this.ambiance!.load();
        if(!this.isMuted) {
            this.fadeIn(this.ambiance!, this.ambianceFadeInterval, 0.7);
        }
    });
  }

  stopAmbiance() {
    if (!this.ambiance) return;
    this.currentAmbianceKey = null;
    this.fadeOut(this.ambiance, this.ambianceFadeInterval);
  }

  playSfx(sfxKey: string) {
    if (!this.isInitialized || this.isMuted) return;

    const sfxSrc = SFX_TRACKS[sfxKey];
    if (sfxSrc) {
      const sfx = new Audio(sfxSrc);
      sfx.volume = 0.7;
      sfx.crossOrigin = "anonymous";
      sfx.play().catch(e => console.error("SFX play failed:", e));
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgm) this.bgm.muted = this.isMuted;
    if (this.ambiance) this.ambiance.muted = this.isMuted;
    return this.isMuted;
  }
  
  getIsMuted(): boolean {
      return this.isMuted;
  }

  private fadeIn(audioEl: HTMLAudioElement, intervalRef: { id: ReturnType<typeof setInterval> | null }, maxVolume: number) {
    const playPromise = audioEl.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        if (intervalRef.id) clearInterval(intervalRef.id);
        audioEl.volume = 0; // Start fade from 0
        intervalRef.id = setInterval(() => {
          const newVolume = audioEl.volume + 0.05;
          if (newVolume < maxVolume) {
            audioEl.volume = newVolume;
          } else {
            audioEl.volume = maxVolume;
            if (intervalRef.id) clearInterval(intervalRef.id);
            intervalRef.id = null;
          }
        }, 100);
      }).catch(error => {
        console.error("Audio playback error:", error);
      });
    }
  }

  private fadeOut(audioEl: HTMLAudioElement, intervalRef: { id: ReturnType<typeof setInterval> | null }): Promise<void> {
    return new Promise((resolve) => {
        if (!audioEl || audioEl.paused || audioEl.volume < 0.01) {
            if (audioEl) {
                audioEl.volume = 0;
                audioEl.pause();
                audioEl.src = ''; // Clear src to stop loading
            }
            resolve();
            return;
        };

        if (intervalRef.id) clearInterval(intervalRef.id);

        intervalRef.id = setInterval(() => {
            const newVolume = audioEl.volume - 0.05;
            if (newVolume > 0.01) {
                audioEl.volume = newVolume;
            } else {
                audioEl.volume = 0;
                audioEl.pause();
                audioEl.src = ''; // Clear src to stop loading
                if (intervalRef.id) clearInterval(intervalRef.id);
                intervalRef.id = null;
                resolve();
            }
        }, 100);
    });
  }
}

export const audioService = new AudioService();
