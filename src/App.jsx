import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

function App() {
  // =========================
  // 1. ТОВАРЫ
  // =========================

  const products = [
    {
      id: 1,
      name: "iPhone 17 Pro",
      price: 699000,
    },
    {
      id: 2,
      name: "iPhone Pro",
      price: 599000,
    },
    {
      id: 3,
      name: "AirPods Pro",
      price: 129000,
    },
    {
      id: 4,
      name: "MacBook Air",
      price: 799000,
    },
  ];

  // =========================
  // 2. STATE
  // =========================

  const [isRegistered, setIsRegistered] = useState(() => {
    const savedRegistration =
      localStorage.getItem("isRegistered");

    return savedRegistration === "true";
  });

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      return JSON.parse(savedCart);
    }

    return [];
  });

  const [sortOrder, setSortOrder] =
    useState("default");

  const [isDarkMode, setIsDarkMode] =
    useState(false);

  const [search, setSearch] = useState("");

  // =========================
  // 3. LOCAL STORAGE
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(
      "isRegistered",
      isRegistered
    );
  }, [isRegistered]);

  // =========================
  // 4. РЕГИСТРАЦИЯ
  // =========================

  function registerUser(event) {
    event.preventDefault();

    if (
      userName.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      return;
    }

    setIsRegistered(true);
  }

  function logoutUser() {
    setIsRegistered(false);
  }

  // =========================
  // 5. ДОБАВЛЕНИЕ В КОРЗИНУ
  // =========================

  function addToCart(selectedProduct) {
    const existingProduct = cart.find(
      function (productInCart) {
        return (
          productInCart.id === selectedProduct.id
        );
      }
    );

    if (existingProduct) {
      const cartAfterQuantityUpdate =
        cart.map(function (productInCart) {
          if (
            productInCart.id ===
            selectedProduct.id
          ) {
            return {
              ...productInCart,
              quantity:
                productInCart.quantity + 1,
            };
          }

          return productInCart;
        });

      setCart(cartAfterQuantityUpdate);
    } else {
      const newProduct = {
        ...selectedProduct,
        quantity: 1,
      };

      setCart([...cart, newProduct]);
    }
  }

  // =========================
  // 6. УМЕНЬШЕНИЕ
  // =========================

  function decreaseQuantity(itemToDecrease) {
    if (itemToDecrease.quantity === 1) {
      const cartAfterRemove =
        cart.filter(function (productInCart) {
          return (
            productInCart.id !==
            itemToDecrease.id
          );
        });

      setCart(cartAfterRemove);
      return;
    }

    const cartAfterDecrease =
      cart.map(function (productInCart) {
        if (
          productInCart.id ===
          itemToDecrease.id
        ) {
          return {
            ...productInCart,
            quantity:
              productInCart.quantity - 1,
          };
        }

        return productInCart;
      });

    setCart(cartAfterDecrease);
  }

  // =========================
  // 7. УДАЛЕНИЕ
  // =========================

  function removeFromCart(idToRemove) {
    const cartAfterRemove =
      cart.filter(function (productInCart) {
        return productInCart.id !== idToRemove;
      });

    setCart(cartAfterRemove);
  }

  // =========================
  // 8. ИТОГ
  // =========================

  let totalPrice = 0;

  cart.forEach(function (priceItem) {
    totalPrice =
      totalPrice +
      priceItem.price * priceItem.quantity;
  });

  // =========================
  // 9. ПОИСК
  // =========================

  const filteredProducts =
    products.filter(function (productToCheck) {
      return productToCheck.name
        .toLowerCase()
        .includes(search.toLowerCase());
    });

  // =========================
  // 10. СОРТИРОВКА
  // =========================

  const sortedProducts = [
    ...filteredProducts,
  ];

  if (sortOrder === "cheap") {
    sortedProducts.sort(
      function (firstProduct, secondProduct) {
        return (
          firstProduct.price -
          secondProduct.price
        );
      }
    );
  }

  if (sortOrder === "expensive") {
    sortedProducts.sort(
      function (firstProduct, secondProduct) {
        return (
          secondProduct.price -
          firstProduct.price
        );
      }
    );
  }

  // =========================
  // 11. РЕГИСТРАЦИЯ
  // =========================

  if (!isRegistered) {
    return (
      <div
        className={
          isDarkMode
            ? "page dark-mode"
            : "page"
        }
      >
        <div className="register-box">
          <h1>Регистрация</h1>

          <form onSubmit={registerUser}>
            <input
              type="text"
              placeholder="Ваше имя"
              value={userName}
              onChange={(event) =>
                setUserName(
                  event.target.value
                )
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
            />

            <button type="submit">
              Зарегистрироваться
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================
  // 12. ОСНОВНОЕ ПРИЛОЖЕНИЕ
  // =========================

  return (
    <div
      className={
        isDarkMode
          ? "page dark-mode"
          : "page"
      }
    >
      <div className="shop">

        <button
          className="theme-button"
          onClick={() =>
            setIsDarkMode(!isDarkMode)
          }
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>

        <h1>Mini Shop</h1>

        {/* НАВИГАЦИЯ */}

        <nav className="navigation">
          <Link to="/">Главная</Link>

          <Link to="/products">
            Товары
          </Link>

          <Link to="/cart">
            Корзина ({cart.length})
          </Link>
        </nav>

        {/* ROUTER */}

        <Routes>

          {/* ГЛАВНАЯ */}

          <Route
            path="/"
            element={
              <div className="home-page">
                <h2>
                  Добро пожаловать в Mini Shop
                </h2>

                <p>
                  Выберите товары и добавьте
                  их в корзину.
                </p>

                <Link to="/products">
                  <button>
                    Перейти к товарам
                  </button>
                </Link>
              </div>
            }
          />

          {/* ТОВАРЫ */}

          <Route
            path="/products"
            element={
              <>
                <div className="search-box">
                  <span className="search-icon">
                    🔍
                  </span>

                  <input
                    type="text"
                    placeholder="Поиск товара"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="sort-box">
                  <span className="sort-label">
                    Сортировка:
                  </span>

                  <select
                    className="sort-select"
                    value={sortOrder}
                    onChange={(event) =>
                      setSortOrder(
                        event.target.value
                      )
                    }
                  >
                    <option value="default">
                      Без сортировки
                    </option>

                    <option value="cheap">
                      Сначала дешёвые
                    </option>

                    <option value="expensive">
                      Сначала дорогие
                    </option>
                  </select>
                </div>

                <h2>
                  Корзина: {cart.length}
                </h2>

                <div className="products">
                  {sortedProducts.map(
                    function (
                      currentProduct
                    ) {
                      return (
                        <div
                          className="product-card"
                          key={
                            currentProduct.id
                          }
                        >
                          <h2>
                            {
                              currentProduct.name
                            }
                          </h2>

                          <p>
                            {
                              currentProduct.price
                            }{" "}
                            ₸
                          </p>

                          <button
                            onClick={() =>
                              addToCart(
                                currentProduct
                              )
                            }
                          >
                            В корзину
                          </button>
                        </div>
                      );
                    }
                  )}
                </div>
              </>
            }
          />

          {/* КОРЗИНА */}

          <Route
            path="/cart"
            element={
              <>
                <h2>Товары в корзине</h2>

                {cart.length === 0 && (
                  <p>Корзина пуста</p>
                )}

                {cart.map(
                  function (cartItem) {
                    return (
                      <div
                        className="cart-item"
                        key={cartItem.id}
                      >
                        <p>
                          {cartItem.name}
                        </p>

                        <p>
                          Цена:{" "}
                          {cartItem.price} ₸
                        </p>

                        <p>
                          Количество:{" "}
                          {cartItem.quantity}
                        </p>

                        <p>
                          Сумма:{" "}
                          {cartItem.price *
                            cartItem.quantity}{" "}
                          ₸
                        </p>

                        <button
                          onClick={() =>
                            decreaseQuantity(
                              cartItem
                            )
                          }
                        >
                          -
                        </button>

                        <button
                          onClick={() =>
                            addToCart(
                              cartItem
                            )
                          }
                        >
                          +
                        </button>

                        <button
                          onClick={() =>
                            removeFromCart(
                              cartItem.id
                            )
                          }
                        >
                          Удалить
                        </button>
                      </div>
                    );
                  }
                )}

                <h2>
                  Итого: {totalPrice} ₸
                </h2>

                {cart.length > 0 && (
                  <button
                    onClick={() =>
                      setCart([])
                    }
                  >
                    Очистить корзину
                  </button>
                )}
              </>
            }
          />

        </Routes>

        <button
          className="logout-button"
          onClick={logoutUser}
        >
          Выйти
        </button>

      </div>
    </div>
  );
}

export default App;