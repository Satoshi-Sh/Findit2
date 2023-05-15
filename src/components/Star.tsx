import React, { useState, useEffect, useRef } from "react";
import "./content.css";
import axios from "axios";
import debounce from "lodash/debounce";

interface Name {
  name: string;
}

const Star = () => {
  const [input, setInput] = useState<string>("");
  const [names, setNames] = useState<string[]>([]);
  const prevInputRef = useRef<string>("");
  const debounceGetCandidates = useRef(
    debounce((value: string) => {
      axios
        .get(`http://localhost:3050/search/actor/${value}`)
        .then((response) => {
          setNames(response.data.map((x: Name) => x.name));
          prevInputRef.current = value;
          console.log("requested");
        })
        .catch((error) => {
          console.log(error);
        });
    }, 500)
  ).current;
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    console.log(event.target.value);
  };
  useEffect(() => {
    if (input.length > 0 && input !== prevInputRef.current) {
      console.log(input);
      debounceGetCandidates(input);
    }
  }, [input, debounceGetCandidates]);
  return (
    <div className="content">
      <h2 className="find-header">Find Star</h2>
      <input type="text" autoFocus value={input} onChange={handleInput}></input>
      <div>
        {names.length > 0 &&
          input.length > 0 &&
          names.map((name, index) => {
            return <div key={index}>{name}</div>;
          })}
      </div>
    </div>
  );
};
export default Star;
