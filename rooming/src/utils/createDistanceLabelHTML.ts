export function createDistanceLabelHTML(label: string) {
  return `
    <div
      style="
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 72px;
        height: 28px;
        border-radius: 999px;
        border: 1px solid #E8E7FF;
        background: rgba(255, 255, 255, 0.98);
        color: #5A58AA;
        font-size: 11px;
        font-weight: 700;
        line-height: 1;
        white-space: nowrap;
        box-shadow: 0 6px 16px rgba(74, 69, 48, 0.14);
        pointer-events: none;
      "
    >
      ${label}
    </div>
  `;
}