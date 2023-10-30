import React from 'react';
import operadoresData from '../data/operadores.json';

function OperadoresList({ operadoresSum }) {
  return (
    <div className="card shadow p-4 mb-4">
      <h4 className="text-center">Operadores</h4>
      <div className="d-flex flex-wrap mt-2">
        {operadoresData.map((operadorInfo, index) => (
          <div
            className="card btn btn-sm shadow p-3 me-2 mb-2 border-0 text-muted"
            key={index}
          >
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
