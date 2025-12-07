import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(delimiter != null && delimiter.length === 1, "delimiter must be a single character");
        this.delimiter = delimiter;
    }

    public clone(): Name {
        const comps: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            comps.push(this.getComponent(i));
        }
        class SimpleName extends AbstractName {
            private arr: string[];
            constructor(src: string[], delim: string) {
                super(delim);
                this.arr = src.slice();
            }
            getNoComponents(): number { return this.arr.length; }
            getComponent(i: number): string { return this.arr[i]; }
            setComponent(i: number, c: string): void { this.arr[i] = c; }
            insert(i: number, c: string): void { this.arr.splice(i, 0, c); }
            append(c: string): void { this.arr.push(c); }
            remove(i: number): void { this.arr.splice(i, 1); }
        }
        return new SimpleName(comps, this.getDelimiterCharacter());
    }

    public asString(delimiter: string = this.delimiter): string {
        InvalidStateException.assert(delimiter != null && delimiter.length === 1, "delimiter must be a single character");
        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            parts.push(this.getComponent(i));
        }
        return parts.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const delim = this.getDelimiterCharacter();
        InvalidStateException.assert(delim != null && delim.length === 1, "invalid delimiter");
        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const comp = this.getComponent(i);
            let s = "";
            for (let ch of comp) {
                if (ch === ESCAPE_CHARACTER) {
                    s += ESCAPE_CHARACTER + ESCAPE_CHARACTER;
                } else if (ch === delim) {
                    s += ESCAPE_CHARACTER + delim;
                } else {
                    s += ch;
                }
            }
            parts.push(s);
        }
        return parts.join(this.getDelimiterCharacter());

    }

    public isEqual(other: Name): boolean {
        if (other == null) return false;
        if (this.getNoComponents() !== other.getNoComponents()) return false;
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) return false;
        }
        return this.getDelimiterCharacter() === other.getDelimiterCharacter();
    }

    public getHashCode(): number {
        const s = this.asDataString();
        let hash = 5381;
        for (let i = 0; i < s.length; i++) {
            hash = ((hash << 5) + hash) + s.charCodeAt(i);
            hash = hash | 0;
        }
        return Math.abs(hash);
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        IllegalArgumentException.assert(other != null, "other must not be null");
        // require same delimiter to avoid ambiguity
        IllegalArgumentException.assert(this.getDelimiterCharacter() === other.getDelimiterCharacter(), "cannot concat names with different delimiters");
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}