import { isString } from "lodash";

export default function throwIf(boolean: boolean, error: string | Error) {
    if (boolean) {
        if (isString(error)) {
            throw new Error(error);
        }

        throw error;
    }
}
