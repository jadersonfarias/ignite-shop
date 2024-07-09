import {
    ContainerImage, 
    ContainerMiniItems, 
    PriceLabel, 
    RemoveButton, 
    TitlePriceAndRemoveContainer, 
    TitleProduct
} from "@/styles/components/cartPreview";
import Image from "next/image";
import { useShoppingCart } from "use-shopping-cart";

interface ItemMiniCartProps {
    id: string
    productImageURL: string 
    productName: string
    productPrice: number
}

export function ItemMiniCart({ productImageURL, productName, productPrice, id }: ItemMiniCartProps) {
    const { removeItem } = useShoppingCart()
console.log(productImageURL)

    return (
        <ContainerMiniItems>
            <ContainerImage>
                <Image src={productImageURL} width={101} height={93} alt='' />
            </ContainerImage>
            <TitlePriceAndRemoveContainer>
                <TitleProduct>
                    {productName}
                </TitleProduct>
                <PriceLabel>{productPrice}</PriceLabel>
                <RemoveButton
                    onClick={() => removeItem(id)}
                >Remover</RemoveButton>
            </TitlePriceAndRemoveContainer>
        </ContainerMiniItems>
    )
} 