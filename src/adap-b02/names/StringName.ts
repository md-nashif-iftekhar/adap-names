import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;
    protected components: string[] = [];

    constructor(source: string, delimiter?: string) {
        if (delimiter) {
            this.delimiter = delimiter;
        }
        if (source) {
            this.name = source;
            this.parseComponents();
        }
    }

    private parseComponents(): void {
        this.components = [];
        let currentComponent = '';
        let escaping = false;
        
        for (let i = 0; i < this.name.length; i++) {
            const char = this.name[i];
            
            if (escaping) {
                currentComponent += char;
                escaping = false;
            } else if (char === ESCAPE_CHARACTER) {
                escaping = true;
            } else if (char === this.delimiter) {
                this.components.push(currentComponent);
                currentComponent = '';
            } else {
                currentComponent += char;
            }
        }
        
        if (currentComponent !== '' || this.name.endsWith(this.delimiter)) {
            this.components.push(currentComponent);
        }
        
        this.noComponents = this.components.length;
    }

    private escapeComponent(component: string): string {
        let result = '';
        for (let char of component) {
            if (char === this.delimiter || char === ESCAPE_CHARACTER) {
                result += ESCAPE_CHARACTER;
            }
            result += char;
        }
        return result;
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components.map(comp => comp).join(delimiter);
    }

    public asDataString(): string {
        const escapedComponents = this.components.map(comp => 
            this.escapeComponent(comp)
        );

        return escapedComponents.join(DEFAULT_DELIMITER);    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        if (x < 0 || x >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        return this.components[x];    }

    public setComponent(n: number, c: string): void {
        if (n < 0 || n >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        this.components[n] = c;
        this.updateNameString();
    }

    public insert(n: number, c: string): void {
        if (n < 0 || n > this.noComponents) {
            throw new Error("Index out of bounds");
        }

        this.components.splice(n, 0, c);
        this.noComponents = this.components.length;
        this.updateNameString();
    }

    public append(c: string): void {
        this.components.push(c);
        this.noComponents = this.components.length;
        this.updateNameString();    }

    public remove(n: number): void {
        if (n < 0 || n >= this.noComponents) {
            throw new Error("Index out of bounds");
        }

        this.components.splice(n, 1);
        this.noComponents = this.components.length;
        this.updateNameString();
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }

        this.noComponents = this.components.length;
        this.updateNameString();
    }

    private updateNameString(): void {
        this.name = this.asString(this.delimiter);
    }
}