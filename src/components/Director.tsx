import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./content.css";
import axios from "axios";
import debounce from "lodash/debounce";
import { BASE_URL } from "../constant";

interface Name {
  name: string;
}

interface CanDivProps {
  input: string;
  names: string[];
  loading: boolean;
  handleClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const CanDiv: React.FC<CanDivProps> = ({
  input,
  names,
  loading,
  handleClick,
}) => {
  if (loading && input.length > 0) {
    return (
      <div className="can-div">
        <div className="candidate">Loading...</div>
      </div>
    );
  } else if (input.length > 0 && names.length === 0) {
    return (
      <div className="can-div">
        <div className="candidate">No results...</div>
      </div>
    );
  }
  return (
    <>
      <div
        className={input.length === 0 || names.length === 0 ? "" : "can-div"}
      >
        {names.length > 0 &&
          input.length > 0 &&
          names.map((name, index) => {
            return (
              <div className="candidate" key={index} onClick={handleClick}>
                {name}
              </div>
            );
          })}
      </div>
    </>
  );
};

const Director = () => {
  const [input, setInput] = useState<string>("");
  const [names, setNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const prevInputRef = useRef<string>("");
  const navigate = useNavigate();
  const debounceGetCandidates = useRef(
    debounce((value: string) => {
      axios
        .get(`${BASE_URL}/search/director/${value}`)
        .then((response) => {
          setNames(response.data.map((x: Name) => x.name));
          prevInputRef.current = value;
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 500)
  ).current;
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const name = target.innerText;
    navigate(`detail/${name}`);
  };

  useEffect(() => {
    if (input.length > 0 && input !== prevInputRef.current) {
      debounceGetCandidates(input);
    }
  }, [input, debounceGetCandidates]);

  return (
    <div className="content">
      <h2 className="find-header">Find Director</h2>
      <input type="text" autoFocus value={input} onChange={handleInput}></input>
      <CanDiv
        input={input}
        names={names}
        loading={loading}
        handleClick={handleClick}
      />
    </div>
  );
};
export default Director;
