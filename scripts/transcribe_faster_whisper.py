#!/usr/bin/env python3
import argparse
import json
import sys


def main() -> int:
    parser = argparse.ArgumentParser(description="Transcribe audio file with faster-whisper")
    parser.add_argument("--input", required=True, help="Audio file path")
    parser.add_argument("--model", default="base", help="Model name, e.g. tiny/base/small")
    parser.add_argument("--device", default="auto", help="auto/cpu/cuda")
    parser.add_argument("--compute-type", default="int8", help="int8/float16/float32")
    args = parser.parse_args()

    try:
      from faster_whisper import WhisperModel
    except Exception as exc:
      print(json.dumps({"error": f"faster-whisper not installed: {exc}"}))
      return 2

    try:
        model = WhisperModel(args.model, device=args.device, compute_type=args.compute_type)
        segments, _info = model.transcribe(args.input)
        text_parts = []
        segment_items = []
        for segment in segments:
            item_text = segment.text.strip()
            if not item_text:
                continue
            # confidence proxy from no_speech_prob (lower no-speech => higher confidence).
            confidence = 1.0 - float(getattr(segment, "no_speech_prob", 0.0) or 0.0)
            confidence = max(0.0, min(1.0, confidence))

            text_parts.append(item_text)
            segment_items.append({
                "start": float(getattr(segment, "start", 0.0) or 0.0),
                "end": float(getattr(segment, "end", 0.0) or 0.0),
                "text": item_text,
                "confidence": confidence,
            })
        text = " ".join([part for part in text_parts if part]).strip()
        print(json.dumps({"text": text, "segments": segment_items}))
        return 0
    except Exception as exc:
        print(json.dumps({"error": str(exc)}))
        return 1


if __name__ == "__main__":
    sys.exit(main())
