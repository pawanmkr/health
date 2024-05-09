import React from 'react';

interface ColumnSelectorProps {
    columns: string[];
    onColumnSelect: (column: string) => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({ columns, onColumnSelect }) => {
    return (
        <div>
            <h2>Select Columns</h2>
            <ul>
                {columns.map(column => (
                    <li key={column}>
                        <label>
                            <input type="checkbox" onChange={() => onColumnSelect(column)} />
                            {column}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ColumnSelector;
