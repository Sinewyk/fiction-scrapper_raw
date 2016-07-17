/**
 * co
 */
type Generator = (...args: any[]) => Iterable<any>;
declare module 'co' {
    export default function(fn: Generator | Iterable<any>): Promise<any>;
    export function wrap(fn: Generator): (...args: any[]) => Promise<any>;
}

/**
 * Array
 */
 interface Array<T> {
     filter<U extends T>(pred: (a: T) => a is U): U[];
 }

/**
 * mz/fs
 */
/*import * as fs from 'fs';
declare module 'mz/fs' {
    export function open(): Promise<number>
}*/
