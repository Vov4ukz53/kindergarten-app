import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

function Dashboard() {
  const [kindergartens, setKindergartens] = useState([]);
  const [menu, setMenu] = useState([]);

  // Мапа для відповідності дієт ключам у садках
  const dietMap = {
    bezmleczna: "dairyFree",
    bezgluten: "glutenFree",
  };

  // Підписка на Firebase
  useEffect(() => {
    const kgRef = ref(db, "kindergartens");
    onValue(kgRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
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
  }, []);

  // Підрахунок порцій
  const calculateAmount = (dish, kg, diet = "") => {
    if (!diet) {
      // Для звичайної страви беремо всіх дітей
      return Number(kg.children || 0) * dish.portion;
    } else if (dietMap[diet]) {
      const field = dietMap[diet];
      return Number(kg[field] || 0) * dish.portion;
    }
    return 0;
  };

  // Колонки таблиці
  const tableColumns = menu.flatMap((dish) => {
    const normal = { name: dish.name, diet: "", portion: dish.portion };
    const dietCols = dish.diets.map((d) => ({
      name: dish.name,
      diet: d,
      portion: dish.portion,
    }));
    return [normal, ...dietCols];
  });

  // Загальні суми
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
            {kindergartens.map((kg, kidx) => (
              <tr key={kidx}>
                <td>{kg.name}</td>
                {tableColumns.map((col, cidx) => {
                  const amount = calculateAmount(col, kg, col.diet);
                  return (
                    <td key={cidx} style={{ textAlign: "center" }}>
                      {amount}
                      {col.diet && ` (${kg[dietMap[col.diet]] || 0})`}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr style={{ fontWeight: "bold", background: "#eef" }}>
              <td>Ogólna ilość</td>
              {totals.map((t, idx) => (
                <td key={idx} style={{ textAlign: "center" }}>
                  {t}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
