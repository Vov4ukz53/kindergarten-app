import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

function Dashboard() {
  const [kindergartens, setKindergartens] = useState([]);
  const [menu, setMenu] = useState([]);
  const [doneMap, setDoneMap] = useState({}); // ключ: "kgId-dishId-diet"

  const dietMap = {
    bezmleczna: "dairyFree",
    bezgluten: "glutenFree",
  };

  // Підписка на садки, меню та виконані страви
  useEffect(() => {
    const kgRef = ref(db, "kindergartens");
    onValue(kgRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
      setKindergartens(list);
    });

    const menuRef = ref(db, "menu");
    onValue(menuRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
        diets: Array.isArray(data[key].diets) ? data[key].diets : [],
      }));
      setMenu(list);
    });

    const doneRef = ref(db, "doneMap");
    onValue(doneRef, (snapshot) => {
      const data = snapshot.val() || {};
      setDoneMap(data);
    });
  }, []);

  const calculateAmount = (dish, kg, diet = "") => {
    if (!diet) return Number(kg.children || 0) * dish.portion;
    const field = dietMap[diet];
    return Number(kg[field] || 0) * dish.portion;
  };

  // Формуємо колонки таблиці
  const tableColumns = menu.flatMap((dish) => {
    const normal = {
      id: dish.id,
      name: dish.name,
      diet: "",
      portion: dish.portion,
    };
    const dietCols = dish.diets.map((d) => ({
      id: dish.id,
      name: dish.name,
      diet: d,
      portion: dish.portion,
    }));
    return [normal, ...dietCols];
  });

  // Підрахунок загальних сум
  const totals = tableColumns.map((col) =>
    kindergartens.reduce(
      (sum, kg) => sum + calculateAmount(col, kg, col.diet),
      0
    )
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Podsumowanie dla kucharzy</h1>

      {menu.length === 0 && <p>Brak dań w menu.</p>}
      {kindergartens.length === 0 && <p>Brak danych przedszkoli.</p>}

      {menu.length > 0 && kindergartens.length > 0 && (
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Przedszkole</th>
              {tableColumns.map((col, idx) => (
                <th key={idx}>
                  {col.name} {col.diet ? `(${col.diet})` : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kindergartens.map((kg) => (
              <tr key={kg.id}>
                <td>{kg.name}</td>
                {tableColumns.map((col, cidx) => {
                  const amount = calculateAmount(col, kg, col.diet);
                  const key = `${kg.id}-${col.id}-${col.diet || "normal"}`;
                  const isDone = doneMap[key];

                  return (
                    <td
                      key={cidx}
                      style={{
                        textAlign: "center",
                        background: isDone ? "#b2f2bb" : "#fff",
                        fontWeight: isDone ? "bold" : "normal",
                      }}
                    >
                      {amount}
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* Рядок з загальною сумою */}
            <tr style={{ fontWeight: "bold", background: "#eef" }}>
              <td>Ogólna ilość</td>
              {totals.map((t, idx) => (
                <td key={idx}>{t}</td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
