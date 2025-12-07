/**
 * Root class for exceptions in ADAP examples
 */
export abstract class Exception extends Error {

    protected trigger: Exception | null = null;

    constructor(m: string, t?: Exception) {
        super(m);

        if (t != undefined) {
            this.trigger = t;
        }
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public hasTrigger(): boolean {
        return this.trigger != null;
    }

    public getTrigger(): Exception {
        // @todo check if trigger is null
        if (this.trigger == null) {
            throw new Error("exception has no trigger (InvalidStateException)");
        }
        return this.trigger;
    }

}