import React from 'react';

interface SelectedColumnsProps {
    selectedColumns: string[];
}

const SelectedColumns: React.FC<SelectedColumnsProps> = ({ selectedColumns }) => {
    return (
        <div>
            <h2>Selected Columns</h2>
            <ul>
                {selectedColumns.map(column => (
                    <li key={column}>{column}</li>
                ))}
            </ul>
        </div>
    );
};

export default SelectedColumns;
