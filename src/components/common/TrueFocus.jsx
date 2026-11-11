'use client';

import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import './TrueFocus.css';

const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const SMOOTH_EASE = [0.65, 0, 0.35, 1];
const SMOOTH_CSS = 'cubic-bezier(0.65, 0, 0.35, 1)';
const SPRING_CSS = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function TrueFocus({
  sentence = 'True Focus',
  separator = ' ',
  manualMode = false,
  focusStyle = 'brackets',
  order = 'sequential',
  easing = 'smooth',
  blurAmount = 3,
  focusScale = 1.02,
  borderColor = '#b49aff',
  highlightColor,
  glowColor = 'rgba(180, 154, 255, 0.45)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1.2,
  cornerSize = 14,
  borderWidth = 2.5,
  frameGap = 8,
  unfocusedOpacity = 0.85,
  className = '',
  wordClassName = '',
  fontSize,
  ignoreReducedMotion = true
}) {
  const words = React.useMemo(() => {
    return sentence.split(separator).filter(word => word.trim() !== '');
  }, [sentence, separator]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [focusRect, setFocusRect] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const wordRectsCache = useRef({});

  const prefersReduced = useReducedMotion();
  const reduceMotion = prefersReduced && !ignoreReducedMotion;
  const duration = reduceMotion ? 0 : animationDuration;
  const activeIndex = words.length ? currentIndex % words.length : -1;

  const spring = easing === 'spring' && !reduceMotion;
  const transition = spring
    ? { type: 'spring', visualDuration: duration, bounce: 0.38 }
    : { duration, ease: SMOOTH_EASE };

  // Calculate accurate relative rect of a word within the container
  const measureWord = useCallback((index) => {
    const container = containerRef.current;
    const word = wordRefs.current[index];
    if (!container || !word) return null;

    const cRect = container.getBoundingClientRect();
    const wRect = word.getBoundingClientRect();

    // Word dimensions (unscaled layout box)
    const width = word.offsetWidth || wRect.width;
    const height = word.offsetHeight || wRect.height;

    // Relative offset within container
    const x = wRect.left - cRect.left + container.scrollLeft;
    const y = wRect.top - cRect.top + container.scrollTop;

    const rect = { x, y, width, height };
    wordRectsCache.current[index] = rect;
    return rect;
  }, []);

  // Update focus rect immediately when activeIndex changes
  const updateFocus = useCallback((index) => {
    const rect = measureWord(index);
    if (rect) {
      setFocusRect(rect);
    }
  }, [measureWord]);

  // Measure all words on mount and resize
  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || words.length === 0) return;

    const measureAll = () => {
      words.forEach((_, idx) => measureWord(idx));
      const currentRect = measureWord(activeIndex);
      if (currentRect) setFocusRect(currentRect);
    };

    // Immediate layout pass
    measureAll();

    // Check after fonts and rendering settle
    const rafId = requestAnimationFrame(measureAll);

    if (typeof ResizeObserver === 'undefined') return () => cancelAnimationFrame(rafId);

    const observer = new ResizeObserver(() => {
      measureAll();
    });

    observer.observe(container);
    wordRefs.current.forEach(node => {
      if (node) observer.observe(node);
    });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [activeIndex, words, measureWord]);

  // Auto-cycle interval (pauses when user hovers over container)
  useEffect(() => {
    if (manualMode || isHovered || words.length < 2) return;

    const interval = setInterval(() => {
      const roll = Math.random();
      setCurrentIndex(prev => {
        const current = prev % words.length;
        if (order !== 'random') return (current + 1) % words.length;
        const next = Math.floor(roll * (words.length - 1));
        return next >= current ? next + 1 : next;
      });
    }, (animationDuration + pauseBetweenAnimations) * 1000);

    return () => clearInterval(interval);
  }, [manualMode, isHovered, animationDuration, pauseBetweenAnimations, words.length, order]);

  // Derived frame geometry based on focusScale and frameGap
  const frame = focusRect && {
    x: focusRect.x - (focusRect.width * (focusScale - 1)) / 2,
    y: focusRect.y - (focusRect.height * (focusScale - 1)) / 2,
    width: focusRect.width * focusScale,
    height: focusRect.height * focusScale
  };

  const corners = frame && {
    'top-left': {
      x: frame.x - frameGap,
      y: frame.y - frameGap
    },
    'top-right': {
      x: frame.x + frame.width + frameGap - cornerSize,
      y: frame.y - frameGap
    },
    'bottom-left': {
      x: frame.x - frameGap,
      y: frame.y + frame.height + frameGap - cornerSize
    },
    'bottom-right': {
      x: frame.x + frame.width + frameGap - cornerSize,
      y: frame.y + frame.height + frameGap - cornerSize
    }
  };

  const shapes = frame && {
    box: {
      x: frame.x - frameGap,
      y: frame.y - frameGap,
      width: frame.width + frameGap * 2,
      height: frame.height + frameGap * 2
    },
    underline: {
      x: frame.x,
      y: frame.y + frame.height + frameGap * 0.4,
      width: frame.width,
      height: borderWidth
    },
    highlight: {
      x: frame.x - frameGap * 0.8,
      y: frame.y - frameGap * 0.4,
      width: frame.width + frameGap * 1.6,
      height: frame.height + frameGap * 0.8
    }
  };

  const frameStyle = {
    '--border-color': borderColor,
    '--highlight-color': highlightColor || `color-mix(in srgb, ${borderColor} 25%, transparent)`,
    '--glow-color': glowColor,
    '--corner-size': `${cornerSize}px`,
    '--border-width': `${borderWidth}px`,
    ...(fontSize ? { '--focus-font-size': fontSize } : {})
  };

  const handleWordSelect = (index) => {
    setCurrentIndex(index);
    updateFocus(index);
  };

  return (
    <div
      className={`focus-container ${className}`}
      ref={containerRef}
      style={frameStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Highlight style element */}
      {focusStyle === 'highlight' && shapes && (
        <motion.span
          className="focus-highlight"
          aria-hidden="true"
          initial={false}
          animate={{
            x: shapes.highlight.x,
            y: shapes.highlight.y,
            width: shapes.highlight.width,
            height: shapes.highlight.height,
            opacity: 1
          }}
          transition={transition}
        />
      )}

      {/* Render each word */}
      {words.map((word, index) => {
        const isActive = index === activeIndex;
        return (
          <span
            key={`${word}-${index}`}
            ref={el => {
              wordRefs.current[index] = el;
            }}
            className={`focus-word ${wordClassName} ${isActive ? 'active' : ''}`}
            style={{
              filter: `blur(${isActive ? 0 : blurAmount}px)`,
              opacity: isActive ? 1 : unfocusedOpacity,
              transform: isActive && focusScale !== 1 ? `scale(${focusScale})` : 'scale(1)',
              transition: `filter ${duration}s ease, opacity ${duration}s ease, transform ${duration}s ${spring ? SPRING_CSS : SMOOTH_CSS}`
            }}
            onMouseEnter={() => handleWordSelect(index)}
            onClick={() => handleWordSelect(index)}
          >
            {word}
          </span>
        );
      })}

      {/* Focus Indicator (Brackets, Box, or Underline) */}
      {shapes && corners && focusStyle !== 'highlight' && (
        <div className="focus-frame" aria-hidden="true">
          {focusStyle === 'box' && (
            <motion.span
              className="focus-box"
              initial={false}
              animate={{
                x: shapes.box.x,
                y: shapes.box.y,
                width: shapes.box.width,
                height: shapes.box.height,
                opacity: 1
              }}
              transition={transition}
            />
          )}

          {focusStyle === 'underline' && (
            <motion.span
              className="focus-underline"
              initial={false}
              animate={{
                x: shapes.underline.x,
                y: shapes.underline.y,
                width: shapes.underline.width,
                height: shapes.underline.height,
                opacity: 1
              }}
              transition={transition}
            />
          )}

          {focusStyle === 'brackets' &&
            CORNERS.map(corner => (
              <motion.span
                key={corner}
                className={`corner ${corner}`}
                initial={false}
                animate={{
                  x: corners[corner].x,
                  y: corners[corner].y,
                  opacity: 1
                }}
                transition={transition}
              />
            ))}
        </div>
      )}
    </div>
  );
}
