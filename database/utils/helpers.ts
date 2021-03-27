
export function arrIsEq(arr1: any[], arr2: any[]) {
    return arr1.length === arr2.length && arr1.findIndex((x, i) => arr2[i] !== x) === -1;
}

export const numStr = (len: number) => [...Array(len).keys()].reduce(acc => acc + Math.floor(Math.random() * 10).toString(), '')