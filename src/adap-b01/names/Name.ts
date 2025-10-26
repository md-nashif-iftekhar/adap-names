export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    constructor(other: string[], delimiter?: string) {
        for (let i = 0; i < other.length; i++) {
            this.components[i] = other[i];
        }
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
        let result = "";
        for (let i = 0; i < this.components.length; i++) {
            result += this.components[i];
            if (i < this.components.length - 1) {
                result += delimiter;
            }
        }
        return result;
    }

    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    public asDataString(): string {
        let result = "";
        for (let i = 0; i < this.components.length; i++) {
            const comp = this.components[i];
            let escapedComponenet = "";

            for (let j = 0; j < comp.length; j++) {
                const ch = comp[j];
                if (ch === ESCAPE_CHARACTER || ch === this.delimiter) {
                    escapedComponenet += ESCAPE_CHARACTER;
                }
                escapedComponenet += ch;
            }

            result += escapedComponenet;

            // Adding btwn components
            if (i < this.components.length - 1) {
                result += this.delimiter;
            }
        }
        return result;
    }

    /** Returns properly masked component string */
    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length)
            throw new RangeError("Index out of range");

        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.components.length)
            throw new RangeError("Index out of range");
        this.components[i] = c;
    }

     /** Returns number of components in Name instance */
     public getNoComponents(): number {
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    public insert(i: number, c: string): void {
        for (let j = this.components.length; j > i; j--) {
            this.components[j] = this.components[j - 1];
        }

        this.components[i] = c;
    }

    /** Expects that new Name component c is properly masked */
    public append(c: string): void {
        this.components[this.components.length] = c;
    }

    public remove(i: number): void {
        for (let j = i; j < this.components.length - 1; j++) {
            this.components[j] = this.components[j + 1];
        }

        this.components.length = this.components.length - 1;
    }

}
