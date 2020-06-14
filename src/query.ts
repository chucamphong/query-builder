import { isArray, isEmpty, isInteger, isPlainObject, isString, pickBy, set, isUndefined } from "lodash";
import Builder from "./builder";
import { Field, Filter, Include, Limit, Model, Page, Sort } from "./types";
import throwIf from "./util/throwIf";

class Query {
    #model: Model = "";
    #fields?: Field;
    #filters: Filter = {};
    #with?: Include;
    #page?: Page;
    #limit?: Limit;
    #sorts?: Sort;

    public for(model: string): Query {
        throwIf(isEmpty(model), "Tham số hàm for() không được bỏ trống.");

        this.#model = model;

        return this;
    }

    public include(models: Include): Query {
        throwIf(isEmpty(pickBy(models)), "Tham số hàm include() không được bỏ trống.");

        throwIf(
            !isString(models) && !isArray(models),
            new TypeError("Tham số hàm include() chỉ nhận kiểu string hoặc string[].")
        );

        this.#with = models;

        return this;
    }

    public select(fields: Field): Query {
        throwIf(isEmpty(pickBy<Field>(fields)), "Tham số hàm select() không được bỏ trống.");

        throwIf(
            !isString(fields) && !isArray(fields) && !isPlainObject(fields),
            new TypeError("Tham số hàm select() chỉ nhận string, string[] hoặc object.")
        );

        this.#fields = fields;

        return this;
    }

    public where(column: string, values: string | string[]): Query {
        throwIf(isEmpty(column), "Tham số column của hàm where() không được bỏ trống.");

        throwIf(!isString(column), new TypeError("Tham số column của hàm where() chỉ nhận kiểu string."));

        throwIf(
            !isString(values) && !isArray(values),
            new TypeError("Tham số values của hàm where() chỉ nhận kiểu string, string[] hoặc undefined.")
        );

        this.#filters[column] = values;

        return this;
    }

    public page(value: Page): Query {
        throwIf(
            !isInteger(value) || value <= 0,
            new TypeError("Tham số hàm page() chỉ nhận số nguyên dương.")
        );

        this.#page = value;

        return this;
    }

    public limit(value: Limit): Query {
        throwIf(
            !isInteger(value) || value <= 0,
            new TypeError("Tham số hàm limit() chỉ nhận số nguyên dương.")
        );

        this.#limit = value;

        return this;
    }

    public sort(...args: string[]): Query {
        this.#sorts = args;

        return this;
    }

    public toString() {
        return this.url();
    }

    public url(): string {
        return new Builder({
            model: this.#model,
            fields: this.#fields,
            filters: this.#filters,
            includes: this.#with,
            page: this.#page,
            limit: this.#limit,
            sorts: this.#sorts,
        }).parse();
    }
}

export default Query;
