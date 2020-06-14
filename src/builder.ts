import { isArray, isEmpty, isPlainObject, isString, isUndefined } from "lodash";
import { Dictionary, Field, Filter, Include, Limit, Model, Page, Sort } from "./types";
import { compact, throwIf } from "./util";

type ParserParams = {
    model: Model;
    fields?: Field;
    filters?: Filter;
    includes?: Include;
    page?: Page;
    limit?: Limit;
    sorts?: Sort;
};

class Builder {
    #query: ParserParams;

    constructor(query: ParserParams) {
        throwIf(isEmpty(query), "Tham số hàm khởi tạo Builder không hợp lệ.");

        this.#query = query;
    }

    private model(): string {
        return this.#query.model;
    }

    private select(): string | undefined {
        const fields = this.#query.fields;

        if (isEmpty(fields)) {
            return undefined;
        }

        if (isString(fields) || isArray(fields)) {
            return `fields[${this.model()}]=${fields}`;
        }

        if (isPlainObject(fields)) {
            return compact(Object.keys(fields as Dictionary<string[]>).map(model => {
                const columns = compact((fields as Dictionary<string[]>)[model]);

                return columns.length ? `fields[${model}]=${columns}` : undefined;
            })).join("&");
        }

        return undefined;
    }

    private where(): string | undefined {
        const filters = this.#query.filters;

        if (isEmpty(filters)) {
            return undefined;
        }

        return compact(Object.keys(filters as Filter).map(column => {
            const values = (filters as Filter)[column];

            return values.length ? `filter[${column}]=${values}` : undefined;
        })).join("&");
    }

    private includes(): string | undefined {
        const includes = this.#query.includes;

        return isEmpty(includes) ? undefined : `include=${includes}`;
    }

    private page(): string | undefined {
        const page = this.#query.page;

        return isUndefined(page) ? undefined : `page[number]=${page}`;
    }

    private limit(): string | undefined {
        const limit = this.#query.limit;

        return isUndefined(limit) ? undefined : `page[size]=${limit}`;
    }

    private sorts(): string | undefined {
        const sorts = this.#query.sorts;

        return isEmpty(sorts) ? undefined : `sort=${sorts}`;
    }

    public parse(): string {
        const query = compact([
            this.includes(),
            this.select(),
            this.where(),
            this.page(),
            this.limit(),
            this.sorts(),
        ]).join("&");

        return compact([this.model(), query]).join("?");
    }
}

export default Builder;
