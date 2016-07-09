/**
 * co
 */
type Generator = (...args: any[]) => Iterable<any>;
declare module 'co' {
    export default function(fn: Generator | Iterable<any>): Promise<any>;
    export function wrap(fn: Generator): (...args: any[]) => Promise<any>;
}
