import { Name } from "./Name";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName implements Name {

    private readonly components: readonly string[];
    private readonly delimiter: string;

    constructor(components: string[], delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(components.length > 0, "name must have components");
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be one character");

        this.components = [...components]; // defensive copy
        this.delimiter = delimiter;
    }

    public getComponents(): readonly string[] {
        return this.components;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(delimiter.length === 1);
        return this.components.join(delimiter);
    }

    public asDataString(): string {
        return this.components
            .map(c => c.replace(this.delimiter, ESCAPE_CHARACTER + this.delimiter))
            .join(this.delimiter);
    }

    public clone(): Name {
        return new StringArrayName([...this.components], this.delimiter);
    }

    public isEqual(other: Object): boolean {
        if (!(other instanceof StringArrayName)) return false;

        if (this.delimiter !== other.delimiter) return false;
        if (this.components.length !== other.components.length) return false;

        return this.components.every((v, i) => v === other.components[i]);
    }

    public getHashCode(): number {
        let hash = 17;
        hash = hash * 31 + this.delimiter.charCodeAt(0);

        for (const c of this.components) {
            for (let i = 0; i < c.length; i++) {
                hash = hash * 31 + c.charCodeAt(i);
            }
        }
        return hash | 0;
    }

}