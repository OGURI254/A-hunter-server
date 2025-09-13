'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {z} from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ChevronLeftCircle, Router, X } from "lucide-react"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMutation } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

const page = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your course</CardTitle>
        <CardDescription>Kindly fill in all details</CardDescription>
        <CardAction>
          <a href="/tutor/courses">
            <ChevronLeftCircle/>
          </a>
        </CardAction>
      </CardHeader>
      <CardContent>
        <CourseCreateForm/>
      </CardContent>
    </Card>
  )
}

export default page

const ThumbnailSchema = z.union([
  z.string().url("Must be a valid URL"),
  z.instanceof(File, { message: "Must be a valid file upload" })
]);

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description:z.string().min(10,{
    message: "Description must be at least 10 characters.",
  }),
  thumbnail:z.string().url("Must be a valid url"),
  tags:z.array(z.string()).optional()
})

const CourseCreateForm = () => {
  const navigate = useRouter()
  const createCourse = useMutation(api.courses.create)
  const {user} = useUser()
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: "",
        description:"",
        thumbnail:"",
        tags:[]
      },
    })

      // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {    
    setLoading(true)
    try {
      const id = await createCourse({
        tutor:user?.id || '',
        title:values.title,
        description:values.description,
        tags:values.tags,
        thumbnailUrl:values.thumbnail || '',
        visibility:'private'
      })
      console.log(id);
      navigate.push(`/tutor/courses/${id}`)
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
    console.log(values)
  }

  const [preview, setPreview] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  return(
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your course's title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your course's description.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
         <FormItem>
          <FormLabel>Thumbnail</FormLabel>
          <FormControl>
            <div className="space-y-2">
              {/* File upload */}
              {/* <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // clear URL input
                    field.onChange(file);
                    setPreview(URL.createObjectURL(file));
                  } else {
                    field.onChange(undefined);
                    setPreview(null);
                  }
                }}
              />

              <div className="text-center text-sm text-muted-foreground">OR</div> */}

              {/* URL input */}
              <Input
                type="url"
                placeholder="https://example.com/image.png"
                value={typeof field.value === "string" ? field.value : ""}
                onChange={(e) => {
                  const url = e.target.value;
                  if (url) {
                    // clear file input
                    field.onChange(url);
                    setPreview(url);
                  } else {
                    field.onChange(undefined);
                    setPreview(null);
                  }
                }}
              />

              {/* Preview */}
              {preview && (
                <div className="mt-2">
                  <img
                    src={preview}
                    alt="Thumbnail preview"
                    width={200}
                    height={120}
                    className="rounded border"
                  />
                </div>
              )}
            </div>
          </FormControl>
          <FormDescription>
            Upload an image file or paste a URL. Only one option is allowed.
          </FormDescription>
          <FormMessage />
        </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
             <FormItem>
          <FormLabel>Tags</FormLabel>
          <FormControl>
            <div className="space-y-2">
              {/* Input for new tags */}
              <Input
                placeholder="Type a tag and press Enter"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim()) {
                    e.preventDefault();
                    const newTag = inputValue.trim();
                    if (!field.value?.includes(newTag)) {
                      field.onChange([...(field.value || []), newTag]);
                    }
                    setInputValue("");
                  }
                }}
              />

              {/* Tag list */}
              <div className="flex flex-wrap gap-2">
                {(field.value || []).map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        field.onChange(field?.value.filter((_: string, i: number) => i !== index))
                      }
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </FormControl>
          <FormDescription>
            Add keywords to help learners discover your course.
          </FormDescription>
          <FormMessage />
        </FormItem>
          )}
        />
        <Button 
        disabled={loading}
        type="submit">{loading ? "Creating..." : "Create Course"}</Button>
      </form>
    </Form>
  )
}