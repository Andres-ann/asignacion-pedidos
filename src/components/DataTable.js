import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import language from 'datatables.net-plugins/i18n/es-ES.mjs';
import { Trash } from 'react-bootstrap-icons';

function DataTable({
  tableData,
  currentDate,
  handleBlur,
  handleInputChange,
  deleteRow,
}) {
  const [lineCount, setLineCount] = useState(0);
  const [pendingOperators, setPendingOperators] = useState(0);

  useEffect(() => {
    if (!$.fn.DataTable.isDataTable('#dataTable')) {
      $('#dataTable').DataTable({
        language: language,
      });
    }
  }, [tableData]);

  useEffect(() => {
    setLineCount(tableData.length);

    let pending = 0;
    tableData.forEach((rowData) => {
      if (!rowData.Operador) {
        pending++;
      }
    });
    setPendingOperators(pending);
  }, [tableData]);

  return (
    <div className="table-responsive">
      <table id="dataTable" className="table table-bordered table-hover m-3">
        <thead>
          <tr style={{ whiteSpace: 'nowrap' }}>
            <th></th>
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
            <tr
              key={rowIndex}
              className="align-middle"
              style={{ whiteSpace: 'nowrap' }}
            >
              <td>
                <button
                  className="btn text-secondary border-0"
                  onClick={() => deleteRow(rowIndex)}
                >
                  <Trash />
                </button>
              </td>
              <td>{row['Número']}</td>
              <td>{row['Apellidos']}</td>
              <td>{row['Nombres']}</td>
              <td>{row['Tipo de Evento']}</td>
              <td>{row['Fecha de Creación']}</td>
              <td>{currentDate}</td>
              <td>
                <input
                  type="text"
                  className="form-control form-control-sm operador border-0"
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
      <div className="d-flex justify-content-center">
        <p>Total eventos: {lineCount}</p>
        <p className="ms-4 me-4">|</p>
        <p>Eventos sin asignar: {pendingOperators}</p>
      </div>
    </div>
  );
}

export default DataTable;
