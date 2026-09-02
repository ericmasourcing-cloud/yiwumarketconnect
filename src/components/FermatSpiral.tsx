import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const IMAGE_PATHS = [
  '/images/prod-01.png', '/images/prod-02.png', '/images/prod-03.png',
  '/images/prod-04.png', '/images/prod-05.png', '/images/prod-06.png',
  '/images/prod-07.png', '/images/prod-08.png', '/images/prod-09.png',
  '/images/prod-10.png', '/images/prod-11.png', '/images/prod-12.png',
  '/images/prod-13.png', '/images/prod-14.png', '/images/prod-15.png',
  '/images/prod-16.png', '/images/prod-17.png', '/images/prod-18.png',
  '/images/prod-19.png', '/images/prod-20.png', '/images/prod-21.png',
  '/images/prod-22.png', '/images/prod-23.png', '/images/prod-24.png',
  '/images/prod-25.png', '/images/prod-26.png', '/images/prod-27.png',
  '/images/prod-28.png', '/images/prod-29.png', '/images/prod-30.png',
  '/images/prod-31.png', '/images/prod-32.png', '/images/prod-33.png',
  '/images/prod-34.png', '/images/prod-35.png', '/images/prod-36.png',
  '/images/prod-37.png', '/images/prod-38.png', '/images/prod-39.png',
  '/images/prod-40.png', '/images/prod-41.png', '/images/prod-42.png',
  '/images/prod-43.png', '/images/prod-44.png', '/images/prod-45.png',
  '/images/prod-46.png', '/images/prod-47.png', '/images/prod-48.png',
  '/images/prod-49.png', '/images/prod-50.png', '/images/prod-51.png',
  '/images/prod-52.png', '/images/prod-53.png', '/images/prod-54.png',
  '/images/prod-55.png', '/images/prod-56.png', '/images/prod-57.png',
  '/images/prod-58.png', '/images/prod-59.png', '/images/prod-60.png',
  '/images/prod-61.png',
]

const NUM_ARMS = 10
const STEPS_PER_ARM = 40
const TOTAL = NUM_ARMS * STEPS_PER_ARM // 400 products

interface FermatSpiralProps {
  isVisible: boolean
}

export default function FermatSpiral({ isVisible }: FermatSpiralProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0xF8F6F3, 1)
    container.appendChild(renderer.domElement)

    // Canvas is decorative - let mouse events pass through to page elements
    const canvas = renderer.domElement
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.display = 'block'
    canvas.style.pointerEvents = 'none'

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0xF8F6F3, 0.015)

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 16)

    const fermatGroup = new THREE.Group()
    scene.add(fermatGroup)

    const geometry = new THREE.PlaneGeometry(1.0, 1.0)

    type ImageData = {
      basePos: THREE.Vector3
      driftSpeed: number
      phase: number
      radius: number
      currentPos: THREE.Vector3
    }

    const allImages: ImageData[] = []
    const pivots: THREE.Object3D[] = []
    const meshes: THREE.Mesh[] = []

    for (let arm = 0; arm < NUM_ARMS; arm++) {
      const armGroup = new THREE.Group()
      fermatGroup.add(armGroup)

      for (let step = 0; step < STEPS_PER_ARM; step++) {
        const angle = step * 4.5 + arm * 2 * Math.PI / NUM_ARMS
        const radius = 3.5 + step * 1.15
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const z = Math.sin(step * 0.15)

        const basePos = new THREE.Vector3(x, y, z)

        allImages.push({
          basePos,
          driftSpeed: 0.2 + Math.random() * 0.8,
          phase: Math.random() * Math.PI * 2,
          radius,
          currentPos: basePos.clone(),
        })

        const pivot = new THREE.Object3D()
        pivot.position.copy(basePos)
        armGroup.add(pivot)
        pivots.push(pivot)

        const material = new THREE.MeshBasicMaterial({
          color: 0xcccccc,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0,
          alphaTest: 0.02,
          depthWrite: false,
        })
        const mesh = new THREE.Mesh(geometry, material)
        pivot.add(mesh)
        meshes.push(mesh)
      }
    }

    // Load textures
    const loader = new THREE.TextureLoader()
    let loadedCount = 0

    IMAGE_PATHS.forEach((path, texIdx) => {
      loader.load(path, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace

        for (let i = texIdx; i < TOTAL; i += IMAGE_PATHS.length) {
          const mat = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0,
            alphaTest: 0.02,
            depthWrite: false,
          })
          meshes[i].material = mat
        }

        loadedCount++
        if (loadedCount === IMAGE_PATHS.length) {
          meshes.forEach((mesh) => {
            const mat = mesh.material as THREE.MeshBasicMaterial
            if (mat.map) {
              const startTime = performance.now() + Math.random() * 500
              const fade = () => {
                const elapsed = (performance.now() - startTime) / 1000
                const t = Math.min(elapsed / 1.0, 1)
                mat.opacity = t * t
                if (t < 1) requestAnimationFrame(fade)
              }
              requestAnimationFrame(fade)
            }
          })
        }
      })
    })

    // ===== MOUSE: use window-level mousemove for reliability =====
    const mousePos = { x: -9999, y: -9999, active: false }
    const mouseWorld = new THREE.Vector3(0, 0, 0)

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX
      mousePos.y = e.clientY
      mousePos.active = true

      // Convert screen coords to world at z=0
      const ndcX = (e.clientX / window.innerWidth) * 2 - 1
      const ndcY = -(e.clientY / window.innerHeight) * 2 + 1

      // Simple projection: from camera (0,0,16) through NDC point to z=0 plane
      // Using Three.js built-in raycaster is more reliable
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera)

      const target = new THREE.Vector3()
      raycaster.ray.at(16, target) // project distance ~16 to hit near z=0

      // Better: intersect with z=0 plane
      const origin = raycaster.ray.origin.clone()
      const dir = raycaster.ray.direction.clone()
      const t = -origin.z / dir.z
      if (t > 0 && isFinite(t)) {
        mouseWorld.copy(origin.add(dir.multiplyScalar(t)))
      }
    }

    const onMouseLeave = () => {
      mousePos.active = false
    }

    // Listen on window for maximum reliability
    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)

    // Touch
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const t = e.touches[0]
      if (!t) return
      mousePos.x = t.clientX
      mousePos.y = t.clientY
      mousePos.active = true

      const ndcX = (t.clientX / window.innerWidth) * 2 - 1
      const ndcY = -(t.clientY / window.innerHeight) * 2 + 1

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera)
      const origin = raycaster.ray.origin.clone()
      const dir = raycaster.ray.direction.clone()
      const td = -origin.z / dir.z
      if (td > 0 && isFinite(td)) {
        mouseWorld.copy(origin.add(dir.multiplyScalar(td)))
      }
    }
    const onTouchEnd = () => { mousePos.active = false }
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // Animation loop
    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      if (!isVisible) return

      const now = performance.now() / 1000
      fermatGroup.rotation.z = Math.sin(now * 0.05) * 0.1

      for (let idx = 0; idx < TOTAL; idx++) {
        const img = allImages[idx]
        const baseAngle = Math.atan2(img.basePos.y, img.basePos.x)
        const r = img.radius

        const speed = img.driftSpeed
        const driftAmount = 0.3
        const angle = baseAngle + Math.sin(now * speed + img.phase) * driftAmount
        const dist = r + Math.cos(now * speed * 0.7 + img.phase) * driftAmount * 2

        img.currentPos.x = Math.cos(angle) * dist
        img.currentPos.y = Math.sin(angle) * dist
        img.currentPos.z = img.basePos.z + Math.sin(now * speed + img.phase) * 0.5

        // MOUSE REPULSION - strong
        if (mousePos.active) {
          const dx = img.currentPos.x - mouseWorld.x
          const dy = img.currentPos.y - mouseWorld.y
          const dist2D = Math.sqrt(dx * dx + dy * dy)
          if (dist2D < 5.0 && dist2D > 0.01) {
            const force = (1 - dist2D / 5.0) * 1.0 // gentle
            img.currentPos.x += (dx / dist2D) * force
            img.currentPos.y += (dy / dist2D) * force
          }
        }

        pivots[idx].position.copy(img.currentPos)
        meshes[idx].lookAt(camera.position)
      }

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      scene.clear()
      if (canvas.parentElement) {
        canvas.parentElement.removeChild(canvas)
      }
    }
  }, [isVisible])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
