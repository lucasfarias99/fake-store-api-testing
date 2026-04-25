import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "http://localhost:8765";

// 100 VUs sustained — empirically confirmed supported on local Node+Mongo
// (capacity test: p(95)=4.9ms, 0% errors, 155 RPS).
export const options = {
  stages: [
    { duration: "10s", target: 100 },
    { duration: "280s", target: 100 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.01"],
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
      { myTag: "status200less500" }
    );
  }
  sleep(1);
};
