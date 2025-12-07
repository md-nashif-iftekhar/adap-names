import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter === undefined ? DEFAULT_DELIMITER : delimiter);
        IllegalArgumentException.assert(source != null, "source must not be null");
        this.components = source.slice();
    }

    public clone(): Name {
        return new StringArrayName(this.components.slice(), this.getDelimiterCharacter());
    }

    public asString(delimiter: string = this.delimiter): string {
        return super.asString(delimiter);
    }

    public asDataString(): string {
        return super.asDataString();
    }

    public isEqual(other: Name): boolean {
        return super.isEqual(other);
    }

    public getHashCode(): number {
        return super.getHashCode();
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
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "index out of bounds");
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "index out of bounds");
        IllegalArgumentException.assert(c != null, "component must not be null");
        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(i >= 0 && i <= this.components.length, "index out of bounds");
        IllegalArgumentException.assert(c != null, "component must not be null");
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        IllegalArgumentException.assert(c != null, "component must not be null");
        this.components.push(c);
    }

    public remove(i: number) {
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "index out of bounds");
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        super.concat(other);
    }
}