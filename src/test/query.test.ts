import Query from "../query";

describe("Kiểm tra class QueryBuilder", () => {
    let query: Query;
    let url: string;

    beforeEach(() => {
        query = new Query();
    });

    test("Kiểm tra toàn diện", () => {
        url = query.for("users")
            .include("roles")
            .select({
                users: ["id", "name"],
                roles: ["id"]
            })
            .where("name", "Phong")
            .where("email", "Phong")
            .page(1)
            .limit(10)
            .url();
        expect(url).toEqual("users?include=roles&fields[users]=id,name&fields[roles]=id&filter[name]=Phong&filter[email]=Phong&page[number]=1&page[size]=10");
    });

    describe("Hàm for", () => {
        test("Kiểm tra hàm for", () => {
            url = query.for("users").url();
            expect(url).toEqual("users");
        });

        test("Kiểm tra exception của hàm for", () => {
            expect(() => {
                query.for("").url();
            }).toThrow("Tham số hàm for() không được bỏ trống.");
        });
    });

    describe("Hàm select", () => {
        test.each([
            ["id", "users?fields[users]=id"],
            [["id", "name"], "users?fields[users]=id,name"],
            [{
                users: ["id", "name"],
                roles: ["id"]
            }, "users?fields[users]=id,name&fields[roles]=id"],
            [{
                users: [""],
                roles: ["", "name"]
            }, "users?fields[roles]=name"]
        ])("Kiểm tra hàm select", (fields, expected) => {
            url = query.for("users").select(fields).url();
            expect(url).toEqual(expected);
        });

        test.each([
            [""],
            [[""]],
            [{}]
        ])("Kiểm tra exception của hàm select", (fields) => {
            expect(() => {
                query.for("users").select(fields).url();
            }).toThrow("Tham số hàm select() không được bỏ trống.");
        });
    });

    describe("Hàm where", () => {
        test.each([
            ["name", ["Chu Phong", "Hoàng"], "users?filter[name]=Chu Phong,Hoàng"],
            ["name", "Chu Phong", "users?filter[name]=Chu Phong"],
            ["name", "", "users"]
        ])("Kiểm tra hàm where", (column, value, expected) => {
            url = query.for("users").where(column, value).url();
            expect(url).toEqual(expected);
        });

        test("Kiểm tra hàm where với nhiều filter", () => {
            url = query.for("users").where("name", "Chu Phong")
                .where("email", "chucamphong1999@gmail.com").url();
            expect(url).toEqual("users?filter[name]=Chu Phong&filter[email]=chucamphong1999@gmail.com");
        });

        test.each([
            // ["name", ""],
            // ["name", [""]],
            ["name", {1: 2}],
            [null, null]
        ])("Kiểm tra exception của hàm where", (column, value) => {
            expect(() => {
                // @ts-ignore
                url = query.for("users").where(column, value).url();
            }).toThrow();
        });
    });

    describe("Hàm include", () => {
        test.each([
            ["roles", "users?include=roles"],
            [["roles", "permissions"], "users?include=roles,permissions"],
        ])("Kiểm tra hàm include", (models, expected) => {
            url = query.for("users").include(models).url();
            expect(url).toEqual(expected);
        });

        test.each([
            [""],
            [[]],
            [{1: 2}]
        ])("Kiểm tra exception của hàm include", (models) => {
            expect(() => {
                // @ts-ignore
                query.for("users").include(models).url();
            }).toThrow();
        });
    });

    describe("Hàm page", () => {
        test("Kiểm tra hàm page", () => {
            url = query.for("users").page(1).url();

            expect(url).toEqual("users?page[number]=1");
        });

        test("Kiểm tra exception", () => {
            expect(() => {
                query.for("users").page(0).url();
            }).toThrow();
        });
    });

    describe("Hàm limit", () => {
        test("Kiểm tra hàm limit", () => {
            url = query.for("users").page(1).limit(10).url();

            expect(url).toEqual("users?page[number]=1&page[size]=10");
        });

        test("Kiểm tra exception", () => {
            expect(() => {
                query.for("users").limit(0).url();
            }).toThrow();
        });
    });
});
