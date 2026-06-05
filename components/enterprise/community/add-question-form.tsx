"use client";

import FormGroup from "@/components/global/form-group";
import FormText from "@/components/global/form-text";
import CustomSelect from "@/components/global/custom-select";
import { Button } from "@/components/ui/button";
import { IconSparkles } from "@tabler/icons-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { IconX } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";

const categories = [
  { label: "Cinematography", value: "cinematography" },
  { label: "Directing", value: "directing" },
  { label: "Post-Production", value: "post-production" },
  { label: "Production", value: "production" },
  { label: "Sound Design", value: "sound-design" },
  { label: "Scriptwriting", value: "scriptwriting" },
  { label: "VFX", value: "vfx" },
  { label: "Legal", value: "legal" },
  { label: "Marketing", value: "marketing" },
  { label: "Equipment", value: "equipment" },
];

interface AddQuestionFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function AddQuestionForm({ onSubmit, onCancel }: AddQuestionFormProps) {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    category: "",
  });
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 5) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Question Title */}
        <FormGroup
          label="Question Title"
          name="title"
          placeholder="e.g., How to improve cinematography in low-light conditions?"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="h-11 border-2 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 transition-all"
          labelClassName="text-base font-semibold text-foreground"
          required
        />

        {/* Description */}
        <FormText
          label="Question Description"
          name="description"
          placeholder="Provide detailed context about your question..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="min-h-[150px] resize-none border-2 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 transition-all"
          required
        />

        {/* Category */}
        <CustomSelect
          options={categories}
          placeholder="Select a category"
          label="Category"
          className="h-11 border-2"
          onValueChange={(value) =>
            setFormData({ ...formData, category: value })
          }
        />

        {/* Tags */}
        <div className="space-y-2">
          <label className="block text-base font-semibold text-foreground">
            Tags (Optional)
          </label>
          <p className="text-sm text-muted-foreground">
            Add up to 5 tags to help others find your question. Press Enter to
            add.
          </p>
          <Input
            placeholder="e.g., lighting, camera, techniques"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="h-11 border-2 focus-visible:border-orange-500 focus-visible:ring-orange-500/20"
            disabled={tags.length >= 5}
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400 pl-3 pr-1 py-1.5"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1.5 hover:bg-orange-500/20 rounded-full p-0.5 transition-colors"
                  >
                    <IconX className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {tags.length}/5 tags added
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-11 border-2 hover:bg-muted transition-all"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 h-11 bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300"
        >
          <IconSparkles className="mr-2 size-4" />
          Post Question
        </Button>
      </div>
    </form>
  );
}
