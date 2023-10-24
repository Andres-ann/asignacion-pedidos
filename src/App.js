import './App.css';

import React from 'react';
import ExcelReader from './components/ExcelReader.js';

function App() {
  return (
    <div>
      <div className="card shadow m-4">
        <div>
          <ExcelReader />
        </div>
      </div>
    </div>
  );
}

export default App;
