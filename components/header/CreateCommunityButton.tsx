"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { ImageIcon, Plus } from "lucide-react";
import { startTransition, useRef, useState, useTransition } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { Button } from "../ui/button";
import { createCommunity } from "@/action/createCommunity";

import { useMounted } from "@/hooks/use-mounted";

const CreateCommunityButton = () => {
  

  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [errormsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, transition] = useTransition();


  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 21);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setErrorMsg("");
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreateCommunity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg("Community name is required.");
      return;
    }
    if (!slug.trim()) {
      setErrorMsg("Community slug is required.");
      return;
    }
    setErrorMsg("");
    startTransition(async () => {
      try {
        let imageBase64: string | null = null;
        let fileName: string | null = null;
        let fileType: string | null = null;
        if (imageFile) {
          const reader = new FileReader();
          imageBase64 = await new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(imageFile);
          });
          fileName = imageFile.name;
          fileType = imageFile.type;
        }

        const result = await createCommunity(
          name.trim(),
          imageBase64,
          fileName,
          fileType,
          slug.trim(),
          description.trim() || undefined
        );

        console.log("Community created:", result);

        if ("error" in result && result.error) {
          setErrorMsg(result.error);
        } else if ("subreadit" in result && result.subreadit) {
          setOpen(false);
          resetForm();
          // router.push(`/community/${result.subreadit.slug?.current}`)
        }
      } catch (error) {
        console.error("Failed to create a Community:", error);
        setErrorMsg("Failed to create community.");
      }
    });
  };
  const mounted = useMounted();
  if(!mounted) return null;

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className="w-full p-2 pl-5 flex items-center rounded-md cursor-pointer bg-black text-white hover:bg-black transition-all duration-200 disabled:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!user}
        >
          <Plus className="w-4 h-4 mr-2" />
          {user ? "Create Community" : "Sign in to create"}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a Community</DialogTitle>
            <DialogDescription>
              Create a community/subreadit to share ideas and get feedback.
            </DialogDescription>
            <form onSubmit={handleCreateCommunity} className="space-y-2 mt-2">
              {errormsg && (
                <div className="text-red-500 text-sm">{errormsg}</div>
              )}

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Community name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="My community"
                  className="w-full focus:ring-2 focus:ring-blue-500"
                  value={name}
                  onChange={handleNameChange}
                  required
                  minLength={3}
                  maxLength={21}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Community slug (URL)
                </label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="my community"
                  className="w-full focus:ring-2 focus:ring-blue-500"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  minLength={3}
                  maxLength={21}
                  pattern="[a-z0-9-]+"
                  title="Lowercase letters, numbers, and hyphens only."
                />
                <p className="text-xs text-gray-500">
                  This will be used in the URL: readit.com/community/
                  {slug || "community-slug"}
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="what is this community about?"
                  className="w-full focus:ring-2 focus:ring-blue-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Community Image (optional)
                </label>
                {imagePreview ? (
                  <div className="relative w-24 h-24 mx-auto">
                    <Image
                      src={imagePreview}
                      alt="Community Image Preview"
                      fill
                      className="object-cover rounded-full"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="community-image"
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <ImageIcon className="w-6 h-6 mb-2 text-gray-400" />
                        <p className="text-xs text-gray-500">
                          Click to upload an image
                        </p>
                      </div>

                      <input
                        id="community-image"
                        name="community-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 transition-colors cursor-pointer mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPending || !user}
              >
                {isPending
                  ? "Creating..."
                  : user
                    ? "Create Community"
                    : "Sign in to create Community"}
              </Button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateCommunityButton;
