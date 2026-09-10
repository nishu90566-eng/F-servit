"use client";

import { useRef, useState } from "react";
import { Mic } from "lucide-react";
import { copy } from "@/lib/i18n";
import { useServit } from "@/lib/store";
import { Button } from "@/components/ui/button";

const SAMPLE = "Kitchen tap is leaking since morning, water on the floor.";

type SpeechRec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
};

export function VoiceMic({ onTranscript }: { onTranscript: (text: string) => void }) {
  const locale = useServit((s) => s.locale);
  const t = copy[locale];
  const [listening, setListening] = useState(false);
  const [live, setLive] = useState("");
  const recRef = useRef<SpeechRec | null>(null);

  const start = () => {
    const Ctor = (window as unknown as {
      SpeechRecognition?: new () => SpeechRec;
      webkitSpeechRecognition?: new () => SpeechRec;
    }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: new () => SpeechRec }).webkitSpeechRecognition;
    if (!Ctor) {
      onTranscript(SAMPLE);
      setLive(SAMPLE);
      return;
    }
    const rec = new Ctor();
    rec.lang = locale === "hi" ? "hi-IN" : "en-IN";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (ev) => {
      const text = Array.from(ev.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setLive(text);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  const stop = () => {
    recRef.current?.stop();
    setListening(false);
    onTranscript(live || SAMPLE);
  };

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={listening ? stop : start}
        className={`mx-auto grid h-[84px] w-[84px] place-items-center rounded-full text-white ${
          listening ? "animate-pulse bg-red-600" : "bg-urgency"
        }`}
        aria-label={t.speak}
      >
        <Mic className="h-9 w-9" />
      </button>
      <p className="mt-3 font-semibold">{listening ? "Listening…" : t.speak}</p>
      {live ? <p className="mt-2 rounded-xl bg-slate-100 p-3 text-left text-sm italic">“{live}”</p> : null}
      <Button className="mt-3 w-full" variant="outline" onClick={() => { setLive(SAMPLE); onTranscript(SAMPLE); }}>
        Use sample transcript
      </Button>
    </div>
  );
}
