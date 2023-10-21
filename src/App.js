import './App.css';

import React from 'react';
import ExcelReader from './components/ExcelReader.js';

function App() {
  return (
    <div>
      <div className="card shadow m-5">
        <div className="container">
          <div className="text-center mt-5">
            <h1>Asignación de eventos</h1>
          </div>
        </div>

        <div>
          <ExcelReader />
        </div>
      </div>
    </div>
  );
}

export default App;
