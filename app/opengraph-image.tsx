/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/server";

export const runtime = "edge";

export const alt = "Freelance Marketplace";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #1a1a1a, #2a2a2a)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Freelance Marketplace
        </h1>
        <p
          style={{
            fontSize: "32px",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: "1.4",
          }}
        >
          Connect with top freelancers and clients for your next project
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
