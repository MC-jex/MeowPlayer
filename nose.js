let currentTrackIndex = 0;
let playlistArray = [];
let isShuffle = false;

const fileInput = document.getElementById('fileInput');
const playlist = document.getElementById('playlist');
const audioPlayer = document.getElementById('audioPlayer');
const shuffleToggle = document.getElementById('shuffleToggle');

// Toggle shuffle mode
shuffleToggle.addEventListener('change', () => {
    isShuffle = shuffleToggle.checked;
});

// Clear the playlist
function clearPlaylist() {
    playlist.innerHTML = '';
    playlistArray = [];
    audioPlayer.src = '';
}

// Add files to playlist
fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = file.name;
        listItem.classList.add('playlist-item');
        listItem.addEventListener('click', () => {
            playFile(file, playlistArray.indexOf(file));
        });
        playlistArray.push(file);
        playlist.appendChild(listItem);
    });
});

// Play selected file
function playFile(file, index) {
    stopCurrentPlayback();

    // Remove 'active' class from any previous track
    const allItems = document.querySelectorAll('.playlist-item');
    allItems.forEach(item => item.classList.remove('active'));

    currentTrackIndex = index;

    // Add 'active' class to the current playing track
    const currentItem = document.querySelectorAll('.playlist-item')[currentTrackIndex];
    currentItem.classList.add('active');

    const fileUrl = URL.createObjectURL(file);
    audioPlayer.src = fileUrl;
    audioPlayer.play().catch(error => {
        console.error("Error playing file:", error);
        alert("Cannot play this file.");
    });

    // When the track ends
    audioPlayer.onended = () => {
        playNextTrack();
    };
}

// Play next track (random or sequential)
function playNextTrack() {
    if (isShuffle) {
        currentTrackIndex = Math.floor(Math.random() * playlistArray.length);
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % playlistArray.length;
    }

    if (currentTrackIndex === 0 && isShuffle) {
        // Reset the playlist to 0 after completing the shuffle cycle
        currentTrackIndex = 0;
    }

    playFile(playlistArray[currentTrackIndex], currentTrackIndex);
}

// Stop current playback
function stopCurrentPlayback() {
    audioPlayer.pause();
    audioPlayer.src = '';
}

// Listen for beforeunload event to pause the song when the user leaves
window.addEventListener('beforeunload', () => {
    stopCurrentPlayback();
});
