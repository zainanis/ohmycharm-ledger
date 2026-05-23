import { ChevronLeft, ChevronRight } from "lucide-react";

/* Sliding window of exactly 5 numbers with ellipsis — never more than 5 digits */
const getPageNumbers = (current, total) => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  let winStart = Math.max(1, current - 2);
  let winEnd   = winStart + 4;
  if (winEnd > total) { winEnd = total; winStart = Math.max(1, winEnd - 4); }

  const nums = [];
  if (winStart > 1) nums.push("...");
  for (let i = winStart; i <= winEnd; i++) nums.push(i);
  if (winEnd < total) nums.push("...");
  return nums;
};

const Paginate = ({
  items = [],
  renderItem,
  currentPage,
  setCurrentPage,
  loading,
  pageKey = "",       // pass queryKey string so grid re-mounts on every change
  total = 0,
  itemsPerPage = 12,
}) => {
  const totalPages  = Math.ceil(total / itemsPerPage);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  if (loading.loading) {
    return (
      <div
        className="grid gap-5 paginate-grid"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
      >
        {Array.from({ length: itemsPerPage }).map((_, i) => (
          <CardSkeleton key={i} delay={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* key forces re-mount → grid-enter animation plays even on cache hit */}
      <div
        key={`${pageKey}-${currentPage}`}
        className="grid-enter grid gap-5 paginate-grid"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
      >
        {items.map((item) => renderItem(item))}

        {items.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20"
            style={{ color: "var(--text-muted)" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "var(--rose-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, marginBottom: 12,
            }}>🌸</div>
            <p style={{ fontSize: 14, margin: 0 }}>Nothing here yet</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4 }}>
          <PaginateBtn
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            aria-label="Previous"
          >
            <ChevronLeft size={15} />
          </PaginateBtn>

          {pageNumbers.map((n, i) =>
            n === "..." ? (
              <span key={`dots-${i}`} style={{ padding: "0 4px", color: "var(--text-muted)", fontSize: 13 }}>
                …
              </span>
            ) : (
              <PaginateBtn
                key={n}
                active={currentPage === n}
                onClick={() => setCurrentPage(n)}
              >
                {n}
              </PaginateBtn>
            )
          )}

          <PaginateBtn
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next"
          >
            <ChevronRight size={15} />
          </PaginateBtn>
        </div>
      )}
    </div>
  );
};

const PaginateBtn = ({ children, active, disabled, onClick, ...rest }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="btn"
    style={{
      padding: "6px 11px",
      minWidth: 34,
      justifyContent: "center",
      background: active ? "var(--rose-deep)" : "var(--rose-light)",
      color:      active ? "white"            : "var(--rose-deep)",
      boxShadow:  active ? "0 2px 10px rgba(139,34,82,0.28)" : "none",
      opacity: disabled ? 0.35 : 1,
      transition: "background 0.15s, box-shadow 0.15s, opacity 0.15s",
    }}
    {...rest}
  >
    {children}
  </button>
);

const CardSkeleton = ({ delay }) => (
  <div style={{
    borderRadius: 16, background: "white",
    border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)",
    padding: "22px 20px", display: "flex", flexDirection: "column", gap: 14,
    opacity: 1 - delay * 0.06,
  }}>
    <div className={`skeleton skeleton-d${Math.min((delay % 5) + 1, 5)}`}
      style={{ height: 48, width: 48, borderRadius: 12 }} />
    <div className={`skeleton skeleton-d${Math.min((delay % 5) + 2, 5)}`}
      style={{ height: 14, width: "65%", borderRadius: 4 }} />
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div className="skeleton" style={{ height: 11, width: "80%", borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 11, width: "55%", borderRadius: 4 }} />
    </div>
    <div className="skeleton" style={{ height: 32, width: "100%", borderRadius: 8, marginTop: 4 }} />
  </div>
);

export default Paginate;
