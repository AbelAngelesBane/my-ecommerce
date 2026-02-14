import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  RefreshControl,
  Platform,
} from "react-native";
import SafeScreen from "@/components/SafeScreen";
import { useProducts } from "@/hooks/useProduct";
import ProductsGrid from "@/components/ProductsGrid";
import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FlyingImage } from "@/components/FlyingObject";
import { useCartStore } from "@/store/userCartStore";
import { Product } from "@/types/types";
import NoProductFound from "@/components/NoProductFound";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import * as Sentry from '@sentry/react-native';


const CATEGORIES = [
  { name: "All", icon: "grid-outline" as const },
  { name: "Electronics", image: require("../../assets/images/electronics.png") },
  { name: "Fashion", image: require("../../assets/images/fashion.png") },
  { name: "Sports", image: require("../../assets/images/sports.png") },
  { name: "Books", image: require("../../assets/images/books.png") },
]
//TODO: Add sentry to payment
const PLATFORM = Platform.OS
const HomeScreen = () => {
  const { isSignedIn } = useAuth()
  const [animatingItem, setAnimatingItem] = useState<{ source: string, x: number, y: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  //(state) => state.addItem this callback is called Selector
  const addItem = useCartStore((state) => state.addItem);
  const [isRefreshing, setRefreshing] = useState(false);


  // Pass the limit to your hook so the queryKey updates automatically
  const { data,
    queryClient,
    fetchNextPage,
    hasNextPage, error, isFetching,
    isFetchingNextPage } = useProducts({ category: selectedCategory });

  const products = useMemo(() => data?.pages?.flatMap(page => page.products) ?? [], [data])
  //callback for ProductGrid button location
  const handleAddToCart = (image: string, x: number, y: number, product: Product) => {
    setAnimatingItem({ source: image, x, y });
    addItem(product);
  };

  //USE MEMO -> MEMORY.. WAIT DID THIS PRODUCT CHANGE? YES OR NO. USEMEMO REMEMBERS RATHER THAN REFETCH IF NO CHANGES
  const filteredProducts = useMemo(() => {


    if (!products) return []
    let filtered = products
    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    filtered = Array.from(new Map(filtered.map(p => [p._id, p])).values());
    return filtered
  }, [products, selectedCategory, searchQuery])

  const onRefresh = async () => {
    setRefreshing(true)
    //This refetches 3 pages
    // await queryClient.refetchQueries({queryKey:["products"]});
    //This RESETS page and starts back at page 1
    await queryClient.resetQueries({
      queryKey: ["products", selectedCategory],
      exact: false,
    });
    setRefreshing(false)
  }

  if (!isSignedIn) return <Redirect href={"/(auth)"} />

  return (
    <SafeScreen>
      {/* <HomeHeaderContent items={data?.items ?? 0} /> */}

      <View className='px-6 pb-4 pt-6'>
        <View className='flex-row items-center justify-between mb-6'>
          <View>
            <View className="flex-row">
              <Text className='text-text-primary text-3xl'>Laz</Text>
              <Text className='text-red-400 text-3xl'>Tech</Text>
            </View>


            <Text className='text-text-secondary text-sm'>Browse all products</Text>
          </View>

          <TouchableOpacity className='bg-surface/50 p-3 rounded-full' activeOpacity={0.1}>
            <Ionicons name='options-outline' size={22} color={"#ffff"} />
          </TouchableOpacity>
        </View>
        <View className='bg-surface flex-row items-center px-5 py-4 borderra rounded-full'>
          <Ionicons name='search' size={22} color={"#666"} />
          <TextInput
            className='flex-1 ml-3 text-base text-text-primary'
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder='Search products'
            placeholderTextColor={"#666"}></TextInput>
        </View>
      </View>

      {/* Category */}
      <View className='mb-6'>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, minWidth: '100%', justifyContent: 'space-evenly' }}>
          {CATEGORIES.map((item) => (
            <TouchableOpacity
              key={item.name}
              onPress={() => setSelectedCategory(item.name)}
              className={`rounded-md mx-2 items-center p-2 overflow-hidden ${selectedCategory === item.name && `bg-primary text-text-secondary`}`}>
              {'image' in item && item.image ? (
                <Image source={item.image} style={{ width: 32, height: 32, marginBottom: 4 }} />
              ) :
                <Ionicons color={""} name={item.icon} size={32} style={{ marginBottom: 4 }} />
              }
              <Text className='text-text-primary'>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className='px-6 mb-6'>
        <View className='flex-col justify-between mb-4'>
          <Text className='text-text-primary text-xl font-bold'>Products</Text>
          <Text className='text-text-secondary text-sm font-bold'>{filteredProducts.length ?? 0}</Text>
        </View>
      </View>
      <View className="flex-1">
        {isFetching && products.length === 0 && !isRefreshing ? (
          <ActivityIndicator size="large" className="mt-20" />
        ) : (
          <FlatList
            ListEmptyComponent={
              <NoProductFound />
            }
            data={filteredProducts}
            //Product grid returns the numbers (x,y) here and then passed to handleAddToCart
            renderItem={({ item }) => <ProductsGrid
              product={item}
              onPressPlus={(x: number, y: number, product: Product) => handleAddToCart(item.images[0], x, y, product)} />}
            keyExtractor={(item) => item._id}
            numColumns={2}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            refreshControl={
              <RefreshControl
                colors={["#45d7f5"]} // Android
                tintColor={"#45d7f5"}
                refreshing={isRefreshing}
                onRefresh={onRefresh}
              />
            }
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              isFetching ? <ActivityIndicator className="my-4" color={`${PLATFORM === "android" ? "[#45d7f5]" : "#45d7f5"}`} /> : null
            }
            contentContainerStyle={{
              paddingHorizontal: 16,

            }}
            columnWrapperStyle={{ justifyContent: "space-between" }}
          />
        )}
      </View>
      {animatingItem && (
        <FlyingImage
          uri={animatingItem.source}
          x={animatingItem.x}
          y={animatingItem.y}
          onComplete={() => setAnimatingItem(null)}
        />
      )}
    </SafeScreen>
  )
};

export default HomeScreen;
