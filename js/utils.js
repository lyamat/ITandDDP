import { Track } from "./models/track.mjs";
import { Artist } from "./models/artist.mjs";
import { Image } from "./models/image.mjs";
import { Album } from "./models/album.mjs";

/**
 * 
 * @param {Element} e 
 * @param {String} className 
 */
export function changeClass(e, className) {
    if (e.classList.contains(className)) {
        e.classList.remove(className);
    } else {
        e.classList.add(className);
    }
}

export function TrackFromEntry(obj) {
    const id = obj.id;
    const name = obj.name;
    const duration_ms = obj.duration_ms;

    let artists = [];
    const artistsContainer = obj.artists;
    artistsContainer.forEach(item => {
        artists.push(ArtistFromEntry(item));
    });


    let images = [];
    if ('album' in obj) {
        const imagesContainer = obj.album.images;
        imagesContainer.forEach(item => {
            images.push(ImageFromEntry(item));
        });
    }

    return new Track(id, name, artists, duration_ms, images);
}

export function ImageFromEntry(obj) {
    const dimensions = [obj.width, obj.height];
    const url = obj.url;

    return new Image(dimensions, url);
}

export function ArtistFromEntry(obj) {
    const id = obj.id;
    const name = obj.name;

    return new Artist(id, name);
}

export function AlbumFromEntry(obj, withTracks = false) {
    const id = obj.id;
    const name = obj.name;
    const releaseDate = obj.release_date;

    let artists = [];
    obj.artists.forEach(item => {
        artists.push(ArtistFromEntry(item));
    });

    let images = [];
    obj.images.forEach(item => {
        images.push(ImageFromEntry(item));
    });

    let tracks = null;
    if (withTracks) {
        tracks = [];
        obj.tracks.items.forEach(item => {
            tracks.push(TrackFromEntry(item));
        });
    }

    return new Album(id, name, artists, releaseDate, images, tracks);
}

export function PlaylistFromEntry(obj, withTracks = false) {
    const id = obj.id;
    const name = obj.name;
    const releaseDate = new Date().getFullYear();

    let artists = [''];

    let images = [];
    obj.images.forEach(item => {
        images.push(ImageFromEntry(item));
    });

    let tracks = null;
    if (withTracks) {
        tracks = [];
        obj.tracks.items.forEach(item => {
            const track = item.track;
            tracks.push(TrackFromEntry(track));
        });
    }

    return new Album(id, name, artists, releaseDate, images, tracks);
}

export function clearQueryFromUrl() {
    window.history.pushState({}, document.title, window.location.pathname);
}

export function msToTrackDuration(duration_ms) {
    let seconds = Math.floor(duration_ms / 1000);
    let mins = Math.floor(seconds / 60);
    seconds = seconds % 60;

    return `${mins}:${String(seconds).padStart(2, 0)}`;
}