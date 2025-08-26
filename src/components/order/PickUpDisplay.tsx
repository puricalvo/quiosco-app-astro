import useSWR from "swr"
import type { OrderContent } from "@/types"
export default function PickUpDisplay() {
    const url = `/api/orders/completed?per_page=5`
    const fetcher = () => fetch(url).then(res => res.json()).then(data => data)
    const config = {refreshInterval: 1000 * 5}
    const { data, error, isLoading } = useSWR<OrderContent[]>(url, fetcher, config)

    if(isLoading) return "Cargando..."

    if(data) {
        return data.length === 0 
        ? <p className="text-center">No hay ordenes lista</p> 
        : (
            <div className="grid grid-cols-1 gap-5 w-full">
                {data.map( order => (
                    <div className="shadow p-5 border-gray-200 border">
                        <p className="text-2xl font-bold">ID: {order.id}</p>
                        <p className="text-3xl">Nombre: {order.name}</p>
                    </div>
                ))}
            </div>
        )
    }

  
}
