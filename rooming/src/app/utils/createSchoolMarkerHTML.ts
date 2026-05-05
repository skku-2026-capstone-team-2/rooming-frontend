function escapeHTML(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function createSchoolMarkerHTML(label = "성균관대 정문") {
  const safeLabel = escapeHTML(label);

  return `
    <div
      style="
        position: relative;
        width: 48px;
        height: 84px;
        transform: translate(-50%, -50%);
      "
    >
      <!-- 마커 본체 -->
      <div
        style="
          position: absolute;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #BDB96A;
          border-radius: 999px;
          border: 3px solid white;
          box-shadow: 0 8px 18px rgba(74, 69, 48, 0.24);
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="27"
          height="27"
          viewBox="0 0 24 24"
          fill="white"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>

      <!-- 항상 표시되는 라벨 -->
      <div
        style="
          position: absolute;
          left: 50%;
          top: 58px;
          transform: translateX(-50%);
          white-space: nowrap;
        "
      >
        <div
          style="
            background: #BDB96A;
            color: white;
            font-size: 12px;
            padding: 5px 12px;
            border-radius: 999px;
            font-weight: 700;
            box-shadow: 0 6px 14px rgba(189, 185, 106, 0.24);
            text-align: center;
          "
        >
          ${safeLabel}
        </div>
      </div>
    </div>
  `;
}