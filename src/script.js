import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "dat.gui";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

/**
 * debug
 */

const gui = new dat.GUI({ width: 400 });
gui.hide();
const parameters = {
  color: 0xff0000,
  lines: Math.random() * 100,
  Change: () => {
    location.reload();
  },
  vertex: 3,
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 });
  },
};

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */

const geometry = new THREE.Geometry();

for (let i = 0; i < parameters.lines; i++) {
  for (let j = 0; j < parameters.vertex; j++) {
    geometry.vertices.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      )
    );
  }
  const verticesIndex = i * 3;
  geometry.faces.push(
    new THREE.Face3(verticesIndex, verticesIndex + 1, verticesIndex + 2)
  );
}
const material = new THREE.MeshBasicMaterial({
  color: parameters.color,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

//Debug
gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
gui.add(mesh.position, "x", -3, 3, 0.01);
gui.add(mesh.position, "z", -3, 3, 0.01);
gui.add(parameters, "lines", 0, 100, 1).onChange(() => {
  parameters.lines.set(parameters.lines);
});
gui.add(parameters, "vertex", 0, 10, 1);
gui.add(parameters, "Change");

gui.add(material, "wireframe");
gui.addColor(parameters, "color").onChange(() => {
  material.color.set(parameters.color);
});
gui.add(parameters, "spin");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
