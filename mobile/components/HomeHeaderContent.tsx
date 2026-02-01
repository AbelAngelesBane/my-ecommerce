import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
const CATEGORIES = [
  {name:"All", icon:"grid-outline" as const},
  {name:"Electronics", image: require("../assets/images/electronics.png")},
  {name:"Fashion",  image: require("../assets/images/fashion.png")},
  {name:"Sports",  image: require("../assets/images/sports.png")},
  {name:"Books",  image: require("../assets/images/books.png")},
]
const HomeHeaderContent = ({items}:{items:number}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
 // Add your categories here

  return (
    <>
      {/* HEADER */}

    </>
  );
};

export default HomeHeaderContent;
