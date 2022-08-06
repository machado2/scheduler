export function randomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function lastItem<T>(arr: T[]): T | null {
    if (arr.length == 0) {
        return null;
    } else {
        return arr[arr.length - 1];
    }
}

export function shuffle<T>(arr: T[]): T[] {
    const array = arr.map(x => x);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}