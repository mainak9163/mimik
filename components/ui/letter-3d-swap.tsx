"use client"

import React, { ElementType, useCallback, useMemo, useState, memo } from "react"
import {
  AnimationOptions,
  useAnimate,
  ValueAnimationTransition,
} from "motion/react"

import { cn } from "@/lib/utils"

// handy function to split text into characters with support for unicode and emojis
const splitIntoCharacters = (text: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" })
    return Array.from(segmenter.segment(text), ({ segment }) => segment)
  }
  // Fallback for browsers that don't support Intl.Segmenter
  return Array.from(text)
}

// handy function  to extract text from children
const extractTextFromChildren = (children: React.ReactNode): string => {
  if (typeof children === "string") return children

  if (React.isValidElement(children)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = children as React.ReactElement<any, any>;
    const childText = element.props.children;
    if (typeof childText === "string") return childText;
    if (React.isValidElement(childText)) {
      return extractTextFromChildren(childText);
    }
  }

  throw new Error(
    "Letter3DSwap: Children must be a string or a React element containing a string. " +
      "Complex nested structures are not supported."
  )
}

/**
 * Internal helper interface for representing a word in the text with its characters and spacing information
 */
interface WordObject {
  /**
   * Array of individual characters in the word
   */
  characters: string[]
  /**
   * Whether this word needs a space after it
   */
  needsSpace: boolean
}

interface Letter3DSwapProps {
  /**
   * The content to be displayed and animated
   */
  children: React.ReactNode

  /**
   * HTML Tag to render the component as
   */
  as?: ElementType
  /**
   * Class name for the main container element.
   */
  mainClassName?: string

  /**
   * Class name for the front face element.
   */
  frontFaceClassName?: string

  /**
   * Class name for the secondary face element.
   */
  secondFaceClassName?: string

  /**
   * Duration of stagger delay between elements in seconds.
   * @default 0.05
   */
  staggerDuration?: number

  /**
   * Direction to stagger animations from.
   * @default "first"
   */
  staggerFrom?: "first" | "last" | "center" | number | "random"

  /**
   * Animation transition configuration.
   * @default { type: "spring", damping: 25, stiffness: 300 }
   */
  transition?: ValueAnimationTransition | AnimationOptions

  /**
   * Direction of rotation
   * @default "right"
   */
  rotateDirection?: "top" | "right" | "bottom" | "left"
}

interface CharBoxProps {
  char: string
  frontFaceClassName?: string
  secondFaceClassName?: string
  rotateDirection: "top" | "right" | "bottom" | "left"
}

const CharBox = memo(({
  char,
  frontFaceClassName,
  secondFaceClassName,
  rotateDirection,
}: CharBoxProps) => {
  // Memoize the transform calculation
  const secondFaceTransform = useMemo(() => {
    switch (rotateDirection) {
      case "top":
        return `rotateX(-90deg) translateZ(0.5lh)`
      case "right":
        return `rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(-50%) rotateY(-90deg) translateX(50%)`
      case "bottom":
        return `rotateX(90deg) translateZ(0.5lh)`
      case "left":
        return `rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(50%) rotateY(-90deg) translateX(50%)`
      default:
        return `rotateY(90deg) translateZ(1ch)`
    }
  }, [rotateDirection])

  const containerStyle = useMemo(() => ({
    transform:
      rotateDirection === "top" || rotateDirection === "bottom"
        ? "translateZ(-0.5lh)"
        : "rotateY(90deg) translateX(50%) rotateY(-90deg)",
  }), [rotateDirection])

  const frontFaceStyle = useMemo(() => ({
    transform: `${
      rotateDirection === "top" || rotateDirection === "bottom"
        ? "translateZ(0.5lh)"
        : rotateDirection === "left"
          ? "rotateY(90deg) translateX(50%) rotateY(-90deg)"
          : "rotateY(-90deg) translateX(50%) rotateY(90deg)"
    }`,
  }), [rotateDirection])

  const secondFaceStyle = useMemo(() => ({
    transform: secondFaceTransform,
  }), [secondFaceTransform])

  return (
    <span
      className="letter-3d-swap-char-box-item inline-box transform-3d"
      style={containerStyle}
    >
      {/* Front face */}
      <div
        className={cn("relative backface-hidden h-[1lh]", frontFaceClassName)}
        style={frontFaceStyle}
      >
        {char}
      </div>

      {/* Second face - positioned based on rotation direction */}
      <span
        className={cn(
          "absolute backface-hidden h-[1lh] top-0 left-0",
          secondFaceClassName
        )}
        style={secondFaceStyle}
      >
        {char}
      </span>
    </span>
  )
})

CharBox.displayName = "CharBox"

const Letter3DSwap = ({
  children,
  as = "p",
  mainClassName,
  frontFaceClassName,
  secondFaceClassName,
  staggerDuration = 0.05,
  staggerFrom = "first",
  transition = { type: "spring", damping: 30, stiffness: 300 },
  rotateDirection = "right",
  ...props
}: Letter3DSwapProps) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [scope, animate] = useAnimate()

  // Memoize rotation transform calculation
  const rotationTransform = useMemo(() => {
    switch (rotateDirection) {
      case "top":
        return "rotateX(90deg)"
      case "right":
        return "rotateY(90deg)"
      case "bottom":
        return "rotateX(-90deg)"
      case "left":
        return "rotateY(90deg)"
      default:
        return "rotateY(-90deg)"
    }
  }, [rotateDirection])

  // Convert children to string for processing with error handling
  const text = useMemo(() => {
    try {
      return extractTextFromChildren(children)
    } catch (error) {
      console.error(error)
      return ""
    }
  }, [children])

  // Splitting the text into animation segments
  const characters = useMemo(() => {
    const t = text.split(" ")
    const result = t.map((word: string, i: number) => ({
      characters: splitIntoCharacters(word),
      needsSpace: i !== t.length - 1,
    }))
    return result
  }, [text])

  // Memoize total character count
  const totalChars = useMemo(() => {
    return characters.reduce(
      (sum: number, word: WordObject) => sum + word.characters.length,
      0
    )
  }, [characters])

  // Helper function to calculate stagger delay for each text segment
  const getStaggerDelay = useCallback(
    (index: number, totalChars: number) => {
      const total = totalChars
      if (staggerFrom === "first") return index * staggerDuration
      if (staggerFrom === "last") return (total - 1 - index) * staggerDuration
      if (staggerFrom === "center") {
        const center = Math.floor(total / 2)
        return Math.abs(center - index) * staggerDuration
      }
      if (staggerFrom === "random") {
        const randomIndex = Math.floor(Math.random() * total)
        return Math.abs(randomIndex - index) * staggerDuration
      }
      return Math.abs(staggerFrom - index) * staggerDuration
    },
    [staggerFrom, staggerDuration]
  )

  // Memoize delays array
  const delays = useMemo(() => {
    return Array.from({ length: totalChars }, (_, i) => {
      return getStaggerDelay(i, totalChars)
    })
  }, [totalChars, getStaggerDelay])

  // Handle hover start - trigger the rotation
  const handleHoverStart = useCallback(async () => {
    if (isAnimating || isHovering) return

    setIsHovering(true)
    setIsAnimating(true)

    // Animate each character with its specific delay
    await animate(
      ".letter-3d-swap-char-box-item",
      { transform: rotationTransform },
      {
        ...transition,
        delay: (i: number) => delays[i],
      }
    )

    // Reset all boxes
    await animate(
      ".letter-3d-swap-char-box-item",
      { transform: "rotateX(0deg) rotateY(0deg)" },
      { duration: 0 }
    )

    setIsAnimating(false)
  }, [
    isAnimating,
    isHovering,
    transition,
    rotationTransform,
    animate,
    delays,
  ])

  // Handle hover end
  const handleHoverEnd = useCallback(() => {
    setIsHovering(false)
  }, [])

  const ElementTag = as ?? "p"

  // Memoize the rendered characters
  const renderedCharacters = useMemo(() => {
    return characters.map(
      (wordObj: WordObject, wordIndex: number, array: WordObject[]) => {
        const previousCharsCount = array
          .slice(0, wordIndex)
          .reduce(
            (sum: number, word: WordObject) => sum + word.characters.length,
            0
          )

        return (
          <span key={wordIndex} className="inline-flex">
            {wordObj.characters.map((char: string, charIndex: number) => {
              const totalIndex = previousCharsCount + charIndex

              return (
                <CharBox
                  key={totalIndex}
                  char={char}
                  frontFaceClassName={frontFaceClassName}
                  secondFaceClassName={secondFaceClassName}
                  rotateDirection={rotateDirection}
                />
              )
            })}
            {wordObj.needsSpace && <span className="whitespace-pre"> </span>}
          </span>
        )
      }
    )
  }, [characters, frontFaceClassName, secondFaceClassName, rotateDirection])

  return React.createElement(
    ElementTag,
    {
      className: cn("flex flex-wrap relative", mainClassName),
      onMouseEnter: handleHoverStart,
      onMouseLeave: handleHoverEnd,
      ref: scope,
      ...props,
    },
    <>
      <span className="sr-only">{text}</span>
      {renderedCharacters}
    </>
  )
}

Letter3DSwap.displayName = "Letter3DSwap"

export default Letter3DSwap