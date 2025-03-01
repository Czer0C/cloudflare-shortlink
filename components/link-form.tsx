"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createLink, updateLink } from "@/lib/api"
import { Link } from "@/lib/types"

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
})

interface LinkFormProps {
  initialData?: Link
  onSuccess?: () => void
}

export function LinkForm({ initialData, onSuccess }: LinkFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: initialData?.url || "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      
      if (initialData) {
        // Update existing link
        const response = await updateLink(initialData.code, values.url)
        
        if (response.success) {
          toast.success("Link updated successfully")
          if (onSuccess) onSuccess()
        } else {
          toast.error(response.message || "Failed to update link")
        }
      } else {
        // Create new link
        const response = await createLink(values.url)
        
        if (response.success) {
          toast.success("Link created successfully")
          form.reset()
          if (onSuccess) onSuccess()
        } else {
          toast.error(response.message || "Failed to create link")
        }
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {initialData ? "Update Link" : "Create Link"}
        </Button>
      </form>
    </Form>
  )
}