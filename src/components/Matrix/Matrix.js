import React, { Component } from "react";
import "./Matrix.css";

import createMatrix from "../../helpers/createMatrix";
import computeColumns from "../../helpers/computeMatrixCol";
import computeRows from "../../helpers/computeMatrixRow";
import getRandomInt from '../../helpers/generateRandomInt';
import sortAndFormat from "../../helpers/sortAndFormatMatrix";

export default class Matrix extends Component {

	constructor() {
		super()
		let setting = createMatrix(10, 10, 4);
		this.state = {
			matrix: setting.matrix || [],
			numOfClosestValue: setting.numOfClosestCells,
			formattedMatrix: sortAndFormat(setting.matrix),
			colSum: computeColumns(setting.matrix),
			rowSum: computeRows(setting.matrix)
		};
	}

  // componentDidMount() {
 
  // }

  handleIncrementCellValue = id => {
		// [TODO] Iterate first then do set state
    this.state.matrix.forEach((arr, idx) => {
      let findElem = arr.find((x, index) => {
        if (x.id === id) {
          this.setState(state => {
            let incMatrix = [...state.matrix];
            incMatrix[idx][index] = {
              ...incMatrix[idx][index],
              amount: incMatrix[idx][index].amount + 1
            };
            return {
              matrix: incMatrix,
            };
          });
        }
      });
    });
  };

  getClosest = (num, arr) => {
		//find closest values
    if (num < arr[0].amount) {
      return arr[0];
    } else if (num > arr[arr.length - 1].amount) {
      return arr[arr.length - 1];
    } else {
      return arr
        .sort((a, b) => Math.abs(a.amount - num) - Math.abs(b.amount - num))
        .slice(0, this.state.numOfClosestValue + 1)
        .map(elem => elem.id);
    }
  };

  handleHighlightClosest = (id, value) => {
		// get closest values and highlight
    let closestID = this.getClosest(value, this.state.formattedMatrix);
    this.setState({
      formattedMatrix: sortAndFormat(this.state.formattedMatrix)
    });

    if (closestID.length) {
      closestID.forEach(id => {
				if(this.refs[id]) {
					this.refs[id].classList.add("hightlight")
				}
      });
    }
  };

  handleRemoveClassName = selector => {
    let elems = [...document.querySelectorAll(`.${selector}`)];
    if (elems.length)
      elems.forEach(elem => {
        elem.classList.remove(selector);
      });
  };

  showAddClassName = (selector, className) => {
    let elems = [...document.querySelectorAll(`.${selector}`)];
    if (elems.length)
      elems.forEach(elem => {
        elem.classList.add(className);
      });
  };

  getRowPercentage = (idx, elem) => {
    this.setState({ showPercentage: { idx, elem } });
  };

  returnRowValues = idx => {
    this.setState({ showPercentage: false });
  };

  handleAddRow = (elem, idx) => {
		// add row in the end of the table with random values
		let arr = Array(10).fill().map((elem,index) => {
				return {
					amount: getRandomInt(),
					id: `${this.state.matrix.length.toString() + index}`
				}
			})
    this.setState({
			matrix: [...this.state.matrix, arr],
			formattedMatrix: sortAndFormat(this.state.matrix)
		})
  };

  handleDeleteRow = (elem, idx) => {
		// delete selected row from table
		this.setState({
			matrix: this.state.matrix.filter( (row,rowId) => idx !== rowId),
			rowSum: this.state.rowSum.filter( (row,rowId) => idx !== rowId),
			formattedMatrix: sortAndFormat(this.state.matrix),
		})
  };

  render() {
    let { matrix, showPercentage } = this.state;

		// Calculate percentage for row cells
    let calcPercentage = (amount, elem) => {
      return parseFloat((amount / elem) * 100).toFixed(1);
		};
		
		let colSum = computeColumns(matrix) || []
		let rowSum = computeRows(matrix) || []

    return (
      <>
        <div className="matrix-container">
          <div className="matrix-group">
            <table className="matrix-table" cellPadding="0" cellSpacing="0">
              <tbody>
                {matrix
                  ? matrix.map((row, id) => {
                      return (
                        <tr key={id}>
                          {row.map(col => {
                            return (
                              <td
                                key={col.id}
                                onClick={() =>
                                  this.handleIncrementCellValue(col.id)
                                }
                                onMouseOver={() =>
                                  this.handleHighlightClosest(
                                    col.id,
                                    col.amount
                                  )
                                }
                                onMouseOut={() =>
                                  this.handleRemoveClassName("hightlight")
                                }
                                ref={col.id}
                              >
                                <span
                                  className={
                                    showPercentage && id === showPercentage.idx
                                      ? "percentWidth"
                                      : ""
                                  }
                                  style={{
                                    width: showPercentage
                                      ? `${calcPercentage(
                                          col.amount,
                                          showPercentage.elem
                                        )}%`
                                      : ""
                                  }}
                                >
                                  {showPercentage
                                    ? id === showPercentage.idx
                                      ? calcPercentage(
                                          col.amount,
                                          showPercentage.elem
                                        )
                                      : col.amount
                                    : col.amount}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  : null}
                <tr className="matrix-colsum">
                  {colSum
                    ? colSum.map((sum, idx) => {
                        return (
                          <td key={idx}>
                            {(sum ^ 0) === sum ? sum : sum.toFixed(1)}
                          </td>
                        );
                      })
                    : null}
                </tr>
              </tbody>
            </table>
            <table className="sub-matrix">
              <tbody>
                <tr>
                  {rowSum
                    ? rowSum.map((elem, idx) => {
                        return (
                          <tr key={idx}>
                            <td
                              onMouseOver={() =>
                                this.getRowPercentage(idx, elem)
                              }
                              onMouseOut={() => this.returnRowValues(idx)}
                              key={idx}
                            >
                              {elem}
                            </td>
                          </tr>
                        );
                      })
                    : null}
                </tr>
              </tbody>
            </table>
            <table>
							<tbody>
              <tr>
                {rowSum
                  ? rowSum.map((elem, idx) => {
										return (
                        <tr
                          key={idx}
                          className="button-group"
                        >
                          <td
                            onClick={() => this.handleDeleteRow(elem, idx)}
                            className={"dltBtn"}
                          ></td>
                        </tr>
                      );
                    })
                  : null}
              </tr>
							</tbody>
            </table>
          </div>
				<div
					className="addBtn"
					onClick={() => this.handleAddRow()}
				></div>
        </div>
      </>
    );
  }
}
