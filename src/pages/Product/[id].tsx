import { stripe } from "@/lib/stripe"
import { ImageContainer, ProductContainer, ProductDetails } from "@/styles/pages/products"
import axios from "axios"

import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import Stripe from "stripe"
import { useShoppingCart } from "use-shopping-cart"

interface ProductProps {
    product: {
        id: string
        name: string
        imgUrl: string
        price: number
        description: string
        defaultPriceId: string
        sku: string
        currency: string
    }
}

export default function Product({ product }: ProductProps) {
    const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false);
   const router = useRouter()
    const { addItem, cartDetails } = useShoppingCart()

    function handleAddToCart() {
        addItem(
           product
       )
      //
      
       router.push('/');
       // console.log(cartDetails)
    }

    async function handleBuyProduct() {
        try {
            setIsCreatingCheckoutSession(true)
            const response = await axios.post('/api/checkout', {
                priceId: product.defaultPriceId,
            })

            const { checkoutUrl } = response.data

            //ex = Router.push('/checkout')
            window.location.href = checkoutUrl //aplicação interna assim

        } catch (err) {
            setIsCreatingCheckoutSession(false);
            alert('Falha ao redirecionar ao checkout')
        }
    }

    return (
        <ProductContainer>
            <ImageContainer>
                <Image src={product.imgUrl} width={520} height={450} alt="" />
            </ImageContainer>
            <ProductDetails>
                <h1>{product.name}</h1>
                <span>{product.price}</span>

                <p>{product.description}</p>

                <button disabled={isCreatingCheckoutSession} onClick={handleAddToCart}>
                    ADICIONAR AO CARRINHO
                </button>
            </ProductDetails>
        </ProductContainer>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            {
                params: { id: 'prod_QNrI61fCPdkhVy' }
            }
        ],
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
    const productId = params!.id;

    const product = await stripe.products.retrieve(productId, {
        expand: ['default_price'],
    })

    const price = product.default_price as Stripe.Price



    return {
        props: {
            product: {
                id: product.id,
                name: product.name,
                imgUrl: product.images[0],
                price: new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }).format(price.unit_amount === null ? 0 : price.unit_amount / 100),
                description: product.description,
                defaultPriceId: price.id,
                sku: product.id,
                currency: 'BRL'
            }
        },
        revalidate: 60 * 60 * 1,
    }
}