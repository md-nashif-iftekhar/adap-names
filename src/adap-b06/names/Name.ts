import { Cloneable } from "../common/Cloneable";
import { Equality } from "../common/Equality";
import { Printable } from "../common/Printable";

export interface Name extends Cloneable, Equality, Printable {
    getComponents(): readonly string[];

}
