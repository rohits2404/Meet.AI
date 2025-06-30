"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import React, { useState } from 'react'

const Home = () => {

    const { data: session } = authClient.useSession();

    const [email,setEmail] = useState("");
    const [name,setName] = useState("");
    const [password,setPassword] = useState("");

    const onSubmit = () => {
        authClient.signUp.email({
            email,
            name,
            password
        },{
            onError: () => {
                window.alert("Something Went Wrong!")
            },
            onSuccess: () => {
                window.alert("Success")
            }
        })
    }

    if(session){
        return(
            <div className='flex flex-col p-4 gap-y-4'>
                <p>Logged In as {session.user.name}</p>
                <Button onClick={()=>authClient.signOut()}>Sign Out</Button>
            </div>
        )
    }

    return (
        <div className='p-4 flex flex-col gap-y-4'>
            <Input placeholder='Enter Name' value={name} onChange={(e)=>setName(e.target.value)}/>
            <Input placeholder='Enter Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <Input placeholder='Enter Password' type='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <Button onClick={onSubmit}>Create User</Button>
        </div>
    )
}

export default Home