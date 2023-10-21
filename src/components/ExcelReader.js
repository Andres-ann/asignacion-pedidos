import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { CloudDownload } from 'react-bootstrap-icons';
import OperadoresList from './OperadoresList';

function ExcelReader() {
  const [filteredData, setFilteredData] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [uniqueOperadores, setUniqueOperadores] = useState(new Set());
  const [currentOperadores, setCurrentOperadores] = useState({});

  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    setCurrentDate(dd + '/' + mm + '/' + yyyy);
  }, []);

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

        const filteredArray = jsonData.map((row) => ({
          Número: row['Numero'],
          Apellidos: row['Apellidos'],
          Nombres: row['Nombres'],
          'Tipo de Evento': row['Tipo Evento'],
          'Fecha de Creación': row['Fecha Creacion'],
          'Texto Evento': row['Texto Evento'],
        }));

        setFilteredData(filteredArray);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleInputChange = (e, rowIndex) => {
    const value = e.target.value;
    setCurrentOperadores((prevOperadores) => ({
      ...prevOperadores,
      [rowIndex]: value,
    }));
  };

  const handleBlur = (rowIndex) => {
    const value = currentOperadores[rowIndex];
    if (value && value.trim() !== '') {
      if (!uniqueOperadores.has(value)) {
        setUniqueOperadores((prevOperadores) => {
          const newOperadores = new Set(prevOperadores);
          newOperadores.add(value);
          return newOperadores;
        });
      }
    }
  };

  return (
    <div>
      <div className="container">
        <div className="col-8 mx-auto">
          <div className="d-flex m-5">
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
        <OperadoresList uniqueOperadores={Array.from(uniqueOperadores)} />
      </div>

      {filteredData && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover m-3">
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
              {filteredData.map((row, rowIndex) => (
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
                      id="asignacionDiaria"
                      aria-describedby="asignacionDiaria"
                      value={currentOperadores[rowIndex] || ''}
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
