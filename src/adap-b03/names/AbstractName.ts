import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (delimiter == null || delimiter == undefined || delimiter.length !== 1) {
            throw new RangeError("Delimiter must be a single character");
        }
        this.delimiter = delimiter;
    }

    public clone(): Name {
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        const { StringArrayName } = require("./StringArrayName");
        return new StringArrayName(components, this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        if (delimiter == null || delimiter == undefined || delimiter.length !== 1) {
            throw new RangeError("Delimiter must be a single character");
        }
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
        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            parts.push(AbstractName.escapeComponent(this.getComponent(i)));
        }
        return parts.join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        if (other == null || other == undefined) return false;
        if (this.getNoComponents() !== other.getNoComponents()) return false;
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) return false;
        }
        return true;
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i: number = 0; i < s.length; i++) {
            let c: number = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    protected static escapeComponent(component: string): string {
        if (component == null) return "";
        let s = component.split(ESCAPE_CHARACTER).join(ESCAPE_CHARACTER + ESCAPE_CHARACTER);
        // then escape the data delimiter
        if (DEFAULT_DELIMITER !== ESCAPE_CHARACTER) {
            s = s.split(DEFAULT_DELIMITER).join(ESCAPE_CHARACTER + DEFAULT_DELIMITER);
        }
        return s;
    }

    protected static unescapeComponent(component: string): string {
        if (component == null) return "";
        let result = "";
        for (let i = 0; i < component.length; i++) {
            const cha = component.charAt(i);
            if (cha === ESCAPE_CHARACTER) {
                // if escape 
                i++;
                if (i < component.length) {
                    result += component.charAt(i);
                } else {
                    result += ESCAPE_CHARACTER;
                }
            } else {
                result += cha;
            }
        }
        return result;
    }

    protected static parseDataString(k: string): string[] {
        const components: string[] = [];
        if (k === "" || k == null) {
        }
        let cur = "";
        for (let i = 0; i < k.length; i++) {
            const ch = k.charAt(i);
            if (ch === ESCAPE_CHARACTER) {
                i++;
                if (i < k.length) {
                    cur += k.charAt(i);
                } else {
                    cur += ESCAPE_CHARACTER;
                }
            } else if (ch === DEFAULT_DELIMITER) {
                components.push(cur);
                cur = "";
            } else {
                cur += ch;
            }
        }
        if (k.length === 0) {
            return [];
        }
        components.push(cur);
        for (let i = 0; i < components.length; i++) {
            components[i] = AbstractName.unescapeComponent(components[i]);
        }
        return components;
    }
    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        if (other == null || other == undefined) {
            throw new RangeError("other is null or undefined");
        }
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }   
}