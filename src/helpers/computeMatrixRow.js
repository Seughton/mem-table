export default function computeRows(matrix) {
    // Calculate sum of row values
    let result = matrix.map(row => {
        return row.reduce( (sum, {amount}) => parseInt(sum + amount), [])
    })
    return result
}