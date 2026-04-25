import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "http://localhost:8765";

// Stress test ramps well above the supported 100 VUs to find degradation.
// Thresholds are intentionally relaxed — this test is meant to exceed them.
export const options = {
  stages: [
    { duration: "30s", target: 200 },
    { duration: "1m", target: 200 },
    { duration: "30s", target: 500 },
    { duration: "1m", target: 500 },
    { duration: "30s", target: 1000 },
    { duration: "1m", target: 1000 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"],
    http_req_failed: ["rate<0.05"],
  },
};

export default () => {
  const urls = [
    ["GET", `${BASE_URL}/products`, null],
    ["GET", `${BASE_URL}/carts`, null],
    [
      "POST",
      `${BASE_URL}/auth/login`,
      JSON.stringify({ username: "johnd", password: "m38rmF$" }),
      { headers: { "Content-Type": "application/json" } },
    ],
  ];

  const responses = http.batch(urls);
  for (let i = 0; i < responses.length; i++) {
    check(
      responses[i],
      {
        "status was 200": (res) => res.status === 200,
      },
      { myTag: "status200less2000" }
    );
  }
  sleep(1);
};
