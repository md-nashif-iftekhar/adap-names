import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;
    protected components: string[] = [];
    constructor(source: string, delimiter?: string) {
    super(delimiter === undefined ? DEFAULT_DELIMITER : delimiter);
        IllegalArgumentException.assert(source != null, "source must not be null");
        this.parseDataString(source);
    }

    private parseDataString(s: string): void {
        const delim = this.getDelimiterCharacter();
        const comps: string[] = [];
        let cur = "";
        let escaping = false;
        for (let i = 0; i < s.length; i++) {
            const ch = s.charAt(i);
            if (escaping) {
                cur += ch;
                escaping = false;
            } else {
                if (ch === ESCAPE_CHARACTER) {
                    escaping = true;
                } else if (ch === delim) {
                    comps.push(cur);
                    cur = "";
                } else {
                    cur += ch;
                }
            }
        }

        comps.push(cur);
        this.components = comps;
        this.noComponents = comps.length;
        this.name = this.asDataString();
    }

    private escapeComponent(ch: string): string {
        const del = this.getDelimiterCharacter();
        let outer = "";
        for (let c of ch) {
            if (c === ESCAPE_CHARACTER) {
                outer += ESCAPE_CHARACTER + ESCAPE_CHARACTER;
            } else if (c === del) {
                outer += ESCAPE_CHARACTER + del;
            } else {
                outer += c;
            }
        }
        return outer;
    }

    public clone(): Name {
        return new StringName(this.asDataString(), this.getDelimiterCharacter());
    }

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(delimiter != null && delimiter.length === 1, "delimiter must be a single character");
        return this.components.join(delimiter);    }

    public asDataString(): string {
        const escaped = this.components.map(c => this.escapeComponent(c));
        return escaped.join(this.getDelimiterCharacter());
    }

    public isEqual(other: Name): boolean {
        return super.isEqual(other);
    }

    public getHashCode(): number {
        return super.getHashCode();
    }

    public isEmpty(): boolean {
        return this.components.length === 0 || (this.components.length === 1 && this.components[0] === "");
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "index out of bounds");
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "index out of bounds");
        IllegalArgumentException.assert(c != null, "component must not be null");
        this.components[i] = c;
        this.noComponents = this.components.length;
        this.name = this.asDataString();
    }

    public insert(i: number, c: string) {
                IllegalArgumentException.assert(i >= 0 && i <= this.components.length, "index out of bounds");
        IllegalArgumentException.assert(c != null, "component must not be null");
        this.components.splice(i, 0, c);
        this.noComponents = this.components.length;
        this.name = this.asDataString();
    }

    public append(c: string) {
        IllegalArgumentException.assert(c != null, "component must not be null");
        this.components.push(c);
        this.noComponents = this.components.length;
        this.name = this.asDataString();
    }

    public remove(i: number) {
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "index out of bounds");
        this.components.splice(i, 1);
        this.noComponents = this.components.length;
        this.name = this.asDataString();
    }

    public concat(other: Name): void {
        super.concat(other);
        const added: string[] = [];
        for (let i = 0; i < other.getNoComponents(); i++) {
            added.push(other.getComponent(i));
        }
        this.components = this.components.concat(added);
        this.noComponents = this.components.length;
        this.name = this.asDataString();
    }

}