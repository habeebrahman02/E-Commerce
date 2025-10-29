import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/NewCollection.css";

const NewArrival = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "Jean Collection", img: "/jeans.jpg" },
    { name: "Hoodie Collection", img: "/hoodie.jpg" },
    { name: "Sneakers Collection", img: "/sneakers.jpg" },
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/search?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="container-fluid new-arrivals">
      <div className="row g-0">
        {categories.map((cat, index) => (
          <div className="col-md-4 col-sm-12" key={index}>
            <div 
              className="category-card"
              onClick={() => handleCategoryClick(cat.name)}
            >
              <img src={cat.img} alt={cat.name} className="img-fluid w-100" />

              {index === 1 && (
                <div className="overlay-top z-1 text-center">
                  <h2 className="main-title">New Arrivals</h2>
                </div>
              )}

              <div className="hover-overlay">
                <h3 className="hover-text">{cat.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrival;
