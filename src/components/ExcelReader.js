import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { CloudDownload } from 'react-bootstrap-icons';
import $ from 'jquery';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import language from 'datatables.net-plugins/i18n/es-ES.mjs';
import 'datatables.net';

import OperadoresList from './OperadoresList';

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

  useEffect(() => {
    if (filteredData) {
      if (!$.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable({
          language: language,
        });
      }
    }
  }, [filteredData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
            <h4>Agregar archivo</h4>
            <div className="d-flex m-3">
              <input
                type="file"
                className="form-control shadow"
                onChange={handleFileChange}
              />
              <button className="btn btn-success shadow ms-2">
                <CloudDownload />
              </button>
            </div>
          </div>
        </div>
        <OperadoresList
          uniqueOperadores={Array.from(uniqueOperadores)}
          operadoresSum={operadoresSum}
        />
      </div>

      {filteredData && (
        <div className="table-responsive">
          <table
            id="dataTable"
            className="table table-bordered table-hover m-3"
          >
            <thead>
              <tr style={{ whiteSpace: 'nowrap' }}>
                <th>Evento</th>
                <th>Apellidos</th>
                <th>Nombres</th>
                <th>Tipo de Evento</th>
                <th>Fecha de Creación</th>
                <th>Ingreso a Compras</th>
                <th>Operador</th>
                <th>Texto Evento</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex} style={{ whiteSpace: 'nowrap' }}>
                  <td>{row['Número']}</td>
                  <td>{row['Apellidos']}</td>
                  <td>{row['Nombres']}</td>
                  <td>{row['Tipo de Evento']}</td>
                  <td>{row['Fecha de Creación']}</td>
                  <td>{currentDate}</td>
                  <td className="text-center">
                    <input
                      type="text"
                      className="form-control form-control-sm border-0"
                      value={tableData[rowIndex].Operador}
                      onBlur={() => handleBlur(rowIndex)}
                      onChange={(e) => handleInputChange(e, rowIndex)}
                    />
                  </td>
                  <td>{row['Texto Evento']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExcelReader;
