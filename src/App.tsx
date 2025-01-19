import { useState, useMemo, useRef } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

import { CatmullRomCurve3, TubeGeometry, MeshPhongMaterial, Vector3 } from 'three';
import { PDBLoader } from 'three/addons/loaders/PDBLoader.js';
import { Canvas, useFrame } from '@react-three/fiber';
import { CameraControls, OrbitControls, TrackballControls } from '@react-three/drei';

function Scene({ url }: { url: string }) {
  const box = useRef();

  const groupRef = useRef();
  const [geometryAtoms, setGeometryAtoms] = useState(null);
  const [geometryBonds, setGeometryBonds] = useState(null);
  const [backbone, setBackbone] = useState([]);

  useFrame(() => {
    // box.current.rotation.x += 0.01;
    // box.current.rotation.y += 0.01;
    groupRef.current.rotation.x += 0.005;
    groupRef.current.rotation.y += 0.001;
  });

  const loader = new PDBLoader();
  const offset = new Vector3();
  useMemo(
    () =>
      loader.load(url, pdb => {
        console.log(pdb);

        const geometryAtoms = pdb.geometryAtoms;
        const geometryBonds = pdb.geometryBonds;

        geometryAtoms.computeBoundingBox();
        geometryAtoms.boundingBox.getCenter(offset).negate();

        geometryAtoms.translate(offset.x, offset.y, offset.z);
        geometryBonds.translate(offset.x, offset.y, offset.z);

        setGeometryAtoms(geometryAtoms);
        setGeometryBonds(geometryBonds);
      }),
    [url],
  );

  return (
    <>
      <group ref={groupRef}>
        {geometryAtoms && (
          <points>
            <bufferGeometry attach="geometry" {...geometryAtoms} />
            <pointsMaterial size={0.4} vertexColors />
          </points>
        )}
        {geometryBonds && (
          <lineSegments>
            <bufferGeometry attach="geometry" {...geometryBonds} />
            <lineBasicMaterial color={0xffffff} />
          </lineSegments>
        )}
      </group>

      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} color="red" />
    </>
  );
}

function App() {
  const MOLECULES = {
    Caffeine: 'caffeine.pdb',
    Ethanol: 'ethanol.pdb',
    Aspirin: 'aspirin.pdb',
    Nicotine: 'nicotine.pdb',
    LSD: 'lsd.pdb',
    Cocaine: 'cocaine.pdb',
    Cholesterol: 'cholesterol.pdb',
    Lycopene: 'lycopene.pdb',
    Glucose: 'glucose.pdb',
    'Aluminium oxide': 'Al2O3.pdb',
    Cubane: 'cubane.pdb',
    Copper: 'cu.pdb',
    Fluorite: 'caf2.pdb',
    Salt: 'nacl.pdb',
    'YBCO superconductor': 'ybco.pdb',
    Buckyball: 'buckyball.pdb',
    Graphite: 'graphite.pdb',
  };

  const choice_tags = Object.keys(MOLECULES).map(name => <option value={MOLECULES[name]}> {name} </option>);
  const [selectedPdb, setSelectedPdb] = useState(MOLECULES['Caffeine']);

  return (
    <>
      <h1> pdb visualizer </h1>

      <div>
        <p>choose an existing molecule</p>
        <select name="cars" id="cars" value={selectedPdb} onChange={e => setSelectedPdb(e.target.value)}>
          {choice_tags}
        </select>
      </div>

      <div id="canvas-container" style={{ position: 'relative', width: 1000, height: 1000 }}>
        <Canvas>
          <CameraControls makeDefault />

          <Scene url={`https://threejs.org/examples/models/pdb/${selectedPdb}`} />
        </Canvas>
      </div>
    </>
  );
}

export default App;
