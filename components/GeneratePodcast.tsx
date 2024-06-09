import React from "react";
import { GeneratePodcastProps } from "../types";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useGeneratePodcast } from "@/hooks/useGeneratePodcast";
import { Loader } from "lucide-react";

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          Prompt IA para gerar podcast
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder=" Forneça o texto para gerar o audio"
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="submit"
          className="text-16 bg-gray-0 py-4 font-bold text-black-1"
          onClick={generatePodcast}
        >
          {isGenerating ? (
            <>
              Gerando
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Gerar"
          )}
        </Button>
      </div>
      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
