import { verifySession } from "@/auth/dal";
import { OrderItemSchema } from "@/types";
import { calculateTotal, formatOrder } from "@/utils";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const orders = {
    createOrder: defineAction({
        accept: 'json',
        input: z.object({
           name: z.string().min(1, {message: 'El nombre es obligatorio'}),
           order: z.array(OrderItemSchema) 
        }),
        handler: async (input, ctx) => {

            const token = ctx.cookies.get('FRESHCOFFEE_TOKEN')?.value!

            const content = formatOrder(input.order)
            const total = calculateTotal(input.order)

            const res = await fetch(`${import.meta.env.API_URL}/freshcoffee_order`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: `Orden de: ${input.name}`,
                    content,
                    status: 'publish',
                    acf: {
                        total,
                        status: 'pending',
                        name: input.name
                    }
                })
            })

            const { id } : { id: number} = await res.json()
            return {
                message: `Orden Creada correctamente ID: ${id}`
            }
        }
    }),
    updateStatus: defineAction({
        accept: 'json',
        input: z.object({
            status: z.string(),
            id: z.number()
        }),
        handler: async (input, ctx) => {
           if(ctx.locals.user.role !== 'administrator') {
                throw new ActionError({
                    message: 'Hubo un error al actualizar la orden',
                    code: 'BAD_REQUEST'
                })
           }
             const token = ctx.cookies.get('FRESHCOFFEE_TOKEN')?.value!

             const url = `${import.meta.env.API_URL}/freshcoffee_order/${input.id}`
             const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    acf: {
                        status: input.status
                    } 
                })
             })

             await res.json()
             
             return {
                message: 'Actualizado Correctamente'
             }

        }
    })
    
}