export default function compact<T>(array: T[]): T[] {
    if (array.length === 0) {
        return array;
    }

    return array.filter(Boolean);
}
