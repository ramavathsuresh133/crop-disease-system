"use client"

import { useCallback, useState } from "react"
import {
  Upload,
  X,
  ImageIcon,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { cropTypes } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface UploadFormProps {
  onAnalyze: (file: File, crop: string) => void
  isAnalyzing: boolean
}

export function UploadForm({ onAnalyze, isAnalyzing }: UploadFormProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedCrop, setSelectedCrop] = useState("")

  const handleFile = useCallback((f: File) => {
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (e.dataTransfer.files?.[0]) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [handleFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        handleFile(e.target.files[0])
      }
    },
    [handleFile]
  )

  function clearFile() {
    setFile(null)
    setPreview(null)
  }

  function handleSubmit() {
    if (file && selectedCrop) {
      onAnalyze(file, selectedCrop)
    }
  }

  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          {/* Drop zone */}
          <div>
            <Label className="mb-2 block text-sm font-medium">
              Crop / Leaf Image
            </Label>
            {preview ? (
              <div className="relative overflow-hidden rounded-xl border border-border">
                <img
                  src={preview}
                  alt="Uploaded crop leaf preview"
                  className="h-64 w-full object-cover"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8"
                  onClick={clearFile}
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors",
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <ImageIcon className="h-7 w-7 text-primary" />
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">
                  Drag and drop your image here
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  or click to browse (JPG, PNG up to 10MB)
                </p>
                <label htmlFor="file-upload">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 gap-2"
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4" />
                      Browse Files
                    </span>
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {/* Crop type selector */}
          <div>
            <Label className="mb-2 block text-sm font-medium">
              Crop Type
            </Label>
            <Select onValueChange={setSelectedCrop} value={selectedCrop}>
              <SelectTrigger>
                <SelectValue placeholder="Select crop type" />
              </SelectTrigger>
              <SelectContent>
                {cropTypes.map((crop) => (
                  <SelectItem key={crop} value={crop}>
                    {crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Analyze button */}
          <Button
            onClick={handleSubmit}
            disabled={!file || !selectedCrop || isAnalyzing}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing Image...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Analyze Crop Image
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
