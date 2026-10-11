"""Reapply the fork-specific Gemini assistant prefill behavior after upstream checkout.

This restores the legacy per-family behavior: Gemini 3.1 Pro can keep trailing
model turns, while Claude and Gemini 3.5-3.8 Flash still strip them.
Upstream Antigravity may reject trailing model turns with HTTP 400.
"""

from pathlib import Path


TARGET = Path("src/converter/antigravity_fix.py")
UPSTREAM_BLOCK = "        # 所有模型统一禁用预填充\n        contents, removed = _strip_trailing_model_turns(contents)\n        if removed:\n            print(f\"[ANTIGRAVITY] {upstream} 不支持预填充，移除了 {removed} 条末尾 model 消息\", flush=True)\n"
RESTORED_BLOCK = "        # Fork: restore Gemini assistant prefill (upstream may still reject HTTP 400).\n        # Claude and Gemini 3.5-3.8 Flash retain upstream's no-prefill handling.\n        no_prefill = profile.family == \"claude\" or bool(\n            re.search(r\"gemini-3\\.[5-8]-flash\", model.lower())\n        )\n        if no_prefill:\n            contents, removed = _strip_trailing_model_turns(contents)\n            if removed:\n                print(f\"[ANTIGRAVITY] {upstream} 不支持预填充，移除了 {removed} 条末尾 model 消息\", flush=True)\n"
UPSTREAM_HEADER = "  * 所有模型统一禁用预填充 (请求不能以 model 消息结尾)"
RESTORED_HEADER = "  * Fork: Gemini assistant prefill restored where legacy behavior allowed it"


def main() -> None:
    before = TARGET.read_text(encoding="utf-8")
    if RESTORED_BLOCK in before:
        after = before
    elif UPSTREAM_BLOCK in before:
        after = before.replace(UPSTREAM_BLOCK, RESTORED_BLOCK, 1)
    else:
        raise SystemExit("Upstream prefill handling changed; review before syncing.")

    after = after.replace(UPSTREAM_HEADER, RESTORED_HEADER, 1)
    if after != before:
        TARGET.write_text(after, encoding="utf-8")
        print("Restored fork-specific Gemini assistant prefill")
    else:
        print("Fork-specific Gemini assistant prefill already present")


if __name__ == "__main__":
    main()
