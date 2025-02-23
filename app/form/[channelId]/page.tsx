"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const getFallbackText = (formName: string | null): string => {
  if (!formName) return 'NE';
  return formName.toUpperCase().slice(0, 2);
};

export default function EmbedForm() {
  const params = useParams<{ channelId: string }>();
  const [loading, setLoading] = useState(false);
  const [fallbackText, setFallbackText] = useState('NE'); // Default value
  const [formName, setFormName] = useState('Newsletter');

  const searchParams = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  }, []);

  const form_name = searchParams.get("form_name");
  const logo_url = searchParams.get("logo_url");

  useEffect(() => {
    setFallbackText(getFallbackText(form_name));
    setFormName(form_name || 'Newsletter');
  }, [form_name]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      interval: "daily",
    },
  })
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      console.log(values)
      const response = await axios.post(
        "/api/py/telex-newsletter/"+params.channelId, 
        values,
        {
          onDownloadProgress: (progressEvent) => {
            const percentCompleted = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0
            setLoading(true)
          }
        }
      )
      if (response.status === 200) {
        alert("Successfully subscribed to newsletter!")
        form.reset()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="flex h-full items-center justify-center">
        <div className="rounded-xl flex-1 p-4 h-full border border-gray-200 dark:border-neutral-800 dark:bg-gray-900">
            <div className="border flex overflow-hidden mx-auto rounded-xl">
            <div className="flex flex-col items-center justify-center mx-auto p-4 bg-[#864def] text-white w-2/12">
                <Avatar className="shadow-lg">
                  <AvatarImage className="size-9" src={logo_url || "https://telex-newsletter.duckdns.org/emb.svg"} alt="Newsletter Logo" />
                  <AvatarFallback className="text-[#864def]">{fallbackText}</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex flex-1 flex-col items-center mx-auto p-4">
                <h1 className="text-2xl text-center">{formName}</h1>
                <h2 className="text-xl text-center">Sign Up For Our Newsletter</h2>
                <h3 className="text-sm text-center">Fill in your information to sign up.</h3>
            </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  </div>
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
                  <Button className="w-full" type="submit">
                    {loading ? "Loading..." : "Submit"}
                  </Button>
              </form>
            </Form>
        </div>
    </div>
  )
}