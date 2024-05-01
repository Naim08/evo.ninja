import { getAuthOptions } from "@/lib/api/authOptions";
import { createOpenAIApiClient } from "@/lib/api/utils/openai";
import { createClient } from "@/lib/supabase/createServerClient";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.id || !body.prompt) {
    return NextResponse.json({}, { status: 400 });
  }

  // Make sure user is authenticated
  const cookieStore = cookies()
  const session = await getServerSession(getAuthOptions());
  const email = session?.user?.email;
  if (!session || !email) {
    return NextResponse.json({}, { status: 401 });
  }
  const supabase = createClient(cookieStore, session.supabaseAccessToken as string);
  const { data, error } = await supabase
    .from("chats")
    .select()
    .eq("id", body.id)
    .single();
  if (error) {
    return NextResponse.json({}, { status: 403 });
  }

  // If the chat has title, there's no need to ask the LLM; return an empty object
  if (data.title) {
    return NextResponse.json({}, { status: 200 });
  }

  try {
    const openAi = createOpenAIApiClient();
    const completion = await openAi.chat.completions.create({
      messages: [
        {
          role: "system",
          content:"Summarize the given prompt using max 4 words"
        },
        {
          role: "user",
          content: `${body.prompt}`,
        },
      ],
      model: "gpt-4-turbo",
    });

    if (completion.choices.length < 1) {
      return NextResponse.json({}, { status: 400 });
    }

    const choice = completion.choices[0];

    if (!choice.message) {
      return NextResponse.json({}, { status: 400 });
    }

    return NextResponse.json(
      { message: choice.message.content },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
