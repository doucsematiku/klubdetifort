import { NextResponse } from "next/server";
import { getAllSlots, isSlotBookable } from "@/lib/prohlidky-slots";
import { getBookedSlotIds } from "@/lib/google-calendar";

// Volné sloty se mění → bez cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const all = getAllSlots();
  const now = new Date();

  // Sloty, do jejichž startu zbývá víc než 24 hodin
  const bookable = all.filter((s) => isSlotBookable(s, now));

  if (bookable.length === 0) {
    return NextResponse.json({ slots: [], registrationOpen: false });
  }

  const rangeStart = bookable[0].startISO;
  const rangeEnd = bookable[bookable.length - 1].endISO;

  const booked = await getBookedSlotIds(rangeStart, rangeEnd);

  // vrátíme POUZE volné sloty (obsazené i pozdě zarezervované vyfiltrujeme)
  const free = bookable
    .filter((s) => !booked.has(s.id))
    .map((s) => ({
      id: s.id,
      date: s.date,
      start: s.start,
      end: s.end,
      dayLabel: s.dayLabel,
    }));

  return NextResponse.json({
    slots: free,
    registrationOpen: true,
  });
}
