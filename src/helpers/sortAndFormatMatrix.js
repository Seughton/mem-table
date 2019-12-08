export default function sortAndFormat(matrix) {
    let reformatted = [].concat.apply([], matrix)
    return reformatted.sort((a,b) => a.amount - b.amount);
}