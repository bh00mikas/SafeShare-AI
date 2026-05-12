# SafeShare AI

SafeShare AI is a real-time browser-based privacy firewall that prevents accidental sharing of sensitive information on AI platforms such as ChatGPT, Gemini, Claude, and Perplexity.

The extension performs live sensitive-data detection, OCR-based screenshot scanning, intelligent masking/redaction, and centralized threat analytics to protect users before data is submitted to AI systems.

---

# Problem Statement

AI chat platforms have become everyday productivity tools for developers, students, researchers, and enterprises.

However, users frequently and unknowingly paste:

- API keys
- passwords
- phone numbers
- email addresses
- confidential credentials
- personal information

into AI systems.

This creates serious privacy and cybersecurity risks.

SafeShare AI solves this problem through a real-time client-side Data Loss Prevention (DLP) system that detects and masks sensitive information before submission.

---

# Features

## Real-Time Sensitive Data Detection

The extension continuously scans:
- AI chatboxes
- textareas
- input fields
- editable content regions

Sensitive information detected includes:
- emails
- passwords
- API keys
- phone numbers
- confidential keywords
- PINs

---

## Live Threat Highlighting

When sensitive information is detected:
- input field turns red
- warning glow appears
- visual threat alert activates

This creates immediate user-side risk awareness.

---

## Intelligent Masking & Redaction

Users are prompted to:
- mask detected information
- safely redact sensitive content

Example:

```text
john@gmail.com
→
****************
