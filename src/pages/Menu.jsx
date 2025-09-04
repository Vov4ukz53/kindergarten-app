import React, { useState, useEffect } from "react";

function Menu() {
  const [dishes, setDishes] = useState(() => {
    const saved = localStorage.getItem("menu");
    return saved ? JSON.parse(saved) : [];
  });

  const [newDishName, setNewDishName] = useState("");
  const [newDishPortion, setNewDishPortion] = useState("");
  const [newDishDiets, setNewDishDiets] = useState({
    bezmleczna: false,
    bezgluten: false,
  });

  // Зберігаємо у LocalStorage
  useEffect(() => {
    localStorage.setItem("menu", JSON.stringify(dishes));
  }, [dishes]);

  const addDish = () => {
    if (!newDishName.trim() || !newDishPortion) return;

    const selectedDiets = Object.keys(newDishDiets).filter(
      (d) => newDishDiets[d]
    );

    setDishes([
      ...dishes,
      {
        name: newDishName.trim(),
        portion: Number(newDishPortion),
        diets: selectedDiets, // масив дієт
      },
    ]);

    setNewDishName("");
    setNewDishPortion("");
    setNewDishDiets({ bezmleczna: false, bezgluten: false });
  };

  const removeDish = (index) => {
    setDishes(dishes.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Menu</h1>
      <p>Dodaj nowe danie i zaznacz diety (jeśli brak, zostaw puste)</p>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nazwa dania"
          value={newDishName}
          onChange={(e) => setNewDishName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Norma na dziecko"
          value={newDishPortion}
          onChange={(e) => setNewDishPortion(e.target.value)}
          style={{ marginRight: "10px" }}
        />

        <label style={{ marginRight: "10px" }}>
          <input
            type="checkbox"
            checked={newDishDiets.bezmleczna}
            onChange={() =>
              setNewDishDiets({
                ...newDishDiets,
                bezmleczna: !newDishDiets.bezmleczna,
              })
            }
          />{" "}
          Bezmleczna
        </label>

        <label style={{ marginRight: "10px" }}>
          <input
            type="checkbox"
            checked={newDishDiets.bezgluten}
            onChange={() =>
              setNewDishDiets({
                ...newDishDiets,
                bezgluten: !newDishDiets.bezgluten,
              })
            }
          />{" "}
          Bezgluten
        </label>

        <button onClick={addDish}>Dodaj danie</button>
      </div>

      {dishes.length === 0 && <p>Brak dań w menu.</p>}

      {dishes.map((dish, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "10px",
            maxWidth: "500px",
          }}
        >
          <div>
            <strong>{dish.name}</strong> - {dish.portion} g/szt.
          </div>
          <div>
            Diety: {dish.diets.length > 0 ? dish.diets.join(", ") : "Brak"}
          </div>
          <div style={{ marginTop: "5px" }}>
            <button
              onClick={() => removeDish(index)}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                padding: "2px 6px",
              }}
            >
              Usuń
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Menu;
