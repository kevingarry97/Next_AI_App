"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

type Creator = {
  image: string;
  username: string;
  email: string;
  _id: string;
};

interface Post {
  _id: string;
  creator: Creator;
  prompt: string;
  tag: string;
}

interface Props {
  post: Post;
  handleTagClick: (value: string) => void;
  handleEdit: () => void;
  handleDelete: () => void;
}

const PromptCard = ({
  post,
  handleTagClick,
  handleEdit,
  handleDelete,
}: Props) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  const [copied, setCopied] = useState("");

  const handleCopy = (value: string) => {
    setCopied(value);
    navigator.clipboard.writeText(value);
    setTimeout(() => setCopied(""), 3000);
  };

  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        <div className="flex-1 flex justify-start items-center gap-3 cursor-pointer">
          <Image
            src={post?.creator?.image}
            alt="user_image"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />
          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-900">
              {post?.creator?.username}
            </h3>
            <p className="font-inner text-sm text-gray-500">
              {post?.creator?.email}
            </p>
          </div>
        </div>
        <div
          className="copy_btn"
          onClick={() => {
            handleCopy(post.prompt);
          }}
        >
          <Image
            src={
              copied === post.prompt
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            width={12}
            height={12}
            alt="copied"
          />
        </div>
      </div>
      <p className="my-4 font-satoshi text-gray-500">{post.prompt}</p>
      <small
        className="font-inter blue_gradient cursor-pointer"
        onClick={() => handleTagClick(post.tag)}
      >
        {post.tag.startsWith("#") ? post.tag : "#" + post.tag}
      </small>
      {session?.user?.id == post.creator._id && pathName == "/profile" && (
        <div className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3">
          <p
            className="font-inter text-sm green_gradient cursor-pointer"
            onClick={handleEdit}
          >
            {" "}
            Edit{" "}
          </p>
          <p
            className="font-inter text-sm orange_gradient cursor-pointer"
            onClick={handleDelete}
          >
            {" "}
            Delete{" "}
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
