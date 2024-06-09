"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import GeneratePodcast from "@/components/GeneratePodcast";
import GenerateThumbnail from "@/components/GenerateThumbnail";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const voiceCategories = ["alloy", "shimmer", "nova", "echo", "fable", "onyx"];

const formSchema = z.object({
  podcastTitle: z.string().min(2),
  podcastDescription: z.string().min(2),
});

const CreatePodcast = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [imageUrl, setImageUrl] = useState("");

  const [audioUrl, setAudioUrl] = useState("");
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [audioDuration, setAudioDuration] = useState(0);

  const [voiceType, setVoiceType] = useState<string | null>(null);
  const [voicePrompt, setVoicePrompt] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPodcast = useMutation(api.podcasts.createPodcast);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      //  if (!audioUrl || !imageUrl || !voiceType) {
      if (!imageUrl || !voiceType) {
        toast({
          title: "Por favor, gere um audio e uma imagem",
        });
        setIsSubmitting(false);
        throw new Error("Por favor, gere um audio e uma imagem");
      }

      const podcast = await createPodcast({
        podcastTitle: data.podcastTitle,
        podcastDescription: data.podcastDescription,
        // audioUrl,
        imageUrl,
        voiceType,
        imagePrompt,
        // voicePrompt,
        views: 0,
        // audioDuration,
        // audioStorageId: audioStorageId!,
        imageStorageId: imageStorageId!,
      });
      toast({ title: "Podcast created" });
      setIsSubmitting(false);
      router.push("/");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Crie um novo podcast</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 flex w-full flex-col"
          autoComplete="off"
        >
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Titulo
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="input-class focus-visible:ring-offset-gray-0"
                      placeholder="Titulo do Podcast"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">
                Selecione a voz IA
              </Label>

              <Select onValueChange={(value) => setVoiceType(value)}>
                <SelectTrigger
                  className={cn(
                    "text-16 w-full border-none bg-black-1 text-gray-0 focus-visible:ring-offset-gray-0"
                  )}
                >
                  <SelectValue
                    placeholder="Selecione a voz IA"
                    className="placeholder:text-gray-0 "
                  />
                </SelectTrigger>
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-gray-0">
                  {voiceCategories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="capitalize focus:bg-gray-0"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
                {voiceType && (
                  <audio
                    src={`/${voiceType}.mp3`}
                    autoPlay
                    className="hidden"
                  />
                )}
              </Select>
            </div>
            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Descrição
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="input-class focus-visible:ring-offset-gray-0"
                      placeholder="Escreva uma pequena descrição para o podcast"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col pt-10">
            <GeneratePodcast
              setAudioStorageId={setAudioStorageId}
              setAudio={setAudioUrl}
              voiceType={voiceType!}
              audio={audioUrl}
              voicePrompt={voicePrompt}
              setVoicePrompt={setVoicePrompt}
              setAudioDuration={setAudioDuration}
            />

            <GenerateThumbnail
              setImage={setImageUrl}
              setImageStorageId={setImageStorageId}
              image={imageUrl}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
            />
            <div className="mt-10 w-full">
              <Button
                type="submit"
                className="text-16 w-full bg-gray-0 py-4 font-extrabold text-black-1 transition-all duration-500 hover:bg-gray-1"
              >
                {isSubmitting ? (
                  <>
                    Enviando
                    <Loader size={20} className="animate-spin ml-2" />
                  </>
                ) : (
                  "Enviar e Publicar Podcast"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreatePodcast;
