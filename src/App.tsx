import { useState, useRef } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

import { Canvas, useFrame } from '@react-three/fiber';

function Scene({protein}:{ protein: string }) {
  const box = useRef();

  useFrame(() => {
    box.current.rotation.x += 0.01;
    box.current.rotation.y += 0.01;
  });

  return (
    <>
      <mesh ref={box}>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhongMaterial />
      </mesh>
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} color="red" />
    </>
  );
}

function App() {
  const load_protein_options = () => {
    return ['Volvo', 'Saab', 'Mercedes'];
  };

  const protein_options = load_protein_options();
  const choice_tags = protein_options.map(name => <option value={name.toLowerCase()}> {name} </option>);

  const [selectedProtein, setSelectedProtein] = useState(protein_options[0]);

  const option = { x: 2 };

  return (
    <>
      <h1> metal protein </h1>

      <div>
        <p>choose a protein</p>
        <select name="cars" id="cars">
          {choice_tags}
        </select>
      </div>

      <div id="canvas-container">
        <Canvas>
          <Scene protein={selectedProtein} />
        </Canvas>
      </div>
    </>
  );

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
