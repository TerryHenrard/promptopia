"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();

  const { data: session } = useSession();

  const [posts, setPosts] = useState([]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (!hasConfirmed) return;

    try {
      await fetch(`/api/prompt/${post._id.toString()}`, { method: "DELETE" });
      const updatedPosts = posts.filter((p) => p._id !== post._id);
      setPosts(updatedPosts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();
      setPosts(data);
    };

    if (session?.user.id) fetchPosts();
  }, [session]);

  return (
    <Profile
      name="My"
      desc="Welcome to your personalised profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
