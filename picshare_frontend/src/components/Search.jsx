import React, { useEffect, useState } from "react";
import MasonryLayout from "./MasonryLayout";
import { client } from "../client";
import { feedQuery, searchQuery } from "../utils/data";
import Spinner from "./Spinner";

const Search = ({ search }) => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setPins([]); // Clear previous results to avoid stale data

    const fetchData = async () => {
      try {
        const query = search
          ? searchQuery(search.toLowerCase())
          : feedQuery;
        const data = await client.fetch(query);
        setPins(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search]);

  return (
    <div>
      {loading && <Spinner message="Searching pins..." />}
      {!loading && pins.length > 0 && <MasonryLayout pins={pins} />}
      {!loading && pins.length === 0 && search && (
        <div className="mt-10 text-center text-xl">No Pins Found!</div>
      )}
    </div>
  );
};

export default Search;
