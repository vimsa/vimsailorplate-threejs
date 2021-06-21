import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ShaderMaterial } from "three"

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

export default class Application {
    constructor(_options) {

        this.time = 0
        this.container = _options.dom
        this.scene = new THREE.Scene()

        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight

        this.camera = new THREE.PerspectiveCamera(
            70,
            this.width / this.height,
            0.01,
            10
        )

        this.camera.position.z = 1

        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(this.width, this.height)
        this.container.appendChild(this.renderer.domElement)

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        this.resize()
        this.setupResize()
        this.addObjects()
        this.render()
    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this))
    }

    resize() {
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight

        this.renderer.setSize(this.width, this.height)
        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix()
    }

    addObjects() {
        this.geometry = new THREE.PlaneBufferGeometry(4, 4, 50, 50)
        this.material = new ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            side: THREE.DoubleSide,
            wireframe: true,
            fragmentShader,
            vertexShader
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    render() {
        this.time += 0.05
        this.mesh.rotation.x = this.time / 2000
        this.mesh.rotation.y = this.time / 1000

        this.material.uniforms.time.value = this.time

        this.renderer.render(this.scene, this.camera)

        window.requestAnimationFrame(this.render.bind(this))
    }
}