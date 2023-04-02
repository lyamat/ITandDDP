import { changeClass, msToTrackDuration } from '../utils.js';

import { playerStateTracker } from "../controllers/player_state_tracker.js";
import { getLastPlayedTrack, playNext, playPrevious, playTrack, pause, seekTo, setVolume, setShuffle, setRepeat } from '../api.js';

const root = document.querySelector(".player-container");
const progressInput = root.querySelector(`input.slider.progress[type="range"]`);
const volumeInput = root.querySelector(`input.slider.volume[type="range"]`);

const play = root.querySelector('.player__icon');
const prev = root.querySelector('.player__prev');
const next = root.querySelector('.player__next');
const shuffle = root.querySelector('.player__shuffle');
const repeat = root.querySelector('.player__repeat');

const song_title = root.querySelector('.song__title');
const song_performer = root.querySelector('.song__performer');
const song_image = root.querySelector('.player__cover');
const song_duration = root.querySelector('.audio__progress-time');

setButtonListeners();
setRangeListeners();
setProgressTracker();
setVolumeTracker();
setTrackTracker();
setLastPlayedTrack();

function setButtonListeners() {
    play.addEventListener('click', (e) => {
        let id = root.attributes['data-track_id'].value;

        if (play.classList.contains('activated')) {
            pause(id);
        }
        else {
            let duration_ms = Number(song_duration.attributes['data-ms'].value);

            let progress = Number(progressInput.value);
            let max = Number(progressInput.max);
            let min = Number(progressInput.min);

            let progress_ms = Math.floor((progress - min) / (max - min) * duration_ms);

            if (progress_ms === duration_ms) {
                progress_ms = 0;
            }

            playTrack(id, progress_ms);
        }
    });

    prev.addEventListener('click', (e) => {
        playPrevious();
    });

    next.addEventListener('click', (e) => {
        playNext();
    });

    shuffle.addEventListener('click', (e) => {
        const setState = !shuffle.classList.contains('activated');
        setShuffle(setState);

        changeClass(shuffle, 'activated');
    });

    repeat.addEventListener('click', (e) => {
        const setState = !repeat.classList.contains('activated');
        setRepeat(setState);

        changeClass(repeat, 'activated');
    });
}

function setRangeListeners() {
    const rangeInputs = [progressInput, volumeInput];
    
    const calcVal = (e)=>{
        let target = e.target;
        if (target.type !== 'range') {
            return;
        }

        const min = Number(target.min);
        const max = Number(target.max);
        const val = Number(target.value);

        return val / 100;
    };

    progressInput.addEventListener('input', e=> {
        const val = calcVal(e);
        const duration_ms = song_duration.attributes['data-ms'].value;
        seekTo(Math.floor(val * duration_ms));
    });

    volumeInput.addEventListener('input', e=>{
        const val = calcVal(e);
        setVolume(Math.floor(val * 100));
    });
}

function setRange(percentage, input) {
    percentage = Number(percentage);
    const min = Number(input.min);
    const max = Number(input.max);
    const val = (max - min) * percentage + min;

    input.value = val;
    input.style.backgroundSize = `${val}% 100%`;
}

function setProgressTracker() {
    playerStateTracker.addStateChangeHandler(
        (lastState, currentState) => {
            return (currentState.is_playing);
        },
        (lastState, currentState) => {
            setRange(currentState.progress_ms / currentState.duration_ms, progressInput);
        },
    );

    playerStateTracker.addStateChangeHandler(
        (lastState, currentState) => {
            return true;
        },
        (lastState, currentState) => {
            if (currentState.is_playing) {
                play.classList.add('activated');
            }
            else {
                play.classList.remove('activated');
            }
        },
    );
}

function setVolumeTracker() {
    playerStateTracker.addStateChangeHandler(
        (lastState, currentState) => {
            return currentState.is_playing;
        },
        (lastState, currentState) => {
            setRange(currentState.volume_percent, volumeInput);
        },
    );
}

function setTrackTracker() {
    playerStateTracker.addStateChangeHandler(
        (lastState, currentState) => {
            return lastState.track_name !== currentState.track_name ||
                lastState.artist !== currentState.artist ||
                lastState.track_id !== currentState.track_id;
        },
        (lastState, currentState) => {
            setTrackInfo(
                currentState.track_id,
                currentState.track_name,
                currentState.artist,
                currentState.track_image_url,
                currentState.duration_ms
            );
        },
    );
}

function setTrackInfo(track_id, track_name, artist, track_image_url, duration_ms) {
    song_title.innerHTML = track_name;
    song_performer.innerHTML = artist;
    song_image.attributes.src.value = track_image_url;
    song_duration.innerHTML = msToTrackDuration(duration_ms);

    song_duration.attributes['data-ms'].value = duration_ms;
    root.attributes['data-track_id'].value = track_id;
}

function setLastPlayedTrack() {
    getLastPlayedTrack().then(track => {
        setTrackInfo(
            track.id,
            track.name,
            track.artists.map(artist => artist.name).join(', '),
            track.images[2].url,
            track.duration_ms
        );
    });
}