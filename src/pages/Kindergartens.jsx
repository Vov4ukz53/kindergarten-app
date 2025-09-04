import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // твій firebase.js
import { ref, onValue, set, push, remove, update } from "firebase/database";

function Kindergartens() {
  const [kindergartens, setKindergartens] = useState([]);
  const [newName, setNewName] = useState("");

  // Підписка на зміни в Firebase
  useEffect(() => {
    const kgRef = ref(db, "kindergartens");
    onValue(kgRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
      setKindergartens(list);
    });
  }, []);

  const addKindergarten = () => {
    if (!newName.trim()) return;
    const kgRef = ref(db, "kindergartens");
    const newKgRef = push(kgRef);
    set(newKgRef, {
      name: newName.trim(),
      children: "",
      glutenFree: "",
      dairyFree: "",
    });
    setNewName("");
  };

  const removeKindergarten = (id) => {
    const kgRef = ref(db, `kindergartens/${id}`);
    remove(kgRef);
  };

  const handleChange = (id, field, value) => {
    const fieldRef = ref(db, `kindergartens/${id}/${field}`);
    set(fieldRef, value);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Przedszkola</h1>
      <p>
        Wprowadź liczbę dzieci i dzieci na dietach (jeśli brak, wpisz 0 lub
        pozostaw puste)
      </p>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nazwa nowego przedszkola"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addKindergarten();
          }}
          style={{ marginRight: "10px" }}
        />
        <button onClick={addKindergarten}>Dodaj przedszkole</button>
      </div>

      {kindergartens.map((kg) => (
        <div
          key={kg.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
            maxWidth: "400px",
          }}
        >
          <h3>
            {kg.name}
            <button
              onClick={() => removeKindergarten(kg.id)}
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
            Liczba dzieci:{" "}
            <input
              type="text"
              value={kg.children}
              onChange={(e) => handleChange(kg.id, "children", e.target.value)}
              placeholder="np. 20"
            />
          </label>

          <label style={{ display: "block", marginBottom: "10px" }}>
            Dieta bezglutenowa:{" "}
            <input
              type="text"
              value={kg.glutenFree}
              onChange={(e) =>
                handleChange(kg.id, "glutenFree", e.target.value)
              }
              placeholder="0 jeśli brak"
            />
          </label>

          <label style={{ display: "block", marginBottom: "10px" }}>
            Dieta bezmleczna:{" "}
            <input
              type="text"
              value={kg.dairyFree}
              onChange={(e) => handleChange(kg.id, "dairyFree", e.target.value)}
              placeholder="0 jeśli brak"
            />
          </label>
        </div>
      ))}
    </div>
  );
}

export default Kindergartens;
