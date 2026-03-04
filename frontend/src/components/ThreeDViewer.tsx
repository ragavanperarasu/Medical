import React, { Suspense, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { ArrowLeft } from "react-feather";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

/* ===============================
   MODEL COMPONENT
================================ */
const Model = ({ url }) => {
  const { scene } = useGLTF(url);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    scene.position.sub(center);
    scene.scale.setScalar(2 / size);
  }, [scene]);

  return <primitive object={scene} />;
};

useGLTF.preload("/models/game.glb");

/* ===============================
   MAIN COMPONENT
================================ */
const ThreeDViewer = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("cube");

  return (
    <Box sx={{ width: "100vw", height: "100vh", bgcolor: "#111", position: "relative" }}>
      
      {/* Buttons */}
      <Box sx={{ position: "absolute", top: 20, left: 20, zIndex: 100 }}>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowLeft size={16} style={{ marginRight: 5 }} />
          Back
        </Button>

        <Button variant="outlined" onClick={() => setMode("cube")} sx={{ mr: 1 }}>
          Cube
        </Button>

        <Button variant="outlined" onClick={() => setMode("online")} sx={{ mr: 1 }}>
          Sketchfab
        </Button>

        <Button variant="outlined" onClick={() => setMode("local")}>
          Local
        </Button>
      </Box>

      {/* SHOW SKETCHFAB (OUTSIDE CANVAS) */}
      {mode === "online" && (
        <iframe
          title="Sketchfab Model"
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          src="https://sketchfab.com/models/57aef8cdf42046a39f1ad9b428756213/embed"
          style={{ border: "none" }}
        />
      )}

      {/* SHOW CANVAS ONLY IF NOT ONLINE */}
      {mode !== "online" && (
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} />

          <Suspense fallback={null}>
            {mode === "cube" && (
              <mesh>
                <boxGeometry />
                <meshStandardMaterial color="red" />
              </mesh>
            )}

            {mode === "local" && (
              <Model url="/models/game.glb" />
            )}
          </Suspense>

          <OrbitControls />
        </Canvas>
      )}
    </Box>
  );
};

export default ThreeDViewer;