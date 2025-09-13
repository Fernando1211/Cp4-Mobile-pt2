import { SafeAreaView } from "react-native-safe-area-context";
import { 
  Text, 
  Button, 
  TextInput, 
  StyleSheet, 
  ActivityIndicator, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform, 
  Alert 
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { deleteUser } from "firebase/auth";
import { auth, db, addDoc, collection, getDocs } from "../service/firebaseConfig";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { useTheme } from "../context/ThemeContext";
import * as Notifications from "expo-notifications";
import ListaTarefaPlus from "../components/ListaTarefaPlus";

// Handler das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,  // substitui shouldShowAlert
    shouldShowList: true,    // aparece na central de notificações
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen() {
  const { theme, colors } = useTheme();
  const router = useRouter();
  const [nomeProduto, setNomeProduto] = useState("");
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  interface Item {
    id: string;
    nomeProduto: string;
    isChecked: boolean;
  }
  const [listaItems, setListaItems] = useState<Item[]>([]);

  const realizarLogoff = async () => {
    await AsyncStorage.removeItem("@user");
    router.replace("/");
  };

  const excluirConta = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (user) {
                await deleteUser(user);
                await AsyncStorage.removeItem("@user");
                Alert.alert("Conta Excluída", "Sua conta foi excluída com sucesso.");
                router.replace("/");
              } else {
                Alert.alert("Error", "Nenhum usuário logado");
              }
            } catch (error) {
              console.log("Erro ao excluir conta", error);
              Alert.alert("Error", "Não foi possivel excluir a conta");
            }
          },
        },
      ]
    );
  };

  const salvarItem = async () => {
    try {
      await addDoc(collection(db, "items"), {
        nomeProduto: nomeProduto,
        isChecked: false,
      });
      setNomeProduto(""); // limpa o TextInput
      Alert.alert("Sucesso", "Produto Salvo com Sucesso.");
      buscarProdutos(); // ✅ atualiza lista após salvar
    } catch (e) {
      console.log("Erro ao criar o produto", e);
    }
  };

  // Buscar produtos do Firestore
  const buscarProdutos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "items"));
      const items: any[] = [];

      querySnapshot.forEach((doc) => {
        items.push({
          ...doc.data(),
          id: doc.id,
        });
      });

      setListaItems(items);
    } catch (e) {
      console.log("Erro ao carregar os items", e);
    }
  };

  // Buscar produtos só na montagem
  useEffect(() => {
    buscarProdutos();
  }, []);

  // Função para disparar a notificação local
  const dispararNotificacao = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Promoções do dia!",
        body: "Aproveite as melhores ofertas!!",
      },
      trigger: {
        type: "timeInterval",
        seconds: 2,
        repeats: false,
      } as Notifications.TimeIntervalTriggerInput,
    });
  };

  // Listener de notificações
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notificação recebida: ", notification);
      }
    );
    return () => subscription.remove();
  }, []);

  // Solicitar permissões de notificação
  useEffect(() => {
    (async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
    })();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20}
      >
        <Text style={[{ color: colors.text }]}>
          Seja bem-vindo, você está logado!!!
        </Text>
        <ThemeToggleButton />
        <Button title="Realizar logoff" onPress={realizarLogoff} />
        <Button title="Excluir" color="red" onPress={excluirConta} />
        <Button
          title="Disparar notificação"
          color="purple"
          onPress={dispararNotificacao}
        />

        {listaItems.length <= 0 ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={listaItems}
            renderItem={({ item }) => (
              <ListaTarefaPlus
                nomeProduto={item.nomeProduto}
                isChecked={item.isChecked}
                id={item.id}
              />
            )}
          />
        )}

        <TextInput
          placeholder="Digite o nome do produto"
          style={styles.input}
          value={nomeProduto}
          onChangeText={(value) => setNomeProduto(value)}
          onSubmitEditing={salvarItem}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    backgroundColor: "lightgray",
    width: "90%",
    alignSelf: "center",
    marginTop: "auto",
    borderRadius: 10,
    paddingLeft: 20,
  },
});
