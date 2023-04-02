export class Track {
    /**
     * 
     * @param {number} id 
     * @param {string} name 
     * @param {Artist[]} artists 
     * @param {number} duration_ms 
     * @param {Image[]} images 
     */
    constructor (id, name, artists, duration_ms, images) {
        this.id = id;
        this.name = name;
        this.artists = artists;
        this.duration_ms = duration_ms;
        this.images = images;
    }
}