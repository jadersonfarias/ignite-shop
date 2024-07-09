import { CheckoutButton, ContainerCartPreview, ContainerProductsAndTitle, ContainerTotalAndCheckout, QuantityLabel, RowClosePreview, TitlePreviewCart, TotalValue } from "@/styles/components/cartPreview"
import { useShoppingCart } from "use-shopping-cart"
import { ItemMiniCart } from "./productItemMiniCart"
import { RiLogoutBoxRLine } from "react-icons/ri"
import { useState } from "react"
import axios from "axios"


interface CartPreviewProps {
    onClose: () => void
}


export const CartPreview = ({ onClose }: CartPreviewProps) => {
    const {
        cartDetails,
        clearCart, } = useShoppingCart()
        const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)
    const cartItems = Object.values(cartDetails ?? {}).map(item => ({ cartItem: item }))
   
    const totalPrice = cartItems.reduce((sum, item) => {
        const price = parseFloat(String(item.cartItem.price).replace(/[^\d.,]/g, '').replace(',', '.'));
        return sum + price;
    }, 0)

   

    async function handleBuyItems() {
        setIsCreatingCheckoutSession(true)

        try {
            const response = await axios.post('/api/checkout', {
                cartItems
            })

            const { checkoutUrl } = response.data

            window.location.href = checkoutUrl
        } catch (err) {
            setIsCreatingCheckoutSession(false)
            alert('falha ao redirecionar ao checkout!')
        }
        setIsCreatingCheckoutSession(false)
        clearCart()
    }
    return (
        <ContainerCartPreview>
            <ContainerProductsAndTitle>
                <RowClosePreview><button onClick={onClose}><RiLogoutBoxRLine size={26}/></button></RowClosePreview>
                <TitlePreviewCart>Sacola de compras</TitlePreviewCart>
                {cartItems.map((value) => {
                    const cartItem = value.cartItem
                    return (
                         <ItemMiniCart
                            key={cartItem.id}
                            id={cartItem.id}
                            productImageURL={cartItem.imgUrl}
                            productName={cartItem.name}
                            productPrice={cartItem.price}
                         />
                      
                    )
                   
                })}
            </ContainerProductsAndTitle>
            <ContainerTotalAndCheckout>
                <QuantityLabel>
                    <span>Quantidade</span>
                    <label>{cartItems.length} itens</label>
                </QuantityLabel>
                <TotalValue>
                    <span>Valor total</span>
                    <label>{totalPrice} R$</label>
                </TotalValue>
                <CheckoutButton
                 disabled={isCreatingCheckoutSession}
                 onClick={handleBuyItems}
                >
                    Finalizar compra
                </CheckoutButton>
            </ContainerTotalAndCheckout>
        </ContainerCartPreview>
    )
}