// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json({ name: "John Doe" });
}


// import { NextResponse } from "next/server";
// import { getAllLinks, createLink } from "@/lib/api";

// const API_URL=  'https://wild-darkness-3e71.zenze.workers.dev'

// export async function GET() {
//   try {
//     const response = await fetch(`${API_URL}/`, {
//       headers: {
//         auth: process.env.TOKEN,
//       }
//     });

//     const data = await response.json()

//     const links = data?.results || []

//     return NextResponse.json(links);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch links" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {

    
//     if (!request.body) {
//       return NextResponse.json(
//         { error: "Request body is empty" },
//         { status: 400 }
//       );
//     }
    
//     console.log(`${JSON.stringify(request, null, 2)}`);
    
//     const body = await request.json();

//     const { url } = body;
    
//     if (!url) {
//       return NextResponse.json(
//         { error: "URL is required" },
//         { status: 400 }
//       );
//     }
    
//     const response = await createLink(url);
    
//     if (!response.success) {
//       return NextResponse.json(
//         { error: response.message },
//         { status: 400 }
//       );
//     }
    
//     return NextResponse.json(response.data);
//   } catch (error) {

//     return NextResponse.json(
//       { error: "Failed to create link" },
//       { status: 500 }
//     );
//   }
// }