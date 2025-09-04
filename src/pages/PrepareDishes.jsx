import React, { useState, useEffect } from "react";

function PrepareDishes() {
  const [menu, setMenu] = useState([]);
  const [kindergartens, setKindergartens] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [selectedDiets, setSelectedDiets] = useState({});
  const [doneMap, setDoneMap] = useState({});

  // Завантаження menu і kindergartens
  useEffect(() => {
    const savedMenu = localStorage.getItem("menu");
    const savedKindergartens = localStorage.getItem("kindergartens");
    setMenu(savedMenu ? JSON.parse(savedMenu) : []);
    setKindergartens(savedKindergartens ? JSON.parse(savedKindergartens) : []);
  }, []);

  // Відновлення стану користувача з localStorage
  useEffect(() => {
    const savedDoneMap = localStorage.getItem("doneMap");
    const savedSelectedDishes = localStorage.getItem("selectedDishes");
    const savedSelectedDiets = localStorage.getItem("selectedDiets");

    if (savedDoneMap) setDoneMap(JSON.parse(savedDoneMap));
    if (savedSelectedDishes) setSelectedDishes(JSON.parse(savedSelectedDishes));
    if (savedSelectedDiets) setSelectedDiets(JSON.parse(savedSelectedDiets));
  }, []);

  // Тогл для обраної страви
  const toggleDish = (dishName) => {
    setSelectedDishes((prev) => {
      const newArr = prev.includes(dishName)
        ? prev.filter((d) => d !== dishName)
        : [...prev, dishName];
      localStorage.setItem("selectedDishes", JSON.stringify(newArr));
      return newArr;
    });
  };

  // Тогл для дієти
  const toggleDiet = (dishName, diet) => {
    const key = `${dishName}-${diet}`;
    setSelectedDiets((prev) => {
      const newObj = { ...prev, [key]: !prev[key] };
      localStorage.setItem("selectedDiets", JSON.stringify(newObj));
      return newObj;
    });
  };

  // Тогл для відмітки виконано
  const toggleDone = (kgName, dishName, diet) => {
    const key = `${kgName}-${dishName}-${diet || "normal"}`;
    setDoneMap((prev) => {
      const newObj = { ...prev, [key]: !prev[key] };
      localStorage.setItem("doneMap", JSON.stringify(newObj));
      return newObj;
    });
  };

  // Розрахунок кількості порцій
  const calculateAmount = (dish, kg, diet = "") => {
    const children = Number(kg.children || 0);
    const glutenFree = Number(kg.glutenFree || 0);
    const dairyFree = Number(kg.dairyFree || 0);

    if (!diet || diet === "normal") {
      return children * dish.portion; // усі діти для звичайної страви
    } else if (diet === "bezgluten") {
      return glutenFree * dish.portion;
    } else if (diet === "bezmleczna") {
      return dairyFree * dish.portion;
    }

    return 0;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Przygotowanie dań</h1>

      <h3>Wybierz dania do przygotowania:</h3>
      <div style={{ marginBottom: "20px" }}>
        {menu.map((dish) => (
          <div key={dish.name} style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                checked={selectedDishes.includes(dish.name)}
                onChange={() => toggleDish(dish.name)}
              />{" "}
              {dish.name} 
            </label>

            {/* Чекбокси для всіх дієт цієї страви */}
            {selectedDishes.includes(dish.name) && dish.diets.length > 0 && (
              <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                {dish.diets.map((diet) => {
                  const key = `${dish.name}-${diet}`;
                  return (
                    <label key={key} style={{ marginRight: "10px" }}>
                      <input
                        type="checkbox"
                        checked={!!selectedDiets[key]}
                        onChange={() => toggleDiet(dish.name, diet)}
                      />{" "}
                      {diet}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Таблиця для садків */}
      {selectedDishes.length > 0 && (
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Przedszkole</th>
              {selectedDishes.map((dishName) => {
                const dish = menu.find((d) => d.name === dishName);
                const cols = ["normal"];
                if (dish.diets.length > 0) {
                  dish.diets.forEach((diet) => {
                    if (selectedDiets[`${dishName}-${diet}`]) cols.push(diet);
                  });
                }
                return cols.map((diet) => (
                  <th key={`${dishName}-${diet}`}>
                    {dishName} {diet !== "normal" ? `(${diet})` : ""}
                  </th>
                ));
              })}
            </tr>
          </thead>
          <tbody>
            {kindergartens.map((kg) => (
              <tr key={kg.name}>
                <td>{kg.name}</td>
                {selectedDishes.map((dishName) => {
                  const dish = menu.find((d) => d.name === dishName);
                  const cols = ["normal"];
                  if (dish.diets.length > 0) {
                    dish.diets.forEach((diet) => {
                      if (selectedDiets[`${dishName}-${diet}`]) cols.push(diet);
                    });
                  }
                  return cols.map((diet) => {
                    const amount = calculateAmount(
                      dish,
                      kg,
                      diet !== "normal" ? diet : ""
                    );
                    const key = `${kg.name}-${dishName}-${diet}`;
                    return (
                      <td
                        key={key}
                        onClick={() =>
                          toggleDone(
                            kg.name,
                            dishName,
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
