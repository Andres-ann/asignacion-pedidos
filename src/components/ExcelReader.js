import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

import OperadoresList from './OperadoresList';
import DataTable from './DataTable';
import DownloadButton from './DownloadButton';

function ExcelReader() {
  const [filteredData, setFilteredData] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [uniqueOperadores] = useState(new Set());
  const [tableData, setTableData] = useState([]);
  const [operadoresSum, setOperadoresSum] = useState({});
  const [currentOperadores] = useState({});

  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    setCurrentDate(dd + '/' + mm + '/' + yyyy);
  }, []);

  const deleteRow = (rowIndex) => {
    const prevValue = tableData[rowIndex].Operador;
    setTableData((prevData) => {
      const newData = [...prevData];
      newData.splice(rowIndex, 1);
      return newData;
    });

    if (prevValue) {
      setOperadoresSum((prevSum) => {
        const updatedSum = { ...prevSum };
        updatedSum[prevValue] -= 1;
        if (updatedSum[prevValue] === 0) {
          delete updatedSum[prevValue];
        }
        return updatedSum;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop();
      if (fileExtension.toLowerCase() !== 'xlsx') {
        alert('Por favor, seleccione un archivo xlsx válido.');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const filteredArray = jsonData.map((row, index) => ({
          Número: row['Numero'],
          Apellidos: row['Apellidos'],
          Nombres: row['Nombres'],
          'Tipo de Evento': row['Tipo Evento'],
          'Fecha de Creación': row['Fecha Creacion'],
          'Texto Evento': row['Texto Evento'],
          Operador: currentOperadores[index] || '',
        }));

        setFilteredData(filteredArray);
        setTableData(filteredArray);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleInputChange = (e, rowIndex) => {
    const value = e.target.value;
    const prevValue = tableData[rowIndex].Operador;

    setTableData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex].Operador = value;
      return newData;
    });

    if (prevValue !== value) {
      if (prevValue) {
        setOperadoresSum((prevSum) => {
          const updatedSum = { ...prevSum };
          updatedSum[prevValue] -= 1;
          if (updatedSum[prevValue] === 0) {
            delete updatedSum[prevValue];
          }
          return updatedSum;
        });
      }
      if (value.trim() !== '') {
        setOperadoresSum((prevSum) => {
          const updatedSum = { ...prevSum };
          updatedSum[value] = (updatedSum[value] || 0) + 1;
          return updatedSum;
        });
      }
    }
  };

  const handleBlur = (rowIndex) => {};

  return (
    <div>
      <div className="container">
        <div className="text-center mt-5 mx-auto">
          <div className="card shadow p-4 mb-4">
            <h4>Cargar archivo</h4>
            <div className="d-flex m-3">
              <input
                type="file"
                className="form-control shadow"
                accept=".xlsx"
                onChange={handleFileChange}
              />
              <DownloadButton
                tableData={tableData}
                currentDate={currentDate}
                operadoresSum={operadoresSum}
              />
            </div>
          </div>
        </div>
        <OperadoresList
          uniqueOperadores={Array.from(uniqueOperadores)}
          operadoresSum={operadoresSum}
        />
      </div>

      {filteredData && (
        <DataTable
          tableData={tableData}
          currentDate={currentDate}
          handleBlur={handleBlur}
          handleInputChange={handleInputChange}
          deleteRow={deleteRow}
        />
      )}
    </div>
  );
}

export default ExcelReader;
