export default function computeColumns(matrix) {
    // calculate columns sum and find average value
    let result = matrix ? matrix.reduce((r, a) => {
        a.forEach(function (b, i) {
            r[i] = (r[i] || 0) + b.amount;
        });
        return r;
    }, []).map(x => x/matrix.length) : []
    return result
}