"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function IceCreamCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    // Generate sparkles relative to cursor
    const newSparkles = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 - 40, // Relative to cursor position
      y: Math.random() * 80 - 40,
      delay: Math.random() * 2,
    }))
    setSparkles(newSparkles)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <>
      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Custom ice cream cursor */}
      <motion.div
        className="fixed pointer-events-none z-50"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          x: 0,
          y: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
        }}
      >
        {/* Sparkle effects around cursor */}
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full"
            style={{
              left: sparkle.x,
              top: sparkle.y,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: sparkle.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Main ice cream cursor with floating animation */}
        <motion.div
          animate={{
            y: [0, -3, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="relative"
        >
          {/* Ice cream SVG scaled down for cursor use */}
          <motion.svg width="40px" height="40px" viewBox="0 0 1024 1024" className="drop-shadow-md">
            {/* Cone - slight sway animation */}
            <motion.g
              animate={{
                rotate: [0, 1, -1, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "512px 945px" }}
            >
              <path
                d="M514.072344 945.030797c-18.83949 0-33.911082-15.280465-33.911082-33.911082V647.994497h67.822164v263.125218c0 18.83949-15.071592 33.911082-33.911082 33.911082z"
                fill="#F9AC82"
              />
              <path
                d="M506.955317 857.112835c-6.908154 0-12.560001-5.651847-12.560001-12.560001V677.510039c0-6.908154 5.651847-12.560001 12.560001-12.560001s12.560001 5.651847 12.560001 12.560001v167.043819c0 7.116003-5.442974 12.558977-12.560001 12.558977zM506.955317 919.701921c-6.908154 0-12.560001-5.651847-12.560001-12.560001v-23.026157c0-6.908154 5.651847-12.560001 12.560001-12.560001s12.560001 5.651847 12.560001 12.560001v23.026157c0 6.908154-5.442974 12.560001-12.560001 12.560001z"
                fill="#F8BC95"
              />
            </motion.g>

            {/* Main ice cream body - gentle wiggle */}
            <motion.g
              animate={{
                x: [0, 1, -1, 0],
                scaleX: [1, 1.02, 0.98, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <path
                d="M563.892556 718.119379h-99.430528c-63.426624 0-114.920889-51.494265-114.920889-114.920889V190.403763c0-63.426624 51.494265-114.920889 114.920889-114.920889h99.430528c63.426624 0 114.920889 51.494265 114.920889 114.920889v413.003599c0 63.216728-51.494265 114.712016-114.920889 114.712017z"
                fill="#EE3544"
              />
              <path
                d="M388.685299 624.96834c-6.908154 0-12.560001-5.651847-12.560001-12.560002V202.544995c0-52.750572 42.912058-95.66263 95.66263-95.66263 6.908154 0 12.560001 5.651847 12.560001 12.560001s-5.651847 12.560001-12.560001 12.560002c-38.935287 0-70.543651 31.608364-70.543651 70.543651V612.409362c0.001024 6.90713-5.650823 12.558977-12.558978 12.558978z"
                fill="#F15C5C"
              />
            </motion.g>

            {/* Blue stripe - wave animation */}
            <motion.g
              animate={{
                scaleY: [1, 1.05, 1],
                y: [0, -0.5, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.2,
              }}
            >
              <path d="M349.331243 226.198794H678.603548V340.700913H349.331243z" fill="#0083BF" />
              <path d="M376.125298 226.198794h25.118979V340.700913h-25.118979z" fill="#0095DA" />
            </motion.g>

            {/* Yellow stripe - wave animation with different timing */}
            <motion.g
              animate={{
                scaleY: [1, 1.05, 1],
                y: [0, 0.5, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.4,
              }}
            >
              <path d="M349.331243 451.853904H678.603548v114.50212H349.331243z" fill="#FFCB05" />
              <path d="M376.125298 453.110212h25.118979v113.245812h-25.118979z" fill="#FFDE2F" />
            </motion.g>

            {/* Outline */}
            <path
              d="M563.892556 62.923897h-99.430528c-70.333755 0-127.48089 57.146112-127.48089 127.48089v413.003599c0 70.333755 57.146112 127.48089 127.48089 127.48089h3.349129v180.440335c0 25.537748 20.932312 46.471083 46.471083 46.471083s46.471083-20.932312 46.471084-46.471083V730.888253h3.349129c70.333755 0 127.48089-57.146112 127.48089-127.480891V190.403763c-0.209896-70.333755-57.565905-127.479866-127.690787-127.479866zM535.423425 911.118691c0 11.722463-9.628618 21.351081-21.351081 21.35108-11.722463 0-21.351081-9.628618-21.351081-21.35108V730.678356H535.423425v180.440335z m130.830019-307.920201c0 56.51847-45.842418 102.360888-102.360888 102.360887h-99.430528c-56.51847 0-102.360888-45.842418-102.360887-102.360887V190.403763c0-56.51847 45.842418-102.360888 102.360887-102.360888h99.430528c56.51847 0 102.360888 45.842418 102.360888 102.360888v412.794727z"
              fill="#1A3F6F"
            />
          </motion.svg>
        </motion.div>
      </motion.div>
    </>
  )
}
