import { guestCredentials } from "@/auth/dal";
import { nullToEmptyString } from "@/utils";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const auth = {
    signInAsGuest: defineAction({
        handler: async (input, ctx) => {
            const res = await fetch(`${import.meta.env.AUTH_URL}`, {
                
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                
                body: JSON.stringify(guestCredentials)
                
            })
                
            console.log("Status:", res.status);
            const json = await res.json()
            console.log("Response:", json);
            ctx.cookies.set('FRESHCOFFEE_TOKEN', json.token, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 60 * 24 * 7
            })

            return true
        }
    }),

    signIn: defineAction({
        accept: 'form',
        input: z.object({
            username: z.preprocess(
                nullToEmptyString,
                z.string().min(1, {message: 'El Usuario no puede ir vacio'})
            ), 
            password: z.preprocess(
                nullToEmptyString,
                z.string().min(1, {message: 'El Password no puede ir vacio'})
            ), 
        }),
        handler: async (input, ctx) => {
            const res = await fetch(import.meta.env.AUTH_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(input)
            })
            const data = await res.json()

            if(data.code === '[jwt_auth] invalid_username') {
                throw new ActionError({
                    message: 'El Usuario no existe',
                    code: 'UNAUTHORIZED'
                })
            }

             if(data.code === '[jwt_auth] incorrect_password') {
                throw new ActionError({
                    message: 'El Password es Incorrecto',
                    code: 'UNAUTHORIZED'
                })
            }

            ctx.cookies.set('FRESHCOFFEE_TOKEN', data.token, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 60 * 24 * 7
            })

            return true
        }
    }),

    signOut: defineAction({
        handler: ( _, ctx ) => {
            ctx.cookies.delete('FRESHCOFFEE_TOKEN', {
                path: '/',
            })
        }
    })
}