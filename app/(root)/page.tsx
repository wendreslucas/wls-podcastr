"use client";

import PodcastCard from "@/components/PodcastCard";
import { podcastData } from "@/constants";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";

const Home = () => {
  const tasks = useQuery(api.tasks.get);

  return (
    <div className="mt-9 flex flex-col gap-9 ">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>

        {/* <div className="flex min-h-screen flex-col items-center justify-between p-24 text-white-1">
          {tasks?.map(({ _id, text }) => (
            <div key={_id} className="text-white-1">
              {text}
            </div>
          ))}
        </div> */}

        <div className="podcast_grid">
          {podcastData.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
