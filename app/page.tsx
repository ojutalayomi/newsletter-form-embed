"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image";
import Link from "next/link";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { ThemeProvider } from "./providers/theme-provider";
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
 
  // 2. Define a submit handler.
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
    <ThemeProvider defaultTheme="system" storageKey="newsletter-ui-theme">
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
    </ThemeProvider>
  )
}

export function Hom() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing FastApi API&nbsp;
          <Link href="/api/py/helloFastApi">
            <code className="font-mono font-bold">api/index.py</code>
          </Link>
        </p>
        <p className="fixed right-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing Next.js API&nbsp;
          <Link href="/api/helloNextJs">
            <code className="font-mono font-bold">app/api/helloNextJs</code>
          </Link>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore the Next.js 13 playground.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}
