import React, { useState } from 'react';
import BarChart from './BarChart';
import Spacer from './Spacer';

const App = () => {
  const [data, setData] = useState([25, 30, 43, 45, 21, 67, 12, 127, 34]);
  const [newValue, setNewValue] = useState('');

  const handleData = () => {
    if (newValue === '') {
      alert('Enter Value.');
    } else {
      setData([...data, newValue]);
      setNewValue('');
    }
  };

  return (
    <>
      <BarChart data={data} />
      <Spacer>
        <button onClick={() => setData(data.map((d) => d + 5))}>
          Update Data
        </button>
      </Spacer>
      <Spacer>
        <button onClick={() => setData(data.filter((d) => d >= 35))}>
          Filter Data
        </button>
      </Spacer>
      <Spacer>
        <input value={newValue} onChange={(e) => setNewValue(e.target.value)} />
        <Spacer />
        <button onClick={handleData}>Add Data</button>
      </Spacer>
    </>
  );
};

export default App;
