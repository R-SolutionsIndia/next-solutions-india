"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import { MathUtils, Vector3, type PerspectiveCamera } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { useSceneStore } from "@/lib/scene-store";

import { CAMERA_PRESETS } from "./scene-data";

type CameraRigProps = {
  controlsRef: RefObject<OrbitControlsImpl | null>;
};

const POSITION_EPSILON = 0.008;
const TARGET_EPSILON = 0.006;

export function CameraRig({ controlsRef }: CameraRigProps) {
  const focus = useSceneStore((state) => state.focus);
  const reducedMotion = useSceneStore((state) => state.reducedMotion);
  const viewportWidth = useThree((state) => state.size.width);
  const mobile = viewportWidth < 861;
  const isTransitioning = useRef(true);
  const desiredPosition = useRef(new Vector3(...CAMERA_PRESETS.overview.position));
  const desiredTarget = useRef(new Vector3(...CAMERA_PRESETS.overview.target));
  const liveTarget = useRef(new Vector3(...CAMERA_PRESETS.overview.target));

  useEffect(() => {
    const preset = CAMERA_PRESETS[focus];
    desiredPosition.current.set(...preset.position);
    desiredTarget.current.set(...preset.target);
    if (mobile) {
      const distanceMultiplier = focus === "overview" ? 1.28 : 1.2;
      desiredPosition.current
        .sub(desiredTarget.current)
        .multiplyScalar(distanceMultiplier)
        .add(desiredTarget.current);
      if (focus === "overview") desiredTarget.current.x += 0.16;
    }
    isTransitioning.current = true;

  }, [focus, mobile]);

  useFrame(({ camera }, delta) => {
    const controls = controlsRef.current;
    const perspectiveCamera = camera as PerspectiveCamera;

    if (reducedMotion) {
      if (isTransitioning.current) {
        camera.position.copy(desiredPosition.current);
        liveTarget.current.copy(desiredTarget.current);
        camera.lookAt(liveTarget.current);
        perspectiveCamera.fov = mobile ? (focus === "overview" ? 52 : 46) : focus === "overview" ? 43 : 38;
        perspectiveCamera.updateProjectionMatrix();
        isTransitioning.current = false;
      }
      if (controls) {
        controls.target.copy(liveTarget.current);
        controls.enabled = focus === "overview";
        controls.update();
      }
      return;
    }

    if (!isTransitioning.current) {
      if (controls) controls.enabled = focus === "overview";
      return;
    }

    const damping = focus === "overview" ? 3.8 : 4.8;
    camera.position.x = MathUtils.damp(camera.position.x, desiredPosition.current.x, damping, delta);
    camera.position.y = MathUtils.damp(camera.position.y, desiredPosition.current.y, damping, delta);
    camera.position.z = MathUtils.damp(camera.position.z, desiredPosition.current.z, damping, delta);
    liveTarget.current.x = MathUtils.damp(liveTarget.current.x, desiredTarget.current.x, damping, delta);
    liveTarget.current.y = MathUtils.damp(liveTarget.current.y, desiredTarget.current.y, damping, delta);
    liveTarget.current.z = MathUtils.damp(liveTarget.current.z, desiredTarget.current.z, damping, delta);
    perspectiveCamera.fov = MathUtils.damp(
      perspectiveCamera.fov,
      mobile ? (focus === "overview" ? 52 : 46) : focus === "overview" ? 43 : 38,
      damping,
      delta,
    );
    perspectiveCamera.updateProjectionMatrix();

    if (controls) {
      controls.enabled = false;
      controls.target.copy(liveTarget.current);
      controls.update();
    } else {
      camera.lookAt(liveTarget.current);
    }

    const atPosition = camera.position.distanceToSquared(desiredPosition.current) < POSITION_EPSILON ** 2;
    const atTarget = liveTarget.current.distanceToSquared(desiredTarget.current) < TARGET_EPSILON ** 2;

    if (atPosition && atTarget) {
      camera.position.copy(desiredPosition.current);
      liveTarget.current.copy(desiredTarget.current);
      isTransitioning.current = false;

      if (controls) {
        controls.target.copy(liveTarget.current);
        controls.enabled = focus === "overview";
        controls.update();
      }
    }
  });

  return null;
}
