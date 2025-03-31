import AddItemToCart from "./add-item-to-cart";

export default async function AddItemToCartPage({params}:{params:Promise<{itemId: string}>}){
    const {itemId} = await params;
    return(
        <AddItemToCart itemId={itemId} />
    )
}