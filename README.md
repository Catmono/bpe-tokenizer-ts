# 🧠 Byte Pair Encoding (BPE) Tokenizer in TypeScript

A minimal, from-scratch implementation of a **Byte Pair Encoding (BPE)** tokenizer built with **TypeScript + Bun**.
This project demonstrates how modern LLM tokenizers are trained, encoded, and decoded at a low level using raw UTF-8 bytes.

---

## ✨ Features

* 🔤 **Byte-level base vocabulary (0–255)**
* 🔁 **BPE training loop** to learn merge rules
* 🧩 **Subword token generation** via pair merging
* 🧠 **Custom encoder** (text → token IDs)
* 🔄 **Custom decoder** (token IDs → original text)
* 📦 Fully self-contained — no tokenizer libraries used

---

## 📁 Project Structure

```
.
├── data.txt           # Training corpus
├── encode_data.txt    # (Optional) text for encoding tests
├── index.ts           # Main tokenizer implementation
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧪 How It Works

### 1️⃣ Training (Building the Vocabulary)

The tokenizer starts with a base vocabulary of **256 UTF-8 byte tokens**.

It then repeatedly:

1. Counts the most frequent adjacent token pair
2. Assigns a new token ID (256+)
3. Merges that pair throughout the dataset
4. Stores the merge rule

Training stops when:

* No pairs remain, **or**
* The most frequent pair appears only once

---

### 2️⃣ Encoding (Text → Tokens)

The `encode()` function:

1. Converts text into UTF-8 bytes
2. Applies merge rules **in learned order**
3. Replaces matching adjacent pairs with merged token IDs

Example:

```
"h" + "e" → token 256
"he" + "l" → token 300
```

---

### 3️⃣ Decoding (Tokens → Text)

The `decode()` function reverses the process:

1. Expands merged tokens back into their original pairs
2. Repeats until only base byte tokens remain
3. Converts bytes back into a UTF-8 string

This guarantees:

```
decode(encode(text)) === text
```

---

## 🚀 Running the Project

### Install dependencies

```bash
bun install
```

### Run tokenizer

```bash
bun dev
```

You’ll see:

* Original byte length
* Tokenized length after merges
* Learned merge rules
* Encoded token sequence
* Decoded output (should match original text)

---

## 🧠 Example Output

```
Original Length 1986
After Tokenization Length 898
Stopping — no frequent pairs left
```

This shows that repeated byte patterns were compressed into higher-level tokens.

---

## 📚 Concepts Demonstrated

| Concept                 | Description                         |
| ----------------------- | ----------------------------------- |
| UTF-8 Encoding          | Text represented as byte sequences  |
| Byte Pair Encoding      | Iterative subword token learning    |
| Vocabulary Growth       | Tokens expand beyond raw bytes      |
| Greedy Merging          | Highest-frequency pair merged first |
| Reversible Tokenization | Lossless encode/decode cycle        |

---

## 🎯 Why This Matters

Modern LLMs (GPT, LLaMA, etc.) don’t read raw characters — they read **tokens**.
This project shows exactly how those tokens are created and used.

You now understand:

* How token vocabularies are built
* Why token counts matter
* How multilingual text is handled
* How compression improves efficiency

---

## 🛠️ Possible Extensions

* Save merge rules to a JSON file
* Load trained tokenizer without retraining
* Add special tokens (BOS, EOS, PAD)
* Benchmark compression ratio
* Visualize merge trees

---

## 📜 License

MIT — free to use, modify, and learn from.

---

**Built for learning, inspired by real-world LLM tokenizers.**
