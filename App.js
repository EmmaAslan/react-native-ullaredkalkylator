import React, { useEffect, useRef, useState } from "react";
// import {Inter-Regular} from "./react-native-config.js"
import {
  StyleSheet,
  StatusBar,
  Text,
  TextInput,
  SafeAreaView,
  Pressable,
  View,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import TrashIcon from "react-native-vector-icons/Octicons";
import EditIcon from "react-native-vector-icons/Feather";
import UpdateIcon from "react-native-vector-icons/Feather";

export default function App() {
  const [items, setItems] = useState([]);

  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [section, setSection] = useState("");
  const [totalSectionValue, setTotalSectionValue] = useState({});
  const [totalValue, setTotalValue] = useState({});
  const [updateMode, setUpdateMode] = useState(false);

  const quantityRef = useRef();
  const priceRef = useRef();
  const sectionRef = useRef();

  const sections = [
    { label: "Kroppsvård / Städ / Kosmetik", value: "hygienStadKosmetik" },
    { label: "Kläder / Väskor", value: "kladerVaskor" },
    { label: "Barnkläder", value: "barnKlader" },
    {
      label: "Friluft / Verktyg / Bilvård / Häst / Husdjur",
      value: "friluftVerktygBilDjur",
    },
    { label: "Baby / Leksaker", value: "babyLeksaker" },
    { label: "Skor / Jultorget", value: "skorJultorget" },
    { label: "Media / Hemelektronik", value: "mediaElektronik" },
    { label: "Sport", value: "sport" },
    { label: "Pyssel / Kontor", value: "pysselKontor" },
    { label: "Gröna rummet / Till hemmet", value: "vaxterTillHemmet" },
    { label: "Belysning / Hemtextil", value: "belysningTextil" },
    { label: "Livsmedel / Hälsokost", value: "livsmedelHalsokost" },
  ];

  const handleAddProduct = () => {
    if (
      product.length > 0 ||
      quantity.length > 0 ||
      price.length > 0 ||
      section.length > 0
    ) {
      setItems([
        ...items,
        {
          id: Date.now(),
          product: product,
          quantity: +quantity,
          price: +price,
          section: section,
          productTotal: quantity * price,
        },
      ]);
      setProduct("");
      setQuantity(0);
      setPrice(0);
      setSection("");
    }
  };

  useEffect(() => {
    let totalValue = items.reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = 0;
        console.log("item.section", item.section);
      }
      acc[item.section] += item.quantity * item.price;
      console.log("totalvalue-acc", acc);
      return acc;
    }, {});
    setTotalValue(totalValue);
  }, [items]);

  useEffect(() => {
    let totalSectionValue = items.reduce((acc, item) => {
      acc[item.section] += item.quantity * item.price;
      console.log("item", item);
      console.log("acc", acc);
      return acc;
    }, {});
    setTotalSectionValue(totalSectionValue);
  }, [items]);

  const handleButton = (id) => {
    setUpdateMode(!updateMode);
    /*  items.filter((item) => {
        if (item.id !== id) return false;
      }) */
  };

  const handleDelete = (id) => {
    setItems(
      items.filter((item) => {
        if (item.id !== id) return true;
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("./assets/gekas_logo.png")}
        style={styles.headingLogo}
      />

      <View style={styles.form}>
        <Text style={styles.formLabel}>Produkt</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="grey"
          value={product}
          onChangeText={(product) => setProduct(product)}
          placeholder={"Ex. Plastic bags"}
          returnKeyType="next"
          onSubmitEditing={() => {
            quantityRef.current.focus();
          }}
        />
        <Text style={styles.formLabel}>Antal</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="grey"
          value={quantity}
          onChangeText={(quantity) => setQuantity(quantity)}
          keyboardType="numeric"
          placeholder={"Ex. 3"}
          ref={quantityRef}
          returnKeyType="next"
          onSubmitEditing={() => {
            priceRef.current.focus();
          }}
        />
        <Text style={styles.formLabel}>Pris</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="grey"
          value={price}
          onChangeText={(price) => setPrice(price)}
          keyboardType="numeric"
          placeholder={"Ex. 45,78"}
          ref={priceRef}
          returnKeyType="next"
          /* onSubmitEditing={() => {
            sectionRef.current.focus();
          }} */
        />
        <Text style={styles.formLabel}>Avdelning</Text>
        <Dropdown
          ref={sectionRef}
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={{ color: "blue" }}
          data={sections}
          search
          maxHeight={325}
          value={section}
          onChange={(section) => setSection(section)}
          labelField="label"
          valueField="value"
          placeholder="Select section"
          searchPlaceholder="Search.."
        />
        <Pressable
          style={({ pressed }) => [
            {
              transform: [
                {
                  scale: pressed ? 1.07 : 1,
                },
              ],
            },
            !product || !quantity || !price || !section
              ? styles.disabledButton
              : styles.addButton,
          ]}
          onPress={() => handleAddProduct()}
          disabled={!product || !quantity || !price || !section}
        >
          <Text
            style={
              !product || !quantity || !price || !section
                ? styles.disabledButtonText
                : styles.addButtonText
            }
          >
            Add
          </Text>
        </Pressable>
      </View>

      <View>
        {Object.entries(totalValue).map(([section, value]) => (
          <View key={section}>
            <Text>Totalt: {value}</Text>
          </View>
        ))}
      </View>

      <ScrollView>
        {sections.map((section) => (
          <View key={section.value} style={{ paddingVertical: 5 }}>
            <Text style={styles.labelHeading}>{section.label}</Text>
            {items
              .filter((product) => product.section.value === section.value)
              .map((product) => (
                <View key={product.id} style={styles.productContainer}>
                  {updateMode ? (
                    <TextInput
                      style={styles.editInput}
                      placeholderTextColor="grey"
                      placeholder={product.product}
                    />
                  ) : (
                    <Text style={styles.product}>{product.product}</Text>
                  )}
                  {updateMode ? (
                    <TextInput
                      style={styles.editInput}
                      placeholderTextColor="grey"
                      placeholder={product.quantity}
                      keyboardType="numeric"
                    />
                  ) : (
                    <Text style={styles.product}>{product.quantity}st</Text>
                  )}
                  {updateMode ? (
                    <TextInput
                      style={styles.editInput}
                      placeholderTextColor="grey"
                      placeholder={product.price}
                      keyboardType="numeric"
                    />
                  ) : (
                    <Text style={styles.product}>{product.price}kr</Text>
                  )}
                  <Text style={styles.productTotal}>
                    {product.productTotal}kr
                  </Text>
                  <View style={styles.iconGroup}>
                    {updateMode ? (
                      <Pressable
                        style={styles.iconButton}
                        onPress={() => handleButton(product.id)}
                      >
                        <UpdateIcon name="check-square" size={20} />
                      </Pressable>
                    ) : (
                      <Pressable
                        style={styles.iconButton}
                        onPress={() => handleButton(product.id)}
                      >
                        <EditIcon name="edit" size={20} />
                      </Pressable>
                    )}
                    {updateMode ? (
                      <Pressable
                        style={styles.iconButton}
                        onPress={() => handleDelete(product.id)}
                      >
                        <UpdateIcon name="x-square" size={20} />
                      </Pressable>
                    ) : (
                      <Pressable
                        style={styles.iconButton}
                        onPress={() => handleDelete(product.id)}
                      >
                        <TrashIcon name="trash" size={20} />
                      </Pressable>
                    )}
                  </View>
                </View>
              ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    backgroundColor: "#fdfff0",
    justifyContent: "center",
    padding: 10,
    fontFamily: "Inter-Regular",
  },
  heading: {
    fontSize: 20,
    width: "100%",
    textAlign: "center",
    paddingBottom: 5,
    borderBottomWidth: 1,
    color: "#e4c503",
    textShadowColor: "#0057b8",
    textShadowRadius: 2,
    textShadowOffset: { width: 1, height: 1 },
  },
  headingLogo: {
    resizeMode: "center",
    height: 80,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  editForm: {
    flexDirection: "row",
  },
  formLabel: {
    paddingVertical: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "black",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 12,
  },
  editInput: {
    height: 30,
    borderColor: "black",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 3,
    marginHorizontal: 2,
    fontSize: 12,
    flex: 1,
  },
  dropdown: {
    height: 40,
    width: "100%",
    borderColor: "black",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 12,
  },
  placeholderStyle: {
    color: "grey",
    fontSize: 12,
  },
  selectedTextStyle: {
    fontSize: 12,
  },
  disabledButton: {
    margin: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: "gray",
    backgroundColor: "#e7e9dd",
  },
  addButton: {
    margin: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderWidth: 0.5,
    borderRadius: 8,
  },
  disabledButtonText: {
    paddingHorizontal: 10,
    color: "#bababa",
  },
  addButtonText: {
    paddingHorizontal: 10,
  },
  labelHeading: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productHeadings: {
    flexDirection: "row",
    width: "100%",
    paddingBottom: 5,
  },
  productContainer: {
    flexDirection: "row",
    width: "100%",
    paddingBottom: 6,
    marginBottom: 18,
    borderBottomColor: "black",
    borderBottomWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  product: {
    fontSize: 14,
    flex: 1,
  },
  productTotal: {
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
  },
  iconGroup: {
    paddingVertical: 6,
    flexDirection: "row",
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
});
