import { PodcastEntity } from "@/models/PodcastEntity";
import React from "react";

interface Props {
  podcast: PodcastEntity;
}

const PodcastCard = ({ podcast }: Props) => {
  return <div>PodcastCard</div>;
};

export default PodcastCard;
