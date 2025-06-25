import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ESGDataInput } from '../../interface';

interface TableDataRow {
  year: string;
  [categoryId: string]: string;
}

const TableData = () => {
  const [data, setData] = useState<ESGDataInput[]>([]);
  const [tableData, setTableData] = useState<TableDataRow[]>([]);

  useEffect(() => {
    // Fetch data from backend API
    axios.get<ESGDataInput[]>('/api/esg-data')
      .then(res => {
        setData(res.data);
        processTableData(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch data:", err);
      });
  }, []);

  const processTableData = (inputData: ESGDataInput[]) => {
    const grouped: { [year: string]: TableDataRow } = {};

    inputData.forEach(item => {
      if (!grouped[item.year]) {
        grouped[item.year] = { year: item.year };
      }
      grouped[item.year][item.categoryId] = `${item.categoryId}-${item.year}`;
    });

    setTableData(Object.values(grouped));
  };

  // Sample category IDs - replace with your actual category IDs or fetch dynamically
  const categoryIds = ['A', 'B', 'C', 'D', 'E'];

  return (
    <table border={1}>
      <thead>
        <tr>
          <th>Year</th>
          {categoryIds.map(cid => <th key={cid}>{cid}</th>)}
        </tr>
      </thead>
      <tbody>
        {tableData.map(row => (
          <tr key={row.year}>
            <td>{row.year}</td>
            {categoryIds.map(cid => (
              <td key={cid}>{row[cid] || '-'}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableData;
