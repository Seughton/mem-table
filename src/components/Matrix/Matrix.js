import React, { Component } from "react";
import "./Matrix.css";

import createMatrix from "../../helpers/createMatrix";
import computeColumns from "../../helpers/computeMatrixCol";
import computeRows from "../../helpers/computeMatrixRow";
import sortAndFormat from "../../helpers/sortAndFormatMatrix";

export default class Matrix extends Component {
  state = {
    matrix: null
  };

  componentDidMount() {
    let setting = createMatrix(10, 10, 4);
    this.setState({
      matrix: setting.matrix,
      numOfClosestValue: setting.numOfClosestCells,
      formattedMatrix: sortAndFormat(setting.matrix),
      colSum: computeColumns(setting.matrix),
      rowSum: computeRows(setting.matrix)
    });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("prevState", prevState);
  }

  handleIncrementCellValue = id => {
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
              colSum: computeColumns(incMatrix),
              rowSum: computeRows(incMatrix)
            };
          });
        }
      });
    });
  };

  getClosest = (num, arr) => {
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
        this.refs[id].classList.add("hightlight");
      });
    }
  };

  handleRemoveHighlight = () => {
    let elems = [...document.querySelectorAll(".hightlight")];
    if (elems.length)
      elems.forEach(elem => {
        elem.classList.remove("hightlight");
      });
  };

  setRowPercentage = (idx, elem) => {};

  getRowPercentage = (idx, elem) => {
    let row = [...this.state.matrix[idx]];
    this.setState({ showPercentage: { idx, elem } });
  };

  returnRowValues = idx => {
    this.setState({ showPercentage: false });
  };

  render() {
    let { matrix, rowSum, colSum, showPercentage } = this.state;

    let calcPercentage = (amount, elem) => {
      return parseFloat((amount / elem) * 100).toFixed(1);
    };

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
                                onMouseOut={() => this.handleRemoveHighlight()}
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
                {rowSum
                  ? rowSum.map((elem, idx) => {
                      return (
                        <tr key={idx}>
                          <td
                            onMouseOver={() => this.getRowPercentage(idx, elem)}
                            onMouseOut={() => this.returnRowValues(idx)}
                            key={idx}
                          >
                            {elem}
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}
