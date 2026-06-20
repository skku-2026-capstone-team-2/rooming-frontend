function escapeHTML(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

type PropertyMarkerVariant = "default" | "my";

const propertyMarkerColors: Record<PropertyMarkerVariant, string> = {
  default: "var(--token-color-green-700)",
  my: "var(--token-color-my)",
};

export function createPropertyMarkerHTML(
  price: string,
  variant: PropertyMarkerVariant = "default"
) {
  const safePrice = escapeHTML(price);
  const color = propertyMarkerColors[variant];

  return `
    <div
      style="
        position: relative;
        width: 42px;
        height: 50px;
        transform: translate(-50%, -100%);
        cursor: pointer;
      "
      onmouseover="
        this.querySelector('.property-marker-label').style.opacity='1';
        this.querySelector('.property-marker-body').style.transform='translateX(-50%) scale(1.1)';
      "
      onmouseout="
        this.querySelector('.property-marker-label').style.opacity='0';
        this.querySelector('.property-marker-body').style.transform='translateX(-50%) scale(1)';
      "
    >
      <!-- 가격 말풍선 -->
      <div
        class="property-marker-label"
        style="
          position: absolute;
          left: 50%;
          bottom: 56px;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.18s ease;
          white-space: nowrap;
          pointer-events: none;
          z-index: 3;
        "
      >
        <div
          style="
            background: ${color};
            color: var(--token-color-text-white);
            font-size: 12px;
            padding: 6px 12px;
            border-radius: 8px;
            font-weight: 600;
            box-shadow: 0 6px 14px color-mix(in srgb, ${color} 22%, var(--token-color-transparent));
            text-align: center;
          "
        >
          ${safePrice}
        </div>

        <div
          style="
            position: absolute;
            left: 50%;
            top: 100%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 4px solid var(--token-color-transparent);
            border-right: 4px solid var(--token-color-transparent);
            border-top: 5px solid ${color};
          "
        ></div>
      </div>

      <!-- 마커 본체 -->
      <div
        class="property-marker-body"
        style="
          position: absolute;
          left: 50%;
          top: 0;
          transform: translateX(-50%) scale(1);
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${color};
          border-radius: 999px;
          border: 2px solid var(--token-color-white);
          box-shadow: 0 8px 18px color-mix(in srgb, ${color} 28%, var(--token-color-transparent));
          transition: transform 0.18s ease;
          z-index: 2;
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--token-color-text-white)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>

      <!-- 핀 끝 -->
      <div
        style="
          position: absolute;
          left: 50%;
          top: 40px;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid var(--token-color-transparent);
          border-right: 6px solid var(--token-color-transparent);
          border-top: 8px solid ${color};
          z-index: 1;
        "
      ></div>
    </div>
  `;
}

export function createPropertyGroupMarkerHTML(
  count: number,
  variant: PropertyMarkerVariant = "default"
) {
  const safeCount = escapeHTML(String(count));
  const color = propertyMarkerColors[variant];

  return `
    <div
      style="
        position: relative;
        width: 50px;
        height: 58px;
        transform: translate(-50%, -100%);
        cursor: pointer;
      "
      onmouseover="
        this.querySelector('.property-marker-label').style.opacity='1';
        this.querySelector('.property-marker-body').style.transform='translateX(-50%) scale(1.08)';
      "
      onmouseout="
        this.querySelector('.property-marker-label').style.opacity='0';
        this.querySelector('.property-marker-body').style.transform='translateX(-50%) scale(1)';
      "
    >
      <div
        class="property-marker-label"
        style="
          position: absolute;
          left: 50%;
          bottom: 64px;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.18s ease;
          white-space: nowrap;
          pointer-events: none;
          z-index: 3;
        "
      >
        <div
          style="
            background: ${color};
            color: var(--token-color-text-white);
            font-size: 12px;
            padding: 6px 12px;
            border-radius: 8px;
            font-weight: 700;
            box-shadow: 0 6px 14px color-mix(in srgb, ${color} 22%, var(--token-color-transparent));
            text-align: center;
          "
        >
          ${safeCount}개 매물
        </div>

        <div
          style="
            position: absolute;
            left: 50%;
            top: 100%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 4px solid var(--token-color-transparent);
            border-right: 4px solid var(--token-color-transparent);
            border-top: 5px solid ${color};
          "
        ></div>
      </div>

      <div
        class="property-marker-body"
        style="
          position: absolute;
          left: 50%;
          top: 0;
          transform: translateX(-50%) scale(1);
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${color};
          border-radius: 999px;
          border: 3px solid var(--token-color-white);
          box-shadow: 0 10px 22px color-mix(in srgb, ${color} 30%, var(--token-color-transparent));
          color: var(--token-color-text-white);
          font-size: 16px;
          font-weight: 800;
          transition: transform 0.18s ease;
          z-index: 2;
        "
      >
        ${safeCount}
      </div>

      <div
        style="
          position: absolute;
          left: 50%;
          top: 48px;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 7px solid var(--token-color-transparent);
          border-right: 7px solid var(--token-color-transparent);
          border-top: 9px solid ${color};
          z-index: 1;
        "
      ></div>
    </div>
  `;
}
