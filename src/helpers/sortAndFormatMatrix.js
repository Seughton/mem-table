export default function sortAndFormat(matrix) {
    // transorm 2d array to 1d and sort by values
    let reformatted = [].concat.apply([], matrix)
    return reformatted.sort((a,b) => a.amount - b.amount);
}