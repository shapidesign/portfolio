import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Yehonatan Shapira - Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f1118",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            display: "flex",
            gap: 20,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="1" y="1" width="46" height="46" stroke="#e10600" strokeWidth="2" />
          </svg>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="23" stroke="#0096db" strokeWidth="2" />
          </svg>
          <svg width="48" height="42" viewBox="0 0 48 42" fill="none">
            <polygon points="24,2 2,40 46,40" stroke="#f5cf00" strokeWidth="2" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#f3f6ff",
              letterSpacing: "-0.02em",
            }}
          >
            Yehonatan Shapira
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#b4bdd3",
              maxWidth: 700,
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            Design is never my style. It&apos;s your problem and our solution.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 48,
            fontSize: 18,
            color: "#0096db",
            fontWeight: 600,
          }}
        >
          shapidesign.com
        </div>
      </div>
    ),
    { ...size }
  );
}
