import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (delimiter == null || delimiter.length !==1){
            throw new Error("Delimiter must be a single character");
        }
        this.delimiter = delimiter;
    }

    protected escapeForData(comp: string): string {
        if (comp == null || comp.length === 0) return "";
        let escaped = comp.split(ESCAPE_CHARACTER)
                          .join(ESCAPE_CHARACTER + ESCAPE_CHARACTER);
        escaped = escaped.split(DEFAULT_DELIMITER)
                         .join(ESCAPE_CHARACTER + DEFAULT_DELIMITER);
        return escaped;
    }

    protected unescapeFromData(comp: string): string {
        let res = "";
        for (let i = 0; i < comp.length; i++) {
            const ch = comp.charAt(i);
            if (ch === ESCAPE_CHARACTER && i + 1 < comp.length) {
                // Skip escape char, append next char literally
                i++;
                res += comp.charAt(i);
            } else {
                res += ch;
            }
        }
        return res;
    }

    public asString(delimiter: string): string {
        if (!delimiter || delimiter.length !== 1) {
            delimiter = this.delimiter;
        }
        if (this.getNoComponents() === 0) return "";
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
        const n = this.getNoComponents();
        if (n === 0) return ""; // Option A
        const parts: string[] = [];
        for (let i = 0; i < n; i++) {
            parts.push(this.escapeForData(this.getComponent(i)));
        }
        return parts.join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        if (other == null) return false;
        return this.asDataString() === other.asDataString();
    }

    public getHashCode(): number {
        const s: string = this.asDataString();
        let hashCode: number = 0;
        for (let i: number = 0; i < s.length; i++) {
            let c: number = s.charCodeAt(i);
            hashCode = ((hashCode << 5) - hashCode) + c;
            hashCode = hashCode & hashCode;
        }
        return hashCode;
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
    abstract clone(): Name;

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}