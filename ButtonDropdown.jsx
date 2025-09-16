import React, { useState, useRef, useEffect } from "react";
import '../../styles/components/dropdown/ButtonDropdown.css';
import Arrow from '../../assets/icon/navbar/dropdown-arrow.svg';

const ButtonDropdown = ({
  option,
  selected,
  onSelect,
  isArray,
  displayKey,
  displayName,
  backgroundColor,
  text,
  otherColor,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);
  const itemRefs = useRef([]); // array di ref per index
  const lastKeyRef = useRef({ key: null, idx: 0, matches: [] });

  // helper: normalizza (rimuove accenti e mette lowercase)
  const normalizeString = (s) =>
    (s || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // rimuove diacritici
      .toLowerCase();

  // helper: verifica se è una lettera (con fallback per browser meno recenti)
  const isLetter = (ch) => {
    if (!ch || ch.length !== 1) return false;
    try {
      return /^[\p{L}]$/u.test(ch);
    } catch (err) {
      return /^[A-Za-zÀ-ÿ]$/.test(ch);
    }
  };

  // Chiudi il dropdown quando clicchi fuori
  useEffect(() => {
    if (disabled) return; // 👈 se disabilitato, non attiva listener
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        lastKeyRef.current = { key: null, idx: 0, matches: [] };
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [disabled]);

  // listener tastiera SOLO quando dropdown aperto
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // intercetta solo lettere
      const raw = e.key;
      if (!isLetter(raw)) return;

      e.preventDefault();
      e.stopPropagation();

      const letter = normalizeString(raw).charAt(0);
      if (!letter) return;

      // trova tutti gli indici che iniziano con la lettera
      const matches = [];
      for (let i = 0; i < option.length; i++) {
        const label = isArray ? option[i] : option[i]?.[displayName];
        if (!label) continue;
        if (normalizeString(label).startsWith(letter)) matches.push(i);
      }

      if (matches.length === 0) {
        // nessuna corrispondenza
        lastKeyRef.current = { key: null, idx: 0, matches: [] };
        return;
      }

      // se ripremi la stessa lettera -> ciclo alla prossima corrispondenza
      let pickIndex = 0;
      if (lastKeyRef.current.key === letter && lastKeyRef.current.matches.length) {
        pickIndex = (lastKeyRef.current.idx + 1) % matches.length;
      } else {
        pickIndex = 0;
      }

      lastKeyRef.current = { key: letter, idx: pickIndex, matches };

      const matchedItemIndex = matches[pickIndex];
      const el = itemRefs.current[matchedItemIndex];
      const container = listRef.current;

      if (el && container) {
        // calcolo posizione RELATIVA e scrollo il container senza toccare la pagina
        const elRect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // posizione top relativa + scroll corrente
        const relativeTop = elRect.top - containerRect.top + container.scrollTop;

        // centro l'elemento nel container; se vuoi top: usa relativeTop
        const targetScroll = relativeTop - container.clientHeight / 1 + el.clientHeight / 2;

        // scroll animato solo del container
        container.scrollTo({ top: targetScroll, behavior: "smooth" });

      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, option, isArray, displayName, displayKey, onSelect, selected]);

  return (
    <div className={`dropdown-custom ${disabled ? "dropdown-disabled" : ""}`} ref={dropdownRef}>
      <div
        className={
          backgroundColor ? "dropdown" : otherColor ? "dropdown-otherColor" : "dropdown-white"
        }
        onClick={() => !disabled && setIsOpen((prev) => !prev)} // 👈 blocco toggle
        role="button"
      >
        <a className="btn" id="cont-buttonDropdown" href="#" onClick={(e) => e.preventDefault()}>
          {selected
            ? (isArray
                ? selected
                : option?.find((op) => op[displayKey] === selected)?.[displayName] || selected)
            : text}
        </a>
        <img className="arrow-style" src={Arrow} />
      </div>
      {/* 👇 Mostra il menu SOLO se non è disabilitata */}
      {isOpen && !disabled && (
        <ul
          className="dropdown-menu show"
          style={{
            width: "max-content",
            minWidth: "unset",

          }}
          ref={listRef}
        >
          {option?.map((op, index) => {
            const label = isArray ? op : op[displayName];
            return (
              <li
                key={index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                onClick={() => {
                  onSelect(isArray ? op : op[displayKey]);
                  setIsOpen(false);
                  lastKeyRef.current = { key: null, idx: 0, matches: [] };
                }}
              >
                <a className="dropdown-item">{label}</a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ButtonDropdown;
