import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super();
        if (source == null) source = "";
        this.name = source;
        const components = AbstractName["parseDataString"](this.name);
        this.noComponents = components.length;
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        const components = AbstractName["parseDataString"](this.name);
        return components.join(delimiter);
    }

    public asDataString(): string {
        const components = AbstractName["parseDataString"](this.name);
        const escaped = components.map(c => AbstractName["escapeComponent"](c));
        return escaped.join(DEFAULT_DELIMITER);
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
            hashCode = ((hashCode << 5) - hashCode) + c;
            hashCode = hashCode & hashCode;
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        const components = AbstractName["parseDataString"](this.name);
        return components.length;
    }

    public getComponent(i: number): string {
        const components = AbstractName["parseDataString"](this.name);
        if (i < 0 || i >= components.length) {
            throw new RangeError("Component index out of bounds");
        }
        return components[i];
    }

    public setComponent(i: number, c: string) {
        const components = AbstractName["parseDataString"](this.name);
        if (i < 0 || i >= components.length) {
            throw new RangeError("index out of bounds");
        }
        components[i] = c;
        this.name = components.map(comp => AbstractName["escapeComponent"](comp)).join(DEFAULT_DELIMITER);
        this.noComponents = components.length;
    }

    public insert(i: number, c: string) {
        const components = AbstractName["parseDataString"](this.name);
        if (i < 0 || i > components.length) {
            throw new RangeError("index out of bounds");
        }
        components.splice(i, 0, c);
        this.name = components.map(comp => AbstractName["escapeComponent"](comp)).join(DEFAULT_DELIMITER);
        this.noComponents = components.length;
    }

    public append(c: string) {
        const components = AbstractName["parseDataString"](this.name);
        components.push(c);
        this.name = components.map(comp => AbstractName["escapeComponent"](comp)).join(DEFAULT_DELIMITER);
        this.noComponents = components.length;
    }

    public remove(i: number) {
        const components = AbstractName["parseDataString"](this.name);
        if (i < 0 || i >= components.length) {
            throw new RangeError("index out of bounds");
        }
        components.splice(i, 1);
        this.name = components.map(comp => AbstractName["escapeComponent"](comp)).join(DEFAULT_DELIMITER);
        this.noComponents = components.length;
    }

    public concat(other: Name): void {
        const components = AbstractName["parseDataString"](this.name);
        for (let i = 0; i < other.getNoComponents(); i++) {
            components.push(other.getComponent(i));
        }
        this.name = components.map(comp => AbstractName["escapeComponent"](comp)).join(DEFAULT_DELIMITER);
        this.noComponents = components.length;
    }
}