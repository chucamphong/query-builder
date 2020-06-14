import { Field, Include, Limit, Page } from "./types";
declare class Query {
    #private;
    for(model: string): Query;
    include(models: Include): Query;
    select(fields: Field): Query;
    where(column: string, values: string | string[]): Query;
    page(value: Page): Query;
    limit(value: Limit): Query;
    sort(...args: string[]): Query;
    toString(): string;
    url(): string;
}
export default Query;
