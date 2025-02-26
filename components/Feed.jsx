"use client";

import { useEffect, useMemo, useState } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [posts, setPosts] = useState([]);

  const filteredPosts = useMemo(() => {
    if (!debouncedSearchText) return posts;

    const searchTextLower = debouncedSearchText.trim().toLowerCase();
    return posts.filter((post) => {
      const hasMatchingTag =
        post?.tag?.toLowerCase().includes(searchTextLower) ?? false;
      const hasMatchingPrompt =
        post?.prompt?.toLowerCase().includes(searchTextLower) ?? false;
      const hasMatchingCreator =
        post?.creator?.email.toLowerCase().includes(searchTextLower) ?? false;

      return hasMatchingTag || hasMatchingPrompt || hasMatchingCreator;
    });
  }, [posts, debouncedSearchText]);

  const handleTagClick = (tag) => {
    setSearchText(tag);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPosts(data);
      console.log(data);
    };

    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={({ target }) => setSearchText(target.value)}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList data={filteredPosts} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;
