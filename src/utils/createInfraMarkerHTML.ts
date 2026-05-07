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
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  `,
  cafe: `
    <path d="M10 2v2" />
    <path d="M14 2v2" />
    <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
    <path d="M6 2v2" />
  `,
  gym: `
    <path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z" />
    <path d="m2.5 21.5 1.4-1.4" />
    <path d="m20.1 3.9 1.4-1.4" />
    <path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z" />
    <path d="m9.6 14.4 4.8-4.8" />
  `,
  bus: `
    <path d="M8 6v6" />
    <path d="M15 6v6" />
    <path d="M2 12h19.6" />
    <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
    <circle cx="7" cy="18" r="2" />
    <path d="M9 18h5" />
    <circle cx="16" cy="18" r="2" />
  `,
  default: `
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  `,
};

const infraMarkerColors: Record<InfraMarkerType, string> = {
  cafe: "var(--token-color-infra-cafe)",
  gym: "var(--token-color-infra-gym)",
  store: "var(--token-color-infra-store)",
  bus: "var(--token-color-infra-bus)",
  default: "var(--token-color-purple-600)",
};

export function createInfraMarkerHTML({
  label,
  type,
}: {
  label: string;
  type: InfraMarkerType;
}) {
  const safeLabel = escapeHTML(label);
  const color = infraMarkerColors[type];

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
            background: ${color};
            color: var(--token-color-text-white);
            font-size: 12px;
            padding: 6px 12px;
            border-radius: 8px;
            font-weight: 600;
            box-shadow: 0 6px 14px color-mix(in srgb, ${color} 24%, var(--token-color-transparent));
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
            border-left: 4px solid var(--token-color-transparent);
            border-right: 4px solid var(--token-color-transparent);
            border-top: 5px solid ${color};
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
          background: var(--token-color-white);
          border-radius: 999px;
          border: 2px solid ${color};
          box-shadow: 0 6px 14px color-mix(in srgb, var(--foreground) 16%, var(--token-color-transparent));
          transition: transform 0.18s ease;
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="${color}"
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
