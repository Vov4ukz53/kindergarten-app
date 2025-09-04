import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue, set, push, remove } from "firebase/database";

function Menu() {
  const [menu, setMenu] = useState([]);
  const [newDishName, setNewDishName] = useState("");
  const [newPortion, setNewPortion] = useState(100);
  const [newDiets, setNewDiets] = useState({
    bezmleczna: false,
    bezgluten: false,
  });

  useEffect(() => {
    const menuRef = ref(db, "menu");
    onValue(menuRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
        diets: Array.isArray(data[key].diets) ? data[key].diets : [], // гарантуємо масив
      }));
      setMenu(list);
    });
  }, []);

  const addDish = () => {
    if (!newDishName.trim()) return;
    const menuRef = ref(db, "menu");
    const newDishRef = push(menuRef);
    set(newDishRef, {
      name: newDishName.trim(),
      portion: Number(newPortion),
      diets: Object.keys(newDiets).filter((d) => newDiets[d]),
    });
    setNewDishName("");
    setNewPortion(100);
    setNewDiets({ bezmleczna: false, bezgluten: false });
  };

  const removeDish = (id) => {
    const dishRef = ref(db, `menu/${id}`);
    remove(dishRef);
  };

  const toggleDiet = (id, diet) => {
    const dish = menu.find((d) => d.id === id);
    const currentDiets = Array.isArray(dish.diets) ? dish.diets : [];
    const updatedDiets = currentDiets.includes(diet)
      ? currentDiets.filter((d) => d !== diet)
      : [...currentDiets, diet];
    set(ref(db, `menu/${id}/diets`), updatedDiets);
  };

  const updatePortion = (id, value) => {
    set(ref(db, `menu/${id}/portion`), Number(value));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Menu</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nazwa dania"
          value={newDishName}
          onChange={(e) => setNewDishName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addDish()}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Porcja"
          value={newPortion}
          onChange={(e) => setNewPortion(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <label style={{ marginRight: "10px" }}>
          <input
            type="checkbox"
            checked={newDiets.bezmleczna}
            onChange={() =>
              setNewDiets({ ...newDiets, bezmleczna: !newDiets.bezmleczna })
            }
          />{" "}
          Bezmleczna
        </label>
        <label style={{ marginRight: "10px" }}>
          <input
            type="checkbox"
            checked={newDiets.bezgluten}
            onChange={() =>
              setNewDiets({ ...newDiets, bezgluten: !newDiets.bezgluten })
            }
          />{" "}
          Bezgluten
        </label>
        <button onClick={addDish}>Dodaj danie</button>
      </div>

      {menu.map((dish) => (
        <div
          key={dish.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
            maxWidth: "500px",
          }}
        >
          <h3>
            {dish.name}
            <button
              onClick={() => removeDish(dish.id)}
              style={{
                marginLeft: "10px",
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
          </h3>

          <label style={{ display: "block", marginBottom: "10px" }}>
            Porcja (g/szt.):{" "}
            <input
              type="number"
              value={dish.portion}
              onChange={(e) => updatePortion(dish.id, e.target.value)}
            />
          </label>

          <div>
            Diety:
            {["bezmleczna", "bezgluten"].map((diet) => {
              const dietsArray = Array.isArray(dish.diets) ? dish.diets : [];
              return (
                <label key={diet} style={{ marginLeft: "10px" }}>
                  <input
                    type="checkbox"
                    checked={dietsArray.includes(diet)}
                    onChange={() => toggleDiet(dish.id, diet)}
                  />{" "}
                  {diet}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Menu;
