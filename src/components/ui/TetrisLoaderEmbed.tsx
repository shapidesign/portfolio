"use client";

import { useEffect, useRef } from "react";
import { useAnimate } from "motion/react";

const C = 15;

function IShape() {
  return (
    <div style={{ display: "grid", gridTemplateRows: `repeat(4, ${C}px)`, gridTemplateColumns: `${C}px` }}>
      <div style={{ gridRow: "1 / -1", gridColumn: 1, background: "var(--color-tetris-cyan, #67E8F9)" }} />
    </div>
  );
}

function JShape() {
  return (
    <div style={{ display: "grid", gridTemplateRows: `repeat(3, ${C}px)`, gridTemplateColumns: `repeat(2, ${C}px)`, width: C * 2, height: C * 3 }}>
      <div style={{ gridArea: "1 / 2 / 4 / 3", background: "var(--color-tetris-blue, #93C5FD)" }} />
      <div style={{ gridArea: "3 / 1 / 4 / 3", background: "var(--color-tetris-blue, #93C5FD)" }} />
    </div>
  );
}

function LShape() {
  return (
    <div style={{ display: "grid", gridTemplateRows: `repeat(3, ${C}px)`, gridTemplateColumns: `repeat(2, ${C}px)` }}>
      <div style={{ gridArea: "1 / 1 / 4 / 2", background: "var(--color-tetris-orange, #FD982E)" }} />
      <div style={{ gridArea: "3 / 1 / 4 / 3", background: "var(--color-tetris-orange, #FD982E)" }} />
    </div>
  );
}

function OShape() {
  return (
    <div style={{ display: "grid", gridTemplateRows: `repeat(2, ${C}px)`, gridTemplateColumns: `repeat(2, ${C}px)` }}>
      <div style={{ gridRow: "1 / -1", gridColumn: "1 / -1", background: "var(--color-tetris-yellow, #FDE047)" }} />
    </div>
  );
}

function SShape() {
  return (
    <div style={{ display: "grid", gridTemplateRows: `repeat(2, ${C}px)`, gridTemplateColumns: `repeat(3, ${C}px)` }}>
      <div style={{ gridArea: "1 / 2 / 2 / 4", background: "var(--color-tetris-green, #36EF79)" }} />
      <div style={{ gridArea: "2 / 1 / 3 / 3", background: "var(--color-tetris-green, #36EF79)" }} />
    </div>
  );
}

function TShape() {
  return (
    <div style={{ display: "grid", gridTemplateRows: `repeat(2, ${C}px)`, gridTemplateColumns: `repeat(3, ${C}px)` }}>
      <div style={{ gridArea: "1 / 2 / 2 / 3", background: "var(--color-tetris-purple, #7D53FA)" }} />
      <div style={{ gridArea: "2 / 1 / 3 / 4", background: "var(--color-tetris-purple, #7D53FA)" }} />
    </div>
  );
}

function ZShape() {
  return (
    <div style={{ display: "grid", gridTemplateRows: `repeat(2, ${C}px)`, gridTemplateColumns: `repeat(3, ${C}px)` }}>
      <div style={{ gridArea: "1 / 1 / 2 / 3", background: "var(--color-tetris-pink, #F9A8D4)" }} />
      <div style={{ gridArea: "2 / 2 / 3 / 4", background: "var(--color-tetris-pink, #F9A8D4)" }} />
    </div>
  );
}

type Init = { opacity: number; x: number; y: number; rotate: number };

const INITIALS: Record<string, Init> = {
  ".jPiece-1": { opacity: 0, x: (1 + 3) * C, y: (2 + 2) * C, rotate: 90 },
  ".iPiece-1": { opacity: 0, x: (4 + 3) * C, y: (0 + 2) * C, rotate: 90 },
  ".sPiece-1": { opacity: 0, x: (0 + 3) * C, y: (0 + 2) * C, rotate: 0 },
  ".oPiece":   { opacity: 0, x: (0 + 4) * C, y: (0 + 2) * C, rotate: 0 },
  ".tPiece-1": { opacity: 0, x: (2 + 4) * C, y: (0 + 2) * C, rotate: 90 },
  ".zPiece":   { opacity: 0, x: (0 + 4) * C, y: (0 + 2) * C, rotate: 0 },
  ".lPiece":   { opacity: 0, x: (3 + 3) * C, y: (-1 + 2) * C, rotate: -90 },
  ".tPiece-2": { opacity: 0, x: (0 + 3) * C, y: (0 + 2) * C, rotate: 0 },
  ".jPiece-2": { opacity: 0, x: (-2 + 3) * C, y: (-1 + 2) * C, rotate: 90 },
  ".iPiece-2": { opacity: 0, x: (3 + 3) * C, y: (1 + 2) * C, rotate: 90 },
};

const STEPS: [string, Partial<Init>][] = [
  [".jPiece-1", { opacity: 1 }],
  [".jPiece-1", { x: (1 + 6) * C }],
  [".jPiece-1", { rotate: 0 }],
  [".jPiece-1", { y: (2 + 7) * C }],

  [".iPiece-1", { opacity: 1 }],
  [".iPiece-1", { x: (4 + 0) * C }],
  [".iPiece-1", { y: (0 + 11) * C }],

  [".sPiece-1", { opacity: 1 }],
  [".sPiece-1", { x: (0 + 5) * C }],
  [".sPiece-1", { y: (0 + 10) * C }],

  [".oPiece", { opacity: 1 }],
  [".oPiece", { x: (0 + 1) * C }],
  [".oPiece", { y: (0 + 9) * C }],

  [".tPiece-1", { opacity: 1 }],
  [".tPiece-1", { y: (0 + 9) * C }],

  [".zPiece", { opacity: 1 }],
  [".zPiece", { y: (0 + 8) * C }],

  [".lPiece", { opacity: 1 }],
  [".lPiece", { x: (3 + 1) * C }],
  [".lPiece", { rotate: -180 }],
  [".lPiece", { y: (-1 + 6) * C }],

  [".tPiece-2", { opacity: 1 }],
  [".tPiece-2", { x: (0 + 6) * C }],
  [".tPiece-2", { rotate: -180 }],
  [".tPiece-2", { y: (0 + 8) * C }],

  [".jPiece-2", { opacity: 1 }],
  [".jPiece-2", { x: (-2 + 0) * C }],
  [".jPiece-2", { rotate: 180 }],
  [".jPiece-2", { y: (-1 + 6) * C }],

  [".iPiece-2", { opacity: 1 }],
  [".iPiece-2", { rotate: 0 }],
  [".iPiece-2", { x: (3 + 6) * C }],
  [".iPiece-2", { y: (1 + 7) * C }],
];

const STEP_DUR = 3.5 / STEPS.length;

export function TetrisLoaderEmbed() {
  const [scope, animate] = useAnimate();
  const stoppedRef = useRef(false);

  useEffect(() => {
    stoppedRef.current = false;

    async function reset() {
      await Promise.all(
        Object.entries(INITIALS).map(([sel, vals]) =>
          animate(sel, vals, { duration: 0 })
        )
      );
    }

    async function loop() {
      while (!stoppedRef.current) {
        await reset();
        if (stoppedRef.current) break;

        for (const [sel, vals] of STEPS) {
          if (stoppedRef.current) break;
          await animate(sel, vals, { duration: STEP_DUR, ease: "easeInOut" });
        }

        if (stoppedRef.current) break;
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    loop();

    return () => {
      stoppedRef.current = true;
    };
  }, [animate]);

  const abs: React.CSSProperties = { position: "absolute", top: 0, left: 0, opacity: 0 };

  return (
    <div className="tetris-loader-wrap">
      <div ref={scope} dir="ltr">
        <div className="tetris-loader-grid">
          <div className="tetris-piece jPiece-1" style={{ ...abs, transformOrigin: "top right" }}><JShape /></div>
          <div className="tetris-piece iPiece-1" style={{ ...abs, transformOrigin: "top left" }}><IShape /></div>
          <div className="tetris-piece sPiece-1" style={abs}><SShape /></div>
          <div className="tetris-piece oPiece" style={abs}><OShape /></div>
          <div className="tetris-piece tPiece-1" style={{ ...abs, transformOrigin: "top left" }}><TShape /></div>
          <div className="tetris-piece zPiece" style={abs}><ZShape /></div>
          <div className="tetris-piece lPiece" style={{ ...abs, transformOrigin: "bottom left" }}><LShape /></div>
          <div className="tetris-piece tPiece-2" style={abs}><TShape /></div>
          <div className="tetris-piece jPiece-2" style={{ ...abs, transformOrigin: "bottom right" }}><JShape /></div>
          <div className="tetris-piece iPiece-2" style={{ ...abs, transformOrigin: "top right" }}><IShape /></div>
        </div>
        <div className="tetris-loader-base" />
      </div>
    </div>
  );
}
