import { connection } from "next/server";
import { fetchLiveBoard } from "@/lib/signals/providers/live";

// Real-time board for client polling (Alpaca IEX + delayed index levels).
// Provider calls are cached in memory for 10 s (prices) and 60 s (index levels).
export async function GET() {
  await connection();
  const board = await fetchLiveBoard();
  return Response.json(board, { headers: { "Cache-Control": "public, max-age=5" } });
}
