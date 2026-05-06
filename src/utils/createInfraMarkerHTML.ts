export type InfraMarkerType = "store" | "cafe" | "gym" | "bus" | "default";

function escapeHTML(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const infraIconSVG: Record<InfraMarkerType, string> = {
  store: `
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  `,
  cafe: `
    <path d="M10 2v2" />
    <path d="M14 2v2" />
    <path d="M16 8H8a4 4 0 0 0 0 8h7a5 5 0 0 0 5-5V8Z" />
    <path d="M6 8v8" />
    <path d="M6 16h10" />
  `,
  gym: `
    <path d="m6.5 6.5 11 11" />
    <path d="m21 21-1-1" />
    <path d="m3 3 1 1" />
    <path d="m18 22 4-4" />
    <path d="m2 6 4-4" />
    <path d="m3 10 7-7" />
    <path d="m14 21 7-7" />
  `,
  bus: `
    <path d="M8 6v6" />
    <path d="M16 6v6" />
    <path d="M4 12h16" />
    <path d="M6 18h.01" />
    <path d="M18 18h.01" />
    <path d="M5 20h14a2 2 0 0 0 2-2V8a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v10a2 2 0 0 0 2 2Z" />
  `,
  default: `
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  `,
};

export function createInfraMarkerHTML({
  label,
  type,
}: {
  label: string;
  type: InfraMarkerType;
}) {
  const safeLabel = escapeHTML(label);

  return `
    <div
      style="
        position: relative;
        width: 34px;
        height: 34px;
        transform: translate(-50%, -50%);
        cursor: pointer;
      "
      onmouseover="
        this.querySelector('.infra-marker-label').style.opacity='1';
        this.querySelector('.infra-marker-body').style.transform='scale(1.1)';
      "
      onmouseout="
        this.querySelector('.infra-marker-label').style.opacity='0';
        this.querySelector('.infra-marker-body').style.transform='scale(1)';
      "
    >
      <!-- 상호명 말풍선 -->
      <div
        class="infra-marker-label"
        style="
          position: absolute;
          left: 50%;
          bottom: 42px;
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
            background: #8B89DD;
            color: white;
            font-size: 12px;
            padding: 6px 12px;
            border-radius: 8px;
            font-weight: 600;
            box-shadow: 0 6px 14px rgba(139, 137, 221, 0.24);
            text-align: center;
          "
        >
          ${safeLabel}
        </div>

        <div
          style="
            position: absolute;
            left: 50%;
            top: 100%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 5px solid #8B89DD;
          "
        ></div>
      </div>

      <!-- 마커 본체 -->
      <div
        class="infra-marker-body"
        style="
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 999px;
          border: 2px solid #8B89DD;
          box-shadow: 0 6px 14px rgba(74, 69, 48, 0.16);
          transition: transform 0.18s ease;
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8B89DD"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          ${infraIconSVG[type]}
        </svg>
      </div>
    </div>
  `;
}