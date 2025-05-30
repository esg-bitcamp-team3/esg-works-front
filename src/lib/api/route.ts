import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    // 1. 프론트에서 받은 body 데이터를 파싱
    const data = await request.json();

    // 2. Spring 서버에 회원정보를 전달
    const response = await axios.post(
      "http://localhost:8080/api/signup",
      data, // ← body로 그대로 전달
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return new NextResponse(JSON.stringify(response.data), {
      status: 200,
    });
  } catch (error: any) {
    // 에러 응답이 있을 경우도 잡아줌
    const msg = error?.response?.data || error?.message || "server error";
    return new NextResponse(JSON.stringify({ error: msg }), {
      status: 500,
    });
  }
};
