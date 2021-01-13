import React from "react";
// custom hooks
import useDebounce from "./hooks/useDebounce";
// axios
import axios from "axios";
// styles
import "./App.css";
// react icons
import { GrScorecard } from "react-icons/gr";
import { FaComments } from "react-icons/fa";

export interface IStory {
  title: string;
  author: string;
  url: string;
  points: number;
  num_comments: number;
  relevancy_score: number;
  created_at: Date;
}

function App() {
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [stories, setStories] = React.useState<IStory[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  React.useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm !== "") {
      axios
        .get(
          `https://hn.algolia.com/api/v1/search?query=${debouncedSearchTerm}&tags=story`
        )
        .then((response) => {
          console.log(response.data);
          setStories(response?.data?.hits);
        });
    }
  }, [debouncedSearchTerm]);

  return (
    <section className="section">
      <div className="container">
        <h3 className="text-center">Hacker News</h3>
        <div className="form-item">
          <input
            type="text"
            placeholder="Enter Your Search Term"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
        </div>
        <h5>List of Stories</h5>
        <div className="story-container">
          {stories.length > 0 ? (
            stories.map((item, index) => (
              <div key={index} className="story-item">
                <div className="story-card">
                  <h4>{item.title}</h4>
                  <p>
                    Authored By: <strong>{item.author}</strong>
                  </p>
                  <p>
                    Created At: <strong>{item.created_at}</strong>
                  </p>
                  <h4>
                    <GrScorecard /> {item.relevancy_score} <FaComments />{" "}
                    {item.num_comments}
                  </h4>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noreferrer">
                      Visit
                    </a>
                  ) : (
                    <p>Link not available</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No Results Found</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default App;
