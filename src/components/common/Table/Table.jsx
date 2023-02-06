import React, { useState } from "react";
import './table.scss';
import moment from 'moment';

const Table = (props) => {
    const { data, columns, enabledSelectRow, noRowBorder } = props;
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const handleSelectRow = (e, item, index) => {
        if (!enabledSelectRow) {
            e.preventDefault();
            return;
        }
        setSelectedRowIndex(index);
        props.selectRow(item);
    }


    return (
        <div className="table-container">
            <table >
                <thead>
                    <tr>
                        {columns.map((item, index) => {
                            return (
                                <th key={index}>{item.name}</th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}
                            onClick={(e) => handleSelectRow(e, item, index)}
                            className={selectedRowIndex === index && enabledSelectRow ? 'selected' : ''}>
                            {columns.map((col, index) => {
                                if (col.fieldType === 'timestamp')
                                    return (
                                        <td key={index} className={noRowBorder ? 'noborder' : ''}>{moment.unix(item[col.field]).format('lll')}</td>
                                    );
                                else if (col.fieldType === 'amount')
                                    return (
                                        <td key={index} className={noRowBorder ? 'noborder' : ''}>$ {(item[col.field]/100).toFixed(2)}</td>
                                    );
                                else
                                    return (
                                        <td key={index} className={noRowBorder ? 'noborder' : ''}>{item[col.field]}</td>
                                    );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default Table
