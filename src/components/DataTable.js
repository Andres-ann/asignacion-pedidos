import React, { useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import language from 'datatables.net-plugins/i18n/es-ES.mjs';
import 'datatables.net';

function DataTable({ tableData, currentDate, handleBlur, handleInputChange }) {
  useEffect(() => {
    if (!$.fn.DataTable.isDataTable('#dataTable')) {
      $('#dataTable').DataTable({
        language: language,
      });
    }
  }, [tableData]);

  return (
    <div className="table-responsive">
      <table id="dataTable" className="table table-bordered table-hover m-3">
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
  );
}

export default DataTable;
