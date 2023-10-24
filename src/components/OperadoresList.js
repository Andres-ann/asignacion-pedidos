import React from 'react';
import operadoresData from '../data/operadores.json';

function OperadoresList({ uniqueOperadores, operadoresSum }) {
  return (
    <div className="card shadow p-4 mb-4">
      <h4 className="text-center">Operadores</h4>
      <div className="d-flex flex-wrap justify-content-center mt-2">
        {operadoresData.map((operadorInfo, index) => (
          <div className="card card-body shadow me-2 mb-2" key={index}>
            <div>
              {`${operadorInfo.operador} - ${operadorInfo.nombre}`}
              <span className="badge text-bg-warning ms-1">
                {operadoresSum[operadorInfo.operador] || 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OperadoresList;
