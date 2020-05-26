let debug = false
let camera, scene, renderer
let controls
let cube
let loaded = 0
let platforms = [
  'Apple', 'Facebook', 'Google', 'LG',
  'Microsoft', 'Twitter', 'Samsung', 'OpenMoji',
  'emojidex', 'JoyPixels', 'WhatsApp'
]
let works = {}  // dictionary w/emoji materials
let frames = [] // frame objects per side of the cube (to apply emoji mat to)
let side = 0    // which side of the cube are we currently looking at
let index = 0   // which emoji are we currently looking at from platforms above

setup()
createCube()
createWorks()
draw()

document.querySelector('#enter-gallery')
  .addEventListener('click', enterGallery)
document.querySelector('img[src="images/left-arrow.svg"]')
  .addEventListener('click', () => { turnTo('prev') })
document.querySelector('img[src="images/right-arrow.svg"]')
  .addEventListener('click', () => { turnTo('next') })
document.querySelector('nav > div:nth-child(1) > b')
  .addEventListener('click', leaveGallery)

// •.¸¸¸.•*¨¨*•.¸¸¸.•*•♪¸.•*¨¨*•.¸¸¸.•^•.¸¸¸.•*¨¨*•.¸¸¸.•*•♪¸.•*¨¨*•.¸¸¸.•
// •.¸¸¸.•*¨¨*•.¸¸¸.•*•♪¸.•*¨¨*•.¸¸¸.•^•.¸¸¸.•*¨¨*•.¸¸¸.•*•♪¸.•*¨¨*•.¸¸¸.•

function turnTo (direction) {
  /*         ---     sides of the cube
     -------| 4 |---
    | 3 | 1 | 0 | 2 |
     -------| 5 |---
             ---
  */
  const prev = side
  const sideOrder = [ 0, 3, 4, 5, 0, 3, 5, 4, 3, 0, 5 ]
  if (direction === 'next') {
    index = (index === platforms.length - 1) ? 0 : index + 1
    // side = (side === 5) ? 0 : side + 1
    // side = (side === 0) ? 3 : 0
    side = sideOrder[index]
  } else if (direction === 'prev') {
    index = (index === 0) ? platforms.length - 1 : index - 1
    // side = (side === 5) ? 0 : side - 1
    // side = (side === 0) ? 3 : 0
    side = sideOrder[index]
  }

  const emoji = platforms[index]
  frames[side].material = works[emoji]
  frames[side].material.opacity = 1

  const author = document.querySelector('#author')
  const left = document.querySelector('img[src="images/left-arrow.svg"]')
  const right = document.querySelector('img[src="images/right-arrow.svg"]')
  author.style.opacity = 0
  left.style.opacity = 0
  right.style.opacity = 0
  setTimeout(() => {
    author.textContent = `by ${emoji}`
    author.style.opacity = 1
    left.style.opacity = 1
    right.style.opacity = 1
  }, 3000)

  const rots = [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: Math.PI / 2, z: 0 },
    { x: 0, y: -Math.PI / 2, z: 0 },
    { x: 0, y: -Math.PI, z: 0 },
    { x: Math.PI / 2, y: 0, z: 0 },
    { x: -Math.PI / 2, y: 0, z: 0 }
  ]
  new TWEEN.Tween(camera.rotation)
    .to(rots[side], 3000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onComplete(() => {
      frames[prev].material.opacity = 0
      frames[prev].material = works['empty']
    }).start()
  const gaps = [ 9.04, 9.589 ]
  const gidx = side % gaps.length
  new TWEEN.Tween(cube.material)
    .to({ gapSize: gaps[gidx] }, 4000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start()
}

function enterGallery () {
  const main = document.querySelector('main')
  const nav = document.querySelector('nav')
  main.style.opacity = 0
  setTimeout(() => {
    main.style.display = 'none'
    nav.style.display = 'block'
    setTimeout(() => { nav.style.opacity = 1 }, 100)
  }, 1000)
}

function leaveGallery () {
  const main = document.querySelector('main')
  const nav = document.querySelector('nav')
  nav.style.opacity = 0
  setTimeout(() => {
    nav.style.display = 'none'
    main.style.display = 'block'
    setTimeout(() => { main.style.opacity = 1 }, 100)
  }, 1000)
}

// •.¸¸¸.•*¨¨*•.¸¸¸.•*•♪¸.•*¨¨*•.¸¸¸.•^•.¸¸¸.•*¨¨*•.¸¸¸.•*•♪¸.•*¨¨*•.¸¸¸.•

function createCube () {
  const geo = new THREE.BoxBufferGeometry()
  const geometry = new THREE.WireframeGeometry(geo)
  const material = new THREE.LineDashedMaterial({
    color: 0x000000,
    scale: 2,
    dashSize: 1,
    gapSize: 9.03
  })
  cube = new THREE.LineSegments(geometry, material)
  cube.computeLineDistances()
  cube.scale.set(2.1, 2.1, 2.1)
  scene.add(cube)

}

function createWorks () {
  works['empty'] = new THREE.MeshBasicMaterial({
    transparent: true, opacity: 0
  })
  const textureLoader = new THREE.TextureLoader()
  platforms.forEach(p => {
    textureLoader.load(`../images/${p}.png`, t => {
      const ar = t.image.width / t.image.height
      works[p] = new THREE.MeshBasicMaterial({
        map: t, alphaTest: 0.9, transparent: true, opacity: 0
      })
      loaded++
      createFrames()
    })
  })
}

function createFrames () {
  if (loaded !== platforms.length) return
  const frameData = [
    { pos: [0, 0, -1], rot: [0, 0, 0] },
    { pos: [-1, 0, 0], rot: [0, Math.PI / 2, 0] },
    { pos: [1, 0, 0], rot: [0, -Math.PI / 2, 0] },
    { pos: [0, 0, 1], rot: [0, Math.PI, 0] },
    { pos: [0, 1, 0], rot: [Math.PI / 2, 0, 0] },
    { pos: [0, -1, 0], rot: [-Math.PI / 2, 0, 0] }
  ]
  frameData.forEach((f, i) => {
    const p = platforms[i]
    const wrk = works[p]
    const g = new THREE.PlaneBufferGeometry(1, 1, 1, 1)
    const m = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    const frame = new THREE.Mesh(g, m)
    frame.position.set(f.pos[0], f.pos[1], f.pos[2])
    frame.rotation.set(f.rot[0], f.rot[1], f.rot[2])
    frames.push(frame)
    scene.add(frame)
  })
  // setup first frame...
  frames[side].material = works[platforms[index]]
  frames[side].material.opacity = 1
}

// •.¸¸¸.•*¨¨*•.¸¸¸.•*•♪¸.•*¨¨*•.¸¸¸.•^•.¸¸¸.•*¨¨*•.¸¸¸.•*•♪¸.•*¨¨*•.¸¸¸.•

function setup () {
  scene = new THREE.Scene()
  const AR = window.innerWidth / window.innerHeight
  camera = new THREE.PerspectiveCamera(120, AR, 0.1, 1000)

  renderer = new THREE.WebGLRenderer({
    // preserveDrawingBuffer: true,
    antialias: true,
    alpha: true
  })
  // renderer.autoClearColor = false
  renderer.setClearColor(0xfffff, 0)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.domElement.style.position = 'absolute'
  renderer.domElement.style.left = '0px'
  renderer.domElement.style.top = '0px'
  renderer.domElement.style.zIndex = '0'
  renderer.domElement.setAttribute('id', 'threejs')
  document.body.appendChild(renderer.domElement)

  if (debug) {
    camera.position.z = 1
    controls = new THREE.OrbitControls(camera, renderer.domElement)
    const g = new THREE.PlaneBufferGeometry(20, 20, 20, 20)
    const m = new THREE.MeshBasicMaterial({
      wireframe: true, color: 0x888888
    })
    plane = new THREE.Mesh(g, m)
    plane.rotation.x = Math.PI / 2
    // scene.add(plane)
  }

  window.addEventListener('resize', () => resize(), false)
}

function resize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function draw () {
  requestAnimationFrame(() => draw())
  TWEEN.update()
  renderer.render(scene, camera)
}
