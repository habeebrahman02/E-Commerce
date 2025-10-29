import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/SummerSaleSection.css";

const SummerSaleSection = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "Beach Wear", img: "/images/redpalm-treePattern-resort-shirt.jpeg" },
    { name: "Tshirts", img: "/images/white-loose-fit-H&M-tshirt.jpeg" },
    { name: "Sneakers", img: "/images/popham2.0Trainers-Mallet-sneakers.avif" },
  ];

  return (
    <div className="container text-center my-5 sale-banner">
      <h2 className="mb-4 text-center main-title">Summer Sale Per Category</h2>
      <div className="row justify-content-center g-4">
        {categories.map((cat, index) => (
          <div className="col-lg-3 col-md-4 col-sm-6 col-10" key={index}>
            <div className="card border-0 shadow-sm h-100">
              <div className="img-container">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="card-img-top zoom-img"
                />
              </div>
              <div className="card-body">
                <button
                  className="btn btn-dark w-100 fw-semibold"
                  onClick={() =>
                    navigate(`/search?category=${encodeURIComponent(cat.name)}`)
                  }
                >
                  {cat.name}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummerSaleSection;

