"use client";

import { useRef, useState, type FormEvent } from "react";
import { Minus, Plus } from "lucide-react";

import type { Product, ProductSpec } from "@/data/products";

import styles from "./catalog.module.css";

export type RequestProduct = Pick<
  Product,
  "brand" | "category" | "model" | "name" | "sku"
> & {
  specs: readonly ProductSpec[];
};

type RequestPriceFormProps = {
  product: RequestProduct;
};

type RequestFields = {
  name: string;
  replyEmail: string;
  phone: string;
  deliveryCity: string;
  company: string;
  notes: string;
};

function getField(formData: FormData, key: keyof RequestFields) {
  return String(formData.get(key) ?? "").trim();
}

function requestFields(form: HTMLFormElement): RequestFields {
  const formData = new FormData(form);
  return {
    name: getField(formData, "name"),
    replyEmail: getField(formData, "replyEmail"),
    phone: getField(formData, "phone"),
    deliveryCity: getField(formData, "deliveryCity"),
    company: getField(formData, "company"),
    notes: getField(formData, "notes"),
  };
}

function buildRequestText(
  product: RequestProduct,
  quantity: number,
  fields: RequestFields,
) {
  const configuration = product.specs
    .map((spec) => `- ${spec.label}: ${spec.value}`)
    .join("\n");
  const productUrl = window.location.href.split("#")[0];

  return [
    "NEXT SOLUTIONS — PRICE REQUEST",
    "",
    `Product: ${product.name}`,
    `Brand: ${product.brand}`,
    `Model: ${product.model}`,
    `SKU: ${product.sku}`,
    `Category: ${product.category.toUpperCase()}`,
    `Quantity: ${quantity}`,
    "",
    "Configuration",
    configuration,
    "",
    "Contact details",
    `Name: ${fields.name}`,
    `Reply email: ${fields.replyEmail}`,
    `Phone / WhatsApp: ${fields.phone}`,
    `Delivery city: ${fields.deliveryCity}`,
    `Company / GST name: ${fields.company || "Not provided"}`,
    "",
    `Notes: ${fields.notes || "None"}`,
    `Product page: ${productUrl}`,
    "",
    "Please confirm the price, GST, availability, delivery charges and estimated lead time.",
  ].join("\n");
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
}

export function RequestPriceForm({ product }: RequestPriceFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = requestFields(event.currentTarget);
    const requestText = buildRequestText(product, quantity, fields);
    const subject = `Price request — ${product.brand} ${product.model} — Qty ${quantity}`;
    const mailto = `mailto:orders@solutionsind.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(requestText)}`;

    setStatus(
      "Your email app should open. Review and send the draft to complete your enquiry.",
    );
    window.location.href = mailto;
  }

  async function handleCopy() {
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;

    try {
      const requestText = buildRequestText(
        product,
        quantity,
        requestFields(form),
      );
      await copyToClipboard(requestText);
      setStatus("Request copied. Paste it into an email to orders@solutionsind.com.");
    } catch {
      setStatus(
        "Copy was blocked by the browser. Select Open email draft or copy the details manually.",
      );
    }
  }

  return (
    <aside className={styles.requestPanel} id="request-price">
      <h2>Request price</h2>
      <p className={styles.requestIntro}>
        Choose a quantity and add your details. Your email app will open with
        the request ready to send.
      </p>

      <div className={styles.requestProduct}>
        <strong>{product.name}</strong>
        <code>{product.sku}</code>
        <p>{product.specs.slice(0, 3).map((spec) => spec.value).join(" · ")}</p>
      </div>

      <form ref={formRef} className={styles.requestForm} onSubmit={handleSubmit}>
        <label className={styles.quantityField}>
          <span>Quantity</span>
          <span className={styles.quantityControl}>
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              disabled={quantity <= 1}
            >
              <Minus aria-hidden="true" size={17} />
            </button>
            <input
              type="number"
              min="1"
              max="999"
              required
              value={quantity}
              onChange={(event) => {
                const next = Number.parseInt(event.target.value, 10);
                setQuantity(Number.isFinite(next) ? Math.min(999, Math.max(1, next)) : 1);
              }}
              aria-label="Quantity"
            />
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((current) => Math.min(999, current + 1))}
              disabled={quantity >= 999}
            >
              <Plus aria-hidden="true" size={17} />
            </button>
          </span>
        </label>

        <div className={styles.requestFieldRow}>
          <label className={styles.requestField}>
            <span>Name</span>
            <input name="name" autoComplete="name" required placeholder="Your full name" />
          </label>
          <label className={styles.requestField}>
            <span>Reply email</span>
            <input
              name="replyEmail"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
            />
          </label>
        </div>

        <div className={styles.requestFieldRow}>
          <label className={styles.requestField}>
            <span>Phone / WhatsApp</span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              placeholder="Your contact number"
            />
          </label>
          <label className={styles.requestField}>
            <span>Delivery city</span>
            <input
              name="deliveryCity"
              autoComplete="address-level2"
              required
              placeholder="Enter city"
            />
          </label>
        </div>

        <label className={styles.requestField}>
          <span>Optional company / GST name</span>
          <input
            name="company"
            autoComplete="organization"
            placeholder="Company name (optional)"
          />
        </label>

        <label className={styles.requestField}>
          <span>Notes</span>
          <textarea
            name="notes"
            placeholder="Tell us anything we should know (optional)"
          />
        </label>

        <button className={styles.openEmailButton} type="submit">
          Open email draft
        </button>
        <button
          className={styles.copyRequestButton}
          type="button"
          onClick={handleCopy}
        >
          Copy request
        </button>
        <p className={styles.formStatus} role="status" aria-live="polite">
          {status}
        </p>
        <p className={styles.requestDisclaimer}>
          No payment is taken here. Review and send the draft from your email
          app.
        </p>
      </form>
    </aside>
  );
}
