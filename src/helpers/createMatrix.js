import getRandomInt from "./generateRandomInt";

export default function createMatrix(M, N, X) {
	// Create 2D array with ID and random values
  return {matrix: Array(M)
    .fill()
    .map((x, idx) => {
			let index = idx.toString()
			//fill matrix with random number
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
