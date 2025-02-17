import { useEffect, useState } from "react";
import axios from "axios";
import ProductPagination from "../components/ProductPagination";
import ProductModal from "../components/ProductModal";
import DelProductModal from "../components/DelProductModal";

const API_BASE = import.meta.env.VITE_API_BASEURL;

const PROJECT_API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: 0,
  price: 0,
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""],
};

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [modalMode, setModalMode] = useState(null);
  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const [isOpenProductModal, setIsOpenProductModal] = useState(false);
  const [isOpenDelProductModal, setIsOpenDelProductModal] = useState(false);

  // NOTE: function for getting products
  const getProductsData = async (page = 1) => {
    try {
      const response = await axios.get(
        // `${API_BASE}/api/${API_PATH}/products/all`,
        `${API_BASE}/api/${PROJECT_API_PATH}/admin/products?page=${page}`,
      );
      setProducts(response.data.products);
      setPagesInfo(response.data.pagination);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  // NOTE: open product modal
  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);

    switch (mode) {
      case "create":
        setTempProduct(defaultModalState);
        break;
      case "edit":
        setTempProduct(product);
        break;
      default:
        break;
    }
    setIsOpenProductModal(true);
  };

  // NOTE: open delete product modal
  const handleOpenDelProductModal = (product) => {
    setTempProduct(product);
    setIsOpenDelProductModal(true);
  };

  // TODO: setting pagination info
  const [pagesInfo, setPagesInfo] = useState({});

  // TODO: file upload
  return (
    <>
      {" "}
      <div className="container">
        <div className="row mt-5">
          <div className="col">
            <div className="d-flex justify-content-between">
              <h2>產品列表</h2>
              <button
                onClick={() => handleOpenProductModal("create")}
                type="button"
                className="btn btn-primary"
              >
                建立新的產品
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>產品名稱</th>
                  <th>原價</th>
                  <th>售價</th>
                  <th>是否啟用</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.title}</td>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>
                        {product.is_enabled ? (
                          <span className="text-success">啟用</span>
                        ) : (
                          <span>未啟用</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            onClick={() =>
                              handleOpenProductModal("edit", product)
                            }
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                          >
                            編輯
                          </button>
                          <button
                            onClick={() => handleOpenDelProductModal(product)}
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                          >
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">尚無產品資料</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <ProductPagination
          pagesInfo={pagesInfo}
          getProductsData={getProductsData}
        />
      </div>
      <ProductModal
        modalMode={modalMode}
        tempProduct={tempProduct}
        getProductsData={getProductsData}
        isOpen={isOpenProductModal}
        setIsOpen={setIsOpenProductModal}
      />
      <DelProductModal
        tempProduct={tempProduct}
        isOpen={isOpenDelProductModal}
        setIsOpen={setIsOpenDelProductModal}
        getProductsData={getProductsData}
      />
    </>
  );
}

export default ProductPage;
