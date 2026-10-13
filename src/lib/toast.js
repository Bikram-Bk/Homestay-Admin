
import toast from "react-hot-toast";

export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
};

// Axios error bata readable message nikalne helper
export function errorMessage(err, fallback = "Something went wrong. Please try again.") {
  return err?.response?.data?.message || fallback;
}


export function confirmToast(message, onConfirm, confirmLabel = "Yes, confirm") {
  toast(
    (t) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "220px" }}>
        <p style={{ margin: 0, fontWeight: 600, color: "#25313C", fontSize: "13px" }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1px solid #E2E7E5",
              background: "#FFFFFF",
              color: "#74808B",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "none",
              background: "#B54747",
              color: "#FFFFFF",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    ),
    { duration: 8000 }
  );
}
