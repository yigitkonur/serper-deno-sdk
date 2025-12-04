import { SerperClient } from "../mod.ts";

const apiKey = Deno.env.get("SERPER_API_KEY");
if (!apiKey) Deno.exit(1);

const client = new SerperClient({ apiKey });

console.log("Fetching reviews...");
const result = await client.getReviews({ placeId: "ChIJy8vmGC2BhYARu919i3bko-Q" }); // Doppio Coffee
console.log(JSON.stringify(result, null, 2));
