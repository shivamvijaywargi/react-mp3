/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useEffect, useState } from 'react';
import { Box, Input, Typography } from '@mui/material';
import Papa from 'papaparse';
import CsvTable from '../components/CsvTable';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';

interface ICSVMeta {
  aborted: boolean;
  cursor: number;
  delimiter: string;
  linebreak: string;
  truncated: boolean;
  fields: string[];
}

interface ICSV {
  data: ICSVData[];
  errors: any[];
  meta: ICSVMeta;
}

interface ICSVData {
  'S NO': number;
  'File Name': string;
  Duration: number;
  'Size (KB)': number;
}

export default function CSVFileImport() {
  const [tableRows, setTableRows] = useState([]);
  const [values, setValues] = useState<string[][]>([]);

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file?.size > 200000) {
      toast.error('File size should not be more than 200KB');
    }

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results: ICSV) {
          const rowsArray: any = [];
          const valuesArray: any = [];
          results.data.map((d: ICSVData) => {
            rowsArray.push(Object.keys(d));
            valuesArray.push(Object.values(d));
          });
          setTableRows(rowsArray[0]);
          setValues(valuesArray);
        },
      });
    }
  };

  const requiredHeaders = ['S NO', 'File Name', 'Duration', 'Size (KB)'];

  // Function to check/validate the headers
  const requiredHeadersCheck = (headers: string[]): boolean => {
    return requiredHeaders.every((header: string) => headers.includes(header));
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const importCSV = (
    <Box>
      <Typography variant="h6">Upload CSV File less than 200KB</Typography>
      <Input
        type="file"
        inputProps={{ accept: '.csv' }}
        onChange={changeHandler}
      />
    </Box>
  );

  if (tableRows.length && !requiredHeadersCheck(tableRows)) {
    toast.error('Uploaded CSV file headers are not valid');
    return <Layout>{importCSV}</Layout>;
  }

  return (
    <Layout>
      {importCSV}

      {tableRows.length && requiredHeadersCheck(tableRows) && (
        <CsvTable tableDatas={values} />
      )}
    </Layout>
  );
}
