export class Location {

    #name: string;
    #center: [number, number];
    #date: Date;
    #id: number;

    static date: Date = new Date();

    static counter: number = 0
		
    constructor(name: string = "No name", center: [number, number]){
        this.#name = name,
				this.#center = center,
        this.#date = Location.date,
        Location.counter++
        this.#id = Location.counter
    }

    get name() { return this.#name }
		get center() { return this.#center }
    get date() { return this.#date }
    get id() { return this.#id }

    toJSON() {
        return {
            name: this.name,
						center: this.center,
            date: this.date,
            id: this.id
        }
    }

}
