import { useRef, useEffect } from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
const API_BASE = import.meta.env.VITE_API_BASEURL;

const PROJECT_API_PATH = import.meta.env.VITE_API_PATH;

function DelProductModal({ tempProduct, isOpen, setIsOpen, getProductsData }) {
  const delProductModalRef = useRef(null);

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

  useEffect(() => {
    new Modal(delProductModalRef.current, {
      backdrop: false,
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      const modalInstance = Modal.getInstance(delProductModalRef.current);
      modalInstance.show();
    }
  }, [isOpen]);

  // NOTE: open delete product modal
  const handleCloseDelProductModal = () => {
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.hide();
    setIsOpen(false);
  };
  return (
    <>
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
                onClick={handleCloseDelProductModal}
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

DelProductModal.propTypes = {
  tempProduct: PropTypes.shape({
    imageUrl: PropTypes.string,
    title: PropTypes.string,
    category: PropTypes.string,
    unit: PropTypes.string,
    origin_price: PropTypes.number,
    price: PropTypes.number,
    description: PropTypes.string,
    content: PropTypes.string,
    is_enabled: PropTypes.number,
    imagesUrl: PropTypes.arrayOf(PropTypes.string),
  }),
  getProductsData: PropTypes.func,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
};

export default DelProductModal;
