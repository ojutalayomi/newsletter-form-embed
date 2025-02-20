"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

const items = [
  {
    id: "daily",
    label: "Daily",
  },
  {
    id: "weekly",
    label: "Weekly",
  },
  {
    id: "monthly",
    label: "Monthly",
  }
] as const
 
const formSchema = z.object({
  firstname: z.string().min(2, 'First name must be at least 2 characters'),
  lastname: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  interval: z.enum(["daily", "weekly", "monthly"], {
    required_error: "You need to select a notification type.",
  }),
})

export default function Home() {
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      interval: "daily",
    },
  })
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values)
      const response = await axios.post(
        "/api/py/telex-newsletter", 
        values,
        {
          onDownloadProgress: (progressEvent) => {
            setLoading(true)
          }
        }
      )
    } catch (err) {
      console.error(err)
    } finally {
      setLoading
    }

  }

  return (
    <div className="flex h-full items-center justify-center">
        <div className="rounded-xl flex-1 p-4 h-full border border-gray-200 dark:border-neutral-800/30 bg-white dark:bg-zinc-800/30">
            <div className="border flex overflow-hidden mx-auto rounded-xl">
            <div className="flex flex-col items-center justify-center mx-auto p-4 bg-[#864def] text-white w-2/12">
                <svg className="size-9" viewBox="-3.2 -3.2 38.40 38.40" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" transform="matrix(-1, 0, 0, -1, 0, 0)rotate(0)" stroke="#ffffff" strokeWidth="0.00032"><g id="SVGRepo_bgCarrier" strokeWidth="0" transform="translate(0,0), scale(1)"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#ededed" strokeWidth="3.2"> <g fill="none"> <circle fill="#864def" cx="16" cy="16" r="16"></circle> <path d="M26.822 15.568l-10.39-10.39a.607.607 0 00-.86 0L5.18 15.569a.607.607 0 000 .86l10.39 10.393a.607.607 0 00.859 0l10.39-10.389a.608.608 0 00.004-.864zm-2.284.52l-7.616 7.616V16h-1.848v7.704l-7.616-7.616a.12.12 0 010-.172l8.454-8.453a.12.12 0 01.172 0l8.454 8.453a.12.12 0 010 .172c0-.004 0-.004 0 0z" fill="#ffffff"></path> </g> </g><g id="SVGRepo_iconCarrier"> <g fill="none"> <circle fill="#864def" cx="16" cy="16" r="16"></circle> <path d="M26.822 15.568l-10.39-10.39a.607.607 0 00-.86 0L5.18 15.569a.607.607 0 000 .86l10.39 10.393a.607.607 0 00.859 0l10.39-10.389a.608.608 0 00.004-.864zm-2.284.52l-7.616 7.616V16h-1.848v7.704l-7.616-7.616a.12.12 0 010-.172l8.454-8.453a.12.12 0 01.172 0l8.454 8.453a.12.12 0 010 .172c0-.004 0-.004 0 0z" fill="#ffffff"></path> </g> </g></svg>    
            </div>
            <div className="flex flex-1 flex-col items-center mx-auto p-4">
                <h1 className="text-2xl text-center">Newsletter</h1>
                <h2 className="text-xl text-center">Sign Up For Our Newsletter</h2>
                <h3 className="text-sm text-center">Fill in your information to sign up.</h3>
            </div>
            </div>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
                <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Firstname</FormLabel>
                    <FormControl>
                        <Input placeholder="Your firstname..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Lastname</FormLabel>
                    <FormControl>
                        <Input placeholder="Your lastname..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="johndoe@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                    
                )}
                />
                <FormField
                control={form.control}
                name="interval"
                render={({ field }) => (
                    <FormItem>
                    <div className="mb-4">
                        <FormLabel className="text-base">How often do you want to receive newsletters?</FormLabel>
                        <FormDescription>
                        Select how often you want to receive newsletters.
                        </FormDescription>
                    </div>
                    <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    >
                        {items.map((item) => (
                        <FormField
                            key={item.id}
                            control={form.control}
                            name="interval"
                            render={({ field }) => {
                            return (
                                <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                <FormControl>
                                    <RadioGroupItem value={item.id}/>
                                </FormControl>
                                <FormLabel className="font-normal">
                                    {item.label}
                                </FormLabel>
                                </FormItem>
                            )
                            }}
                        />
                        ))}
                    </RadioGroup>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button className="w-full" type="submit">Submit</Button>
            </form>
            </Form>
        </div>
    </div>
  )
}