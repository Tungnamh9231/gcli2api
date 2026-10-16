"""Regression tests for the Allow Prefill setting."""
import asyncio
import copy

import pytest

import config
from src.converter.antigravity_fix import normalize_antigravity_request
from src.converter.gemini_fix import normalize_gemini_request


def set_allow_prefill(monkeypatch, value):
    async def getter():
        return value

    monkeypatch.setattr(config, "get_allow_prefill", getter)


@pytest.mark.parametrize("enabled", [False, True])
def test_geminicli_prefill_toggle(monkeypatch, enabled):
    set_allow_prefill(monkeypatch, enabled)

    async def thoughts():
        return True

    monkeypatch.setattr(config, "get_return_thoughts_to_frontend", thoughts)
    request = {
        "model": "gemini-3-flash-preview",
        "contents": [
            {"role": "user", "parts": [{"text": "Continue:"}]},
            {"role": "model", "parts": [{"text": "Hello "}]},
        ],
    }
    original = copy.deepcopy(request)

    result = asyncio.run(normalize_gemini_request(request))
    assert request == original
    if enabled:
        assert result["contents"][-1] == request["contents"][-1]
    else:
        assert result["contents"] == [request["contents"][0]]


@pytest.mark.parametrize("enabled", [False, True])
def test_antigravity_prefill_toggle(monkeypatch, enabled):
    set_allow_prefill(monkeypatch, enabled)
    request = {
        "model": "gemini-3-flash",
        "contents": [
            {"role": "user", "parts": [{"text": "Continue:"}]},
            {"role": "model", "parts": [{"text": "Hello "}]},
        ],
    }
    original = copy.deepcopy(request)

    result = asyncio.run(normalize_antigravity_request(request))
    assert request == original
    if enabled:
        assert result["contents"][-1] == request["contents"][-1]
    else:
        assert result["contents"] == [request["contents"][0]]


def test_geminicli_existing_prefill_support_unchanged(monkeypatch):
    set_allow_prefill(monkeypatch, False)

    async def thoughts():
        return True

    monkeypatch.setattr(config, "get_return_thoughts_to_frontend", thoughts)
    result = asyncio.run(normalize_gemini_request({
        "model": "gemini-2.5-pro",
        "contents": [
            {"role": "user", "parts": [{"text": "Continue:"}]},
            {"role": "model", "parts": [{"text": "Prefix"}]},
        ],
    }))
    assert result["contents"][-1]["role"] == "model"


@pytest.mark.parametrize(("env_value", "expected"), [
    ("true", True),
    ("1", True),
    ("false", False),
    ("0", False),
])
def test_allow_prefill_environment_override(monkeypatch, env_value, expected):
    monkeypatch.setenv("ALLOW_PREFILL", env_value)
    assert asyncio.run(config.get_allow_prefill()) is expected


def test_allow_prefill_defaults_to_disabled(monkeypatch):
    monkeypatch.delenv("ALLOW_PREFILL", raising=False)
    monkeypatch.setattr(config, "_config_initialized", True)
    monkeypatch.setattr(config, "_config_cache", {})
    assert asyncio.run(config.get_allow_prefill()) is False
