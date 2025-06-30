"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
    name: z.string().min(1,{ message: "Name Is Required!" }),
    email: z.string().email(),
    password: z.string().min(1, { message: "Password Is Required!" }),
    confirmPassword: z.string().min(1, { message: "Password Is Required!" }),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords Don't Match!",
    path: ["confirmPassword"]
});

export const SignUpView = () => {

    const router = useRouter();

    const [error,setError] = useState<string|null>(null);
    const [pending,setPending] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setError(null);
        setPending(true);
        authClient.signUp.email({
            name: data.name,
            email: data.email,
            password: data.password
        },{
            onSuccess: () => {
                setPending(false);
                router.push("/")
            },
            onError: ({ error }) => {
                setPending(false);
                setError(error.message)
            }
        })
    }

    return(
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">Let&apos;s Get Started</h1>
                                    <p className="text-muted-foreground text-balance">Create Your Account</p>
                                </div>
                                <div className="grid gap-3">
                                    <FormField 
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input type="name" placeholder="John Doe" {...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <FormField 
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="example.com" {...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <FormField 
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <FormField 
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                    />
                                </div>
                                {!!error && (
                                    <Alert className="bg-destructive/10 border-none">
                                        <OctagonAlertIcon className="h-4 w-4 !text-destructive"/>
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}
                                <Button disabled={pending} type="submit" className="w-full cursor-pointer">
                                    Register
                                </Button>
                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                                        Or Continue With
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button disabled={pending} type="button" variant={"outline"} className="w-full cursor-pointer">
                                        Google
                                    </Button>
                                    <Button disabled={pending} type="button" variant={"outline"} className="w-full cursor-pointer">
                                        Github
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Already Have An Account ?&nbsp;
                                    <Link href={"/sign-in"} className="text-green-600">Login</Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                    <div className="bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
                        <Image src={"/logo.svg"} alt="Logo" width={92} height={92}/>
                        <p className="text-2xl font-semibold text-white">
                            Meet.AI
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}