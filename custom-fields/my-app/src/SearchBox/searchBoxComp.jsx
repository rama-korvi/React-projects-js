import { useEffect, useState } from "react";
import "./SearchBox.css";

function SearchInputBox() {
  const [ottChannelsList, setOttChannelsList] = useState([]);
  const [inputFieldValue, setInputFieldValue] = useState("");
  const [showAutoCompletion, setDisplayAutoComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;

  async function getWatchModeRes() {
    const cached = localStorage.getItem("channel_list");
    if (cached) return JSON.parse(cached);

    const res = await fetch(
      `https://api.watchmode.com/v1/sources/?apiKey=${API_KEY}`
    );
    const data = await res.json();

    const unique = [...new Set(data.map(i => i.name).filter(Boolean))];
    localStorage.setItem("channel_list", JSON.stringify(unique));
    return unique;
  }

  useEffect(() => {
    getWatchModeRes().then(setOttChannelsList);
  }, []);

  // Visibility based on typing
  useEffect(() => {
    if (inputFieldValue.length === 0) {
      setDisplayAutoComplete(false);
      setCurrentIndex(-1);
      return;
    }

    if (isTyping) {
      setDisplayAutoComplete(true);
      setCurrentIndex(-1);
    }
  }, [inputFieldValue, isTyping]);

  function handleInputChange(e) {
    setIsTyping(true);
    setInputFieldValue(e.target.value);
  }

  function selectOttFromTheList(index) {
    setInputFieldValue(ottChannelsList[index]);
    setDisplayAutoComplete(false);
    setCurrentIndex(-1);
    setIsTyping(false);
  }

  function navigateToLiTag(e) {
    if (!ottChannelsList.length) return;

    let nextIndex = currentIndex;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setDisplayAutoComplete(true);
      nextIndex =
        currentIndex === -1
          ? 0
          : Math.min(currentIndex + 1, ottChannelsList.length - 1);
    } 
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (currentIndex > 0) {
        nextIndex = currentIndex - 1;
      }
    } 
    else if (e.key === "Enter" && currentIndex !== -1) {
      selectOttFromTheList(currentIndex);
      return;
    }

    setCurrentIndex(nextIndex);
  }

  return (
    <div className="searchBoxWrapper">
      <label className="searchLabel">OTT Apps List</label>

      <div className="searchBox">
        <input
          type="text"
          value={inputFieldValue}
          placeholder="Search OTT apps..."
          className="searchInput"
          onChange={handleInputChange}
          onKeyDown={navigateToLiTag}
        />

        {showAutoCompletion && (
          <ul className="suggestionList">
            {ottChannelsList.map((item, index) => (
              <li
                key={item}
                className={index === currentIndex ? "active" : ""}
                onClick={() => selectOttFromTheList(index)}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchInputBox;
