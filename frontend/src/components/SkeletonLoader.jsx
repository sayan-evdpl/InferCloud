import React from "react";

export function CardSkeleton() {
  return (
    <div className="gpu-card" style={{ border: "1px dashed var(--border-medium)" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <div className="skeleton-line" style={{ width: 60, height: 16 }} />
        <div className="skeleton-line" style={{ width: 40, height: 16 }} />
      </div>
      <div className="skeleton-line" style={{ width: "70%", height: 24, marginBottom: 8 }} />
      <div className="skeleton-line" style={{ width: "40%", height: 14, marginBottom: 24 }} />
      
      <div style={{ spaceY: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="skeleton-line" style={{ width: 80, height: 14 }} />
          <div className="skeleton-line" style={{ width: 60, height: 14 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="skeleton-line" style={{ width: 80, height: 14 }} />
          <div className="skeleton-line" style={{ width: 60, height: 14 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
          <div className="skeleton-line" style={{ width: 80, height: 14 }} />
          <div className="skeleton-line" style={{ width: 60, height: 14 }} />
        </div>
      </div>

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border-subtle)" }}>
        <div className="skeleton-line" style={{ width: 50, height: 10, marginBottom: 6 }} />
        <div className="skeleton-line" style={{ width: 100, height: 20 }} />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr>
      <td>
        <div className="skeleton-line" style={{ width: 100, height: 16 }} />
        <div className="skeleton-line" style={{ width: 60, height: 10, marginTop: 4 }} />
      </td>
      <td><div className="skeleton-line" style={{ width: 80, height: 16 }} /></td>
      <td><div className="skeleton-line" style={{ width: 60, height: 20 }} /></td>
      <td><div className="skeleton-line" style={{ width: 80, height: 14 }} /></td>
      <td><div className="skeleton-line" style={{ width: 200, height: 14 }} /></td>
    </tr>
  );
}

export function ListSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16 }}>
      <div className="skeleton-line" style={{ width: "100%", height: 48 }} />
      <div className="skeleton-line" style={{ width: "100%", height: 48 }} />
      <div className="skeleton-line" style={{ width: "100%", height: 48 }} />
    </div>
  );
}
