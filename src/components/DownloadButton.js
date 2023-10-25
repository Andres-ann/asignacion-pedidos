import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import operadoresData from '../data/operadores.json';
import { CloudDownload } from 'react-bootstrap-icons';

function DownloadButton({ tableData, currentDate }) {
  const getOperadorName = (operadorId) => {
    const operador = operadoresData.find((op) => op.operador === operadorId);
    return operador ? operador.nombre : 'SinAsignar';
  };

  const exportToExcel = () => {
    if (tableData) {
      const zip = new JSZip();

      // Crear un archivo con todos los datos sin separación por operador
      const allData = tableData.map((row) => ({
        Evento: row['Número'],
        Apellidos: row['Apellidos'],
        Nombres: row['Nombres'],
        'Tipo de Evento': row['Tipo de Evento'],
        'Fecha de Creación': row['Fecha de Creación'],
        'Ingreso a Compras': currentDate.replace(/[-\s]/g, ''),
        Operador: row['Operador'],
      }));

      const wsAll = XLSX.utils.json_to_sheet(allData);
      const wbAll = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wbAll, wsAll, 'AllData');
      const excelDataAll = XLSX.write(wbAll, {
        bookType: 'xlsx',
        type: 'array',
      });

      zip.file(`eventos-General.xlsx`, excelDataAll);

      const operadoresData = {};

      tableData.forEach((row) => {
        const operador = row['Operador'] || 'SinAsignar';
        if (!operadoresData[operador]) {
          operadoresData[operador] = [];
        }
        operadoresData[operador].push(row);
      });

      Object.keys(operadoresData).forEach((operador) => {
        const operadorName = getOperadorName(operador);
        const data = operadoresData[operador].map((row) => ({
          Evento: row['Número'],
          Apellidos: row['Apellidos'],
          Nombres: row['Nombres'],
          'Tipo de Evento': row['Tipo de Evento'],
          'Fecha de Creación': row['Fecha de Creación'],
          'Ingreso a Compras': currentDate.replace(/[-\s]/g, ''),
          Operador: row['Operador'],
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
        const excelData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        const fileName = `eventos-${operadorName}.xlsx`;

        zip.file(fileName, excelData);
      });

      zip.generateAsync({ type: 'blob' }).then((content) => {
        const zipFileName = `eventos-${currentDate.replace(/[-\s]/g, '')}.zip`;
        saveAs(content, zipFileName);
      });
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
