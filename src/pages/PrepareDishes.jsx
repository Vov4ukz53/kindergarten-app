import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue, set } from "firebase/database";

function PrepareDishes() {
  const [menu, setMenu] = useState([]);
  const [kindergartens, setKindergartens] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]); // Вибрані страви
  const [selectedDiets, setSelectedDiets] = useState({}); // ключ: "dish-diet"
  const [doneMap, setDoneMap] = useState({}); // ключ: "kg-dish-diet"

  const dietMap = {
    bezmleczna: "dairyFree",
    bezgluten: "glutenFree",
  };

  useEffect(() => {
    const menuRef = ref(db, "menu");
    onValue(menuRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
      setMenu(list);
    });

    const kgRef = ref(db, "kindergartens");
    onValue(kgRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
      setKindergartens(list);
    });

    const doneRef = ref(db, "doneMap");
    onValue(doneRef, (snapshot) => {
      const data = snapshot.val() || {};
      setDoneMap(data);
    });
  }, []);

  const toggleDish = (dishId) => {
    setSelectedDishes((prev) =>
      prev.includes(dishId)
        ? prev.filter((id) => id !== dishId)
        : [...prev, dishId]
    );
  };

  const toggleDiet = (dishId, diet) => {
    const key = `${dishId}-${diet}`;
    setSelectedDiets((prev) => {
      const newState = { ...prev, [key]: !prev[key] };
      set(ref(db, `selectedDiets/${key}`), newState[key]);
      return newState;
    });
  };

  const toggleDone = (kgId, dishId, diet) => {
    const key = `${kgId}-${dishId}-${diet || "normal"}`;
    const newValue = !doneMap[key];
    setDoneMap((prev) => ({ ...prev, [key]: newValue }));
    set(ref(db, `doneMap/${key}`), newValue);
  };

  const calculateAmount = (dish, kg, diet = "") => {
    if (!diet || diet === "normal") {
      // Для простих страв беремо всіх дітей
      return Number(kg.children || 0) * dish.portion;
    } else {
      const field = dietMap[diet];
      return Number(kg[field] || 0) * dish.portion;
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Przygotowanie dań</h1>

      <h3>Wybierz dania do przygotowania:</h3>
      <div style={{ marginBottom: "20px" }}>
        {menu.map((dish) => {
          const dietsArray = Array.isArray(dish.diets) ? dish.diets : [];
          return (
            <div key={dish.id} style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedDishes.includes(dish.id)}
                  onChange={() => toggleDish(dish.id)}
                />{" "}
                {dish.name} ({dish.portion} g/szt.)
              </label>

              {selectedDishes.includes(dish.id) && dietsArray.length > 0 && (
                <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                  {dietsArray.map((diet) => {
                    const key = `${dish.id}-${diet}`;
                    return (
                      <label key={key} style={{ marginRight: "10px" }}>
                        <input
                          type="checkbox"
                          checked={!!selectedDiets[key]}
                          onChange={() => toggleDiet(dish.id, diet)}
                        />{" "}
                        {diet}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDishes.length > 0 && (
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Przedszkole</th>
              {selectedDishes.map((dishId) => {
                const dish = menu.find((d) => d.id === dishId);
                const dietsArray = Array.isArray(dish.diets) ? dish.diets : [];
                const cols = ["normal"];
                dietsArray.forEach((diet) => {
                  if (selectedDiets[`${dishId}-${diet}`]) cols.push(diet);
                });
                return cols.map((diet) => (
                  <th key={`${dishId}-${diet}`}>
                    {dish.name} {diet !== "normal" ? `(${diet})` : ""}
                  </th>
                ));
              })}
            </tr>
          </thead>
          <tbody>
            {kindergartens.map((kg) => (
              <tr key={kg.id}>
                <td>{kg.name}</td>
                {selectedDishes.map((dishId) => {
                  const dish = menu.find((d) => d.id === dishId);
                  const dietsArray = Array.isArray(dish.diets)
                    ? dish.diets
                    : [];
                  const cols = ["normal"];
                  dietsArray.forEach((diet) => {
                    if (selectedDiets[`${dishId}-${diet}`]) cols.push(diet);
                  });
                  return cols.map((diet) => {
                    const amount = calculateAmount(
                      dish,
                      kg,
                      diet !== "normal" ? diet : ""
                    );
                    const key = `${kg.id}-${dishId}-${diet}`;
                    return (
                      <td
                        key={key}
                        onClick={() =>
                          toggleDone(
                            kg.id,
                            dishId,
                            diet !== "normal" ? diet : ""
                          )
                        }
                        style={{
                          cursor: "pointer",
                          background: doneMap[key] ? "#b2f2bb" : "#fff",
                          textAlign: "center",
                        }}
                      >
                        {amount}
                      </td>
                    );
                  });
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PrepareDishes;
