import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 로컬 네트워크 IP에서 개발 서버 접근 허용 (갤럭시 등 실기기 테스트용)
  allowedDevOrigins: ["192.168.0.228"],
};

export default nextConfig;
