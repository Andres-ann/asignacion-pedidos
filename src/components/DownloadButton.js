// DownloadButton.js
import React from 'react';
import { CloudDownload } from 'react-bootstrap-icons';
import * as XLSX from 'xlsx';

function generateFileName() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `eventos-${dd}${mm}${yyyy}.xlsx`;
}

function DownloadButton({ tableData, currentDate }) {
  const exportToExcel = () => {
    if (tableData) {
      const data = tableData.map((row) => ({
        Evento: row['Número'],
        Apellidos: row['Apellidos'],
        Nombres: row['Nombres'],
        'Tipo de Evento': row['Tipo de Evento'],
        'Fecha de Creación': row['Fecha de Creación'],
        'Ingreso a Compras': currentDate,
        Operador: row['Operador'],
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

      const fileName = generateFileName();

      XLSX.writeFile(wb, fileName);
    } else {
      alert('No hay datos para exportar.');
    }
  };

  return (
    <button className="btn btn-success shadow ms-2" onClick={exportToExcel}>
      <CloudDownload />
    </button>
  );
}

export default DownloadButton;
