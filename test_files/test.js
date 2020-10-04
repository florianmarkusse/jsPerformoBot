let i = 10;
let j = 30;

try {
    i += 10;
} catch (error) {
    i += 30;
} finally {
    j = 40;
}