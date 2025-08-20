import { Emotion } from '../types';

interface SoundMap {
  [key: string]: string; // key: sound name, value: file path
}

const BGM_PLAYLIST: string[] = [
  'https://cdn.jsdelivr.net/gh/k-next/sounds@main/bgm/menu.mp3', // Main/Menu BGM
  'https://cdn.jsdelivr.net/gh/k-next/sounds@main/bgm/ending.mp3', // Ending BGM
];

const SFX_TRACKS: SoundMap = {
  click: 'https://cdn.jsdelivr.net/gh/k-next/sounds@main/ui/click.mp3',
  message: 'https://cdn.jsdelivr.net/gh/k-next/sounds@main/ui/message.mp3',
  openPanel: 'https://cdn.jsdelivr.net/gh/k-next/sounds@main/ui/open.mp3',
  closePanel: 'https://cdn.jsdelivr.net/gh/k-next/sounds@main/ui/close.mp3',
};

const AMBIANCE_TRACKS: SoundMap = {
    lab: 'https://cdn.jsdelivr.net/gh/k-next/sounds@main/ambience/lab.mp3',
    ruin: 'https://cdn.jsdelivr.net/gh/k-next/sounds@main/ambience/ruins.mp3',
    valley: 'https://cdn.jsdelivr.net/gh/k-next/sounds@main/ambience/valley.mp3',
    mountain: 'https://cdn.jsdelivr.net/gh/k-next/sounds@main/ambience/mountain.mp3',
    clouds: 'https://cdn.jsdelivr.net/gh/k-next/sounds@main/ambience/wind.mp3',
    castle: 'https://cdn.jsdelivr.net/gh/k-next/sounds@main/ambience/castle.mp3',
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
    
    if (this.currentBgmKey === trackKey && this.bgm.src.includes(newSrcBasename) && !this.bgm.paused) {
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
    if (!this.isInitialized || !this.ambiance) {
        return;
    }
    
    const trackSrc = AMBIANCE_TRACKS[trackKey];
    if (!trackSrc) {
        this.stopAmbiance();
        return;
    };
    
    if (this.currentAmbianceKey === trackKey && !this.ambiance.paused) {
        return;
    }
    
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
                if (audioEl.src) {
                    audioEl.removeAttribute('src'); // Clear src to stop loading
                }
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
                if (audioEl.src) {
                    audioEl.removeAttribute('src'); // Clear src to stop loading
                }
                if (intervalRef.id) clearInterval(intervalRef.id);
                intervalRef.id = null;
                resolve();
            }
        }, 100);
    });
  }
}

export const audioService = new AudioService();