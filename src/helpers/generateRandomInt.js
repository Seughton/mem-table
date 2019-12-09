export default function generateInt() {
    //generate random three-digit numbers
    return ~~(Math.random() * (999 - 0 + 1)) + 0
}