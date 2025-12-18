import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { title, description, status, userId } = await req.json();

        if (!title || !userId) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from("todos")
            .insert({
                title,
                description,
                status,
                user_id: userId,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                { message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { todo: data },
            { status: 201 }
        );
    } catch (err) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json(
            { message: "User ID required" },
            { status: 400 }
        );
    }

    const { data, error } = await supabaseAdmin
        .from("todos")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({ todos: data });
}

export async function PUT(req: Request) {
    try {
      const { id, title, description, status } = await req.json();
  
      if (!id) {
        return NextResponse.json(
          { message: "Todo ID is required" },
          { status: 400 }
        );
      }
  
      const { data, error } = await supabaseAdmin
        .from("todos")
        .update({
          title,
          description,
          status,
        })
        .eq("id", id)
        .select()
        .single();
  
      if (error) {
        return NextResponse.json(
          { message: error.message },
          { status: 500 }
        );
      }
  
      return NextResponse.json({ todo: data });
    } catch {
      return NextResponse.json(
        { message: "Server error" },
        { status: 500 }
      );
    }
  }
  

export async function DELETE(req: Request) {
    const { id } = await req.json();

    await supabaseAdmin.from("todos").delete().eq("id", id);

    return NextResponse.json({ success: true });
}
