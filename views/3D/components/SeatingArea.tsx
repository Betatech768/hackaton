import { useMemo, useRef, useLayoutEffect, useState } from "react";

import { Dimensions, SeatingAreaProps, StageData } from "@/types/speaker";

import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";

type Props = {
  seating_area: SeatingAreaProps;
  dimensions?: Dimensions;
  stage_area?: StageData;
};

export function SeatingBlock({ seating_area, dimensions, stage_area }: Props) {
  if (!dimensions || !stage_area) return null;

  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const {
    length_m,
    width_m,
    seating_capacity,
    floor_to_stage_distance_m = 2,
  } = seating_area;

  const greaterNumber = seating_capacity > 350;

  const { rows, columns, colSpacing, rowSpacing, adjustedCapacity } =
    useMemo(() => {
      const aspectRatio = width_m / length_m;
      const columns = Math.max(
        1,
        Math.floor(Math.sqrt(seating_capacity * aspectRatio)),
      );
      const totalRows = Math.ceil(seating_capacity / columns);
      const activeRows = Math.max(0, totalRows - (greaterNumber ? 5 : 3));
      const adjustedCapacity = activeRows * columns;

      return {
        rows: activeRows,
        columns,
        colSpacing: width_m / columns,
        rowSpacing: length_m / totalRows,
        adjustedCapacity,
      };
    }, [length_m, width_m, seating_capacity, greaterNumber]);

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    let count = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (count < adjustedCapacity) {
          dummy.position.set(
            (j - (columns - 1) / 2) * colSpacing,
            0,
            i * rowSpacing + floor_to_stage_distance_m,
          );
          dummy.updateMatrix();
          meshRef.current.setMatrixAt(count++, dummy.matrix);
        }
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.count = count;
  }, [
    rows,
    columns,
    colSpacing,
    rowSpacing,
    floor_to_stage_distance_m,
    adjustedCapacity,
  ]);

  // HOVER LOGIC
  const [hovered, setHovered] = useState(false);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  return (
    <group
      position={[
        dimensions.width_m / 2,
        0,
        (dimensions.length_m - stage_area.length_m) *
          (greaterNumber ? 0.4 : 0.35),
      ]}
    >
      <instancedMesh ref={meshRef} args={[null!, null!, adjustedCapacity]}>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <meshStandardMaterial color="#333333" roughness={0.8} />
      </instancedMesh>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[
          0,
          -0.01,
          (rows * rowSpacing) / 2 + floor_to_stage_distance_m - rowSpacing / 2,
        ]}
        // ADDED: Missing pointer out handler
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[width_m, rows * rowSpacing]} />
        <meshStandardMaterial color="#222222" transparent opacity={0.3} />
      </mesh>

      {hovered && (
        <Html
          // Position it slightly above the center of the seating block
          position={[0, 1.2, (rows * rowSpacing) / 2]}
          center
          distanceFactor={15}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: "rgba(0, 0, 0, 0.85)",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              whiteSpace: "nowrap",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.1)",
              userSelect: "none",
            }}
          >
            Seating Area: ({adjustedCapacity} Seats Displayed of{" "}
            {seating_capacity} seats)
          </div>
        </Html>
      )}
    </group>
  );
}
