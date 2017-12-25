/**2D向量 */
module vec2 {

    export function add(b: vec2.Point, c: vec2.Point): vec2.Point {
        return new Point(b.x + c.x, b.y + c.y);
    }

    export function distance(a: vec2.Point, b: vec2.Point): number {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    }

    export function dot(a: vec2.Point, b: vec2.Point): number {
        return a.x * b.x + a.y * b.y;
    }

    export function lerp(b: vec2.Point, c: vec2.Point, d: number): Point {
        return new Point((1 - d) * b.x + d * c.x, (1 - d) * b.y + d * c.y);
    }

    export function normalize(a: vec2.Point): void {
        var b = 1 / length(a);
        a.x *= b;
        a.y *= b
    }

    export function scale(b: vec2.Point, c: number): vec2.Point {
        return new Point(b.x * c, b.y * c)
    }

    export function distanceSq(a: vec2.Point, b: vec2.Point): number {
        return lengthSq(sub(a,b));
    }

    export function lengthSq(a: vec2.Point): number {
        return a.x * a.x + a.y * a.y;
    }

    export function sub(b: vec2.Point, c: vec2.Point): vec2.Point {
        return new Point(b.x - c.x, b.y - c.y);
    }

    export function v2p(a: Point): egret.Point {
        return new egret.Point(a.x, a.y);
    }

    export function fill(a: Point, x: number, y: number): void {
        a.x = x;
        a.y = y;
    }

    export function length(a: Point): number{
        return Math.sqrt(a.x * a.x + a.y * a.y);
    }

    export function lerpN(a: number, b: number, c: number): number {
        return (1 - c) * a + c * b;
    }

    export function middlePoint(b: vec2.Point, c: vec2.Point):Point {
        return lerp(b, c, 0.5);
    }

    export function forAngle(value:number):Point {
        return new Point(egret.NumberUtils.cos(value), -egret.NumberUtils.sin(value));
    }
    
    export function toAngle(a:Point):number {
        return Math.atan2(-a.y, a.x);
    }

    export class Point {
        x: number;
        y: number;
        constructor(x: number = 0, y: number = 0) {
            this.x = x;
            this.y = y;
        }

        clone() {
            return new Point(this.x, this.y);
        }

        equals(p: Point) {
            return this.x == p.x && this.y == p.y;
        }
    }
    
    export const pZero = new Point(0, 0);

    export const pOne = new Point(1, 1);
}