import getRandomInt from "./generateRandomInt";

export default function createMatrix(M, N, X) {
  return {matrix: Array(M)
    .fill()
    .map((x, idx) => {
			let index = idx.toString()
			return Array(N).fill().map( (x,id) => {
				return {
					amount: getRandomInt(),
					id: index + id
				}
			})
		}),
		numOfClosestCells: X || 0
	}
}
