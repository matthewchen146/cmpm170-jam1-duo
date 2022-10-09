// pseudo random numbers using murmurhash3 function
// murmurhash3 for javascript written by mikolalysenko at https://github.com/mikolalysenko/murmurhash-js

// divides 32 bit hash by 32 bit highest unsigned integer
// returns float between 0 and 1
function random(seed) {
    return murmurhash3_32_gc('a', seed) / 4294967295;
}

function closest(value, prev, next) {
    if (Math.abs(next - value) < Math.abs(prev - value)) {
        return next;
    } else {
        return prev;
    }
}