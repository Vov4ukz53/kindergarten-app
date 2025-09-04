import React, { useState, useEffect } from "react";

function Kindergartens() {
  const [kindergartens, setKindergartens] = useState(() => {
    const saved = localStorage.getItem("kindergartens");
    return saved ? JSON.parse(saved) : [];
  });

  const [newName, setNewName] = useState("");

  useEffect(() => {
    localStorage.setItem("kindergartens", JSON.stringify(kindergartens));
  }, [kindergartens]);

  const addKindergarten = () => {
    if (!newName.trim()) return;
    setKindergartens([
      ...kindergartens,
      { name: newName.trim(), children: "", glutenFree: "", dairyFree: "" },
    ]);
    setNewName("");
  };

  const removeKindergarten = (index) => {
    const newList = kindergartens.filter((_, i) => i !== index);
    setKindergartens(newList);
  };

  const handleChange = (index, field, value) => {
    const newList = [...kindergartens];
    newList[index][field] = value;
    setKindergartens(newList);
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
            if (e.key === "Enter") {
              addKindergarten();
            }
          }}
          style={{ marginRight: "10px" }}
        />
        <button onClick={addKindergarten}>Dodaj przedszkole</button>
      </div>

      {kindergartens.map((kg, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
            maxWidth: "400px",
          }}
        >
          <h3>
            {kg.name}{" "}
            <button
              onClick={() => removeKindergarten(index)}
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
              onChange={(e) => handleChange(index, "children", e.target.value)}
              placeholder="np. 20"
            />
          </label>
          <label style={{ display: "block", marginBottom: "10px" }}>
            Dieta bezglutenowa:{" "}
            <input
              type="text"
              value={kg.glutenFree}
              onChange={(e) =>
                handleChange(index, "glutenFree", e.target.value)
              }
              placeholder="0 jeśli brak"
            />
          </label>
          <label style={{ display: "block", marginBottom: "10px" }}>
            Dieta bezmleczna:{" "}
            <input
              type="text"
              value={kg.dairyFree}
              onChange={(e) => handleChange(index, "dairyFree", e.target.value)}
              placeholder="0 jeśli brak"
            />
          </label>
        </div>
      ))}
    </div>
  );
}

export default Kindergartens;
