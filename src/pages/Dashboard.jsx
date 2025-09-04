import React, { useState, useEffect } from "react";

function Dashboard() {
  const [kindergartens, setKindergartens] = useState([]);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const savedKindergartens = localStorage.getItem("kindergartens");
    const savedMenu = localStorage.getItem("menu");

    setKindergartens(savedKindergartens ? JSON.parse(savedKindergartens) : []);
    setMenu(
      savedMenu
        ? JSON.parse(savedMenu).map((d) => ({
            ...d,
            diets: Array.isArray(d.diets) ? d.diets : [],
          }))
        : []
    );
  }, []);

  const calculateAmount = (dish, kg, diet = "") => {
    if (diet === "bezmleczna") return Number(kg.dairyFree || 0) * dish.portion;
    if (diet === "bezgluten") return Number(kg.glutenFree || 0) * dish.portion;
    return Number(kg.children || 0) * dish.portion;
  };

  const tableColumns = menu.flatMap((dish) => {
    const normal = { name: dish.name, diet: "", portion: dish.portion };
    const dietColumns =
      dish.diets && dish.diets.length > 0
        ? dish.diets.map((d) => ({
            name: dish.name,
            diet: d,
            portion: dish.portion,
          }))
        : [];
    return [normal, ...dietColumns];
  });

  // Підрахунок сум по кожній колонці
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
                  if (col.diet === "bezmleczna") {
                    return (
                      <td key={cidx}>
                        {amount} ({kg.dairyFree || 0})
                      </td>
                    );
                  } else if (col.diet === "bezgluten") {
                    return (
                      <td key={cidx}>
                        {amount} ({kg.glutenFree || 0})
                      </td>
                    );
                  } else {
                    return <td key={cidx}>{amount}</td>;
                  }
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
