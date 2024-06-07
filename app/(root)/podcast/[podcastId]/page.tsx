import React from "react";

interface Props {
  podcastId: string;
}

const PodcastDetails: React.FC<Props> = ({ podcastId }) => {
  return <p className="text-white-1">Podcast Details for: {podcastId}</p>;
};

export default PodcastDetails;
