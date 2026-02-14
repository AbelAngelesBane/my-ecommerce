import { useCartStore } from '@/store/userCartStore'
import { CartItem } from '@/types/types'
import { Ionicons } from '@expo/vector-icons'
import { View, Text, Image, TouchableOpacity } from 'react-native'

const ProductGridCart = ({ product, updateQuantity }: { product: CartItem, updateQuantity: Function }) => {
    const item = product.product
    const toggleSelectStore = useCartStore((state) => state.setSelecteditem)

    //Error to note here: On rapid fire the number that shows on the screen doesn't match the one saved in api because
    //Inititally what I did was double fetching: both product.quantity (from the store) and quantity (local state)/useState. This is "Double Fetching."
    const handleIncrement = () => {
        // We use product.quantity directly from the props/store
        const newQty = product.quantity + 1;
        updateQuantity(item._id, newQty);
    };

    const handleDecrement = () => {
        if (product.quantity <= 1) return;
        const newQty = product.quantity - 1;
        updateQuantity(item._id, newQty);
    };

    const handleSelectStatus = () => {
        console.log("isSelecvted: ", item.isSelected)
        toggleSelectStore(item)
    }

    return (
        <View className='flex-row bg-background-lighter p-2 justify-center items-center'>
            <View className='w-[7%] justify-center items-center '>
                {<TouchableOpacity className='' onPress={() => handleSelectStatus()}>
                    {<Ionicons
                        name={item.isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                        size={24}
                        color={item.isSelected ? "#45d7f5" : "#666666"}
                    />
                    }

                </TouchableOpacity>

                }

            </View>
            <View className='w-20%'>
                <Image className='size-32 rounded-lg' source={{ uri: item.images[0] }} />
            </View>
            <View className='justify-center flex-col w-[70%] gap-2 overflow-hidden'>
                <Text numberOfLines={2} className='text-text-primary mx-2'>{item.name}</Text>
                <View className='flex-row items-center mx-2'>
                    <Text numberOfLines={1} className='text-text-secondary font-bold w-[70%]'>{`$${item.price.toFixed(2)}`}</Text>
                    <View className='flex-row items-center  w-[30%]'>
                        <TouchableOpacity
                            disabled={product.quantity === 1}
                            onPress={() => {
                                handleDecrement()
                            }}>
                            <Ionicons name='remove-circle' size={32} color={product.quantity === 1 ? "#666666" : "#45d7f5"} />
                        </TouchableOpacity>
                        <Text className='text-text-primary'>{product.quantity}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                handleIncrement()
                            }}>
                            <Ionicons name='add-circle' size={32} color={"#45d7f5"} />
                        </TouchableOpacity>
                    </View>
                </View>

            </View>

        </View>
    )
}

export default ProductGridCart