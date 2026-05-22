import { ChevronLeft, ChevronRight } from "lucide-react";

const Paginate = ({
  items = [],
  renderItem,
  currentPage,
  setCurrentPage,
  loading,
  total = 0,
  itemsPerPage = 12,
}) => {
  const totalPages = Math.ceil(total / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (loading.loading) {
    return (
      <div
        className="grid gap-5 paginate-grid"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
      >
        {Array.from({ length: itemsPerPage }).map((_, i) => (
          <div
            key={i}
            className="skeleton rounded-2xl"
            style={{ height: 280, opacity: 1 - i * 0.1 }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        className="grid gap-5 paginate-grid"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
      >
        {items.map((item) => renderItem(item))}

        {items.length === 0 && (
          <div
            className="col-span-full flex flex-col items-center justify-center py-20"
            style={{ color: "var(--text-muted)" }}
          >
            <span className="text-5xl mb-3">🌸</span>
            <span className="text-sm">Nothing here yet</span>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="btn btn-outline"
            style={{ padding: "6px 12px", opacity: currentPage === 1 ? 0.4 : 1 }}
          >
            <ChevronLeft size={16} />
          </button>

          {pageNumbers.map((n) => (
            <button
              key={n}
              onClick={() => setCurrentPage(n)}
              className="btn"
              style={
                currentPage === n
                  ? { background: "var(--rose-deep)", color: "white", padding: "6px 13px" }
                  : { background: "var(--rose-light)", color: "var(--rose-deep)", padding: "6px 13px" }
              }
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-outline"
            style={{ padding: "6px 12px", opacity: currentPage === totalPages ? 0.4 : 1 }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Paginate;
