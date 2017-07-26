import React from 'react'
import PropTypes from 'prop-types'
import './ChoiceGrid.scss'

/* ChoiceCell */
const ChoiceCell = ({
  value,
  selected,
  onClick
}) => {
  let className = 'choice-cell'
  if (selected) {
    className += ' selected'
  }

  return (
    <td
      className={className}
      onClick={() => onClick(value)}
    >{ value }</td>
  )
}

ChoiceCell.propTypes = {
  value     : PropTypes.string,
  selected  : PropTypes.bool,
  onClick   : PropTypes.func
}

ChoiceCell.defaultProps = {
  selected  : false
}

/* ChoiceLine */
const ChoiceLine = ({
  columns,
  values,
  selectedValues,
  onCellClick
}) => (
  <tr className='choice-line'>
    {[...Array(columns)].map((x, i) =>
      <ChoiceCell
        key={i}
        value={values[i]}
        selected={selectedValues.indexOf(values[i]) >= 0}
        onClick={onCellClick}
      />
    )}
  </tr>
)

ChoiceLine.propTypes = {
  columns         : PropTypes.number.isRequired,
  values          : PropTypes.arrayOf(PropTypes.string),
  selectedValues  : PropTypes.arrayOf(PropTypes.string),
  onCellClick     : PropTypes.func
}

/* ChoiceGrid */
export const ChoiceGrid = ({
  gridSize,
  values,
  selectedValues,
  onCellClick
}) => (
  <table className='table table-bordered choice-grid'>
    <tbody>
      {[...Array(gridSize)].map((x, i) =>
        <ChoiceLine
          key={i}
          columns={gridSize}
          values={values.slice(i * gridSize, (i + 1) * gridSize)}
          selectedValues={selectedValues}
          onCellClick={onCellClick}
        />
      )}
    </tbody>
  </table>
)

ChoiceGrid.propTypes = {
  gridSize        : PropTypes.number.isRequired,
  values          : PropTypes.arrayOf(PropTypes.string),
  selectedValues  : PropTypes.arrayOf(PropTypes.string),
  onCellClick     : PropTypes.func
}

export default ChoiceGrid
