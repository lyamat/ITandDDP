import { getPlaybackStatus } from "../api.js";

class PlayerStateTracker {
    constructor() {
        this.handlers = [];
        this.interval_ms = 500;
        this.lastState = {};

        setInterval(this.onEachInterval, this.interval_ms);
    }

    /**
     * 
     * @param {(lastState: PlayerbackState, currentState: PlayerbackState) => boolean} predicate 
     * @param {(lastState: PlayerbackState, currentState: PlayerbackState) => void} handler 
     */
    addStateChangeHandler(predicate, handler) {
        playerStateTracker.handlers.push({ predicate, handler });
    }

    async onEachInterval() {
        await getPlaybackStatus().then(
            raw_state => {
                let state = new PlayerbackState(raw_state);

                try {
                    for (const { predicate, handler } of playerStateTracker.handlers) {
                        if (predicate(playerStateTracker.lastState, state)) {
                            (async () => {
                                handler(playerStateTracker.lastState, state);
                            })();
                        }
                    }
                }
                finally {
                    playerStateTracker.lastState = state;
                }
            }
        );
    }

    extractStatus(state) {
        return PlayerbackState(state);
    }
}

class PlayerbackState {
    /**
     * 
     * @param {Object} state 
     */
    constructor(state) {
        if (!state) {
            throw Error('Empty state');
        }

        // console.log(state);

        this.is_playing = state.is_playing;
        this.shuffle_state = state.shuffle_state;
        this.repeat_state = state.repeat_state;
        this.progress_ms = state.progress_ms;
        this.track_id = state.item.id;
        this.duration_ms = state.item.duration_ms;
        this.volume_percent = state.device.volume_percent / 100;
        this.track_name = state.item.name;
        this.artist = state.item.artists.map(item => item.name).join(', ');
        this.track_image_url = state.item.album.images[2].url;
        this.is_album_context = state.context ? ['playlist', 'album'].includes(state.context.type)  : false;
        this.album_id = (state.context && state.context.type === 'playlist') ? (/\w+:\w+:([\w\d]+)/.exec(state.context.uri))[1] : state.item.album.id;
    }

    /**
     * 
     * @param {PlayerbackState} state 
     */
    equals(state) {
        for (const key in this) {
            if (this[key] !== state[key]) {
                return false;
            }
        }

        return true;
    }
}

export const playerStateTracker = new PlayerStateTracker(); 
