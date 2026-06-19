import { useEffect, useState } from "react";
import {
  ref,
  push,
  set,
  onValue,
  update,
  remove,
} from "firebase/database";
import { db } from "./firebase";
import "./App.css";

const products = [
  { id: 1, name: "과일 생크림 케이크", price: 15000, img: "simg/list1.jpg" },
  { id: 2, name: "블랙 사파이어 치즈 케이크", price: 10000, img: "simg/list2.jpg" },
  { id: 3, name: "라즈베리 쇼콜라", price: 18000, img: "simg/list3.jpg" },
  { id: 4, name: "고구마 카스텔라", price: 17000, img: "simg/list4.jpg" },
  { id: 5, name: "딸기 초코 생크림 케이크", price: 11000, img: "simg/list5.jpg" },
  { id: 6, name: "딸기 촉촉 초코 생크림 케이크", price: 12000, img: "simg/list6.jpg" },
  { id: 7, name: "바스크 초코 치즈 케이크", price: 13000, img: "simg/list7.jpg" },
  { id: 8, name: "과일 생크림 케이크", price: 14000, img: "simg/list8.jpg" },
];

export default function App() {
  const [cart, setCart] = useState([]);

  // 장바구니 실시간 로딩
  useEffect(() => {
    const cartRef = ref(db, "cart01");

    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();

      const items = data
        ? Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
        : [];

      setCart(items);
    });

    return () => unsubscribe();
  }, []);

  // 장바구니 추가 (중복 체크)
  const addToCart = (product) => {
    const existItem = cart.find(
      (item) => item.productId === product.id
    );

    // 이미 있으면 수량 증가
    if (existItem) {
      update(ref(db, `cart01/${existItem.id}`), {
        qty: existItem.qty + 1,
      });
      return;
    }

    // 없으면 신규 추가
    const cartRef = ref(db, "cart01");
    const newItemRef = push(cartRef);

    set(newItemRef, {
      productId: product.id,
      productName: product.name,
      price: product.price,
      qty: 1,
    });
  };

  // 수량 증가
  const plusQty = (id, qty) => {
    update(ref(db, `cart01/${id}`), {
      qty: qty + 1,
    });
  };

  // 수량 감소
  const minusQty = (id, qty) => {
    if (qty <= 1) {
      remove(ref(db, `cart01/${id}`));
    } else {
      update(ref(db, `cart01/${id}`), {
        qty: qty - 1,
      });
    }
  };

  // 삭제
  const deleteItem = (id) => {
    remove(ref(db, `cart01/${id}`));
  };

  // 총금액
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div
      style={{
        display: "flex",
        gap: 30,
        padding: 20,
      }}
    >
      {/* 상품목록 */}
      <div style={{ width: "70%" }}>
        <h2>케이크</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 10,
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ddd",
                padding: 10,
              }}
            >
              <img
                src={p.img}
                alt={p.name}
                style={{ width: "100%" }}
              />

              <div>{p.name}</div>

              <div style={{ color: "red" }}>
                {p.price.toLocaleString()}원
              </div>

              <button
                className="cartBtn"
                onClick={() => addToCart(p)}
              >
                🛒
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 장바구니 */}
      <div
        style={{
          width: 250,
          border: "1px solid #ddd",
          padding: 10,
          position: "fixed",
          right: 20,
          top: 20,
          background: "#fff",
        }}
      >
        <h3>장바구니</h3>

        {cart.length === 0 && (
          <p>장바구니가 비어있습니다.</p>
        )}

        {cart.map((item) => (
          <div
            key={item.id}
            style={{
              borderBottom: "1px solid #eee",
              padding: 10,
            }}
          >
            <div>{item.productName}</div>

            <div>
              {item.price.toLocaleString()}원
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginTop: 5,
              }}
            >
              <button
                onClick={() =>
                  minusQty(item.id, item.qty)
                }
              >
                -
              </button>

              <span>{item.qty}</span>

              <button
                onClick={() =>
                  plusQty(item.id, item.qty)
                }
              >
                +
              </button>

              <button
                onClick={() =>
                  deleteItem(item.id)
                }
                style={{
                  marginLeft: 10,
                  color: "red",
                }}
              >
                삭제
              </button>
            </div>
          </div>
        ))}

        <hr />

        <h3>
          총금액 : {total.toLocaleString()}원
        </h3>
      </div>
    </div>
  );
}

