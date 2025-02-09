import PropTypes from "prop-types";

// TODO: setting pagination info
function ProductPagination({ pagesInfo, getProductsData }) {
  const handlePageChange = (page) => {
    getProductsData(page);
  };
  return (
    <>
      {/* pagination */}
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${!pagesInfo.has_pre && "disabled"}`}>
              <a
                onClick={() => {
                  handlePageChange(pagesInfo.current_page - 1);
                }}
                className="page-link"
              >
                上一頁
              </a>
            </li>

            {Array.from({ length: pagesInfo.total_pages }).map((_, index) => {
              return (
                <>
                  <li
                    className={`page-item ${pagesInfo.current_page === index + 1 && "active"}`}
                  >
                    <a
                      onClick={() => {
                        handlePageChange(index + 1);
                      }}
                      className="page-link"
                    >
                      {index + 1}
                    </a>
                  </li>
                </>
              );
            })}

            <li className={`page-item ${!pagesInfo.has_next && "disabled"}`}>
              <a
                onClick={() => {
                  handlePageChange(pagesInfo.current_page + 1);
                }}
                className="page-link"
              >
                下一頁
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

ProductPagination.propTypes = {
  pagesInfo: PropTypes.shape({
    total_pages: PropTypes.number,
    current_page: PropTypes.number,
    has_pre: PropTypes.bool,
    has_next: PropTypes.bool,
  }),
  getProductsData: PropTypes.func,
};
export default ProductPagination;
