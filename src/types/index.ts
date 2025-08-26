import { z } from 'astro:content' 

const ImageSchema = z.object({
  url: z.string().url(),
  width: z.number(),
  height: z.number(),
});

const FeaturedImageSchema = z.object({
  thumbnail: ImageSchema,
  medium: ImageSchema,
  medium_large: ImageSchema,
  large: ImageSchema,
  full: ImageSchema
});

const VariablePairSchema = z.object({
    price: z.coerce.number(),
    size: z.string()
})

export const VariablePriceSchema = z.object({
    variable_price: z.literal(true),
    small: VariablePairSchema,
    medium: VariablePairSchema,
    large: VariablePairSchema,
})

const FixedPriceSchema = z.object({
    variable_price: z.literal(false),
    price: z.coerce.number()
})

export const ProductPriceSchema = z.discriminatedUnion('variable_price',
    [VariablePriceSchema, FixedPriceSchema]
)

const CategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    acf: z.object({
        icon: z.string()
    })
})
export const CategoriesSchema = z.array(CategorySchema)
export type Category = z.infer<typeof CategorySchema>



export const ProductSchema = z.object({
    id: z.number(),
    slug: z.string(),
    title: z.object({
      rendered: z.string()
    }),
    featured_media: z.number(),
    featured_images: FeaturedImageSchema,
    acf: ProductPriceSchema,
    freshcoffee_category: z.object({
        id: z.number(),
        name: z.string(),
        slug: z.string()
    })
})
export const ProductsSchema = z.array(ProductSchema)
export type Product = z.infer< typeof ProductSchema>

const ProductWithVariablePriceSchema = ProductSchema.extend({
    acf: VariablePriceSchema
})
export type ProductWithVariablePrice = z.infer<typeof ProductWithVariablePriceSchema>

export const UploadedImageSchema = z.object({
    id: z.number(),
    source_url: z.string()
})
export type UploadedImage = z.infer<typeof UploadedImageSchema>


/* Orders - Clients */
const SelectedProductSchema = z.object({
    id: z.number(),
    name: z.string().min(1, {message: 'El nombre del producto es obligatorio'}),
    price: z.number().min(1, {message: 'Precio no válido'}),
    size: z.optional(z.string().min(1, {message: 'Tamaño no válido'}))
})
export type SelectedProduct = z.infer<typeof SelectedProductSchema>

export const OrderItemSchema = SelectedProductSchema.extend({
    quantity: z.number().min(1, {message: 'Cantidad no válida'}),
    subtotal: z.number().min(1, {message: 'Cantidad no válida'}),
    key: z.optional(z.string().min(1, {message: 'Cantidad no válida'}))
})
export type OrderItem = z.infer<typeof OrderItemSchema>

export const OrderContentSchema = z.object({
        id: z.number(),
        title: z.string(),
        contents: z.string(),
        status: z.string(),
        total: z.number(),
        name: z.string()    
})
export type OrderContent = z.infer<typeof OrderContentSchema>

const SizesSchema = VariablePriceSchema.omit({variable_price: true})
export type Sizes = z.infer<typeof SizesSchema>

