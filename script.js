/**
 * AuraSound - Music Player Application Script
 * Vanilla JavaScript implementation using HTML5 Audio API.
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // Personalized Songs Data Source
  // ==========================================
  const songs = [
    {
      id: 0,
      title: "Yeh Fitoor Mera",
      artist: "Arijit Singh, Amit Trivedi",
      duration: "4:42",
      cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
      src: "assets/songs/yeh-fitoor-mera.mp3"
    },
    {
      id: 1,
      title: "Varoon",
      artist: "Anand Bhaskar, Ginny Diwan",
      duration: "4:15",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
      src: "assets/songs/varoon.mp3"
    },
    {
      id: 2,
      title: "Ishaq Ve",
      artist: "Zeeshan Ali, Yuvraj Tung",
      duration: "3:50",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
      src: "assets/songs/ishaq-ve.mp3"
    },
    {
      id: 3,
      title: "Ehsaas",
      artist: "Faheem Abdullah, Duha Shah",
      duration: "4:05",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80",
      src: "assets/songs/ehsaas.mp3"
    }
  ];

  // ==========================================
  // DOM Elements Selection
  // ==========================================
  const audio = document.getElementById("audio-player");
  const albumCover = document.getElementById("album-cover");
  const artworkDisk = document.getElementById("artwork-disk");
  const visualizer = document.getElementById("visualizer");
  const liveBadge = document.getElementById("live-badge");
  
  const trackTitle = document.getElementById("track-title");
  const trackArtist = document.getElementById("track-artist");
  
  const currentTimeEl = document.getElementById("current-time");
  const totalDurationEl = document.getElementById("total-duration");
  const progressWrapper = document.getElementById("progress-wrapper");
  const progressFill = document.getElementById("progress-fill");
  const progressThumb = document.getElementById("progress-thumb");
  
  const btnPlay = document.getElementById("btn-play");
  const iconPlay = btnPlay.querySelector(".icon-play");
  const iconPause = btnPlay.querySelector(".icon-pause");
  
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const btnShuffle = document.getElementById("btn-shuffle");
  const btnRepeat = document.getElementById("btn-repeat");
  
  const btnMute = document.getElementById("btn-mute");
  const iconVolumeHigh = btnMute.querySelector(".icon-volume-high");
  const iconVolumeMute = btnMute.querySelector(".icon-volume-mute");
  const volumeSlider = document.getElementById("volume-slider");
  
  const playlistList = document.getElementById("playlist-list");
  const playlistCount = document.getElementById("playlist-count");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");

  // ==========================================
  // State Variables
  // ==========================================
  let currentTrackIndex = 0;
  let isPlaying = false;
  let isShuffleIndex = false;
  let isRepeatIndex = false;
  let lastVolume = 0.8;
  let toastTimeout = null;

  // ==========================================
  // Core Functions
  // ==========================================

  // Initialize UI & Playlist
  function init() {
    renderPlaylist();
    loadTrack(currentTrackIndex);
    audio.volume = volumeSlider.value;
  }

  // Load selected track details into UI & Audio API
  function loadTrack(index) {
    currentTrackIndex = index;
    const track = songs[currentTrackIndex];

    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    albumCover.src = track.cover;
    audio.src = track.src;

    updatePlaylistHighlight();
  }

  // Toggle Play / Pause state
  function togglePlay() {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack();
    }
  }

  function playTrack() {
    isPlaying = true;
    audio.play().catch(err => {
      console.log("Playback interrupted or file not found:", err);
      showToast("Ensure MP3 file exists in assets/songs/");
    });
    
    // UI Updates
    iconPlay.style.display = "none";
    iconPause.style.display = "block";
    artworkDisk.classList.add("playing");
    visualizer.classList.add("active");
    liveBadge.classList.add("active");
  }

  function pauseTrack() {
    isPlaying = false;
    audio.pause();

    // UI Updates
    iconPlay.style.display = "block";
    iconPause.style.display = "none";
    artworkDisk.classList.remove("playing");
    visualizer.classList.remove("active");
    liveBadge.classList.remove("active");
  }

  // Navigation Logic
  function nextTrack() {
    if (isShuffleIndex) {
      currentTrackIndex = getRandomTrackIndex();
    } else {
      currentTrackIndex = (currentTrackIndex + 1) % songs.length;
    }
    loadTrack(currentTrackIndex);
    playTrack();
    showToast(`Playing: ${songs[currentTrackIndex].title}`);
  }

  function prevTrack() {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    if (isShuffleIndex) {
      currentTrackIndex = getRandomTrackIndex();
    } else {
      currentTrackIndex = (currentTrackIndex - 1 + songs.length) % songs.length;
    }
    loadTrack(currentTrackIndex);
    playTrack();
    showToast(`Playing: ${songs[currentTrackIndex].title}`);
  }

  function getRandomTrackIndex() {
    if (songs.length <= 1) return 0;
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * songs.length);
    } while (newIndex === currentTrackIndex);
    return newIndex;
  }

  // Time Formatter (Seconds -> MM:SS)
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // Update Progress Bar
  function updateProgress() {
    const { duration, currentTime } = audio;
    if (duration) {
      const progressPercent = (currentTime / duration) * 100;
      progressFill.style.width = `${progressPercent}%`;
      progressThumb.style.left = `${progressPercent}%`;
      currentTimeEl.textContent = formatTime(currentTime);
      totalDurationEl.textContent = formatTime(duration);
    }
  }

  // Seek Functionality
  function setProgress(e) {
    const width = progressWrapper.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    if (duration) {
      audio.currentTime = (clickX / width) * duration;
    }
  }

  // Volume Control
  function handleVolumeChange(e) {
    const val = parseFloat(e.target.value);
    audio.volume = val;
    updateVolumeIcon(val);
  }

  function toggleMute() {
    if (audio.volume > 0) {
      lastVolume = audio.volume;
      audio.volume = 0;
      volumeSlider.value = 0;
      updateVolumeIcon(0);
      showToast("Muted");
    } else {
      audio.volume = lastVolume;
      volumeSlider.value = lastVolume;
      updateVolumeIcon(lastVolume);
      showToast("Unmuted");
    }
  }

  function updateVolumeIcon(vol) {
    if (vol === 0) {
      iconVolumeHigh.style.display = "none";
      iconVolumeMute.style.display = "block";
    } else {
      iconVolumeHigh.style.display = "block";
      iconVolumeMute.style.display = "none";
    }
  }

  // Render Playlist View dynamically
  function renderPlaylist() {
    playlistList.innerHTML = "";
    playlistCount.textContent = `${songs.length} Songs`;

    songs.forEach((song, index) => {
      const li = document.createElement("li");
      li.className = `playlist-item ${index === currentTrackIndex ? "active" : ""}`;
      li.dataset.index = index;

      li.innerHTML = `
        <div class="item-left">
          <img class="item-thumb" src="${song.cover}" alt="${song.title}" />
          <div class="item-details">
            <span class="item-title">${song.title}</span>
            <span class="item-artist">${song.artist}</span>
          </div>
        </div>
        <span class="item-duration">${song.duration}</span>
      `;

      li.addEventListener("click", () => {
        loadTrack(index);
        playTrack();
        showToast(`Playing: ${song.title}`);
      });

      playlistList.appendChild(li);
    });
  }

  function updatePlaylistHighlight() {
    const items = playlistList.querySelectorAll(".playlist-item");
    items.forEach((item, idx) => {
      if (idx === currentTrackIndex) {
        item.classList.add("active");
        item.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        item.classList.remove("active");
      }
    });
  }

  // Toast System
  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add("show");

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  // ==========================================
  // Event Listeners
  // ==========================================

  // Audio API Events
  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("ended", () => {
    if (isRepeatIndex) {
      audio.currentTime = 0;
      playTrack();
    } else {
      nextTrack();
    }
  });

  // Buttons
  btnPlay.addEventListener("click", togglePlay);
  btnNext.addEventListener("click", nextTrack);
  btnPrev.addEventListener("click", prevTrack);

  btnShuffle.addEventListener("click", () => {
    isShuffleIndex = !isShuffleIndex;
    btnShuffle.classList.toggle("active", isShuffleIndex);
    showToast(`Shuffle ${isShuffleIndex ? "ON" : "OFF"}`);
  });

  btnRepeat.addEventListener("click", () => {
    isRepeatIndex = !isRepeatIndex;
    btnRepeat.classList.toggle("active", isRepeatIndex);
    showToast(`Repeat ${isRepeatIndex ? "ON" : "OFF"}`);
  });

  progressWrapper.addEventListener("click", setProgress);
  volumeSlider.addEventListener("input", handleVolumeChange);
  btnMute.addEventListener("click", toggleMute);

  // Keyboard Shortcuts Accessibility
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return;

    switch (e.code) {
      case "Space":
        e.preventDefault();
        togglePlay();
        break;
      case "ArrowRight":
        e.preventDefault();
        nextTrack();
        break;
      case "ArrowLeft":
        e.preventDefault();
        prevTrack();
        break;
      case "ArrowUp":
        e.preventDefault();
        volumeSlider.value = Math.min(1, parseFloat(volumeSlider.value) + 0.05);
        audio.volume = volumeSlider.value;
        updateVolumeIcon(audio.volume);
        break;
      case "ArrowDown":
        e.preventDefault();
        volumeSlider.value = Math.max(0, parseFloat(volumeSlider.value) - 0.05);
        audio.volume = volumeSlider.value;
        updateVolumeIcon(audio.volume);
        break;
      case "KeyM":
        toggleMute();
        break;
      case "KeyS":
        btnShuffle.click();
        break;
      case "KeyR":
        btnRepeat.click();
        break;
    }
  });

  // Execute App
  init();
});