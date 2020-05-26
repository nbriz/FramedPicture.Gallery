/* global  THREE, TWEEN */
class CyberSpace {
  constructor (opts) {
    this.settings = {
      controls: opts.controls || false,
      plane: opts.plane || true
    }

    this.camera = null
    this.scene = null
    this.renderer = null
    this.controls = null
    this.mouse = new THREE.Vector2()
    this.raycaster = new THREE.Raycaster()

    // this.setup = opts.setup || null
    this._setup()
    // this.draw = opts.draw || null
    this._draw()
  }

  _setup () {
    this.scene = new THREE.Scene()
    const AR = window.innerWidth / window.innerHeight
    this.camera = new THREE.PerspectiveCamera(120, AR, 0.1, 1000)

    this.renderer = new THREE.WebGLRenderer({
      // preserveDrawingBuffer: true,
      antialias: true,
      alpha: true
    })
    // this.renderer.autoClearColor = false
    this.renderer.setClearColor(0xfffff, 0)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.domElement.style.position = 'absolute'
    this.renderer.domElement.style.left = '0px'
    this.renderer.domElement.style.top = '0px'
    this.renderer.domElement.style.zIndex = '0'
    this.renderer.domElement.setAttribute('id', 'threejs')
    document.body.appendChild(this.renderer.domElement)

    if (this.settings.controls) {
      this.camera.position.z = 1
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
      if (this.settings.plane) {
        const g = new THREE.PlaneBufferGeometry(20, 20, 20, 20)
        const m = new THREE.MeshBasicMaterial({
          wireframe: true, color: 0x888888
        })
        this.plane = new THREE.Mesh(g, m)
        this.plane.rotation.x = Math.PI / 2
        this.scene.add(this.plane)
      }
    }

    if (this.setup) this.setup(this.scene)

    window.addEventListener('resize', () => this.resize(), false)
  }

  resize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  _draw () {
    window.requestAnimationFrame(() => this._draw())
    if (this.draw) this.draw()
    if (TWEEN) TWEEN.update()
    this.renderer.render(this.scene, this.camera)
  }
}

if (typeof module !== 'undefined') module.exports = CyberSpace
