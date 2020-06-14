import type { Dictionary } from "lodash";
export type { Dictionary } from "lodash";
export declare type Model = string;
export declare type Field = string | string[] | Dictionary<string[]>;
export declare type Filter = Dictionary<string | string[]>;
export declare type Include = string | string[];
export declare type Page = number;
export declare type Limit = number;
export declare type Sort = string[];
