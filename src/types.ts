import type { Dictionary } from "lodash";

export type { Dictionary } from "lodash";

export type Model = string;
export type Field = string | string[] | Dictionary<string[]>;
export type Filter = Dictionary<string | string[]>;
export type Include = string | string[];
export type Page = number;
export type Limit = number;
export type Sort = string[];

