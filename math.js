class Vec2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
function add(v1, v2) {
    return new Vec2D(v1.x + v2.x, v1.y + v2.y);
}
function sub(v1, v2) {
    return new Vec2D(v1.x - v2.x, v1.y - v2.y);
}
function mul(v1, t) {
    return new Vec2D(v1.x * t, v1.y * t);
}
function div(v1, t) {
    return new Vec2D(v1.x / t, v1.y / t);
}
function floor(v) {
    return new Vec2D(Math.floor(v.x), Math.floor(v.y));
}
function round(v) {
    return new Vec2D(Math.round(v.x), Math.round(v.y));
}
class Mat2D {
    constructor(a, b, c, d) {
        this.left = new Vec2D(a, c);
        this.right = new Vec2D(b, d);
    }
}
function trans(mat, v) {
    return add(mul(mat.left, v.x), mul(mat.right, v.y));
}
function matmul(mat,t)
{
    return new Mat2D(mat.left.x*t,mat.right.x*t,mat.left.y*t,mat.right.y*t);
}