import { Artist } from "./artist.mjs";
import { Image } from "./image.mjs";
import { Track } from "./track.mjs";

export class Album {
    /**
     * 
     * @param {number} id 
     * @param {string} name 
     * @param {Artist[]} artists 
     * @param {string} releaseDate 
     * @param {Image[]} images 
     * @param {Track[]} tracks
     */
    constructor (id, name, artists, releaseDate, images, tracks=null) {
        this.id = id;
        this.name = name;
        this.artists = artists;
        this.releaseDate = releaseDate;
        this.images = images;
        this.tracks = tracks;
    }
}