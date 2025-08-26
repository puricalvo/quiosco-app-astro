import type { Product, Sizes } from '@/types'
import { defineStore, createPinia } from 'pinia'
import { ref } from 'vue'

export const usePriceStore = defineStore('prices', () => {
    const isVariablePrice = ref(false)
    const selectedProduct = ref<Product['acf'] | null>(null)

    const sizes = ref<Sizes>({
        small: {size: 'Chico', price: 0},
        medium: {size: 'Mediano', price: 0},
        large: {size: 'Grande', price: 0},
    })

    const setSelectedProduct = (product: Product['acf']) => {
        isVariablePrice.value = product.variable_price
        selectedProduct.value = product 
        
        syncSizesFromProps()
    }

    const syncSizesFromProps = () => {
        const product = selectedProduct.value

        if(!product || product.variable_price !== true) return

        sizes.value = {
            small: product.small,
            medium: product.medium,
            large: product.large
        }
    }

    return {
        isVariablePrice,
        selectedProduct,
        sizes,
        setSelectedProduct,
    }
})


export const appStore = createPinia()