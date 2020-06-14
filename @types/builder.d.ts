import { Field, Filter, Include, Limit, Model, Page, Sort } from "./types";
declare type ParserParams = {
    model: Model;
    fields?: Field;
    filters?: Filter;
    includes?: Include;
    page?: Page;
    limit?: Limit;
    sorts?: Sort;
};
declare class Builder {
    #private;
    constructor(query: ParserParams);
    private model;
    private select;
    private where;
    private includes;
    private page;
    private limit;
    private sorts;
    parse(): string;
}
export default Builder;
