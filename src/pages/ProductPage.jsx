import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import ProductPagination from "../components/ProductPagination";

const API_BASE = import.meta.env.VITE_API_BASEURL;

const PROJECT_API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""],
};

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [modalMode, setModalMode] = useState(null);
  const [tempProduct, setTempProduct] = useState(defaultModalState);

  // NOTE: function for getting products
  const getProductsData = async (page = 1) => {
    try {
      const response = await axios.get(
        // `${API_BASE}/api/${API_PATH}/products/all`,
        `${API_BASE}/api/${PROJECT_API_PATH}/admin/products?page=${page}`,
      );
      console.log(response.data.pagination);
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
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };

  // NOTE: product modal
  const productModalRef = useRef(null);
  const delProductModalRef = useRef(null);

  useEffect(() => {
    new Modal(productModalRef.current, {
      backdrop: false,
    });

    new Modal(delProductModalRef.current, {
      backdrop: false,
    });
  }, []);

  // NOTE: close product modal
  const handleCloseProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  };

  // NOTE: open delete product modal
  const handleOpenDelProductModal = (product) => {
    setTempProduct(product);
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.show();
  };

  // NOTE: open delete product modal
  const handleCloseDelProductModal = () => {
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.hide();
  };

  const handleModalInputChange = (e) => {
    const { value, name, checked, type } = e.target;
    setTempProduct({
      ...tempProduct,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddImage = () => {
    const newImages = [...tempProduct.imagesUrl, ""];
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  const handleRemoveImage = () => {
    const newImages = [...tempProduct.imagesUrl];
    newImages.pop();
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...tempProduct.imagesUrl];
    newImages[index] = value;
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  const createProduct = async () => {
    try {
      await axios.post(`${API_BASE}/api/${PROJECT_API_PATH}/admin/product`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0,
        },
      });
    } catch (error) {
      console.log(error.response.data.message);
      alert("新增產品失敗");
    }
  };

  const updateProduct = async () => {
    try {
      await axios.put(
        `${API_BASE}/api/${PROJECT_API_PATH}/admin/product/${tempProduct.id}`,
        {
          data: {
            ...tempProduct,
            origin_price: Number(tempProduct.origin_price),
            price: Number(tempProduct.price),
            is_enabled: tempProduct.is_enabled ? 1 : 0,
          },
        },
      );
    } catch (error) {
      console.log(error.response.data.message);
      alert("新增產品失敗");
    }
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(
        `${API_BASE}/api/${PROJECT_API_PATH}/admin/product/${tempProduct.id}`,
      );
    } catch (error) {
      console.log(error.response.data.message);
      alert("新增產品失敗");
    }
  };

  const handleUpdateProduct = async () => {
    const apiCall = modalMode === "create" ? createProduct : updateProduct;
    try {
      await apiCall();
      getProductsData();
      handleCloseProductModal();
    } catch (error) {
      console.log(error.response.data.message);
      alert("更新產品失敗");
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct();
      getProductsData();
      handleCloseDelProductModal();
    } catch (error) {
      console.log(error.response.data.message);
      alert("刪除產品失敗");
    }
  };

  // TODO: setting pagination info
  const [pagesInfo, setPagesInfo] = useState({});

  // TODO: file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const imageFormData = new FormData();
    imageFormData.append("file-to-upload", file);

    try {
      const res = await axios.post(
        `${API_BASE}/api/${PROJECT_API_PATH}/admin/upload`,
        imageFormData,
      );
      const uploadImageUrl = res.data.imageUrl;
      setTempProduct({
        ...tempProduct,
        imageUrl: uploadImageUrl,
      });
    } catch (error) {
      alert(error.response.data.message);
    }
  };
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
      {/* note: product modal */}
      <div
        ref={productModalRef}
        id="productmodal"
        className="modal"
        style={{ backgroundcolor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4">
                {modalMode === "create" ? "新增產品" : "編輯產品"}
              </h5>
              <button
                onClick={handleCloseProductModal}
                type="button"
                className="btn-close"
                aria-label="close"
              ></button>
            </div>
            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="mb-5">
                    <label htmlFor="fileinput" className="form-label">
                      {" "}
                      圖片上傳{" "}
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="form-control"
                      id="fileinput"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="primary-image" className="form-label">
                      主圖
                    </label>
                    <div className="input-group">
                      <input
                        value={tempProduct.imageUrl}
                        onChange={handleModalInputChange}
                        name="imageurl"
                        type="text"
                        id="primary-image"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                      />
                    </div>
                    <img
                      src={tempProduct.imageUrl}
                      alt={tempProduct.title}
                      className="img-fluid"
                    />
                  </div>

                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {tempProduct.imagesUrl?.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label
                          htmlFor={`imagesUrl-${index + 1}`}
                          className="form-label"
                        >
                          副圖 {index + 1}
                        </label>
                        <input
                          value={image}
                          onChange={(e) => handleImageChange(e, index)}
                          id={`imagesUrl-${index + 1}`}
                          type="text"
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-fluid mb-2"
                          />
                        )}
                      </div>
                    ))}
                    <div className="btn-group w-100">
                      {tempProduct.imagesUrl.length < 5 &&
                        tempProduct.imagesUrl[
                          tempProduct.imagesUrl.length - 1
                        ] !== "" && (
                          <button
                            onClick={handleAddImage}
                            className="btn btn-outline-primary btn-sm w-100"
                          >
                            新增圖片
                          </button>
                        )}

                      {tempProduct.imagesUrl.length > 1 && (
                        <button
                          onClick={handleRemoveImage}
                          className="btn btn-outline-danger btn-sm w-100"
                        >
                          取消圖片
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      value={tempProduct.title}
                      onChange={handleModalInputChange}
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      value={tempProduct.category}
                      onChange={handleModalInputChange}
                      name="category"
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      value={tempProduct.unit}
                      onChange={handleModalInputChange}
                      name="unit"
                      id="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        value={tempProduct.origin_price}
                        onChange={handleModalInputChange}
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入原價"
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        value={tempProduct.price}
                        onChange={handleModalInputChange}
                        name="price"
                        id="price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入售價"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      value={tempProduct.description}
                      onChange={handleModalInputChange}
                      name="description"
                      id="description"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入產品描述"
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      value={tempProduct.content}
                      onChange={handleModalInputChange}
                      name="content"
                      id="content"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入說明內容"
                    ></textarea>
                  </div>

                  <div className="form-check">
                    <input
                      checked={tempProduct.is_enabled}
                      onChange={handleModalInputChange}
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="isenabled"
                    />
                    <label className="form-check-label" htmlFor="isenabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button
                onClick={handleCloseProductModal}
                type="button"
                className="btn btn-secondary"
              >
                取消
              </button>
              <button
                onClick={handleUpdateProduct}
                type="button"
                className="btn btn-primary"
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={delProductModalRef}
        className="modal fade"
        id="delproductmodal"
        tabIndex="-1"
        style={{ backgroundcolor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除產品</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="close"
              ></button>
            </div>
            <div className="modal-body">
              你是否要刪除
              <span className="text-danger fw-bold">{tempProduct.title}</span>
            </div>
            <div className="modal-footer">
              <button
                onClick={handleCloseDelProductModal}
                type="button"
                className="btn btn-secondary"
              >
                取消
              </button>
              <button
                onClick={handleDeleteProduct}
                type="button"
                className="btn btn-danger"
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPage;
