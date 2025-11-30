import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;
    protected components: string[] = [];

    constructor(source: string, delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);
        // null/undefined source
        if (source == null) source = "";
        // Empty string -> zero components (Option A).
        if (source.length === 0) {
            this.components = [];
            return;
        }
        this.name = source;
        const components = this.parseDataString(this.name, this.delimiter);
        this.noComponents = components.length;
    }

    protected parseDataString(source: string, delimiter: string): string[] {
        if (source.length === 0) return [];
        const comps: string[] = [];
        let buf: string = "";
        for (let i = 0; i < source.length; i++) {
            const ch = source.charAt(i);
            if (ch === ESCAPE_CHARACTER && i + 1 < source.length) {
                // take next char literally
                i++;
                buf += source.charAt(i);
            } else if (ch === delimiter) {
                comps.push(buf);
                buf = "";
            } else {
                buf += ch;
            }
        }
        comps.push(buf);
        return comps;
    }

    public clone(): Name {
        return new StringName(this.asDataString(), this.getDelimiterCharacter());
    }

    public asString(delimiter: string = this.delimiter): string {
        if (delimiter == null || delimiter.length !== 1) {
            throw new Error("Delimiter must be a single character");
    }
    return this.components.join(delimiter);
    }

    public asDataString(): string {
        return this.components.map(c => {
            let escaped = c.split(ESCAPE_CHARACTER)
            .join(ESCAPE_CHARACTER + ESCAPE_CHARACTER);
            escaped = escaped.split(DEFAULT_DELIMITER)
            .join(ESCAPE_CHARACTER + DEFAULT_DELIMITER);
            return escaped;
        })
        .join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        if (other == null) return false;
        return this.asDataString() === other.asDataString();
    }

    public getHashCode(): number {
        const s = this.asDataString();
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            const c = s.charCodeAt(i);
            hash = (hash << 5) - hash + c;
            hash |= 0;
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new Error("index out of bounds");
        }
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        if (i < 0 || i >= this.components.length) {
            throw new Error("index out of bounds");
        }
        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        if (i < 0 || i > this.components.length) {
            throw new Error("index out of bounds");
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
         this.components.push(c);
    }

    public remove(i: number) {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        if (other == null) {
            throw new Error("Other name is null");
        }
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}