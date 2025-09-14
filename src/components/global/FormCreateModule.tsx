"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm } from "react-hook-form"
import {z} from 'zod'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Textarea } from "../ui/textarea"

export function DialogCreateModule({open,onOpenChage}) {

  return (
    <Dialog open={open} onOpenChange={onOpenChage}>        
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Profile</DialogTitle>
            <DialogDescription>
              Kindly fill in all details
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
  )
}

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  overview:z.string().min(10,{
    message: "Overview must be at least 10 characters.",
  }),
  objectives:z.string().min(10,{
    message: "Objectives must be at least 10 characters.",
  })
})


function ProfileForm({ className }: React.ComponentProps<"form">) {
  const navigate = useRouter()
  const params = useParams()  
  const createModule = useMutation(api.modules.createModule)
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: "",
        overview:"",
        objectives:"",
    },
    })

  async function onSubmit(values: z.infer<typeof formSchema>) {    
      setLoading(true)
      try {
        const id = await createModule({         
          courseId:params.id,
          title:values.title,
          overview:values.overview,          
          objectives:values.objectives,          
        })
        console.log(id);
        navigate.push(`/tutor/modules/${id}`)
        setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
      console.log(values)
    }
  return (
    <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className={cn("grid items-start gap-6", className)}>
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
                    This is your module's title.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="overview"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Overview</FormLabel>
                    <FormControl>
                    <Textarea placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                    This is your module's overview.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="objectives"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Objectives</FormLabel>
                    <FormControl>
                    <Textarea placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                    This is your module's objectives.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
        
        <Button 
        disabled={loading}
        type="submit">
            {loading ? "Creating..." : "Create Module"}
        </Button>
        </form>
    </Form>
  )
}
