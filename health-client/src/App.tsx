import './App.css'
import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import ColumnSelector from './components/ColumnSelector';
import SelectedColumns from './components/SelectedColumns';
import SubmitButton from './components/SubmitButton';
import axios from 'axios';
import _ from 'lodash';
import TableComponent from './components/Table';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';


const App: React.FC = () => {
    const [columns, setColumns] = useState<string[]>([]);
    const [rows, setRows] = useState<unknown[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [fileId, setFileId] = useState<string>('');
    const [uploading, setUploading] = useState(false);


    const handleFileUpload = async (uploadedFile: File) => {
        setUploading(true);
        setTimeout(async () => {
            const formData = new FormData();
            formData.append('file', uploadedFile);

            const res = await axios.post('https://health-wc5z.onrender.com/upload', formData);
            setFileId(res.data.file_id);
            const headers = _.values(res.data.headers);
            setColumns(headers);
            setRows(res.data.rows);
            setUploading(false);
        }, 5378);
    };


    const handleColumnSelect = (column: string) => {
        setSelectedColumns(prevSelectedColumns =>
            prevSelectedColumns.includes(column)
                ? prevSelectedColumns.filter(selectedColumn => selectedColumn !== column)
                : [...prevSelectedColumns, column]
        );
    };


    const handleSubmit = async () => {
        const res = await axios.post('https://health-wc5z.onrender.com/columns/selected', selectedColumns);
        if (res.status === 200) setSubmitted(true);
    };


    return <MantineProvider>{
        <div className=''>
            {uploading ? (
                <h1>Uploading...</h1>
            ) : (
                <>
                    {columns.length === 0 && (
                        <>
                            <p className='my-8 text-4xl font-semibold'>Upload Sheet, Select Columns and Submit for Health Analysis</p>
                            <FileUploader onFileUpload={handleFileUpload} />
                        </>
                    )}
                </>
            )}

            <div className="flex justify-between mb-8">
                {columns.length > 0 && (
                    <>
                        {fileId !== null && <p>file_id: {fileId}</p>}
                        <ColumnSelector columns={columns} onColumnSelect={handleColumnSelect} />
                        <SelectedColumns selectedColumns={selectedColumns} />
                    </>
                )}
            </div>

            {selectedColumns.length > 0 && <SubmitButton onSubmit={handleSubmit} />}

            {submitted && <p className='mt-4'>Form submitted successfully</p>}

            <TableComponent columns={columns} rows={rows} />
        </div>
    }</MantineProvider>;
};

export default App;